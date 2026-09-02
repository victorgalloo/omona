# Checkpoint — P0: aislamiento multi-tenant

> **Estado:** trabajo local, sin desplegar y sin migraciones aplicadas.  
> **Alcance de este documento:** qué se construyó, dónde quedó el trabajo y qué falta para cerrar el P0 de aislamiento por organización. No contiene secretos ni credenciales.

## Foto actual del repositorio

- **Workspace:** `/Users/victorgallo/Projects/omona`
- **Rama al tomar este checkpoint:** `feat/bklit-ui`
- **HEAD al tomar este checkpoint:** `2a41c23`
- **Estado Git:** árbol de trabajo con cambios locales sin commit.
- **Operaciones remotas realizadas:** ninguna. No hubo `push`, `merge`, despliegue, migración local/remota ni cambios en producción.

> Hay cambios preexistentes o ajenos a este frente (por ejemplo, traducciones del dashboard y `preview-chart`). No deben atribuirse automáticamente al P0 ni incluirse en un commit de seguridad sin reconciliar su diff.

## Objetivo del P0

Evitar accesos o mutaciones entre organizaciones en Omona.

El backend usa Supabase con **service role**, por lo que RLS no protege por sí sola las consultas del servidor. La regla adoptada es:

1. Todo helper, ruta o servicio que reciba un recurso por UUID debe llevar el `orgId` disponible.
2. Las lecturas y mutaciones sensibles deben filtrar por **`id` + `organization_id`**.
3. Un recurso inexistente o perteneciente a otra organización debe responder como **404**, reduciendo enumeración y exposición cross-tenant.
4. RLS debe mantener mínimo privilegio para clientes directos; la lógica de mutación de negocio queda en el backend server-side.

## Construido hasta ahora

### 1. Aislamiento en helpers de base de datos

En `apps/server/src/db/queries.ts` se endurecieron helpers críticos para recibir o propagar organización:

- `getConversation(orgId, conversationId, client?)`
- `updateConversation(orgId, conversationId, updates, client?)`
- `getLead(orgId, leadId, client?)`
- `updateLead(orgId, leadId, updates, client?)`
- `updateLeadScore(orgId, leadId, delta)`
- `updateHandoff(orgId, handoffId, updates, client?)`
- `createHandoff(orgId, conversationId, reason)`
- `listHandoffs(orgId, status?)`

Estos helpers filtran los recursos principales con `id` y `organization_id`; los updates de score también limitan lectura y escritura a la organización correspondiente.

También se corrigieron dos updates auxiliares que inicialmente se limitaban sólo por UUID:

- `getOrCreateConversation(orgId, phoneNumber, contactName?, client?)`
  - La actualización de `contact_name` ahora usa `id` + `organization_id`.
  - Acepta cliente opcional para pruebas deterministas.
- `getOrCreateLead(orgId, conversationId, phoneNumber, client?)`
  - El enlace de `lead_id` sobre la conversación ahora usa `id` + `organization_id`.
  - Reutiliza el cliente inyectado en búsqueda, inserción y actualización.

### 2. Propagación en APIs y servicios

Se actualizó la propagación de `orgId` en los flujos ya revisados:

- `apps/server/src/api/conversations.ts`
  - Lecturas y mutaciones de conversación.
  - Tags, fijado, leído, envío manual y retorno desde handoff.
  - Se verifica ownership antes de operar; recursos de otra organización se tratan como no encontrados.
- `apps/server/src/api/leads.ts`
  - Detalle, `PATCH`, respuestas sugeridas y operaciones de lead con ownership validado.
- `apps/server/src/api/handoff.ts`
  - Aceptación, resolución, lectura de conversación y actualizaciones de handoff con contexto organizacional.
- `apps/server/src/api/test-chat.ts`
  - Propaga `orgId` para creación/actualización de conversación, lead, score y handoff.
- `apps/server/src/services/conversation.ts`
- `apps/server/src/services/follow-up.ts`
- `apps/server/src/services/handoff.ts`
- `apps/server/src/services/lead.ts`

Los flujos anteriores fueron ajustados para usar las nuevas firmas de helpers en vez de mutar conversación, lead o handoff sólo por UUID.

### 3. Pruebas reproducibles de ownership

Se añadió el script de pruebas del paquete server:

```json
"test": "node --import tsx --test tests/*.test.ts"
```

Y el archivo `apps/server/tests/db-ownership.test.ts`, con un cliente Supabase falso que registra filtros `.eq(...)`.

La suite cubre actualmente:

1. `getConversation scopes the lookup to its organization`
2. `getLead scopes the lookup to its organization`
3. `updateConversation scopes the mutation to its organization`
4. `updateLead scopes the mutation to its organization`
5. `updateHandoff scopes the mutation to its organization`
6. `getOrCreateConversation scopes a contact-name update to its organization`
7. `getOrCreateLead scopes its conversation link update to its organization`

Las pruebas verifican que, incluso con IDs que representan otro tenant, los helpers añaden el filtro `organization_id` esperado.

### 4. Borrador local de RLS de mínimo privilegio

Se creó la migración local:

- `supabase/migrations/008_tenant_isolation.sql`

El borrador:

- define `public.current_organization_id()`;
- restringe su ejecución al rol `authenticated`;
- sustituye políticas de lectura para tablas multi-tenant con scope organizacional;
- contempla tablas de negocio y relaciones dependientes, como mensajes vía sus conversaciones;
- revoca `INSERT`, `UPDATE` y `DELETE` directos para `anon` y `authenticated` en tablas de negocio;
- conserva mutaciones realizadas por el backend mediante service role.

**La migración está sólo en el árbol local y no fue aplicada.**

### 5. Plan de ejecución secuencial

Se dejó un plan de trabajo en:

- `.hermes/plans/2026-08-31_175613-p0-tenant-isolation-sequential.md`

La regla operativa es trabajar un frente y una verificación concreta a la vez, sin auditorías/subagentes paralelos, y no pasar a webhook/dependencias hasta cerrar el aislamiento multi-tenant.

## Validaciones realizadas

Las últimas validaciones locales registradas para el cambio de ownership fueron exitosas:

```bash
npm --workspace @omona/server run test
node --import tsx --test apps/server/tests/db-ownership.test.ts
npm --workspace @omona/server run build
git diff --check
```

Resultado confirmado:

- Suite de ownership: **7 pruebas aprobadas**.
- Build TypeScript del server: **correcto**.
- Validación de whitespace del diff: **correcta**.
- Hubo un warning no bloqueante de Node sobre `module.register()` deprecado.

Validaciones que no deben considerarse cerradas todavía:

- El build global `npm run build` pasó antes de los últimos cambios de helpers; debe repetirse como parte del cierre final.
- `npm run lint` no es reproducible aún: `apps/dashboard` llama a `next lint` y abre el prompt interactivo de configuración de ESLint.

## Cambios locales asociados al P0

Archivos de implementación y pruebas tocados o creados para este frente:

- `apps/server/package.json`
- `apps/server/src/db/queries.ts`
- `apps/server/src/api/conversations.ts`
- `apps/server/src/api/leads.ts`
- `apps/server/src/api/handoff.ts`
- `apps/server/src/api/test-chat.ts`
- `apps/server/src/services/conversation.ts`
- `apps/server/src/services/follow-up.ts`
- `apps/server/src/services/handoff.ts`
- `apps/server/src/services/lead.ts`
- `apps/server/tests/db-ownership.test.ts` *(nuevo/local)*
- `supabase/migrations/008_tenant_isolation.sql` *(nuevo/local, no aplicado)*
- `.hermes/plans/2026-08-31_175613-p0-tenant-isolation-sequential.md` *(plan local)*

Además, `supabase/migrations/007_missing_tables.sql` figura modificado en el árbol. Su diff debe clasificarse y revisarse antes de incluirlo en un commit enfocado en tenant isolation.

## Punto exacto donde quedó el trabajo

El siguiente subpaso pendiente es terminar la auditoría de los **helpers de mensajes** y sus call sites.

En `apps/server/src/db/queries.ts` aún existen helpers cuya firma no recibe `orgId`:

```ts
addMessage(conversationId, role, content, waMessageId?, metadata?)
getRecentMessages(conversationId, limit?)
getMessages(conversationId)
messageExists(waMessageId)
```

Se identificaron **17 usos** dentro de `apps/server/src`, incluidos flujos en:

- `api/test-chat.ts`
- `api/conversations.ts`
- `api/leads.ts`
- `api/admin.ts`
- `api/cloud-api-webhook.ts`
- `services/conversation.ts`
- `services/follow-up.ts`
- `ai/engine.ts`

Riesgos a resolver en este paso:

- `addMessage` inserta mensajes y actualiza la conversación; la actualización aún debe endurecerse con scope de organización.
- `getRecentMessages` y `getMessages` consultan por `conversation_id`; se debe garantizar explícitamente que la conversación pertenezca al tenant que solicita el historial.
- `messageExists` deduplica por ID de WhatsApp; debe revisarse su semántica global y su compatibilidad con aislamiento para no introducir una deduplicación cross-tenant inesperada.
- `api/test-chat.ts` llama a `generateResponse(agentConfig, conv.id)` sin el `orgId` que sí se propaga en el flujo principal de conversaciones.

Este es el punto de reanudación recomendado: **escribir primero pruebas RED para los helpers de mensajes, decidir y documentar el scope correcto de deduplicación, actualizar firmas/call sites y ejecutar la suite y build del server antes de avanzar.**

## Trabajo restante, en orden secuencial

### Fase 0 — reconciliar la línea base parcial

- [ ] Confirmar qué cambios del árbol son P0, cuáles preexistentes y cuáles deben quedar fuera de un commit de seguridad.
- [ ] Mantener la suite de ownership como contrato mínimo y ampliar sólo con pruebas necesarias para el siguiente helper.

### Fase 1 — completar helpers y flujos sensibles

- [ ] Cubrir `addMessage`, `getRecentMessages`, `getMessages` y `messageExists` con una estrategia explícita de organización.
- [ ] Propagar las nuevas firmas a los 17 usos identificados.
- [ ] Alinear `generateResponse` en test chat con el flujo principal, incluyendo `orgId` cuando corresponda.
- [ ] Ejecutar pruebas de ownership, build del server y `git diff --check` tras cada bloque coherente.

### Fase 2 — rutas, jobs y mutaciones directas service-role

- [ ] Auditar de forma secuencial mutaciones que todavía pueden depender sólo de IDs derivados.
- [ ] Añadir defensa en profundidad a la resolución masiva de handoffs: actualmente los IDs se obtienen con scope, pero el update posterior debe incluir también `organization_id`.
- [ ] Revisar el detalle/borrado administrativo de conversaciones y sus mensajes, handoffs y citas dependientes.
- [ ] Revisar appointments, invitaciones/equipo, profiles, webhooks, calendar, device tokens, onboarding y settings para confirmar ownership o relación segura con tenant.
- [ ] Asegurar que jobs y rutas internas propagan el `orgId` obtenido de la fuente autorizada.

### Fase 3 — revisar RLS y preparar migración segura

- [ ] Contrastar `008_tenant_isolation.sql` contra tablas y relaciones creadas en migraciones `001` y `004`–`007`.
- [ ] Verificar impacto de revocar DML directo del dashboard, hooks y realtime.
- [ ] Validar sintaxis y comportamiento en un entorno autorizado antes de considerar aplicación.
- [ ] No aplicar SQL remoto ni desplegar sin revisión final y autorización operativa explícita.

### Fase 4 — cierre verificable de P0 tenant

- [ ] Ejecutar la suite completa de server.
- [ ] Ejecutar typecheck/build del server y build global del monorepo.
- [ ] Ejecutar `git diff --check` y una revisión manual del diff completo.
- [ ] Clasificar o separar cambios ajenos antes de commit.
- [ ] Documentar el plan de aplicación y rollback de la migración, sin ejecutarla todavía salvo autorización explícita.

### Fase 5 — siguiente frente, sólo después de cerrar tenant

No comenzar hasta que las fases anteriores estén cerradas:

- [ ] Hacer obligatoria la autenticidad HMAC del webhook Cloud API y fallar de forma segura si falta la configuración requerida.
- [ ] Añadir pruebas de webhook válido, inválido y secreto ausente.
- [ ] Revisar y remediar dependencias vulnerables de forma controlada; la auditoría previa reportó 26 vulnerabilidades de producción (`2` críticas, `11` altas, `12` moderadas y `1` baja).

## Bloqueos y precauciones actuales

1. **Supabase CLI no está instalada** en este entorno (`supabase: command not found`). Por ello no se puede consultar ni aplicar el estado de migraciones desde aquí.
2. **Lint interactivo:** el dashboard no tiene ESLint configurado para CI/no interactivo; se abordará en el frente de calidad, sin confundirlo con la validación de tenant isolation.
3. **Migración no aplicada:** `008_tenant_isolation.sql` requiere revisión de cobertura y prueba en entorno autorizado antes de tocar una instancia remota.
4. **Repositorio/base canónica:** existe información contradictoria histórica sobre si este checkout es la base canónica. No se debe mover el trabajo, rebasear para desplegar ni publicar desde otro repositorio sin confirmación.
5. **Seguridad operativa:** continuar sin exponer secretos; usar siempre `[REDACTED]` en documentación, logs compartidos y ejemplos.

## Criterio de cierre

El P0 de aislamiento multi-tenant estará listo para revisión de despliegue cuando:

- todos los helpers y call sites sensibles tengan scope organizacional verificable;
- las rutas y jobs fallen de forma segura ante recursos de otro tenant;
- la migración RLS cubra el esquema vigente y su impacto esté revisado;
- las pruebas de ownership, build del server, build global y revisión de diff pasen;
- los cambios ajenos estén separados o clasificados;
- exista autorización explícita para cualquier acción remota.
