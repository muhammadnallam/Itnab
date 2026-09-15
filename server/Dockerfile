# server/Dockerfile
# Build context (Coolify "Base Directory") MUST be the repo root, because this
# is a pnpm workspace: the server depends on shared/* packages and the root
# lockfile. Coolify field: Dockerfile Location = server/Dockerfile

FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl tar && rm -rf /var/lib/apt/lists/*
# NOTE: not using corepack here — root package.json declares
# devEngines.packageManager.version as "^11.13.1" (a semver range), and
# corepack's pnpm shim rejects ranges ("Invalid package manager specification
# ... expected a semver version"). Installing pnpm as a plain global binary
# sidesteps that check entirely.
RUN npm install -g pnpm@11.13.1
WORKDIR /app

# ---- deps: install once, cached unless lockfile/package.json files change ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
COPY shared/constants/package.json ./shared/constants/package.json
COPY shared/normalize/package.json ./shared/normalize/package.json
COPY shared/tiptap/package.json ./shared/tiptap/package.json
RUN pnpm install --frozen-lockfile

# ---- build: prisma generate (+ optional GeoLite2 db) ----
FROM base AS build
# NOTE: ARG (not ENV) on purpose — the key is only needed by the RUN steps
# below and must not persist in any image layer. Never add an ENV line for it.
ARG MAXMIND_LICENSE_KEY=""
COPY --from=deps /app /app
COPY server ./server
COPY shared ./shared
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm --filter itnab-api exec prisma generate
RUN if [ -n "$MAXMIND_LICENSE_KEY" ]; then \
      bash server/scripts/fetch-geolite-optional.sh; \
    else \
      echo "[build] MAXMIND_LICENSE_KEY not set — skipping GeoLite2 download"; \
    fi

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN chown node:node /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc ./
COPY --from=build --chown=node:node /app/server ./server
COPY --from=build --chown=node:node /app/shared ./shared
EXPOSE 3000
# start script runs: prisma migrate deploy && tsx server.js
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)throw 1}).catch(()=>process.exit(1))"
CMD ["pnpm", "--filter", "itnab-api", "start"]
