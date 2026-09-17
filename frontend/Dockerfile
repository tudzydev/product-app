FROM node:22-alpine

WORKDIR /app

# Enable Corepack and install pnpm specified in package.json
RUN corepack enable

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

CMD ["pnpm", "dev"]
