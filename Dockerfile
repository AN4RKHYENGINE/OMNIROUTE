FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl dumb-init

FROM base AS runner-base
RUN mkdir -p /app/data

FROM base AS builder

RUN apk add --no-cache python3 build-base

COPY package*.json ./
COPY open-sse/package.json ./open-sse/package.json
COPY scripts/build/postinstall.mjs ./scripts/build/postinstall.mjs
COPY scripts/build/postinstallSupport.mjs ./scripts/build/postinstallSupport.mjs
COPY scripts/build/native-binary-compat.mjs ./scripts/build/native-binary-compat.mjs

RUN test -f package-lock.json || (echo "package-lock.json not found!" && exit 1)

RUN npm install -g npm@11

RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
  NODE_OPTIONS="--max-old-space-size=512" \
  npm ci --omit=optional --legacy-peer-deps --no-audit --no-fund --maxsockets=1

RUN npm install @parcel/watcher --no-save --legacy-peer-deps --no-audit --no-fund

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=512" npm run build

FROM runner-base AS stage-3

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/data ./data

USER nextjs

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
