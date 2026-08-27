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
| Filters on the trigger | Yes | Yes (segment builder) | Up to 5 per trigger | Typical | **Yes** — grade, year, source |
| Duration delay | Yes — "set amount of time" | Yes | Yes — "time delay" | Typical | **Yes** |
| Wait until a date / date property | Yes — calendar date, date property | Yes — specific day/time, custom date field | Not a named rule | Typical | **Yes** |
| Wait relative to a date ("24h before") | Via a date-property delay | Via date-based triggers and actions | — | Typical | **Yes — first class** (→ D-04) |
| Wait until an event or condition | Yes — "event occurrence" | Yes — "wait until conditions are met", with a time limit | Yes — "Wait for Trigger" | Partial | **Yes**, with a maximum wait |
| Weekday / time-of-day / weekend control | Yes — "Business days only (Monday - Friday)", day-of-week and time-of-day delays | Date and time conditions | — | — | **Yes — exclude weekends** (→ D-05) |
| Binary Yes / No branch | Yes — if/then, with a "None met" path | Yes — If/Else, Yes and No paths | Yes — conditional split, up to 5 conditions | Typical | **Yes** |
| AND / OR inside one branch | Yes — if/then, up to 20 branches | Yes — segment builder | Multiple conditions per split | Typical | **Yes** |
| N-way / value-based split | Yes — up to 250 branches on one property | Via nested If/Else | No | Partial | **Deferred** (→ D-03) |
| Random / percentage split | Yes — Marketing Hub Pro+, needs ≈1,000 records | Yes | Yes — percentage and 50/50 | Rare | **Labelled Future** (→ D-06) |
| Create an internal task | Yes — "Create task" | Yes — "Add a deal task" | No | Yes — counsellor follow-ups | **Yes** |
| Internal notification | Yes — in-app, internal email, Slack | Partial | No | Typical | **Yes** |
| Update a record field | Yes — "Edit record" | Yes | Yes — "Update contact" | Typical | **Yes** — status and tag |
| Re-entry / re-enrolment control | Yes — off by default | Yes | Yes | Typical | **Yes** (→ D-14) |
| Draft / Active / Paused states | Yes | Yes | Yes — Draft, Active, Paused | Typical | **Yes** (→ D-10) |
| SMS / WhatsApp | Yes / partial | Yes | SMS, with an approved programme | Yes — the primary channel in India | **Deferred** (→ D-16) |
| Webhook / custom code | Yes | Yes | Yes | Varies | **Not doing** (→ D-16) |

Three observations drove scope more than the feature counts:

1. **The generic tools are property-driven.** A school adopting HubSpot must first model applicants,
   grades and document status as custom contact properties. That modelling work is the gap we
   close by shipping `01`'s vocabulary as first-class fields (→ D-12).
2. **Delay sophistication, not branching sophistication, is where admissions lives.** HubSpot ships
   six delay types; we need five of the same ideas. Its branching goes to 250 paths; we need two.
3. **The admissions CRMs already do the work half** — counsellor assignment, document verification,
   interview panel allocation, fee follow-up. That is the shape of the deferred list in `03`, and it
   confirms tasks and notifications belong in the MVP.

## Functionality we should provide

**MVP — build now.** One filtered trigger from the full admissions event list · send email to a
recipient *role* · create task · internal notification · update status · add tag · Yes/No branch with
AND/OR conditions · five delay types with weekend exclusion · configuration summaries on every node ·
advisory validation · Draft / Active / Paused with a review step before activation · workflow list
with search, filter, duplicate and rename.

**Next — designed for, not built now.** WhatsApp and SMS, the channel parents actually reply on ·
value-based split for routing by grade or counsellor · admissions actions (schedule interview,
request documents, assign counsellor, send offer letter, send payment link) · academic-calendar
awareness on delays, so vacations are excluded the way weekends are · per-workflow analytics ·
a template library so schools do not start from a blank canvas.

**Explicitly not doing.** Random / A/B split as an admissions feature — cohorts are too small for it
to mean anything (→ D-06) · webhooks and custom code, wrong audience for a school administrator ·
multi-trigger workflows until the execution semantics are settled (→ D-02) · any part of the
execution engine, which the brief places out of scope (→ D-16).

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

**Admissions-specific** · [Meritto education CRM for admissions teams](https://www.meritto.com/education-crm-for-admission-management-teams/) ·
[Salesforce Education Cloud](https://www.salesforce.com/education/cloud/) ·
[Salesforce Help — Recruitment and Admissions](https://help.salesforce.com/s/articleView?id=sfdo.EC_Recruit_Students_to_Your_Institution_2.htm&language=en_US&type=5)
