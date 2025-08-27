# ---- Builder ----
FROM node:20-slim AS build
WORKDIR /app

# OS deps Prisma may rely on
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# install deps
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# prisma client + build
RUN npx prisma generate && npm run build

# ---- Runner ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# OS deps for Prisma runtime + HTTPS
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# copy only what's needed
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

CMD ["npm","run","start"]
