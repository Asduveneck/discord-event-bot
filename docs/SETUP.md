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
npm i

# Start Postgres (db + shadow db)
docker compose up -d db db_shadow

# Run migrations & generate client
npm run bot:prisma:dev -- --name init
npm run bot:prisma:generate

# Start the bot
npm run bot:dev
```

## Docker (prod‑ish)

From repo root:

```sh
docker compose up -d --build
```
