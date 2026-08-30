# 02 · The workflows

**Answers:** which workflows we automate, how each one runs, and why each earns its place.
**Read after:** `01-admission-journey.md`.

Fifteen workflows. Fourteen sit on the admission journey; the last one, an inter-branch transfer, sits
beside it.

Three of the fee workflows exist to make one point. **A fee can sit at different milestones in
different schools.** The builder expresses that by which trigger a workflow starts from, not by a
fixed step in a fixed sequence (→ D-30).

> All fifteen are built. *(revised)* marks the three that changed when the fee sequence arrived, and
> this describes the changed version. Step counts are the built ones. The list with each workflow's
> lifecycle state is in [`README.md`](README.md).

| #   | Workflow                            | Stage        | Steps | What it forces into the product                          |
| --- | ----------------------------------- | ------------ | ----- | -------------------------------------------------------- |
| 1   | New enquiry follow-up               | Enquiry      | 8     | Nudge, wait, check, then escalate to a human             |
| 2   | Application acknowledgement         | Application  | 10    | Parallel steps: the family and the school at once        |
| 3   | Registration fee at submission      | Application  | 13    | A fee *before* the decision                              |
| 4   | Application review & shortlisting   | Review       | 10    | A three-way outcome                                      |
| 5   | Missing documents reminder          | Review       | 9     | Waiting on an event, not a clock                         |
| 6   | Decision & offer *(revised)*        | Decision     | 17    | A branch inside a branch, and an offer that expires      |
| 7   | Interview reminder                  | Decision     | 9     | One delay, two audiences                                 |
| 8   | Token fee & seat hold               | Registration | 17    | A deposit that turns an intention into a commitment      |
| 9   | Final bill & payment                | Registration | 16    | Concession applied, token credited, then the real number |
| 10  | Enrolment & allocation *(revised)*  | Enrolment    | 11    | Registration triggered by payment, not acceptance        |
| 11  | Waitlist promotion                  | Decision     | 14    | A released seat backfilled before the intake closes      |
| 12  | Term fee reminder *(revised)*       | Payment      | 10    | The same check twice, harder                             |
| 13  | Concession application & assessment | Payment      | 17    | The window between the token and the final bill          |
| 14  | Withdrawal & refund                 | Enrolment    | 9     | Token retained, the rest refunded, seat released         |
| 15  | Inter-branch transfer request       | Transfer     | 16    | Two campuses in one flow                                 |

## 1. New enquiry follow-up

**Enquiry** · starts on *Enquiry submitted* · 8 steps

1. Email the school introduction.
2. Wait 3 days.
3. **Has an application arrived?**
   - **Yes** — end.
   - **No** — email an application reminder, wait 4 days, then task the counsellor to call.

The highest-volume workflow in any school, and it sets the core pattern. The last step is a *task*,
not a third email. After two ignored emails, more email is not the answer.

## 2. Application acknowledgement

**Application** · starts on *Application submitted* · 10 steps

1. **In parallel:** email a thank-you to the parent, and email the school official.
2. Task someone to review the application.
3. Set Application status to Under review.
4. Wait 2 days.
5. **Reviewed within 2 days?**
   - **Yes** — email the next steps.
   - **No** — notify the admissions head, urgent.

The workflow the brief describes. It is the only one whose second audience is the school rather than
the family, and that fan-out is what makes this a workflow builder rather than an email tool.

## 3. Registration fee at submission

**Application** · starts on *Application submitted* · 13 steps

1. **Is a registration fee due?** (Registration fee status)
   - **Not applicable** — end. The school takes no fee here, so review simply begins.
   - **Pending** — email the fee link, then wait for payment, up to 3 days.
2. **Where did the fee get to?** (Registration fee status)
   - **Paid** — set Application status to Under review, end.
   - **Failed** — email "try another method", then task finance to help the family.
   - **Overdue** — check how late it is.
3. **How late is it?** (Registration fee overdue)
   - **More than 3 days** — task the counsellor to call. Application on hold.
   - **Not yet** — end.

This is the fee that arrives *before* any decision. GIIS states the registration fee "has to be paid
while submitting the admission form", with admission and term fees only after confirmation.

A school that takes no fee here leaves the status at *Not applicable*. The workflow then ends on its
first branch. That is what "configurable checkpoint" means in practice (→ D-30).

The **Failed** path matters. A card that declined is not a family avoiding payment. Treating the two
alike is how a product annoys people who did try (→ D-32).

The overdue path is where the numeric operators earn their place. A branch tests one field, so
*Paid / Failed / Overdue* tests the status and *more than 3 days* tests the day count. Two branches,
because three days late and thirty days late need different answers (→ D-33).

## 4. Application review & shortlisting

**Review** · starts on *Documents submitted* · 10 steps

1. Task someone to review the application.
2. Wait 2 days.
3. **What did the review conclude?**
   - **Shortlisted** — set status to Shortlisted, email the interview invitation.
   - **Needs a second look** — task the Principal.
   - **Not eligible** — set status to Rejected, email the regret letter.

The first three-way branch. A review has three honest outcomes. Forcing them into yes/no would
produce a diagram that hides the middle one.

## 5. Missing documents reminder

**Review** · starts on *Application submitted* · 9 steps

1. **Are the documents complete?**
   - **Yes** — set status to Under review, end.
   - **No** — email a reminder, then wait for *Documents submitted*, up to 3 days.
2. **Have they arrived?**
   - **Yes** — end.
   - **No** — task the counsellor to call the parent.

This forces the wait-until-event delay. A duration delay would keep nagging a family who uploaded an
hour after the first email. Waiting on the event stops the moment the problem is solved.

## 6. Decision & offer *(revised)*

**Decision** · starts on *Interview completed* · 17 steps

1. Task the panel to record the decision.
2. **What did the panel decide?**
   - **Offered** — set Decision to Offered, then **in parallel** email the offer letter and notify
     the admissions head.
   - **Waitlisted** — set Decision to Waitlisted, email the waitlist letter.
   - **Not offered** — set Decision to Rejected, email the regret letter.
3. On the offered path, wait 7 days, then: **was the offer accepted?**
   - **Yes** — end.
   - **No** — task the counsellor to call, then set Offer status to **Expired**.

Setting the offer to Expired releases the seat, which starts workflow 11 *(revised)*.

The deepest flow in the set: a branch inside a branch path, and an offer with an expiry. Offers
expiring in silence is a real way schools lose students who wanted to come.

## 7. Interview reminder

**Decision** · starts on *Interview scheduled* · 9 steps

1. Wait 24 hours.
2. **In parallel:** remind the family, and notify tomorrow's panel.
3. On the family path: **did they attend?**
   - **Yes** — set Interview status to Completed, end.
   - **No** — task someone to reschedule.

Note the delay. The reminder is 24 hours from the moment the slot is *booked*, not 24 hours before
the interview happens. That works for same-week bookings and breaks for a slot booked months ahead
(→ D-04).

## 8. Token fee & seat hold

**Registration** · starts on *Offer accepted* · 17 steps

1. Set Enrolment status to **Provisional**. The seat is held.
2. Email: hold your seat, the token fee is payable by the deadline and comes off your final bill.
3. Wait for payment, up to 3 days.
4. **Token fee?** (Token fee status)
   - **Paid** — set Concession status to Not claimed, which opens the concession window. Email
     confirming the seat is held and inviting a concession application. End.
   - **Failed** — email "try another method", task finance to help.
   - **Pending** — email a final call, wait 2 more days, then check again.
5. **Paid now?**
   - **Paid** — end.
   - **Pending** — set Enrolment status to **Lapsed**, notify the admissions head that the seat is
     released, end.

The token fee is the pivot of this stage. It is small and it is **non-negotiable**. A discount on a
commitment device destroys the commitment, and this is a deposit against a held seat rather than a
charge for a service (→ D-34).

Paying it does two things at once. It holds the seat, and it opens the window in which the family can
ask for a concession. That is why the confirmation email says so explicitly.

An accepted offer is an intention, not a commitment. The token converts one into the other, and it is
why nothing is allotted yet (→ D-27).

## 9. Final bill & payment

**Registration** · starts on *Concession decided* · 16 steps

1. **Adjust fee**, as a credit: the token already paid comes off the bill.
2. Email the final bill. Admission and term fees, less any concession, less the token.
3. Wait for payment, up to 7 days.
4. **Final bill?** (Admission fee status)
   - **Paid** — end. Workflow 10 registers the student.
   - **Failed** — email "try another method", task finance to help.
   - **Overdue** — check how late it is.
5. **More than 2 days late?**
   - **Yes** — task the counsellor to call, then check again. Still unpaid means Enrolment status
     goes to **Lapsed** and the head is notified.
   - **Not yet** — end.

*Concession decided* fires whether or not anyone asked. When no concession was claimed it fires as
soon as the token clears, so a family who wants no discount is not left waiting for a decision that
was never going to happen (→ D-36).

The token arrives here as a **credit**, not a discount. Same Adjust fee node, different arithmetic.
Stating it in the workflow means the final number can be read off the diagram rather than hidden in a
billing system (→ D-37).

## 10. Enrolment & allocation *(revised)*

**Enrolment** · starts on *Payment received* · 11 steps

1. **Which fee arrived?** (Admission fee status)
   - **Paid** — continue below.
   - **Anything else** — end. A token payment belongs to workflow 8, a term fee to workflow 12.
2. Set Enrolment status to **Confirmed**. This is the moment of registration.
3. Allocate the class section, balanced across A/B/C.
4. Allocate the house, matching a sibling.
5. **In parallel:** email the family their class, house and joining details; notify the class teacher;
   notify the house captain.

Registration *is* the change to Confirmed, and it happens here rather than at acceptance. The
allocations moved with it on purpose. A class section and a house given to a family who has not paid
is a seat the school cannot offer anyone else, and unpicking that later is manual work (→ D-27).

## 11. Waitlist promotion

**Decision** · starts on *Seat released* · 14 steps

1. **Is the intake still open?** (Intake status)
   - **Open** — continue below.
   - **Full** — end.
   - **Closed** — notify the admissions head that the seat is unfilled for this session, end.
2. Task the counsellor to call the next waitlisted family, due in 1 day.
3. Set Decision to Offered.
4. Email: a seat has opened, please confirm within 3 days.
5. Wait 3 days, skipping weekends.
6. **Was it accepted?**
   - **Accepted** — end. Workflow 8 takes over, so a promoted family pays the same token and clears
     the same checkpoints as everyone else.
   - **Not accepted** — set Offer status to **Expired**, notify the head that the seat is released
     again.

This is the workflow that answers the real goal: filling the seats before the confirmation deadline.
Two things about it are worth saying out loud.

**The loop is the trigger, not a loop node.** A declined promotion sets *Offer status → Expired*,
which releases the seat, which fires *Seat released* again for the next family. There is no loop
construct in the model and none is needed. But it only works if an applicant pool can re-enter the
workflow, which makes re-entry control a dependency rather than a refinement (→ D-14, → D-28).

**The offer has a shorter fuse than the original.** Three days, against seven at first offer. The
closer the deadline, the more a slow reply costs.

## 12. Term fee reminder *(revised)*

**Payment** · starts on *Applicant enrolled* · 10 steps

1. Email the payment instructions.
2. Wait 5 days.
3. **Is the fee still pending?** (Term fee status)
   - **No** — end.
   - **Yes** — email a reminder, wait 3 days skipping weekends, then check again.
4. **Still pending?**
   - **No** — end.
   - **Yes** — task finance to make a follow-up call.

The same check twice, at rising intensity. It is also the most sensitive workflow in the set: money,
to families who have already said yes. That is what drives the review-before-activation argument in
D-10.

**What the revision changed.** *Applicant enrolled* now means *registered*, which only happens after
the gating fee is paid. So this workflow is no longer about the first payment. Workflows 8 and 9 own
that window. This one covers the term fees that follow joining, and it reads *Term fee status* rather
than a generic payment status (→ D-31).

That also settled an old open question. Two workflows no longer race on one trigger, because the
confirmation fee and the instalments start from different events.

## 13. Concession application & assessment

**Payment** · starts on *Concession requested* · 17 steps

**What concession is claimed?** (Fee concession)

**Merit-cum-need**

1. Task finance to verify the income documents.
2. Adjust the fee by 40%, needing Principal approval.
3. Record the decision, then email the revised schedule.

**Faculty family**

1. Adjust the fee by 50%, needing Finance team approval.
2. Record the decision, then email the revised schedule.

**Special allowance**

1. Task the admissions head for a discretionary review.
2. Adjust by a fixed amount, needing Principal approval.
3. Record the decision, then email the revised schedule.

**None** — end. The final bill quotes the standard amount.

Fee concessions are the one place in the journey where a workflow touches money. Schools run several
kinds at once: merit-cum-need aid on verified income, an automatic staff concession for a faculty
member's child, and a head's discretionary allowance.

Each needs a different amount of human judgement before the figure applies. That is why they are
separate paths rather than one "discount" step. Merit-cum-need collects documents first, faculty
family needs no evidence at all, and a special allowance is one person's decision.

**Where this sits.** The window opens when the token clears and closes when the final bill is raised,
so this runs between workflows 8 and 9 and ends by firing *Concession decided* (→ D-36). Every path
must end in a decision, approved or rejected, because workflow 9 is waiting on it.

Note what it cannot touch. The token fee is not a valid target for a concession, and the node does
not offer it (→ D-35).

## 14. Withdrawal & refund

**Enrolment** · starts on *Applicant withdrawn* · 9 steps

1. Set Enrolment status to **Withdrawn**.
2. **What has been paid?** (Admission fee status)
   - **Paid** — set Refund status to Due, task finance to refund the balance and retain the token,
     email the family the breakdown, notify the head that the seat is released.
   - **Anything else** — email confirming the withdrawal and that the token is retained, notify the
     head that the seat is released.

This is the other half of the token's bargain. The school keeps the token and returns everything else
(→ D-38).

It is a **task for finance**, not an automated payout. This product does not move money out, and
pretending otherwise would be the most dangerous fake in it.

Both paths end in a notification that the seat is released, which is what pulls the next waitlisted
family into workflow 8 (→ D-28).

## 15. Inter-branch transfer request

**Transfer** · starts on *Transfer request raised* · 16 steps

1. **Are dues cleared at the current branch?**
   - **Pending** — email the family to clear the dues, task finance to reconcile.
   - **Cleared** — task someone to verify the seat at the destination.
2. **Is there a seat at the destination?**
   - **Available** — set Transfer status to Approved, then **in parallel** email the confirmation,
     task the records team to move the records, and notify the destination coordinator.
   - **Waitlisted** — email the family, wait 7 days, task someone to review the waitlist.
   - **No seat** — email the family, task the counsellor to talk it through.

This is not an admissions-funnel workflow. The student already belongs to the group and is moving
between campuses. Same primitives, different goal: a clean handover rather than a conversion
(→ D-20).

## Node coverage

Every node in `03` is used by at least one workflow above. That is the rule that decided the library:
nothing ships that no real workflow needs (→ D-01).

The rows below are counted off the built workflows rather than asserted.

| Node                | Workflows using it                |
| ------------------- | --------------------------------- |
| Trigger             | All fifteen                       |
| Send email          | All fifteen                       |
| Branch              | All fifteen                       |
| Create task         | All except 10                     |
| Update status       | All except 1 and 12               |
| Delay — duration    | 1, 2, 4, 6, 7, 8, 11, 12, 15      |
| Delay — until event | 3, 5, 8, 9                        |
| Notify team         | 2, 6, 7, 8, 9, 10, 11, 14, 15     |
| End                 | All except 2, 14 and 15           |
| Parallel            | 2, 6, 7, 10, 15                   |
| Adjust fee          | 9 as a credit, 13 as a concession |
| Allocate            | 10                                |

*Delay — until a date* is the one mode no workflow needs. It ships anyway, because a fixed fee
cut-off is a real configuration and the mode costs nothing once the other two exist (→ D-04).
