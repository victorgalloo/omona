---
title: El choque de credenciales de Bedrock en Hermes Agent: del parche local al arreglo upstream
description: Un perfil con AWS_PROFILE y AWS_BEARER_TOKEN_BEDROCK tumbaba el cliente AnthropicBedrock de Hermes Agent. Cómo lo encontré, el reporte #146546 y el arreglo #146559.
date: 2026-11-22
tags: Hermes Agent, Amazon Bedrock, Python, open source
prs: NousResearch/hermes-agent#146546, NousResearch/hermes-agent#146559
image: /blog/bedrock-credenciales-hermes-agent/flujo.svg
imageAlt: Antes, el SDK recibía el perfil de AWS y además leía la llave de Bedrock del entorno, y fallaba. Después, una sola forma de autenticarse llega al cliente.
---

# El choque de credenciales de Bedrock en Hermes Agent: del parche local al arreglo upstream

**En corto:** si un perfil de [Hermes Agent](https://github.com/NousResearch/hermes-agent) tenía a la vez `AWS_PROFILE` y `AWS_BEARER_TOKEN_BEDROCK`, el cliente nativo de Claude en Amazon Bedrock fallaba al construirse con `Cannot specify both api_key and AWS credentials`. Lo reporté como [#146546](https://github.com/NousResearch/hermes-agent/issues/146546) el 29 de octubre de 2026, lo parché en mi servidor mientras tanto, y el arreglo lo mandó otro contribuidor, [linye157](https://github.com/linye157), en el PR [#146559](https://github.com/NousResearch/hermes-agent/pull/146559). Al 22 de noviembre de 2026 ese PR sigue abierto, en revisión.

Lo cuento porque es el tipo de bug que no se ve en una prueba corta y sí en producción, y porque el arreglo tiene una idea que sirve fuera de Hermes.

## Cómo se veía desde fuera

Corro Hermes Agent como agente de operación: un gateway de WhatsApp y un montón de rutinas programadas, con Claude servido por Amazon Bedrock. Las conversaciones cortas funcionaban. Las largas se cortaban a media respuesta, sin aviso para quien estaba del otro lado del chat.

El log decía esto:

```text
ERROR gateway.run: Agent error in session …
ValueError: Cannot specify both `api_key` and AWS credentials
(`aws_access_key`, `aws_secret_key`, `aws_session_token`, `aws_profile`)
```

Que fallara solo en las largas era la pista. Hermes no llama al modelo una sola vez por turno: también lo usa para **compactar el contexto** cuando la conversación crece, para **generar el título** de la sesión, para las aprobaciones inteligentes y para visión. Todos esos clientes auxiliares salen de la misma función que construye el cliente de Bedrock. Una conversación larga llega a la compactación, la compactación construye un cliente, el cliente truena, y el turno se muere.

## La causa

En el camino nativo de Anthropic sobre Bedrock (`api_mode: anthropic_messages`), `build_anthropic_bedrock_client()` le pasaba al SDK el perfil de AWS que resolvía para la sesión y **nunca** le pasaba `api_key`. El detalle está en el SDK de Anthropic (0.125.0): con `api_key=None`, el constructor de `AnthropicBedrock` va a buscar `AWS_BEARER_TOKEN_BEDROCK` al entorno del proceso por su cuenta. Encuentra la llave, ve que además le diste un perfil, y rechaza la combinación.

Se reproduce con el SDK solo, sin Hermes:

```bash
AWS_BEARER_TOKEN_BEDROCK=dummy python -c '
import anthropic
anthropic.AnthropicBedrock(aws_region="us-east-1", aws_profile="default")'
# ValueError: Cannot specify both `api_key` and AWS credentials ...
```

Había un segundo problema escondido detrás del primero. Hermes puede atender varios perfiles en el mismo proceso, cada uno con sus secretos. Si el perfil enrutado traía **solo** la llave de Bedrock, el SDK no leía la de ese perfil: leía la del entorno del proceso, o sea la del perfil con el que arrancó el gateway. Funcionaba, pero con la credencial equivocada.

![Antes: dos credenciales llegan al SDK y el constructor falla. Después: una sola, elegida por precedencia.](/blog/bedrock-credenciales-hermes-agent/flujo.svg)

## El arreglo de #146559

La propuesta del PR es elegir **una sola** forma de autenticarse y hacerlo explícito. La llave de Bedrock del perfil enrutado gana; si no hay, se usan las credenciales de IAM o el perfil de AWS; si no hay nada, queda la cadena por defecto de AWS.

El truco está en cómo se le gana al SDK, que no tiene una opción para apagar su lectura del entorno. El constructor recibe una llave explícita (vacía si no hay) y ningún argumento de IAM, y la autenticación elegida se instala en los atributos públicos del cliente antes de devolverlo:

```python
bearer = resolve_bedrock_bearer_token()
scoped = {} if bearer else scoped_aws_session_kwargs()
# ...
# The SDK has no opt-out for its process-env bearer fallback. Construct without IAM arguments
# and with an explicit key, then install the selected auth before publishing the client.
client = sdk.AnthropicBedrock(
    api_key=bearer or "", aws_region=region, timeout=_client_timeout(timeout),
)
client.api_key = bearer or None
for name, value in aws_kwargs.items():
    if value:
        setattr(client, name, value)
return client
```

Fragmento del diff de [#146559](https://github.com/NousResearch/hermes-agent/pull/146559) (autor: linye157).

Dos decisiones de ese diff me parecen buenas en general:

1. **No tocar `os.environ`.** Borrar la variable del entorno antes de construir el cliente habría "funcionado", pero en un proceso que atiende varios perfiles a la vez eso es una carrera: otro hilo puede estar construyendo su propio cliente en ese momento.
2. **Probar lo que sale por el cable, no lo que se configuró.** Las pruebas del PR firman peticiones reales con el SDK y botocore, interceptan el envío HTTP y revisan el encabezado `Authorization`: que diga `Bearer` cuando toca la llave y que sea una firma SigV4 con su token de sesión cuando toca IAM. También cambian de perfil A → B → A para ver que no se cruzan.

El autor reporta 296 pruebas pasando en las suites de Bedrock y Anthropic. En la revisión, otra persona corrió el PR con `anthropic` 1.9 y vio 7 fallas; no eran del arreglo, sino de un cambio de `httpx` en esa versión del SDK, fuera de las versiones que fija el repositorio. Es un buen recordatorio de que "falla en mi máquina" en un PR casi siempre es primero una pregunta de entorno.

## Lo que hice de mi lado

- **Reproducir con el SDK solo** antes de culpar a Hermes. Con esas dos líneas de arriba quedó claro dónde estaba la decisión que fallaba.
- **Parchar en local y documentarlo.** Mientras no hay arreglo en `main`, el servidor corre con un parche marcado como `LOCAL PATCH`, y tengo una tabla de qué parche local corresponde a qué PR, para quitarlo cuando el arreglo llegue con la actualización.
- **Reportar con lo necesario para arreglarlo:** el error exacto, la función, la versión del SDK, la reproducción mínima, el impacto (los clientes auxiliares) y la relación con el issue vecino [#132685](https://github.com/NousResearch/hermes-agent/issues/132685), que se parece pero es otro bug.

> «Eso es lo que más me gusta del open source: no esperas a que un proveedor te conteste. Lo arreglas, lo compartes y le sirve a todos.» — Victor Gallo, en LinkedIn (noviembre 2026)

## Si corres Hermes en Bedrock hoy

Mientras #146559 no esté en `main`:

- Usa **una** forma de autenticarte por perfil: la llave de Bedrock (`AWS_BEARER_TOKEN_BEDROCK`) **o** un perfil/credenciales de IAM, no las dos.
- Si el gateway atiende varios perfiles, no dejes la llave de Bedrock en el entorno del proceso que lo arranca: vive en el `.env` de cada perfil.
- Si las conversaciones largas se cortan y las cortas no, busca el error en la compactación de contexto antes que en el modelo.

## Fuentes

- Reporte: [NousResearch/hermes-agent#146546](https://github.com/NousResearch/hermes-agent/issues/146546) (Victor Gallo, 29-oct-2026).
- Arreglo: [NousResearch/hermes-agent#146559](https://github.com/NousResearch/hermes-agent/pull/146559) (linye157), abierto al 22-nov-2026.
- Guía de Bedrock de Hermes: [website/docs/guides/aws-bedrock.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/aws-bedrock.md).
- Llaves de API de Amazon Bedrock: [documentación de AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) (consultada el 22-nov-2026).
