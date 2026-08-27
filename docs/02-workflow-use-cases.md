# 02 · The five workflows

**Answers:** which workflows we chose to automate, how each one runs, and why each earns its place.
**Read after:** `01-admission-journey.md`.

The brief supplies three example workflows and says they are not the final scope. We kept all three
and added two — **Missing documents** and **Interview reminder** — because without them the product
never has to answer two questions it cannot avoid in a real school: what happens on the *negative*
path, and how do you wait relative to a scheduled date. Each workflow below is listed with the
capability it forces into the node library; that is the selection criterion, not variety.

## 1. New enquiry follow-up · *Enquiry → Application*

**Goal:** convert a new enquiry into a submitted application.

**Trigger** Enquiry created → **Email** School introduction → **Delay** 3 days →
**Branch** Application submitted? → **Yes:** End · **No:** **Email** Application reminder →
**Delay** 4 days → **Task** Counsellor calls the parent

**Why this one:** it is the highest-volume workflow in any school and it establishes the core
pattern — nudge, wait, check, escalate to a human. The final step being a *task* rather than a
third email is the point: after two ignored emails, more email is not the answer.

## 2. Application acknowledgement and review · *Application → Review*

**Goal:** confirm receipt, and make sure the application is actually picked up.

**Trigger** Application submitted → **Email** Application received (to parent) →
**Task** Review application (to admissions team) → **Update status** Application status → Under
review → **Delay** 2 days → **Branch** Application reviewed? → **Yes:** **Email** Next steps ·
**No:** **Notification** Admissions head — application unreviewed for 2 days

**Why this one:** the only workflow whose *audience is the school*, not the family. It is what makes
this a workflow builder rather than an email tool, and it is where `Update status` and internal
notifications become necessary (→ D-11).

## 3. Missing documents reminder · *Application → Review*

**Goal:** chase incomplete document sets without a human tracking a spreadsheet.

**Trigger** Application submitted → **Branch** Documents complete? → **Yes:** End (continues to
review) · **No:** **Add tag** Documents pending → **Email** Missing documents reminder →
**Delay** Wait until documents submitted, up to 3 days → **Branch** Documents complete? →
**Yes:** End · **No:** **Task** Counsellor follow-up call

**Why this one:** it forces the *wait-until-event* delay. A duration delay here would keep nagging a
family who uploaded their documents an hour after the first email; waiting on the event stops the
workflow the moment the problem is solved (→ D-04). It is also the first workflow that branches
immediately at the top rather than after a message.

## 4. Interview / assessment reminder · *Decision*

**Goal:** get families to actually attend the slot they booked.

**Trigger** Interview scheduled → **Delay** Until 24 hours before the interview →
**Email** Interview reminder (to parent) → **Notification** Interview panel — tomorrow's list →
**Branch** Interview completed? → **Yes:** End (continues to decision) ·
**No:** **Task** Reschedule with the parent

**Why this one:** the only workflow that waits *backwards from a future date*. Marketing tools
express this awkwardly; admissions needs it constantly — interviews, fee deadlines, term start,
document cut-offs. This single requirement is why the delay node has five types instead of one.

## 5. Enrolment payment reminder · *Enrolment → Payment*

**Goal:** convert an accepted offer into a paid seat.

**Trigger** Applicant enrolled → **Email** Payment instructions → **Delay** 5 days →
**Branch** Payment completed? → **Yes:** End · **No:** **Email** Payment reminder →
**Delay** 3 days (exclude weekends) → **Branch** Payment completed? → **Yes:** End ·
**No:** **Task** Finance team follow-up

**Why this one:** the longest workflow, and the one that proves the same branch can repeat at
escalating intensity. It is also the most sensitive — money, to families who have already said yes —
which is what drives the review-before-activation step (→ D-10).

## Coverage matrix

Every node in `03` appears in at least one column below. That is the rule that decided the node
library: nothing ships that no real workflow needs (→ D-01).

| Node | W1 Enquiry | W2 Acknowledge | W3 Documents | W4 Interview | W5 Payment |
|---|---|---|---|---|---|
| Trigger | ✔ | ✔ | ✔ | ✔ | ✔ |
| Send email | ✔ | ✔ | ✔ | ✔ | ✔ |
| Delay — duration | ✔ | ✔ | — | — | ✔ |
| Delay — until event | — | — | ✔ | — | — |
| Delay — relative to date | — | — | — | ✔ | — |
| Branch | ✔ | ✔ | ✔ ✔ | ✔ | ✔ ✔ |
| Create task | ✔ | ✔ | ✔ | ✔ | ✔ |
| Send internal notification | — | ✔ | — | ✔ | — |
| Update applicant status | — | ✔ | — | — | — |
| Add tag | — | — | ✔ | — | — |
