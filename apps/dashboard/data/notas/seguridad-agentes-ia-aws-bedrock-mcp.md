---
title: "Seguridad para agentes de IA en producción: AWS Bedrock IAM, servidores MCP y defensa contra prompt injection"
description: "Checklist de arquitectura defensiva en 4 capas para blindar despliegues de agentes de IA: postura de dominio (HSTS, Content-Security-Policy, DNS CAA), mínimo privilegio en AWS Bedrock y Secrets Store, aislamiento OAuth en servidores MCP y contención de indirect prompt injection."
date: 2026-11-24
tags: Seguridad de Agentes IA, Amazon Bedrock, MCP, Prompt Injection
prs: NousResearch/hermes-agent#146546, strands-agents/harness-sdk#6468, victorgalloo/bedrock-agent-hierarchy#1
image: /blog/seguridad-agentes-ia-aws-bedrock-mcp/capas.svg
imageAlt: Cuatro capas defensivas para agentes de IA en producción: perímetro de dominio, permisos IAM en AWS Bedrock, servidores MCP con OAuth aislado y guardrails contra prompt injection indirecto.
---

# Seguridad para agentes de IA en producción: AWS Bedrock IAM, servidores MCP y defensa contra prompt injection

**En corto:** la mayoría de las brechas en despliegues empresariales de agentes de IA no ocurren por fallas criptográficas del modelo, sino por cuatro errores de arquitectura: credenciales estáticas sobreprivilegiadas en **AWS Bedrock**, servidores **Model Context Protocol (MCP)** que comparten tokens OAuth entre perfiles o sufren *tool poisoning*, **indirect prompt injection** al leer correos, PDFs o páginas web no confiables sin separar datos de instrucciones, y un perímetro web sin cabeceras `Content-Security-Policy` ni registros `DNS CAA` o `DMARC`. En esta guía documentamos los controles deterministas que aplicamos en [Omona](/seguridad) y que puedes empezar a medir hoy en el [diagnóstico pasivo de dominio](/#diagnostico).

![Arquitectura defensiva de 4 capas para agentes de IA en producción](/blog/seguridad-agentes-ia-aws-bedrock-mcp/capas.svg)

## 1. Perímetro público y postura de dominio (0 tráfico intrusivo)

Antes de conectar un agente conversacional o un gateway de webhooks a producción, el dominio que aloja el frontend, los callbacks de OAuth y las rutas de API debe cerrar los vectores clásicos de suplantación e inyección en cliente. En el escáner pasivo de [`omona.tech/#diagnostico`](/#diagnostico) verificamos 9 controles en menos de dos segundos:

| Control | Qué previene en despliegues de IA | Configuración mínima recomendada |
|---|---|---|
| `Strict-Transport-Security` | Degradación TLS e interceptación de tokens de sesión o webhooks | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | Ejecución de scripts inyectados (XSS) cuando el chat renderiza Markdown o HTML | Definir `default-src 'self'`, `frame-ancestors 'none'` y restringir `connect-src` |
| `X-Frame-Options` + `X-Content-Type-Options` | Clickjacking sobre paneles de autorización OAuth y *MIME-sniffing* | `DENY` (o `SAMEORIGIN`) y `nosniff` |
| `Referrer-Policy` + `Permissions-Policy` | Fuga de tokens en URLs de referencia y acceso a micrófono/cámara no autorizado | `strict-origin-when-cross-origin` y bloqueo explícito de sensores |
| `SPF` + `DMARC` + `DNS CAA` | Suplantación de correos transaccionales del agente y emisión no autorizada de certificados TLS | `v=DMARC1; p=quarantine;` (o `reject`) y `0 issue "letsencrypt.org"` |
| `/.well-known/security.txt` y `/llms.txt` | Falta de canal oficial de divulgación (RFC 9116) y alucinaciones de agentes externos sobre tu entidad | Contacto verificable de seguridad y mapa canónico de rutas |

Al correr nuestro propio diagnóstico pasivo sobre `omona.tech` el 24 de noviembre de 2026, detectamos que aunque HSTS (`max-age=63072000`), SPF, DMARC (`p=quarantine`), `security.txt` y `llms.txt` estaban en orden, faltaba declarar políticas explícitas de `Content-Security-Policy` y registros `DNS CAA` en la zona raíz. Medir el perímetro con reglas deterministas evita depender de suposiciones antes de pasar a la capa de nube.

## 2. Mínimo privilegio en AWS Bedrock, STS y bóveda de secretos (`Secrets Store`)

Cuando un agente pasa de un prototipo local a un servidor en producción con rutinas programadas y múltiples perfiles, las llaves estáticas en archivos `.env` se convierten en el riesgo principal:

1. **Choque y contaminación de credenciales entre perfiles:** Como documentamos en el reporte [NousResearch/hermes-agent#146546](https://github.com/NousResearch/hermes-agent/issues/146546), cuando un proceso de larga duración mezcla variables globales de entorno (`AWS_BEARER_TOKEN_BEDROCK`) con perfiles de IAM (`AWS_PROFILE`), los clientes auxiliares (compactación de contexto, visión o subagentes) pueden heredar la credencial equivocada o abortar el turno a mitad de ejecución. Cada perfil debe resolver su autenticación de forma aislada sin mutar `os.environ`.
2. **Políticas IAM acotadas a `bedrock:InvokeModel` y `bedrock:InvokeModelWithResponseStream`:** El usuario o rol de ejecución del agente nunca debe tener permisos de administración (`iam:*`, `s3:*` global o `*`). En nuestro kit de auditoría verificamos que el perfil de ejecución responda `AccessDenied` ante cualquier intento de enumerar o crear roles IAM, limitando sus recursos a los ARNs exactos de los foundation models e inference profiles autorizados.
3. **Bóveda de secretos (`Secrets Store`) en lugar de archivos `.env`:** Las llaves de terceros, secretos de firma HMAC de webhooks y tokens de API deben inyectarse desde un almacén administrado (como Cloudflare Secrets Store o AWS Secrets Manager) y destruirse en disco con borrado seguro (`shred -u`) si alguna vez aterrizan en archivos temporales durante una migración.

## 3. Seguridad en servidores MCP (`Model Context Protocol`) y aislamiento OAuth

El ecosistema **Model Context Protocol (MCP)** permite conectar agentes a bases de datos, repositorios, herramientas de SEO y mensajería, pero introduce tres vectores críticos que revisamos en cada auditoría de código:

- **Aislamiento de tokens OAuth por perfil (`mcp-tokens`):** Si un mismo servidor ejecuta agentes de distintas unidades de negocio o clientes, los tokens OAuth de cada servidor MCP deben almacenarse en directorios separados por perfil (`$HERMES_HOME/mcp-tokens/<servidor>.json`) con permisos `0600`. Compartir un mismo token de MCP entre contextos distintos expone datos cruzados entre proyectos.
- **Prevención de *tool poisoning* e inyección de argumentos:** Las descripciones de herramientas MCP y las respuestas devueltas por servidores externos son **datos no confiables**. Si un servidor MCP construye comandos de shell o consultas SQL concatenando cadenas sin escapar, un documento externo puede forzar la ejecución de comandos arbitrarios.
- **Compuertas de aprobación para acciones con efectos externos:** Como aplicamos en [`victorgalloo/bedrock-agent-hierarchy`](https://github.com/victorgalloo/bedrock-agent-hierarchy) y en la validación de esquemas de [`strands-agents/harness-sdk#6468`](https://github.com/strands-agents/harness-sdk/pull/6468), las herramientas de lectura pueden correr en paralelo, pero cualquier herramienta que envíe mensajes externos, modifique infraestructura o firme contratos debe exigir confirmación humana explícita o validación determinista fuera del LLM.

## 4. Defensa contra *indirect prompt injection*, exfiltración en RAG y deriva de agentes

Cuando un agente lee correos entrantes, issues de GitHub, documentos PDF o páginas web (RAG), cualquier texto externo puede incluir instrucciones ocultas diseñadas para secuestrar el flujo del agente (*indirect prompt injection*) o exfiltrar secretos a través de URLs e imágenes Markdown:

1. **Envoltura explícita de contenido externo no confiable:** Todo resultado proveniente de herramientas web, correo o MCP debe etiquetarse como bloque de datos no confiable, instruyendo al modelo a ignorar directivas, cambios de rol o invocaciones de herramientas contenidas dentro de ese bloque.
2. **Guardrails deterministas antes de llamadas salientes:** No basta con pedirle al LLM en el prompt que «no filtre secretos». Un filtro determinista en código debe bloquear cualquier salida o petición HTTP hacia dominios no autorizados y redactar patrones de llaves (`live_`, `whsec_`, `AKIA`, `ghp_`) antes de que salgan al canal de respuesta.
3. **Comparador formal con huella SHA-256 para evitar auto-engaño en agentes autónomos:** Inspirados en la arquitectura de descubrimiento verificado de Google DeepMind ([arXiv:2611.09822](https://arxiv.org/abs/2611.09822)), cuando un agente autónomo optimiza prompts o configuraciones, los criterios de evaluación y los casos de prueba deben permanecer congelados y verificados con hashes `SHA-256` fuera del alcance de escritura del agente. Si el hash cambia, el despliegue se bloquea.

## Cómo evaluar tu arquitectura hoy

- **Paso 1 (en vivo, sin costo ni registro):** Ejecuta el [diagnóstico pasivo de superficie y arquitectura](/#diagnostico) sobre tu dominio para obtener en segundos tu scorecard `0–100` y descargar el entregable técnico en Markdown (`.md`).
- **Paso 2 (auditoría defensiva bajo alcance firmado):** Si operas agentes sobre AWS Bedrock, servidores MCP o pipelines RAG en producción y necesitas auditar tus políticas IAM, bóveda de secretos, repositorios y resistencia a *prompt injection* con autorización escrita, [consulta nuestro alcance en `/seguridad`](/seguridad) o agenda directamente una llamada de alcance en [`victor@omona.tech`](mailto:victor@omona.tech?subject=Revisi%C3%B3n%20de%20seguridad%20AWS%20Bedrock%20y%20MCP%20%E2%80%94%20Omona).
