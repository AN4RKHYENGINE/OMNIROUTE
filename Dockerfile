FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --legacy-peer-deps

FROM base AS builder
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV CI=1
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY app ./app
COPY pages ./pages
COPY public ./public
COPY components ./components
COPY lib ./lib
COPY packages ./packages
COPY prisma ./prisma
COPY next.config.* ./
COPY tsconfig*.json ./
COPY postcss.config.* ./
COPY tailwind.config.* ./
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
