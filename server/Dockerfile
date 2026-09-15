# server/Dockerfile
# Build context (Coolify "Base Directory") MUST be the repo root, because this
# is a pnpm workspace: the server depends on shared/* packages and the root
# lockfile. Coolify field: Dockerfile Location = server/Dockerfile

FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@11.13.0 --activate
WORKDIR /app

# ---- deps: install once, cached unless lockfile/package.json files change ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY server/package.json ./server/package.json
COPY shared/constants/package.json ./shared/constants/package.json
COPY shared/normalize/package.json ./shared/normalize/package.json
COPY shared/tiptap/package.json ./shared/tiptap/package.json
RUN pnpm install --frozen-lockfile

# ---- build: prisma generate (+ optional GeoLite2 db) ----
FROM base AS build
ARG MAXMIND_LICENSE_KEY=""
ENV MAXMIND_LICENSE_KEY=${MAXMIND_LICENSE_KEY}
COPY --from=deps /app /app
COPY server ./server
COPY shared ./shared
RUN pnpm --filter itnab-api exec prisma generate
RUN if [ -n "$MAXMIND_LICENSE_KEY" ]; then \
      bash server/scripts/fetch-geolite-optional.sh; \
    else \
      echo "[build] MAXMIND_LICENSE_KEY not set — skipping GeoLite2 download"; \
    fi

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app
EXPOSE 3000
# start script runs: prisma migrate deploy && tsx server.js
CMD ["pnpm", "--filter", "itnab-api", "start"]
