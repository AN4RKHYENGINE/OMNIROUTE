FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl dumb-init

FROM base AS runner-base
RUN mkdir -p /app/data

FROM base AS builder
RUN apk add --no-cache python3 build-base
COPY package*.json ./
COPY open-sse/package.json ./open-sse/package.json
COPY scripts/build/postinstall.mjs ./scripts/build/
COPY scripts/build/postinstallSupport.mjs ./scripts/build/
COPY scripts/build/native-binary-compat.mjs ./scripts/build/
RUN test -f package-lock.json || (echo "package-lock.json not found!" && exit 1)
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
  NODE_OPTIONS="--max-old-space-size=2048" \
  npm install --include=optional --no-save --legacy-peer-deps --no-audit --no-fund --maxsockets=1
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build
RUN npm prune --production --legacy-peer-deps

FROM runner-base
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/open-sse ./open-sse
COPY --from=builder /app/scripts ./scripts
USER nextjs
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
