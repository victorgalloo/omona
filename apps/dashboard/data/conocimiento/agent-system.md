---
title: My agent system
orden: 60
linea: An org chart of agents: manager, agent and subagent, each with its own area.
lang: en
par: sistema-de-agentes
fondo: /blog/agentes-en-jerarquia-gerentes-subagentes
fondo_texto: Full note: agents in a hierarchy (Spanish)
---
- One rule holds it together: everyone escalates one level at a time.
  - Orchestrator: decides, and filters what truly needs a person.
  - Manager: owns its area, measures and corrects its agents.
  - Agent: does the work of its routine. Subagent: one single thing.
- Scheduled routines that wake up only when something changed.
  - A cheap monitor checks first. No news, no model spend.
- Deterministic guardrails
  - Every change is reversible before it happens: backup and a rollback note.
  - Measured after three runs. If it did not work, it is rolled back.
  - Only money, legal, access and public posts in someone's name go up to a person.
- Runs on Hermes Agent and Claude on Amazon Bedrock.
  - Open template: [bedrock-agent-hierarchy](https://github.com/victorgalloo/bedrock-agent-hierarchy).
