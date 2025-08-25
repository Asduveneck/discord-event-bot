import { REST, Routes } from 'discord.js';
import { Env } from './env.js';
import { setupData } from '../ui/commands/setup.js';
import { suggestData } from '../ui/commands/suggest.js';
import { statusData } from '../ui/commands/status.js';

const rest = new REST({ version: '10' }).setToken(Env.DISCORD_TOKEN);

async function main() {
  const body = [setupData, suggestData, statusData].map(c => c.toJSON());
  // Global registration; for faster dev, register per guild with Routes.applicationGuildCommands
  await rest.put(Routes.applicationCommands(Env.DISCORD_CLIENT_ID), { body });
  console.log('✅ Slash commands registered.');
}
main().catch(console.error);
