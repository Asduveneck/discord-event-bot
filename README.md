# Discord IRL Meetup Bot (Template)

Simple, self‑hosted Discord bot to propose in‑person meetups, vote on times, and auto‑promote:
- **Min reached →** create a public thread in the approved channel
- **Max reached →** create a private thread with confirmed attendees

Built to be **extensible** via plugins (place resolvers, event publishers, history/photos).

## Quick Start
1. Create a Discord Application → add a Bot → enable **Server Members** intent.
2. Invite with scopes: `applications.commands`, `bot` (perms: Send, Read History, Create Public/Private Threads, Manage Threads).
3. Install deps & run:
   ```bash
   nvm use
   cd apps/bot
   npm i
   npx prisma migrate dev --schema prisma/schema.prisma
   npm run dev
   ```
   Or with Docker from repo root: `docker compose up --build`.

4. In Discord (admin):  
   `/setup` → pick **suggestions** and **approved** channels, timezone, defaults.  
   Try: `/suggest type:food link:<url> times:"Fri 7pm; Sat 1pm" min:4 max:8`.

## MVP Commands
- `/setup` – configure channels, tz, defaults
- `/suggest` – create a proposal (link, times, min/max, type)
- `/status` – view current config
- (Bot) Vote buttons → live tally
- Auto‑promotions: **min → public thread**, **max → private thread** (invites first `max` voters)

## Tech
- Node 20 + TypeScript + discord.js v14
- Prisma + Postgres
- (Optional later) Redis + BullMQ for scheduled jobs
