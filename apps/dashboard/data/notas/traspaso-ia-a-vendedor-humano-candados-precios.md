---
title: "Traspaso de IA a humano sin inventar precios"
description: "Traspaso de un agente de IA de ventas a un vendedor humano sin precios inventados: medición de 558 sitios hispanos en EE. UU., candado en código y resumen."
date: 2026-11-28
updated: 2026-11-28
tags: traspaso a humano, handoff, candados de precio, agentes de ia para negocios, calificación de leads, negocios latinos estados unidos, whatsapp
image: /blog/traspaso-ia-a-vendedor-humano-candados-precios/fuente-de-precio-camaras-hispanas.svg
imageAlt: De 558 portadas de miembros de cámaras hispanas en EE. UU., 83.3 % no tiene fuente pública de precio y 16.8 % pide cotizar
lang: es
alternate: ai-to-human-handoff-sales-guardrails
---

# Traspaso de un agente de IA a un vendedor humano: contestar rápido sin inventar un solo precio

**Respuesta corta:** a un asistente de ventas con IA no se le juzga por lo platicador, sino por dos momentos: **el precio que tiene permitido decir** y **el momento en que le pasa el cliente a una persona** (*handoff*). Los dos van en código, no en el *prompt*. El asistente solo cotiza lo que está en una lista de precios con versión; cualquier monto que no esté ahí bloquea el mensaje y dispara un **traspaso con contexto**: el vendedor recibe la conversación con un resumen de un párrafo y el cliente no repite nada. Nuestra medición muestra por qué importa en negocios latinos de EE. UU.: de **558 portadas de miembros de cámaras hispanas**, **83.3 % no publica ninguna fuente de precio** (ni precio de venta ni página de precios). Un asistente conectado a esos sitios no tiene de dónde cotizar. Sin lista de precios, o se niega a contestar o se lo inventa.

![¿De dónde sacaría el precio un agente de IA? 558 portadas de cámaras hispanas en EE. UU.](/blog/traspaso-ia-a-vendedor-humano-candados-precios/fuente-de-precio-camaras-hispanas.svg)

## 1. Dato propio: ¿de dónde sacaría el precio un agente de IA?

El 28 de noviembre de 2026 volvimos a leer las portadas públicas de los sitios activos de dos directorios públicos ChamberMaster, la **Fort Worth Hispanic Chamber of Commerce (TX)** y la **Statewide Hispanic Chamber of Commerce of New Jersey**: la misma muestra de nuestra [guía de recepcionista bilingüe con IA](/blog/recepcionista-bilingue-ia-negocios-latinos). Un GET pasivo por portada, solo texto visible (sin *scripts*), sin enviar formularios ni abrir chats, 0 `.edu` y 0 fichas de gobierno. Contamos las 558 portadas con al menos 30 palabras visibles. Tardó 31 segundos y gastó 0 tokens de LLM.

| Señal en la portada pública (`n = 558`) | Sitios | % | Qué significa para un asistente de IA |
|---|---:|---:|---|
| Precio de venta en el texto (p. ej. «desde $79», «$55/mo») | 55 | 9.9 % | Hay *algún* precio público de referencia |
| Liga a página de precios, planes, paquetes o menú | 51 | 9.1 % | La lista existe a un clic |
| **Sin fuente pública de precio** (ninguna de las dos) | 465 | **83.3 %** | El asistente necesita una lista que tú le das |
| Pide cotizar a la medida («free estimate», «get a quote», «cotización») | 94 | 16.8 % | El precio lo pone una persona: ahí va el traspaso |
| Cotiza **y** no tiene ningún precio público | 82 | 14.7 % | Toda pregunta de precio va a un humano |
| Promete una persona («talk to a human», «hable con un asesor») | 10 | 1.8 % | Casi nadie dice cuándo entra un humano |
| Promete tiempo de respuesta («respondemos en 24 horas») | 5 | 0.9 % | El cliente no sabe cuándo le contestan |

Por sector (sectores con 15 sitios o más):

| Sector | Sitios | Sin precio público | Cotización a la medida | Cotiza sin precio público |
|---|---:|---:|---:|---:|
| Construcción y contratistas | 71 | 90.1 % | 38.0 % | 33.8 % |
| Finanzas y seguros | 82 | 78.0 % | 25.6 % | 22.0 % |
| Legal | 18 | 88.9 % | 22.2 % | 16.7 % |
| Salud | 29 | 79.3 % | 13.8 % | 13.8 % |
| Restaurantes y alimentos | 25 | 48.0 % | 12.0 % | 4.0 % |
| Comercio minorista | 20 | 55.0 % | 5.0 % | 5.0 % |

Y el cruce que más importa: de los **64 sitios que ya tienen chat, SMS o WhatsApp**, **75.0 % no tiene fuente pública de precio**. El canal existe; la fuente de verdad, no.

Cómo leerlo: un GET no ve precios que se pintan después con JavaScript, y un precio puede vivir en un PDF o en un cotizador. Las cifras son un **piso**. Excluimos montos que describen logros («$5M recovered», «$130 million restoration»): solo cuentan cifras junto a palabras de venta («from», «only», «per month», «/mo», «desde»).

## 2. Un precio inventado es problema del negocio, no del bot

En *Moffatt v. Air Canada* ([2024 BCCRT 149](https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do), 14 de febrero de 2024), el chatbot de la aerolínea le dijo a un cliente que podía pedir tarifa por duelo después de viajar. No era la política de la aerolínea. El Civil Resolution Tribunal de Columbia Británica condenó a Air Canada a pagar **812.02 dólares canadienses** y rechazó que el chatbot fuera responsable de sus propias palabras: *«Debería ser obvio para Air Canada que es responsable de toda la información de su sitio web. No hace diferencia si viene de una página estática o de un chatbot»* (traducción nuestra).

Para un contratista o una oficina de impuestos aplica igual a un descuento, una garantía, una zona de servicio o una fecha de entrega: el cliente te va a cobrar lo que tu asistente escribió.

La velocidad sigue contando. En *The Short Life of Online Sales Leads* ([Harvard Business Review, 2011](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)), 2,241 empresas de EE. UU. tardaban **42 horas en promedio** en contestar un lead web, y las que contestaban en menos de una hora tenían **casi 7 veces más probabilidad de calificarlo**. El diseño busca las dos cosas: contestar en segundos y detenerse justo a tiempo.

## 3. Traspaso con contexto vs. transferencia en frío vs. sin traspaso

| | Sin traspaso | Transferencia en frío | Traspaso con contexto (lo que diseñamos) |
|---|---|---|---|
| Qué recibe la persona | Nada; el bot sigue hablando | La transcripción cruda o «llame a este número» | Un bloque: quién, canal, idioma, necesidad, qué se contestó, pregunta abierta, siguiente paso |
| El cliente repite todo | No aplica | Sí | No |
| Quién decide el precio | El modelo (riesgo) | La persona, sin contexto | La persona, con la versión de la lista y la pregunta exacta |
| Idioma | El que el modelo eligió | Muchas veces solo inglés | El mismo que usó el cliente, español o inglés |
| Cuándo se dispara | Nunca | Cuando el bot falla | Con reglas escritas en código (abajo) |

En un *call center*, una *warm transfer* es cuando el agente se queda en la línea y presenta al cliente con la siguiente persona. En canales de texto el equivalente es el resumen de traspaso: la persona empieza ya sabiendo qué pasó.

## 4. Candados en código: un validador de precios que puedes correr

El modelo redacta; el código decide si se envía. Esta es una versión mínima y ejecutable del filtro que va entre el modelo y WhatsApp, SMS o el chat web:

```python
import re

PRICE_SHEET = {  # versioned, the only source of prices the assistant may quote
    "version": "2026-11-28",
    "items": {"water heater install": 1450, "service call": 89},
}
HANDOFF_WORDS = re.compile(r"\b(human|person|agent|manager|persona|asesor|emergency|emergencia|lawyer|abogado)\b", re.I)
MONEY = re.compile(r"\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)")


def check_reply(customer_msg: str, draft: str) -> dict:
    """Runs in code AFTER the model writes and BEFORE anything is sent."""
    if HANDOFF_WORDS.search(customer_msg):
        return {"send": False, "handoff": "customer asked for a person or it is urgent"}
    allowed = {float(p) for p in PRICE_SHEET["items"].values()}
    quoted = {float(m.replace(",", "")) for m in MONEY.findall(draft)}
    unknown = quoted - allowed
    if unknown:
        return {"send": False, "handoff": f"price not in sheet {PRICE_SHEET['version']}: {sorted(unknown)}"}
    return {"send": True, "handoff": None}
```

Resultado en tres turnos de ejemplo:

| Cliente | Borrador del modelo | Resultado del candado |
|---|---|---|
| «how much to install a water heater?» | «Installation is $1,450, parts included.» | `send: True` |
| «can you do it cheaper?» | «Sure, I can do it for $1,200 today.» | `send: False` · precio fuera de la lista 2026-11-28: `[1200.0]` |
| «quiero hablar con una persona» | «Claro, el servicio cuesta $89.» | `send: False` · el cliente pidió una persona |

La segunda fila es el punto: el modelo quiso ayudar e inventó un descuento. El candado lo bloquea y abre un traspaso. Una versión de producción hace lo mismo con fechas, zonas de servicio y garantías, y registra cada bloqueo para ver qué preguntas le faltan a tu lista de precios.

## 5. Reglas de traspaso: cuándo el asistente debe parar

Escríbelas en código, no como sugerencias amables en un *prompt*:

1. **El cliente pide una persona**, en cualquier idioma («persona», «asesor», «human», «manager»).
2. **Un precio, descuento, fecha o condición no está en la lista.** El asistente dice que una persona lo confirma y pasa el caso.
3. **Negocios que cotizan a la medida.** Si tu sitio dice «free estimate» (38.0 % de los sitios de construcción de la muestra), el asistente califica y agenda la visita; el precio lo pone la persona.
4. **Emergencias, quejas o palabras legales.** Fugas, lesiones, «abogado», contracargos: alto y traspaso inmediato.
5. **Dos turnos sin avance.** Si el asistente no logra mover la conversación al siguiente estado, entra una persona.

Ejemplo del resumen que recibe el vendedor (cliente ficticio):

```text
Lead: María R. · WhatsApp · español · primer contacto 10:42
Necesidad: cambio de boiler de 50 gal, Fort Worth 76107
Contestado: visita de servicio $89 (lista 2026-11-28), disponibilidad esta semana
Pregunta abierta: pidió descuento en la instalación -> bloqueado, necesita tu precio
Siguiente paso: llamar o escribir hoy; prefiere texto después de las 5 pm
```

## 6. El mismo patrón, en código abierto

La regla «solo un nivel habla con el humano, y con una sola pregunta clara» no es exclusiva de ventas. En nuestra plantilla abierta [bedrock-agent-hierarchy](https://github.com/victorgalloo/bedrock-agent-hierarchy) (Apache-2.0, Amazon Bedrock), `agent_hierarchy/escalation.py` la hace cumplir en código: un subagente solo puede escalar a su gerente, solo el orquestador llega a un humano, el tema debe ser de una lista cerrada (`money`, `legal`, `external_commitment`, `public_post`, `access`, `speak_for_someone`) y una escalación a humano se rechaza si no es exactamente una pregunta que termina en `?` con qué pasa si dice que sí y qué pasa si dice que no. Un asistente de ventas tiene la misma forma: el agente que habla con el cliente nunca contesta preguntas de dinero.

## 7. Plan de siete días

- [ ] **Día 1:** escribe la lista de precios que el asistente puede cotizar, en español e inglés, con fecha de versión.
- [ ] **Día 2:** anota tus reglas de traspaso (las cinco de arriba) y quién recibe cada una.
- [ ] **Día 3:** define los campos del resumen que tus vendedores sí leen.
- [ ] **Día 4:** pon el candado de precios entre el modelo y cada canal; registra cada bloqueo.
- [ ] **Día 5:** agrega una línea visible en tu sitio: «Una persona contesta en X minutos en horario hábil» (solo 0.9 % de las portadas promete un tiempo).
- [ ] **Día 6:** mide tu portada con nuestro [verificador gratuito de embudo bilingüe](/verificador-embudo-bilingue).
- [ ] **Día 7:** prueba 10 conversaciones que intenten sacar un descuento, en español, inglés y spanglish, antes de salir en vivo.

## Preguntas frecuentes

**¿Qué es un traspaso de chatbot a humano con contexto?** El asistente se detiene y una persona sigue la misma conversación con un resumen de quién es el cliente, qué necesita y qué ya se le contestó. El cliente no repite nada.

**¿Cómo evito que un agente de IA invente precios?** No confíes en el *prompt*. Revisa en código cada mensaje de salida contra una lista de precios con versión y bloquea cualquier monto que no esté. Un mensaje bloqueado se vuelve traspaso, no error.

**¿Tengo que publicar precios en mi sitio antes?** No. 83.3 % de las portadas que medimos no publica ninguno. El asistente necesita una lista privada; tu sitio puede seguir pidiendo cotización.

Más del área comercial en [Procesos comerciales + IA de Omona](/comercial-ia). Versión en inglés: [AI-to-human handoff: warm transfer + guardrails](/blog/ai-to-human-handoff-sales-guardrails).
