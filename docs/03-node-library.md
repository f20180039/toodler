# 03 · The node library

**Answers:** which nodes ship in the MVP, which are deferred, and the rule that decided.
**Read after:** `02-workflow-use-cases.md`.

**The cut line:** a node ships only if at least one of the five workflows in `02` cannot be
expressed without it. Everything else is listed as deferred — visible in the library so the taxonomy
is obviously extensible, but not built (→ D-01, D-16).

Nodes are grouped by function — Triggers, Actions, Logic, Delays — not by admission stage, because
email, delay and branch recur at every stage (→ D-01).

## Triggers — start the workflow

One trigger per workflow (→ D-02). The list covers every entry event the six stages
produce, so a school does not hit a wall at stage three.

| Trigger | Fires when |
|---|---|
| Enquiry created | A new enquiry arrives from any source |
| Enquiry status changed | An enquiry moves (e.g. New → Hot) |
| Application submitted | An application form is submitted |
| Application status changed | An application moves stage |
| Documents submitted | A document set is uploaded or completed |
| Interview scheduled | An interview or assessment slot is booked |
| Interview completed | The panel marks the interview done |
| Decision made | Offered, waitlisted or rejected |
| Offer accepted | The family accepts the offer |
| Applicant enrolled | Enrolment is confirmed |
| Payment received | A fee payment lands |
| Payment pending | A fee crosses its due date unpaid |
| Date reached | A fixed calendar date, for campaign-style workflows |
| Form submitted | Any other school form (event, tour, scholarship) |

## Actions — do something

| Node | Does |
|---|---|
| **Send email** | Sends a templated email to a family or a school team |
| **Create task** | Creates owned work with an assignee, a due date and a completion state |
| **Send internal notification** | Tells a person or team something, with no accountability attached |
| **Update applicant status** | Sets an admissions field to a new value |
| **Add tag** | Labels the applicant so queues and lists can filter on it |

`Create task` and `Send internal notification` look similar and are deliberately separate: one
answers "who is chasing this family?", the other does not (→ D-11).

## Logic — decide

| Node | Does |
|---|---|
| **Branch** | Splits the flow into a Yes path and a No path on one or more conditions, combined with AND / OR |
| **Random split** *(Future)* | Sends a percentage down each path. Listed, labelled, not built (→ D-06) |

## Delays — wait

One node, five types (→ D-04). The canvas shows the resulting summary, not the type name (→ D-07).

| Delay type | Example | Needed by |
|---|---|---|
| Wait for a duration | Wait 3 days | W1, W2, W5 |
| Wait until a date | Wait until 1 April 2026 | Campaign-style workflows |
| Wait until a time of day | Wait until 9:00 AM | Avoids 2 a.m. sends after a chained delay |
| Wait until an event | Wait until documents are submitted | W3 |
| Wait relative to a date field | Wait until 24 hours before the interview | W4 |

Duration delays carry an **exclude weekends** option: a Thursday + 3 day delay otherwise drops a
parent-call task on a Sunday, when the school is shut (→ D-05).

## Deferred — designed for, not built

Named admissions-first on purpose: this roadmap should read as an admissions product, not a
marketing product with a school skin.

**Admissions actions:** Schedule interview · Request documents · Assign counsellor ·
Send offer letter · Send payment link · Move admission stage · Create note

**Channels:** Send SMS · Send WhatsApp — the highest-value additions for Indian schools, and where
parents actually reply. Deferred because each brings opt-in, template approval and a provider
choice — a product call, not a node (→ D-16).

**Platform:** Webhook · Update custom field · Add to campaign · Enrol in another workflow ·
Value-based split (route by grade or counsellor to N paths, → D-03)
