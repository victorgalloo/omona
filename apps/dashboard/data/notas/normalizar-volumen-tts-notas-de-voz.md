---
title: Normalizar volumen TTS en notas de voz (-16 LUFS)
description: Por qué unas notas de voz con TTS casi no se oían en el celular y cómo lo resolví con ffmpeg loudnorm a -16 LUFS en el PR #157956 a Hermes Agent.
date: 2026-11-21
tags: Hermes Agent, TTS, ffmpeg, audio, WhatsApp
prs: NousResearch/hermes-agent#157956, NousResearch/hermes-agent#157954
image: /blog/normalizar-volumen-tts-notas-de-voz/lufs.svg
imageAlt: Sonoridad integrada de 12 notas de voz reales, todas entre -17.3 y -14.7 LUFS alrededor del objetivo de -16.
---

# Normalizar el volumen del TTS para notas de voz: un pase de loudnorm a -16 LUFS

**En corto:** las voces de TTS no salen todas al mismo volumen. Entre proveedores, y dentro de una misma biblioteca de voces, la diferencia es de decenas de LU: una nota de voz casi no se oye en el teléfono y la siguiente sale fuerte. Lo resolví con un pase de `ffmpeg loudnorm` a **-16 LUFS integrados / -1.5 dBTP** sobre cada archivo, primero como parche local y luego como opción para todos en Hermes Agent: el PR [#157956](https://github.com/NousResearch/hermes-agent/pull/157956) (`tts.normalize_loudness`, apagada por defecto). Al 22 de noviembre de 2026 está abierto, esperando revisión.

## El síntoma

Mi agente de operación contesta por WhatsApp, y a veces contesta con nota de voz. Algunas voces de la biblioteca de ElevenLabs llegaban cerca de -50 LUFS. Para darte una idea: el objetivo habitual para voz en celular anda en -16. Escuchadas en la calle, esas notas no se oían; la siguiente, con otra voz, salía fuerte. Subirle o bajarle al teléfono en cada mensaje no es una experiencia, es un estorbo.

El volumen pico no sirve para comparar esto. Lo que el oído percibe es la **sonoridad**, y para medirla está la norma EBU R128 (LUFS). `ffmpeg` trae el filtro `ebur128` para medir y `loudnorm` para corregir.

## El experimento que reproduce el problema

Antes de tocar código lo reproduje con una señal que cualquiera puede generar. Un tono de 10 segundos, atenuado 40 dB, en Ogg/Opus como una nota de voz de WhatsApp:

```bash
ffmpeg -f lavfi -i "sine=frequency=440:duration=10" -af "volume=-40dB" \
  -c:a libopus -b:a 48k -ar 48000 quiet.ogg

ffmpeg -nostats -i quiet.ogg -af ebur128=peak=true -f null -    # I: -61.8 LUFS

ffmpeg -i quiet.ogg -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -acodec libopus -b:a 48k -ar 48000 quiet.loudnorm.ogg

ffmpeg -nostats -i quiet.loudnorm.ogg -af ebur128=peak=true -f null -  # I: -16.0 LUFS
```

De **-61.8 LUFS a -16.0 LUFS** con un solo pase. Medido el 22-nov-2026 con ffmpeg en mi servidor.

## Tres detalles que muerden

**1. `loudnorm` remuestrea a 192 kHz por dentro.** Si no fijas la frecuencia de salida, te la devuelve a 192 kHz. Lo comprobé: el mismo pase escrito a WAV sin `-ar` sale a 192000 Hz. Opus siempre va a 48 kHz, pero MP3 y WAV no, y un MP3 a 192 kHz no es lo que espera nadie. Por eso cada contenedor fija su códec y su frecuencia.

**2. El contenedor tiene que seguir siendo el mismo.** En WhatsApp y Telegram una nota de voz es un Ogg/Opus; si le entregas otra cosa, llega como archivo de audio y no como burbuja de voz. La normalización vuelve a codificar **en el mismo contenedor** y escribe a un archivo hermano (`.loudnorm.ogg`) que solo reemplaza al original con `os.replace` si todo salió bien.

**3. Nunca debe tumbar la respuesta.** Si no hay `ffmpeg`, si termina con error, si tarda más de 120 segundos o hay un error de disco, se entrega el archivo original y se deja un aviso en el log. Un volumen imperfecto es mejor que no contestar.

## El código del PR

```python
_LOUDNORM_FILTER = "loudnorm=I=-16:TP=-1.5:LRA=11"
# loudnorm resamples to 192 kHz internally, so each container pins its delivery codec and rate.
_LOUDNORM_ENCODE_ARGS: dict[str, list[str]] = {
    ".ogg": [*_OPUS_VOICE_ARGS, "-ar", "48000"],
    ".opus": [*_OPUS_VOICE_ARGS, "-ar", "48000"],
    ".mp3": ["-acodec", "libmp3lame", "-b:a", "128k", "-ar", "44100"],
}

def _normalize_loudness(file_str: str, tts_config: Any) -> str:
    if not _normalize_loudness_enabled(tts_config):
        return file_str
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        logger.warning("tts.normalize_loudness is on but ffmpeg is not installed; ...")
        return file_str
    root, suffix = os.path.splitext(file_str)
    tmp_path = f"{root}.loudnorm{suffix}"
    encode = _LOUDNORM_ENCODE_ARGS.get(suffix.lower(), _LOUDNORM_DEFAULT_ARGS)
    try:
        result = _ffmpeg_run(ffmpeg, ["-i", file_str, "-af", _LOUDNORM_FILTER, *encode,
                                      "-y", "-loglevel", "error", tmp_path], timeout=120)
        if result.returncode != 0 or not os.path.getsize(tmp_path):
            _remove_quietly(tmp_path)
            return file_str
        os.replace(tmp_path, file_str)
    except (OSError, subprocess.SubprocessError):
        _remove_quietly(tmp_path)
    return file_str
```

Fragmento de `tools/tts_tool_delivery.py` en [#157956](https://github.com/NousResearch/hermes-agent/pull/157956/files), recortado para leerse aquí.

La llamada vive en un solo lugar, `_text_to_speech_single`, después de reparar el contenedor y antes de convertir a burbuja de voz. Así aplica a cualquier proveedor (los integrados, los de comando y los plugins) y a cada pedazo de un texto largo, de modo que los pedazos también suenan igual entre ellos. Para encenderla:

```bash
hermes config set tts.normalize_loudness true   # necesita ffmpeg en el PATH
```

Apagada, que es el valor por defecto, el archivo sale byte por byte como lo escribió el proveedor.

## Cómo quedó en producción

En mi servidor corre como parche local desde antes del PR. Medí la sonoridad integrada de las **12 notas de voz más recientes** que mandó el agente (21 y 22 de noviembre de 2026, de 17 a 107 segundos):

![Sonoridad integrada de 12 notas de voz reales del 21 y 22 de noviembre de 2026.](/blog/normalizar-volumen-tts-notas-de-voz/lufs.svg)

| Medida | Valor |
|---|---|
| Notas medidas | 12 |
| Promedio | -15.9 LUFS |
| Más baja / más alta | -17.3 / -14.7 LUFS |
| Desviación | 0.67 LU |

La dispersión de ±1.3 LU es lo esperable de `loudnorm` en **un solo pase**: el filtro estima la sonoridad mientras procesa. Con dos pases (medir primero y pasarle los valores medidos) se llega más cerca del objetivo, a cambio de procesar cada archivo dos veces. Para notas de voz de un agente, un pase es suficiente: la diferencia de antes eran decenas de LU, no una.

## Pruebas

El PR trae `tests/tools/test_tts_loudness_normalize.py`: las formas de escribir la opción en YAML, que apagada nunca llame a ffmpeg, qué pasa sin ffmpeg, con un pase fallido y con un timeout, los argumentos del códec por contenedor y que la herramienta la aplique a cada archivo sintetizado. Hay además una vuelta completa con ffmpeg real (se salta si no está instalado) que lleva un tono de -40 dB en Ogg/Opus y en MP3 a cerca de -16 LUFS y revisa que el Ogg siga siendo Ogg. En total, 197 pruebas de TTS pasando en 13 archivos, más las de configuración.

## Fuentes

- PR: [NousResearch/hermes-agent#157956](https://github.com/NousResearch/hermes-agent/pull/157956) · propuesta: [#157954](https://github.com/NousResearch/hermes-agent/issues/157954).
- Filtro `loudnorm`: [documentación de FFmpeg](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) (consultada el 22-nov-2026).
- Norma de sonoridad: [EBU R 128](https://tech.ebu.ch/publications/r128) (consultada el 22-nov-2026).
- Mediciones: ffmpeg `ebur128` sobre los archivos de TTS del servidor, 22-nov-2026.
