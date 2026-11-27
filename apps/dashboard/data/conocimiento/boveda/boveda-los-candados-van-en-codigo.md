---
title: Los candados van en código
orden: 1030
linea: Lo que no puede fallar no se le pide al modelo. Se programa.
lang: es
area: Procesos comerciales + IA
origen: boveda
actualizado: 2026-11-27
---
- Cero precios inventados: el precio sale de una tabla o no sale.
- El modelo redacta. El código decide qué sí se puede decir.
- Un candado se prueba como cualquier función: con casos que deben rechazarse.
- Cómo se hace
  - Hago la lista de lo que el agente nunca debe hacer: inventar un precio, prometer una fecha, dar un dato de otra persona.
  - Cada renglón de esa lista se vuelve una revisión en código que corre antes de enviar.
  - Si la revisión falla, el mensaje no sale y el caso pasa a una persona.
  - Hasta el fondo
    - «Por favor no inventes precios» en el prompt es un deseo. Una función que compara contra la tabla es un candado.
    - Los candados se quedan igual aunque cambie el modelo.
    - Cada candado deja registro de qué bloqueó. Con eso se corrige el prompt.
- Por qué
  - Un modelo acierta casi siempre. En ventas, el «casi» lo paga el cliente.
  - Con candados puedo dejar que el agente trabaje solo sin revisar cada mensaje. Ver [Sin micromanagement](#boveda-sin-micromanagement).
