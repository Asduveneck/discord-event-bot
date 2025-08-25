-- CreateTable
CREATE TABLE "GuildSettings" (
    "guildId" TEXT NOT NULL,
    "name" TEXT,
    "tz" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "suggestionsChannelId" TEXT,
    "approvedChannelId" TEXT,
    "roleHostId" TEXT,
    "defaultTemplate" TEXT NOT NULL DEFAULT 'food',
    "defaultPlatform" TEXT NOT NULL DEFAULT 'ics',
    "features" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "provider" TEXT,
    "providerRef" TEXT,
    "url" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT,
    "messageId" TEXT,
    "creatorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "link" TEXT,
    "placeId" TEXT,
    "minCap" INTEGER,
    "maxCap" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "approvedThreadId" TEXT,
    "privateThreadId" TEXT,
    "customFields" JSONB NOT NULL DEFAULT '{}',
    "votingEndsAt" TIMESTAMP(3),

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalTimeOption" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalTimeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalVote" (
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeOptionId" TEXT NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalVote_pkey" PRIMARY KEY ("proposalId","userId")
);

-- CreateTable
CREATE TABLE "EventAttendeeSnapshot" (
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "EventAttendeeSnapshot_pkey" PRIMARY KEY ("proposalId","userId")
);

-- CreateTable
CREATE TABLE "EventMedia" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "storageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProposalVote_timeOptionId_idx" ON "ProposalVote"("timeOptionId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalTimeOption" ADD CONSTRAINT "ProposalTimeOption_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_timeOptionId_fkey" FOREIGN KEY ("timeOptionId") REFERENCES "ProposalTimeOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendeeSnapshot" ADD CONSTRAINT "EventAttendeeSnapshot_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMedia" ADD CONSTRAINT "EventMedia_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
