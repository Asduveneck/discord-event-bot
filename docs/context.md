# Gathercord – Context

## Goal
A self‑hosted Discord bot for in‑person meetups.
- Propose events with link + times.
- Members vote.
- Bot promotes proposals to threads once thresholds are hit.
- Extensible via plugins for external platforms (Meetup, Luma, Partiful).
- Optional web UI for history/photos.

## Why This Isn’t Redundant
- Existing tools (Apollo, Partiful, Luma) are external platforms; coordination happens outside Discord.
- Popular event bots on Discord are closed‑source SaaS; there’s no simple OSS, self‑host template with min→public/max→private **thread** workflow.

## Scope & Non‑Goals (MVP)
**In**: slash‑based config, suggest→vote→promote, thread creation, basic persistence.
**Out** (plugins or later): place APIs, external publishing, web UI, media storage.

## Principles
- Keep MVP tight; ship fast and dogfood.
- Self‑host per guild; include `guildId` in tables to allow future multi‑tenant.
- Secrets in env; all feature config in DB via commands/UI.
- Prefer buttons + ephemeral acks; keep UX rate‑limit friendly.

## Naming & SEO
- **Brand**: Gathercord (memorable, Discord‑y).
- **Repo slug**: `discord-event-bot` for discoverability.
- **Description**: “Gathercord — a self‑hosted Discord event bot for IRL meetups.”

