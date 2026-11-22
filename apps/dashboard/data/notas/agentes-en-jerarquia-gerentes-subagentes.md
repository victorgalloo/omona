---
title: Agentes en jerarquía: gerentes y subagentes para un equipo comercial
description: Cómo organicé más de cien rutinas de agentes en un organigrama con orquestador, gerentes, agentes y subagentes, con reglas de escalamiento, cambios reversibles y medición. Sobre Hermes Agent y Claude en Amazon Bedrock.
date: 2026-11-22
tags: agentes, Hermes Agent, Amazon Bedrock, arquitectura, operación
prs:
image: /blog/agentes-en-jerarquia-gerentes-subagentes/organigrama.svg
imageAlt: Organigrama de cuatro niveles: orquestador, cinco gerencias, agentes y subagentes, con las flechas de escalamiento hacia arriba.
---

# Agentes en jerarquía: gerentes y subagentes para un equipo comercial

**En corto:** cuando las rutinas de agentes pasan de cien, el problema deja de ser que cada una funcione y pasa a ser **quién se entera cuando una deja de funcionar**. Lo resolví con un organigrama: un orquestador que decide solo, cinco gerentes que mandan en su área, agentes que hacen y subagentes que hacen una sola cosa. Los gerentes no le escriben a una persona: le reportan al orquestador, y solo ciertas decisiones suben a un humano. Corre sobre [Hermes Agent](https://github.com/NousResearch/hermes-agent), con los modelos servidos por Amazon Bedrock. Aquí va el diseño, sin nombres de clientes.

## El punto de partida

El 21 de noviembre de 2026 el servidor tenía **135 rutinas programadas: 107 activas**, 7 en pausa y 21 terminadas, y **37 agentes con nombre** (contenido, SEO, anuncios, prospección, seguimiento de citas, propuestas…). Cada una tenía su prompt, su horario y su skill. Funcionaban, pero el que se enteraba de que algo se había roto era una persona, leyendo reportes sueltos en WhatsApp.

Eso no escala por una razón simple: un reporte por rutina son decenas de mensajes al día, y la persona termina haciendo de gerente de todo. Que es justo lo que no quería.

> «No me gusta el micromanagement.» — Victor Gallo, al definir cuándo debe un agente preguntarle algo (noviembre 2026)

## Cuatro niveles, una regla por nivel

![Organigrama: orquestador, cinco gerencias, agentes y subagentes. Las escalaciones suben un nivel a la vez.](/blog/agentes-en-jerarquia-gerentes-subagentes/organigrama.svg)

| Nivel | Qué hace | A quién le reporta |
|---|---|---|
| Orquestador | Decide solo; consolida y filtra lo que necesita a un humano | A las personas, y solo con una decisión real |
| Gerente (5: paid, contenido, SEO, outbound, inbound) | Manda en su área: arregla, mide, reordena horarios | Al orquestador |
| Agente | Hace el trabajo de su rutina | A su gerente |
| Subagente | Hace una sola cosa para un agente (p. ej. dar de alta en directorios) | A su agente |

La regla que sostiene todo: **cada quien escala un nivel a la vez**. Un gerente no le escribe a una persona aunque tenga prisa.

## Qué hace un gerente en cada corrida

Un gerente no hace el trabajo de sus agentes. Su corrida es corta y siempre igual:

1. **Lee los datos de su área:** KPIs de fuentes reales (lo que no tiene fuente sale como «sin dato», nunca estimado), las últimas tres corridas de cada rutina, sus excepciones abiertas y los cambios que tiene por medir.
2. **Mide lo anterior.** Cada cambio que hizo a un agente se evalúa después de tres corridas: funcionó, o se revierte.
3. **Atiende excepciones:** una rutina que falló dos corridas seguidas, una bloqueada, un KPI que cae fuerte, dos agentes que chocan. Abre la transcripción, encuentra el paso exacto y lo arregla en el prompt o la skill de **su** agente. Máximo dos cambios por corrida.
4. **Pone su semáforo** (verde, amarillo, rojo) con el motivo, y los lunes escribe un reporte de máximo ocho renglones.

Lo que le impide hacer daño es que **todo cambio es reversible antes de hacerse**. Simplificado:

```python
def cambiar(gerencia, archivo, por_que, como_se_mide):
    if tocado_recientemente(archivo):          # otra revisión lo tocó hoy o ayer
        return escalar(gerencia, "orquestador", f"{archivo} ocupado")
    respaldo = respaldar(archivo)              # copia fechada, antes de editar
    bitacora(gerencia, archivo, por_que, como_se_mide, reversa=respaldo)
    # ... el gerente edita el prompt o la skill ...

def medir(gerencia, cambio, resultado, cifra):
    if resultado == "revertir":
        restaurar(cambio.respaldo)             # vuelve solo al estado anterior
    cerrar(cambio, resultado, cifra)           # siempre con la cifra que lo decidió
```

## Cuándo sube algo a una persona

Esta es la parte que más pesa en la experiencia de quien recibe los mensajes. A un humano solo suben seis temas: **dinero, legal, compromisos con clientes, lo que sale en público a nombre de alguien, accesos y sesiones, y hablar a nombre de alguien.** Todo lo demás lo resuelve el orquestador o el gerente.

Y cuando sube, sube bien hecho:

- **Una pregunta de sí o no**, con «para decidir»: qué es, cuánto cuesta o qué falta, qué pasa si sí y qué pasa si no. Nunca una lista de decisiones ni un «¿lo corrijo?».
- **Si pide una acción, lleva la liga** que abre exactamente dónde se hace, y **cómo se comprueba sola**: el sistema revisa cada 90 segundos durante dos horas si ya quedó y la cierra sin que nadie tenga que avisar.

## Despertar solo cuando algo cambió

Si cinco gerentes corren todos los días a revisar áreas que están bien, gastan modelo en confirmar que no pasó nada. Cada gerente corre con un **monitor**: un script barato que revisa si hay excepciones nuevas, si cambió la semana o si hay un encargo abierto, y solo entonces despierta al agente. Un día sin novedades cuesta una consulta, no una corrida completa.

## Lo que aprendí armándolo

- **El primer mes es línea base, sin metas.** Poner metas a KPIs que nadie había medido antes produce gerentes que persiguen números inventados. El semáforo del primer mes no sale de la cifra; la cifra solo se muestra.
- **«Sin dato» es un valor válido.** Varias fuentes (gasto de anuncios, operaciones) no tenían de dónde leerse. Mostrarlas vacías es más honesto, y señala qué conexión falta, mejor que estimarlas.
- **Dos rutinas no deben poder tocar lo mismo.** La regla de «ocupado» (si otra revisión tocó ese archivo hoy o ayer, no lo pises: escala) evitó que dos gerentes se corrigieran uno al otro en círculo.
- **El organigrama es un dato, no un dibujo.** El árbol vive en un archivo que lee el tablero y que leen los gerentes. Si el dibujo y el código pueden diferir, van a diferir.

## Sobre qué corre

- **Hermes Agent** (Nous Research, código abierto) como runtime: rutinas programadas con monitor, skills, sesiones y el gateway de WhatsApp. Le aporto mejoras upstream: [ver mis PRs](/open-source).
- **Amazon Bedrock** para los modelos: Claude para gerentes y agentes, y un modelo de razonamiento alto para el orquestador.
- Un tablero propio que pinta el organigrama, el semáforo de cada gerente y lo que está esperando a una persona.

## Fuentes

- Hermes Agent: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent).
- Rutinas programadas de Hermes: [documentación de cron](https://hermes-agent.nousresearch.com/docs) (consultada el 22-nov-2026).
- Cifras: inventario de rutinas del servidor y organigrama aprobado el 21-nov-2026.
