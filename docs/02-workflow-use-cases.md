# 02 · The workflows

**Answers:** which workflows we automate, how each runs, and why each earns its place.
**Read after:** `01-admission-journey.md`.

Fifteen workflows across the journey stages, plus one beyond them. Two of the fee workflows exist
to make the same point: **a fee can sit at different milestones in different schools**, and the
builder expresses that by which trigger the workflow hangs off rather than by a fixed step (→ D-30).

> **All fifteen are live in the prototype.** *(revised)* marks the three that changed when the fee
> sequence arrived, and this describes the changed version. The step counts below are the built ones.
> The workflow list, with the lifecycle state each one loads in, is in [`README.md`](README.md).

| Stage | Workflow | Steps | Forces into the product |
|---|---|---|---|
| **Enquiry** | New enquiry follow-up | 8 | Nudge → wait → check → escalate to a human |
| **Application** | Application acknowledgement | 10 | Parallel steps: the family *and* the school, at once |
| **Application** | Registration fee at submission | 13 | A fee **before** the decision — the GIIS pattern |
| **Review** | Application review & shortlisting | 10 | A three-way outcome |
| **Review** | Missing documents reminder | 9 | Waiting on an event rather than a clock |
| **Decision** | Decision & offer *(revised)* | 17 | A branch nested inside a branch path; an offer that expires |
| **Decision** | Interview reminder | 9 | A fan-out to family and panel from one delay |
| **Registration** | Token fee & seat hold | 17 | A small non-negotiable deposit converts an intention into a commitment |
| **Registration** | Final bill & payment | 16 | Concession applied, token credited, then the real number |
| **Enrolment** | Enrolment & allocation *(revised)* | 11 | Registration triggered by payment, not by acceptance |
| **Decision** | Waitlist promotion | 14 | A released seat backfilled before the intake closes |
| **Payment** | Term fee reminder *(revised)* | 10 | An escalation ladder — same check, twice, harder |
| **Payment** | Concession application & assessment | 17 | The window between the token and the final bill |
| **Enrolment** | Withdrawal & refund | 9 | Token retained, the rest refunded, seat released |
| **Transfer** | Inter-branch transfer request | 16 | Two campuses in one flow; the widest branch |

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

## 3. Application · Registration fee at submission

**Trigger** Application submitted → **Branch** *Is a registration fee due?* (Registration fee
status) →

**Not applicable:** End — the school takes no fee at this point, and review begins ·

**Pending:** **Email** the fee link → **Delay** until Payment received, max 3 days →
**Branch** *Where did the fee get to?* (Registration fee status) →
**Paid:** **Update status** Application status → Under review → End ·
**Failed:** **Email** the payment did not go through, try another method → **Task** finance to help
the family · 
**Overdue:** **Branch** *How late is it?* (Registration fee overdue) →
**More than 3 days:** **Task** counsellor to call, application on hold · **Not yet:** End

This is the fee that arrives *before* any decision — GIIS states the registration fee "has to be paid
while submitting the admission form", with admission and term fees only after confirmation. A school
that takes no fee here simply leaves the status *Not applicable* and the workflow ends on its first
branch, which is what "configurable checkpoint" means in practice (→ D-30).

Note the **Failed** path. A card that declined is not a family avoiding payment, and treating the two
alike is how a product annoys people who did try (→ D-32).

The overdue path is where the numeric operators earn their place. A branch tests one field, so
*Paid / Failed / Overdue* is a test of the status and *more than 3 days* is a test of the day count —
two branches, because three days late and thirty days late need different answers (→ D-33).

## 4. Review · Application review & shortlisting

**Trigger** Documents submitted → **Task** Review the application → **Delay** 2 days →
**Branch** *What did the review conclude?* → **Shortlisted:** status → Shortlisted → **Email** invite
to interview · **Second look:** **Task** for the Principal · **Not eligible:** status → Rejected →
**Email** regret

The first three-way branch. A review has three honest outcomes, and forcing them into yes/no would
have produced a diagram that hides the middle one.

## 5. Review · Missing documents reminder

**Trigger** Application submitted → **Branch** *Are the documents complete?* →
**Yes:** status → Under review → End · **No:** **Email** reminder →
**Delay** until Documents submitted, max 3 days → **Branch** *Have they arrived?* →
**Yes:** End · **No:** **Task** Call the parent

Forces the wait-until-event delay. A duration delay would keep nagging a family who uploaded an hour
after the first email; waiting on the event stops the moment the problem is solved.

## 6. Decision · Decision & offer *(revised)*

**Trigger** Interview completed → **Task** Panel records the decision →
**Branch** *What did the panel decide?* →
**Offered:** status → Offered → **Email** offer letter · and **Notify** the admissions head; then
**Delay** 7 days → **Branch** *Was the offer accepted?* → **Yes:** End · **No:** **Task** call before
the offer lapses → **Update status** Offer status → **Expired**, which releases the seat and starts
workflow 11 *(revised)* ·
**Waitlisted:** status → Waitlisted → **Email** waitlist letter ·
**Not offered:** status → Rejected → **Email** regret

The deepest flow: a branch inside a branch path, and an offer with an expiry. Offers expiring in
silence is a real way schools lose accepted students.

## 7. Decision · Interview reminder

**Trigger** Interview scheduled → **Delay** 24 hours → **two parallel paths**:
**Email** reminder to the family — then **Branch** *Did they attend?* → **Yes:** status → Completed →
End · **No:** **Task** reschedule — and **Notify** tomorrow's panel list

Note the delay: the reminder is a 24-hour duration from the moment the slot is booked, not "24 hours
before the interview". That equivalence holds for same-week bookings and breaks for a slot booked
months ahead (→ D-04).

## 8. Registration · Token fee & seat hold

**Trigger** Offer accepted → **Update status** Enrolment status → **Provisional** →
**Email** hold your seat: token fee payable by the deadline, adjusted against your final bill →
**Delay** until Payment received, max 3 days → **Branch** *Token fee?* (Token fee status) →

**Paid:** **Update status** Concession status → Not claimed — which is what opens the window →
**Email** your seat is held; if you wish to apply for a scholarship or a fee adjustment, do it before
the final bill is raised → End ·

**Failed:** **Email** the payment did not go through, try another method → **Task** finance to help
the family ·

**Pending:** **Email** final call, the seat is released after the deadline → **Delay** 2 days,
skipping weekends → **Branch** *Paid now?* → **Paid:** End ·
**Pending:** **Update status** Enrolment status → **Lapsed** → **Notify** the admissions head, seat
released → End

The token fee is the pivot of this whole stage. It is deliberately small and deliberately
**non-negotiable**: a discount on a commitment device destroys the commitment, and it is a deposit
against a held seat rather than a charge for a service (→ D-34). Paying it does two things at once —
it holds the seat, and it opens the window in which the family can ask for a concession, which is
why the confirmation email says so explicitly.

An accepted offer is an intention, not a commitment. The token is what converts one into the other,
and it is why nothing is allotted yet (→ D-27).

## 9. Registration · Final bill & payment

**Trigger** Concession decided → **Adjust fee** *credit*: the token fee already paid comes off the
bill → **Email** your final bill: admission and term fees, less any concession, less the token,
payable by the deadline → **Delay** until Payment received, max 7 days →
**Branch** *Final bill?* (Admission fee status) →

**Paid:** End — workflow 10 registers the student ·
**Failed:** **Email** try another method → **Task** finance to help ·
**Overdue by more than 2 days:** **Task** counsellor to call → **Branch** *Paid now?* →
**Paid:** End · **Pending:** **Update status** Enrolment status → **Lapsed** → **Notify** seat
released → End

*Concession decided* fires whether or not anyone asked — when no concession was claimed it fires as
soon as the token clears, so a family who wants no discount is not left waiting for a decision that
was never going to happen (→ D-36).

The token arrives here as a **credit**, not a discount: the same Adjust fee node, a different
arithmetic. Stating it in the workflow means the final number is derivable from the diagram rather
than hidden in a billing system (→ D-37).

## 10. Enrolment · Enrolment & allocation *(revised)*

**Trigger** Payment received → **Branch** *Which fee arrived?* (Admission fee status) →
**Paid:** **Update status** Enrolment status → **Confirmed** →
**Allocate** class section, balanced across A/B/C → **Allocate** house, matching a sibling →
**three parallel paths**: **Email** registered — class, house and joining details → End ·
**Notify** the class teacher · **Notify** the house captain ·

**Anything else:** End — a token payment is workflow 8's business, a term fee is workflow 12's

Registration *is* the status change to Confirmed, and it happens here rather than at acceptance. The
allocations moved with it on purpose: a class section and a house allotted to a family who has not
paid is a seat the school cannot offer anyone else, and unpicking that later is manual work (→ D-27).

## 11. Decision · Waitlist promotion

**Trigger** Seat released → **Branch** *Is the intake still open?* (Intake status) →

**Open:** **Task** call the next waitlisted family (counsellor, due in 1 day) →
**Update status** Decision → Offered → **Email** a seat has opened, confirm within 3 days →
**Delay** 3 days, skipping weekends → **Branch** *Was it accepted?* →
**Accepted:** End — workflow 8 takes over, so a promoted family pays the same token and clears the
same checkpoints as everyone else ·
**Not accepted:** **Update status** Offer status → **Expired** → **Notify** the admissions head,
seat released again ·

**Full:** End ·

**Closed — deadline passed:** **Notify** the admissions head, seat unfilled for this session → End

This is the workflow that answers the actual goal: filling the available seats before the
confirmation deadline. Two things about it are worth saying out loud.

**The loop is the trigger, not a loop node.** The last step of a declined promotion sets *Offer status
→ Expired*, which releases the seat, which fires *Seat released* again for the next family on the
waitlist. There is no loop construct in the model and none is needed — but it only works if an
applicant pool can re-enter the workflow, which makes re-entry control (→ D-14) a dependency rather
than a refinement (→ D-28).

**The offer has a shorter fuse than the original.** Three days, against seven at first offer. The
closer the deadline, the more a slow reply costs, and a school would rather ask the next family than
wait politely.

## 12. Payment · Term fee reminder *(revised)*

**Trigger** Applicant enrolled → **Email** payment instructions → **Delay** 5 days →
**Branch** *Is the fee still pending?* → **No:** End ·
**Yes:** **Email** reminder → **Delay** 3 days, skipping weekends → **Branch** *Still pending?* →
**No:** End · **Yes:** **Task** finance follow-up call

The same check twice at rising intensity. It is also the most sensitive workflow — money, to families
who have already said yes — which is what drives the review-before-activation argument in D-10.

**Re-scoped by the revision.** *Applicant enrolled* now means *registered*, which only happens after
the confirmation fee is paid, so this workflow is no longer about the first payment — workflows 8 and 9 own
that window. It covers the term fees that follow joining, and reads *Term fee status* rather than a
generic payment status (→ D-31). That also settles what used to be the
first open question in `07`: two workflows no longer race on one trigger, because the confirmation
fee and the instalments start from different events.

## 13. Payment · Concession application & assessment

**Trigger** Concession requested → **Branch** *What concession is claimed?* (Fee concession) →

**Merit-cum-need:** **Task** verify the income documents (Finance team) → **Adjust fee** 40% of
tuition, needs Principal approval → **Update status** Concession status → Approved →
**Email** revised fee schedule → End ·

**Faculty family:** **Adjust fee** 50% of tuition, needs Finance team approval → **Email** revised
fee schedule → End ·

**Special allowance:** **Task** head's discretion review (Admissions head) → **Adjust fee** a fixed
amount, needs Principal approval → **Email** revised fee schedule ·

**None:** End — the final bill quotes the standard amount

Fee concessions are the one place in the journey where the workflow touches money, and schools run
several kinds at once: merit-cum-need aid on verified income, an automatic staff concession for a
faculty member's child, and a head's discretionary allowance. Each needs a different amount of human
judgement before the figure applies, which is why the categories are separate paths rather than one
"discount" step: merit-cum-need collects documents first, faculty family needs no evidence at all,
and a special allowance is a person's decision.

**Where this sits now.** The window opens when the token fee clears and closes when the final bill is
raised, so this workflow runs between workflows 8 and 9 and ends by firing *Concession decided*
(→ D-36). Every path must end in a decision, approved or rejected, because workflow 9 is waiting on
it. Note what it cannot touch: the token fee is not a valid target for a concession, and the node does
not offer it (→ D-35).

## 14. Enrolment · Withdrawal & refund

**Trigger** Applicant withdrawn → **Update status** Enrolment status → **Withdrawn** →
**Branch** *What has been paid?* (Admission fee status) →

**Paid:** **Update status** Refund status → Due → **Task** finance to refund the balance and retain
the token → **Email** the family, with the refund breakdown → **Notify** the admissions head, seat
released ·

**Anything else:** **Email** confirming the withdrawal, the token is retained → **Notify** the
admissions head, seat released

This is the other half of the token's bargain: the school keeps the token and returns everything
else (→ D-38). It is a **task for finance**, not an automated payout — this product does not move
money out, and pretending otherwise would be the most dangerous fake in it.

Both paths end in a notification that the seat is released, which is what pulls the next waitlisted
family into workflow 8 (→ D-28).

## 15. Transfer · Inter-branch transfer request

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
nothing ships that no real workflow needs (→ D-01). The rows below are counted off the built
workflows rather than asserted.

| Node | Workflows using it |
|---|---|
| Trigger | all fifteen |
| Send email | all fifteen |
| Delay — duration | 1, 2, 4, 6, 7, 8, 11, 12, 15 |
| Delay — until event | 3, 5, 8, 9 |
| Branch | all fifteen |
| Create task | all except 10 |
| Notify team | 2, 6, 7, 8, 9, 10, 11, 14, 15 |
| Update status | all except 1 and 12 |
| Allocate | 10 |
| Adjust fee | 9 (credit), 13 (concession) |
| End | all except 2, 14 and 15 |
| Parallel | 2, 6, 7, 10, 15 |

*Delay — until a date* is the one mode no workflow needs. It ships anyway, because a fixed fee cut-off
is a real configuration and the mode costs nothing once the other two exist (→ D-04).
