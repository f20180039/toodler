# Admissions Workflow Builder — Round 2 documentation

**Answers:** what is in this folder, and in what order to read it.
**Read after:** `../PRD.txt` (the assignment brief).

Round 2 asks for a prototype showing workflows, nodes and configurations, plus competitor research
listing the functionality we should provide. This folder is the written half. It doubles as the spec
the prototype is built from: the node taxonomy and configuration were settled here first, before any
UI existed.

## Read in this order

| # | Document | Answers |
|---|---|---|
| 1 | [`01-admission-journey.md`](01-admission-journey.md) | What the admission journey is, where automation actually pays off, and the field vocabulary every node reuses |
| 2 | [`02-workflow-use-cases.md`](02-workflow-use-cases.md) | The fifteen workflows, and what each one forces into the product |
| 3 | [`03-node-library.md`](03-node-library.md) | Which nodes the prototype builds with, which are deferred, and the rule that decided |
| 4 | [`04-node-configuration.md`](04-node-configuration.md) | What each node needs configured — field-level reference |
| 5 | [`05-competitor-research.md`](05-competitor-research.md) | What HubSpot, ActiveCampaign, Mailchimp and admissions CRMs do, cited; then the functionality we should provide |
| 6 | [`06-decisions.md`](06-decisions.md) | Every judgement call, with the options considered, the reasoning and the trade-off |
| 7 | [`07-prototype-scope.md`](07-prototype-scope.md) | What the prototype does, what it deliberately does not, and the open questions for the Round 3 scope lock |

Documents 1–4 build the argument in one direction: journey → use cases → nodes → configuration.
Document 5 checks that argument against the market. Document 6 is where the reasoning lives —
the other documents cross-reference it as `→ D-nn` instead of repeating it.

## What is live

Everything in these documents is live in the prototype. The fee sequence was
worked out after the first build and has since been built; nothing here is a
description of something that is not on screen. One table, so nothing has to be
inferred:

| # | Workflow | Stage | Steps | State on load |
|---|---|---|---|---|
| 1 | New enquiry follow-up | Enquiry | 8 | Active |
| 2 | Application acknowledgement | Application | 9 | Active |
| 3 | Registration fee at submission | Application | 13 | Active |
| 4 | Application review & shortlisting | Review | 10 | Active |
| 5 | Missing documents reminder | Review | 9 | Active |
| 6 | Decision & offer | Decision | 16 | Active |
| 7 | Interview reminder | Decision | 8 | Active |
| 8 | Token fee & seat hold | Registration | 17 | Active |
| 9 | Final bill & payment | Registration | 16 | Active |
| 10 | Enrolment & allocation | Enrolment | 10 | Active |
| 11 | Waitlist promotion | Decision | 14 | Draft |
| 12 | Term fee reminder | Payment | 10 | Paused |
| 13 | Concession application & assessment | Payment | 17 | Draft |
| 14 | Withdrawal & refund | Enrolment | 9 | Draft |
| 15 | Inter-branch transfer request | Transfer | 15 | Active |

The numbering is `02`'s, which follows the fee sequence rather than the stage tabs — workflow 11
backfills a seat released by 6, 8, 9 or 14, so it reads after them even though it lives on the
Decision tab.

The **State on load** column is the lifecycle, not a caveat: every workflow is
Draft, Active or Paused, and the seed data starts three as drafts and one as
paused so all three states are on screen. Activating any of them opens the
review that stands between a draft and three hundred emails (→ D-10).

Three workflows changed when the fee sequence arrived, and the change of mind is
recorded rather than edited out: **Decision & offer** now releases the seat when
an offer lapses, **Enrolment & allocation** is triggered by payment rather than
by acceptance, and **Term fee reminder** reads *Term fee status* rather than a
generic payment status.

Seven decisions in `06` carry a **Revised** line. Those are the most useful
entries to read.

## Out of scope, throughout

Workflow *execution* is outside the assignment: no engine, no scheduling, no sending, no backend,
no persistence. Everything here describes the workflow **creation** experience (→ D-16).
