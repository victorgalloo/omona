# Referencia — código del MVP (victorgalloo/omona anterior)

Este código NO se compila ni despliega. Es referencia para dos futuros caminos:

1. **`mvp-cloud-api/`** — webhook + envío de WhatsApp Cloud API del MVP
   (Next.js API routes). Cuando Omona ofrezca el canal 100% oficial sin Baileys,
   esta lógica se porta a `apps/server/src/whatsapp/` siguiendo el patrón del router dual.

2. **`mvp-langgraph/`** — motor multi-agente LangGraph (analyze→route→summarize→generate→persist).
   Migración futura del cerebro del agente si se quiere razonamiento multi-nodo
   sobre la infraestructura del monorepo.

Base real: `apps/server` (Hono + Baileys + Cloud API dual) + `apps/dashboard` (Next 14).
