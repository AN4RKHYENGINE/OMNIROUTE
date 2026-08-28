FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl dumb-init

FROM base AS runner-base
RUN mkdir -p /app/data

FROM base AS builder
RUN apk add --no-cache python3 build-base
COPY package*.json ./
COPY open-sse/package.json ./open-sse/
COPY scripts/build/postinstall.mjs ./scripts/build/
COPY scripts/build/postinstallSupport.mjs ./scripts/build/
COPY scripts/build/native-binary-compat.mjs ./scripts/build/
RUN test -f package-lock.json || (echo "package-lock.json not found" && exit 1)
RUN npm install -g npm@11
RUN --mount=type=cache,id=npm-cache,target=/root/.npm npm ci --legacy-peer-deps
RUN npm install @parcel/watcher --no-save --legacy-peer-deps
COPY . .
ENV OMNIROUTE_USE_TURBOPACK=0
ENV NODE_OPTIONS="--max-old-space-size=6144"
ENV NEXT_DISABLE_SOURCEMAPS=true
RUN npm run build

FROM base AS stage-3
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
