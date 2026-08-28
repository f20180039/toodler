# 03 · The node library

**Answers:** which nodes the prototype builds with, which are deferred, and the rule that decided.
**Read after:** `02-workflow-use-cases.md`.

**The cut line:** a node ships only if at least one workflow in `02` cannot be expressed without it.
Everything else is deferred — named in this document, and the four nearest ones also appear in the
palette marked *Soon* so the vocabulary reads as extensible (→ D-01, D-16).

Nodes are grouped by function — Triggers, Actions, Logic, Delays — not by admission stage, because
email, delay and branch recur at every stage (→ D-01).

## Triggers — start the workflow

One trigger per workflow (→ D-02). Nine events, one per way an admission journey actually begins.

| Trigger | Fires when | Used by |
|---|---|---|
| Enquiry submitted | A new enquiry arrives from any source | Enquiry |
| Application submitted | An application form is submitted | Application, Documents |
| Documents submitted | A document set is uploaded or completed | Review |
| Interview scheduled | An interview or assessment slot is booked | Interview |
| Interview completed | The panel marks the interview done | Decision |
| Offer accepted | The family accepts the offer | Enrolment |
| Applicant enrolled | Enrolment is confirmed | Payment |
| Payment received | A fee payment lands | — (available) |
| Transfer request raised | A family asks to move campus | Transfer |

## Actions — do something

| Node | Does | Used by |
|---|---|---|
| **Send email** | Sends a templated email to a family or a school team | all nine workflows |
| **Create task** | Owned work with an assignee, a due date and a priority | seven |
| **Notify team** | Tells a person or team something, with no accountability attached | three |
| **Update status** | Moves the applicant along: sets an admissions field to a new value | four |
| **Allocate** | Assigns a house or a class section, by balancing or by matching a sibling | Enrolment |
| **Adjust fee** *(specified, not built)* | Applies a concession — a percentage or a fixed amount off a named fee head, with an approval gate | Payment |

`Adjust fee` is the only node that moves money. It is separate from `Update status` for the same
reason `Allocate` is — it computes a figure rather than setting a known value — and it is the only
node that can require a named person's approval before it takes effect (→ D-25).

`Create task` and `Notify team` look similar and are deliberately separate: one answers "who is
chasing this family?", the other does not (→ D-11). `Allocate` is separate from `Update status` for
the same kind of reason — allocation is the system choosing, not the user setting a known value
(→ D-18).

## Logic — decide

| Node | Does |
|---|---|
| **Branch** | Splits the flow into **two or more** labelled paths. The branch names the field; each path carries its own operator and value. The path left blank is the fallback (→ D-03, D-17) |
| **End** | Terminates a path. Every path ends in an End or in a task a human owns |

Operators: `=` · `is not` · `is empty` · `is not empty`. A value is always picked from that field's
own list, never typed (→ D-23).

## Delays — wait

One node, three modes (→ D-04). The mode is chosen inside the node; the canvas shows the resulting
summary, not the mode name (→ D-07).

| Delay mode | Configures | Example summary | Needed by |
|---|---|---|---|
| A duration | Amount, unit (minutes / hours / days), skip weekends | `Wait 3 days · excludes weekends` | Enquiry, Application, Review, Interview, Payment, Transfer |
| An event | Which event, and how many days before giving up | `Wait until Documents submitted · max 3 days` | Documents |
| A date | A fixed calendar date | `Wait until 15 April 2026` | — (available, for a fee cut-off) |

Duration delays carry **skip weekends**, on by default: a Thursday plus three days otherwise drops a
parent-call task on a Sunday, when the school is shut (→ D-05).

## Deferred — designed for, not built

Named admissions-first on purpose: this roadmap should read as an admissions product, not a
marketing product with a school skin.

**In the palette, marked *Soon*** — the four nearest additions:
Send WhatsApp · Send SMS · Schedule interview · Request documents.

WhatsApp is the highest-value of them for Indian schools, and the reason it is not built is not
effort: it brings opt-in state per family, template approval and a provider choice, which are
product decisions rather than a node (→ D-16).

**Documented, not in the palette:**
Send offer letter · Send payment link · Assign counsellor · Move admission stage · Add tag ·
Create note · Update custom field · Enrol in another workflow · Webhook · Random / percentage split
(→ D-06).
