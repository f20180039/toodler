# 04 · Node configuration reference

**Answers:** exactly what a user configures on each node, what the canvas then shows, and what we
warn about when it is incomplete.
**Read after:** `03-node-library.md`. This is a reference — skim the node you care about.

Configuration opens in a right-hand panel when a node is selected, never on the node itself
(→ D-08). Every block ends with **Canvas summary** — the collapsed string printed on the node so the
diagram reads without opening anything (→ D-07) — and **Warns when**, the advisory badge shown while
the node is incomplete. Warnings never block editing (→ D-09).

Every option below is a closed list drawn from the vocabulary in `01`; nothing here is free text
except a step name, an email subject, a date, the section pool, and the two places a *number* is the
right answer — a fee adjustment and an overdue day count (→ D-23, D-33).

## Trigger

| Field | Options | Notes |
|---|---|---|
| Starts when | The fifteen events in `03` | One trigger per workflow (→ D-02) |
| Grade | All grades · Nursery · LKG · UKG · Grade 1 … Grade 12 | A school picks a grade far more often than it types one |
| Academic year | 2026–27 · 2027–28 | One canonical spelling, so a filter cannot miss a match |
| Can an applicant enter again? | Once only · Once per academic year · Every time | Once only is the default. Waitlist promotion is the one workflow set to *Every time*, because a released seat re-fires its trigger for the next family (→ D-14, D-28) |

**Canvas summary:** `Application submitted · Grade 6 · 2026–27`
**Warns when:** nothing — a trigger always has a valid event, grade and year.

*Not built:* admission-source filter, per-form scoping.

## Send email

| Field | Options | Notes |
|---|---|---|
| To | Parent / Guardian · Applicant · Admissions officer · Assigned counsellor · Class teacher · Finance team · Admissions team · Admissions head · Interview panel · Destination coordinator · House captain | Roles, not addresses — resolved per applicant at send time (→ D-13) |
| Subject | Text | The one free-text field that matters to a family |
| From | Admissions team · Assigned counsellor · Principal · Finance team | Only mailboxes a school sends from |
| Retry | On/off · attempts (1–5) · interval in hours (1–72) | Delivery retry only (→ D-21) |

**Canvas summary:** `→ Parent / Guardian · "We've received your application"` plus a
`Retry ×2 · every 24h` chip when retry is on.
**Warns when:** no recipient, or no subject.

*Not built:* template picker, cc/bcc, reply-to, personalisation tokens, preview.

## Create task

| Field | Options | Notes |
|---|---|---|
| Assign to | Admissions officer · Assigned counsellor · Admissions team · Admissions head · Finance team · Destination admissions officer · Records team · Interview panel · Principal | Only those who can own work to completion. The head is on the list because a special allowance is the head's own call (→ D-26) |
| Priority | Low · Medium · High | Defaults to Medium |
| Due in | A number of days after this step | Defaults to 2 |

**Canvas summary:** `→ Assigned counsellor · High · due in 1 days`
**Warns when:** nothing — a task always has an assignee, a priority and a due offset.

*Not built:* description, reminder, explicit applicant link.

## Notify team

| Field | Options | Notes |
|---|---|---|
| Notify | The recipient list above | Teams as well as individuals |
| Channel | In-app · In-app + email | Defaults to in-app |
| Priority | Normal · Urgent | Urgent is what an unreviewed application escalates to |
| Retry | On/off · attempts · interval | Off by default (→ D-21) |

**Canvas summary:** `→ Admissions head · In-app + email`
**Warns when:** nothing.

## Update status

| Field | Options | Notes |
|---|---|---|
| Field | Application status · Document status · Interview status · Decision · Offer status · Enrolment status · Intake status · Registration / Token / Admission / Term fee status · Refund status · Fee concession · Concession status · Dues status · Seat availability · Transfer status · House | The school's own fields (→ D-12). The three *… overdue* day counts are absent: an overdue count is derived from a deadline, not set by a workflow |
| New value | The values for that field | Choosing a field narrows the values, and resets the value to a valid one |

Values by field: **Application status** Submitted · Under review · Shortlisted · Needs a second look ·
Waitlisted · Rejected — **Document status** Complete · Incomplete · Rejected — **Interview status**
Scheduled · Completed · No show · Rescheduled — **Decision** Offered · Waitlisted · Rejected —
**Registration fee status** / **Token fee status** / **Admission fee status** / **Term fee status**
Not applicable · Pending · Paid · Failed · Overdue — **Refund status** Not applicable · Due ·
Processed — **Intake status** Open · Full · Closed — **Fee concession** None · Merit scholarship ·
Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance — **Concession
status** Not claimed · Requested · Documents pending · Approved · Rejected — **Dues status**
Cleared · Pending — **Seat availability** Available · Waitlist · No seat — **Transfer status**
Requested · Approved · Waitlisted · Declined · Completed — **Offer status** Accepted · Declined ·
Expired — **Enrolment status** Pending · Provisional · Confirmed · Lapsed · Withdrawn —
**House** Red · Yellow · Blue · Green.

**Canvas summary:** `Application status → Under review`
**Warns when:** nothing — the value is always valid for the field.

## Allocate

| Field | Options | Notes |
|---|---|---|
| Allocate | House · Class & section | Switching the target switches the pool it draws from |
| How | Balance across options · Match a sibling · Pick one option | Balancing keeps houses and sections even in size (→ D-18) |
| Houses / Sections | The pool, comma separated | Houses default to Red, Yellow, Blue, Green and show their colours; sections default to A, B, C and are free text, because a school's section names are its own |
| Which one | One of the pool | Shown only for *Pick one option* |

*Match a sibling* states its fallback in the panel: no sibling in the school means it balances
instead.

**Canvas summary:** `House · match the sibling`, `Class & section · balanced across 3 options`, or
`House → Blue`.
**Warns when:** the method is *Pick one option* and nothing is chosen, or the pool is empty.

## Adjust fee

| Field | Options | Notes |
|---|---|---|
| Adjustment kind | **Concession** — a reduction · **Credit** — money already received | One node, two arithmetics. A credit is how the token fee comes off the final bill (→ D-37) |
| Concession | Merit scholarship · Merit-cum-need · Need-based aid · Faculty family · Sibling · Special allowance | Concessions only. Recorded on the applicant, so finance can report by category |
| Credit from | Token fee · Registration fee | Credits only. The amount already paid is deducted rather than discounted |
| Applies to | Total payable · Admission fee · Term fee · Transport fee — **never Token fee** | The token is non-negotiable, and the node enforces it by not offering it as a target (→ D-35). A 50% staff concession on *tuition* is also not 50% off transport: conflating fee heads overstates the reduction, and finance then corrects it by hand — which defeats the automation |
| Adjustment | A percentage · A fixed amount | Merit awards are usually a percentage; a special allowance is often a negotiated figure. Supporting only one forces schools to fake the other |
| Value | 0–100 for a percentage, otherwise an amount | |
| Approval | Not required · Required, by Principal · Finance team · Admissions head | A concession is money leaving the school, so the node can hold until a named person signs it off (→ D-25) |
| Valid for | This academic year · Until withdrawn | Most schools grant per year; a concession that silently persists across years is an audit problem |

**Canvas summary:** `Merit-cum-need · 40% of admission fee · needs Principal approval`,
`Special allowance · ₹25,000 off admission fee · needs Principal approval`, or `Credit · token fee
off the total payable`.
**Warns when:** the value is zero, a percentage is above 100, or approval is required with no
approver named. A credit needs no approval and no value — the amount is whatever was received.

## Branch

| Field | Options | Notes |
|---|---|---|
| Check which field | The fields above, including the four per-fee statuses and the three overdue day counts | Every path tests this one field. Changing it clears the path values, since they came from the old field's vocabulary |
| Paths | Two or more. Each has a name, an operator and a value | Add path · remove path (minimum two) |
| Operator | `=` · `is not` · `is empty` · `is not empty` on a status field; `more than` · `less than` on an overdue day count | The picker offers only the family the field accepts, so the two cannot be mixed (→ D-33). `is empty` / `is not empty` need no value and still count as configured (→ D-17) |
| Value | A pick from the chosen field's list, or a typed number of days for an overdue field | **Blank means fallback:** the path taken when nothing else matches |

**Canvas summary:** two paths read as the plain condition — `Term fee status = Pending`, or
`Admission fee overdue more than 2 days`; three or more read as `Seat availability · 3 paths`, with
each connector labelled and its condition printed beneath (`= Available`, `= Waitlist`,
`otherwise`).
**Warns when:** two or more paths have no condition, so the routing is ambiguous.

*Not built:* AND / OR across several fields in one branch; value-based auto-split.

## Delay

| Field | Options | Notes |
|---|---|---|
| Wait for | A duration · An event · A date | Defaults to a duration |
| How long | A number + minutes / hours / days | Duration only |
| Skip weekends | Checkbox | Duration only, on by default (→ D-05) |
| Wait until | Documents submitted · Payment received · Interview completed · Application submitted | Event only. Workflows 3, 8 and 9 all wait on *Payment received*, at their own fee checkpoint |
| Give up after | A number of days, then the flow continues anyway | Event only; stops an applicant waiting forever |
| Date | A date | Date only |

**Canvas summary:** `Wait 3 days · excludes weekends`, `Wait until Documents submitted · max 3
days`, `Wait until 15 April 2026` — never the word "Configured" (→ D-07).
**Warns when:** a duration with no amount.

*Not built:* time-of-day, and waiting relative to a date field (→ D-04).

## End

No configuration. The panel explains that the path stops there and nothing further is sent. An End
that heads a branch path carries a `+` above it, so a terminated path can still be extended.
