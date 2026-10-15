# Lexicon data

How the Admin loads the Lexicon into the database ([ADR 0007](adr/0007-lexicon-loaded-directly-into-database.md)). The `headword` and `sense` tables are created by the Lexicon phase's migration ([roadmap](roadmap.md)); this page is the contract that migration implements. Terms follow [CONTEXT.md](../CONTEXT.md).

## What you fill

One row per **Sense** (one meaning). Several Senses can share a Headword: "run" (manage a business) and "run" (move fast) are two rows with the same `headword` and different `lexicon_key`s ([ADR 0001](adr/0001-sense-is-the-unit-of-learning.md)).

| Field | Required | Format | Example |
|---|---|---|---|
| `lexicon_key` | yes | Unique and **permanent**: `<headword>.<pos>.<gloss>`, lowercase, `-` for spaces | `run.v.manage`, `look-forward-to.pv.anticipate` |
| `headword` | yes | The written form, as displayed | `run`, `look forward to` |
| `part_of_speech` | yes | One of the values below | `verb` |
| `definition` | yes | One meaning, in plain learner-friendly English | `to manage or be in charge of a business or activity` |
| `pronunciation_ipa` | no | IPA between slashes; leave empty if unsure (FR-03: never show unverified data) | `/rʌn/` |
| `examples` | yes, 1–3 | Full natural sentences using this Sense | `She runs a small bakery near the station.` |
| `collocations` | no | Common patterns for this Sense | `run a business`, `run a meeting` |
| `topic` | no | One lowercase word | `work` |
| `difficulty` | yes | `basic` · `intermediate` · `advanced` | `intermediate` |
| `rank` | yes | Positive integer. Lower = offered earlier as a New Target within its difficulty (e.g. a frequency rank) | `120` |

**Part of speech** (key abbreviation in brackets): `noun` (n) · `verb` (v) · `adjective` (adj) · `adverb` (adv) · `phrasal verb` (pv) · `idiom` (idiom) · `phrase` (phr) · `preposition` (prep) · `conjunction` (conj).

**Everything else has a database default**, so leave it out: `id`, `headword_id` (resolved by the import SQL below), `normalized_text`, `origin` (`lexicon`), `owner_learner_id` (NULL), `verification` (`admin_curated`), `archived_at`, `created_at`, `updated_at`.

## Rules

- **Never change or reuse a `lexicon_key`.** Learner progress points at the Sense; the key is how a re-import finds it again. Fixing a typo in a definition is an update in place. A different meaning is a new key.
- **Never delete a Sense.** Retire it by setting `archived_at`; it stops being offered as a New Target, and Learners' history stays intact.
- **Don't touch rows with `origin = 'learner'`.** Those are Learners' private Personal Senses.
- **Enough content per level.** Each Mission draws mostly New Targets at the Learner's level, falling back to an adjacent level. ~100 Senses at your own level last about a month of daily Missions.

## How to import

Fill a flat staging table (one row per Sense, `|` between list items), then move it into `headword` and `sense` in one script. Re-running the script with changed rows updates them; it never duplicates.

Keep the staging table **out of the `public` schema**: Supabase's Data API exposes `public` to anyone with the publishable key.

### 1. Create the staging table (once per database)

```sql
create schema if not exists staging;

create table if not exists staging.lexicon (
  lexicon_key       text primary key,
  headword          text not null,
  part_of_speech    text not null,
  definition        text not null,
  pronunciation_ipa text,
  examples          text not null, -- 'Sentence one.|Sentence two.'
  collocations      text,          -- 'run a business|run a meeting'
  topic             text,
  difficulty        text not null,
  rank              int  not null
);
```

### 2. Fill it

Either import a CSV with exactly these columns into `staging.lexicon` (Supabase Studio → Table editor → schema `staging` → Import data from CSV), or `INSERT` rows:

```sql
insert into staging.lexicon values
  ('run.v.manage', 'run', 'verb', 'to manage or be in charge of a business or activity', '/rʌn/',
   'She runs a small bakery near the station.|Who runs the meeting today?',
   'run a business|run a meeting', 'work', 'intermediate', 120);
```

### 3. Move it into the Lexicon

```sql
begin;

-- One Headword per normalized text (lowercase, trimmed, single spaces).
insert into headword (text, normalized_text)
select distinct on (n) headword, n
from (select headword, lower(regexp_replace(btrim(headword), '\s+', ' ', 'g')) as n
      from staging.lexicon) s
on conflict (normalized_text) do nothing;

-- Upsert Senses by lexicon_key; re-importing a retired key brings it back.
insert into sense (headword_id, lexicon_key, part_of_speech, definition, pronunciation_ipa,
                   examples, collocations, topic, difficulty, rank)
select h.id, s.lexicon_key, s.part_of_speech, s.definition, nullif(btrim(s.pronunciation_ipa), ''),
       regexp_split_to_array(btrim(s.examples), '\s*\|\s*'),
       coalesce(regexp_split_to_array(nullif(btrim(s.collocations), ''), '\s*\|\s*'), '{}'),
       nullif(btrim(s.topic), ''), s.difficulty::self_assessed_level, s.rank
from staging.lexicon s
join headword h on h.normalized_text = lower(regexp_replace(btrim(s.headword), '\s+', ' ', 'g'))
on conflict (lexicon_key) do update set
  headword_id       = excluded.headword_id,
  part_of_speech    = excluded.part_of_speech,
  definition        = excluded.definition,
  pronunciation_ipa = excluded.pronunciation_ipa,
  examples          = excluded.examples,
  collocations      = excluded.collocations,
  topic             = excluded.topic,
  difficulty        = excluded.difficulty,
  rank              = excluded.rank,
  archived_at       = null,
  updated_at        = now();

commit;
```

If the script fails, nothing is written: the database constraints reject a bad row (missing field, unknown `difficulty`, empty `examples`) and the transaction rolls back. Fix the row in staging and run it again.

### 4. Optional: retire Senses you removed

Only when `staging.lexicon` holds the **whole** Lexicon, not a partial batch:

```sql
update sense set archived_at = now()
where origin = 'lexicon' and archived_at is null
  and lexicon_key not in (select lexicon_key from staging.lexicon);
```

### 5. Clear staging for the next batch

```sql
truncate staging.lexicon;
```

## Where to load it

- **Local** (`npm run start:dev`): the local Supabase database, via Studio at `http://127.0.0.1:54323` or `psql`.
- **Deployed**: the Supabase project's SQL editor.
- **Tests**: never. e2e tests create their own Senses, so CI runs against an empty Lexicon.
