A. **Título**

Claude Workflow Build | Omona

---

B. **Meta description**

Del proceso real a un sistema que opera: descubrimiento del workflow, diseño de arquitectura y permisos, integración, construcción, evaluación y transferencia al equipo.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Claude Workflow Build

**Hay un proceso de negocio que consume horas y no hay sistema que lo sostenga. La construcción completa va del workflow real —el que la gente ejecuta, no el del diagrama— hasta una automatización que el equipo puede operar.**

Aplica a operaciones, soporte, ventas, finanzas, procesamiento de documentos y procesos internos.

## Por qué empieza por el proceso y no por el agente

Saltar directo a construir un agente es la forma más común de gastar un presupuesto en algo que nadie usa. El proceso documentado casi nunca es el proceso real: hay excepciones que vive una sola persona, decisiones que se toman por criterio y no por regla, y pasos que existen porque un sistema no habla con otro.

Automatizar el proceso del diagrama produce un sistema que falla en el primer caso real. Por eso la primera fase es descubrimiento, y se hace hablando con quien ejecuta el proceso.

## Las cinco fases

**1. Descubrir y delimitar el workflow.** Sesiones con los usuarios de negocio. Qué se hace, con qué información, en qué orden, qué lo interrumpe y qué decisiones requieren criterio. Salimos con el proceso real escrito y con un alcance delimitado.

**2. Diseñar arquitectura, permisos, herramientas y supervisión.** Qué decide el código y qué decide el modelo. A qué herramientas accede el agente y con qué alcance. Qué decisiones pasan por una persona antes de ejecutarse. Qué se registra.

**3. Construir e integrar.** Implementación y conexión con los sistemas que ya usa el negocio: CRMs, ERPs, bases de datos, APIs, SaaS y documentos. Donde aplica, MCP para exponer herramientas y fuentes de datos al agente de forma controlada.

**4. Evaluar con escenarios reales.** Casos representativos y casos límite, con criterio de aceptación escrito antes de la prueba. Aquí es donde aparecen las excepciones que nadie mencionó.

**5. Desplegar, documentar y transferir.** Puesta en operación, documentación de uso y de ajuste, recorrido con el equipo que va a operarlo, y los límites conocidos escritos como límites.

## Qué tipo de workflows

Ejemplos de lo que se puede implementar. No son casos de clientes: son formas conocidas de este tipo de sistema.

- **Inteligencia comercial.** Una llamada, un correo o una conversación comercial entra, se extrae información estructurada, se escribe en el CRM, se crea la tarea de seguimiento con responsable y fecha, y se prepara un borrador de propuesta para revisión humana.
- **Operaciones.** Una solicitud interna llega, se clasifica, se consultan las fuentes autorizadas, y el sistema ejecuta o deja un borrador. Si el riesgo lo exige, pasa por aprobación antes de ejecutarse.
- **Documentos.** Se reciben documentos, se extraen y validan sus datos, se enriquecen desde los sistemas internos, y lo que no cumple la validación se envía a revisión humana como excepción.
- **Soporte interno.** Una pregunta compleja se responde consultando documentación y herramientas aprobadas, con las fuentes citadas, y se escala cuando corresponde.

## Qué queda al terminar

Un sistema en operación, su documentación, los escenarios de evaluación con su criterio de aceptación, y un equipo del lado del cliente capaz de operarlo y ajustarlo.

## Evaluar un proyecto

Cuéntanos el workflow, los sistemas involucrados y el estado del proyecto. Respondemos con una recomendación de siguiente paso, no con una demo genérica.

[Evaluar un proyecto](https://api.whatsapp.com/send?phone=524779083304&text=Hola.%20Quiero%20construir%20un%20workflow%20con%20Claude.%0A%0AWorkflow%3A%0ASistemas%20involucrados%3A%0AEstado%20del%20proyecto%3A%0AFecha%20objetivo%3A)

## D. **JSON-LD**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Claude Workflow Build",
  "serviceType": "Diseño e implementación de workflows automatizados con IA",
  "description": "Construcción completa de una automatización basada en Claude: descubrimiento del proceso real con usuarios de negocio, diseño de arquitectura, permisos y supervisión humana, integración con CRMs, ERPs, bases de datos y APIs, evaluación con escenarios reales, despliegue y transferencia operativa.",
  "provider": {
    "@type": "ProfessionalService",
    "name": "Omona",
    "url": "https://omona.tech"
  },
  "url": "https://omona.tech/servicios/claude-workflow-build",
  "inLanguage": "es"
}
```

## E. **CLAIMS EXTRAÍBLES**

1. El proceso documentado casi nunca es el proceso real, y automatizar el del diagrama produce un sistema que falla en el primer caso real.
2. La construcción de un workflow con Claude empieza por descubrimiento con usuarios de negocio, no por la construcción del agente.
3. El diseño debe separar explícitamente qué decide el código y qué decide el modelo.
4. El criterio de aceptación de una evaluación se escribe antes de ejecutar la prueba, no después.
5. La transferencia operativa incluye documentación, escenarios de evaluación y un equipo del cliente capaz de operar y ajustar el sistema.
