# 
FROM node:22-alpine AS base
# 
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# 
FROM base AS builder
# 
WORKDIR /app
COPY . /app

RUN pnpm install
RUN pnpm build

# 
FROM mcr.microsoft.com/playwright:v1.48.0-noble AS runner
# 
WORKDIR /app
COPY --from=builder /app /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

CMD node dist/main.js