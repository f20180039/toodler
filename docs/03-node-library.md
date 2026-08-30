# 03 · The node library

**Answers:** which nodes the prototype builds with, which are deferred, and the rule that decided.
**Read after:** `02-workflow-use-cases.md`.

**The cut line:** a node ships only if at least one workflow in `02` cannot be expressed without it.
Everything else is deferred. The four nearest ones still appear in the palette marked *Soon*, so the
vocabulary reads as extensible (→ D-01, D-16).

Nodes are grouped by function, not by admission stage. Email, delay and branch recur at every stage,
so grouping by stage would list them six times (→ D-01).

## Triggers — start the workflow

One trigger per workflow (→ D-02). Each carries a re-entry rule saying how often one applicant may
enter (→ D-14).

There are fifteen events. Most are ways a journey begins. *Seat released* is how one resumes for
somebody else. The payment events are separate because a **failed** payment and an **unpaid** one
need opposite responses (→ D-32).

Which trigger a fee workflow starts from is how a school says where in its journey that fee sits. The
product does not decide that (→ D-30).

| Trigger                 | Fires when                                                      | Used by                     |
| ----------------------- | --------------------------------------------------------------- | --------------------------- |
| Enquiry submitted       | A new enquiry arrives, from any source                          | Enquiry                     |
| Application submitted   | An application form is submitted                                | Application, Documents      |
| Documents submitted     | A document set is uploaded or completed                         | Review                      |
| Interview scheduled     | An interview or assessment slot is booked                       | Interview                   |
| Interview completed     | The panel marks the interview done                              | Decision                    |
| Offer accepted          | The family accepts the offer                                    | Token fee                   |
| Applicant enrolled      | Enrolment is confirmed                                          | Term fees                   |
| Payment received        | Any fee payment lands                                           | Registration fee, Enrolment |
| Payment failed          | A transaction was attempted and failed                          | Both fee workflows          |
| Payment pending         | A fee has been raised and is unpaid                             | Available                   |
| Concession requested    | A family applies for a scholarship or an adjustment             | Concession assessment       |
| Concession decided      | The concession is approved or rejected                          | Final bill                  |
| Applicant withdrawn     | A registered or provisionally held applicant withdraws          | Withdrawal & refund         |
| Seat released           | An offer expires or lapses, or a registered applicant withdraws | Waitlist promotion          |
| Transfer request raised | A family asks to move campus                                    | Transfer                    |

Two of these carry more than their name suggests.

**Payment received** does not say which fee arrived. That is a branch condition, because the four
fees mean different things (→ D-31).

**Concession decided** fires even when nobody claimed a concession. It fires as soon as the token
clears, so the final bill is never blocked waiting on a decision no one asked for (→ D-36).

## Actions — do something

| Node              | Does                                                | Used by     |
| ----------------- | --------------------------------------------------- | ----------- |
| **Send email**    | Emails a family or a school team                    | All fifteen |
| **Create task**   | Owned work, with an assignee, due date and priority | Fourteen    |
| **Notify team**   | Tells someone, with no accountability attached      | Nine        |
| **Update status** | Sets an admissions field to a new value             | Thirteen    |
| **Allocate**      | Assigns a house or class section                    | Enrolment   |
| **Adjust fee**    | Applies a concession or credits a fee already paid  | Two         |

Three of these look like they could be one node. They are separate on purpose.

**Create task vs Notify team.** A task has an owner, a due date and a completion state. A
notification is FYI. Merging them makes "who is chasing this family?" unanswerable, which is the
question the admissions head asks every morning (→ D-11).

**Allocate vs Update status.** A status update sets a value the user already knows. Allocation is the
system choosing, and the interesting part is the rule: balance the houses, match a sibling (→ D-18).

**Adjust fee** is the only node that moves money. Like Allocate it computes a figure rather than
setting a known one, and it is the only node that can hold for a named person's approval (→ D-25).

## Logic — decide

| Node         | Does                                              |
| ------------ | ------------------------------------------------- |
| **Branch**   | Routes down **one** of two or more labelled paths |
| **Parallel** | Runs **all** of two or more paths at once         |
| **End**      | Stops a path                                      |

A branch names the field once. Each path then carries its own operator and value, and the path left
blank is the fallback (→ D-03, D-17).

A parallel is how "email the parent *and* the school" is expressed. Its paths carry a label and no
condition, because nothing is being chosen (→ D-39).

Branch and Parallel are the only nodes that may have more than one child, and each always has at
least two. That is what makes a fan-out readable. A node with two children below it always says
whether it meant *one of these* or *all of these* (→ D-39).

Every path ends in an End, or in a task a human owns.

### Operators

| On this kind of field | Operators                                    |
| --------------------- | -------------------------------------------- |
| A status              | `=` · `is not` · `is empty` · `is not empty` |
| An overdue day count  | `more than` · `less than`                    |

The picker offers only the set the chosen field accepts. A status value is always picked from that
field's own list, never typed (→ D-23, D-33).

## Delays — wait

One node, three modes (→ D-04). The mode is chosen inside the node. The canvas shows the resulting
summary, never the mode name (→ D-07).

| Mode       | Configures                       | Reads as                                      |
| ---------- | -------------------------------- | --------------------------------------------- |
| A duration | Amount, unit, skip weekends      | `Wait 3 days · excludes weekends`             |
| An event   | Which event, and when to give up | `Wait until Documents submitted · max 3 days` |
| A date     | A fixed calendar date            | `Wait until 15 April 2026`                    |

Duration delays skip weekends by default. A Thursday plus three days otherwise drops a parent-call
task on a Sunday, when the school is shut (→ D-05).

Duration and event modes carry every workflow in `02`. The date mode is available for a fixed fee
cut-off but no workflow needs it yet.

## Deferred — designed for, not built

Named admissions-first on purpose. This roadmap should read as an admissions product, not a marketing
product with a school skin.

**In the palette, marked *Soon*.** The four nearest additions: Send WhatsApp, Send SMS, Schedule
interview, Request documents.

WhatsApp is the most valuable of the four for Indian schools. It is not held back by effort. It
brings opt-in state per family, template approval and a provider choice, which are product decisions
rather than a node (→ D-16).

**Documented, not in the palette.** Send offer letter, Send payment link, Assign counsellor, Move
admission stage, Add tag, Create note, Update custom field, Enrol in another workflow, Webhook,
Random / percentage split (→ D-06).
