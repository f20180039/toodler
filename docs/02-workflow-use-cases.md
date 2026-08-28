# 02 · The workflows

**Answers:** which workflows we automate, how each runs, and why each earns its place.
**Read after:** `01-admission-journey.md`.

Ten workflows across the six journey stages from the brief, plus one beyond them. The brief supplies
three examples and says they are not the final scope; the rest were added because without them the
product never has to answer a question a real school forces — what happens on the *negative* path,
what happens when there are more than two outcomes, and who does the work that is not an email.

A stage holds more than one workflow where a stage genuinely is more than one job (→ D-19).

| Stage | Workflow | Steps | Forces into the product |
|---|---|---|---|
| **Enquiry** | New enquiry follow-up | 8 | Nudge → wait → check → escalate to a human |
| **Application** | Application acknowledgement | 9 | Parallel steps: the family *and* the school, at once |
| **Review** | Application review & shortlisting | 10 | A three-way outcome |
| **Review** | Missing documents reminder | 9 | Waiting on an event rather than a clock |
| **Decision** | Decision & offer | 14 | A branch nested inside a branch path; an offer that expires |
| **Decision** | Interview reminder | 8 | A fan-out to family and panel from one delay |
| **Enrolment** | Enrolment confirmation | 9 | Allocation: the system choosing, not the user setting |
| **Payment** | Payment reminder | 10 | An escalation ladder — same check, twice, harder |
| **Payment** | Fee concession & adjusted schedule *(specified, not built)* | 14 | Money: a discount routed by category, gated on approval |
| **Transfer** | Inter-branch transfer request | 15 | Two campuses in one flow; the widest branch |

## 1. Enquiry · New enquiry follow-up

**Trigger** Enquiry submitted → **Email** School introduction → **Delay** 3 days →
**Branch** *Has an application arrived?* → **Yes:** End · **No:** **Email** Application reminder →
**Delay** 4 days → **Task** Call the parent

The highest-volume workflow in any school, and it establishes the core pattern. The last step being a
*task* rather than a third email is the point: after two ignored emails, more email is not the answer.

## 2. Application · Application acknowledgement

**Trigger** Application submitted → **two parallel paths**:
**Email** Thank-you to the parent · and **Email** Notify the school official →
**Task** Review the application → **Update status** Under review → **Delay** 2 days →
**Branch** *Reviewed within 2 days?* → **Yes:** **Email** Next steps · **No:** **Notify** the
admissions head, urgent

The workflow the brief describes, and the only one whose second audience is the school rather than the
family. The fan-out is what makes it a workflow builder rather than an email tool.

## 3. Review · Application review & shortlisting

**Trigger** Documents submitted → **Task** Review the application → **Delay** 2 days →
**Branch** *What did the review conclude?* → **Shortlisted:** status → Shortlisted → **Email** invite
to interview · **Second look:** **Task** for the Principal · **Not eligible:** status → Rejected →
**Email** regret

The first three-way branch. A review has three honest outcomes, and forcing them into yes/no would
have produced a diagram that hides the middle one.

## 4. Review · Missing documents reminder

**Trigger** Application submitted → **Branch** *Are the documents complete?* →
**Yes:** status → Under review → End · **No:** **Email** reminder →
**Delay** until Documents submitted, max 3 days → **Branch** *Have they arrived?* →
**Yes:** End · **No:** **Task** Call the parent

Forces the wait-until-event delay. A duration delay would keep nagging a family who uploaded an hour
after the first email; waiting on the event stops the moment the problem is solved.

## 5. Decision · Decision & offer

**Trigger** Interview completed → **Task** Panel records the decision →
**Branch** *What did the panel decide?* →
**Offered:** status → Offered → **Email** offer letter · and **Notify** the admissions head; then
**Delay** 7 days → **Branch** *Was the offer accepted?* → **Yes:** End · **No:** **Task** call before
the offer lapses ·
**Waitlisted:** status → Waitlisted → **Email** waitlist letter ·
**Not offered:** status → Rejected → **Email** regret

The deepest flow: a branch inside a branch path, and an offer with an expiry. Offers expiring in
silence is a real way schools lose accepted students.

## 6. Decision · Interview reminder

**Trigger** Interview scheduled → **Delay** 24 hours → **two parallel paths**:
**Email** reminder to the family — then **Branch** *Did they attend?* → **Yes:** status → Completed →
End · **No:** **Task** reschedule — and **Notify** tomorrow's panel list

Note the delay: the reminder is a 24-hour duration from the moment the slot is booked, not "24 hours
before the interview". That equivalence holds for same-week bookings and breaks for a slot booked
months ahead (→ D-04).

## 7. Enrolment · Enrolment confirmation

**Trigger** Offer accepted → **Email** Welcome → **Update status** Enrolment confirmed →
**Allocate** class section, balanced across A/B/C → **Allocate** house, matching a sibling →
**three parallel paths**: **Email** class, house and joining details → End · **Notify** the class
teacher · **Notify** the house captain

Allocation replaced a manual "Allot class and section" task — a spreadsheet job. Balancing an intake
evenly is exactly what software should do, and houses match a sibling because that is the convention
schools actually follow (→ D-18).

## 8. Payment · Payment reminder

**Trigger** Applicant enrolled → **Email** payment instructions → **Delay** 5 days →
**Branch** *Is the fee still pending?* → **No:** End ·
**Yes:** **Email** reminder → **Delay** 3 days, skipping weekends → **Branch** *Still pending?* →
**No:** End · **Yes:** **Task** finance follow-up call

The same check twice at rising intensity. It is also the most sensitive workflow — money, to families
who have already said yes — which is what drives the review-before-activation argument in D-10.

## 9. Payment · Fee concession & adjusted schedule *(specified, not built)*

**Trigger** Applicant enrolled → **Branch** *What concession is claimed?* (Fee concession) →

**Merit-cum-need:** **Task** verify the income documents (Finance team) → **Adjust fee** 40% of
tuition, needs Principal approval → **Update status** Concession status → Approved →
**Email** revised fee schedule → End ·

**Faculty family:** **Adjust fee** 50% of tuition, needs Finance team approval → **Email** revised
fee schedule → End ·

**Special allowance:** **Task** head's discretion review (Admissions head) → **Adjust fee** a fixed
amount, needs Principal approval → **Email** revised fee schedule ·

**None:** End — the standard payment reminder handles it

Fee concessions are the one place in the journey where the workflow touches money, and schools run
several kinds at once: merit-cum-need aid on verified income, an automatic staff concession for a
faculty member's child, and a head's discretionary allowance. Each needs a different amount of human
judgement before the figure applies, which is why the categories are separate paths rather than one
"discount" step: merit-cum-need collects documents first, faculty family needs no evidence at all,
and a special allowance is a person's decision.

**One thing this workflow exposes.** It triggers on *Applicant enrolled*, and so does the payment
reminder — so the adjusted amount must land before the reminder works out what is outstanding.
Ordering between two workflows on the same trigger is undefined in this model, and that is now an
open question in `07`.

## 10. Transfer · Inter-branch transfer request

**Trigger** Transfer request raised → **Branch** *Are dues cleared at the current branch?* →
**Pending:** **Email** clear the dues → **Task** finance reconcile ·
**Cleared:** **Task** verify the seat at the destination →
**Branch** *Seat at the destination branch?* →
**Seat available:** status → Approved → **Email** transfer confirmed → **Task** move the records ·
and **Notify** the destination coordinator ·
**Waitlisted:** **Email** waitlist → **Delay** 7 days → **Task** review the waitlist ·
**No seat:** **Email** no seat → **Task** counsel the family

Not an admissions-funnel workflow: the student already belongs to the group and is moving between
campuses. Same primitives, different goal — a clean handover rather than a conversion (→ D-20).

## Node coverage

Every node in `03` is used by at least one workflow above. That is the rule that decided the library:
nothing ships that no real workflow needs (→ D-01).

| Node | Workflows using it |
|---|---|
| Trigger | all ten |
| Send email | all ten |
| Delay — duration | 1, 2, 3, 5, 6, 8, 10 |
| Delay — until event | 4 |
| Branch | all except 7 |
| Create task | 1, 3, 4, 5, 8, 9, 10 |
| Notify team | 2, 5, 6, 7, 10 |
| Update status | 3, 4, 5, 6, 7, 9, 10 |
| Allocate | 7 |
| Adjust fee | 9 |
| Parallel paths (fan-out) | 2, 5, 6, 7, 10 |
