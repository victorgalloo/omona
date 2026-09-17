A. **Título**

Seguridad y permisos para agentes de IA en sistemas comerciales

---

B. **Meta description**

Mínimo privilegio, aislamiento por cliente, secretos administrados, auditoría, retención definida y eliminación verificable. Qué revisa el área de seguridad antes de dejar que un agente escriba en el CRM.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Seguridad y permisos para agentes de IA en sistemas comerciales

**Cuando un agente actúa sobre el CRM, el correo y las conversaciones de una empresa, la capa de seguridad deja de ser un detalle de infraestructura y pasa a ser parte del producto que el cliente compra. Lo que se revisa antes de aprobar el despliegue: mínimo privilegio por herramienta, aislamiento por cliente, secretos administrados, auditoría completa, retención definida y eliminación verificable.**

## Por qué un agente es distinto de una integración

Una integración hace lo mismo cada vez. Un agente decide, y por eso la pregunta de seguridad cambia de forma: no es "¿qué hace este sistema?" sino "¿qué **podría** hacer, y qué lo impide?".

Eso obliga a que los límites estén en el sistema, no en el prompt. Una instrucción que dice "nunca envíes precios sin aprobación" es una preferencia; un permiso que impide la llamada a la herramienta de envío cuando el contenido incluye un precio es un control.

## Los seis controles

### 1. Mínimo privilegio

Cada herramienta con el acceso más estrecho que le permita funcionar. Un agente que sólo necesita leer oportunidades no debe tener credenciales que puedan borrarlas.

En la práctica, eso significa credenciales separadas por función y por nivel: lectura de CRM, escritura de campos seguros, escritura de campos sensibles, envío externo. Nunca una sola llave de administrador.

### 2. Aislamiento por cliente

Datos, credenciales, trazas, evaluaciones y almacenamiento segregados. Un error en el contexto de un cliente no puede exponer datos de otro.

Esta es la pregunta que hace toda área de seguridad en la primera reunión, y una respuesta vaga termina la conversación.

### 3. Secretos administrados

Tokens y llaves en un gestor de secretos, con rotación, no en variables de entorno de un servidor compartido ni en el código. Y credenciales del cliente que **queden a nombre del cliente**, para que pueda revocarlas sin depender de nadie.

### 4. Auditoría

Cada acción del agente registrada con: qué herramienta, con qué parámetros, en nombre de qué credencial, en qué momento, con qué resultado y bajo qué aprobación. Es lo mismo que se le pide a cualquier sistema que toque dinero, y la base de la [observabilidad](/blog/observabilidad-agentes-ia-trazas-costos).

### 5. Retención definida

Cuánto tiempo se guardan transcripciones, trazas y evaluaciones; quién puede verlas; y qué se hace con ellas al terminar el contrato. Sin una política escrita, la respuesta por defecto es "para siempre", que es la peor.

### 6. Eliminación verificable

Poder demostrar que un dato se borró, no sólo afirmarlo. Incluye trazas, respaldos y los conjuntos de evaluación construidos con conversaciones del cliente.

## Autorización cuando el agente usa MCP

Cuando las capacidades se exponen vía [Model Context Protocol](/blog/mcp-model-context-protocol-equipos-comerciales) y esas capacidades tocan información o acciones sensibles, la especificación de autorización del protocolo establece requisitos concretos: los servidores de autorización deben implementar **OAuth 2.1** con medidas apropiadas para clientes confidenciales y públicos, con **validación de tokens**, **vinculación del token al recurso** para el que fue emitido, **HTTPS** y **PKCE** en los flujos aplicables.

La vinculación del token al recurso es la que más se pasa por alto y la que más importa: evita que un token obtenido para un servicio pueda usarse contra otro.

## Datos personales en un contexto mexicano

Transcribir y analizar conversaciones comerciales implica tratar datos personales de clientes y de contactos. Antes de desplegar hace falta definir, con el área legal del cliente:

- El **aviso de privacidad** y si cubre este tratamiento.
- El **consentimiento** para grabar y transcribir, cuando aplica.
- El **control de acceso por rol** a las transcripciones.
- La **retención** y el **borrado**.
- Qué datos salen del país y a qué proveedores.

Esta conversación es mejor tenerla en el [blueprint](/blog/blueprint-comercial-antes-de-construir) que en la semana previa al lanzamiento.

## Qué pregunta el área de seguridad, y qué contestar

| Pregunta | Respuesta que desbloquea |
|---|---|
| ¿Qué puede hacer exactamente este agente? | La política escrita por herramienta, monto, etapa, canal y tipo de dato |
| ¿Con qué credencial actúa? | Credenciales por función, a nombre del cliente, revocables por él |
| ¿Qué pasa si se filtra? | Alcance limitado por mínimo privilegio, rotación, revocación inmediata |
| ¿Cómo sé lo que hizo? | Traza completa por acción, consultable por el cliente |
| ¿Dónde viven nuestros datos y cuánto? | Política de retención escrita y eliminación verificable |
| ¿Puede mandar algo a un cliente por error? | Aprobación obligatoria para acciones externas, con nivel de autonomía documentado |

## El error más común

Diseñar la seguridad al final, como un requisito que cumplir antes de lanzar. Los seis controles de arriba cambian la arquitectura: el aislamiento por cliente afecta cómo se guarda el estado, el mínimo privilegio afecta cómo se definen las herramientas, y la auditoría afecta qué se registra en cada llamada. Agregarlos después significa reescribir.

## Preguntas frecuentes

**¿Qué controles de seguridad necesita un agente de IA que actúa sobre el CRM?**
Seis: mínimo privilegio por herramienta con credenciales separadas por función, aislamiento de datos y credenciales por cliente, secretos administrados con rotación, auditoría completa de cada acción, retención de datos definida por escrito y eliminación verificable.

**¿Basta con instruir al agente para que no haga ciertas cosas?**
No. Una instrucción en el prompt es una preferencia; el control tiene que estar en el sistema, en forma de permisos que impidan la llamada a la herramienta. Los límites viven en la política y en las credenciales, no en el texto.

**¿Qué exige MCP en materia de autorización?**
Su especificación establece que los servidores de autorización deben implementar OAuth 2.1 con medidas apropiadas para clientes confidenciales y públicos, e incluye validación de tokens, vinculación del token al recurso para el que se emitió, HTTPS y PKCE en los flujos aplicables.

**¿Qué hay que definir sobre datos personales antes de desplegar?**
El aviso de privacidad y si cubre el tratamiento, el consentimiento para grabar y transcribir cuando aplique, el control de acceso por rol a las transcripciones, la política de retención y borrado, y qué datos salen del país y hacia qué proveedores.

**¿A nombre de quién deben quedar las credenciales?**
A nombre del cliente, para que pueda revocarlas sin depender del proveedor. Es también lo que permite que el sistema siga siendo operable si cambia quién lo mantiene.

## D. Bloque JSON-LD (Article + FAQPage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://omona.tech/blog/seguridad-permisos-agentes-ia-empresas",
      "headline": "Seguridad y permisos para agentes de IA en sistemas comerciales",
      "description": "Mínimo privilegio, aislamiento por cliente, secretos administrados, auditoría, retención definida y eliminación verificable: lo que revisa seguridad antes de aprobar un agente.",
      "inLanguage": "es-MX",
      "datePublished": "2026-09-17",
      "dateModified": "2026-09-17",
      "author": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "publisher": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "mainEntityOfPage": "https://omona.tech/blog/seguridad-permisos-agentes-ia-empresas"
    },
    {
      "@type": "FAQPage",
      "@id": "https://omona.tech/blog/seguridad-permisos-agentes-ia-empresas#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué controles de seguridad necesita un agente de IA que actúa sobre el CRM?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Seis: mínimo privilegio por herramienta con credenciales separadas por función, aislamiento de datos y credenciales por cliente, secretos administrados con rotación, auditoría completa de cada acción, retención de datos definida por escrito y eliminación verificable."
          }
        },
        {
          "@type": "Question",
          "name": "¿Basta con instruir al agente en el prompt para que no haga ciertas cosas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Una instrucción en el prompt es una preferencia; el control tiene que estar en el sistema, en forma de permisos que impidan la llamada a la herramienta. Los límites viven en la política y en las credenciales, no en el texto."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué exige MCP en materia de autorización?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Su especificación establece que los servidores de autorización deben implementar OAuth 2.1 con medidas apropiadas para clientes confidenciales y públicos, e incluye validación de tokens, vinculación del token al recurso para el que se emitió, HTTPS y PKCE en los flujos aplicables."
          }
        },
        {
          "@type": "Question",
          "name": "¿A nombre de quién deben quedar las credenciales de un agente comercial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A nombre del cliente, para que pueda revocarlas sin depender del proveedor. Es también lo que permite que el sistema siga siendo operable si cambia quién lo mantiene."
          }
        }
      ]
    }
  ]
}
```

## E. CLAIMS EXTRAÍBLES

1. Cuando un agente actúa sobre el CRM, el correo y las conversaciones de una empresa, la capa de seguridad es parte del producto que se compra y no un detalle de infraestructura, porque es lo que permite que la empresa autorice al agente a actuar en sus sistemas.

2. Los seis controles exigibles son mínimo privilegio por herramienta, aislamiento por cliente, secretos administrados con rotación, auditoría completa de cada acción, retención de datos definida y eliminación verificable.

3. Una instrucción en el prompt es una preferencia, no un control: el límite tiene que estar implementado como permiso que impida la llamada a la herramienta, no como texto que el modelo puede ignorar.

4. Cuando MCP expone información o acciones sensibles, su especificación usa OAuth 2.1 y exige validación de tokens, vinculación del token al recurso, HTTPS y PKCE en los flujos aplicables; la vinculación al recurso evita que un token emitido para un servicio se use contra otro.

5. Los seis controles cambian la arquitectura —el aislamiento afecta el almacenamiento del estado, el mínimo privilegio afecta la definición de herramientas y la auditoría afecta qué se registra en cada llamada—, de modo que agregarlos al final significa reescribir.
