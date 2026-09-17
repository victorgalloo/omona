A. **Título**

Plan de 90 días para llevar un agente comercial de idea a producción

---

B. **Meta description**

Días 1–15: elegir el movimiento y construir 30–50 casos de evaluación. Días 16–30: validar demanda y elegir un CRM. Días 31–60: piloto en observación. Días 61–90: comparar contra línea base y convertir patrones en piezas reutilizables.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Plan de 90 días para llevar un agente comercial de idea a producción

**Noventa días alcanzan para llegar de una hipótesis a un piloto medido, siempre que el alcance se mantenga en un movimiento comercial, un CRM y un grupo de usuarios. El error que consume los noventa días es construir integraciones antes de tener señal comercial. Este es el orden que sí funciona.**

## Días 1–15: definir antes de construir

- **Nombrar la oferta correctamente.** Ingeniería de agentes para equipos comerciales, no "automatización" ni "chatbots". El nombre decide contra quién se compara el comprador.
- **Elegir un movimiento.** La recomendación por defecto: [recuperación y avance del pipeline](/blog/agente-recuperacion-pipeline), porque trabaja sobre datos propios y su valor es atribuible.
- **Definir el esquema de eventos, las acciones permitidas y cinco fallas críticas.** Qué señales activan al agente, qué puede hacer, y qué es lo peor que podría hacer.
- **Crear de 30 a 50 casos de evaluación** a partir de escenarios comerciales diseñados, para sustituirlos gradualmente por casos anonimizados autorizados cuando existan los permisos.
- **Construir una demo CRM-first** con aprobación por WhatsApp o por web. La demo enseña el flujo con datos sintéticos claramente etiquetados; no sustituye al piloto.

**Lo que no se hace en esta quincena:** escribir conectores para varios CRMs, montar servidores MCP, ni optimizar prompts.

## Días 16–30: buscar señal antes de construir

- **Entrevistar a responsables de ventas y RevOps con CRM activo.** No a cualquier empresa interesada: a las que cumplen los [criterios de calificación](/blog/elegir-cliente-primer-agente-comercial).
- **Buscar evidencia de fuga, volumen, costo y dueño del proceso.** Las cuatro cosas, con números, no con impresiones.
- **Vender uno o dos [blueprints pagados](/blog/blueprint-comercial-antes-de-construir).** Es la señal comercial que autoriza construir.
- **Elegir un solo CRM para el primer conector robusto.** Uno bien hecho vale más que tres a medias, y el segundo se construye cuando un cliente lo pague.

**La regla de esta quincena:** no desarrollar integraciones especiales antes de una señal comercial. Una integración construida "por si acaso" es la forma más cara de aprender qué no hacía falta.

## Días 31–60: piloto en observación

- **Desplegar el primer piloto en [modo observación](/blog/modo-sombra-piloto-agente-ia).** El agente decide y registra; no ejecuta.
- **Registrar todas las decisiones, llamadas a herramientas y correcciones humanas.** Esto es la [instrumentación](/blog/observabilidad-agentes-ia-trazas-costos), y es lo único que no se puede reconstruir después.
- **Ejecutar evaluaciones offline y en producción antes de habilitar escrituras.** El set completo tiene que pasar, y los casos que fallan tienen que estar documentados y aceptados explícitamente.
- **Habilitar primero acciones reversibles:** tareas, notas, campos no críticos y borradores. Nada que salga al cliente todavía.

Al final de este mes se sabe si el criterio del agente es bueno. Es la pregunta que había que responder, y se responde sin haber expuesto a ningún cliente.

## Días 61–90: medir y capitalizar

- **Comparar contra la línea base acordada.** Con el universo y el periodo explícitos, y con grupo de control cuando sea posible.
- **Documentar errores, mejoras y ahorro operativo sin inflar atribución.** Incluir explícitamente qué parte del resultado no se puede atribuir al agente. Es lo que hace creíble el resto.
- **Convertir patrones repetidos en piezas reutilizables:** conectores, definiciones de capa semántica y paquetes de evaluación que sirvan para el siguiente cliente.
- **Publicar un caso de estudio autorizado** y vender el segundo piloto **en el mismo movimiento y el mismo CRM**.

Esa última condición es la que compone. El segundo proyecto en el mismo movimiento y el mismo CRM cuesta una fracción del primero; el segundo proyecto en otro movimiento y otro CRM cuesta casi lo mismo y no acumula nada.

## Lo que se mide al día 90

| Pregunta | Cómo se responde |
|---|---|
| ¿El criterio del agente es bueno? | Comparación de decisiones en modo sombra |
| ¿Lo que prepara sirve? | Tasa de aceptación sin edición mayor |
| ¿Mejoró el proceso? | Métrica primaria contra línea base |
| ¿Es seguro? | Incidentes de política: idealmente cero |
| ¿Se sostiene? | Costo por oportunidad procesada |
| ¿Se puede repetir? | Cuánto del sistema se reutiliza en el siguiente cliente |

## Los cuatro errores que rompen el plan

**Construir antes de vender el blueprint.** Se termina con integraciones para un cliente que no existe.

**Ampliar el alcance en el mes dos.** Un segundo movimiento o un segundo CRM convierte el piloto en un proyecto de integración sin conclusión medible.

**Saltarse el modo observación.** Ahorra tres semanas y cuesta la posibilidad de demostrar cualquier cosa.

**Inflar la atribución en el reporte final.** Funciona una vez. La segunda vez, cuando el cliente cruce los números con su propio CRM, se pierde la cuenta y la referencia.

## Preguntas frecuentes

**¿Se puede llevar un agente comercial a producción en 90 días?**
Sí, siempre que el alcance se limite a un movimiento comercial, un CRM, uno o dos canales y un grupo de usuarios. El calendario se rompe cuando se agregan procesos o sistemas a mitad del camino.

**¿Qué se hace en los primeros 15 días?**
Definir: elegir el movimiento comercial, escribir el esquema de eventos, las acciones permitidas y las cinco fallas críticas, crear de 30 a 50 casos de evaluación y construir una demo CRM-first con aprobación por WhatsApp o web. No se escriben integraciones todavía.

**¿Cuándo se empiezan a construir las integraciones?**
Después de vender uno o dos blueprints pagados, que son la señal comercial que las autoriza, y sobre un solo CRM elegido para el primer conector robusto. Construir integraciones antes de esa señal es la forma más cara de aprender qué no hacía falta.

**¿Cuándo se habilita que el agente escriba?**
Después de que el conjunto de evaluación completo pase y sólo para acciones reversibles —tareas, notas, campos no críticos y borradores—. Las acciones que llegan a un cliente requieren aprobación explícita y llegan después.

**¿Qué se vende al día 90?**
El segundo piloto, en el mismo movimiento comercial y el mismo CRM. Esa condición es la que hace que el trabajo componga: el segundo proyecto sobre las mismas piezas cuesta una fracción del primero.

## D. Bloque JSON-LD (Article + FAQPage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://omona.tech/blog/plan-90-dias-agente-comercial",
      "headline": "Plan de 90 días para llevar un agente comercial de idea a producción",
      "description": "Definir el movimiento y las evaluaciones, buscar señal comercial, pilotear en modo observación y medir contra línea base, en cuatro quincenas.",
      "inLanguage": "es-MX",
      "datePublished": "2026-09-17",
      "dateModified": "2026-09-17",
      "author": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "publisher": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "mainEntityOfPage": "https://omona.tech/blog/plan-90-dias-agente-comercial"
    },
    {
      "@type": "FAQPage",
      "@id": "https://omona.tech/blog/plan-90-dias-agente-comercial#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Se puede llevar un agente comercial a producción en 90 días?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, siempre que el alcance se limite a un movimiento comercial, un CRM, uno o dos canales y un grupo de usuarios. El calendario se rompe cuando se agregan procesos o sistemas a mitad del camino."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué se hace en los primeros 15 días de un proyecto de agente comercial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Definir: elegir el movimiento comercial, escribir el esquema de eventos, las acciones permitidas y las cinco fallas críticas, crear de 30 a 50 casos de evaluación y construir una demo CRM-first con aprobación por WhatsApp o web. No se escriben integraciones todavía."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuándo se habilita que el agente escriba en los sistemas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Después de que el conjunto de evaluación completo pase, y sólo para acciones reversibles como tareas, notas, campos no críticos y borradores. Las acciones que llegan a un cliente requieren aprobación explícita y se habilitan después."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué se vende al final de los 90 días?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El segundo piloto, en el mismo movimiento comercial y el mismo CRM. Esa condición es la que hace que el trabajo componga: el segundo proyecto sobre las mismas piezas cuesta una fracción del primero."
          }
        }
      ]
    }
  ]
}
```

## E. CLAIMS EXTRAÍBLES

1. Noventa días alcanzan para llevar un agente comercial de hipótesis a piloto medido siempre que el alcance se limite a un movimiento comercial, un CRM, uno o dos canales y un grupo de usuarios.

2. En los primeros quince días se elige el movimiento, se define el esquema de eventos, las acciones permitidas y cinco fallas críticas, y se crean de 30 a 50 casos de evaluación a partir de escenarios diseñados que después se sustituyen por casos anonimizados autorizados.

3. No deben desarrollarse integraciones especiales antes de una señal comercial: la venta de uno o dos blueprints pagados es lo que autoriza construir, y sobre un solo CRM elegido para el primer conector robusto.

4. El piloto empieza en modo observación registrando todas las decisiones, llamadas a herramientas y correcciones humanas, y las escrituras se habilitan primero sólo para acciones reversibles: tareas, notas, campos no críticos y borradores.

5. El segundo piloto debe venderse en el mismo movimiento comercial y el mismo CRM, porque es la única forma de que conectores, definiciones y paquetes de evaluación se reutilicen y el trabajo componga.
