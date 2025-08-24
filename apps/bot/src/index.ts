import 'dotenv/config';
import { client, commands, buttons } from './core/client.js';
import { Env } from './core/env.js';

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
import './core/router.js';

client.login(Env.DISCORD_TOKEN);
