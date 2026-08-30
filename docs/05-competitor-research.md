# 05 · Competitor research

**Answers:** what the established builders support, and which of it we should provide.
**Read after:** `04-node-configuration.md`.

Products reviewed:

- **HubSpot** workflows
- **ActiveCampaign** automations
- **Mailchimp** automation flows (Customer Journey Builder)
- Admissions CRMs: **Meritto / NoPaperForms** and **Salesforce Education Cloud**

All claims were checked against vendor documentation in August 2026. Sources are at the end.

Two caveats to carry into the interview. The admissions-CRM column comes from marketing pages rather
than product documentation, so it reads *typical* rather than verified. And ActiveCampaign's help
centre blocks automated access, so its rows come from indexed summaries rather than the pages
themselves. Worth confirming in-app before quoting its numbers.

## Triggers and entry

| Capability              | HubSpot | ActiveCampaign | Mailchimp | Admissions CRMs | **Toddle**           |
| ----------------------- | ------- | -------------- | --------- | --------------- | -------------------- |
| Multiple entry triggers | Yes     | Yes            | Up to 3   | Typical         | **No, one** (→ D-02) |
| Filters on the trigger  | Yes     | Yes            | Up to 5   | Typical         | **Yes**              |
| Re-entry control        | Yes     | Yes            | Yes       | Typical         | **Yes** (→ D-14)     |

We take one trigger per workflow. All fifteen have exactly one entry event, and multi-trigger raises
dedupe questions that belong to an execution engine we are not building.

Re-entry offers once only, once per academic year, or every time.

## Waiting

| Capability                    | HubSpot             | ActiveCampaign      | Mailchimp | Admissions CRMs | **Toddle**                 |
| ----------------------------- | ------------------- | ------------------- | --------- | --------------- | -------------------------- |
| Duration delay                | Yes                 | Yes                 | Yes       | Typical         | **Yes**                    |
| Wait until a date             | Yes                 | Yes                 | Not named | Typical         | **Yes**                    |
| Wait until an event           | Yes                 | Yes, with a limit   | Yes       | Partial         | **Yes**, with a limit      |
| Wait relative to a date       | Via a date property | Via date conditions | —         | Typical         | **No** (→ D-04)            |
| Weekend / time-of-day control | Yes                 | Yes                 | —         | —               | **Weekends only** (→ D-05) |

HubSpot's "Business days only (Monday - Friday)" option exists for the same reason ours does. Waiting
*relative* to a date field is the clearest gap: we express "24 hours before the interview" as a
24-hour duration from the booking, which breaks for a slot booked months ahead.

## Logic

| Capability                   | HubSpot   | ActiveCampaign | Mailchimp | Admissions CRMs | **Toddle**                       |
| ---------------------------- | --------- | -------------- | --------- | --------------- | -------------------------------- |
| Binary Yes / No branch       | Yes       | Yes            | Yes       | Typical         | **Yes**                          |
| N-way split on one field     | Up to 250 | Via nesting    | No        | Partial         | **Yes** (→ D-03)                 |
| AND / OR inside one branch   | Up to 20  | Yes            | Yes       | Typical         | **No**                           |
| Numeric comparison           | Yes       | Yes            | No        | Varies          | **Overdue counts only** (→ D-33) |
| Parallel steps from one node | Yes       | Yes            | Yes       | Typical         | **Yes**                          |
| Random / percentage split    | Yes       | Yes            | Yes       | Rare            | **Not doing** (→ D-06)           |

HubSpot's percentage split needs roughly a thousand records to distribute evenly. A grade intake is
tens to low hundreds, so a split test here measures noise (→ D-06).

## Actions

| Capability                  | HubSpot       | ActiveCampaign | Mailchimp | Admissions CRMs              | **Toddle**             |
| --------------------------- | ------------- | -------------- | --------- | ---------------------------- | ---------------------- |
| Create an internal task     | Yes           | Yes            | No        | Yes                          | **Yes**                |
| Internal notification       | Yes           | Partial        | No        | Typical                      | **Yes**                |
| Update a record field       | Yes           | Yes            | Yes       | Typical                      | **Yes**                |
| Delivery retry on a message | Partial       | Partial        | —         | Varies                       | **Yes** (→ D-21)       |
| SMS / WhatsApp              | Yes / partial | Yes            | SMS       | The primary channel in India | **Deferred** (→ D-16)  |
| Webhook / custom code       | Yes           | Yes            | Yes       | Varies                       | **Not doing** (→ D-16) |

## Where admissions differs

This is the interesting table. The generic tools score No on almost every row, and the admissions
CRMs score Yes.

| Capability                           | HubSpot | ActiveCampaign | Mailchimp | Admissions CRMs | **Toddle**                     |
| ------------------------------------ | ------- | -------------- | --------- | --------------- | ------------------------------ |
| House / class allocation             | No      | No             | No        | Yes             | **Yes** (→ D-18)               |
| Fee types tracked separately         | No      | No             | No        | Yes             | **Four statuses** (→ D-31)     |
| Fee concession / discount            | No      | No             | No        | Yes             | **Yes** (→ D-25)               |
| Fee position configurable            | n/a     | n/a            | n/a       | Varies          | **The trigger is it** (→ D-30) |
| Payment failed vs unpaid             | n/a     | n/a            | n/a       | Varies          | **Separate** (→ D-32)          |
| Token credited against a bill        | No      | No             | No        | Sometimes       | **Yes** (→ D-34, D-37)         |
| Provisional hold before registration | No      | No             | No        | Typical         | **Yes** (→ D-27)               |
| Waitlist backfill on a released seat | No      | No             | No        | Core to it      | **Yes** (→ D-28)               |
| Refund on withdrawal                 | No      | No             | No        | Typical         | **As a task** (→ D-38)         |

## Product-level features

| Capability                   | HubSpot | ActiveCampaign | Mailchimp | Admissions CRMs | **Toddle**       |
| ---------------------------- | ------- | -------------- | --------- | --------------- | ---------------- |
| Draft / Active / Paused      | Yes     | Yes            | Yes       | Typical         | **Yes** (→ D-10) |
| Linkable diagram (URL state) | Yes     | Yes            | Yes       | Varies          | **Yes** (→ D-22) |

## Five observations that drove scope

**1. "Registration fee" means two different things in this market.** GIIS Bangalore takes it while
submitting the admission form, before any decision. St Pauls College takes it after the offer is
accepted, and issues the admission letter on payment confirmation. Two schools, one term, two
milestones. That is why we treat a fee as a workflow hung off a trigger rather than a step in a fixed
sequence (→ D-30).

**2. None of the generic tools know what a fee is.** HubSpot, ActiveCampaign and Mailchimp can send a
payment reminder, but they have no concept of a fee head, a concession, or an approval on money. A
school running merit-cum-need aid through them keeps it in a spreadsheet anyway. The admissions CRMs
do handle it, which is the clearest signal that it belongs in the product.

**3. The generic tools are property-driven.** A school adopting HubSpot must first model applicants,
grades and document status as custom contact properties. That modelling work is the gap we close by
shipping `01`'s vocabulary as first-class fields (→ D-12).

**4. Delay sophistication is where admissions lives, not branching sophistication.** HubSpot ships
six delay types and we need five of the same ideas. Its branching goes to 250 paths; the widest
branch we need is four.

**5. The admissions CRMs already do the work half.** Counsellor assignment, document verification,
interview panel allocation, fee follow-up. That is the shape of the deferred list in `03`, and it
confirms that tasks and notifications belong in the MVP.

## Functionality we should provide

### Built

- One filtered trigger, from fifteen admissions events, with a re-entry rule
- Send email to a *role*, with delivery retry
- Create task, notify team, update status
- Allocate a house or class section
- Adjust a fee, as a concession or a credit, with an approval gate
- Branch with two or more labelled paths, an explicit fallback, and numeric comparison
- Parallel, for steps that all run
- Three delay types, with weekend exclusion
- A configuration summary printed on every node
- Advisory validation, enforced at activation
- Draft / Active / Paused, with a review before anything goes live
- Undo and redo, and linkable diagrams
- Fifteen workflows across the journey, plus inter-branch transfer

### Next

- WhatsApp and SMS, the channel parents actually reply on
- A template library, so a school never starts from a blank canvas
- Academic-calendar awareness on delays, so vacations are excluded like weekends
- Waiting relative to a date field (→ D-04)
- A workflow list, which is where lifecycle normally lives (→ D-10, D-24)
- Per-workflow analytics on the canvas

### Explicitly not doing

- Random / A/B split. Cohorts are too small for it to mean anything (→ D-06)
- Webhooks and custom code. Wrong audience for a school administrator
- AND / OR across several fields in one branch, until a workflow needs it
- Multi-trigger workflows, until the execution semantics are settled (→ D-02)
- Any part of the execution engine, which the brief places out of scope (→ D-16)

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

**School admission processes, and where the fee actually sits** ·
[GIIS Bangalore admissions process](https://globalindianschool.org/bangalore/admissions/admissions-process/)
and [fees](https://globalindianschool.org/bangalore/admissions/fees/), showing the registration fee
at form submission and admission and term fees after confirmation ·
[St Pauls College Bengaluru admissions](https://landingblr.stpaulscollege.edu.in/admission/),
showing offer letter, accept, Registration Fee Payment, then enrolment on payment confirmation.

*The GIIS page blocks automated fetching. Its fee timing was confirmed through the indexed fees page
rather than read directly.*

**Admissions-specific** · [Meritto education CRM for admissions teams](https://www.meritto.com/education-crm-for-admission-management-teams/) ·
[Salesforce Education Cloud](https://www.salesforce.com/education/cloud/) ·
[Salesforce Help — Recruitment and Admissions](https://help.salesforce.com/s/articleView?id=sfdo.EC_Recruit_Students_to_Your_Institution_2.htm&language=en_US&type=5)
