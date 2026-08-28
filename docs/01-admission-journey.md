# 01 · The admission journey

**Answers:** what happens at each stage, where automation earns its place, and the field vocabulary
the whole builder reuses.
**Read after:** `README.md`.

## The six stages

The stage list comes from the brief. The fourth column is ours: it is the reason a workflow exists
at that stage at all. Every workflow in `02` targets one of these failure modes.

| Stage | What the school does | What the family is waiting for | Failure mode automation removes |
|---|---|---|---|
| **Enquiry** | Capture the enquiry (web form, walk-in, call, campaign), assign a counsellor | Confirmation a real person has them, and what to do next | The enquiry sits unacknowledged for days. The school that replies first usually wins the family |
| **Application** | Share the form, collect the fee, collect documents | Confirmation of receipt, and a checklist of what is still missing | The family assumes "submitted" means "complete"; documents never arrive and nobody notices |
| **Review** | Assign a reviewer, verify documents, shortlist | Any signal that the application is moving | Applications stall in a queue; families chase the front desk by phone |
| **Decision** | Interview or assessment, panel decision, offer | The interview date, then the outcome | No-shows, because the reminder never went out; offers expire in silence |
| **Enrolment** | Offer acceptance, seat confirmation, class allotment | Clarity on the steps left before the seat is safe | Accepted offers never converted; seats blocked by families who have moved on |
| **Payment** | Raise the fee, track payment, issue receipt, finance follow-up | The amount, the deadline, the receipt | Pending fees discovered at the deadline, with one person chasing dozens of parents |

Two properties of this journey shape the product more than anything else:

- **It is date-anchored.** Interview slots, fee deadlines, term start and the academic year are
  fixed calendar facts. Waits are usually expressed against a date, not just "in 3 days" (→ D-04).
- **The school side is work, not just messaging.** Half of what should happen is a human action —
  verify a document, call a parent, reschedule an interview. A builder that only sends emails
  automates the easy half (→ D-11).

## The field vocabulary

These eleven fields are the entire configuration vocabulary of the builder. Trigger filters, branch
conditions, email personalisation tokens, recipient roles and task assignees all draw from this
list rather than from a generic contact-property store (→ D-12).

| Field | Values | Used as |
|---|---|---|
| Applicant | — | The subject of every workflow; each node acts on one applicant record |
| Parent / Guardian | — | Email recipient role |
| Grade / Class | Nursery, LKG, UKG, Grade 1 … Grade 12 | Trigger filter |
| Academic year | 2026–27, 2027–28 | Trigger filter, and the intended re-entry key (→ D-14) |
| Application status | Submitted · Under review · Shortlisted · Needs a second look · Waitlisted · Rejected | Branch condition, status update |
| Document status | Complete · Incomplete · Rejected | Branch condition, status update |
| Interview status | Scheduled · Completed · No show · Rescheduled | Branch condition, status update |
| Decision | Offered · Waitlisted · Rejected | Branch condition, status update |
| Payment status | Pending · Partial · Paid | Branch condition, status update |
| Offer status | Accepted · Declined · Expired | Branch condition — does an offer lapse |
| Enrolment status | Pending · Confirmed · Withdrawn | Status update at enrolment |
| Dues status | Cleared · Pending | Branch condition on a transfer |
| Seat availability | Available · Waitlist · No seat | Branch condition on a transfer |
| Transfer status | Requested · Approved · Waitlisted · Declined · Completed | Status update on a transfer |
| House | Red · Yellow · Blue · Green | Allocation target, and a branch condition |
| Fee concession | None · Merit scholarship · Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance | Branch condition — which concession a family has claimed |
| Concession status | Not claimed · Requested · Documents pending · Approved · Rejected | Branch condition, status update |
| Roles | Parent/Guardian · Applicant · Admissions officer · Assigned counsellor · Class teacher · Finance team · Admissions team · Admissions head · Interview panel · Principal · Records team · Destination admissions officer · Destination coordinator · House captain | Email recipients, task assignees, notification targets |

Fee concession is deliberately *claimed* data, not something the workflow decides: eligibility for
merit-cum-need aid is a human judgement on documents and family circumstances. The workflow's job is
to route on the claim, gather the evidence, and apply the figure once someone with authority has
approved it (→ D-26).

The last four status field rows arrived with the transfer and decision workflows: a vocabulary designed
around one stage does not survive contact with the next one, which is the argument for keeping it in
one place rather than scattered through the screens.

Every value above is a closed list, so a condition or a status update is always valid by
construction — a typo cannot silently fail to match (→ D-23). **Admission source** is in the model on
paper but not implemented; the trigger filters on grade and academic year only.
