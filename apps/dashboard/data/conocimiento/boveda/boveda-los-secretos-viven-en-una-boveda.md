---
title: Los secretos viven en una bóveda
orden: 1220
linea: Un secreto vive en la bóveda. Ni en archivos ni en el chat.
lang: es
area: Ciberseguridad defensiva
origen: boveda
actualizado: 2026-11-27
---
- El agente usa la llave sin verla.
- Un agente nunca teclea ni crea contraseñas. Eso lo hace una persona.
- Nadie le pide a nadie que le pase una llave por mensaje.
- Cómo se hace
  - Todas las llaves entran a una bóveda con nombre y dueño.
  - Cada servicio declara qué llaves necesita y las lee al arrancar.
  - Antes de subir código, una revisión busca llaves pegadas por error.
  - Hasta el fondo
    - Si hace falta iniciar sesión, el agente deja la pantalla lista y la persona escribe su contraseña.
    - Lo que el agente guarda en su memoria pasa por un filtro que tapa teléfonos, correos y llaves.
    - Una llave que apareció en un chat se considera quemada. Se cambia.
- Por qué
  - Un archivo con llaves termina copiado en tres máquinas y en un respaldo.
  - Con bóveda, cambiar una llave es un paso y no una cacería.
