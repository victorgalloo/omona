A. **Título**

Cómo evaluar un agente comercial antes de dejarlo hablar con un cliente

---

B. **Meta description**

Un agente sin conjunto de evaluación es una apuesta en producción. Las ocho dimensiones que hay que probar —selección, grounding, política, acción, CRM, comunicación, escalamiento y negocio— y cómo se arma el set.

---

C. **Artículo en Markdown**

Actualizado septiembre 2026

# Cómo evaluar un agente comercial antes de dejarlo hablar con un cliente

**Evaluar un agente comercial no es leer tres respuestas y decidir si "suenan bien". Es probar la trayectoria completa: si eligió la cuenta correcta, si usó datos vigentes, si respetó la política, si llamó la herramienta correcta con parámetros válidos, si dejó el CRM en el estado esperado, si el mensaje fue adecuado, si reconoció su propia incertidumbre y si la acción produjo el cambio buscado. Ocho dimensiones, y el texto es sólo una.**

Es también la parte del trabajo que casi nadie vende, porque no se demuestra en una llamada de treinta minutos. Y es justamente la que decide si el sistema es desplegable.

## Las ocho dimensiones

| Dimensión | Pregunta de evaluación |
|---|---|
| **Selección** | ¿Eligió la cuenta u oportunidad correcta? |
| **Grounding** | ¿Usó únicamente datos disponibles y vigentes? |
| **Política** | ¿Respetó permisos, etapa, canal y aprobación? |
| **Acción** | ¿Llamó la herramienta correcta con parámetros válidos? |
| **CRM** | ¿Actualizó objetos y campos sin duplicar ni corromper datos? |
| **Comunicación** | ¿El mensaje fue adecuado al contexto, a la marca y al español local? |
| **Escalamiento** | ¿Reconoció incertidumbre y pidió intervención? |
| **Negocio** | ¿La acción produjo el cambio operativo o comercial buscado? |

Nótese que sólo una fila —comunicación— habla del texto generado, que es lo único que evalúa la mayoría de las implementaciones. Las otras siete son de comportamiento, y son donde están los errores caros.

## Por qué el texto no basta

Un agente puede escribir un correo impecable y aun así estar equivocado en todo lo demás: dirigido a la cuenta que no tocaba, citando un dato de hace seis meses, saltándose una aprobación requerida, creando un contacto duplicado y sin registrar la actividad.

Ninguno de esos errores se ve leyendo el correo. Todos se ven evaluando la trayectoria.

## Cómo se arma el conjunto de evaluación

**Origen de los casos.** Empieza con 30 a 50 casos construidos a partir de escenarios comerciales diseñados —porque al inicio no hay autorización para usar datos reales— y sustitúyelos gradualmente por casos reales anonimizados del cliente, con permiso explícito. Un set que sólo tiene ejemplos sintéticos mide qué tan bien el agente resuelve los problemas que su autor imaginó.

**Qué casos incluir.** La tentación es llenar el set con casos limpios. Los que valen son los otros:

- La conversación donde el cliente dijo dos cosas contradictorias.
- La cuenta con tres contactos y ningún decisor identificado.
- El registro con el campo de presupuesto lleno con "por definir".
- La oportunidad que parece estancada pero tiene una reunión agendada fuera del CRM.
- El mensaje que pide un descuento que requiere autorización.
- La conversación en la que el cliente está molesto.

**El criterio se escribe antes.** Para cada caso se define qué es una respuesta correcta antes de ver qué contesta el agente. De lo contrario el criterio se acomoda a la salida, que es la forma más común y más silenciosa de no evaluar nada.

**Pruebas de regresión.** Cada cambio de prompt, de herramienta o de modelo vuelve a correr el set completo. El objetivo no es que todo pase: es ver qué se rompió al arreglar otra cosa.

## Evaluar en desarrollo y en producción

Las dos cosas, y miden cosas distintas.

**En desarrollo** el set es fijo y la pregunta es "¿este cambio mejoró o empeoró?". Es rápido, barato y reproducible.

**En producción** la pregunta es "¿el comportamiento real se parece al evaluado?". Se responde muestreando trayectorias reales, revisándolas contra los mismos criterios y midiendo la deriva. Un agente que pasaba el set en marzo y falla en agosto normalmente no cambió: cambiaron los datos, el proceso o el tipo de conversación que le llega.

## Qué se mide en cada corrida

Una corrida útil reporta, por dimensión:

- Casos que pasan y casos que fallan, con el caso concreto.
- Qué cambió respecto a la corrida anterior.
- Cuáles fallas son nuevas y cuáles son conocidas y aceptadas.
- Costo y latencia, que también son criterios de aceptación.

Una corrida donde todo pasa es sospechosa: o el set es demasiado fácil o el criterio se escribió después.

## Por qué esto es la ventaja difícil de copiar

Un conector de CRM lo construye cualquiera en dos semanas. Un conjunto de evaluación construido con casos reales autorizados de un sector concreto, con criterios escritos y regresiones acumuladas, tarda meses y no se puede copiar de un repositorio.

Esa es la razón por la que la propiedad intelectual del trabajo vive en las evaluaciones, los datasets autorizados, la observabilidad y la operación —no en el prompt, que se replica en una tarde.

## Errores frecuentes

- **Evaluar sólo el final.** Si el criterio es "¿el resultado fue bueno?", no se sabe cuál de los ocho pasos falló.
- **Usar el mismo set para desarrollar y para aceptar.** Optimizar contra el set que después sirve de examen produce un agente que aprobó copiando.
- **No versionar el set.** Sin versión, "pasó el 92%" no significa nada porque no se sabe contra qué.
- **Dejarlo para el final.** El set se construye durante el [blueprint](/blog/blueprint-comercial-antes-de-construir), antes de escribir el agente. Si se construye después, describe lo que el agente ya hace.

## Preguntas frecuentes

**¿Qué es una evaluación (eval) de un agente de IA comercial?**
Es un conjunto de casos con criterio de corrección escrito de antemano que prueba la trayectoria completa del agente: selección de la cuenta, uso de datos vigentes, respeto de la política, llamada correcta de herramientas, estado final del CRM, calidad del mensaje, reconocimiento de incertidumbre y efecto comercial.

**¿Cuántos casos debe tener un conjunto de evaluación?**
De 30 a 50 casos es un punto de partida razonable para un movimiento comercial acotado. Lo que importa más que la cantidad es que incluyan los casos difíciles —contradicciones, datos faltantes, peticiones que requieren autorización, clientes molestos— y no sólo los limpios.

**¿Se pueden usar conversaciones reales de clientes para evaluar?**
Sí, anonimizadas y con autorización explícita. El camino habitual es empezar con escenarios diseñados y sustituirlos gradualmente por casos reales anonimizados conforme se obtienen los permisos.

**¿Cada cuánto hay que volver a correr las evaluaciones?**
En cada cambio de prompt, herramienta o modelo, y de forma periódica sobre tráfico real para detectar deriva. Un agente que pasaba el set hace meses y falla ahora normalmente no cambió: cambiaron los datos o el tipo de conversación que recibe.

**¿Una corrida donde todo pasa es buena señal?**
Normalmente no. O el conjunto es demasiado fácil, o el criterio de corrección se escribió después de ver la salida del agente, que es la forma más común de no evaluar nada.

## D. Bloque JSON-LD (Article + FAQPage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://omona.tech/blog/evaluaciones-agentes-comerciales-evals",
      "headline": "Cómo evaluar un agente comercial antes de dejarlo hablar con un cliente",
      "description": "Las ocho dimensiones de una evaluación de agente comercial: selección, grounding, política, acción, CRM, comunicación, escalamiento y negocio.",
      "inLanguage": "es-MX",
      "datePublished": "2026-09-17",
      "dateModified": "2026-09-17",
      "author": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "publisher": { "@type": "Organization", "name": "Omona", "url": "https://omona.tech" },
      "mainEntityOfPage": "https://omona.tech/blog/evaluaciones-agentes-comerciales-evals"
    },
    {
      "@type": "FAQPage",
      "@id": "https://omona.tech/blog/evaluaciones-agentes-comerciales-evals#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es una evaluación (eval) de un agente de IA comercial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Es un conjunto de casos con criterio de corrección escrito de antemano que prueba la trayectoria completa del agente: selección de la cuenta, uso de datos vigentes, respeto de la política, llamada correcta de herramientas, estado final del CRM, calidad del mensaje, reconocimiento de incertidumbre y efecto comercial."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuántos casos debe tener un conjunto de evaluación?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "De 30 a 50 casos es un punto de partida razonable para un movimiento comercial acotado. Importa más que incluyan los casos difíciles —contradicciones, datos faltantes, peticiones que requieren autorización, clientes molestos— que la cantidad."
          }
        },
        {
          "@type": "Question",
          "name": "¿Se pueden usar conversaciones reales de clientes para evaluar un agente?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, anonimizadas y con autorización explícita. El camino habitual es empezar con escenarios diseñados y sustituirlos gradualmente por casos reales anonimizados conforme se obtienen los permisos."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cada cuánto hay que volver a correr las evaluaciones?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En cada cambio de prompt, herramienta o modelo, y de forma periódica sobre tráfico real para detectar deriva. Un agente que pasaba el set hace meses y falla ahora normalmente no cambió: cambiaron los datos o el tipo de conversación que recibe."
          }
        }
      ]
    }
  ]
}
```

## E. CLAIMS EXTRAÍBLES

1. Evaluar un agente comercial exige probar la trayectoria completa en ocho dimensiones —selección, grounding, política, acción, CRM, comunicación, escalamiento y negocio— y no sólo la calidad del texto generado, que es una sola de ellas.

2. Un agente puede escribir un correo impecable y estar equivocado en todo lo demás: dirigido a la cuenta incorrecta, citando datos vencidos, saltándose una aprobación y creando registros duplicados; ninguno de esos errores se detecta leyendo el mensaje.

3. El criterio de corrección de cada caso debe escribirse antes de ver la salida del agente; escribirlo después es la forma más común y más silenciosa de no evaluar nada.

4. Las evaluaciones deben correrse tanto en desarrollo, con un set fijo para saber si un cambio mejoró o empeoró, como en producción, muestreando trayectorias reales para detectar deriva de comportamiento.

5. La ventaja difícil de copiar de un proveedor de agentes comerciales no está en el prompt, que se replica en una tarde, sino en el conjunto de evaluación construido con casos reales autorizados, criterios escritos y regresiones acumuladas.
