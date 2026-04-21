-- CreateEnum
CREATE TYPE "ExtensionReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SIGNED', 'COMPLETED', 'RETURNED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_SUBMITTED';
ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_CLAIMED';
ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_RETURNED';
ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_SIGNED';
ALTER TYPE "AuditAction" ADD VALUE 'EXTENSION_REPORT_COMPLETED';

-- CreateTable
CREATE TABLE "ExtensionReport" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" "ExtensionReportStatus" NOT NULL DEFAULT 'DRAFT',
    "narrative" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "generatedPdfKey" TEXT,
    "signedPdfKey" TEXT,
    "signedPdfHash" TEXT,
    "reviewerNote" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtensionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtensionReportItem" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "attendanceId" TEXT,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "snapshotChannel" TEXT NOT NULL,
    "snapshotCategory" "CaseCategory" NOT NULL,
    "snapshotSummary" TEXT NOT NULL,
    "snapshotAction" TEXT NOT NULL,
    "snapshotOutcome" TEXT NOT NULL,
    "snapshotStatus" TEXT NOT NULL,
    "snapshotHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExtensionReportItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionReport_code_key" ON "ExtensionReport"("code");

-- CreateIndex
CREATE INDEX "ExtensionReport_studentId_status_idx" ON "ExtensionReport"("studentId", "status");

-- CreateIndex
CREATE INDEX "ExtensionReport_status_idx" ON "ExtensionReport"("status");

-- CreateIndex
CREATE INDEX "ExtensionReportItem_caseId_idx" ON "ExtensionReportItem"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionReportItem_reportId_caseId_key" ON "ExtensionReportItem"("reportId", "caseId");

-- AddForeignKey
ALTER TABLE "ExtensionReport" ADD CONSTRAINT "ExtensionReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionReport" ADD CONSTRAINT "ExtensionReport_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionReportItem" ADD CONSTRAINT "ExtensionReportItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ExtensionReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionReportItem" ADD CONSTRAINT "ExtensionReportItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtensionReportItem" ADD CONSTRAINT "ExtensionReportItem_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
