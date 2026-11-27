---
title: La escalera: de lo urgente a la IA
orden: 1210
linea: La seguridad se sube por escalones. Primero lo que ya te pueden robar hoy.
lang: es
area: Ciberseguridad defensiva
origen: boveda
actualizado: 2026-11-27
---
- Escalón 1: correo y dominio. Por ahí llegan las facturas falsas y el desvío de pagos.
- Escalón 2: página web y formularios.
- Escalón 3: accesos y nube. Escalón 4: agentes de IA.
- Escalón por escalón
  - 1. Correo y dominio
    - SPF y DMARC bien puestos, para que nadie mande correos con tu nombre.
    - Toda cuenta de banco nueva de un proveedor se confirma por otro canal antes de pagar.
    - La medición está en [esta nota](https://omona.tech/blog/dmarc-spf-facturas-falsas-pymes).
  - 2. Página web y formularios
    - HTTPS forzado y cabeceras de seguridad.
    - Ningún archivo de configuración a la vista.
    - Detalle en [esta nota](https://omona.tech/blog/cabeceras-seguridad-web-pymes-mexico).
  - 3. Accesos y nube
    - Cada quien con el permiso mínimo para su trabajo.
    - Quien se va de la empresa pierde el acceso ese mismo día.
    - Los secretos, en bóveda. Ver [Los secretos viven en una bóveda](#boveda-los-secretos-viven-en-una-boveda).
  - 4. Agentes de IA
    - El agente también es un usuario: permiso mínimo y registro de lo que hace.
    - Lo que lee de afuera puede traer instrucciones escondidas. El agente no las sigue.
    - Detalle en [esta nota](https://omona.tech/blog/seguridad-agentes-ia-aws-bedrock-mcp).
- Por qué en ese orden
  - A una empresa chica la atacan primero por el correo, no por la IA.
  - Poner un agente encima de un dominio sin proteger es construir en el escalón cuatro sin tener el uno.
  - Tu dominio se puede revisar gratis en [el diagnóstico](https://omona.tech/#diagnostico).
