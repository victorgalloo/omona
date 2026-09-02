# CRM completo, construido sobre lo que ya existe

## Contexto

El objetivo es que los clientes de Omona tengan un CRM de verdad. Se evaluó integrar [Twenty](https://twenty.com) y se descartó: no hay API documentada para crear workspaces, las llaves son por workspace, y no hay SSO genérico — cada alta de cliente quedaría manual. Y fusionar su código activa la AGPL sobre todo el producto.

La alternativa es construirlo. El hueco es más chico de lo que sugiere la palabra "CRM", porque ya existe casi todo el modelo de datos.

**Lo que ya hay:** contactos con nombre, correo, empresa, tamaño, presupuesto, horizonte, interés y dolores — todos extraídos por el agente, algo que Twenty no hace. Pipeline de seis etapas con arrastre. Scoring, conversaciones, citas, equipo con roles, webhooks, analítica y exportación a CSV.

**Ventaja estructural sobre Twenty:** el agente escribe directo en el CRM. No hay dos bases que sincronizar ni que puedan desfasarse.

## Lenguaje visual

Todo lo nuevo sigue lo que ya quedó establecido en la interfaz:

- **Sin cards.** Bloques separados por `border-t border-border`, no cajas con fondo y esquinas redondeadas.
- **Etiquetas monoespaciadas** con guion bajo (`notas_`, `tareas_`), en JetBrains Mono.
- **Jerarquía:** el `h1` de la pantalla manda; los encabezados de sección van por debajo.
- **El contenido nunca depende de JavaScript para ser visible.** Nada de `initial={{opacity:0}}` esperando un `animate`.
- **Cada pantalla explica para qué sirve**, vía el `subtitle` de `Header`.

El detalle de lead (`app/(dashboard)/leads/[id]/page.tsx`) ya usa este patrón y sirve de referencia.

---

## Las seis piezas

Ordenadas por relación entre lo que aportan y lo que cuestan. Cada una es útil sola: se pueden soltar de a poco.

### 1. Notas y actividades

**Hoy:** `leads.notes` es un único campo `TEXT` que se sobrescribe. Quien escribe pisa lo anterior, y no queda registro de quién ni cuándo.

**Se convierte en** una bitácora: entradas con autor, fecha y tipo — nota escrita a mano, llamada registrada, cambio de etapa, correo enviado. Los cambios de etapa se registran solos.

Tabla nueva `lead_activities` con `organization_id` (el filtro por organización es obligatorio: ver `fix(security)` en el historial). El campo `notes` actual se migra como la primera entrada de cada lead para no perder nada.

**Visualmente:** una línea de tiempo vertical bajo el detalle del lead, cada entrada separada por filete, con la fecha en mono a la izquierda.

### 2. Tareas con responsable y fecha

**Hoy:** existe `appointments` para citas agendadas, pero no tareas sueltas del tipo "mandar la propuesta antes del viernes".

Tabla `tasks` con lead asociado, responsable (`profiles`), fecha límite y estado. Una vista de "mis tareas" y las tareas del lead dentro de su detalle.

El agente puede crearlas: cuando detecta un compromiso en la conversación —"te mando la cotización el jueves"— deja la tarea. Eso conecta con `services/lead.ts`, donde ya extrae datos.

### 3. Empresas como entidad propia

**Hoy:** `leads.company` es texto libre. Dos leads de la misma empresa no se relacionan entre sí.

Tabla `companies`, con los leads apuntando a ella. Permite ver todos los contactos de un mismo cliente, su historial completo y el valor acumulado.

La extracción del agente ya identifica la empresa; solo hay que normalizarla en vez de guardarla como texto.

### 4. Importar contactos desde CSV

**Hoy:** solo se exporta.

Un cliente que llega con 300 contactos en una hoja de cálculo no puede subirlos. Es la fricción más grande al momento de adoptar el producto.

Importador con mapeo de columnas y vista previa antes de confirmar. El servidor ya parsea documentos (`services/document-parser.ts`), así que hay de dónde partir.

### 5. Campos personalizados

**Hoy:** los campos son fijos para todos.

Una inmobiliaria quiere "zona" y "recámaras"; una clínica quiere "especialidad". Definición de campos por organización, guardados en `JSONB` sobre el lead para no alterar el esquema por cliente.

Es la pieza más costosa: toca formularios, tabla, filtros y exportación.

### 6. Vistas guardadas

**Hoy:** los filtros se pierden al recargar.

Guardar combinaciones de filtro y orden con un nombre — "leads calientes de esta semana", "sin contactar hace 3 días" — y compartirlas con el equipo.

Va al final porque su valor depende de que existan los campos y entidades de las piezas anteriores.

---

## Orden sugerido

**1 y 2 primero.** Notas y tareas son lo que más se extraña en un CRM y lo más barato de construir: una tabla y una vista cada una. Además el agente puede alimentarlas solo, que es el diferenciador frente a cualquier CRM genérico.

**3 y 4 después.** Empresas ordena los datos; importar quita la fricción de adopción.

**5 y 6 al final.** Campos personalizados es la más cara y vistas guardadas depende de ella.

---

## Verificación

1. `npm test --workspace=apps/server` — las 7 pruebas de aislamiento multi-tenant deben seguir pasando, y cada tabla nueva necesita las suyas.
2. **Aislamiento:** ninguna consulta nueva puede buscar solo por `id`. Toda tabla nueva lleva `organization_id` y toda consulta filtra por él. Es el defecto que ya se corrigió una vez en `db/queries.ts`.
3. **RLS:** cada tabla nueva necesita su política, siguiendo el patrón de `008_tenant_isolation.sql` — lectura acotada a `current_organization_id()`, mutaciones solo por la API.
4. `npm run build --workspace=apps/dashboard` limpio. **No correr el build de producción con el dev server vivo:** pisa el `.next` y el navegador deja de ejecutar JavaScript.
5. **Nada invisible:** con la página cargada, ningún bloque de contenido en `opacity: 0`.
6. Revisar en tema claro y oscuro, y en móvil.

---

## Pendiente independiente

La landing sigue prometiendo *"Tu CRM, viviendo dentro de Omona — Integramos Twenty directamente en tu dashboard"*, con capturas de Twenty. Si se toma este camino, ese texto y esas imágenes hay que sustituirlos por el CRM propio.
