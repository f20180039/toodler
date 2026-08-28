# 06 · Decision log

**Answers:** why the product looks like this, what else was considered, and what each choice costs.
**Read after:** anything that cross-referenced a `→ D-nn`.

Every entry has the same shape: options, choice, why, trade-off. The trade-off line is not
decoration — each choice gives something up. Five entries carry a **Revised** line: the prototype
contradicted the original call, and the change of mind is recorded rather than quietly edited out.

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
**Why** all nine workflows have exactly one entry event. Multi-trigger raises "what if an applicant
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

### D-10 · Draft / Active / Paused — designed, not built
**Options** a simple on/off toggle · three states plus an explicit review before activation.
**Choice** the three states with a review step remain the right design, and the prototype does not
implement them.
**Why** the argument stands: a misconfigured fee reminder to three hundred families cannot be
recalled, so activation should be a deliberate step showing what is about to happen, and Pause
exists because the response to an incident is "stop it now". What changed is scope — the prototype
narrowed to a single builder screen (D-24), and lifecycle lives on the workflow *list*, which no
longer exists.
**Trade-off** the most likely interview question — "what stops you emailing three hundred families
by mistake?" — has a designed answer but nothing on screen to point at. Highest-value thing to build
next.
**Revised** the original entry read as though the states were implemented.

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
automate anything. Named fields also let us pre-fill defaults — a payment workflow
arrives with `Payment status = Pending` set.
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

### D-14 · Re-entry control — designed, not built
**Options** always re-enter · never re-enter · a re-entry setting on the trigger.
**Choice** the setting (once only by default, once per academic year, every time) is still the right
model; the trigger panel currently configures event, grade and academic year only.
**Why** the reasoning holds — applicants re-apply the following year, families enquire again for a
sibling, and the failure mode of the alternative is duplicate reminders to a family that already
paid. It was cut from the build because re-entry is a *run-time* rule and the prototype does not run
anything, so the control would have been a dropdown with no observable meaning.
**Trade-off** the academic-year filter on the trigger hints at the scoping but does not deliver it.
**Revised** the original entry described the control as part of the trigger configuration.

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
**Why** this is the payoff of the field vocabulary in `01`: because the product knows Payment status
is Pending / Partial / Paid, the condition editor can be right by default instead of inviting a typo
that silently never matches. It also removed a real defect — the branch editor had a free-text
fallback input that could not be reached, because every field has a list.
**Trade-off** a school with a stage the vocabulary lacks is stuck until the list is extended, so a
custom-field escape hatch is needed eventually.

### D-24 · One screen, not a product shell
**Options** the full SaaS shell (product nav, workflow list, create-workflow screen, builder) · the
builder alone.
**Choice** a single screen: node types on the left, the diagram in the middle, parameters on the
right, stage tabs across the top.
**Why** Round 2 is judged on whether the admission journey has been understood and turned into
nodes and configuration. A list screen, a create wizard and a product nav demonstrate none of that
and consume the reviewer's attention. The diagram is the deliverable.
**Trade-off** it costs the lifecycle story (D-10) and the templates idea, and it means the prototype
cannot show how a school finds a workflow in the first place. Both are stated rather than hidden.
