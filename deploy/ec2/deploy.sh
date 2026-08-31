#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Omona — despliega el código a la instancia EC2 y reconstruye.
# Sube el repo por rsync (sin git creds en la máquina) y rearma con compose.
#
#   HOST=<elastic-ip> KEY=~/.ssh/omona-ec2.pem ./deploy/ec2/deploy.sh
# ──────────────────────────────────────────────────────────────
set -euo pipefail

HOST="${HOST:?falta HOST=<ip o dominio de la instancia>}"
KEY="${KEY:-$HOME/.ssh/omona-ec2.pem}"
USER="${USER_REMOTE:-ec2-user}"
REMOTE="/opt/omona/app"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$USER@$HOST")

echo "▸ Verificando que el bootstrap terminó…"
"${SSH[@]}" 'test -f /opt/omona/.bootstrap-done' \
  || { echo "✗ user-data aún no termina. Revisa: sudo tail -f /var/log/cloud-init-output.log"; exit 1; }

echo "▸ Verificando /opt/omona/.env…"
"${SSH[@]}" 'grep -q SUPABASE_SERVICE_KEY /opt/omona/.env' \
  || { echo "✗ /opt/omona/.env vacío o incompleto. Cópialo primero (ver README)."; exit 1; }

echo "▸ Sincronizando código → $USER@$HOST:$REMOTE"
rsync -az --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.turbo' \
  --exclude '.next' --exclude 'auth_sessions' --exclude '.env*' \
  --exclude 'apps/dashboard' \
  -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new" \
  "$ROOT/" "$USER@$HOST:$REMOTE/"

echo "▸ Reconstruyendo contenedores…"
"${SSH[@]}" "docker compose -f $REMOTE/deploy/ec2/docker-compose.yml up -d --build --remove-orphans"
"${SSH[@]}" 'docker image prune -f' >/dev/null

echo "▸ Esperando /health…"
for i in $(seq 1 30); do
  if "${SSH[@]}" 'curl -fsS http://127.0.0.1:8080/health' >/dev/null 2>&1 \
     || "${SSH[@]}" 'docker exec omona-server node -e "fetch(\"http://127.0.0.1:8080/health\").then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"' 2>/dev/null; then
    echo "✓ Server saludable."
    "${SSH[@]}" 'docker compose -f /opt/omona/app/deploy/ec2/docker-compose.yml ps'
    exit 0
  fi
  sleep 5
done

echo "✗ El server no respondió a /health en 150s. Logs:"
"${SSH[@]}" 'docker logs --tail 80 omona-server'
exit 1
