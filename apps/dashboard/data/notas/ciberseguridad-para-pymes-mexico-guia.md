---
title: Ciberseguridad para PyMEs en México: guía base
description: Por dónde empezar en ciberseguridad para PyMEs en México: cómo saber si tu página web es segura, blindar el correo empresarial, ordenar accesos y usar IA.
date: 2026-11-24
tags: Ciberseguridad para PyMEs, Seguridad Informática, Correo Empresarial, IA
prs: NousResearch/hermes-agent#146546, victorgalloo/bedrock-agent-hierarchy#1
image: /blog/ciberseguridad-para-pymes-mexico-guia/escalera.svg
imageAlt: Escalera de ciberseguridad para PyMEs en México en 4 etapas: correo y dominio, página web, control de acceso en la nube, e inteligencia artificial segura.
---

# Ciberseguridad para PyMEs en México: por dónde empezar (de lo básico a la IA)

**En corto:** una PyME en México no necesita empezar comprando herramientas complejas de millones de pesos; necesita cerrar primero las tres puertas por donde entran el 90 % de los fraudes y robos de información: **la suplantación de su correo empresarial** (facturas o cambios de CLABE falsos enviados a nombre de tu dominio), **las páginas web con archivos o formularios desprotegidos**, y **las contraseñas o accesos compartidos de exempleados y proveedores**. Una vez que esos tres cimientos están en orden, tu empresa puede dar el cuarto paso —conectar chatbots de WhatsApp y agentes de inteligencia artificial— sin arriesgar la base de datos de tus clientes. Puedes revisar gratis los dos primeros niveles hoy mismo en el [diagnóstico en vivo de Omona](/#diagnostico).

![Escalera de ciberseguridad para PyMEs en México: de correo y página web a nube e IA](/blog/ciberseguridad-para-pymes-mexico-guia/escalera.svg)

## Etapa 1: Evitar que falsifiquen el correo de tu empresa (Día 1)

El ataque más común y costoso contra comercializadoras, colegios, despachos y empresas de servicios en México es el fraude al pago a proveedores: alguien envía un correo idéntico al de tu empresa (`cobranza@tuempresa.com`) avisando un «cambio de cuenta bancaria CLABE».

Si tu dominio no tiene configurados tres registros públicos en su DNS, cualquier servidor en internet puede enviar correos usando tu nombre sin necesitar tu contraseña:

| Candado de dominio | Qué hace en lenguaje claro | Qué debe configurar tu encargado de sistemas |
|---|---|---|
| **SPF (`Sender Policy Framework`)** | Lista oficial de qué servidores (Google Workspace, Microsoft 365, etc.) tienen permiso de enviar correos a nombre de tu empresa | Un solo registro TXT con `v=spf1` terminado en `~all` o `-all` |
| **DMARC (`Domain-based Message Authentication`)** | Instruye a Gmail, Outlook y bancos a mandar a cuarentena o rechazar cualquier correo que intente falsificar tu dominio | Registro TXT en `_dmarc.tuempresa.com` con `v=DMARC1; p=quarantine;` o `p=reject;` |
| **DNS CAA (`Certification Authority Authorization`)** | Impide que autoridades desconocidas emitan certificados de seguridad (`HTTPS`) falsos para tu dominio | Registro CAA autorizando solo a tu emisor (ej. `0 issue "letsencrypt.org"`) |

## Etapa 2: Cómo saber si tu página web es segura (Semana 1)

Tener el «candadito» de `HTTPS` en el navegador solo cifra la conexión en tránsito, pero no impide que tu sitio exponga archivos de configuración ni que un tercero inyecte código en tus formularios de contacto o cobro.

Para comprobar **cómo saber si una página web es segura** en una auditoría informática de sistemas básica, revisamos cinco puntos que puedes verificar sin costo en [`omona.tech/#diagnostico`](/#diagnostico):

1. **Bloqueo de archivos internos (`/.env` y `/.git`):** Muchos sitios desarrollados por agencias externas dejan por descuido en la carpeta pública el archivo `.env` (donde vienen las contraseñas de la base de datos, llaves de pasarelas de pago o tokens de envío de correo) o el historial `.git`. Ambos deben responder `404` o `403`.
2. **Forzar conexión segura permanente (`HSTS`):** La cabecera `Strict-Transport-Security` evita que un cliente conectado desde el Wi-Fi de un café o aeropuerto sea redirigido a una versión sin cifrar de tu sitio.
3. **Política contra inyección de scripts (`Content-Security-Policy`):** Impide que scripts externos no autorizados lean lo que tus clientes escriben en tus formularios.
4. **Protección contra ventanas falsas (`X-Frame-Options`):** Evita que otra página web incruste la tuya dentro de un recuadro invisible para robar clics (*clickjacking*).
5. **Canal oficial de seguridad (`/.well-known/security.txt`):** Permite que si un investigador o proveedor detecta un problema en tu sitio, sepa exactamente a qué correo reportarlo de forma privada.

En nuestra [medición de 304 sitios .mx](/blog/cabeceras-seguridad-web-pymes-mexico) (25-nov-2026), el 60 % no tiene HSTS y el 71 % no tiene `Content-Security-Policy`; ahí viene cómo configurarlas en Apache, Nginx, Cloudflare o Vercel.

## Etapa 3: Control de acceso en ciberseguridad y nube (Mes 1)

Conforme la empresa crece de 5 a 50 o 200 personas, el riesgo pasa de la página web a las cuentas internas (CRM, facturación, bancos, Google Drive, AWS o servidores):

- **Regla de mínimo privilegio:** Cada persona y cada sistema conectado debe tener acceso únicamente a lo que necesita para trabajar hoy, no permisos de «Administrador Total».
- **Protocolo de bajas en 15 minutos:** Una lista única de sistemas para que, cuando un colaborador o agencia externa termina su relación con la empresa, sus accesos queden revocados el mismo día.
- **Cero contraseñas en hojas de cálculo o código:** Las llaves de conexión entre sistemas se guardan en una bóveda administrada (*Secrets Store*), y todas las cuentas de correo y nube llevan verificación en dos pasos (`MFA`) obligatoria.

## Etapa 4: Adoptar Inteligencia Artificial y bots de WhatsApp sin filtrar datos

Cada vez más PyMEs en México están conectando chatbots de WhatsApp o asistentes con IA a su CRM, catálogo de precios o calendario de citas. Hacerlo bien multiplica las ventas; hacerlo sin candados abre tres riesgos nuevos que resolvemos en nuestras [revisiones de seguridad](/seguridad):

1. **Que el bot no regale ni filtre tu base de datos:** El asistente de IA nunca debe tener una llave con permiso de leer o borrar toda la base de datos de clientes; solo puede consultar la ficha del cliente con el que está hablando en ese momento.
2. **Que nadie pueda «engañar» al asistente (*prompt injection*):** Antes de salir a producción, probamos tu asistente con baterías de mensajes diseñados para intentar sacarle información interna, cambiar precios o ejecutar órdenes no autorizadas.
3. **Controlar cómo aparece tu empresa en ChatGPT y Google AI (`/llms.txt`):** Publicar un archivo `/llms.txt` limpio y verificable ayuda a que los buscadores de IA recomienden tu negocio con datos reales y sin inventar servicios o precios que no ofreces.

## Haz el diagnóstico gratuito de tu dominio hoy

1. **Revisión en 2 segundos (sin costo):** Entra a [`omona.tech/#diagnostico`](/#diagnostico), escribe el dominio de tu empresa y descarga el reporte en texto claro con el estado actual de tu correo empresarial y tu página web.
2. **Acompañamiento paso a paso:** Si el diagnóstico marca brechas o quieres que revisemos los accesos de tu equipo, tu nube o tus primeros agentes de IA bajo contrato y alcance firmado, escríbenos a [`victor@omona.tech`](mailto:victor@omona.tech?subject=Diagn%C3%B3stico%20de%20ciberseguridad%20para%20mi%20PyME%20%E2%80%94%20Omona) o revisa cómo trabajamos en [`/seguridad`](/seguridad).
