# Gathercord – Architecture

## High-Level Flow
1. **/suggest** → store a proposal (type, title, link, min/max caps) and create time options.
2. **Voting** → users click buttons; 1 vote per user (upsert). Live tally is stored in DB.
3. **Thresholds**
   - When **min** unique voters reached → create a **public thread** in the approved channel and post a summary.
   - When **max** reached → create a **private thread**, invite the first `max` voters (by vote timestamp), and mark proposal as finalized.
4. **(Optional later)** publish to Meetup/Luma/Partiful via adapters, and ingest photos/history.

## Components
- **Discord bot (apps/bot/)**: Node 20, TypeScript, discord.js v14.
- **Persistence**: Prisma ORM, Postgres (dev + prod).
- **Commands**: `/setup`, `/suggest`, `/status` (MVP). Future: `/cap`, `/extend`, `/features`.
- **Interactions**: `vote` button handler; promotion logic.
- **Plugin hooks (future)**: place resolvers (Google/Yelp/OpenGraph), event publishers (Luma/Meetup/Partiful), history/media ingestion.

## Data Model (MVP + future-proof)
- `guild_settings` — per server config (channels, tz, flags).
- `place` — normalized venue info (optional for MVP).
- `proposal` — a suggested meetup (type, title, link, caps, status, thread IDs).
- `proposal_time_option` — candidate times.
- `proposal_vote` — user→option mapping (upserted).
- `event_attendee_snapshot` — snapshot of attendees at finalize (future ACLs).
- `event_media` — future photo storage metadata.

## Promotion Logic
- **Public thread on min**: create once; keep updating counts in the thread if desired.
- **Private thread on max**: create a new private thread; add earliest `max` voters; post logistics; stop accepting votes.
- **Fallback** if private threads aren’t permitted: lock public thread and @mention the first `max` voters; maintain a waitlist.

## Permissions & Intents
- Bot permissions: `Send Messages`, `Read Message History`, `Create Public Threads`, `Create Private Threads`, `Manage Threads`.
- Intents: `Guilds`, `GuildMessages`, `GuildMembers` (required for adding members to private threads), `MessageContent` (optional).

## Deployment
- **Local dev**: npm + Postgres (`nvm use`, `npm i`, `prisma migrate dev`, `npm run dev`).
- **Prod**: Dockerfile + docker‑compose with Postgres.
- **Secrets**: `.env` for `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, optional `DATABASE_URL`.

## Design Principles
- Keep MVP tight; add features via plugins.
- Self‑host per guild, but keep `guildId` in tables to allow multi‑tenant later.
- Config via slash commands; avoid env edits after boot.
- Store UTC, display in guild TZ.

## Future Refactor Notes

- **Database extraction**
  - Move `schema.prisma` and `migrations/` from `apps/bot/` into a shared `packages/db/`.
  - Export a generated Prisma client from `packages/db/` for both `bot` and future `web` apps.
  - Extract DB helpers (currently in `apps/bot/src/lib/db.ts`) into that package.

- **Adapters**
  - Flesh out `packages/adapters/event-publisher` with a stable `IPublisher` interface.
  - Implement publishers for external platforms (Meetup, Luma, Partiful).
  - Allow guilds to configure publishing destinations via slash commands.

- **Link enrichment**
  - Parse and normalize links provided in `/suggest`:
    - OpenGraph metadata (title, preview).
    - Place resolvers (Google Maps, Yelp).
  - Store normalized venue data in `place` table for reuse and deduplication.

- **Event types**
  - Generalize beyond food meetups:
    - Support categories like board game nights, study groups, fitness events.
    - Allow custom tags for filtering in the (future) web UI.

- **Web app**
  - Minimal admin/history UI under `apps/web/`.
  - Features: past events, photos, attendance snapshots, analytics.
  - Reuse the same DB package.

- **Multi-tenancy**
  - Tables already include `guildId`. Future: host as multi-tenant with per-guild isolation and config.

- **Plugin hooks**
  - Photo/media ingestion.
  - History export for guild admins.
  - (Optional) calendar sync (Google Calendar, Outlook).
