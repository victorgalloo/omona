#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Valida .env.production ANTES de desplegar: variables obligatorias,
# que la llave de IA funcione con el modelo elegido, y que Supabase responda.
# No imprime ningún secreto.
#
#   ./deploy/ec2/preflight.sh [ruta-al-env]     (default: .env.production)
# ──────────────────────────────────────────────────────────────
set -uo pipefail

ENV_FILE="${1:-.env.production}"
[ -f "$ENV_FILE" ] || { echo "✗ no existe $ENV_FILE"; exit 1; }

set -a; . "$ENV_FILE"; set +a
FAIL=0

echo "── Variables obligatorias ──"
for V in SUPABASE_URL SUPABASE_SERVICE_KEY AI_API_KEY API_DOMAIN ACME_EMAIL; do
  if [ -z "${!V:-}" ]; then echo "  ✗ $V vacía"; FAIL=1
  else echo "  ✓ $V definida"; fi
done

echo
echo "── Placeholders sin reemplazar ──"
if grep -vE "^\s*#" "$ENV_FILE" | grep -qE "TU-REF|TU-RECURSO|tu-api-key|PON-AQUI|eyJ\.\.\."; then
  grep -nE "TU-REF|TU-RECURSO|tu-api-key|PON-AQUI|eyJ\.\.\." "$ENV_FILE" | grep -v ":\s*#" | cut -d= -f1
  echo "  ✗ quedan valores de la plantilla"; FAIL=1
else
  echo "  ✓ ninguno"
fi

echo
echo "── Sanidad de formato ──"
# Supabase acepta dos formatos: el nuevo (sb_secret_...) y el heredado (JWT eyJ...).
case "$SUPABASE_SERVICE_KEY" in
  sb_secret_*)
    echo "  ✓ SUPABASE_SERVICE_KEY con formato nuevo (sb_secret_)" ;;
  sb_publishable_*)
    echo "  ✗ pegaste la llave PUBLISHABLE, no la secret — el server no tendría acceso privilegiado"; FAIL=1 ;;
  eyJ*)
    ROLE=$(printf '%s' "$SUPABASE_SERVICE_KEY" | cut -d. -f2 | python3 -c "
import sys,base64,json
s=sys.stdin.read().strip(); s+='='*(-len(s)%4)
print(json.loads(base64.urlsafe_b64decode(s)).get('role','?'))" 2>/dev/null)
    if [ "$ROLE" = "service_role" ]; then
      echo "  ✓ SUPABASE_SERVICE_KEY es service_role heredada (JWT)"
    elif [ "$ROLE" = "anon" ]; then
      echo "  ✗ pegaste la llave ANON, no la service_role"; FAIL=1
    else
      echo "  ✗ JWT sin claim 'role' reconocible (${ROLE:-nada})"; FAIL=1
    fi ;;
  *)
    echo "  ✗ SUPABASE_SERVICE_KEY con formato desconocido (${#SUPABASE_SERVICE_KEY} chars)"; FAIL=1 ;;
esac
case "$SUPABASE_URL" in
  https://TU-REF*) echo "  ✗ SUPABASE_URL sigue siendo el placeholder"; FAIL=1 ;;
  https://*.supabase.co) echo "  ✓ SUPABASE_URL con forma válida" ;;
  *) echo "  ✗ SUPABASE_URL no parece un proyecto de Supabase"; FAIL=1 ;;
esac

echo
echo "── API de IA: ${AI_MODEL:-?} en ${AI_BASE_URL:-?} ──"
AI_CODE=$(curl -s -o /tmp/.preflight_ai -w '%{http_code}' \
  -X POST "${AI_BASE_URL}/chat/completions" \
  -H "Authorization: Bearer ${AI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"${AI_MODEL}\",\"messages\":[{\"role\":\"user\",\"content\":\"di ok\"}],\"max_completion_tokens\":64}")
if [ "$AI_CODE" = "200" ]; then
  R=$(python3 -c "import json;d=json.load(open('/tmp/.preflight_ai'));c=d['choices'][0];print((c['message'].get('content') or '').strip()[:40] or '(vacía, finish=' + str(c.get('finish_reason')) + ')')" 2>/dev/null)
  echo "  ✓ HTTP 200 — respuesta: $R"
else
  echo "  ✗ HTTP $AI_CODE"
  python3 -c "import json;e=json.load(open('/tmp/.preflight_ai')).get('error',{});print('   ',e.get('code'),'—',e.get('message'))" 2>/dev/null || head -c 200 /tmp/.preflight_ai
  FAIL=1
fi
rm -f /tmp/.preflight_ai

echo
echo "── Supabase ──"
SB_CODE=$(curl -s -o /dev/null -w '%{http_code}' \
  "${SUPABASE_URL}/rest/v1/organizations?select=id&limit=1" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")
[ "$SB_CODE" = "200" ] && echo "  ✓ HTTP 200, service_key válida" || { echo "  ✗ HTTP $SB_CODE"; FAIL=1; }

echo
[ "$FAIL" = "0" ] && echo "✓ Listo para desplegar." || echo "✗ Corrige lo anterior antes de desplegar."
exit $FAIL
