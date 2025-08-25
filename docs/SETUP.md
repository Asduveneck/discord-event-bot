# Setup (Self‑Hosted)

## Prereqs
- Node 20+ (use `nvm use`) or Docker
- Discord Bot token
- (Prod) Postgres

## Discord App
- Enable **Server Members Intent** (to add users to private threads)
- Invite URL with scopes `applications.commands` + `bot`
- Permissions: Send Messages, Read Message History, Create Public Threads, Create Private Threads, Manage Threads

## Environment
Copy `.env.example` to `.env` at the repo root and fill:
```
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...
# For dev (SQLite) leave DATABASE_URL empty
# For Postgres:
# DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Run locally (npm)
```
nvm use
cd apps/bot
npm i
npx prisma migrate dev --schema prisma/schema.prisma
npm run dev
```

## Docker (prod‑ish)
From repo root:
```
docker compose up -d --build
```
