# Omona server en EC2

Migración de `apps/server` (Hono + Baileys) desde Railway a una instancia EC2.
El dashboard sigue en Vercel; sólo cambia a dónde apunta `NEXT_PUBLIC_API_URL`.

## Por qué UNA sola instancia

No pongas esto detrás de un Auto Scaling Group ni de un ALB con varios targets.

- `activeSockets` es un `Map` en memoria del proceso (`whatsapp/session-manager.ts:51`).
- Al arrancar, `reconnectActiveSessions()` reconecta **todas** las sesiones con
  estado `connected`/`connecting` (`index.ts:22`).

Con dos instancias, ambas reconectarían la misma sesión de WhatsApp y el
servidor de Meta cerraría una de las dos en bucle. Además los `setInterval` de
follow-ups y recordatorios (`index.ts:80-86`) se dispararían por duplicado:
mensajes repetidos a los clientes.

Escalar aquí es **vertical** (subir de `t4g.small` a `t4g.medium`), no horizontal.

## Por qué no hace falta EBS persistente

Las credenciales de Baileys se guardan en la tabla `whatsapp_sessions` de
Supabase (`whatsapp/supabase-auth-state.ts`), no en disco. El directorio
`auth_sessions` se crea pero ya no almacena estado. La instancia es reemplazable:
si la terminas y lanzas otra, las sesiones de WhatsApp se re-pare an solas.

Lo único que **sí** debe persistir es el volumen `caddy_data` (certificados TLS),
y vive en el disco raíz de la instancia.

---

## Despliegue inicial

### 1. Credenciales AWS

```bash
aws configure sso   # o aws configure
aws sts get-caller-identity
```

### 2. Lanzar la instancia

```bash
./deploy/ec2/launch.sh
```

Crea, de forma idempotente: key pair, security group (80/443 público, 22 sólo
desde tu IP), rol IAM con SSM Session Manager, la instancia con IMDSv2 obligatorio
y disco cifrado, y una Elastic IP asociada. Imprime la IP al terminar.

Variables para ajustar sin editar el script:

```bash
REGION=us-east-2 INSTANCE_TYPE=t4g.medium ./deploy/ec2/launch.sh
```

### 3. DNS — antes de desplegar

Crea el registro `A` de `api.omona.tech` apuntando a la Elastic IP y espera a que
propague (`dig +short api.omona.tech`). Caddy pide el certificado por desafío
HTTP-01; si el DNS todavía no resuelve, Let's Encrypt falla y entra en backoff.

### 4. Variables de entorno

```bash
cp deploy/ec2/env.production.example .env.production
# rellenar los valores reales (los mismos de Railway + API_DOMAIN y ACME_EMAIL)
scp -i ~/.ssh/omona-ec2.pem .env.production ec2-user@<EIP>:/opt/omona/.env
ssh -i ~/.ssh/omona-ec2.pem ec2-user@<EIP> 'chmod 600 /opt/omona/.env'
```

`.env.production` es local y no debe commitearse.

### 5. Desplegar

```bash
HOST=<EIP> KEY=~/.ssh/omona-ec2.pem ./deploy/ec2/deploy.sh
```

Sube el repo por rsync, reconstruye con `docker compose --build` y espera a que
`/health` responda. El primer build tarda ~5 min (`npm ci` + rebuild de
`better-sqlite3` desde fuente).

Verifica desde fuera:

```bash
curl https://api.omona.tech/health
```

---

## Superficie pública

Rutas que quedan expuestas por Caddy (verificadas en local contra el stack completo):

| Ruta | Auth | Quién la llama |
|---|---|---|
| `GET /health` | no | Caddy, monitoreo |
| `GET /widget/omona-widget.js` | no | sitios web de clientes |
| `GET|POST /webhooks/cloud-api` | firma de Meta | Meta Cloud API |
| `POST /auth/signup`, `POST /auth/reset-password` | no | dashboard |
| `POST /api/test/demo` | no | página `/demo` |
| `/api/*` | JWT de Supabase | dashboard |

Nota: el CORS de `index.ts:31` refleja **cualquier** origen (`origin || '*'`).
El comentario "(for CORS)" junto a `DASHBOARD_URL` en `config.ts:26` es engañoso:
esa variable sólo se usa para construir enlaces dentro de correos
(`auth-hooks.ts`, `team.ts`, `notifications.ts`). Si la dejas mal, los correos de
invitación y de handoff apuntan a un dashboard equivocado. Es comportamiento
idéntico al de Railway — no es un bloqueo para migrar, pero conviene saberlo al
poner la caja en una IP pública.

---

## Corte desde Railway

Hazlo en este orden, con el server de EC2 ya respondiendo en HTTPS:

1. **Vercel** — `NEXT_PUBLIC_API_URL=https://api.omona.tech` y redeploy del dashboard.
   Cubre todo `/api/*` y `/auth/*`: el código no tiene ninguna URL hardcodeada
   (`lib/api.ts:3`, `hooks/useAuth.ts:8`).
2. **Meta App Dashboard** — webhook de Cloud API →
   `https://api.omona.tech/webhooks/cloud-api`. El `WHATSAPP_VERIFY_TOKEN` no cambia.
   Comprueba el handshake antes de guardar:
   ```bash
   curl "https://api.omona.tech/webhooks/cloud-api?hub.mode=subscribe&hub.verify_token=$TOKEN&hub.challenge=ok123"
   # debe imprimir: ok123
   ```
3. **Widget embebido — el punto que rompe en silencio.** El script se auto-ubica
   con `document.currentScript.src` (`api/widget.ts:14`), pero los sitios de tus
   clientes ya tienen el host **viejo** escrito en su HTML. Al apagar Railway, esos
   widgets dejan de cargar y nadie te avisa. Opciones, de menor a mayor esfuerzo:
   deja el servicio de Railway encendido sólo como redirección 301 hacia
   `api.omona.tech`; o pon un CNAME del host viejo; o actualiza los embeds uno por uno.
   Decide esto **antes** de apagar nada.
4. **Baileys** — reconecta solo al arrancar (`index.ts:22`). Verifica en el
   dashboard que las sesiones vuelvan a `connected`.
5. Apaga Railway sólo cuando 1–4 estén confirmados. Mientras ambos corran, los dos
   procesos pelearán por la misma sesión de WhatsApp: que el solape sea de minutos.

No hay nada que cambiar en Supabase. `SUPABASE_HOOK_SECRET` está declarada en
`config.ts:32` pero no se lee en ninguna parte del código — no existe un endpoint
de Auth Hook `send_email`. Los correos salen por Resend desde `/auth/signup` y
`/auth/reset-password`, que el dashboard llama directo.

---

## Operación

```bash
ssh -i ~/.ssh/omona-ec2.pem ec2-user@<EIP>

# logs en vivo
docker logs -f omona-server
docker logs -f omona-caddy          # errores de certificado aparecen aquí

# estado
docker compose -f /opt/omona/app/deploy/ec2/docker-compose.yml ps

# reinicio sin rebuild
docker compose -f /opt/omona/app/deploy/ec2/docker-compose.yml restart server
```

Redespliegue tras cambios en el código: vuelve a correr `deploy.sh`.

Acceso de emergencia si tu IP cambió y el puerto 22 quedó cerrado:

```bash
aws ssm start-session --target <instance-id>
```

Para reabrir SSH desde tu IP nueva, basta con re-ejecutar `launch.sh` (es idempotente:
detecta la instancia existente, sólo añade la regla).

---

## Costo mensual estimado (us-east-1, on-demand)

| Concepto | Aprox. USD |
|---|---|
| `t4g.small` (2 vCPU ARM, 2 GB) 24/7 | ~12.30 |
| EBS gp3 20 GB | ~1.60 |
| Elastic IP asociada a instancia activa | 0.00 |
| Transferencia de salida (~10 GB) | ~0.90 |
| **Total** | **~15 / mes** |

Con Savings Plan de 1 año la instancia baja a ~7.70 (≈ 40 %).

Una Elastic IP **sin asociar** cuesta ~3.60/mes — si terminas la instancia, libera
también la IP (`aws ec2 release-address`).

### ARM vs x86

`t4g.*` (Graviton) es ~20 % más barato y las dependencias del server son JS puro,
salvo `better-sqlite3` — que el Dockerfile ya compila desde fuente y que, según
`CLAUDE.md`, no se usa en el código de la app. Si aun así aparece un problema de
módulo nativo, cambia a x86 sin tocar nada más:

```bash
INSTANCE_TYPE=t3.small ./deploy/ec2/launch.sh   # y ARCH_PARAM=x86_64 en launch.sh
```

---

## Lo que esta configuración NO tiene

Decisiones deliberadas para no sobre-construir; súbelas cuando el tráfico lo pida:

- **Sin backups de la instancia.** El estado vive en Supabase; la máquina es
  reemplazable. Lo único no reproducible es `/opt/omona/.env` — guárdalo en tu
  gestor de contraseñas.
- **Sin alta disponibilidad.** Una sola AZ. Caída de la AZ = caída del bot.
  La restricción es arquitectónica (ver arriba), no de presupuesto.
- **Sin CI/CD.** El deploy es manual desde tu laptop. Para automatizarlo, un
  workflow de GitHub Actions con rol OIDC que ejecute `deploy.sh`.
- **Sin métricas ni alertas.** Considera una alarma de CloudWatch sobre
  `StatusCheckFailed` y un monitor externo contra `/health`.
- **Secretos en un archivo plano.** Migrar a SSM Parameter Store (SecureString)
  cuando haya más de una persona operando la máquina.
