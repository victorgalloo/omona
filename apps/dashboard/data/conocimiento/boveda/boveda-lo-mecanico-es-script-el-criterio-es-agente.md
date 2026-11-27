---
title: Lo mecánico es script, el criterio es agente
orden: 1150
linea: Lo que se repite va en script. El agente despierta cuando hace falta criterio.
lang: es
area: Agentes de IA
origen: boveda
actualizado: 2026-11-27
---
- Revisar, contar y comparar: script. Cero tokens.
- Decidir, redactar y clasificar: agente.
- Sin novedades, nadie despierta y nadie avisa.
- Cómo se hace
  - Un script revisa y saca una lista ordenada de lo pendiente.
  - Si la lista es igual a la de la vez pasada, ahí termina.
  - Si cambió, despierta al agente con esa lista y nada más.
  - Hasta el fondo
    - Una falla nunca cuenta como «sin novedades». Si el script falló, lo dice.
    - Cada corrida deja un renglón en su bitácora: qué vio y qué hizo.
    - Los diagnósticos gratuitos del sitio funcionan así: [revisan un dominio](https://omona.tech/verificador-dmarc-spf) en segundos sin llamar a un modelo.
- Por qué
  - Un agente en cada revisión es caro y lento.
  - Un script hace lo mismo mil veces. Un modelo, casi.
