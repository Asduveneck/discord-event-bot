import 'dotenv/config';
import { client, commands, buttons, registerSlashCommands } from './lib/discordClient';
import { Env } from './lib/env';

// register command modules
import setup from './ui/commands/setup.js';
import suggest from './ui/commands/suggest.js';
import status from './ui/commands/status.js';
commands.set('setup', setup);
commands.set('suggest', suggest);
commands.set('status', status);

// register button modules
import vote from './ui/interactions/vote.js';
buttons.set('vote', vote);

// wire router
import './ui/router';

// Register slash commands on bot ready
client.once('ready', async () => {
  const commandsData = [setup.data, suggest.data, status.data];
  await registerSlashCommands(commandsData);
});

client.login(Env.DISCORD_TOKEN);
