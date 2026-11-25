---
title: DMARC y SPF para PyMEs: frena facturas falsas
description: Medimos 285 dominios .mx con correo: el 66 % se puede suplantar. Cómo configurar SPF y DMARC en tu PyME paso a paso, de p=none a p=reject.
date: 2026-11-25
tags: Ciberseguridad para PyMEs, DMARC, SPF, Correo Empresarial, Fraude
prs:
image: /blog/dmarc-spf-facturas-falsas-pymes/medicion.svg
imageAlt: Barra de 285 dominios mexicanos con correo: 29.5 % sin DMARC, 36.5 % con DMARC en p=none, 20 % en quarantine y 14 % en reject. El 66 % puede ser suplantado.
---

# DMARC y SPF para PyMEs en México: cómo evitar que falsifiquen tu correo para mandar facturas falsas

**En corto:** si alguien puede mandar un correo «desde» `cobranza@tuempresa.mx` sin tu contraseña, puede pedirle a tus clientes que paguen a otra cuenta CLABE. Lo que lo impide son dos registros de texto en el DNS de tu dominio: **SPF** (quién puede enviar a tu nombre) y **DMARC** (qué hacer con el correo que finge ser tuyo). El 25 de noviembre de 2026 medimos **285 dominios mexicanos que reciben correo** y **el 66 % (188) sigue siendo suplantable**: 84 no tienen DMARC y 104 lo tienen en modo `p=none`, que solo observa y no bloquea nada. Solo el 14 % (40) bloquea con `p=reject`. Configurarlo bien toma una tarde y cuesta cero pesos; revisa el tuyo en 2 segundos en el [diagnóstico gratuito de Omona](/#diagnostico).

![Distribución de la política DMARC en 285 dominios mexicanos con correo](/blog/dmarc-spf-facturas-falsas-pymes/medicion.svg)

## Lo que medimos (y cómo)

Tomamos las páginas públicas de cámaras empresariales, portales PyME y organismos `.gob.mx` / `.org.mx` que ya rastreamos para nuestro mapa institucional (sin `.edu.mx`), y de ahí los dominios `.mx` que esas páginas enlazan: socios, aliados, medios y empresas. Resultado: **318 dominios descubiertos, 285 con registro MX** (es decir, que sí usan correo con su dominio). A cada uno le leímos tres registros públicos por DNS-over-HTTPS: `MX`, el `TXT` con `v=spf1` y el `TXT` de `_dmarc.dominio`. Nada intrusivo: es la misma información que consulta Gmail cada vez que recibe un correo.

| Estado del dominio | Dominios | % de 285 | Qué significa para tu negocio |
|---|---:|---:|---|
| Sin registro DMARC | 84 | 29.5 % | Cualquiera puede enviar a tu nombre; el buzón del cliente decide solo |
| DMARC con `p=none` | 104 | 36.5 % | Recibes reportes (si los pediste), pero el correo falso **sí llega** |
| DMARC con `p=quarantine` | 57 | 20.0 % | El correo falso se va a spam |
| DMARC con `p=reject` | 40 | 14.0 % | El correo falso se rechaza antes de llegar |

Tres datos más del mismo corte:

- **26 dominios (9 %) no tienen SPF válido.** Uno de ellos tenía el registro escrito como `=spf1` (le falta la `v`): para Gmail eso equivale a no tener nada.
- **3 dominios publican dos registros SPF a la vez.** La norma ([RFC 7208](https://www.rfc-editor.org/rfc/rfc7208), sección 3.2) dice que con más de uno el resultado es error (`permerror`): es como no tenerlo.
- **Entre los 20 organismos empresariales medidos, 16 (80 %) son suplantables.** No es un regaño: es la prueba de que esto no depende del tamaño de la organización, sino de que alguien lo revise.

> «DMARC es un mecanismo escalable mediante el cual una organización que origina correo puede expresar políticas y preferencias a nivel de dominio para la validación, disposición y reporte de mensajes.» — resumen de la [RFC 7489](https://www.rfc-editor.org/rfc/rfc7489), especificación de DMARC (traducción nuestra).

## Por qué `p=none` no te protege

`p=none` es la etapa de **monitoreo**: le dice a Gmail, Outlook o Yahoo «no hagas nada distinto, solo mándame un reporte». Sirve para descubrir qué sistemas envían correo a tu nombre (tu facturador, tu CRM, tu plataforma de boletines) antes de bloquear. El problema es quedarse ahí para siempre: un 36.5 % de los dominios que medimos ya dio el primer paso y no el segundo. Para un estafador, `p=none` y no tener DMARC es lo mismo.

Desde el 1 de febrero de 2024, Gmail exige autenticación de correo a todos los remitentes, y a quien envía más de 5,000 mensajes al día le pide además SPF, DKIM y un registro DMARC, que puede ser `p=none` ([directrices para remitentes de Gmail](https://support.google.com/a/answer/81126?hl=es)). Por eso muchos dominios lo publicaron «para cumplir» y nunca subieron a `quarantine`.

## Cómo configurarlo en tu PyME, paso a paso

Lo hace quien administra tu dominio (GoDaddy, Cloudflare, Akky, Neubox, tu agencia). Son registros `TXT`; no se instala nada.

**Paso 1 · Un solo SPF con todos tus remitentes.** Junta en un registro a todos los que mandan correo a tu nombre:

| Si usas… | Tu SPF incluye |
|---|---|
| Google Workspace | `include:_spf.google.com` |
| Microsoft 365 | `include:spf.protection.outlook.com` |
| Facturador, CRM o boletines | El `include:` que te dé cada proveedor |

Ejemplo para Google Workspace más una plataforma de boletines: `v=spf1 include:_spf.google.com include:servers.mcsv.net ~all`. Regla: **uno solo** por dominio y que termine en `~all` o `-all`, nunca en `+all`.

**Paso 2 · Activa DKIM en tu proveedor de correo.** Es la firma criptográfica del mensaje. En Google Workspace está en *Aplicaciones → Gmail → Autenticar correo*; en Microsoft 365, en el portal de Defender. Te dará uno o dos registros que pegas en el DNS.

**Paso 3 · Publica DMARC en modo monitoreo (semana 1-2).** En `_dmarc.tuempresa.mx`:

`v=DMARC1; p=none; rua=mailto:dmarc@tuempresa.mx`

El `rua` es el buzón donde llegan los reportes diarios. Revísalos: ahí aparecerán los sistemas legítimos que todavía no están en tu SPF.

**Paso 4 · Sube a cuarentena (semana 3-4).** Cuando los reportes ya no muestren remitentes legítimos fallando:

`v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@tuempresa.mx`

**Paso 5 · Bloquea (mes 2).** `v=DMARC1; p=reject; rua=mailto:dmarc@tuempresa.mx`. Desde aquí, un correo que finja ser tuyo no llega a la bandeja de nadie.

**Qué no hacer:** no publiques un segundo SPF «para el nuevo proveedor» (rompe el primero); no saltes de no tener nada a `p=reject` sin pasar por los reportes, o tus propias facturas pueden terminar rechazadas.

## Y mientras configuras: el candado humano

Aunque tu dominio esté blindado, los estafadores registran dominios parecidos (`tuempresa-mx.com`, `tu-empresa.mx`). Acuerda una regla con tus clientes y tu equipo de pagos: **ningún cambio de cuenta CLABE se acepta por correo**; se confirma por teléfono a un número que ya tenían. Es gratis y cierra la puerta que el DNS no puede cerrar.

## Preguntas frecuentes

**¿Qué es DMARC en palabras simples?** Es una instrucción pública que le dice a Gmail, Outlook y Yahoo qué hacer con un correo que dice venir de tu dominio pero no pasa las pruebas de SPF o DKIM: entregarlo (`none`), mandarlo a spam (`quarantine`) o rechazarlo (`reject`).

**¿Cómo sé si mi dominio tiene SPF y DMARC?** Escribe tu dominio en el [diagnóstico de Omona](/#diagnostico): en 2 segundos te dice si tu SPF existe y si tu DMARC bloquea o solo observa, junto con otros 8 controles de tu página web.

**¿Configurar DMARC puede hacer que mis correos no lleguen?** Solo si saltas directo a `p=reject` sin haber metido a todos tus remitentes en el SPF y DKIM. Por eso el orden es `none` → reportes → `quarantine` → `reject`.

**¿Cuánto cuesta?** Los registros son gratis. Lo único que cuesta es el tiempo de leer los reportes; si no tienes quién lo haga, podemos acompañarte con alcance firmado ([cómo trabajamos](/seguridad)).

## Siguiente paso

Este es el escalón 1 de la [guía de ciberseguridad para PyMEs en México](/blog/ciberseguridad-para-pymes-mexico-guia). Con el correo en orden, sigue tu página web ([cabeceras de seguridad: HTTPS/HSTS, `Content-Security-Policy`](/blog/cabeceras-seguridad-web-pymes-mexico), bloqueo de `/.env`) y después los accesos de tu equipo. Revisa tu dominio hoy en [`omona.tech/#diagnostico`](/#diagnostico) o escríbenos a [`victor@omona.tech`](mailto:victor@omona.tech?subject=DMARC%20y%20SPF%20para%20mi%20PyME%20%E2%80%94%20Omona).

_Método: medición pasiva del 25 de noviembre de 2026, 0 tokens de IA, solo consultas DNS públicas. Publicamos agregados; no publicamos qué dominio está en qué grupo._
