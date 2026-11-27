---
title: Mi sistema de agentes
orden: 60
linea: Un organigrama de agentes: gerente, agente y subagente, cada quien con su área.
lang: es
par: agent-system
fondo: /blog/agentes-en-jerarquia-gerentes-subagentes
fondo_texto: Nota completa: agentes en jerarquía
---
- Una regla sostiene todo: cada quien escala un nivel a la vez.
  - Orquestador: decide y filtra lo que de verdad necesita a una persona.
  - Gerente: manda en su área, mide y corrige a sus agentes.
  - Agente: hace el trabajo de su rutina. Subagente: una sola cosa.
- Rutinas programadas que despiertan solo si algo cambió.
  - Un monitor barato revisa primero. Sin novedad, no gasta modelo.
- Candados deterministas
  - Todo cambio es reversible antes de hacerse: respaldo y nota de reversa.
  - Se mide tras tres corridas. Si no funcionó, se revierte.
  - A una persona solo sube dinero, legal, accesos y lo público a nombre de alguien.
- Corre sobre Hermes Agent y Claude en Amazon Bedrock.
  - Plantilla abierta: [bedrock-agent-hierarchy](https://github.com/victorgalloo/bedrock-agent-hierarchy).
