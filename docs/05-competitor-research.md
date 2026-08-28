# 05 · Competitor research

**Answers:** what the established builders actually support, and which of it we should provide.
**Read after:** `04-node-configuration.md`.

Products reviewed: **HubSpot** workflows, **ActiveCampaign** automations, **Mailchimp** automation
flows (Customer Journey Builder), and admissions-specific CRMs (**Meritto / NoPaperForms**,
**Salesforce Education Cloud**). All claims were checked against vendor documentation in
August 2026 (sources at the end). The admissions-CRM column is marketing-page detail, not product
documentation, so it reads *typical* rather than verified. One caveat to carry into the interview:
ActiveCampaign's help centre blocks automated access, so its rows come from indexed summaries of the
linked pages rather than from the pages themselves — worth confirming in-app before quoting its
numbers.

## Capability comparison

| Capability | HubSpot | ActiveCampaign | Mailchimp | Admissions CRMs | **Toddle MVP** |
|---|---|---|---|---|---|
| Multiple entry triggers | Yes | Yes | Up to 3 (Standard+) | Typical | **No — one trigger** (→ D-02) |
| Filters on the trigger | Yes | Yes (segment builder) | Up to 5 per trigger | Typical | **Yes** — grade and academic year |
| Duration delay | Yes — "set amount of time" | Yes | Yes — "time delay" | Typical | **Yes** |
| Wait until a date / date property | Yes — calendar date, date property | Yes — specific day/time, custom date field | Not a named rule | Typical | **Yes** |
| Wait relative to a date ("24h before") | Via a date-property delay | Via date-based triggers and actions | — | Typical | **No** — expressed as a duration from the trigger (→ D-04) |
| Wait until an event or condition | Yes — "event occurrence" | Yes — "wait until conditions are met", with a time limit | Yes — "Wait for Trigger" | Partial | **Yes**, with a maximum wait |
| Weekday / time-of-day / weekend control | Yes — "Business days only (Monday - Friday)", day-of-week and time-of-day delays | Date and time conditions | — | — | **Yes — exclude weekends** (→ D-05) |
| Binary Yes / No branch | Yes — if/then, with a "None met" path | Yes — If/Else, Yes and No paths | Yes — conditional split, up to 5 conditions | Typical | **Yes** |
| AND / OR inside one branch | Yes — if/then, up to 20 branches | Yes — segment builder | Multiple conditions per split | Typical | **No** — one field per branch, one condition per path |
| N-way / value-based split | Yes — up to 250 branches on one property | Via nested If/Else | No | Partial | **Yes** — two or more paths, each with its own condition (→ D-03) |
| Numeric comparison in a condition | Yes | Yes | No | Varies | **Yes** — `more than` / `less than`, on the overdue day counts only (→ D-33) |
| Random / percentage split | Yes — Marketing Hub Pro+, needs ≈1,000 records | Yes | Yes — percentage and 50/50 | Rare | **Not doing** — cohorts are too small to mean anything (→ D-06) |
| Create an internal task | Yes — "Create task" | Yes — "Add a deal task" | No | Yes — counsellor follow-ups | **Yes** |
| Internal notification | Yes — in-app, internal email, Slack | Partial | No | Typical | **Yes** |
| Update a record field | Yes — "Edit record" | Yes | Yes — "Update contact" | Typical | **Yes** — update status, and allocate house / section |
| Re-entry / re-enrolment control | Yes — off by default | Yes | Yes | Typical | **Yes** — once only, once per year, or every time (→ D-14) |
| Draft / Active / Paused states | Yes | Yes | Yes — Draft, Active, Paused | Typical | **Yes** — three states, with a review before activation (→ D-10) |
| SMS / WhatsApp | Yes / partial | Yes | SMS, with an approved programme | Yes — the primary channel in India | **Deferred** (→ D-16) |
| Webhook / custom code | Yes | Yes | Yes | Varies | **Not doing** (→ D-16) |
| Parallel steps from one node | Yes | Yes | Yes | Typical | **Yes** — drawn side by side |
| Delivery retry on a message | Partial | Partial | — | Varies | **Yes** — attempts and interval (→ D-21) |
| House / class allocation | No | No | No | Yes | **Yes** — balanced or sibling-matched (→ D-18) |
| Waitlist backfill on a released seat | No | No | No | Yes — core to seat management | **Yes** — event-driven, deadline-guarded (→ D-28) |
| Provisional hold before registration | No | No | No | Typical | **Yes** — register on payment (→ D-27) |
| Token / deposit credited against a later bill | No | No | No | Varies — some handle it as an advance | **Yes** — credit adjustment on the same node (→ D-34, D-37) |
| Refund on withdrawal | No | No | No | Typical | **Yes** — token retained, balance refunded as a finance task (→ D-38) |
| Fee types tracked separately | No — no notion of a fee | No | No | Yes — registration, admission and term fees are distinct | **Yes** — four named fee statuses (→ D-31) |
| Payment failed vs unpaid | Not applicable | Not applicable | Not applicable | Varies | **Yes** — separate status and trigger (→ D-32) |
| Fee position configurable in the journey | Not applicable | Not applicable | Not applicable | Varies by product | **Yes** — the trigger is the configuration (→ D-30) |
| Fee concession / discount | No — no notion of a fee | No | No | Yes — scholarships and staff concessions are standard | **Yes** — category, fee head, % or amount, approval gate (→ D-25) |
| Linkable diagram (URL state) | Yes | Yes | Yes | Varies | **Yes** — `?flow=…&step=…` (→ D-22) |

Five observations drove scope more than the feature counts:

0. **"Registration fee" means two different things in this market.** GIIS Bangalore takes it *while
   submitting the admission form*, before any decision; St Pauls College takes it *after the offer is
   accepted*, and issues the admission letter on payment confirmation. Two schools, one term, two
   milestones — which is why the product treats a fee as a workflow hung off a trigger rather than as
   a step in a fixed sequence (→ D-30).
1. **None of the generic tools know what a fee is.** HubSpot, ActiveCampaign and Mailchimp can send a
   payment reminder but have no concept of a fee head, a concession or an approval on money — so a
   school running merit-cum-need aid through them keeps that in a spreadsheet regardless. The
   admissions CRMs do handle it, which is the clearest signal that it belongs in the product rather
   than in the "nice to have" pile.
2. **The generic tools are property-driven.** A school adopting HubSpot must first model applicants,
   grades and document status as custom contact properties. That modelling work is the gap we
   close by shipping `01`'s vocabulary as first-class fields (→ D-12).
3. **Delay sophistication, not branching sophistication, is where admissions lives.** HubSpot ships
   six delay types; we need five of the same ideas. Its branching goes to 250 paths; the widest
   branch we need is four.
4. **The admissions CRMs already do the work half** — counsellor assignment, document verification,
   interview panel allocation, fee follow-up. That is the shape of the deferred list in `03`, and it
   confirms tasks and notifications belong in the MVP.

## Functionality we should provide

**MVP — built.** One filtered trigger from fifteen admissions events, with a re-entry rule · send
email to a recipient *role*, with delivery retry · create task · notify team · update status ·
allocate house and class section · adjust a fee, as a concession or as a credit, with an approval
gate · a branch with two or more labelled paths, an explicit fallback, and numeric comparison on the
overdue day counts · three delay types with weekend exclusion · parallel steps drawn side by side ·
configuration summaries on every node · advisory validation, enforced at activation · Draft / Active
/ Paused with a review before anything goes live · undo and redo · linkable diagrams · fifteen
workflows across the journey stages plus inter-branch transfer (see `README.md`).

**Next — designed for, not built.** WhatsApp and SMS, the channel parents actually reply on · a
template library so a school never starts from a blank canvas · academic-calendar awareness on
delays, so vacations are excluded the way weekends are · waiting relative to a date field (→ D-04) ·
a workflow *list*, which is where lifecycle normally lives and where "which of my fifteen are live?"
gets answered (→ D-10, D-24) · per-workflow analytics on the canvas.

**Explicitly not doing.** Random / A/B split as an admissions feature — cohorts are too small for it
to mean anything (→ D-06) · webhooks and custom code, wrong audience for a school administrator ·
AND / OR across several fields in one branch, until a workflow needs it · multi-trigger workflows
until the execution semantics are settled (→ D-02) · any part of the execution engine, which the
brief places out of scope (→ D-16).

## Sources

**HubSpot** · [Use delays in your workflows](https://knowledge.hubspot.com/workflows/use-delays) ·
[Use branches in workflows](https://knowledge.hubspot.com/workflows/use-if-then-branches-in-workflows) ·
[Set your workflow enrollment triggers](https://knowledge.hubspot.com/workflows/set-your-workflow-enrollment-triggers) ·
[Add re-enrollment triggers](https://knowledge.hubspot.com/workflows/add-re-enrollment-triggers-to-a-workflow) ·
[Choose your workflow actions](https://knowledge.hubspot.com/workflows/choose-your-workflow-actions)

**ActiveCampaign** · [Configure the "Wait" automation action](https://help.activecampaign.com/hc/en-us/articles/18125306552220-Configure-the-Wait-automation-action) ·
[Automation actions explained](https://help.activecampaign.com/hc/en-us/articles/218251828-Automation-actions-explained) ·
[Automation triggers explained](https://help.activecampaign.com/hc/en-us/articles/218788707-Automation-triggers-explained) ·
[Date and time conditions in automations](https://help.activecampaign.com/hc/en-us/articles/360021809280-Date-and-Time-conditions-in-automations)

**Mailchimp** · [About marketing automation flows](https://mailchimp.com/help/about-customer-journeys/) ·
[Use conditional split rules](https://mailchimp.com/help/use-if-else-rules/) ·
[Use wait for trigger rules](https://mailchimp.com/help/use-wait-for-trigger-rules/) ·
[Use percentage split rules](https://mailchimp.com/help/use-percentage-split-rules/)

**School admission processes — where the fee actually sits** ·
[GIIS Bangalore admissions process](https://globalindianschool.org/bangalore/admissions/admissions-process/)
and [fees](https://globalindianschool.org/bangalore/admissions/fees/) — registration fee at form
submission, admission and term fees after confirmation ·
[St Pauls College Bengaluru admissions](https://landingblr.stpaulscollege.edu.in/admission/) —
offer letter, accept, Registration Fee Payment, then enrolment on payment confirmation.
*(The GIIS page blocks automated fetching; its fee timing was confirmed through its indexed fees
page rather than read directly.)*

**Admissions-specific** · [Meritto education CRM for admissions teams](https://www.meritto.com/education-crm-for-admission-management-teams/) ·
[Salesforce Education Cloud](https://www.salesforce.com/education/cloud/) ·
[Salesforce Help — Recruitment and Admissions](https://help.salesforce.com/s/articleView?id=sfdo.EC_Recruit_Students_to_Your_Institution_2.htm&language=en_US&type=5)
