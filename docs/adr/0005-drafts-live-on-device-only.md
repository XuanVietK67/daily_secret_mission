# Drafts live on the device only

The PRD requires saving drafts (FR-04, BR-08). A Draft (an unsent recording) is kept only by the Expo app on the device; the server only knows that a Mission is Open. So nothing private reaches our storage, or any AI vendor, until the Learner chooses to send it. Multi-device sync is post-MVP anyway (PRD §6.2). The trade-off: a Draft is lost if the app is uninstalled or the Learner switches phones.

## Consequences

- There is no draft endpoint or draft table; "resume" means re-opening the Open Mission and its local recordings.
- Server-side drafts can be added later as an unevaluated Submission state without changing existing data.
