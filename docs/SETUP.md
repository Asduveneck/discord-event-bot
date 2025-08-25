# Setup (Self‑Hosted)

## Prereqs

- Node 20+ (use `nvm use`) or Docker
- Discord Bot token


## Discord App

- Enable **Server Members Intent** (to add users to private threads)
- Invite URL with scopes `applications.commands` + `bot`
- Permissions: Send Messages, Read Message History, Create Public Threads, Create Private Threads, Manage Threads

## Environment

Copy `.env.example` to `.env` at the repo root and fill:

```sh
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...
```

## Run locally (npm)

```sh
nvm use
cd apps/bot
npm i
npx prisma migrate dev --schema prisma/schema.prisma
npm run dev
```

## Docker (prod‑ish)

From repo root:

```sh
docker compose up -d --build
```
