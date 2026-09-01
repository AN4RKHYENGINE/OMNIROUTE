FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to handle version conflicts
RUN npm ci --prefer-offline --no-audit --legacy-peer-deps
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy source
COPY . .

# Build with explicit heap limit
ENV NODE_OPTIONS="--max-old-space-size=2048 --max-http-header-size=16384"
RUN npm run build --verbose 2>&1 | tee build.log || (tail -100 build.log && exit 1)
ENV NODE_OPTIONS=--max-old-space-size=4096

# Remove dev dependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
