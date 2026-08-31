# Omona Server — Railway (Hono + Baileys, proceso de larga vida)
FROM node:22-slim

WORKDIR /app

# Dependencias del sistema para better-sqlite3 (build desde fuente si hace falta)
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# IPv6 roto en algunas redes (misma razón que index.ts:2 y session-manager.ts:49):
# sin esto `npm ci` muere con ECONNRESET al resolver registry.npmjs.org.
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Workspace: solo lo que el server necesita
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Instalar + compilar tipos compartidos
RUN npm ci --ignore-scripts
RUN npm rebuild better-sqlite3 --build-from-source || true
RUN cd packages/shared && npx tsc

WORKDIR /app/apps/server
# Sesiones de WhatsApp (Baileys) persistidas en volumen de Railway
RUN mkdir -p auth_sessions

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# tsx en runtime: lee TS directo, sin build intermedio (igual que en producción Loomi)
CMD ["npx", "tsx", "src/index.ts"]
