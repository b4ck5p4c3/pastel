# syntax=docker.io/docker/dockerfile:1

FROM node:23-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate


FROM base AS builder

## Install deps
COPY package.json pnpm-lock.yaml .npmrc  ./
RUN pnpm i --frozen-lockfile

## Copy rest of the files, and build the app
COPY . .
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./docker/healthcheck.mjs /app/docker/healthcheck.mjs
HEALTHCHECK \
  --interval=30s \
  --timeout=10s \
  --start-period=30s \
  --retries=3 \
  CMD [ "/usr/local/bin/node", "/app/docker/healthcheck.mjs" ]

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
