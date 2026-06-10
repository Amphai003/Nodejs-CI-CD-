# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

# Stage 1: Builder
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:${NODE_VERSION}-alpine AS production

ARG VERSION=dev
ARG REVISION=unknown

LABEL org.opencontainers.image.title="nodejs-ci-cd-backend" \
      org.opencontainers.image.description="Express + Prisma + PostgreSQL API" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.source="https://github.com/Amphai003/Nodejs-CI-CD-" \
      org.opencontainers.image.licenses="MIT"

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies and generated artifacts from the builder stage.
# This avoids running `npm ci` in the production image where binary/native
# modules or emulation can trigger illegal-instruction (exit code 132).
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/dist ./dist
COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh \
    && chown -R node:node /app

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
