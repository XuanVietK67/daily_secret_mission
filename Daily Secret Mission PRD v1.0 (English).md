# Daily Secret Mission — Product Requirements Document (PRD) v1.0

Oct 13, 2026 · @xuanviet

- **Status:** Product requirements for the MVP
- **Language:** English (translated from the Vietnamese v1.0)
- **Version:** 1.0
- **Initial implementation audience:** One developer; the founder uses and tests the product first
- **Document scope:** Goals, experience, functional requirements, business rules, acceptance criteria, privacy, and MVP boundaries
- **Outside document scope:** System architecture, technology choices, and infrastructure design
  
## 1. Product Summary

**Daily Secret Mission** is an English vocabulary learning app that teaches words by having users actively use them in everyday situations. Each day, the user receives a mission containing target vocabulary, chooses a situation that fits their own experience, records a spoken response, and can optionally write a supplementary journal entry. AI evaluates how the words were used, explains mistakes, suggests more natural phrasing, and tracks the words the user needs to practice more.

The app combines three pillars:

1. **Real-life learning:** learning words by using them in meaningful, personal contexts.
2. **Personal AI coach:** detailed feedback, tracking of weak points, and missions personalized from learning data.
3. **Gamification:** XP, streaks, and milestones that support a consistent study habit without equating rewards with actual proficiency.

### Value proposition

> Turn passive vocabulary into the ability to use English in everyday life, one small mission at a time.

## 2. Problem and Opportunity

Learners often recognize words when reading or listening but struggle to actively recall and use them when speaking. Studying with word lists or flashcards alone does not always bridge the gap between knowledge and real communication.

Daily Secret Mission addresses this by asking users to try using words in their own contexts, receive specific feedback, and encounter the words again in later practice sessions.

### Product hypotheses to validate

- Users can sustain one short mission per day.
- Creating their own personal context helps users actively use words better.
- Specific AI feedback helps users understand and correct mistakes.
- Review based on word-usage history improves the ability to remember and apply words over time.
- XP and streaks support habit-building without encouraging careless submissions.

## 3. Goals and Success Metrics

### 3.1. Goals

1. Help users use target words more correctly and naturally in context.
2. Build a regular English practice habit with a flexible workload.
3. Detect and prioritize words the user often forgets or misuses.
4. Provide useful, explained, actionable feedback.
5. Ensure users stay in control of their submissions and personal data.

### 3.2. Metrics to track

- **Mission completion rate:** the share of missions completed according to the rules.
- **Weekly active learning days:** the number of days with learning activity per week.
- **Correct usage rate:** the share of word uses evaluated as appropriate.
- **Delayed retention:** the ability to use a word correctly in a later session after a delay.
- **Correction success rate:** the share of errors improved after the correction step.
- **Time to complete:** the actual time taken to complete a mission.
- **AI feedback usefulness:** user ratings of how useful and accurate the AI's comments are.

Total XP, number of audio submissions, or streak alone are not sufficient evidence that vocabulary proficiency has improved.

During the self-testing phase, the user can track these metrics in a simple statistics table. No hard numeric targets are set until baseline data exists.

## 4. Target Users and Initial Setup

### 4.1. MVP audience

Initially, the product serves the founder for self-use and testing. It should be general enough to expand to other English learners later, but the MVP does not need community features or complex multi-user support.

### 4.2. Level setup

- The user selects their starting level or learning goal.
- A short assessment is optional; the system may recommend it but does not require it.
- The initial assessment result is only an estimate, not a fixed label.
- The system adjusts word selection based on actual practice results.
- The user can change their goal or difficulty level.
- When evidence is insufficient, the system does not confidently claim an exact level.

Starting levels can use easy-to-understand labels such as **Basic, Intermediate, Advanced**. If CEFR is used later, the app must explain that its in-app level is an estimate and does not replace an official certificate.

## 5. Product Principles

1. **Practice matters more than passive memorization.**
2. **Effort does not equal mastery.**
3. **One correct use is not enough to conclude a word is mastered.**
4. **AI must express uncertainty when evidence is lacking.**
5. **Users choose their own contexts and control their learning.**
6. **Missions must be short and achievable within a busy life.**
7. **Rewards must not encourage spam or mechanical repetition.**
8. **Personal data and recordings must be protected under a clear policy.**

## 6. MVP Scope

### 6.1. Included (Must-have)

- Initial level and learning-goal setup.
- Choosing the number of target words per day.
- Choosing a duration mode: Quick Mission, Daily Mission, Deep Practice.
- Receiving missions containing new words, review words, and relevant personal words.
- Viewing meaning, pronunciation, examples, collocations, and usage patterns.
- Adding, editing, and deleting personal words/phrases.
- Choosing a real-life situation to practice the words in.
- Recording, playing back, submitting, and saving drafts.
- Optional supplementary journal writing.
- Receiving AI feedback on word usage and key errors.
- Correcting sentences or doing a short exercise for words not yet achieved.
- Tracking each word's status and practice history.
- A basic review schedule.
- XP, streaks, milestones, and mission history.
- Viewing and deleting submissions/data according to the published policy.
- Clearly showing when the AI lacks enough data to evaluate.

### 6.2. Deferred until after the MVP

- Virtual pets, item shops, and an in-game economy.
- Leaderboards, competitions, and social features.
- Public or community sharing of spoken submissions.
- Live multi-turn voice conversations with AI.
- Automatic word extraction from movies, videos, websites, or books.
- Complex long-term study plans managed autonomously by AI.
- Creating and managing community vocabulary sets.
- In-depth pronunciation assessment, unless a reliable method exists.
- Paid plans, ads, or other monetization.
- Advanced multi-device sync and full offline functionality.

## 7. Core User Flows

### 7.1. Onboarding flow

1. The user opens the app.
2. Selects a self-assessed level and goal.
3. Optionally takes a short assessment.
4. Chooses the number of words per day and the preferred duration.
5. Views the first mission and instructions on how to complete it.

### 7.2. Daily mission flow

1. The system selects words based on the review schedule, word status, goals, and interests.
2. The user views the words and the necessary information.
3. The user picks a situation from their own life or chooses a suggestion.
4. The user records a spoken response; a text journal is optional.
5. The user plays it back, saves a draft, or submits.
6. The AI analyzes the content and evaluates each target word.
7. For words not yet achieved, the user views the explanation and completes a correction/practice step.
8. The system determines whether the mission is complete according to the rules, then updates XP/streak and word status.
9. The user views a results summary and the words to practice again.

### 7.3. Add personal word flow

1. The user enters a word or phrase.
2. The system looks up the matching entry in the existing word bank.
3. If the word has multiple meanings or lacks context, the user is asked to choose the intended meaning or confirm the information.
4. The system displays the word information and lets the user edit it.
5. The word is added to the personal list.
6. The system includes the word in missions when appropriate; it does not have to be used on the day it is added.

### 7.4. Review flow

1. The system identifies words that are due, weak, or need verification.
2. It prioritizes words with high review need while avoiding overloaded missions.
3. The user uses the word again in a new context or completes a short exercise.
4. The result updates the review schedule and proficiency level.

## 8. Functional Requirements

### FR-01 — Learning profile

The system must let users set up and edit their self-assessed level, goal, words per day, preferred duration, and time zone.

### FR-02 — Mission generation

The system must generate missions with the number of words the user chose. A mission may include new words, review words, and personal words. The system must avoid assigning the same entry twice in one mission, unless intentionally practicing different meanings.

### FR-03 — Vocabulary information

Each word needs appropriate data: the word/phrase, meaning, part of speech, pronunciation when available, examples, patterns/collocations, topic, and difficulty level. Unverified information must not be displayed as if it were certain.

### FR-04 — Audio practice

Users must be able to record, play back, submit, and save drafts. If recording or speech recognition fails, the user must be notified and be able to retry or use a supported text input method.

### FR-05 — Optional journal

Users can add supplementary text to a practice submission. A journal entry must not be required to complete a mission if the audio submission already meets the conditions.

### FR-06 — AI feedback

For each target word, the system must show one of these states: used appropriately, needs improvement, not used, or insufficient evidence. Feedback should cite the relevant evidence/sentence, give a short explanation, suggest a correction, and propose a next step.

### FR-07 — Correction and re-practice

Users must have a way to rephrase or complete a guided exercise for words not yet achieved. To preserve motivation, the system must not require perfection within a fixed number of attempts; however, word status must reflect actual results.

### FR-08 — Word status

Each word must have its own learning status, independent of mission status. Proposed statuses:

- New
- Learning
- Needs practice
- Proficient

Status can change with new evidence; a word previously rated well can return to Needs practice.

### FR-09 — Review

The system must schedule reviews and prioritize words that are due or frequently misused. Proposed starting intervals: 1, 3, 7, and 14 days, adjusted based on results. These are configurable initial values, not fixed learning rules.

### FR-10 — Gamification

The system must record XP, streaks, and milestones. XP must not substitute for proficiency status. Resubmitting the same submission must not grant the completion reward again.

### FR-11 — History and progress

Users must be able to view mission history, per-word results, words to practice, review progress, and study streak.

### FR-12 — Data control

Users must be able to view and request deletion of submissions, journal entries, audio, and related learning data according to the published policy.

## 9. Business Rules

### BR-01 — Word count and duration settings

- Default word-count options: 3 or 5; a custom count may be allowed within product limits.
- Duration:
  - **Quick Mission:** 3–5 minutes.
  - **Daily Mission:** about 10 minutes (default).
  - **Deep Practice:** 15–20 minutes.
- Duration is a target, not a hard limit.
- Short modes must not silently skip target words. The system may split content into short sentences or short exercises.

### BR-02 — Word source mix

Proposed starting mix:

- 60% new words.
- 30% review words.
- 10% personal words.

This mix is flexible. Due or weak words may take priority over the default mix. If no suitable personal words exist, that slot can go to new or review words.

### BR-03 — Criteria for a word being attempted

A word counts as attempted when the user submits valid content showing an effort to use it in context. Merely reading the word on its own, inserting it meaninglessly, or submitting unrelated content does not count as a valid attempt.

### BR-04 — Word evaluation

- Used correctly in context: record a good result for that session.
- Used incorrectly: explain the error and give a next practice step.
- Not used: mark as not practiced.
- Unclear audio/transcript: ask for clarification or re-recording; do not conclude correct/incorrect.
- AI uncertain: show insufficient evidence.
- One correct use does not automatically make a word Proficient.

### BR-05 — Mission completion

A mission is complete when:

1. The user has attempted all target words in valid content.
2. The AI has evaluated the words that have enough evidence.
3. For words not yet achieved, the user has completed at least one guided practice step, such as correcting a sentence, rephrasing, or finishing a short exercise.
4. Words still not achieved after the practice step are saved for further review; mastering every word on the same day is not required.

If a system error prevents a word from being evaluated, the mission must not be marked as failed because of that error. The user can retry or use another input method.

### BR-06 — XP

Proposed starting configuration:

- +10 XP for completing the mission workflow.
- +2 XP for each word practiced to completion that day.
- +2 XP for each successfully corrected error, with a reward cap for the same error.

These values are experimental parameters. Completion XP is not granted again when the same submission is resubmitted. Practice is not restricted just because the user has run out of reward opportunities. XP is not a proficiency score.

### BR-07 — Streak

- The streak increases at most once per day, based on the account's time zone, when a mission meets BR-05.
- Multiple missions on the same day do not increase the streak multiple times.
- Editing a submission after completion does not break the streak.
- Missing a day does not erase history or word status.
- The MVP has no mechanism for buying or using streak-protection items.

### BR-08 — Missions spanning days

- Drafts and unfinished missions are kept according to the retention policy.
- Users can continue an older mission.
- When a new day starts, unfinished words are moved into the review queue.
- A streak is not automatically granted for a previous day if the user only completes the mission on a later day, unless a clearly published product rule says otherwise.

### BR-09 — Proficiency level

Proficient status should be based on multiple pieces of evidence over time, ideally across several days and contexts. A single AI score or one correct use is not enough. The system must be able to downgrade the status if later sessions show the user has forgotten or misused the word.

### BR-10 — Situation suggestions

The user chooses the situation. The AI may offer prompting questions or examples when the user runs out of ideas, but should not by default provide a full passage that the user simply reads back as their own.

### BR-11 — Personal words

- Users can add, edit, and delete words/phrases.
- The system checks for a matching entry before creating a new one.
- For words with multiple meanings, the meaning/context the user wants to learn must be preserved.
- Words lacking reliable data must be verified before entering main missions.
- Personal words follow the same evaluation and review rules.

### BR-12 — Speech evaluation

Evaluation of word usage, grammar, and naturalness must be kept separate from pronunciation evaluation. A transcript is not enough to draw accurate conclusions about pronunciation. Without reliable audio evidence, the system must not claim to have accurately assessed pronunciation.

## 10. Acceptance Criteria

### AC-01 — Setup

**Given** the user opens the app for the first time, **When** they select a level and configure word count/duration, **Then** the system saves the choices and generates a suitable mission without requiring a placement test.

### AC-02 — Mission generation

**Given** the user chooses 5 words, **When** the mission is generated, **Then** the mission contains 5 valid target entries, with no unintended duplicates, and clearly indicates new/review/personal words where applicable.

### AC-03 — No suitable personal words

**Given** the system has no suitable personal words for the mission, **When** generating the mission, **Then** the system substitutes new or review words and does not create unsuitable words just to meet the mix.

### AC-04 — Missed words

**Given** a mission has 5 words but the submission only attempts 3, **When** the AI evaluates the submission, **Then** the two unused words are marked as not practiced and the mission is not complete.

### AC-05 — Misused word

**Given** the user attempted a word but used the wrong structure, **When** the AI gives feedback, **Then** the feedback identifies the error, offers a correction and a guided practice step; the word is not automatically marked Proficient.

### AC-06 — Successful correction

**Given** the user rephrases and correctly fixes the error, **When** the system evaluates the correction, **Then** it records the correction result and may grant correction XP if eligible; mission-completion XP is not granted again.

### AC-07 — Not yet proficient

**Given** the user has completed a guided practice step for every word but one word is still not achieved, **When** the mission is summarized, **Then** the mission can be completed, and that word remains in a needs-practice status and is scheduled for review.

### AC-08 — Insufficient evidence

**Given** the audio is unclear or the AI cannot reliably determine how a word was used, **When** generating the evaluation result, **Then** the system shows insufficient evidence and allows re-recording or an alternative method; it does not automatically mark correct/incorrect.

### AC-09 — XP anti-repeat

**Given** a mission has already been awarded completion XP, **When** the user resubmits the same submission or attempts repeated submissions, **Then** the system does not grant completion XP again for the same mission.

### AC-10 — Streak

**Given** the user completes a valid mission within a day in the account's time zone, **When** the mission is confirmed complete, **Then** the streak increases at most once for that day, regardless of how many missions are completed.

### AC-11 — Mission spanning days

**Given** the user leaves a mission unfinished and a new day begins, **When** they open the app, **Then** they can continue the draft; unpracticed words are kept in the review queue and are not deleted.

### AC-12 — Personal word with multiple meanings

**Given** the user adds a word with multiple meanings, **When** the context is not enough to determine the meaning, **Then** the system asks the user to choose a meaning or confirm before using the word in a mission.

### AC-13 — Proficiency status

**Given** the user uses a word correctly once, **When** the system updates progress, **Then** it records the good use but does not automatically conclude the word is mastered.

### AC-14 — Data deletion

**Given** the user requests deletion of a submission, **When** the deletion completes, **Then** the submission and related data are handled according to the published deletion policy; the interface no longer displays the data as if it were still intact.

## 11. Privacy and Data Management

### 11.1. Data that may be processed

- Learning profile and goals.
- Personal vocabulary and learning status.
- Audio, transcripts, and journal entries submitted by the user.
- AI feedback, per-word results, and mission history.
- XP, streaks, and progress.

### 11.2. Principles

1. Audio, transcripts, and journal content are private by default.
2. Only collect and keep data necessary to provide the published features.
3. Before launch, clearly publish how long audio is stored, whether transcripts are stored, which AI providers may process data, and for what purpose.
4. Do not use personal content by default to train or improve models beyond providing the service. Any additional use requires notice and an appropriate choice mechanism.
5. Let users view and delete submissions, journal entries, audio, and related learning data within the published scope.
6. Do not put private content on public profiles or share it with other users in the MVP.
7. Avoid including unnecessary personally identifiable information in prompts sent to the AI.
8. When data is processed by external services, disclose this and apply appropriate safeguards.
9. Review the retention, deletion, backup, and data-handling policies of providers before launch.

### 11.3. Privacy decisions to finalize before launch

- Retention period for original audio.
- Whether transcripts are kept after evaluation.
- Retention period for journal entries and AI feedback.
- Data deletion process and handling of backups.
- Scope of data sent to AI providers.
- Consent mechanism if data is to be used beyond providing the service.

These decisions must not be treated as completed by default just because they appear in the PRD.

## 12. Out of Scope

The MVP does not aim to:

- Replace a comprehensive English course or standardized certification.
- Guarantee word mastery after a fixed number of practice sessions.
- Automatically prove that every recorded situation actually happened in real life.
- Provide expert pronunciation assessment without a reliable method.
- Build a social network, competitions, or public sharing.
- Include a complex game economy or paid items.
- Automatically analyze every content source on the Internet.
- Replace a tutor or teacher in situations requiring professional assessment.

## 13. Product Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| AI evaluates incorrectly | Show evidence, support correction/re-evaluation, and an insufficient-evidence state |
| User reads sample sentences instead of actively using words | Prompt with questions; do not provide a full ready-made answer as the only way to complete the mission |
| Missions too long | Flexible modes, saved drafts, and splitting practice into smaller parts |
| XP abuse | Prevent repeat rewards, cap rewards per action, and never use XP as a measure of mastery |
| New words too hard or not useful | Use a structured word bank with difficulty levels and learner feedback |
| Personal words with wrong meanings | Verify meaning/context and let users edit |
| Review overload | Prioritize important words, cap daily volume, and keep an overdue queue |
| Private data exposure | Minimize data, publish policies, control access, and support deletion |

## 14. Assumptions and Tunable Parameters

The following values are starting points, not fixed commitments:

- Default duration of about 10 minutes.
- Quick Mission 3–5 minutes; Deep Practice 15–20 minutes.
- Initial word source mix: 60% new, 30% review, 10% personal.
- Initial review intervals: 1, 3, 7, and 14 days.
- Mission completion XP +10; each word practiced to completion +2; each successful correction +2 with a reward cap.
- Thresholds and rules for determining Proficient.
- Level of detail in AI feedback and the number of suggested correction steps.

Any change should be based on usage data, learning quality, and user feedback; it should not be optimized solely to increase time in app or number of app opens.

## 15. Readiness Criteria for Architecture Design

Architecture discussions can begin once the development team accepts that:

1. The MVP scope and out-of-scope features are clear.
2. Rules for mission completion, XP, and streaks are defined.
3. Mission status is separated from word proficiency status.
4. Word selection and review have clear starting rules.
5. AI feedback has an insufficient-evidence state and supports error correction.
6. Decisions about audio, transcripts, journals, and data deletion are finalized before launch.
7. The acceptance criteria in this document can be turned into test cases.

## 16. v1.0 Decision Summary

- **Positioning:** Learn vocabulary by using it in real life, with personalized AI and gamification.
- **Initial user:** The founder, for self-use and testing.
- **Practice situations:** Chosen by the user; AI may suggest.
- **Primary input method:** Voice recording; journal is optional.
- **Word sources:** Structured word bank + AI personalization + user-added words.
- **Level:** Self-selected; optional short assessment; adjusted based on actual data.
- **Duration:** Flexible; default about 10 minutes.
- **Completion:** Attempt all words and complete a guided practice step for words not yet achieved; mastering all words is not required.
- **XP/streak:** Reward the learning process and progress; streak based on mission completion days.
- **Review:** Initial intervals of 1, 3, 7, 14 days, adjusted based on results.
- **Privacy:** Content is private, data handling is transparently published, with rights to view and delete.
- **Not yet decided:** System architecture, tech stack, detailed audio retention policy, and some personalization thresholds that need testing.

**Conclusion:** The Daily Secret Mission MVP should focus on proving one valuable loop: receive words → use them in a personal context → get feedback → correct/practice → meet the words again after an interval. Advanced game features should only be added once the core learning loop works well.
