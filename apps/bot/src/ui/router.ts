import { client, commands, buttons } from '../lib/discordClient';
import type { Interaction } from 'discord.js';

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = commands.get(interaction.commandName);
      if (cmd) await cmd.execute(interaction);
    } else if (interaction.isButton()) {
      const [kind, proposalId, optionId] = interaction.customId.split(':');
      if (kind === 'vote') {
        const handler = buttons.get('vote');
        if (handler) await handler.execute(interaction, proposalId, optionId);
      }
    }
  } catch (e) {
    console.error(e);
    if ('reply' in interaction && !interaction.replied) {
      // @ts-ignore
      await interaction.reply({ ephemeral: true, content: 'Something went wrong.' });
    }
  }
});
