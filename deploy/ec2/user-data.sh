#!/bin/bash
# ──────────────────────────────────────────────────────────────
# Omona — bootstrap de la instancia EC2 (Amazon Linux 2023).
# Se ejecuta UNA sola vez, en el primer arranque, como root.
# Deja la máquina lista; el código lo sube deploy.sh desde tu laptop.
# Log: /var/log/cloud-init-output.log
# ──────────────────────────────────────────────────────────────
set -euxo pipefail

dnf update -y
dnf install -y docker git rsync

# Docker Compose v2 como plugin del CLI (no viene en los repos de AL2023)
COMPOSE_VERSION="v2.32.4"
ARCH="$(uname -m)"   # aarch64 en Graviton, x86_64 en Intel/AMD
install -d /usr/libexec/docker/cli-plugins
curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-${ARCH}" \
  -o /usr/libexec/docker/cli-plugins/docker-compose
chmod +x /usr/libexec/docker/cli-plugins/docker-compose

systemctl enable --now docker
usermod -aG docker ec2-user

# Swap de 2 GB: `npm ci` + rebuild de better-sqlite3 se queda sin RAM en t4g.small
if [ ! -f /swapfile ]; then
  dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Rotación de logs de Docker (si no, los logs de Baileys llenan el disco)
cat > /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "3" }
}
JSON
systemctl restart docker

# Estructura: el código va en app/ (se reemplaza en cada deploy),
# el .env vive fuera para que rsync --delete no se lo lleve.
install -d -o ec2-user -g ec2-user /opt/omona/app

# Placeholder del .env — deploy.sh se niega a arrancar si sigue vacío
if [ ! -f /opt/omona/.env ]; then
  touch /opt/omona/.env
  chown ec2-user:ec2-user /opt/omona/.env
  chmod 600 /opt/omona/.env
fi

echo "bootstrap OK — $(date -Is)" > /opt/omona/.bootstrap-done
