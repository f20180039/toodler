# 04 · Node configuration reference

**Answers:** exactly what a user configures on each node, what the canvas then shows, and what we
warn about when it is incomplete.
**Read after:** `03-node-library.md`. This is a reference — skim the node you care about.

Configuration opens in a right-hand panel when a node is selected, never on the node itself
(→ D-08). Every block ends with **Canvas summary** — the collapsed string printed on the node so the
diagram reads without opening anything (→ D-07) — and **Warns when**, the advisory badge shown while
the node is incomplete. Warnings never block editing (→ D-09).

Every option below is a closed list drawn from the vocabulary in `01`; nothing here is free text
except a step name, an email subject, a date and the section pool (→ D-23).

## Trigger

| Field | Options | Notes |
|---|---|---|
| Starts when | The nine events in `03` | One trigger per workflow (→ D-02) |
| Grade | All grades · Nursery · LKG · UKG · Grade 1 … Grade 12 | A school picks a grade far more often than it types one |
| Academic year | 2026–27 · 2027–28 | One canonical spelling, so a filter cannot miss a match |

**Canvas summary:** `Application submitted · Grade 6 · 2026–27`
**Warns when:** nothing — a trigger always has a valid event, grade and year.

*Not built:* re-entry control (→ D-14), admission-source filter, per-form scoping.

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
| Assign to | Admissions officer · Assigned counsellor · Admissions team · Finance team · Destination admissions officer · Records team · Interview panel · Principal | Only those who can own work to completion |
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
| Field | Application status · Document status · Interview status · Decision · Payment status · Dues status · Seat availability · Transfer status · Offer status · Enrolment status · House | The school's own fields (→ D-12) |
| New value | The values for that field | Choosing a field narrows the values, and resets the value to a valid one |

Values by field: **Application status** Submitted · Under review · Shortlisted · Needs a second look ·
Waitlisted · Rejected — **Document status** Complete · Incomplete · Rejected — **Interview status**
Scheduled · Completed · No show · Rescheduled — **Decision** Offered · Waitlisted · Rejected —
**Payment status** Pending · Partial · Paid — **Dues status** Cleared · Pending — **Seat
availability** Available · Waitlist · No seat — **Transfer status** Requested · Approved ·
Waitlisted · Declined · Completed — **Offer status** Accepted · Declined · Expired — **Enrolment
status** Pending · Confirmed · Withdrawn — **House** Red · Yellow · Blue · Green.

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

## Branch

| Field | Options | Notes |
|---|---|---|
| Check which field | The eleven fields above | Every path tests this one field. Changing it clears the path values, since they came from the old field's vocabulary |
| Paths | Two or more. Each has a name, an operator and a value | Add path · remove path (minimum two) |
| Operator | `=` · `is not` · `is empty` · `is not empty` | `is empty` and `is not empty` need no value and still count as configured (→ D-17) |
| Value | The values for the chosen field, or blank | **Blank means fallback:** the path taken when nothing else matches |

**Canvas summary:** two paths read as the plain condition — `Payment status = Pending`; three or
more read as `Seat availability · 3 paths`, with each connector labelled and its condition printed
beneath (`= Available`, `= Waitlist`, `otherwise`).
**Warns when:** two or more paths have no condition, so the routing is ambiguous.

*Not built:* AND / OR across several fields in one branch; value-based auto-split.

## Delay

| Field | Options | Notes |
|---|---|---|
| Wait for | A duration · An event · A date | Defaults to a duration |
| How long | A number + minutes / hours / days | Duration only |
| Skip weekends | Checkbox | Duration only, on by default (→ D-05) |
| Wait until | Documents submitted · Payment received · Interview completed · Application submitted | Event only |
| Give up after | A number of days, then the flow continues anyway | Event only; stops an applicant waiting forever |
| Date | A date | Date only |

**Canvas summary:** `Wait 3 days · excludes weekends`, `Wait until Documents submitted · max 3
days`, `Wait until 15 April 2026` — never the word "Configured" (→ D-07).
**Warns when:** a duration with no amount.

*Not built:* time-of-day, and waiting relative to a date field (→ D-04).

## End

No configuration. The panel explains that the path stops there and nothing further is sent. An End
that heads a branch path carries a `+` above it, so a terminated path can still be extended.
