import 'dotenv/config';
import { client, commands, buttons } from './lib/discordClient';
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

client.login(Env.DISCORD_TOKEN);
