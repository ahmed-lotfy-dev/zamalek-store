# Build stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY prisma ./prisma/

# Install dependencies with Bun
RUN bun install

# Copy source
COPY . .

# Generate Prisma client and build with Bun
RUN bunx prisma generate --no-engine && \
    bun run build

# Production stage  
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["bun", "server.js"]