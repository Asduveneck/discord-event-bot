import { ButtonInteraction } from 'discord.js';
import { prisma } from '../../lib/db.js';
import { ensurePromotion } from '../../services/promotion';

export const data = { id: 'vote' };

export async function execute(inter: ButtonInteraction, proposalId: string, optionId: string) {
  await prisma.proposalVote.upsert({
    where: { proposalId_userId: { proposalId, userId: inter.user.id }},
    create: { proposalId, userId: inter.user.id, timeOptionId: optionId },
    update: { timeOptionId: optionId, votedAt: new Date() }
  });
  const uniqueCount = await prisma.proposalVote.count({ where: { proposalId }});
  await inter.reply({ ephemeral: true, content: 'Vote recorded ✅' });
  const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
  if (proposal) {
    // snapshot attendee on vote (optional; can move to finalize later)
    await prisma.eventAttendeeSnapshot.upsert({
      where: { proposalId_userId: { proposalId, userId: inter.user.id }},
      create: { proposalId, userId: inter.user.id, role: 'attendee' },
      update: {}
    });
    await ensurePromotion(inter.client, proposal, uniqueCount);
  }
}

export default { data, execute };
