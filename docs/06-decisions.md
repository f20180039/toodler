# 06 · Decision log

**Answers:** why the product looks like this, what else was considered, and what each choice costs.
**Read after:** anything that cross-referenced a `→ D-nn`.

Every entry has the same shape: options, choice, why, trade-off. The trade-off line is not
decoration — each choice gives something up.

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
**Why** all five workflows have exactly one entry event. Multi-trigger raises "what if an applicant
qualifies twice?" — dedupe and re-entry semantics belonging to the execution engine, out of scope
this round.
**Trade-off** "enquiry created OR enquiry marked hot" needs two workflows. Cheap to lift later — the
trigger is already filter-based.

### D-03 · Binary Yes/No branch, N-way deferred
**Options** HubSpot's three branch types (single-property up to 250 paths, if/then AND/OR up to 20
paths, percentage) · ActiveCampaign's single If/Else.
**Choice** one binary branch with AND/OR conditions inside it.
**Why** every admissions question in `02` is a yes/no check on state — submitted, complete,
attended, paid. N-way branching costs canvas-layout work and buys the five workflows nothing.
**Trade-off** routing by grade to five counsellors needs nested branches until value-based split
ships.

### D-04 · Five delay types, including relative-to-date
**Options** one duration delay · duration plus until-date · the five listed in `03`.
**Choice** five.
**Why** admissions is date-anchored: interview slots, fee deadlines, term start. "24 hours before
the interview" is the most common school reminder and cannot be expressed as a duration.
Wait-until-event matters for the opposite reason — Workflow 3 *stops* the moment documents arrive
instead of nagging a family who already complied.
**Trade-off** more configuration surface than "wait N days"; mitigated by defaulting to duration and
the plain-language node summary (→ D-07).

### D-05 · Weekend exclusion on delays
**Options** ignore calendars · exclude weekends · full academic-calendar awareness.
**Choice** exclude weekends now, on by default for delays of a day or more; calendar awareness next.
**Why** a Thursday plus three days drops a parent-call task on Sunday, when the school is shut; it
rots until Monday. HubSpot's "Business days only" option exists for the same reason.
**Trade-off** a partial fix — weekends yes, Diwali and summer break no, and Indian schools have long
vacations.

### D-06 · Random / A/B split labelled Future, not shipped
**Options** ship it · omit it · show it labelled.
**Choice** show it in the library, labelled Future.
**Why** a grade intake is tens to low hundreds of applicants — HubSpot wants roughly a thousand
records for its percentage split to distribute evenly, so a split test here measures noise.
Splitting a fee-instruction email across variants is a bad idea besides. Leaving it visible keeps
faith with the brief's marketing use case.
**Trade-off** marketing-led schools running campaigns to large enquiry lists will want it early.

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

### D-10 · Draft / Active / Paused, with a review step before activation
**Options** a simple on/off toggle · the three states plus an explicit review.
**Choice** three states, and activation shows a summary of what will happen before it commits.
**Why** Mailchimp uses the same three states, but the stake is higher: a misconfigured fee reminder
to three hundred families cannot be recalled, and costs reputation rather than unsubscribes. Pause exists because the response to an incident is "stop it now", not "delete it".
**Trade-off** one more click before going live.

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

### D-14 · Re-entry control on the trigger, single entry by default
**Options** always re-enter · never re-enter · a re-entry setting.
**Choice** a setting: once only (default), once per academic year, every time.
**Why** applicants legitimately re-apply the following year, and a family may enquire again for a
sibling. HubSpot's default — records enrol only the first time — is the safe one; the alternative's
failure mode is duplicate reminders to a family that already paid. Scoping re-entry by academic year
makes next year's application a fresh journey.
**Trade-off** subtle semantics, easy to misconfigure; the panel states the consequence in plain
words rather than naming the mode.

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
