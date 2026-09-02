FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --legacy-peer-deps

FROM base AS builder
ENV NODE_ENV=production
ENV CI=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
