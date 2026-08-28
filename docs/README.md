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
| 2 | [`02-workflow-use-cases.md`](02-workflow-use-cases.md) | The nine workflows across the six journey stages, and which capability each one forces into the product |
| 3 | [`03-node-library.md`](03-node-library.md) | Which nodes the prototype builds with, which are deferred, and the rule that decided |
| 4 | [`04-node-configuration.md`](04-node-configuration.md) | What each node needs configured — field-level reference |
| 5 | [`05-competitor-research.md`](05-competitor-research.md) | What HubSpot, ActiveCampaign, Mailchimp and admissions CRMs do, cited; then the functionality we should provide |
| 6 | [`06-decisions.md`](06-decisions.md) | Every judgement call, with the options considered, the reasoning and the trade-off |
| 7 | [`07-prototype-scope.md`](07-prototype-scope.md) | What the prototype does, what it deliberately does not, and the open questions for the Round 3 scope lock |

Documents 1–4 build the argument in one direction: journey → use cases → nodes → configuration.
Document 5 checks that argument against the market. Document 6 is where the reasoning lives —
the other documents cross-reference it as `→ D-nn` instead of repeating it.

## Kept in step with the prototype

These documents describe the prototype as built at commit `3726f02`. Five decisions in `06` carry a
**Revised** line: the build contradicted the original call, and the change of mind is recorded rather
than edited out — the reversals are the most useful part of the set to read.

## Out of scope, throughout

Workflow *execution* is outside the assignment: no engine, no scheduling, no sending, no backend,
no persistence. Everything here describes the workflow **creation** experience (→ D-16).
