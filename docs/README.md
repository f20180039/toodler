# Admissions Workflow Builder — Round 2 documentation

**Answers:** what is in this folder, and what order to read it in.
**Read after:** `../PRD.txt` (the assignment brief).

Round 2 asks for two things. A prototype showing workflows, nodes and configuration, and competitor
research saying what the product should offer. This folder is the written half.

It is also the spec the prototype was built from. The node taxonomy and the configuration fields
were settled here before any UI existed.

## Read in this order

| #   | Document                                                 | Answers                                                                  |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | [`01-admission-journey.md`](01-admission-journey.md)     | What happens at each stage, and the field vocabulary every node reuses   |
| 2   | [`02-workflow-use-cases.md`](02-workflow-use-cases.md)   | The fifteen workflows, and what each one forces into the product         |
| 3   | [`03-node-library.md`](03-node-library.md)               | Which nodes we build with, which are deferred, and the rule that decided |
| 4   | [`04-node-configuration.md`](04-node-configuration.md)   | What each node needs configured, field by field                          |
| 5   | [`05-competitor-research.md`](05-competitor-research.md) | What HubSpot, ActiveCampaign, Mailchimp and admissions CRMs do           |
| 6   | [`06-decisions.md`](06-decisions.md)                     | Every judgement call: options, choice, reasoning, cost                   |
| 7   | [`07-prototype-scope.md`](07-prototype-scope.md)         | What the prototype does, what it does not, and what Round 3 must settle  |

Documents 1 to 4 build one argument in order: journey, then use cases, then nodes, then
configuration. Document 5 tests that argument against the market.

Document 6 holds the reasoning. The other documents point at it with `→ D-nn` rather than repeating
it.

## What is live

Everything described in these documents is built. The fee sequence was worked out after the first
build and has since been added, so nothing here describes a screen that does not exist.

| #   | Workflow                            | Stage        | Steps | State on load |
| --- | ----------------------------------- | ------------ | ----- | ------------- |
| 1   | New enquiry follow-up               | Enquiry      | 8     | Active        |
| 2   | Application acknowledgement         | Application  | 10    | Active        |
| 3   | Registration fee at submission      | Application  | 13    | Active        |
| 4   | Application review & shortlisting   | Review       | 10    | Active        |
| 5   | Missing documents reminder          | Review       | 9     | Active        |
| 6   | Decision & offer                    | Decision     | 17    | Active        |
| 7   | Interview reminder                  | Decision     | 9     | Active        |
| 8   | Token fee & seat hold               | Registration | 17    | Active        |
| 9   | Final bill & payment                | Registration | 16    | Active        |
| 10  | Enrolment & allocation              | Enrolment    | 11    | Active        |
| 11  | Waitlist promotion                  | Decision     | 14    | Draft         |
| 12  | Term fee reminder                   | Payment      | 10    | Paused        |
| 13  | Concession application & assessment | Payment      | 17    | Draft         |
| 14  | Withdrawal & refund                 | Enrolment    | 9     | Draft         |
| 15  | Inter-branch transfer request       | Transfer     | 16    | Active        |

The numbering is `02`'s. It follows the fee sequence rather than the stage tabs. Workflow 11
backfills a seat released by 6, 8, 9 or 14, so it reads after them even though it sits on the
Decision tab.

**State on load** is the lifecycle, not a caveat. Every workflow is Draft, Active or Paused. The
seed data starts three as drafts and one as paused so that all three states are visible. Activating
any of them opens the review step (→ D-10).

## What changed along the way

Three workflows were rewritten when the fee sequence arrived:

- **Decision & offer** now releases the seat when an offer lapses.
- **Enrolment & allocation** is triggered by payment, not by acceptance.
- **Term fee reminder** reads *Term fee status* instead of a generic payment status.

Nine decisions in `06` carry a **Revised** line. Those record a change of mind rather than hiding
it, and they are the most useful entries to read.

## Out of scope, throughout

Workflow *execution* is outside the assignment. There is no engine, no scheduling, no sending, no
backend and no persistence. Everything here describes how a workflow is **created** (→ D-16).
