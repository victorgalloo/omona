#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# Omona — provisiona la instancia EC2 que hospeda apps/server.
# Idempotente: reutiliza SG / rol / EIP si ya existen.
# Requiere credenciales AWS activas (aws sts get-caller-identity).
#
#   ./deploy/ec2/launch.sh
# ──────────────────────────────────────────────────────────────
set -euo pipefail

# Perfil de AWS. Por defecto el usuario IAM dedicado (omona-deploy), no tu root.
export AWS_PROFILE="${AWS_PROFILE:-omona}"

REGION="${REGION:-us-east-1}"
NAME="${NAME:-omona-server}"
INSTANCE_TYPE="${INSTANCE_TYPE:-t4g.small}"   # ARM Graviton. x86: t3.small (ver README)
VOLUME_GB="${VOLUME_GB:-20}"
KEY_NAME="${KEY_NAME:-omona-ec2}"
ARCH_PARAM="arm64"                            # cambiar a x86_64 si usas t3.*

cd "$(dirname "$0")"
aws() { command aws --region "$REGION" "$@"; }

echo "▸ Cuenta: $(aws sts get-caller-identity --query Arn --output text)"

# ── AMI: Amazon Linux 2023, resuelta por SSM (nunca hardcodear un ami-xxxx) ──
AMI_ID=$(aws ssm get-parameters \
  --names "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-${ARCH_PARAM}" \
  --query 'Parameters[0].Value' --output text)
echo "▸ AMI: $AMI_ID"

VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)
SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[0].SubnetId' --output text)
echo "▸ VPC/Subnet: $VPC_ID / $SUBNET_ID"

# ── Key pair SSH ──
if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
  aws ec2 create-key-pair --key-name "$KEY_NAME" \
    --query KeyMaterial --output text > ~/.ssh/"$KEY_NAME".pem
  chmod 400 ~/.ssh/"$KEY_NAME".pem
  echo "▸ Key pair creada: ~/.ssh/$KEY_NAME.pem  (única copia — respáldala)"
fi

# ── Security group ──
MY_IP=$(curl -fsS https://checkip.amazonaws.com)
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$NAME-sg" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")
if [ "$SG_ID" = "None" ] || [ -z "$SG_ID" ]; then
  SG_ID=$(aws ec2 create-security-group --group-name "$NAME-sg" \
    --description "Omona server: HTTP/HTTPS publico, SSH restringido" \
    --vpc-id "$VPC_ID" --query GroupId --output text)
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 80  --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0
fi
# SSH solo desde tu IP actual (re-ejecuta el script si tu IP cambia)
aws ec2 authorize-security-group-ingress --group-id "$SG_ID" \
  --protocol tcp --port 22 --cidr "${MY_IP}/32" 2>/dev/null || true
echo "▸ SG: $SG_ID (SSH abierto a ${MY_IP}/32)"

# ── IAM: rol con SSM Session Manager (acceso de emergencia sin depender del 22) ──
ROLE="$NAME-role"
if ! command aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  command aws iam create-role --role-name "$ROLE" --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]
  }' >/dev/null
  command aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
  command aws iam create-instance-profile --instance-profile-name "$ROLE" >/dev/null
  command aws iam add-role-to-instance-profile --instance-profile-name "$ROLE" --role-name "$ROLE"
  echo "▸ Rol IAM creado, esperando propagación…"
  sleep 15
fi

# ── Lanzamiento ──
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type "$INSTANCE_TYPE" \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --subnet-id "$SUBNET_ID" \
  --iam-instance-profile "Name=$ROLE" \
  --metadata-options "HttpTokens=required,HttpPutResponseHopLimit=2" \
  --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":$VOLUME_GB,\"VolumeType\":\"gp3\",\"Encrypted\":true,\"DeleteOnTermination\":true}}]" \
  --user-data file://user-data.sh \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$NAME},{Key=Project,Value=omona}]" \
  --query 'Instances[0].InstanceId' --output text)
echo "▸ Instancia: $INSTANCE_ID — esperando estado running…"
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"

# ── Elastic IP: IP fija para el registro DNS y el webhook de Meta ──
ALLOC_ID=$(aws ec2 describe-addresses --filters "Name=tag:Name,Values=$NAME-eip" \
  --query 'Addresses[0].AllocationId' --output text 2>/dev/null || echo "None")
if [ "$ALLOC_ID" = "None" ] || [ -z "$ALLOC_ID" ]; then
  ALLOC_ID=$(aws ec2 allocate-address --domain vpc \
    --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=$NAME-eip}]" \
    --query AllocationId --output text)
fi
aws ec2 associate-address --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC_ID" >/dev/null
EIP=$(aws ec2 describe-addresses --allocation-ids "$ALLOC_ID" --query 'Addresses[0].PublicIp' --output text)

cat <<SUMMARY

────────────────────────────────────────────
  Instancia   : $INSTANCE_ID ($INSTANCE_TYPE, $REGION)
  Elastic IP  : $EIP
  SSH         : ssh -i ~/.ssh/$KEY_NAME.pem ec2-user@$EIP

  SIGUIENTE:
   1. Crea el registro DNS  A  api.omona.tech → $EIP  y espera a que propague.
   2. Copia el .env:  scp -i ~/.ssh/$KEY_NAME.pem .env.production ec2-user@$EIP:/opt/omona/.env
   3. Despliega:      HOST=$EIP KEY=~/.ssh/$KEY_NAME.pem ./deploy/ec2/deploy.sh
────────────────────────────────────────────
SUMMARY
