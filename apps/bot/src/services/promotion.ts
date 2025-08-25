import { Client, ChannelType, ThreadAutoArchiveDuration } from 'discord.js';
import { prisma } from '../lib/db.js';

export async function ensurePromotion(client: Client, proposal: any, uniqueCount: number) {
  const gs = await prisma.guildSettings.findUnique({ where: { guildId: proposal.guildId } });
  if (!gs) return;

  // Promote to public thread at min
  if (proposal.status === 'open' && proposal.minCap && uniqueCount >= proposal.minCap) {
    const ch = gs.approvedChannelId ? await client.channels.fetch(gs.approvedChannelId) : null;
    if (ch && ch.isTextBased()) {
      const thread = await (ch as any).threads.create({
        name: `🗓️ ${proposal.title ?? proposal.type}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        type: ChannelType.PublicThread
      });
      await thread.send(`Min reached! Link: https://discord.com/channels/${proposal.guildId}/${proposal.channelId}/${proposal.messageId}`);
      await prisma.proposal.update({ where: { id: proposal.id }, data: { status: 'approved', approvedThreadId: thread.id } });
    }
  }

  // Move to private at max
  if (proposal.maxCap && uniqueCount >= proposal.maxCap) {
    const ch = gs?.approvedChannelId ? await client.channels.fetch(gs.approvedChannelId) : null;
    if (ch && ch.isTextBased()) {
      const thread = await (ch as any).threads.create({
        name: `🔒 ${proposal.title ?? proposal.type}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        type: ChannelType.PrivateThread
      });

      // Invite earliest voters up to maxCap
      const votes = await prisma.proposalVote.findMany({ where: { proposalId: proposal.id }, orderBy: { votedAt: 'asc' } });
      const top = votes.slice(0, proposal.maxCap);
      for (const v of top) {
        try { await (thread as any).members.add(v.userId); } catch {}
      }

      await thread.send(`Max reached! This private thread is for confirmed attendees.`);
      await prisma.proposal.update({ where: { id: proposal.id }, data: { status: 'finalized', privateThreadId: thread.id } });
    }
  }
}
