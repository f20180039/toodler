# 07 · Prototype scope

**Answers:** what the prototype does, what it deliberately does not, and what Round 3 has to settle.
**Read after:** `06-decisions.md`.

## One screen

Node types on the left, the diagram in the middle, the selected step's parameters on the right, and
the journey stages across the top (→ D-24). There is no workflow list and no create-workflow wizard;
the diagram is the deliverable.

**Stage tabs** — Enquiry · Application · Review · Decision · **Registration** · Enrolment · Payment ·
Transfer. Where a stage holds more than one workflow, a picker beside the tabs switches between them
and reads "1 of 3" (→ D-19). Beside the picker sits the workflow's lifecycle state — Draft, Active or
Paused (→ D-10). Edits survive switching stages; *Reset stage* restores a stage's original diagram
and its original state.

**Node types** — grouped Trigger / Actions / Logic / Delays, with the four nearest future nodes
marked *Soon*. Clicking one attaches it to the selected step, and the panel header says what it will
attach to. A branch and an End cannot be attach points: a branch's paths are edited on the paths
themselves.

**The diagram** — boxes and connectors. A step with two or more children fans out and is drawn side
by side; branches draw two or more labelled paths with their conditions beneath. The `+` on any
connector adds a step after it; the `+` on a step that already has children adds a parallel one; an
End that heads a branch path carries a `+` above it, so a terminated path can still be extended.
Each node prints its own configuration under its title (→ D-07) and shows a `⚠` badge while
incomplete (→ D-09).

```
                  [ Branch ]
           Seat availability · 3 paths
        /                |                \
  Seat available     Waitlisted         No seat
    = Available      = Waitlist        otherwise
        |                |                 |
  [ Update status ]   [ Email ]        [ Email ]
```

A branch tests one field, so a status test and a day-count test are two branches stacked — which is
exactly how "overdue, and by more than three days" reads on the canvas (→ D-33):

```
        [ Branch ] Registration fee status · 3 paths
                          |
                       Overdue
                      otherwise
                          |
        [ Branch ] Registration fee overdue · 2 paths
             /                              \
   More than 3 days                       Not yet
   more than 3 days                      otherwise
```

**Parameters** — per node type, live-updating the diagram. Specified field by field in `04`.

## What actually works

Adding, renaming, configuring and deleting steps · adding and removing branch paths · undo and redo
across every edit (⌘Z / ⇧⌘Z) · advisory validation with a warning count in the header · moving a
workflow between Draft, Active and Paused, where activating opens a review of everything the workflow
will send, create and change, and an incomplete step blocks it (→ D-09, D-10) · deep links: the open
workflow and selected step live in the URL as `?flow=…&step=…` (→ D-22).

Deleting a step splices what came after it back onto its parent, so a chain does not lose everything
below the node you removed. Deleting a branch keeps its first path and discards the rest, rather than
silently turning a decision into parallel steps.

## Not built, and stated rather than hidden

**Out of scope by the brief:** any execution. No backend, no database, no authentication, no
scheduling, no email actually sent, no persistence — reload and the seed workflows return, in their
seeded states. All data is mock (→ D-16). The lifecycle and the re-entry rule are therefore
*statements of intent*: the states move and the review is real, but nothing runs behind them.

**Missing at the level above a single workflow.** There is no workflow list, so "which of my fifteen
are live?" has no screen (→ D-24), and validation is per node, so nothing checks a *journey* — a
school can configure two fee checkpoints that contradict each other and the product cannot warn about
it (→ D-30).

**Consciously absent rather than faked:** zoom, minimap, pan controls and drag-and-drop. Earlier
drafts rendered them as inert chrome; a control that looks real and does nothing costs more
credibility in a demo than an honest absence (→ D-15).

## Open questions for the Round 3 scope lock

1. **Who keeps *Intake status* current?** Waitlist promotion is guarded by Open / Full / Closed
   (→ D-29), but nothing in the product moves a seat count across zero or notices a deadline passing.
   A field a human maintains is exactly the manual step automation should remove — does the platform
   own it, or does a workflow?
2. **Mid-flight state changes.** An applicant pays while sitting inside a five-day delay. Does the
   workflow re-evaluate, or send the reminder anyway? The single sharpest execution question, and it
   changes what the builder must let a user express.
3. **Goal / exit criteria.** Should a workflow have a goal that removes an applicant the moment it is
   met, instead of repeating the same branch twice? It would visibly simplify workflow 8.
4. **Merging paths.** After a fan-out, paths never rejoin — the model is a tree, not a graph. "Wait
   for both, then continue" needs a join node.
5. **Where a transfer workflow runs** — source campus, destination, or the group (→ D-20).
6. **Recipient resolution.** Which parent receives the email when an applicant has two guardians,
   and what happens to fifteen workflows when the assigned counsellor leaves (→ D-13).
7. **Multi-trigger.** Do we lift the one-trigger constraint, and what are the dedupe rules if we do
   (→ D-02)?
8. **Can a journey be reviewed as a whole?** Fee checkpoints are configurable per workflow (→ D-30),
   so nothing stops a school setting up two that contradict each other. Validation is per node today;
   a journey-level check is the missing piece.
9. **Who owns the fee ledger?** The Adjust fee node states that a token is credited and a concession
   applied, but the arithmetic lives in a finance system this product does not own. Where is the
   boundary — does the workflow instruct the ledger, read it, or both (→ D-37)?
10. **How does a token get waived?** Excluding it from concessions (→ D-35) leaves a hardship case at
   acceptance with no expressible answer. A separate waive act with its own approval, or out of
   system?
11. **WhatsApp.** Round 4 or later? It changes the node model more than any other addition, because
   it brings opt-in state per family.
