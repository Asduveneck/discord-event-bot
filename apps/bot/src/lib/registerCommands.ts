import { REST, Routes } from 'discord.js';
import { Env } from './env.js';
import { setupData } from '../ui/commands/setup.js';
import { suggestData } from '../ui/commands/suggest.js';
import { statusData } from '../ui/commands/status.js';

const rest = new REST({ version: '10' }).setToken(Env.DISCORD_TOKEN);

const commandsData = [setupData, suggestData, statusData];

async function registerGlobal() {
  try {
    const body = commandsData.map(c => c.toJSON());
    await rest.put(Routes.applicationCommands(Env.DISCORD_CLIENT_ID), { body });
    console.log(`✅ Registered ${body.length} slash commands globally.`);
  } catch (error) {
    console.error('❌ Failed to register global commands:', error);
    throw error;
  }
}

async function registerGuild(guildId: string) {
  try {
    const body = commandsData.map(c => c.toJSON());
    await rest.put(Routes.applicationGuildCommands(Env.DISCORD_CLIENT_ID, guildId), { body });
    console.log(`✅ Registered ${body.length} slash commands to guild ${guildId}.`);
  } catch (error) {
    console.error(`❌ Failed to register commands to guild ${guildId}:`, error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const guildId = args[0];

  if (guildId) {
    await registerGuild(guildId);
  } else {
    await registerGlobal();
  }
}

main().catch(console.error);
