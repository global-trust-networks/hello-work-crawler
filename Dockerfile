# 
FROM node:22-alpine AS base
# 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# 
FROM base AS builder
# 
WORKDIR /app
COPY . /app

RUN pnpm install
RUN pnpm build

# 
FROM zenika/alpine-chrome:with-node AS runner
# 
WORKDIR /app
COPY --from=builder /app /app

CMD node dist/main.js --executablePath=/usr/bin/chromium-browser