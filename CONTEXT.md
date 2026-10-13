# Daily Secret Mission

An English vocabulary app where the learner uses target meanings in self-chosen real-life situations, records themselves, and gets AI feedback that drives later review.

## Language

### People

**Learner**:
A person who receives Missions and practises Senses.
_Avoid_: user, student, account

**Admin**:
A person who curates the Lexicon. In the MVP the founder is both Admin and the only Learner.
_Avoid_: editor, moderator, staff

### Vocabulary

**Lexicon**:
The Admin-curated store of Headwords and Senses that new Targets are drawn from.
_Avoid_: word bank, dictionary, kho từ

**Headword**:
The written form of a word or multi-word phrase; it groups one or more Senses.
_Avoid_: word, entry, term

**Sense**:
One meaning of a Headword, with its part of speech, examples and collocations. The unit of learning: progress, review and evaluation all attach to a Sense, never to a Headword.
_Avoid_: word, meaning, definition

**Personal Sense**:
A Sense the Learner put on their own list: either an existing Lexicon Sense, or a Learner-owned Sense drafted by AI and confirmed by that Learner. Learner-owned Senses stay private and never enter the Lexicon.
_Avoid_: custom word, user word, từ cá nhân

### Practice

**Mission**:
A fixed set of Targets the Learner uses in context, created when the Learner starts one. A Learner has at most one open Mission at a time; it ends Completed or Abandoned.
_Avoid_: task, quest, lesson

**Mission Mode**:
The intended length of a Mission: Quick (3–5 min), Daily (~10 min, default) or Deep (15–20 min). "Daily Mission" names a Mode, not a kind of Mission.
_Avoid_: duration, difficulty

**Target**:
A Sense assigned to one Mission, tagged with its Source: New, Review or Personal.
_Avoid_: target word, mission word

**Submission**:
One recording (or typed fallback) the Learner sends against a Mission, optionally with a Journal; each is evaluated on its own. A Mission can collect many.
_Avoid_: attempt, answer, bài làm

**Correction**:
A short Submission aimed at a single Target whose Usage Verdict fell short, made after seeing the feedback. It is the guided practice step a Mission requires before it can complete.
_Avoid_: retry, fix, exercise

**Draft**:
A recording that exists only on the Learner's device and has not been sent; the server never sees it.
_Avoid_: unsent submission, saved answer

**Journal**:
Optional free text a Learner attaches to a Submission. Never required for completion.
_Avoid_: diary, note

**Abandoned**:
A Mission the Learner gave up on; its unpractised Targets return to review instead of being lost.
_Avoid_: failed, expired, cancelled

### Progress

**Learning Status**:
A Learner's current standing on one Sense: New, Learning, Needs practice or Proficient. Independent of any Mission's state and can move backwards.
_Avoid_: mastery, level, word status

**Usage Verdict**:
The evaluation of one Target in one Submission: Appropriate, Needs improvement, Not used, or Insufficient evidence.
_Avoid_: score, grade, result

**Review Step**:
A Sense's position on the review ladder for one Learner; it decides when the Sense is next Due. Good evidence climbs the ladder, a miss drops it back.
_Avoid_: interval, box, level

**Due**:
A Sense whose review date has arrived (today or earlier, in the Learner's time zone), so it is eligible to return as a Review Target.
_Avoid_: overdue, scheduled, review queue

**Proficient**:
The Learning Status earned only by repeated Appropriate use across separate days; never from a single use, and lost again on a later miss.
_Avoid_: mastered, learned, known

### Rewards

**XP**:
Points awarded for doing the practice process, never a measure of ability. Each reward can be earned once per cause.
_Avoid_: score, points, level

**Streak**:
The count of consecutive local days (in the Learner's time zone) on which the Learner completed at least one Mission.
_Avoid_: chain, run
