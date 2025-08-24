import { Client, GatewayIntentBits, Partials, Collection, REST, Routes } from 'discord.js';
import { Env } from './env.js';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
});

export const commands = new Collection<string, any>();
export const buttons = new Collection<string, any>();

export const rest = new REST({ version: '10' }).setToken(Env.DISCORD_TOKEN);

export async function registerSlashCommands(commandsData: any[]) {
  try {
    const body = commandsData.map(c => c.toJSON());
    await rest.put(Routes.applicationCommands(Env.DISCORD_CLIENT_ID), { body });
    console.log(`✅ Registered ${body.length} slash commands.`);
  } catch (error) {
    console.error('❌ Failed to register slash commands:', error);
    throw error;
  }
}

client.on('ready', async () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});
