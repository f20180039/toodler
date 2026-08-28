# 07 · Prototype scope

**Answers:** what the prototype does, what it deliberately does not, and what Round 3 has to settle.
**Read after:** `06-decisions.md`.

## One screen

Node types on the left, the diagram in the middle, the selected step's parameters on the right, and
the journey stages across the top (→ D-24). There is no workflow list and no create-workflow wizard;
the diagram is the deliverable.

**Stage tabs** — Enquiry · Application · Review · Decision · Enrolment · Payment · Transfer. Where a
stage holds more than one workflow, a picker beside the tabs switches between them and reads
"1 of 2" (→ D-19). Edits survive switching stages; *Reset stage* restores a stage's original.

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

**Parameters** — per node type, live-updating the diagram. Specified field by field in `04`.

## What actually works

Adding, renaming, configuring and deleting steps · adding and removing branch paths · undo and redo
across every edit (⌘Z / ⇧⌘Z) · advisory validation with a warning count in the header · deep links:
the open workflow and selected step live in the URL as `?flow=…&step=…` (→ D-22).

Deleting a step splices what came after it back onto its parent, so a chain does not lose everything
below the node you removed. Deleting a branch keeps its first path and discards the rest, rather than
silently turning a decision into parallel steps.

## Not built, and stated rather than hidden

**Designed, deferred:** the **Adjust fee** node and the fee-concession workflow — specified field by
field in `04` and `02`, not yet on screen (→ D-25, D-26) · the Draft / Active / Paused lifecycle and
the review-before-activation step (→ D-10) · re-entry control on the trigger (→ D-14) · a template library so a school never faces a
blank canvas · per-workflow analytics.

**Out of scope by the brief:** any execution. No backend, no database, no authentication, no
scheduling, no email actually sent, no persistence — reload and the seed workflows return. All data
is mock (→ D-16).

**Consciously absent rather than faked:** zoom, minimap, pan controls and drag-and-drop. Earlier
drafts rendered them as inert chrome; a control that looks real and does nothing costs more
credibility in a demo than an honest absence (→ D-15).

## Open questions for the Round 3 scope lock

1. **Two workflows on one trigger.** The fee-concession flow and the payment reminder both start at
   *Applicant enrolled*, and the adjusted amount has to land before the reminder computes what is
   outstanding. Ordering between workflows sharing a trigger is undefined in this model — sequence
   them, let one wait on the other, or merge them?
2. **Mid-flight state changes.** An applicant pays while sitting inside a five-day delay. Does the
   workflow re-evaluate, or send the reminder anyway? The single sharpest execution question, and it
   changes what the builder must let a user express.
3. **Goal / exit criteria.** Should a workflow have a goal that removes an applicant the moment it is
   met, instead of repeating the same branch twice? It would visibly simplify workflow 8.
4. **Merging paths.** After a fan-out, paths never rejoin — the model is a tree, not a graph. "Wait
   for both, then continue" needs a join node.
5. **Where a transfer workflow runs** — source campus, destination, or the group (→ D-20).
6. **Recipient resolution.** Which parent receives the email when an applicant has two guardians,
   and what happens to twelve workflows when the assigned counsellor leaves (→ D-13).
7. **Multi-trigger.** Do we lift the one-trigger constraint, and what are the dedupe rules if we do
   (→ D-02)?
8. **WhatsApp.** Round 4 or later? It changes the node model more than any other addition, because
   it brings opt-in state per family.
