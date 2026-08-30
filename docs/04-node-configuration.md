# 04 · Node configuration reference

**Answers:** what a user configures on each node, what the canvas then shows, and what we warn about
when it is incomplete.
**Read after:** `03-node-library.md`. This is a reference. Skim the node you care about.

Configuration opens in a right-hand panel when a node is selected, never on the node itself (→ D-08).

Each block below ends with two lines:

- **Canvas summary** — the string printed on the node, so the diagram reads without opening anything
  (→ D-07).
- **Warns when** — the advisory badge shown while the node is incomplete. Warnings never block
  editing (→ D-09).

Every option is a closed list drawn from `01`. The only free text is a step name, an email subject, a
date and the section pool. The only typed numbers are a fee adjustment and an overdue day count
(→ D-23, D-33).

## Trigger

| Field                         | Options                                                |
| ----------------------------- | ------------------------------------------------------ |
| Starts when                   | The fifteen events in `03`                             |
| Grade                         | All grades · Nursery · LKG · UKG · Grade 1 to Grade 12 |
| Academic year                 | 2026–27 · 2027–28                                      |
| Can an applicant enter again? | Once only · Once per academic year · Every time        |

One trigger per workflow (→ D-02). The academic year has one canonical spelling, so a filter cannot
miss a match.

Re-entry defaults to *Once only*. Waitlist promotion is the one workflow set to *Every time*, because
a released seat re-fires its trigger for the next family (→ D-14, D-28).

**Canvas summary:** `Application submitted · Grade 6 · 2026–27`
**Warns when:** never. A trigger always has a valid event, grade and year.
**Not built:** admission-source filter, per-form scoping.

## Send email

| Field   | Options                                                          |
| ------- | ---------------------------------------------------------------- |
| To      | Any role, except those who cannot receive mail                   |
| Subject | Text                                                             |
| From    | Admissions team · Assigned counsellor · Principal · Finance team |
| Retry   | On/off · attempts (1–5) · interval in hours (1–72)               |

Recipients are roles, not addresses. They resolve per applicant at send time (→ D-13). *From* lists
only mailboxes a school actually sends from.

Retry is delivery retry, not a re-run of the step (→ D-21).

**Canvas summary:** `→ Parent / Guardian · "We've received your application"`, plus a
`Retry ×2 · every 24h` chip when retry is on.
**Warns when:** no recipient, or no subject.
**Not built:** template picker, cc/bcc, reply-to, personalisation tokens, preview.

## Create task

| Field     | Options                                          |
| --------- | ------------------------------------------------ |
| Assign to | One of the roles below                           |
| Priority  | Low · Medium · High (defaults to Medium)         |
| Due in    | A number of days after this step (defaults to 2) |

Who can own a task:

- Admissions officer · Assigned counsellor · Admissions team · Admissions head
- Finance team · Records team · Interview panel · Principal
- Destination admissions officer

The list holds only people and teams that can own work through to completion. The admissions head is
on it because a special allowance is the head's own call (→ D-26).

**Canvas summary:** `→ Assigned counsellor · High · due in 1 days`
**Warns when:** never. A task always has an assignee, a priority and a due offset.
**Not built:** description, reminder, explicit applicant link.

## Notify team

| Field    | Options                                       |
| -------- | --------------------------------------------- |
| Notify   | The same role list as Send email              |
| Channel  | In-app · In-app + email (defaults to in-app)  |
| Priority | Normal · Urgent                               |
| Retry    | On/off · attempts · interval (off by default) |

*Urgent* is what an unreviewed application escalates to.

**Canvas summary:** `→ Admissions head · In-app + email`
**Warns when:** never.

## Update status

| Field     | Options                          |
| --------- | -------------------------------- |
| Field     | Any settable field, listed below |
| New value | The values for that field        |

Choosing a field narrows the values and resets the value to a valid one. The three *overdue* day
counts are missing on purpose: an overdue count is derived from a deadline, never set by a workflow.

| Settable field                                     | Values                                                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Application status                                 | Submitted · Under review · Shortlisted · Needs a second look · Waitlisted · Rejected                      |
| Document status                                    | Complete · Incomplete · Rejected                                                                          |
| Interview status                                   | Scheduled · Completed · No show · Rescheduled                                                             |
| Decision                                           | Offered · Waitlisted · Rejected                                                                           |
| Offer status                                       | Accepted · Declined · Expired                                                                             |
| Enrolment status                                   | Pending · Provisional · Confirmed · Lapsed · Withdrawn                                                    |
| Intake status                                      | Open · Full · Closed                                                                                      |
| Registration / Token / Admission / Term fee status | Not applicable · Pending · Paid · Failed · Overdue                                                        |
| Refund status                                      | Not applicable · Due · Processed                                                                          |
| Fee concession                                     | None · Merit scholarship · Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance |
| Concession status                                  | Not claimed · Requested · Documents pending · Approved · Rejected                                         |
| Dues status                                        | Cleared · Pending                                                                                         |
| Seat availability                                  | Available · Waitlist · No seat                                                                            |
| Transfer status                                    | Requested · Approved · Waitlisted · Declined · Completed                                                  |
| House                                              | Red · Yellow · Blue · Green                                                                               |

These are the school's own fields, not generic contact properties (→ D-12).

**Canvas summary:** `Application status → Under review`
**Warns when:** never. The value is always valid for the field.

## Allocate

| Field             | Options                                                    |
| ----------------- | ---------------------------------------------------------- |
| Allocate          | House · Class & section                                    |
| How               | Balance across options · Match a sibling · Pick one option |
| Houses / Sections | The pool, comma separated                                  |
| Which one         | One of the pool, shown only for *Pick one option*          |

Switching the target switches the pool it draws from. Balancing keeps houses and sections even in
size (→ D-18).

Houses default to Red, Yellow, Blue and Green, and show their colours. Sections default to A, B, C
and are free text, because a school's section names are its own.

*Match a sibling* states its fallback in the panel. No sibling in the school means it balances
instead.

**Canvas summary:** `House · match the sibling`, `Class & section · balanced across 3 options`, or
`House → Blue`.
**Warns when:** the method is *Pick one option* and nothing is chosen, or the pool is empty.

## Adjust fee

| Field           | Options                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Adjustment kind | Concession · Credit                                                                                |
| Concession      | Merit scholarship · Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance |
| Credit from     | Token fee · Registration fee                                                                       |
| Applies to      | Total payable · Admission fee · Term fee · Transport fee                                           |
| Adjustment      | A percentage · A fixed amount                                                                      |
| Value           | 0–100 for a percentage, otherwise an amount                                                        |
| Approval        | Not required, or required by Principal · Finance team · Admissions head                            |
| Valid for       | This academic year · Until withdrawn                                                               |

One node, two arithmetics. A **concession** reduces what a family owes. A **credit** deducts money
the school already has, which is how the token comes off the final bill (→ D-37).

The concession category is recorded on the applicant, so finance can report by it.

**Token fee is absent from *Applies to*, on purpose.** The token cannot be reduced, and the node
enforces that by not offering it (→ D-35).

Naming the fee head matters for a second reason. A 50% staff concession on tuition is not 50% off
transport. Conflating heads overstates the reduction, finance corrects it by hand, and the automation
has achieved nothing.

Percentage or amount, because merit awards are proportional and a discretionary allowance is usually
a negotiated figure. Supporting only one forces schools to fake the other.

Approval exists because a concession is money leaving the school. The node can hold until a named
person signs it off (→ D-25). *Valid for* defaults to the academic year, because a concession that
silently persists across years is an audit problem.

**Canvas summary:** `Merit-cum-need · 40% of admission fee · needs Principal approval`,
`Special allowance · ₹25,000 off admission fee · needs Principal approval`, or
`Credit · token fee off the total payable`.
**Warns when:** the value is zero, a percentage is above 100, or approval is required with nobody
named. A credit needs neither a value nor approval, since the amount is whatever was received.

## Parallel

| Field | Options                                                   |
| ----- | --------------------------------------------------------- |
| Paths | Two or more, each with a name. Add or remove, minimum two |

No condition and no field. Every path below a Parallel runs. That is the whole difference from a
Branch, and it is why they are separate nodes rather than a mode on one (→ D-39).

**Canvas summary:** `3 steps at once`
**Warns when:** it is down to one path. One path is not parallel to anything.

## Branch

Routes the applicant down **exactly one** path. For steps that should all happen, use a Parallel
(→ D-39).

| Field             | Options                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| Check which field | Any field, including the four fee statuses and the three overdue day counts |
| Paths             | Two or more, each with a name, an operator and a value. Minimum two         |
| Operator          | `=` · `is not` · `is empty` · `is not empty`, or `more than` · `less than`  |
| Value             | A pick from the field's list, or a typed number of days                     |

Every path tests the one field named on the branch. Changing that field clears the path values, since
they came from the old field's vocabulary.

The operator picker offers only the set the chosen field accepts, so the two families cannot be mixed
(→ D-33). `is empty` and `is not empty` need no value and still count as configured (→ D-17).

**A blank value means fallback** — the path taken when nothing else matches.

**Canvas summary:** two paths read as the plain condition, such as `Term fee status = Pending` or
`Admission fee overdue more than 2 days`. Three or more read as `Seat availability · 3 paths`, with
each connector labelled and its condition printed beneath.
**Warns when:** two or more paths have no condition, so the routing is ambiguous.
**Not built:** AND / OR across several fields in one branch; value-based auto-split.

## Delay

| Field         | Options                                                                              | Mode     |
| ------------- | ------------------------------------------------------------------------------------ | -------- |
| Wait for      | A duration · An event · A date                                                       | All      |
| How long      | A number, plus minutes / hours / days                                                | Duration |
| Skip weekends | Checkbox, on by default (→ D-05)                                                     | Duration |
| Wait until    | Documents submitted · Payment received · Interview completed · Application submitted | Event    |
| Give up after | A number of days, then the flow continues anyway                                     | Event    |
| Date          | A date                                                                               | Date     |

*Give up after* stops an applicant waiting forever. Workflows 3, 8 and 9 all wait on *Payment
received*, each at its own fee checkpoint.

**Canvas summary:** `Wait 3 days · excludes weekends`, `Wait until Documents submitted · max 3 days`,
or `Wait until 15 April 2026`. Never the word "Configured" (→ D-07).
**Warns when:** a duration with no amount.
**Not built:** time-of-day, and waiting relative to a date field (→ D-04).

## End

No configuration. The panel explains that the path stops there and nothing further is sent.

The connector above an End carries a `+`, like every other connector, so a terminated path can still
be extended.
