# Review uses a fixed interval ladder, not FSRS/SM-2

Review scheduling uses the PRD's interval ladder (1, 3, 7, 14, 30 days, held in config). An Appropriate Practice verdict moves a Sense up one Review Step; a Needs-improvement verdict drops it back to the first step. We rejected FSRS and SM-2 even though they schedule better in theory: they are tuned for flashcard self-ratings ("again / hard / good / easy"), not for AI Usage Verdicts, and they are hard to debug while the founder is still the only Learner. A future reader will be tempted to "upgrade" this; do it only once real verdict data shows the ladder failing (for example, Delayed-retention metrics stalling).

## Consequences

- Scheduling lives in one pure function over (current step, verdict, date), so swapping the algorithm later is cheap.
