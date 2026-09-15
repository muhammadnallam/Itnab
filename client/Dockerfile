# client/Dockerfile
# Build context (Coolify "Base Directory") MUST be the repo root — same reason
# as the server. Coolify field: Dockerfile Location = client/Dockerfile
#
# REQUIRES: client/next.config.mjs must set `output: "standalone"`.
# See client/next.config.mjs.patch in this same delivery.

FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@11.13.0 --activate
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY client/package.json ./client/package.json
COPY shared/constants/package.json ./shared/constants/package.json
COPY shared/normalize/package.json ./shared/normalize/package.json
COPY shared/tiptap/package.json ./shared/tiptap/package.json
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM base AS build
# Next.js inlines NEXT_PUBLIC_* vars at BUILD time, not runtime — must be
# supplied as a Coolify Build Variable (Build Argument), not just a runtime env var.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=deps /app /app
COPY client ./client
COPY shared ./shared
RUN pnpm --filter client build

# ---- runtime (standalone output = only what's needed to run, much smaller) ----
FROM node:22-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# In a pnpm-workspace standalone build, the traced output preserves the
# workspace layout: .next/standalone/client/server.js is the entrypoint,
# with node_modules hoisted alongside it.
COPY --from=build /app/client/.next/standalone ./
COPY --from=build /app/client/.next/static ./client/.next/static
COPY --from=build /app/client/public ./client/public

EXPOSE 5000
ENV PORT=5000
ENV HOSTNAME=0.0.0.0
CMD ["node", "client/server.js"]
