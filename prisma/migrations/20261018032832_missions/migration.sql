-- CreateEnum
CREATE TYPE "learning_status" AS ENUM ('new', 'learning', 'needs_practice', 'proficient');

-- CreateEnum
CREATE TYPE "mission_status" AS ENUM ('open', 'completed', 'abandoned');

-- CreateEnum
CREATE TYPE "target_source" AS ENUM ('new', 'review', 'personal');

-- CreateEnum
CREATE TYPE "target_state" AS ENUM ('pending', 'passed', 'needs_correction', 'corrected');

-- CreateTable
CREATE TABLE "learner_sense" (
    "learner_id" UUID NOT NULL,
    "sense_id" UUID NOT NULL,
    "status" "learning_status" NOT NULL DEFAULT 'new',
    "review_step" INTEGER NOT NULL DEFAULT 0,
    "due_on" DATE,
    "last_practised_at" TIMESTAMPTZ,

    CONSTRAINT "learner_sense_pkey" PRIMARY KEY ("learner_id","sense_id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "learner_id" UUID NOT NULL,
    "mode" "mission_mode" NOT NULL,
    "status" "mission_status" NOT NULL DEFAULT 'open',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_on" DATE NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "completed_on" DATE,
    "abandoned_at" TIMESTAMPTZ,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mission_id" UUID NOT NULL,
    "sense_id" UUID NOT NULL,
    "source" "target_source" NOT NULL,
    "position" INTEGER NOT NULL,
    "state" "target_state" NOT NULL DEFAULT 'pending',

    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "target_mission_id_sense_id_key" ON "target"("mission_id", "sense_id");

-- AddForeignKey
ALTER TABLE "learner_sense" ADD CONSTRAINT "learner_sense_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_sense" ADD CONSTRAINT "learner_sense_sense_id_fkey" FOREIGN KEY ("sense_id") REFERENCES "sense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target" ADD CONSTRAINT "target_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target" ADD CONSTRAINT "target_sense_id_fkey" FOREIGN KEY ("sense_id") REFERENCES "sense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Hand-written: at most one Open Mission per Learner (Prisma can't express partial indexes).
CREATE UNIQUE INDEX "one_open_mission" ON "mission" ("learner_id") WHERE "status" = 'open';

-- Hand-written: a Mission's end timestamps match its status.
ALTER TABLE "mission" ADD CONSTRAINT "mission_completed_check" CHECK (("status" = 'completed') = ("completed_at" IS NOT NULL) AND ("completed_at" IS NULL) = ("completed_on" IS NULL));
ALTER TABLE "mission" ADD CONSTRAINT "mission_abandoned_check" CHECK (("status" = 'abandoned') = ("abandoned_at" IS NOT NULL));

ALTER TABLE "learner_sense" ADD CONSTRAINT "learner_sense_review_step_check" CHECK ("review_step" >= 0);

-- Hand-written: deny-all RLS keeps Supabase's Data API off the tables (ADR 0002). The API's owner role bypasses it.
ALTER TABLE "learner_sense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "target" ENABLE ROW LEVEL SECURITY;
