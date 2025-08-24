import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { prisma } from '../../lib/db.js';

export const setupData = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Configure channels, timezone, and defaults')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption(o => o.setName('suggestions').setDescription('Channel for suggestions'))
  .addChannelOption(o => o.setName('approved').setDescription('Channel for approved threads'))
  .addStringOption(o => o.setName('tz').setDescription('IANA TZ, e.g., America/Los_Angeles'))
  .addIntegerOption(o => o.setName('min').setDescription('Default min'))
  .addIntegerOption(o => o.setName('max').setDescription('Default max'));

export async function execute(inter: ChatInputCommandInteraction) {
  const guildId = inter.guildId!;
  await prisma.guildSettings.upsert({
    where: { guildId },
    update: {
      suggestionsChannelId: inter.options.getChannel('suggestions')?.id ?? undefined,
      approvedChannelId: inter.options.getChannel('approved')?.id ?? undefined,
      tz: inter.options.getString('tz') ?? undefined,
    },
    create: {
      guildId,
      suggestionsChannelId: inter.options.getChannel('suggestions')?.id ?? undefined,
      approvedChannelId: inter.options.getChannel('approved')?.id ?? undefined,
      tz: inter.options.getString('tz') ?? 'America/Los_Angeles',
    }
  });
  await inter.reply({ ephemeral: true, content: 'Setup saved ✅' });
}

export default { data: setupData, execute };
