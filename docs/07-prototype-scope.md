# 07 · Prototype scope

**Answers:** what the prototype does, what it deliberately does not, and what Round 3 has to settle.
**Read after:** `06-decisions.md`.

## One screen

Node types on the left, the diagram in the middle, the selected step's parameters on the right, and
the journey stages across the top (→ D-24).

There is no workflow list and no create-workflow wizard. The diagram is the deliverable.

### Stage tabs

Enquiry · Application · Review · Decision · **Registration** · Enrolment · Payment · Transfer.

Where a stage holds more than one workflow, a picker beside the tabs switches between them and reads
"1 of 3" (→ D-19). Next to it sits the workflow's state: Draft, Active or Paused (→ D-10).

Edits survive switching stages. *Reset stage* restores both the original diagram and the original
state.

### Node types

Grouped Trigger / Actions / Logic / Delays, with the four nearest future nodes marked *Soon*.

Clicking one attaches it to the selected step, and the panel header says where it will land. A
container and an End cannot be attach points. A container's paths are edited on the paths themselves.

### The diagram

Boxes and connectors. Branch and Parallel fan out and are drawn side by side. A branch prints each
path's condition beneath its label; a parallel prints only the label, because every path runs.

**Every connector carries a `+` that inserts a step at that point.** That includes the connector
above an End, so a terminated path can still be extended. A step with nothing after it also carries a
`+` below it, which appends.

Nothing else can gain a second child. A fan-out is always a Branch or a Parallel, saying which it
means (→ D-39).

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

A branch tests one field. So a status test and a day-count test are two branches stacked, which is
how "overdue, and by more than three days" reads on the canvas (→ D-33):

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

### Parameters

One panel per node type, updating the diagram as you type. Specified field by field in `04`.

## What works

- Adding, renaming, configuring and deleting steps
- Adding and removing paths on a Branch or a Parallel
- Undo and redo across every edit (⌘Z / ⇧⌘Z), including across stages
- Advisory validation, with a warning count in the header
- Moving a workflow between Draft, Active and Paused
- Deep links: the open workflow and selected step live in the URL as `?flow=…&step=…` (→ D-22)

Activating a workflow opens a review of everything it will send, create and change. An incomplete
step blocks activation, which is where validation stops being advisory (→ D-09, D-10).

Two edits behave carefully rather than literally. Deleting a step splices what came after it back
onto its parent, so a chain does not lose everything below the node you removed. Deleting a container
keeps its first path and discards the rest, rather than silently turning a decision into parallel
steps or the reverse.

## Not built, and said out loud

**Execution is out of scope by the brief.** No backend, no database, no authentication, no
scheduling, no email sent, no persistence. Reload and the seed workflows return in their seeded
states. All data is mock (→ D-16).

The lifecycle and the re-entry rule are therefore statements of intent. The states move and the
review is real, but nothing runs behind them.

**Nothing works above a single workflow.** There is no workflow list, so "which of my fifteen are
live?" has no screen (→ D-24). Validation is per node, so nothing checks a whole journey. A school
can configure two fee checkpoints that contradict each other and the product cannot warn about it
(→ D-30).

**Absent rather than faked:** zoom, minimap, pan controls and drag-and-drop. Earlier drafts drew them
as inert chrome. A control that looks real and does nothing costs more credibility in a demo than an
honest absence (→ D-15).

## Open questions for the Round 3 scope lock

**1. Who keeps *Intake status* current?** Waitlist promotion is guarded by Open / Full / Closed
(→ D-29), but nothing moves a seat count across zero or notices a deadline passing. A field a human
maintains is exactly the manual step automation should remove.

**2. What happens to state mid-flight?** An applicant pays while sitting inside a five-day delay.
Does the workflow re-evaluate, or send the reminder anyway? This is the sharpest execution question,
and it changes what the builder must let a user express.

**3. Should a workflow have a goal?** Something that removes an applicant the moment it is met,
instead of repeating the same branch twice. It would visibly simplify workflow 8.

**4. Can paths merge?** After a fan-out they never rejoin. The model is a tree, not a graph. "Wait
for both, then continue" needs a join node.

**5. Where does a transfer workflow run?** Source campus, destination, or the group (→ D-20).

**6. How does a role resolve to a person?** Which parent gets the email when an applicant has two
guardians, and what happens to fifteen workflows when the assigned counsellor leaves (→ D-13).

**7. Do we lift the one-trigger limit?** And if so, what are the dedupe rules (→ D-02)?

**8. Can a journey be reviewed as a whole?** Fee checkpoints are configurable per workflow (→ D-30),
so nothing stops two of them contradicting each other. A journey-level check is the missing piece.

**9. Who owns the fee ledger?** Adjust fee states that a token is credited and a concession applied,
but the arithmetic lives in a finance system this product does not own. Does the workflow instruct
the ledger, read it, or both (→ D-37)?

**10. How does a token get waived?** Excluding it from concessions (→ D-35) leaves a hardship case at
acceptance with no expressible answer. A separate waive act with its own approval, or out of system?

**11. When does WhatsApp land?** It changes the node model more than any other addition, because it
brings opt-in state per family.
