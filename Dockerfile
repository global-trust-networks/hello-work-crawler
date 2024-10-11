FROM mcr.microsoft.com/playwright:v1.47.2-jammy

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN yarn global add pnpm@9

WORKDIR /app
COPY . /app

RUN pnpm install

CMD ["pnpm", "start:prod"]