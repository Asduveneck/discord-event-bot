import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../lib/db.js';

export const statusData = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Show bot configuration for this server');

export async function execute(inter: ChatInputCommandInteraction) {
  const guildId = inter.guildId!;
  const gs = await prisma.guildSettings.findUnique({ where: { guildId } });
  if (!gs) return inter.reply({ ephemeral: true, content: 'Not configured. Run /setup' });
  const lines = [
    `TZ: ${gs.tz}`,
    `Suggestions: ${gs.suggestionsChannelId ? '<#'+gs.suggestionsChannelId+'>' : 'unset'}`,
    `Approved: ${gs.approvedChannelId ? '<#'+gs.approvedChannelId+'>' : 'unset'}`,
    `Default template: ${gs.defaultTemplate}`
  ];
  await inter.reply({ ephemeral: true, content: lines.join('\n') });
}

export default { data: statusData, execute };
