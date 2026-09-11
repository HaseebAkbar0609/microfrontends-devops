# Isolated DEV build: preserve the reviewed workspace lockfile importer.
FROM node:20-alpine AS deps
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/professional/package.json ./apps/professional/package.json
RUN pnpm --filter @tfs/professional install --frozen-lockfile --ignore-scripts
COPY apps/professional ./apps/professional
RUN pnpm --filter @tfs/professional deploy /opt/professional

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /opt/professional ./
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TFS825_PAYMENT_MVP=false
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_TFS825_PAYMENT_MVP=$NEXT_PUBLIC_TFS825_PAYMENT_MVP
RUN node node_modules/next/dist/bin/next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
