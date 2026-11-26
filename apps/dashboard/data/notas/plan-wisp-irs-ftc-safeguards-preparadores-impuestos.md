---
title: Plan WISP y FTC Safeguards para tax preparers
description: Plan WISP del IRS y FTC Safeguards Rule para preparadores de impuestos latinos en EE. UU.: 9 controles y medición propia de 604 dominios hispanos.
date: 2026-11-26
updated: 2026-11-26
tags: plan wisp irs, ftc safeguards rule, preparadores de impuestos, dmarc, negocios latinos estados unidos
image: /blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos/dmarc-camaras-hispanas.svg
imageAlt: Distribución de la política DMARC en 604 dominios con correo de miembros de cámaras hispanas de EE. UU.
lang: es
alternate: irs-wisp-ftc-safeguards-tax-preparers
---

# Plan WISP del IRS y FTC Safeguards Rule para preparadores de impuestos latinos: 9 controles y lo que revelan 604 dominios de cámaras hispanas

**Respuesta corta:** si preparas declaraciones de impuestos en Estados Unidos, la ley federal te obliga a tener un **plan escrito de seguridad de la información** (*Written Information Security Plan*, WISP). La regla viene de la *Gramm-Leach-Bliley Act* y la aplica la FTC con la **Safeguards Rule (16 CFR Part 314)**, que nombra textualmente a las *tax preparation firms* como «instituciones financieras». El IRS lo recuerda cada año en el formulario de renovación del PTIN: la **línea 11 del Form W-12 (Rev. 10-2026)** te pide marcar que sabes que «los preparadores pagados están obligados por ley a crear y mantener un plan escrito de seguridad de la información».

La renovación del PTIN para 2027 vence el **31 de diciembre de 2026**. Esta guía te deja el plan armado en una semana, en español y con los términos exactos que usan el IRS, la FTC y tu aseguradora.

## 1. Dato propio: 62.7 % de los negocios hispanos medidos pueden ser suplantados por correo

Antes de escribir sobre el plan, medimos el punto donde más dinero se pierde: el correo. El 26 de noviembre de 2026 recorrimos los **directorios públicos de miembros de dos cámaras de comercio hispanas** de Estados Unidos (Fort Worth Hispanic Chamber, Texas, y Statewide Hispanic Chamber of Commerce of New Jersey): **915 fichas**, de las que tomamos solo el enlace «Visit Website» que cada miembro publica. De ahí salieron **604 dominios con correo** (registro MX), que leímos por DNS público sin tocar sus servidores.

![Distribución de la política DMARC en 604 dominios con correo de miembros de cámaras hispanas de EE. UU.](/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos/dmarc-camaras-hispanas.svg)

| Medición (604 dominios con correo, 26-nov-2026) | Dominios | % |
|---|---|---|
| Sin registro DMARC | 171 | 28.3 % |
| DMARC en `p=none` (solo observa, no bloquea) | 208 | 34.4 % |
| DMARC en `p=quarantine` | 111 | 18.4 % |
| DMARC en `p=reject` | 114 | 18.9 % |
| **Suplantables (sin DMARC o `p=none`)** | **379** | **62.7 %** |
| Sin registro SPF | 51 | 8.4 % |

Tres lecturas útiles para un despacho contable o de impuestos:

- **El giro financiero está mejor, pero no bien.** En la categoría *Finance & Insurance* de esos directorios (91 dominios con correo: bancos, aseguradoras, contadores y preparadores), el 45.1 % sigue siendo suplantable y el 37.4 % ya rechaza correo falso con `p=reject`. Restaurantes (80.8 %), despachos legales (75 %) y construcción (68.1 %) están peor.
- **Las propias cámaras también fallan.** De 27 dominios de cámaras hispanas y organizaciones `.org` que medimos, el 59.3 % es suplantable y solo el 7.4 % está en `p=reject`.
- **El gobierno federal ya resolvió esto.** Los 3 portales federales `.gov` con correo de la muestra (CISA, FTC y MBDA) están en `p=reject`, porque la directiva BOD 18-01 de CISA lo hizo obligatorio para agencias federales desde 2018.

En la portada de esos mismos sitios (654 activos), el **72.2 % no envía Content-Security-Policy**, el **45.1 % no envía HSTS** y el **27.9 % no envía ninguna** de las cinco cabeceras básicas de seguridad. En México, con el mismo método, el 66 % de 285 dominios era suplantable ([medición .mx](/blog/dmarc-spf-facturas-falsas-pymes)): el problema no cambia al cruzar la frontera.

**Por qué importa para el WISP:** el fraude por correo empresarial (*Business Email Compromise*, BEC) causó **$2,770 millones de dólares en pérdidas reportadas** en 2024 según el informe anual del IC3 del FBI. En un despacho de impuestos, el mismo correo falso sirve para pedir W-2, copias de identificaciones o cambiar la cuenta donde cae un reembolso. Puedes revisar tu dominio gratis en el [verificador SPF y DMARC](/verificador-dmarc-spf).

## 2. Qué te exige la FTC Safeguards Rule, en 9 controles

La sección 314.4 de la regla enumera los elementos del programa. Esta tabla los baja al tamaño de un despacho de 1 a 10 personas:

| Elemento (16 CFR 314.4) | Qué hacer en un despacho pequeño | Evidencia que guardas |
|---|---|---|
| (a) *Qualified Individual* | Nombra por escrito a una persona responsable (casi siempre el dueño). | Página 1 del WISP con nombre y fecha. |
| (b) Evaluación de riesgos | Lista dónde viven SSN, ITIN, W-2 y cuentas bancarias: software fiscal, correo, nube, papel. | Tabla de riesgos con fecha de revisión. |
| (c)(1)-(2) Accesos e inventario | Cuenta individual por empleado, sin usuarios compartidos; inventario de equipos y apps. | Inventario de equipos y de quién entra a qué. |
| (c)(3) Cifrado | Disco cifrado (BitLocker o FileVault), portal seguro para recibir documentos, nunca adjuntos sin cifrar. | Captura de cifrado activo por equipo. |
| (c)(5) Autenticación multifactor | MFA para **cualquier persona** que entre a un sistema con datos de clientes: software fiscal, correo, nube. | Configuración de MFA por usuario. |
| (c)(6) Eliminación segura | Borra o destruye datos a más tardar **2 años** después del último uso, salvo que la ley pida conservarlos. | Política de retención y bitácora de destrucción. |
| (c)(8) Monitoreo y bitácoras | Alertas de inicio de sesión, reglas de reenvío revisadas en Microsoft 365 o Google Workspace. | Exportación mensual de alertas. |
| (e)-(f) Personal y proveedores | Capacitación anual contra phishing; contratos con proveedores de TI y nube que exijan protecciones. | Lista de asistencia y contratos firmados. |
| (j) Aviso a la FTC | Si un incidente expone datos de **500 o más consumidores**, avisa a la FTC en su formulario web **en máximo 30 días** (vigente desde el 13-may-2024). | Plan de respuesta con el enlace del formulario. |

**La excepción para despachos pequeños es más angosta de lo que parece.** La sección 314.6 libera a quien guarda datos de **menos de 5,000 consumidores** solo de cuatro cosas: la evaluación de riesgos escrita, la prueba de penetración anual con escaneos cada 6 meses, el plan escrito de respuesta a incidentes y el informe anual al consejo. **El resto aplica igual**: responsable designado, cifrado, MFA, eliminación, capacitación, proveedores y el aviso a la FTC. Aun así, el IRS recomienda tener por escrito un plan de respuesta ante robo de datos, y tu aseguradora casi siempre lo pide.

## 3. El WISP en 7 días: estructura de la Publicación 5708 del IRS

El IRS y el *Security Summit* publicaron la **Publicación 5708** (*Creating a Written Information Security Plan for your Tax & Accounting Practice*, rev. agosto 2024), una plantilla de unas 28 páginas pensada para despachos pequeños, y la **Publicación 4557** (*Safeguarding Taxpayer Data*) con los controles técnicos. Este orden funciona:

1. **Día 1 · Responsable y alcance.** Nombra al *Qualified Individual* y lista oficinas, equipos y personas (incluye a los de temporada).
2. **Día 2 · Mapa de datos.** Dónde entran los documentos del cliente (correo, WhatsApp, portal, papel), dónde se guardan y quién los ve.
3. **Día 3 · Correo y dominio.** SPF con un solo registro y `-all`, DKIM firmado y DMARC hacia `p=quarantine` y luego `p=reject`. Revisa reglas de reenvío ocultas en cada buzón. Guía paso a paso: [SPF, DKIM y DMARC contra facturas falsas](/blog/dmarc-spf-facturas-falsas-pymes).
4. **Día 4 · MFA y cuentas.** MFA en el software fiscal, el correo y la nube; quita cuentas de exempleados y usuarios compartidos.
5. **Día 5 · Cifrado y respaldo.** Discos cifrados, respaldo fuera de la oficina probado con una restauración real.
6. **Día 6 · Plan de respuesta.** Quién llama a quién: tu *IRS Stakeholder Liaison*, la policía, la aseguradora, la FTC si son 500 o más consumidores y las autoridades estatales que apliquen.
7. **Día 7 · Firma y calendario.** Firma el documento, guárdalo accesible, agenda la revisión anual y la capacitación antes de enero.

Mientras tanto, lo que no debes hacer: pedir documentos por WhatsApp personal o por correo sin cifrar, compartir la contraseña del software fiscal entre empleados de temporada o aceptar por correo un cambio de cuenta bancaria sin llamar a un número que ya tenías.

## 4. Si usas IA o WhatsApp con tus clientes

Muchos despachos latinos ya reciben documentos por WhatsApp o prueban asistentes de IA bilingües para agendar citas. Ambos entran en el WISP: el canal es un «sistema de información» bajo la regla y el proveedor es un «proveedor de servicios» que debes supervisar. Lo mínimo es que el asistente **no guarde SSN ni fotos de identificaciones en su historial**, que sus permisos sean de solo lectura donde se pueda y que el traspaso a una persona quede registrado. Lo detallamos en [seguridad de agentes de IA en AWS Bedrock y MCP](/blog/seguridad-agentes-ia-aws-bedrock-mcp) y en la [guía pilar para negocios latinos en EE. UU.](/blog/ciberseguridad-negocios-latinos-estados-unidos).

## 5. Método y límites

- **Muestra:** directorios públicos ChamberMaster de FWHCC (Texas, 716 fichas) y SHCCNJ (New Jersey, 199 fichas), sin la categoría de gobierno y educación; 689 fichas traían sitio web y 604 dominios tenían MX. No es una muestra aleatoria de todos los negocios hispanos de EE. UU.: son miembros de cámaras que publican su sitio.
- **Qué hicimos:** consultas DNS-over-HTTPS (MX, SPF, `_dmarc`) y una visita a la portada (http y https) para leer cabeceras. Sin rutas ocultas, sin escaneo de puertos, sin pruebas ofensivas.
- **Qué publicamos:** solo agregados. Los nombres de dominios con fallas no se publican.
- **No es asesoría legal.** Omona hace revisiones **solo defensivas** con autorización por escrito del dueño de los sistemas; no hace pruebas de penetración. Si guardas datos de 5,000 o más consumidores, la prueba de penetración anual la debe hacer un proveedor certificado. Detalle del servicio en [Seguridad](/seguridad).

**Fuentes:** 16 CFR Part 314 (eCFR, al 24-nov-2026); IRS Form W-12 (Rev. 10-2026), línea 11; IRS Publicaciones 5708 y 4557; FBI IC3 *2024 Internet Crime Report*; CISA BOD 18-01; medición propia de Omona del 26-nov-2026.
