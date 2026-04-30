-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "CourseModuleStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseModuleProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "moduleSlug" TEXT NOT NULL,
    "status" "CourseModuleStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CourseQuizAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" JSONB NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CourseModuleProgress_studentId_courseSlug_idx" ON "CourseModuleProgress"("studentId", "courseSlug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "CourseModuleProgress_studentId_courseSlug_moduleSlug_key" ON "CourseModuleProgress"("studentId", "courseSlug", "moduleSlug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CourseQuizAttempt_studentId_courseSlug_idx" ON "CourseQuizAttempt"("studentId", "courseSlug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CourseQuizAttempt_attemptedAt_idx" ON "CourseQuizAttempt"("attemptedAt");

-- AddForeignKey
DO $$
BEGIN
    ALTER TABLE "CourseModuleProgress" ADD CONSTRAINT "CourseModuleProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
    ALTER TABLE "CourseQuizAttempt" ADD CONSTRAINT "CourseQuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
