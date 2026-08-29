# 06 · Decision log

**Answers:** why the product looks like this, what else was considered, and what each choice costs.
**Read after:** anything that cross-referenced a `→ D-nn`.

Every entry has the same shape: options, choice, why, trade-off. The trade-off line is not
decoration — each choice gives something up. Nine entries carry a **Revised** line: the build, or a
later requirement, contradicted the original call, and the change of mind is recorded rather than
quietly edited out.

### D-01 · Group nodes by function, not by admission stage
**Options** flat palette · grouped by journey stage · grouped by function.
**Choice** function: Triggers, Actions, Logic, Delays.
**Why** adding a step, the user asks "do I want to *do* something, *wait*, or *decide*?" Stage
grouping breaks because email, delay and branch recur at all six stages. All three researched
products group by function, so the vocabulary is already familiar.
**Trade-off** no journey-shaped shortcut for a first-time user; mitigated by search in the library.

### D-02 · One trigger per workflow in the MVP
**Options** single trigger · multiple OR-ed triggers, as HubSpot and ActiveCampaign allow, or up to
three as Mailchimp allows.
**Choice** single.
**Why** all fifteen workflows have exactly one entry event. Multi-trigger raises "what if an applicant
qualifies twice?" — dedupe and re-entry semantics belonging to the execution engine, out of scope
this round.
**Trade-off** "enquiry created OR enquiry marked hot" needs two workflows. Cheap to lift later — the
trigger is already filter-based.

### D-03 · A branch takes as many paths as the school needs
**Options** HubSpot's three branch types (single-property up to 250 paths, if/then AND/OR up to 20
paths, percentage) · ActiveCampaign's single If/Else · one binary Yes/No branch.
**Choice** one branch node with N labelled paths. The field is chosen once on the branch; the
condition that selects a path lives on the path itself.
**Why** the first five workflows were all yes/no checks on state, so binary looked sufficient. The
transfer case broke it immediately: a seat request is *available / waitlist / no seat*, and forcing
that into nested yes/no branches produces a diagram nobody can read. Putting the condition on the
path rather than the node is what makes two paths and six paths the same mechanism.
**Trade-off** more to configure per branch, and the reader has to look at the connectors rather than
the node to see why a path was taken — so with three or more paths the canvas prints each path's
condition under its label.
**Revised** this reverses the original decision to defer N-way splitting. Binary was a guess made
before a use case that needed more than two outcomes; see D-17 for the fallback rule that came with
it.

### D-04 · Three delay types, not five
**Options** one duration delay · duration plus until-date · the five in the original plan (duration,
until a date, until a time of day, until an event, relative to a date field).
**Choice** three: **a duration** (amount + unit, optionally skipping weekends), **until an event**
(with a give-up limit), **until a date**.
**Why** duration and until-an-event carry every workflow in `02`. Until-a-date covers a fixed fee
cut-off. The two that were cut are the two nothing needed yet: time-of-day is a refinement of
duration, and relative-to-a-date-field ("24 hours before the interview") turned out to be
expressible as a 24-hour duration from the *Interview scheduled* trigger, because the trigger fires
when the slot is booked, not when it happens.
**Trade-off** the interview reminder now leans on that equivalence, which breaks the day a school
books a slot months ahead — a genuine gap, and the clearest argument for adding the relative delay
next.
**Revised** the original entry claimed five types and called relative-to-date first class. The
prototype ships three; saying so is better than demoing a claim the screen contradicts.

### D-05 · Weekend exclusion on delays
**Options** ignore calendars · exclude weekends · full academic-calendar awareness.
**Choice** exclude weekends now, on by default for delays of a day or more; calendar awareness next.
**Why** a Thursday plus three days drops a parent-call task on Sunday, when the school is shut; it
rots until Monday. HubSpot's "Business days only" option exists for the same reason.
**Trade-off** a partial fix — weekends yes, Diwali and summer break no, and Indian schools have long
vacations.

### D-06 · Random / A/B split left out entirely
**Options** ship it · show it in the library labelled Future · leave it out.
**Choice** leave it out of the node library.
**Why** a grade intake is tens to low hundreds of applicants — HubSpot wants roughly a thousand
records for its percentage split to distribute evenly, so a split test here measures noise.
Splitting a fee-instruction email across variants is a bad idea besides. Once the prototype narrowed
to admissions flows, a greyed-out marketing node in the palette was noise rather than a signal of
ambition.
**Trade-off** the brief mentions marketing workflows, and a marketing-led school running campaigns
to a large enquiry list will want it. It belongs in the Next list in `05`, not in the palette.
**Revised** previously "show it, labelled Future"; the palette's Later section now lists only
admissions-shaped nodes.

### D-07 · Nodes print their configuration, never "Configured"
**Options** generic node labels · a summary string per node type.
**Choice** a hand-written summary per node type, specified in `04`.
**Why** review before activation (→ D-10) is a *read* of the whole canvas. If nodes read
"Configured", answering "will this email a parent twice?" means opening nine panels. Every builder we
reviewed prints the configured value on the node.
**Trade-off** long values must truncate, and every new node type needs a hand-written summary
template.

### D-08 · Configuration in a right-hand panel
**Options** expand inline on the node · modal dialog · right panel.
**Choice** right panel.
**Why** email configuration is eight fields; inline would destroy the canvas geometry, and a modal
hides the flow the user is reasoning about — half of configuration is "where in the flow am I".
**Trade-off** the canvas is squeezed on narrow screens; the panel collapses.

### D-09 · Validation warns, it does not block
**Options** block save until valid · block activation only · warn only.
**Choice** drafts always save; warnings sit on nodes and are counted in the header; completeness is
enforced at activation.
**Why** administrators build in passes — lay out the shape today, get the email copy approved by the
principal on Thursday. Blocking the save punishes the natural order of the work.
**Trade-off** a draft can be saved in a nonsense state, so the warning count must stay visible.

### D-10 · Draft / Active / Paused, with a review before activation
**Options** a simple on/off toggle · three states plus an explicit review before activation.
**Choice** three states, on a pill beside the workflow name. Every move *into* Active opens a review
screen; pausing and going back to a draft are immediate.
**Why** a misconfigured fee reminder to three hundred families cannot be recalled, so activation has
to be a deliberate step that shows what is about to happen — and Pause exists because the response to
an incident is "stop it now", which is the one transition that must not ask a question. The review is
assembled from the nodes rather than written by hand: it lists what goes out, what work it creates
and what it changes, which is only possible because every node prints its configuration (→ D-07).
It is also where completeness stops being advisory — an incomplete step blocks activation (→ D-09).
**Trade-off** lifecycle normally lives on a workflow *list*, and D-24 removed the list, so the
control sits on the builder header instead. That works for one workflow at a time and says nothing
about "which of my fifteen workflows are live" — a list-level view is still missing.
**Revised** twice. The original entry read as though the states were implemented; the second said
they were designed but not built. They are now built, on the builder screen rather than on a list.

### D-11 · Task and internal notification are separate nodes
**Options** one "notify someone" node · two nodes.
**Choice** two.
**Why** the semantics differ: a task has an owner, a due date and a completion state; a notification
is FYI. Merging them makes "who is chasing this family?" unanswerable — which is the question the
admissions head asks every morning. HubSpot keeps them separate for the same reason.
**Trade-off** two library entries that look alike; the one-line descriptions carry the distinction.

### D-12 · Admissions-native fields, not generic contact properties
**Options** generic properties with custom fields, the route HubSpot, ActiveCampaign and Mailchimp
arrive in a school on · named admissions objects and fields.
**Choice** the named field list in `01`.
**Why** the generic route makes every school re-model admissions in a CRM's vocabulary before it can
automate anything. Named fields also let us pre-fill defaults — a fee workflow
arrives with `Term fee status = Pending` set.
**Trade-off** less flexibility for schools with unusual stages; a custom-field escape hatch will be
needed.

### D-13 · Recipients are roles, resolved at run time
**Options** email addresses and lists · roles.
**Choice** roles — Parent/Guardian, Applicant, Counsellor, Class teacher, Finance team — with a
custom-address option for fixed inboxes.
**Why** at build time nobody knows the parent's address; it resolves per applicant. Roles also
survive staff turnover: a counsellor leaving does not break twelve workflows.
**Trade-off** the resolution rules need defining — which parent, when a record has two guardians?
Listed as an open question in `07`.

### D-14 · Re-entry is a setting on the trigger
**Options** always re-enter · never re-enter · a re-entry setting on the trigger.
**Choice** the setting: **once only** by default, **once per academic year**, or **every time**.
**Why** applicants re-apply the following year, families enquire again for a sibling, and the failure
mode of always-re-enter is duplicate reminders to a family that already paid. It was cut from an
earlier build on the grounds that re-entry is a run-time rule with nothing observable behind it in a
prototype that executes nothing — but D-28 made it a dependency rather than a refinement: waitlist
promotion works by re-firing its own trigger, and without *every time* the loop runs once and stops.
A control that is load-bearing for a workflow on screen is worth having on screen.
**Trade-off** it is still a rule nothing enforces here, so the prototype states the intent rather
than demonstrating it. The dedupe question behind it — what counts as the same applicant across two
academic years — is a run-time question left for Round 3 (→ D-02).
**Revised** twice: first described as part of the trigger configuration, then as designed but not
built. It is now on the trigger panel, and the waitlist promotion is the one workflow that ships set
to *Every time*.

### D-15 · Click-to-add in the prototype, not real drag-and-drop
**Options** full drag-and-drop canvas · click-to-add with rendered connectors.
**Choice** click-to-add.
**Why** Round 2 is judged on information architecture and configuration. Click-to-add reaches every
screen that matters for a fraction of the effort, and the node picker is the interaction that
actually needs testing.
**Trade-off** re-ordering and free-form canvas editing are not demonstrated — better stated openly
in the demo than discovered by the interviewer.

### D-16 · Execution, SMS/WhatsApp and webhooks out of scope
**Choice** none of the three are in this round.
**Why** the brief puts execution out of scope explicitly. WhatsApp is the highest-value future
addition — it is where Indian parents actually reply — but it brings opt-in, template approval and a
provider choice: product decisions, not a node. Webhooks target a developer; our user is a school
administrator.
**Trade-off** the prototype cannot show a workflow running, so the node summaries and the review
step must carry the credibility.
**Round 3 must answer** run-time semantics (dedupe, re-entry, what happens when an applicant's state
changes mid-delay), role-to-address resolution, and whether WhatsApp belongs in Round 4 scope.

### D-17 · The last path with no value is the fallback
**Options** require every path to carry a condition and add an explicit "otherwise" path · treat a
value-less path as the catch-all · route unmatched applicants nowhere.
**Choice** the path whose value is blank is the fallback, and the panel says so in words.
**Why** every N-way branch needs somewhere for the unmatched to go, and an applicant silently
falling out of a workflow is the exact failure mode these workflows exist to prevent. Making it a
property of an ordinary path — rather than a special node — keeps the model to one concept. The
operators `is empty` and `is not empty` are conditions in their own right, so a path using one counts
as configured even though its value is blank.
**Trade-off** "blank means catch-all" is a convention a user has to be told; the panel spells it out
under the path, and a branch with two or more unset paths is flagged as ambiguous.

### D-18 · Allocation is its own node, not a status update
**Options** reuse Update status with a fixed value · a dedicated Allocate node · leave allocation to
a human task.
**Choice** an Allocate node with a target (House or Class & section) and a method — balance across
the options, match a sibling, or pick one.
**Why** a status update sets a value the user already knows. Allocation is the system *choosing*,
and the interesting part is the rule: houses should come out even, siblings should share a house,
sections should be balanced by size. That rule cannot be expressed as a value. It also replaced a
manual "Allot class and section" task in the enrolment flow, which is the clearest example in the
prototype of automation removing work rather than just sending mail.
**Trade-off** balancing is a claim the prototype cannot demonstrate, since nothing executes. Houses
are a fixed pool of four; section names are free text because a school's are its own.

### D-19 · A stage owns several workflows
**Options** one workflow per stage · a flat list of workflows · stages that contain workflows.
**Choice** the six journey stages are the top-level tabs, and a stage holds one or more workflows,
with a picker beside the tabs where it holds more than one.
**Why** Review is not one workflow — it is document chasing *and* shortlisting, and they trigger
differently. Flattening them into sibling tabs would have put nine tabs across the top and lost the
journey, which is the thing the brief actually organises around. Stage order comes from the stage
list itself, not from the order the workflows happen to be written in.
**Trade-off** two levels of navigation instead of one, for a demo that only ever shows nine
workflows.

### D-20 · Inter-branch transfer is a group-level flow, not an admissions one
**Options** leave it out · add it as an admissions workflow · add it as a separate category.
**Choice** ship it as its own stage, and say plainly that it is not part of the admissions funnel.
**Why** it uses the same primitives and a school group genuinely runs it, so it proves the node
vocabulary holds against a case it was not designed for. But its goal is a clean handover — seat,
dues, records — not a conversion, and every node needs a *which campus* dimension the other flows
never need. Calling it an admissions workflow would blur what the funnel is for.
**Trade-off** the campus dimension is currently only role names ("Destination admissions officer").
Where the workflow *runs* — source campus, destination, or the group — is unanswered and is the
sharpest question in it.

### D-21 · Retry means delivery retry, on outward-facing nodes only
**Options** retry any step · retry the outward-facing steps · no retry.
**Choice** Send email and Notify team carry a retry block (on/off, attempts, interval in hours).
Tasks, status updates, allocations and delays do not.
**Why** a retry is only meaningful where something can fail outside the school's control — an email
bounces, a notification goes unread. Re-running a status update or an allocation is either a no-op or
actively wrong. Naming this precisely matters because the chip on the node reads "Retry ×2", which a
reader could easily take to mean the whole step re-runs.
**Trade-off** it says nothing about *why* delivery failed, and a hard bounce should stop rather than
retry twice more. That distinction needs the execution engine.

### D-22 · The open workflow and selected step live in the URL
**Options** in-memory state only · a route per workflow · query parameters.
**Choice** `?flow=…&step=…`, written as you navigate.
**Why** a reload or a shared link previously always landed on the default diagram. Query parameters
make a specific diagram — and a specific step's configuration — linkable, which matters most for
presenting: tabs can be opened pointing at each stage rather than clicked through live. Opening a
workflow pushes history so Back walks the stages; selecting a step replaces it, so a click-heavy
demo does not bury Back.
**Trade-off** editing state is not in the URL, so a link shares a *place*, not a *version*. A step id
from another workflow is dropped rather than honoured, so a stale link opens the workflow at its
trigger.

### D-23 · Every condition value is a pick, never free text
**Options** free-text values · a closed list per field.
**Choice** each admissions field carries its own list of values, and the editor offers only those.
**Why** this is the payoff of the field vocabulary in `01`: because the product knows Term fee status
is Not applicable / Pending / Paid / Failed / Overdue, the condition editor can be right by default
instead of inviting a typo that silently never matches. It also removed a real defect — the branch editor had a free-text
fallback input that could not be reached, because every field has a list.
**Trade-off** a school with a stage the vocabulary lacks is stuck until the list is extended, so a
custom-field escape hatch is needed eventually.
**Revised** the rule holds for *status* fields, which is what it was written about. Overdue day
counts are numbers compared with `more than` / `less than` (→ D-33).

### D-24 · One screen, not a product shell
**Options** the full SaaS shell (product nav, workflow list, create-workflow screen, builder) · the
builder alone.
**Choice** a single screen: node types on the left, the diagram in the middle, parameters on the
right, stage tabs across the top.
**Why** Round 2 is judged on whether the admission journey has been understood and turned into
nodes and configuration. A list screen, a create wizard and a product nav demonstrate none of that
and consume the reviewer's attention. The diagram is the deliverable.
**Trade-off** it costs the templates idea, and it means the prototype cannot show how a school finds
a workflow in the first place, or answers "which of my fifteen are live?" at a glance. The lifecycle
was the third casualty and has since been recovered — it sits on the builder header instead of on a
list (→ D-10), which works for one workflow at a time and not for the portfolio.

### D-25 · Fee adjustment is its own node, and it can require approval
**Options** treat a concession as a status value and let finance apply the money by hand · a
percentage field on the payment email · a dedicated Adjust fee node.
**Choice** an Adjust fee node carrying the concession category, the fee head it applies to, a
percentage *or* a fixed amount, an optional approval gate naming who signs it off, and how long it
holds.
**Why** this is the only node that moves money, and three details make it more than a discount field.
It names the **fee head**, because a 50% staff concession on tuition is not 50% off transport, and a
node that overstates the reduction gets corrected by hand — which defeats the automation. It supports
**percentage or amount**, because merit awards are proportional and a discretionary allowance is
usually a negotiated figure. And it can **hold for approval**, because a concession is money leaving
the school: a workflow that grants ₹40,000 with nobody's name against it is a governance hole, not an
efficiency. The approval is a property of this node rather than a separate task, so the money and the
authority for it cannot drift apart.
**Trade-off** the prototype cannot show any of it working — nothing executes, so approval is a label
and the arithmetic is a summary string. It also raises fee *structure* (heads, instalments, late
fees), which this product does not model at all yet.

### D-26 · The workflow routes on a claimed concession; it does not decide eligibility
**Options** encode eligibility rules in the branch (income thresholds, merit cut-offs) · route on
what the family claimed and let a human decide.
**Choice** `Fee concession` is claimed data. The workflow branches on the claim, collects the
evidence, and applies the figure once someone with authority approves it.
**Why** merit-cum-need aid is a judgement about documents and family circumstances, and a school that
automates the judgement inherits the fairness argument for it. Automating the *chase* — verify the
income proof, get the Principal's sign-off, send the revised schedule — is where the time actually
goes, and it leaves the decision with the person who is accountable for it. Faculty-family concession
is the exception that proves the rule: it needs no evidence, so its path has no verification task.
**Trade-off** a school wanting automatic slab-based concessions (income band → percentage) cannot
express it. That needs a rules table, not a branch, and it is a bigger product than this round.

### D-27 · A student is registered after payment, not after acceptance
**Options** register on offer acceptance and chase the fee afterwards · hold the seat provisionally
and register on payment · take the fee before issuing the offer.
**Choice** acceptance puts the applicant in a **Provisional** state and holds the seat; the status
becomes **Confirmed** — and the class section and house are allotted — only when *Payment received*
fires.
**Why** an accepted offer is an intention, and families do back out. Registering on acceptance makes
the records claim a seat is taken when it is not, and every downstream act compounds it: a class list
with a name that never joins, a seat the system believes is gone. Behind payment, the only committed
students are the ones who paid, and unpicking a lapse costs nothing because nothing was allotted.
**Revised** the principle is *do not allot a seat until the gating fee is paid* — not *payment always
precedes registration*. Which fee gates enrolment, and where it sits in the journey, is the school's
choice (→ D-30).
**Trade-off** an applicant now sits in a state that is neither rejected nor enrolled, and reporting
has to understand it — "how many students do we have" gets two answers, provisional and confirmed.
It also splits one workflow into two, on two different triggers.

### D-28 · A released seat is an event, and the waitlist loop is that event firing again
**Options** a loop node · a scheduled job that sweeps the waitlist · treat each released seat as an
event that starts the promotion workflow.
**Choice** the event. *Seat released* fires when an offer expires, is declined, a provisional hold
lapses, **or a registered student withdraws** — a seat freed in July is worth backfilling exactly as
much as one freed in March, and a promoted family clears the same admission-fee checkpoint as
everyone else rather than being fast-tracked. The promotion workflow calls the next waitlisted family, and if that offer expires it sets
*Offer status → Expired*, which releases the seat again — so the workflow re-triggers for the family
after them.
**Why** each promotion is a separate journey for a different applicant, not an iteration — so an
event is the right shape, and no loop construct is needed.
**Trade-off** it only works if an applicant pool can enter the workflow more than once, which makes
re-entry control (→ D-14) a **dependency** rather than a refinement — the loop silently runs once and
stops without it. That promotes re-entry to the top of the build list alongside the lifecycle.

### D-29 · The intake carries a status, and it guards the promotion
**Options** a numeric "seats remaining" compared in the branch · a status the school maintains ·
no guard at all.
**Choice** an **Intake status** of Open · Full · Closed, checked at the top of the promotion
workflow. *Closed* means the confirmation deadline for the session has passed.
**Why** without a guard the workflow keeps calling families after the seats are full, or after the
deadline when it can no longer honour an offer — both worse than doing nothing. A status also matches
how a school talks about it: the intake is open, full, or closed.
**Trade-off** something has to keep Intake status current — a seat count crossing zero, a date
passing — and this product does not model either. Right now it is a field a human maintains, which is
exactly the kind of manual step automation is supposed to remove. Named as an open question in `07`.

### D-30 · Where a fee sits is the school's choice, not the product's
**Options** fix the sequence (fee then decision, or decision then fee) · a setting per school · make
the fee a workflow like any other, hung off whichever trigger the school's journey uses.
**Choice** the third. There is no payment *step* baked into the journey; there are fee workflows, and
the trigger one starts from is the configuration.
**Why** the word is overloaded in the market, which is the tell. **GIIS Bangalore** takes the
registration fee "while submitting the admission form", with admission and term fees after
confirmation — *before* any decision. **St Pauls College** lists "Registration Fee Payment" after
accepting the offer, issuing the admission letter "upon payment confirmation" — same name, *after*
the decision. Hard-code either and you are wrong for half the market, with no way for the school to
fix it. No new machinery was needed: workflow 3 hangs off *Application submitted*, 8 off *Offer
accepted*, 12 off *Applicant enrolled*.
**Trade-off** nothing stops a school configuring two fee checkpoints that contradict each other, and
the product cannot warn about it — validation is per node, not per journey. A "review the journey"
check, above the level of a single workflow, is the missing piece.

### D-31 · Named fee statuses, not one generic payment status
**Options** one `Payment status` · a status per fee type · a fee ledger the workflow queries.
**Choice** `Registration fee status`, `Token fee status`, `Admission fee status`, `Term fee status` —
each Not applicable · Pending · Paid · Failed · Overdue.
**Why** "payment is pending" cannot say *which* fee, and the consequence differs entirely: an unpaid
registration fee holds up a review, an unpaid token fee lapses a provisional hold, an unpaid
admission fee releases a seat, an unpaid term fee is a finance matter for a student already in class.
*Not applicable* is what lets a school switch a checkpoint off without deleting the workflow.
**Trade-off** four fields to keep straight instead of one, and a fifth arrives the day a school adds
a transport or hostel fee — this wants a fee *type* dimension eventually rather than a field per fee.
The generic `Payment status` is superseded and gone, so the workflows that read it had to be
re-pointed.
**Revised** the entry originally named three statuses; the token fee (→ D-34) made it four, which is
the trade-off arriving sooner than the entry expected.

### D-32 · A failed payment is not an unpaid one
**Options** one "not paid" condition · separate *Failed* from *Pending* · a retry count.
**Choice** *Failed* is its own status value and its own trigger, and it routes to "try another
method" plus a task for finance to help — not to the chase-the-money ladder.
**Why** a declined card is a family who *tried*. Escalating at them as though they were ignoring the
fee is what makes software feel hostile, and it spends a counsellor on a technical problem.
**Trade-off** the prototype cannot tell a hard decline from a temporary gateway failure, which is the
distinction that decides whether "try again" is even useful advice.

### D-33 · Numeric operators, for overdue day counts only
**Options** keep the four equality operators and model overdue as a status · add numeric comparison.
**Choice** add `more than` and `less than`, valid on the three overdue day-count fields.
**Why** "overdue by more than three days" is how schools reason, and an *Overdue* status loses the
number — three days late and thirty days late need different responses. This reverses the earlier
judgement (→ D-29) that numeric operators were a poor trade for a single branch; there are now
several.
**Trade-off** two operator families in one picker, and only some fields accept the numeric ones, so
the editor has to disable what does not apply. It also opens the door to arithmetic conditions the
product has no appetite for.

### D-34 · A token fee is a commitment device, and it is non-negotiable
**Options** take the full admission fee at acceptance · take nothing until the final bill · take a
small token that is credited later.
**Choice** a small token fee at offer acceptance: fixed, non-negotiable, non-refundable, credited
against the final bill if the student registers, retained if they walk away.
**Why** acceptance is free, so it is cheap to say yes to several schools and decide later — the
behaviour that leaves seats empty at the deadline. A token converts an intention into a small
irreversible act without asking families to fund a decision they have not finished making, and it
prices what the school gives up: a held seat. It is **non-negotiable** because a discount on a
commitment device destroys the commitment, and because it is a deposit against a seat rather than a
charge for services.
**Trade-off** it puts a payment step before the family knows their discounted total, which is a real
ask; the mitigation is that the token is small, credited, and the confirmation email says both. A
school that finds it hostile can set *Token fee status* to Not applicable and the workflow ends on
its first branch (→ D-30).

### D-35 · A concession can never target the token
**Options** allow it and rely on policy · exclude the token from the fee heads a concession can
reduce.
**Choice** exclude it. The Adjust fee node does not offer Token fee as a concession target at all.
**Why** the rule is only real if the product enforces it: a handbook line is negotiated away on a
phone call, an option that does not exist is not. The vocabulary is where policy gets encoded
(→ D-23).
**Trade-off** a school with a genuine reason to waive a token — a hardship case at the point of
acceptance — has no way to express it and must handle it outside the system. That is a real
limitation, and the honest fix is a separate "waive token" act with its own approval, not a
concession.

### D-36 · The concession window sits between the token and the final bill
**Options** apply for a concession with the application · after acceptance, before the final bill ·
after the final bill, as a correction.
**Choice** the window opens when the token clears and closes when the final bill is raised.
**Why** both sides need that order. The family needs the discounted number before committing to the
full amount, which rules out a window after the bill. The school needs the token before a counsellor
and a Principal assess income documents, which rules out a window at application. The token buys the
assessment; the assessment produces the bill.
**Trade-off** it adds a wait to the critical path: the final bill cannot be raised until the
concession is decided. Mitigated by firing *Concession decided* immediately when nothing was
claimed, so the common case is not slowed by the exception. This resolves what was an open question
in `07`.

### D-37 · The token is credited by the same node that grants concessions
**Options** a separate Credit node · a field on the payment email · an adjustment kind on Adjust fee.
**Choice** Adjust fee gains an **adjustment kind** — *Concession* reduces, *Credit* deducts money
already received.
**Why** both are the same act from the workflow's point of view — something changes what the family
owes — and it should be visible on the canvas. One node means the final bill is derivable by reading
the diagram rather than being an opaque output of a billing system.
**Trade-off** this product does not own the ledger. The node states an intent that a finance system
must honour, and if the two disagree the diagram is the one that is wrong. That boundary needs
defining in Round 3 and is now an open question.

### D-38 · On withdrawal the school keeps the token and refunds the rest — as a task
**Options** automate the refund · raise a finance task · say nothing and let finance notice.
**Choice** set *Refund status → Due*, create a task for finance to refund the balance and retain the
token, email the family the breakdown, and release the seat.
**Why** the token's bargain has two halves, and a product implementing only the first is
untrustworthy. It is a **task** rather than a payout because moving money out is the one action where
a wrong automation is unrecoverable — and in a prototype that executes nothing, an automated refund
would be the most dangerous fake in it.
**Trade-off** a manual step in a flow that is otherwise automatic, and the refund's timeliness now
depends on someone clearing a task queue. The email to the family is what makes the delay visible
rather than silent.

### D-39 · A fan-out is always a Branch or a Parallel, never an accident
**Options** let any node take a second child, and read the fan-out as parallel · a dedicated Parallel
node, with every other node limited to one successor · allow only Branch to fan out.
**Choice** two container kinds — **Branch** routes down one path, **Parallel** runs all of them — and
nothing else may have more than one child. Each always has at least two.
**Why** the first option was what shipped, and it had a defect that made the case on its own:
inserting a step into a linear chain appended it as a sibling, so asking for *A → new → B* produced
*A → (B, new)*. Every `+` called the same append, and there was no way to say "in the middle". The
deeper problem is that the resulting shape carried no meaning: two children under an Email node
might be a deliberate fan-out or a mis-click, and the diagram could not tell you which. Naming the
two containers makes the tree self-describing — a node with two children below it always states
whether it meant *one of these* or *all of these*. Restricting fan-out to Branch alone was rejected
because it deletes a capability rather than relocating it: five workflows send to the family *and*
the school, and a branch means the applicant takes one path, not both.
**Trade-off** one more node type to learn, and a two-step edit where there used to be one — adding a
parallel step now means adding a Parallel and then filling its paths. That is the cost of the shape
meaning something. Two smaller bugs fell out of the same fix: inserting a container left it with a
single path, and inserting above a branch path carried the path's label but dropped its condition,
silently turning a configured path into the fallback.
**Revised** this reverses the original model, in which any node could fan out and `03` listed
"parallel paths" as a property of the canvas rather than a node.
