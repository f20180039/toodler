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

| Field | Example values | Used as |
|---|---|---|
| Applicant | — | The subject of every workflow; each node acts on one applicant record |
| Parent / Guardian | Primary, Secondary | Email recipient role, personalisation token |
| Grade / Class | Grade 6 | Trigger filter, branch condition |
| Academic year | 2026–27 | Trigger filter, and the re-entry key (→ D-14) |
| Application status | Not started, Submitted, Under review, Shortlisted | Trigger event, branch condition |
| Document status | Complete, Incomplete, Rejected | Branch condition |
| Interview status | Scheduled, Completed, No show, Rescheduled | Trigger event, branch condition |
| Decision | Offered, Waitlisted, Rejected | Branch condition |
| Payment status | Pending, Partial, Paid | Branch condition |
| Counsellor | A staff user | Task assignee, notification recipient, email sender |
| Admission source | Website, Walk-in, Referral, Campaign | Trigger filter |
