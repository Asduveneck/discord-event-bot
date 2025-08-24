import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../../lib/db.js';

export const suggestData = new SlashCommandBuilder()
  .setName('suggest')
  .setDescription('Suggest an IRL meetup')
  .addStringOption(o => o.setName('type').setDescription('food|hike|custom').setRequired(true))
  .addStringOption(o => o.setName('link').setDescription('Venue/trail link'))
  .addStringOption(o => o.setName('times').setDescription('e.g., "Fri 7pm; Sat 1pm"'))
  .addIntegerOption(o => o.setName('min').setDescription('Min attendees'))
  .addIntegerOption(o => o.setName('max').setDescription('Max attendees'));

export async function execute(inter: ChatInputCommandInteraction) {
  const guildId = inter.guildId!;
  const type = inter.options.getString('type', true);
  const link = inter.options.getString('link') ?? undefined;
  const minCap = inter.options.getInteger('min') ?? 4;
  const maxCap = inter.options.getInteger('max') ?? 8;

  // TODO: parse times; MVP puts two options 90 min apart
  const now = new Date();
  const in2h = new Date(Date.now()+2*3600e3);

  const p = await prisma.proposal.create({
    data: { guildId, creatorId: inter.user.id, type, title: type, link, minCap, maxCap, status:'open', channelId: inter.channelId }
  });

  const [o1,o2] = await Promise.all([
    prisma.proposalTimeOption.create({ data: { proposalId: p.id, startAt: now, endAt: new Date(now.getTime()+90*60e3) } }),
    prisma.proposalTimeOption.create({ data: { proposalId: p.id, startAt: in2h, endAt: new Date(in2h.getTime()+90*60e3) } }),
  ]);

  const embed = new EmbedBuilder()
    .setTitle(`🗓️ New ${type} meetup`)
    .setDescription(link ?? 'Pick a time below')
    .setFooter({ text: `Min ${minCap} · Max ${maxCap}` });

  const buttons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder().setCustomId(`vote:${p.id}:${o1.id}`).setLabel(new Date(o1.startAt).toLocaleString()).setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`vote:${p.id}:${o2.id}`).setLabel(new Date(o2.startAt).toLocaleString()).setStyle(ButtonStyle.Primary),
    );

  const msg = await inter.channel!.send({ embeds: [embed], components: [buttons] });
  await prisma.proposal.update({ where: { id: p.id }, data: { messageId: msg.id }});
  await inter.reply({ ephemeral: true, content: 'Posted ✅' });
}

export default { data: suggestData, execute };
