# Getting Started – Gathercord

## 1. Create your Discord Application

1. Developer Portal → *New Application* → **Bot** → *Add Bot*.
2. Enable **Server Members Intent** (needed to add users to private threads).
3. OAuth2 → URL Generator → Scopes: `bot`, `applications.commands`.
4. Permissions: `Send Messages`, `Read Message History`, `Create Public Threads`, `Create Private Threads`, `Manage Threads`.
5. Copy **Bot Token** and **Client ID**.

## 2. Local Development (npm + Postgres in Docker)

```bash
nvm use
cd apps/bot
cp ../../.env.example ../../.env
# Fill DISCORD_TOKEN and DISCORD_CLIENT_ID in ../../.env
# DATABASE_URL is already set to local Postgres in .env.example

# Start Postgres (db + shadow db for migrations)
docker compose up -d db db_shadow

# Migrate & generate Prisma client
npm run bot:prisma:dev -- --name init
npm run bot:prisma:generate

# run the bot
npm run bot:dev
```

Invite the bot to your test server with the OAuth URL.

## 3. Configure in your Server

- Run `/setup` as an admin → choose **suggestions** & **approved** channels and timezone.
- Post a test: `/suggest type:food link:<url> times:"Fri 7pm; Sat 1pm" min:4 max:8`.

## 4. Useful scripts

```sh
# Prisma
npm run bot:prisma:dev -- --name <migration-name>   # create/apply new migration locally
npm run bot:prisma:deploy                           # apply committed migrations (CI/Prod)
npm run bot:prisma:generate                         # regenerate client
npm run bot:prisma:reset                            # DANGER: drops dev DB and reapplies

# Dev & build
npm run bot:dev
npm run bot:build
npm run bot:lint
npm run bot:typecheck
```

## 5. Production (Docker + Postgres)

From repo root:
```bash
docker compose up -d --build
```
Set env vars: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DATABASE_URL` (Postgres).

## 6. Troubleshooting

- **Slash commands not showing**: ensure `applications.commands` scope when inviting; commands can take a few minutes globally.
- **Private thread creation fails**: check channel allows private threads; bot has correct perms; *Server Members* intent enabled.
- **Migrations/DB issues**: for SQLite dev, remove `DATABASE_URL` and re-run migrate; for Postgres, verify the connection string.

