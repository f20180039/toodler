# 01 · The admission journey

**Answers:** what happens at each stage, where automation earns its place, and the field vocabulary
the whole builder reuses.
**Read after:** `README.md`.

## The milestone that moves

The brief names six stages. Look at how schools actually run the journey and you get eight
milestones:

**Enquiry → Application → Review → Decision → Offer acceptance → Registration → Enrolment → Term
fees**

The two extra ones are the fee checkpoints. That is the point: **where the fee sits is not fixed.**
Two real schools use the same word for different milestones.

| School           | Where the fee sits  | What they say                                                                                                                                       |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| GIIS Bangalore   | Before the decision | The registration fee "has to be paid while submitting the admission form". Admission and term fees follow "post your ward's admission is confirmed" |
| St Pauls College | After the decision  | Offer letter, accept, *Registration Fee Payment*, then enrolment. The admission letter is created "upon payment confirmation"                       |

A third pattern sits between them, and it is the one this product models by default. The school takes
a small **token fee** at offer acceptance to hold the seat. If the student registers it comes off the
final bill. If they walk away the school keeps it.

That asks the family for a small irreversible act instead of the full amount. It also pays the school
for holding a seat it could have offered to someone else (→ D-34).

So the product must not hard-code a sequence. A fee is a **configurable checkpoint**, and the
configuration is simply which trigger the fee workflow starts from (→ D-30).

The stage tabs map those eight milestones onto seven stages plus Transfer. Offer acceptance sits in
**Decision**, the admission-fee checkpoint gets its own **Registration** stage, and term fees are
**Payment**.

## The six stages

The stage list comes from the brief. The last column is ours. It says why a workflow exists at that
stage at all, and every workflow in `02` targets one of these failures.

| Stage           | What the school does                           | What the family waits for               | What goes wrong without automation                                               |
| --------------- | ---------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| **Enquiry**     | Capture the enquiry, assign a counsellor       | Proof a real person has them            | The enquiry sits for days. The school that replies first usually wins the family |
| **Application** | Share the form, collect the fee and documents  | Confirmation, and what is still missing | The family thinks "submitted" means "complete". Documents never arrive           |
| **Review**      | Assign a reviewer, verify documents, shortlist | Any sign the application is moving      | Applications stall in a queue and families phone the front desk                  |
| **Decision**    | Interview, panel decision, offer               | The interview date, then the outcome    | No-shows, because no reminder went out. Offers expire in silence                 |
| **Enrolment**   | Acceptance, seat confirmation, class allotment | What is left before the seat is safe    | Accepted offers never convert. Seats sit blocked                                 |
| **Payment**     | Raise the fee, track it, issue receipts        | The amount, the deadline, the receipt   | Unpaid fees surface at the deadline, with one person chasing dozens of parents   |

Two things about this journey shaped the product more than anything else.

**It runs on dates.** Interview slots, fee deadlines, term start and the academic year are fixed
calendar facts. A wait is usually measured against a date, not just "in 3 days" (→ D-04).

**The school's half is work, not messaging.** Much of what should happen is a human action: verify a
document, call a parent, reschedule an interview. A builder that only sends email automates the easy
half (→ D-11).

## The field vocabulary

These fields are the whole configuration vocabulary. Trigger filters, branch conditions, recipients
and task assignees all draw from this list rather than from a generic contact-property store
(→ D-12).

Every value is a closed list, so a condition or a status update is always valid. A typo cannot
silently fail to match (→ D-23).

### Who the workflow acts on

| Field             | Values                                 | Used as                                       |
| ----------------- | -------------------------------------- | --------------------------------------------- |
| Applicant         | —                                      | The subject of every workflow                 |
| Parent / Guardian | —                                      | Email recipient                               |
| Grade / Class     | Nursery, LKG, UKG, Grade 1 to Grade 12 | Trigger filter                                |
| Academic year     | 2026–27, 2027–28                       | Trigger filter, and the re-entry key (→ D-14) |

### Progress through the journey

| Field              | Values                                                                               |
| ------------------ | ------------------------------------------------------------------------------------ |
| Application status | Submitted · Under review · Shortlisted · Needs a second look · Waitlisted · Rejected |
| Document status    | Complete · Incomplete · Rejected                                                     |
| Interview status   | Scheduled · Completed · No show · Rescheduled                                        |
| Decision           | Offered · Waitlisted · Rejected                                                      |
| Offer status       | Accepted · Declined · Expired                                                        |
| Enrolment status   | Pending · **Provisional** · Confirmed · **Lapsed** · **Withdrawn**                   |

*Provisional* means the seat is held but not yet the family's. *Confirmed* means registered, which
only happens after payment. *Lapsed* means they backed out and the seat is free again (→ D-27).

### Money

| Field                                       | Values                                                                                                    | What it covers                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Registration fee status                     | Not applicable · Pending · Paid · Failed · Overdue                                                        | The fee some schools take at application (→ D-31) |
| Token fee status                            | Not applicable · Pending · Paid · Failed · Overdue                                                        | The deposit that holds the seat (→ D-34)          |
| Admission fee status                        | Not applicable · Pending · Paid · Failed · Overdue                                                        | The final bill                                    |
| Term fee status                             | Not applicable · Pending · Paid · Failed · Overdue                                                        | Recurring fees after joining                      |
| Registration / Admission / Term fee overdue | A number of days                                                                                          | Compared with *more than* / *less than* (→ D-33)  |
| Refund status                               | Not applicable · Due · Processed                                                                          | Set when a family withdraws (→ D-38)              |
| Fee concession                              | None · Merit scholarship · Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance | What the family claimed                           |
| Concession status                           | Not claimed · Requested · Documents pending · Approved · Rejected                                         | Where that claim has got to                       |

The four fee statuses replaced a single `Payment status`. "Payment is pending" cannot say *which*
fee, and the answer changes what you say to the family (→ D-31).

The overdue rows are the one exception to the closed-list rule. They hold a number of days, so they
are typed and compared rather than picked (→ D-33).

Fee concession is *claimed* data, not something the workflow decides. Whether a family qualifies for
merit-cum-need aid is a human judgement about documents and circumstances. The workflow routes on the
claim, gathers the evidence, and applies the figure once someone with authority approves it (→ D-26).

### Seats, intake and transfer

| Field                 | Values                                                   | Used as                                                                    |
| --------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Intake status         | Open · Full · Closed                                     | Guards waitlist promotion. *Closed* means the deadline has passed (→ D-29) |
| Confirmation deadline | A date per intake                                        | When the session's seats stop being fillable                               |
| Seat availability     | Available · Waitlist · No seat                           | Branch condition on a transfer                                             |
| Dues status           | Cleared · Pending                                        | Branch condition on a transfer                                             |
| Transfer status       | Requested · Approved · Waitlisted · Declined · Completed | Status update on a transfer                                                |
| House                 | Red · Yellow · Blue · Green                              | Allocation target, and a branch condition                                  |

### Settings on the workflow itself

| Field          | Values                                          | Used as                                                         |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| Re-entry       | Once only · Once per academic year · Every time | How often one applicant may enter a workflow (→ D-14)           |
| Workflow state | Draft · Active · Paused                         | The workflow's lifecycle, not a field on the applicant (→ D-10) |

### Roles

Recipients, task assignees and notification targets all come from one list:

- **The family** — Parent/Guardian · Applicant
- **Admissions** — Admissions officer · Assigned counsellor · Admissions team · Admissions head
- **Teaching and records** — Class teacher · Records team · House captain · Principal
- **Money** — Finance team
- **Assessment** — Interview panel
- **The other campus** — Destination admissions officer · Destination coordinator

Not every role can do everything. Only some can own a task, and only some are real mailboxes a school
sends from. `04` lists which.

## One note on how this grew

The transfer and decision workflows added the last few status fields. A vocabulary designed around
one stage does not survive contact with the next one, which is the argument for keeping it in one
place rather than scattered through the screens.

**Admission source** exists in the model on paper but is not built. The trigger filters on grade and
academic year only.
