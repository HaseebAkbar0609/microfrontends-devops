# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY apps/team/package.json ./package.json
RUN pnpm install --prefer-offline
COPY apps/team/. .
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, not
# read at container runtime — must be passed as a --build-arg. Without this,
# the app silently falls back to same-origin API calls (see TFS-XXX).
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]