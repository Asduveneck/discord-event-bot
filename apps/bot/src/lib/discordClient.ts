import { Client, GatewayIntentBits, Partials, Collection, REST } from 'discord.js';
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

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});
