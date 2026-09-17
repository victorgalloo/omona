A. **Título**

Claude Agent SDK: qué resuelve y qué no al construir agentes comerciales

---

B. **Meta description**

El Agent SDK entrega el loop de agente, la ejecución de herramientas y la administración de contexto en Python o TypeScript. Lo que sigue siendo trabajo propio: el modelo de dominio comercial, la política, las evaluaciones y la medición.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Claude Agent SDK: qué resuelve y qué no al construir agentes comerciales

**El Claude Agent SDK entrega la infraestructura de agente —el loop, la ejecución de herramientas y la administración de contexto— en Python o TypeScript, las mismas piezas que hacen funcionar a Claude Code. Lo que no entrega, y es la mayor parte del trabajo en un sistema comercial, es el modelo de dominio: qué es una oportunidad activa, qué acción requiere aprobación, cómo se evalúa una decisión y cómo se liga con el pipeline.**

Entender esa frontera evita dos errores simétricos: creer que el SDK resuelve el proyecto, y reconstruir a mano lo que el SDK ya resuelve.

## Qué entrega el SDK

Según su documentación, el Agent SDK da las mismas herramientas, loop de agente y administración de contexto que sostienen a Claude Code, disponibles como librería. En términos prácticos, eso significa:

- **El loop.** El ciclo de razonar, elegir herramienta, ejecutar, observar el resultado y continuar. Escribirlo bien —con reintentos, límites, manejo de herramientas que fallan y condiciones de término— es más trabajo del que parece.
- **La ejecución de herramientas.** Definición de esquemas, validación de parámetros, invocación y devolución de resultados al modelo.
- **La administración de contexto.** Qué cabe en la ventana, qué se resume, qué se descarta y cómo se recupera después.

Esa última es la que más subestiman los equipos que empiezan de cero. Un agente comercial que lee un pipeline completo revienta cualquier ventana de contexto en la primera ejecución; lo que decide si funciona es la estrategia de qué se le da al modelo y cuándo.

## Qué sigue siendo trabajo propio

| Capa | ¿La da el SDK? |
|---|---|
| Loop de agente | Sí |
| Ejecución y esquemas de herramientas | Sí |
| Administración de contexto | Sí |
| Conectores a CRM, correo, calendario | No |
| Definiciones de negocio (etapa, SLA, siguiente paso) | No |
| Política de permisos y aprobaciones | No |
| Estado persistente por cuenta y oportunidad | No |
| Conjunto de evaluaciones comerciales | No |
| Observabilidad ligada a pipeline e ingresos | No |

Las seis filas de "no" son el proyecto. El SDK acorta el camino a un prototipo que funciona; no acorta el camino a un sistema que una empresa puede encender.

## Dónde encaja en la arquitectura

Dentro del componente de orquestación de una [arquitectura de agente comercial](/blog/arquitectura-agente-comercial-produccion): un servicio en TypeScript o Python que mantiene estado por cuenta, oportunidad y ejecución, y que usa el SDK para el loop y las herramientas.

Alrededor se construyen la capa semántica, los conectores, la política y la instrumentación. El SDK es el motor, no el vehículo.

## Elegir entre SDK, API directa y agentes administrados

Las opciones del ecosistema resuelven niveles distintos:

- **API de mensajes directa**: control total, todo el loop a cargo de quien construye. Conviene cuando el comportamiento es muy específico o hay que integrar con una orquestación existente.
- **Agent SDK**: el loop, las herramientas y el contexto resueltos, con libertad para definir herramientas y política. Es el punto de equilibrio para un sistema comercial a la medida.
- **Agentes administrados / hospedados**: menos infraestructura que operar, a cambio de menos control sobre el entorno de ejecución. Útil cuando el equipo no quiere operar sandbox ni estado.

Para el caso de un agente que escribe en el CRM de un cliente y necesita trazas propias, permisos por cliente y evaluaciones versionadas, el SDK suele ser la opción correcta.

## Qué no hay que delegar al SDK

**La abstracción del modelo.** Conviene mantener una capa razonable entre el sistema y el proveedor, sin renunciar a optimizar para el modelo que se está usando. El equilibrio: que cambiar de modelo sea un proyecto de días, no de meses, y tampoco fingir que todos los modelos se comportan igual.

**El criterio comercial.** Ninguna librería sabe que en esa empresa un descuento superior a cierto porcentaje requiere autorización del director, o que la etapa "propuesta enviada" significa algo distinto para el equipo de gobierno que para el de retail.

**La evaluación.** El SDK no trae un conjunto de casos de tu proceso. Ese se construye, se versiona y es [la parte difícil de copiar](/blog/evaluaciones-agentes-comerciales-evals).

## Preguntas frecuentes

**¿Qué es el Claude Agent SDK?**
Es una librería que entrega el loop de agente, la ejecución de herramientas y la administración de contexto que hacen funcionar a Claude Code, disponible para Python y TypeScript, para construir agentes propios.

**¿El Agent SDK resuelve la integración con el CRM?**
No. El SDK provee la mecánica del agente y el marco para definir herramientas, pero los conectores a CRM, correo y calendario, las definiciones de negocio, la política de permisos, el estado persistente y las evaluaciones se construyen aparte.

**¿Conviene usar el SDK o llamar la API directamente?**
La API directa da control total y obliga a escribir el loop completo; el SDK resuelve loop, herramientas y contexto dejando libertad sobre herramientas y política. Para un agente comercial a la medida que escribe en sistemas del cliente, el SDK suele ser el punto de equilibrio.

**¿Usar el SDK crea dependencia de un proveedor?**
Crea alguna, y se gestiona con una abstracción razonable del modelo dentro del sistema, sin renunciar a optimizar para el modelo en uso. El criterio práctico es que cambiar de modelo sea un proyecto de días, no de meses.

**¿En qué lenguajes está disponible?**
En Python y TypeScript, que son también los lenguajes en los que suele construirse la orquestación de un agente comercial.

## D. Bloque JSON-LD (Article + FAQPage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://omona.tech/blog/claude-agent-sdk-agentes-comerciales",
      "headline": "Claude Agent SDK: qué resuelve y qué no al construir agentes comerciales",
      "description": "El Agent SDK entrega loop de agente, ejecución de herramientas y administración de contexto. El modelo de dominio comercial, la política, las evaluaciones y la medición siguen siendo trabajo propio.",
      "inLanguage": "es-MX",
      "datePublished": "2026-09-17",
      "dateModified": "2026-09-17",
      "author": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "publisher": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "mainEntityOfPage": "https://omona.tech/blog/claude-agent-sdk-agentes-comerciales"
    },
    {
      "@type": "FAQPage",
      "@id": "https://omona.tech/blog/claude-agent-sdk-agentes-comerciales#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es el Claude Agent SDK?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Es una librería que entrega el loop de agente, la ejecución de herramientas y la administración de contexto que hacen funcionar a Claude Code, disponible para Python y TypeScript, para construir agentes propios."
          }
        },
        {
          "@type": "Question",
          "name": "¿El Agent SDK resuelve la integración con el CRM?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. El SDK provee la mecánica del agente y el marco para definir herramientas, pero los conectores a CRM, correo y calendario, las definiciones de negocio, la política de permisos, el estado persistente y las evaluaciones se construyen aparte."
          }
        },
        {
          "@type": "Question",
          "name": "¿Conviene usar el Agent SDK o llamar la API directamente?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La API directa da control total y obliga a escribir el loop completo; el SDK resuelve loop, herramientas y contexto dejando libertad sobre herramientas y política. Para un agente comercial a la medida que escribe en sistemas del cliente, el SDK suele ser el punto de equilibrio."
          }
        },
        {
          "@type": "Question",
          "name": "¿En qué lenguajes está disponible el Claude Agent SDK?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En Python y TypeScript, que son también los lenguajes en los que suele construirse la orquestación de un agente comercial."
          }
        }
      ]
    }
  ]
}
```

## E. CLAIMS EXTRAÍBLES

1. El Claude Agent SDK entrega el mismo loop de agente, ejecución de herramientas y administración de contexto que hacen funcionar a Claude Code, disponible como librería para Python y TypeScript.

2. El SDK no entrega los conectores a CRM, correo y calendario, ni las definiciones de negocio, la política de permisos, el estado persistente por cuenta y oportunidad, el conjunto de evaluaciones ni la observabilidad ligada a pipeline: esas seis capas son el proyecto.

3. La administración de contexto es la capa más subestimada al construir desde cero, porque un agente que lee un pipeline completo agota cualquier ventana de contexto en la primera ejecución.

4. La dependencia de un proveedor de modelo se gestiona con una abstracción razonable dentro del sistema, sin renunciar a optimizar para el modelo en uso; el criterio práctico es que cambiar de modelo sea un proyecto de días y no de meses.

5. El SDK acorta el camino a un prototipo que funciona, pero no acorta el camino a un sistema que una empresa puede encender, porque lo que falta es dominio comercial, política, evaluación y medición.
