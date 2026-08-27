# 04 · Node configuration reference

**Answers:** exactly what a user configures on each node, what the canvas then shows, and what we
warn about when it is incomplete.
**Read after:** `03-node-library.md`. This is a reference — skim the node you care about.

Configuration opens in a right-hand panel on selection, never on the node itself (→ D-08). Each
block ends with **Canvas summary** — the collapsed string printed on the node so the workflow reads
without opening anything (→ D-07) — and **Warns when**, the advisory badge shown while the node is
incomplete. Warnings never block saving a draft (→ D-09).

## Trigger

| Field | Options | Required | Notes |
|---|---|---|---|
| Object | Enquiry · Application · Interview · Enrolment · Payment | Yes | Sets the available events and filters |
| Event | The events for that object (see `03`) | Yes | One event per workflow (→ D-02) |
| Academic year | 2026–27, 2027–28 | Yes | Defaults to the current admission cycle |
| Grade / Class | Any grade, or a multi-select | No | Empty = all grades |
| Admission source | Website · Walk-in · Referral · Campaign | No | Scopes a workflow to one channel |
| Additional filters | Field + operator + value rows | No | Same operator set as Branch, below |
| Form | A specific form | Conditional | Form-submitted events only |
| Re-entry | Once only *(default)* · Once per academic year · Every time | Yes | Prevents duplicate journeys (→ D-14) |

**Canvas summary:** `Application submitted · Grade 6 · 2026–27`
**Warns when:** no event chosen, or the workflow has no trigger at all.

## Send email

| Field | Options | Required | Notes |
|---|---|---|---|
| Template | Saved school templates | Yes | Pre-fills subject and body |
| To | Parent / Guardian · Applicant · Counsellor · Class teacher · Finance team · Admissions team · Custom address | Yes | Roles, not addresses — resolved per applicant at send time (→ D-13) |
| Cc / Bcc | Same role list | No | Typically the assigned counsellor |
| Subject | Text, accepts tokens | Yes | |
| Sender | Admissions team · Assigned counsellor · Principal | Yes | Defaults to Admissions team |
| Reply-to | Same list, or a custom address | No | Defaults to the sender |
| Personalisation | Tokens from `01` — name, grade, year, parent, deadline, amount | No | Inserted into subject or body |
| Preview | — | — | Rendered preview with sample data |

**Canvas summary:** `Email · Application received → Parent`
**Warns when:** no recipient, no template, or an empty subject.

## Create task

| Field | Options | Required | Notes |
|---|---|---|---|
| Title | Text | Yes | e.g. "Call parent about missing documents" |
| Description | Text | No | |
| Assign to | Assigned counsellor · Admissions team · Finance team · A named user | Yes | Defaults to the assigned counsellor |
| Due | N days / hours after this step · A fixed date · Relative to a date field | Yes | Defaults to 2 days after this step |
| Priority | Low · Medium · High | Yes | Defaults to Medium |
| Related applicant | — | — | Linked automatically; read-only, so the user sees it carries context |
| Reminder | None · On the due date · 1 day before | No | |

**Canvas summary:** `Task · Follow up with parent → Counsellor · High`
**Warns when:** no title or no assignee.

## Send internal notification

| Field | Options | Required | Notes |
|---|---|---|---|
| Recipient | Admissions team · Admissions head · Finance team · Interview panel · A named user | Yes | |
| Title | Text | Yes | |
| Message | Text, accepts tokens | No | |
| Priority | Normal · Urgent | Yes | Defaults to Normal |
| Channel | In-app · In-app + email | Yes | Defaults to in-app |

**Canvas summary:** `Notify · Admissions head · Urgent`
**Warns when:** no recipient or no title.

## Update applicant status

| Field | Options | Required | Notes |
|---|---|---|---|
| Field | Application status · Document status · Interview status · Decision · Payment status | Yes | The admissions fields from `01` only (→ D-12) |
| New value | The values for that field | Yes | Dependent dropdown |

**Canvas summary:** `Application status → Under review`
**Warns when:** no field or no value.

## Add tag

| Field | Options | Required | Notes |
|---|---|---|---|
| Tag | Existing tags, or create one | Yes | e.g. Documents pending, High priority |
| Reason | Text | No | Recorded on the applicant timeline |

**Canvas summary:** `Tag · Documents pending`
**Warns when:** no tag selected.

## Branch

| Field | Options | Required | Notes |
|---|---|---|---|
| Condition rows | Field + operator + value | Yes | At least one row |
| Field | The admissions fields from `01` | Yes | |
| Operator | Equals · Does not equal · Contains · Is empty · Is not empty · Greater than · Less than | Yes | Greater/less than apply to dates and amounts |
| Value | Depends on the field | Conditional | Not shown for Is empty / Is not empty |
| Combine with | AND · OR | Yes when there are 2+ rows | Applies across all rows |
| Paths | Yes · No | — | Labelled on the connectors; the No path is a real path, not a dead end (→ D-03) |

**Canvas summary:** `Payment status = Pending` with `Yes` / `No` labels on the outgoing connectors.
**Warns when:** no conditions, or a path with nothing after it.

## Delay

| Field | Options | Required | Notes |
|---|---|---|---|
| Delay type | Duration · Until a date · Until a time of day · Until an event · Relative to a date field | Yes | Defaults to Duration |
| Amount + unit | A number; minutes · hours · days | Duration only | |
| Exclude weekends | Checkbox | No | On by default for delays of 1 day or longer (→ D-05) |
| Date | A calendar date | Until-a-date only | |
| Time | A clock time | Until-a-time only | |
| Event | Documents submitted · Payment received · Interview completed · Application status changed | Until-an-event only | |
| Maximum wait | A duration | Until-an-event only | Defaults to 7 days, then the flow continues |
| Date field + offset | A date field from `01`, plus before / after and an amount | Relative only | e.g. 24 hours **before** Interview date |

**Canvas summary:** `Wait 3 days`, `Wait until 24h before interview` — never "Configured" (→ D-07).
**Warns when:** no amount for a duration, no event chosen, or a relative delay with no date field.
