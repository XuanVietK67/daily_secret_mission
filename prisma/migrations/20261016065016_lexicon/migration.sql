-- CreateEnum
CREATE TYPE "sense_origin" AS ENUM ('lexicon', 'learner');

-- CreateEnum
CREATE TYPE "sense_verification" AS ENUM ('admin_curated', 'learner_confirmed', 'draft');

-- CreateTable
CREATE TABLE "headword" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "normalized_text" TEXT NOT NULL,

    CONSTRAINT "headword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sense" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "headword_id" UUID NOT NULL,
    "origin" "sense_origin" NOT NULL DEFAULT 'lexicon',
    "owner_learner_id" UUID,
    "verification" "sense_verification" NOT NULL DEFAULT 'admin_curated',
    "lexicon_key" TEXT,
    "part_of_speech" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "pronunciation_ipa" TEXT,
    "examples" TEXT[],
    "collocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topic" TEXT,
    "difficulty" "self_assessed_level",
    "rank" INTEGER,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "headword_normalized_text_key" ON "headword"("normalized_text");

-- CreateIndex
CREATE UNIQUE INDEX "sense_lexicon_key_key" ON "sense"("lexicon_key");

-- CreateIndex
CREATE INDEX "sense_headword_id_idx" ON "sense"("headword_id");

-- AddForeignKey
ALTER TABLE "sense" ADD CONSTRAINT "sense_headword_id_fkey" FOREIGN KEY ("headword_id") REFERENCES "headword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sense" ADD CONSTRAINT "sense_owner_learner_id_fkey" FOREIGN KEY ("owner_learner_id") REFERENCES "learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Hand-written: Lexicon Senses have no owner; Learner-owned Senses do.
ALTER TABLE "sense" ADD CONSTRAINT "sense_origin_owner_check" CHECK (("origin" = 'lexicon') = ("owner_learner_id" IS NULL));

-- Hand-written: only Learner-owned Senses can be draft or learner_confirmed.
ALTER TABLE "sense" ADD CONSTRAINT "sense_origin_verification_check" CHECK ("origin" = 'learner' OR "verification" = 'admin_curated');

-- Hand-written: Lexicon Senses need a key, difficulty and rank (docs/lexicon-data.md).
ALTER TABLE "sense" ADD CONSTRAINT "sense_lexicon_fields_check" CHECK ("origin" <> 'lexicon' OR ("lexicon_key" IS NOT NULL AND "difficulty" IS NOT NULL AND "rank" IS NOT NULL));

-- Hand-written: CHECK rather than NOT NULL, which Prisma lists can't declare and would drift.
ALTER TABLE "sense" ADD CONSTRAINT "sense_examples_check" CHECK ("examples" IS NOT NULL AND cardinality("examples") >= 1);
ALTER TABLE "sense" ADD CONSTRAINT "sense_collocations_check" CHECK ("collocations" IS NOT NULL);

ALTER TABLE "sense" ADD CONSTRAINT "sense_rank_check" CHECK ("rank" > 0);

-- Hand-written: deny-all RLS keeps Supabase's Data API off the tables (ADR 0002). The API's owner role bypasses it.
ALTER TABLE "headword" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sense" ENABLE ROW LEVEL SECURITY;
