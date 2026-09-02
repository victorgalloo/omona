# Dar a cada cliente de Omona un CRM completo con Twenty

## Qué se quiere

Que cada cliente de Omona tenga un CRM de verdad —importación, reportes, permisos, campos personalizados— en lugar del pipeline propio, que cubre lo básico pero no eso.

## Ruta elegida y por qué

**Integración por API, sin fusionar código.** La licencia de Twenty es AGPLv3 con una *Twenty Application Exception* que dice, textualmente, que construir algo que interactúe con Twenty por sus interfaces publicadas —REST, GraphQL, webhooks, SDKs— y que *"does not otherwise incorporate or modify the source code of Twenty"* **no** somete tu producto a la AGPL: *"You may license your Application under terms of your choice, including proprietary terms."*

El punto 4 de esa excepción cierra la puerta contraria: si modificas Twenty, la AGPL aplica en pleno a tu versión, incluida la sección 13 (la cláusula de red). Por eso fusionar el código queda descartado.

**`twenty-sdk` sí, `twenty-ui` no.** El `LICENSE` del repo afirma que `twenty-ui` y `twenty-shared` son MIT, pero **los paquetes publicados en npm declaran AGPL-3.0**:

| Paquete | Versión publicada | Licencia en npm |
|---|---|---|
| `twenty-sdk` | 2.37.0 | MIT ✅ |
| `twenty-ui` | 1.0.0-**alpha**.0 | AGPL-3.0 ⚠️ |
| `twenty-shared` | 0.41.0-canary | AGPL-3.0 ⚠️ |

Puede ser desfase entre npm y el repo, pero lo que entraría hoy al proyecto dice AGPL. Se usa solo `twenty-sdk`. La capa visual se construye con lo que ya existe: shadcn, los tokens propios y Bklit.

> Esto es lectura del texto de la licencia, no asesoría legal. Para una decisión comercial de este tamaño, confírmalo con un abogado.

---

## Los tres bloqueos reales

Antes de escribir código, estos tres definen si el proyecto es viable como SaaS de autoservicio.

**1. No hay API documentada para crear workspaces.** Multi-workspace funciona (`IS_MULTIWORKSPACE_ENABLED=true` más DNS comodín), pero la documentación describe la creación por el flujo de registro de la aplicación, no por una API pública estable. Existe la mutación GraphQL `signUp` que usa su propio frontend, pero apoyarse en ella es depender de una interfaz interna que pueden cambiar sin aviso.

**2. Las llaves de API son por workspace.** No hay una llave de instancia que abarque todos los inquilinos. Omona tendría que guardar una llave por cliente, y obtenerla hoy requiere entrar a *Settings → API & Webhooks* de cada workspace y copiarla — la llave se muestra una sola vez.

**3. No hay OIDC genérico.** Twenty soporta OAuth con Google y Microsoft, pero no está documentado un "trae tu propio proveedor de identidad". Tus usuarios tendrían una segunda contraseña.

**Consecuencia:** dar de alta a un cliente nuevo sería **manual** — crear su workspace, generar su llave, guardarla. Para un producto de autoservicio eso no escala. Es el punto que hay que resolver antes que cualquier otro.

---

## Decisión previa: quién es la fuente de verdad

No puede haber dos. Hoy el pipeline propio y Twenty harían lo mismo con los mismos datos.

**Recomendado:** Twenty es la fuente de verdad de contactos, empresas y oportunidades. Omona conserva lo que Twenty no hace: las conversaciones de WhatsApp, el inbox, el handoff y la configuración del agente. El pipeline propio de `/leads/pipeline` desaparece y su lugar lo toma Twenty.

La alternativa —mantener ambos y sincronizar en dos direcciones— genera conflictos de escritura que no se resuelven bien y no la recomiendo.

---

## Fases

### Fase 0 — Resolver el alta de clientes

Sin esto lo demás no importa. Tres caminos, de mejor a peor:

- **Preguntar a Twenty** si existe o planean una API de aprovisionamiento. Es una pregunta de un correo y puede ahorrar todo lo demás.
- **Usar la mutación `signUp`** aceptando que es interfaz interna, y aislarla en un solo módulo para que romperla sea barato.
- **Alta manual** mientras el volumen de clientes lo permita, con el proceso documentado.

### Fase 1 — Levantar Twenty

Servicio propio en `crm.omona.tech` — hoy ese dominio **no resuelve**. Requiere Postgres, Redis, contenedor de servidor y de worker, almacenamiento persistente, proxy con TLS y **DNS comodín** para el enrutamiento por subdominio de cada workspace.

Va en su propia instancia, no en la del server de Omona: esa mantiene las sesiones persistentes de WhatsApp y no conviene reiniciarla por un despliegue de CRM.

### Fase 2 — Cliente de Twenty en el server

Módulo nuevo `apps/server/src/services/twenty.ts` sobre `twenty-sdk`, con la llave por organización guardada en la base de Omona.

Se enlaza donde el agente ya extrae datos: `services/lead.ts` y `ai/lead-extractor.ts` crean hoy el lead en la base propia; ahí mismo se crea o actualiza la Person, la Company y la Opportunity en el workspace del cliente.

Los webhooks de Twenty entran por `api/webhooks.ts`, que ya existe y ya verifica firmas HMAC.

### Fase 3 — Interfaz

`/leads/pipeline` se retira. El dashboard enlaza al workspace de Twenty del cliente, y conserva lo propio: inbox, handoff, analítica y configuración del agente.

### Fase 4 — Migración

Los leads existentes se llevan al workspace correspondiente. `scripts/clean-twenty-demo.ts` ya habla con la API de Twenty y sirve de punto de partida.

---

## Pendiente inmediato, independiente de todo esto

La landing promete hoy *"Tu CRM, viviendo dentro de Omona — Integramos Twenty directamente en tu dashboard"* y muestra capturas de Twenty. **Esa integración no existe**: `crm.omona.tech` no resuelve y el pipeline usa la API propia. El texto debe ajustarse ya, sin esperar a este proyecto.

---

## Verificación

1. Crear un workspace de prueba y confirmar que el alta funciona por la vía elegida en la Fase 0.
2. Una conversación de WhatsApp de punta a punta que termine en Person, Company y Opportunity dentro del workspace correcto.
3. Confirmar que un cliente no puede ver datos de otro: la llave de A contra el workspace de B debe fallar.
4. `npm test --workspace=apps/server` — las 7 pruebas de aislamiento multi-tenant siguen pasando.
