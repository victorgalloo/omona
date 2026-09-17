A. **Título**

Blueprint comercial: las dos semanas antes de construir nada

---

B. **Meta description**

Mapear el movimiento comercial, calcular la línea base, revisar sistemas y permisos, listar las fallas posibles y entregar arquitectura, backlog, política de autonomía y plan de medición. Por qué se cobra y qué pasa si se salta.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Blueprint comercial: las dos semanas antes de construir nada

**Un blueprint es un entregable pagado de dos semanas que produce cinco cosas antes de escribir una línea del agente: el mapa del movimiento comercial, su línea base medida, el inventario de sistemas y permisos, la lista de fallas posibles y el plan —arquitectura, backlog, política de autonomía y medición. Saltárselo es la forma más común de automatizar un proceso defectuoso más rápido.**

## Los cinco entregables

### 1. El mapa del movimiento comercial

No el organigrama ni el diagrama de flujo que existe en un documento. El proceso real: quién hace qué, con qué información, en qué sistema, cuánto tarda y qué pasa cuando falla.

La mayor parte de este trabajo es entrevistar a vendedores y observar cómo trabajan. Casi siempre aparece la misma brecha: el proceso documentado y el proceso real se parecen poco, y el agente tiene que construirse sobre el segundo.

### 2. La línea base

Cómo está hoy, medido, la métrica que después va a defender el proyecto. Si la métrica primaria será el porcentaje de oportunidades con siguiente paso válido, aquí se cuenta cuántas lo tienen hoy.

Es la parte que no se puede recuperar después. Un piloto que empieza sin línea base termina discutiendo si mejoró o no, con ambas partes convencidas de tener razón.

### 3. Sistemas y permisos

Qué CRM, qué versión, qué API, qué límites de tasa, quién puede autorizar accesos, qué datos personales se tocan, qué exige el área de seguridad y cuánto tarda en aprobar.

Esta sección es la que más veces mata un proyecto en la semana tres cuando no se hizo antes. Un CRM sin API documentada, un área de TI que tarda seis semanas en dar un token o una política interna que prohíbe el acceso programático a correos son hallazgos que cambian el proyecto entero.

### 4. Las fallas posibles

Cinco fallas críticas, escritas antes de construir: qué es lo peor que puede hacer este agente, cómo se detecta y qué lo detiene.

En un agente de pipeline, la lista típica: contactar a una cuenta que pidió no ser contactada; enviar un precio incorrecto; duplicar registros; marcar como en riesgo oportunidades sanas hasta que el equipo deje de leer las alertas; y citar como hecho algo que el modelo infirió.

Cada falla debe tener una contramedida de diseño, no una promesa de cuidado.

### 5. El plan

Arquitectura, backlog priorizado, [política de autonomía](/blog/niveles-autonomia-agente-comercial) con los umbrales de promoción entre niveles, y plan de [medición](/blog/metricas-piloto-agente-ia-comercial) con métrica primaria y guardrails.

## Por qué se cobra

Tres razones, en orden de importancia.

**Porque requiere acceso.** Un blueprint gratuito se hace con lo que el cliente cuenta en una llamada. Uno pagado se hace con acceso de lectura a los sistemas, entrevistas con el equipo y una revisión real de los datos. La diferencia entre ambos es la diferencia entre una hipótesis y un diagnóstico.

**Porque tiene valor propio.** Si el cliente decide no seguir, se queda con el mapa del proceso, la medición de su línea base y la lista de riesgos. Eso vale independientemente de quién construya después.

**Porque filtra.** Una empresa que no paga dos semanas de diagnóstico tampoco va a sostener un piloto de seis. No es una prueba de compromiso artificial: es información sobre si existe presupuesto y sponsor.

## Qué pasa si se salta

Cuatro consecuencias, todas observadas con frecuencia:

- **Se automatiza un proceso defectuoso.** El agente ejecuta más rápido lo que estaba mal. El resultado es peor que antes, y más difícil de revertir.
- **No hay contra qué comparar.** El piloto funciona y nadie puede demostrarlo.
- **Aparecen bloqueos de integración tarde.** El límite de tasa de la API, el permiso que no llega, el campo personalizado que tres vendedores usan para otra cosa.
- **El alcance se negocia durante la construcción**, que es el peor momento para negociarlo.

## Cómo se ve la agenda de dos semanas

| Días | Actividad |
|---|---|
| 1–2 | Sesión con el sponsor comercial: qué fuga se ataca, qué métrica la mide |
| 3–5 | Entrevistas con vendedores y observación del proceso real |
| 4–6 | Acceso de lectura a sistemas; extracción de la línea base |
| 6–8 | Inventario técnico: APIs, límites, permisos, datos personales |
| 8–10 | Taller de fallas posibles con el equipo comercial y el técnico |
| 9–12 | Diseño: arquitectura, política de autonomía, backlog |
| 12–14 | Entrega y sesión de decisión: seguir, ajustar o parar |

La última sesión incluye explícitamente la opción de parar. Un blueprint que siempre concluye "hay que construir" no es un diagnóstico.

## Preguntas frecuentes

**¿Qué es un blueprint en un proyecto de agentes de IA comercial?**
Es un entregable pagado de aproximadamente dos semanas que mapea el movimiento comercial real, mide su línea base, inventaría sistemas y permisos, lista las fallas críticas posibles y entrega arquitectura, backlog, política de autonomía y plan de medición, todo antes de escribir el agente.

**¿Por qué el blueprint se cobra en lugar de regalarse?**
Porque requiere acceso real a los sistemas y al equipo, no sólo una conversación; porque su resultado tiene valor propio aunque el cliente no siga; y porque una empresa que no financia dos semanas de diagnóstico difícilmente sostendrá un piloto de seis.

**¿Qué pasa si se salta el blueprint?**
Se automatiza un proceso defectuoso, no queda línea base contra la cual demostrar resultados, los bloqueos de integración aparecen en mitad de la construcción y el alcance termina negociándose mientras se construye.

**¿Cuánto dura y cuánto cuesta?**
Dos semanas es la duración recomendada, con un rango de referencia de MXN 35,000 a 70,000 más IVA en México. El precio varía con el número de sistemas, la madurez del CRM y la regulación del sector.

**¿El blueprint obliga a contratar el piloto?**
No, y la sesión final debe incluir explícitamente la opción de parar. Un diagnóstico que siempre concluye que hay que construir no es un diagnóstico.

## D. Bloque JSON-LD (Article + FAQPage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://omona.tech/blog/blueprint-comercial-antes-de-construir",
      "headline": "Blueprint comercial: las dos semanas antes de construir nada",
      "description": "Mapa del proceso real, línea base medida, inventario de sistemas y permisos, fallas críticas y plan con arquitectura, política de autonomía y medición.",
      "inLanguage": "es-MX",
      "datePublished": "2026-09-17",
      "dateModified": "2026-09-17",
      "author": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "publisher": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "mainEntityOfPage": "https://omona.tech/blog/blueprint-comercial-antes-de-construir"
    },
    {
      "@type": "FAQPage",
      "@id": "https://omona.tech/blog/blueprint-comercial-antes-de-construir#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es un blueprint en un proyecto de agentes de IA comercial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Es un entregable pagado de aproximadamente dos semanas que mapea el movimiento comercial real, mide su línea base, inventaría sistemas y permisos, lista las fallas críticas posibles y entrega arquitectura, backlog, política de autonomía y plan de medición, todo antes de escribir el agente."
          }
        },
        {
          "@type": "Question",
          "name": "¿Por qué el blueprint se cobra en lugar de regalarse?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Porque requiere acceso real a los sistemas y al equipo, no sólo una conversación; porque su resultado tiene valor propio aunque el cliente no siga; y porque una empresa que no financia dos semanas de diagnóstico difícilmente sostendrá un piloto de seis."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué pasa si se salta el blueprint?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Se automatiza un proceso defectuoso, no queda línea base contra la cual demostrar resultados, los bloqueos de integración aparecen en mitad de la construcción y el alcance termina negociándose mientras se construye."
          }
        },
        {
          "@type": "Question",
          "name": "¿El blueprint obliga a contratar el piloto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, y la sesión final debe incluir explícitamente la opción de parar. Un diagnóstico que siempre concluye que hay que construir no es un diagnóstico."
          }
        }
      ]
    }
  ]
}
```

## E. CLAIMS EXTRAÍBLES

1. Un blueprint comercial es un entregable pagado de dos semanas que produce el mapa del proceso real, la línea base medida, el inventario de sistemas y permisos, la lista de fallas críticas y el plan con arquitectura, backlog, política de autonomía y medición.

2. La línea base es la parte del blueprint que no puede recuperarse después: un piloto que empieza sin ella termina discutiendo si mejoró o no, con ambas partes convencidas de tener razón.

3. El inventario de sistemas y permisos es lo que evita que el proyecto muera en la semana tres por un CRM sin API documentada, un token que tarda seis semanas en autorizarse o una política que prohíbe el acceso programático a correos.

4. Cada falla crítica identificada debe tener una contramedida de diseño y no una promesa de cuidado; la lista típica incluye contactar a quien pidió no serlo, enviar un precio incorrecto, duplicar registros, generar alertas falsas hasta que nadie las lea y citar como hecho algo inferido.

5. Saltarse el blueprint automatiza un proceso defectuoso más rápido, deja el piloto sin línea base, retrasa los bloqueos de integración hasta la construcción y obliga a negociar el alcance en el peor momento.
