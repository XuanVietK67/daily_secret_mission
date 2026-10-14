-- CreateEnum
CREATE TYPE "self_assessed_level" AS ENUM ('basic', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "mission_mode" AS ENUM ('quick', 'daily', 'deep');

-- CreateTable
CREATE TABLE "learner" (
    "id" UUID NOT NULL,
    "self_assessed_level" "self_assessed_level",
    "goal" TEXT,
    "senses_per_mission" INTEGER NOT NULL DEFAULT 5,
    "default_mode" "mission_mode" NOT NULL DEFAULT 'daily',
    "time_zone" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "learner_pkey" PRIMARY KEY ("id")
);

-- Hand-written: mirrors learningConfig.sensesPerMission (min 1, max 10).
ALTER TABLE "learner" ADD CONSTRAINT "learner_senses_per_mission_check" CHECK ("senses_per_mission" BETWEEN 1 AND 10);

-- Hand-written: deny-all RLS keeps Supabase's Data API off the table (ADR 0002). The API's owner role bypasses it.
ALTER TABLE "learner" ENABLE ROW LEVEL SECURITY;
