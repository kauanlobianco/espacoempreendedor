-- CreateEnum
CREATE TYPE "AttendanceInteractionType" AS ENUM ('SIMPLE_GUIDANCE', 'GUIDANCE_WITH_REFERRAL', 'DETAILED_SUPPORT', 'ONGOING_CASE');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "actionTaken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "demandDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "interactionType" "AttendanceInteractionType" NOT NULL DEFAULT 'SIMPLE_GUIDANCE',
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "needsFollowUp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outcome" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "durationMin" SET DEFAULT 15;
