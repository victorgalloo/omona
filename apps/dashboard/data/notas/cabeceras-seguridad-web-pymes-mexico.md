---
title: Cabeceras de seguridad web: medimos 304 sitios
description: Medimos 304 sitios .mx: 60 % sin HSTS, 71 % sin CSP y 39 % sin ninguna de 5 cabeceras básicas. Cómo saber si tu web es segura y corregirlo hoy.
date: 2026-11-25
tags: Ciberseguridad para PyMEs, HSTS, Content-Security-Policy, Cabeceras HTTP, Página web
prs:
---

# Cabeceras de seguridad web en PyMEs de México: qué medimos en 304 sitios y cómo corregir el tuyo

**En corto:** que tu página tenga candado (HTTPS) ya no basta. Lo que le dice al navegador «nunca me abras sin cifrar», «no dejes que otra página me meta en un recuadro invisible» o «no ejecutes scripts de sitios que no autoricé» son unas **cabeceras HTTP de seguridad** que se configuran en el servidor en una tarde. El 25 de noviembre de 2026 abrimos la portada de **304 sitios mexicanos activos** y encontramos que **el 60 % no tiene HSTS**, **el 71 % no tiene ninguna `Content-Security-Policy`** y **el 39 % (114) no tiene ni una de las cinco cabeceras básicas**. Solo el 8 % (24) tiene las cinco. Revisa la tuya en 2 segundos en el [diagnóstico gratuito de Omona](/#diagnostico).

## Lo que medimos (y cómo)

Usamos los mismos dominios de nuestra [medición de SPF y DMARC](/blog/dmarc-spf-facturas-falsas-pymes): los organismos empresariales, portales PyME y páginas `.gob.mx` / `.org.mx` que rastreamos para nuestro mapa institucional, más los dominios `.mx` que esas páginas enlazan (socios, aliados, medios y empresas; sin `.edu.mx`). De 316 dominios con DNS, **304 tienen sitio web activo**.

A cada uno le hicimos exactamente lo que hace tu navegador al abrir la portada: una visita a `http://` y otra a `https://`, y leímos las cabeceras de la respuesta. **No probamos rutas ocultas** (como `/.env` o `/.git`), no escaneamos puertos ni mandamos nada raro. Eso solo se hace sobre un dominio propio o con autorización firmada.

| Control (portada, 294 sitios con HTTPS válido) | Sin el control | % | Qué evita |
|---|---:|---:|---|
| `Strict-Transport-Security` (HSTS) | 177 | 60.2 % | Que alguien en una red Wi-Fi pública degrade la conexión a HTTP sin cifrar |
| `Content-Security-Policy` (cualquiera) | 210 | 71.4 % | Que un script inyectado (un plugin hackeado, un formulario vulnerable) robe datos de tus clientes |
| Anti-clickjacking (`X-Frame-Options` o `frame-ancestors`) | 184 | 62.6 % | Que otra página incruste la tuya en un recuadro invisible para robar clics |
| `X-Content-Type-Options: nosniff` | 166 | 56.5 % | Que el navegador «adivine» que un archivo subido es un script y lo ejecute |
| `Referrer-Policy` | 225 | 76.5 % | Que la URL completa (con folios, correos o tokens) se filtre a sitios externos |
| `Permissions-Policy` | 257 | 87.4 % | Que un script de terceros pida cámara, micrófono o ubicación |

Otros datos del mismo corte:

- **48 sitios (15.8 %) no mandan de `http://` a `https://`.** De ellos, 44 sí tienen certificado válido: el candado existe, pero quien escribe la dirección sin `https` navega sin cifrar.
- **10 sitios (3.3 %) no tienen HTTPS válido**; 6 responden con un certificado vencido o que no corresponde al dominio.
- **De las 84 políticas CSP que encontramos, 36 solo dicen `upgrade-insecure-requests`.** Eso sube recursos a HTTPS, pero no limita qué scripts se ejecutan. Con una CSP que de verdad restringe algo quedan 48 sitios: el 16 %.
- **Solo 107 sitios (36 %) tienen HSTS de 6 meses o más.** Un `max-age` de minutos sirve para probar, no para proteger.
- **67 sitios (23 %) anuncian la versión exacta de su software** en las cabeceras `Server` o `X-Powered-By`. 43 anuncian PHP, y **12 de esos corren una versión de PHP que ya no recibe parches de seguridad** (anterior a 8.2, según el [calendario oficial de php.net](https://www.php.net/supported-versions.php)). Otros 10 están en PHP 8.2, cuyo soporte de seguridad termina el 31 de diciembre de 2026.
- **Entre los 19 organismos empresariales con HTTPS, 15 no tienen HSTS y solo 1 tiene las cinco cabeceras básicas.** Igual que con el correo: no es cuestión de tamaño, es de que alguien lo revise.

> «Esta especificación define un mecanismo que permite a los sitios web declararse accesibles solo mediante conexiones seguras.» — [RFC 6797](https://www.rfc-editor.org/rfc/rfc6797), especificación de HTTP Strict Transport Security (traducción nuestra).

## Por qué importa en una PyME

Tu página es donde tus clientes dejan nombre, teléfono, correo y a veces datos de pago o de facturación. Si un plugin de WordPress se compromete o un formulario acepta código, **la `Content-Security-Policy` es la que impide que ese código mande los datos a otro servidor**. Y anunciar `PHP/7.4` en cada respuesta es decirle a cualquier robot automatizado qué fallas conocidas probar primero. Ninguna de estas cabeceras cuesta dinero; todas se ponen una vez.

## Cómo corregirlo, según dónde está tu página

**Paso 1 · Fuerza HTTPS.** En Cloudflare: *SSL/TLS → Edge Certificates → Always Use HTTPS*. En un hosting con Apache (cPanel, la mayoría de los WordPress), en el `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Paso 2 · Las cinco cabeceras básicas.** En Apache, dentro del mismo `.htaccess`:

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Content-Security-Policy-Report-Only "default-src 'self'; frame-ancestors 'self'"
</IfModule>
```

En Nginx, dentro del bloque `server` de HTTPS:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy-Report-Only "default-src 'self'; frame-ancestors 'self'" always;
```

En Vercel o Netlify van en `vercel.json` / `netlify.toml` (sección `headers`); en Cloudflare, en *Rules → Transform Rules → Modify Response Header*, y HSTS se activa en *SSL/TLS → Edge Certificates*.

**Paso 3 · HSTS de menos a más.** Empieza con `max-age=300` (5 minutos) un día, revisa que todo el sitio y los subdominios abran con HTTPS y luego sube a `31536000` (un año). Agrega `includeSubDomains` solo cuando todos tus subdominios tengan certificado.

**Paso 4 · CSP primero en modo reporte.** `Content-Security-Policy-Report-Only` no bloquea nada: el navegador solo avisa en la consola qué rompería. Agrega a la lista los dominios legítimos que aparezcan (Google Analytics, tu chat, tu pasarela de pago) y cuando ya no salgan avisos, cambia el nombre a `Content-Security-Policy`.

**Paso 5 · Deja de anunciar versiones.** En Apache: `ServerTokens Prod` y `ServerSignature Off` (en la configuración del servidor, no en `.htaccess`); en Nginx: `server_tokens off;`; en PHP: `expose_php = Off` en `php.ini`. Y si tu hosting sigue en PHP 8.1 o anterior, pide la actualización: esconder la versión no parcha nada.

**Qué no hacer:** no actives HSTS con `preload` sin estar seguro (salir de la lista de precarga de los navegadores tarda meses), y no publiques una CSP en modo de bloqueo el viernes en la tarde sin haber pasado por el modo reporte.

## Lo que esta medición no ve

Leímos solo la portada y solo las cabeceras: una página interna puede tener otra configuración, y una CSP puesta con `<meta http-equiv>` en el HTML no aparece en las cabeceras (aunque tampoco puede usar `frame-ancestors`). Algunos sitios detrás de un firewall de aplicación responden distinto a un robot que a un navegador. Por eso los números son un piso, no un veredicto por sitio.

## Preguntas frecuentes

**¿Cómo saber si mi página web es segura?** Escribe tu dominio en el [diagnóstico de Omona](/#diagnostico): en 2 segundos revisa HTTPS, HSTS, `Content-Security-Policy`, anti-clickjacking, `nosniff`, `Referrer-Policy`, si tu `/.env` o tu `/.git` están expuestos (solo en tu propio dominio, con tu autorización), SPF y DMARC.

**¿Qué son las cabeceras de seguridad HTTP?** Son instrucciones que tu servidor manda junto con cada página para decirle al navegador qué permitir: solo conexiones cifradas, qué scripts ejecutar, si otra página puede incrustarla. El [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/) mantiene la lista recomendada.

**¿Si ya tengo candado (HTTPS) estoy protegido?** El candado cifra la conexión, pero no evita que alguien te degrade a HTTP en una red pública (eso lo hace HSTS) ni que un script inyectado robe datos (eso lo limita la CSP).

**¿Puedo romper mi página?** HSTS y la CSP son las únicas delicadas, por eso van de menos a más: HSTS de 5 minutos a un año, y la CSP primero en modo reporte.

## Siguiente paso

Este es el escalón 2 de la [guía de ciberseguridad para PyMEs en México](/blog/ciberseguridad-para-pymes-mexico-guia), después del [correo (SPF y DMARC)](/blog/dmarc-spf-facturas-falsas-pymes). Con correo y página en orden, siguen los accesos de tu equipo y la nube. Revisa tu dominio hoy en [`omona.tech/#diagnostico`](/#diagnostico) o escríbenos a [`victor@omona.tech`](mailto:victor@omona.tech?subject=Cabeceras%20de%20seguridad%20de%20mi%20p%C3%A1gina%20%E2%80%94%20Omona).

_Método: medición pasiva del 25 de noviembre de 2026, 0 tokens de IA, una visita a la portada por dominio (`http://` y `https://`). Publicamos agregados; no publicamos qué sitio está en qué grupo._
