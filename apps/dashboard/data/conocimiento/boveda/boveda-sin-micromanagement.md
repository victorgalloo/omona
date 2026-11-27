---
title: Sin micromanagement
orden: 1130
linea: Si tengo que revisar cada paso, el diseño está mal.
lang: es
area: Agentes de IA
origen: boveda
actualizado: 2026-11-27
---
- No me gusta el micromanagement. Lo operativo lo decide el agente y lo reporta después.
- A mí me llega lo que nadie más puede hacer: una sesión, un pago, una firma.
- Nunca una lista de decisiones ni un «¿lo corrijo?».
- Cómo se hace
  - Cada agente sabe qué puede decidir solo y qué no. Está escrito.
  - Lo que no puede fallar tiene candado en código. Ver [Los candados van en código](#boveda-los-candados-van-en-codigo).
  - El agente no pide una decisión que puede tomar con datos. La toma y la reporta como hecha.
  - Hasta el fondo
    - Una aprobación es un toque: sí o no.
    - Si corrijo algo, la corrección se vuelve regla. No la repito.
    - Si un agente pregunta lo mismo dos veces, le falta una regla, no un regaño.
- Por qué
  - Revisar todo me deja haciendo el trabajo dos veces.
  - La confianza sale de los candados y del reporte, no de mirar cada paso.
