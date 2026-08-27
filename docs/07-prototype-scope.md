# 07 · Prototype scope

**Answers:** what the prototype shows, what it only pretends to do, and what Round 3 has to settle.
**Read after:** `06-decisions.md`.

## Three screens

**Workflow list** — the five workflows from `02` as rows: name, trigger, status, steps, last updated,
created by. Search, filter by status and category, and a Create workflow button. Row actions:
rename, duplicate, delete.

**Create workflow** — name, description, category (Admissions · Marketing · Enrolment), then
*Add trigger*, which opens the builder.

**Builder** — node library on the left, canvas in the middle, configuration panel on the right
(→ D-08). Header carries the workflow name, the Draft / Active / Paused state, an unsaved-changes
indicator, the warning count and Save. Nodes are added by clicking a library entry or the
`+ Add step` control at the end of any path (→ D-15). Each node shows its icon, type, title and
configuration summary (→ D-07), and a `⚠` badge while incomplete (→ D-09).

Branches render both paths with labelled connectors, so which side is which is never ambiguous:

```
              [ Branch ]
          Payment status = Pending
             /              \
          Yes                No
            |                 |
      [ Email ]            [ End ]
   Payment reminder
```

## Present but not functional

Undo / redo, zoom controls, minimap, breadcrumb, duplicate, delete, and the Activate flow's review
summary are rendered and reachable, because they are part of judging whether the screen is complete —
but they do not carry real behaviour. Deferred nodes appear in the library greyed, labelled
*Coming soon*.

## Hard out of scope

No backend, database, API, authentication or persistence. No email is sent, no schedule runs, no
workflow executes, no integration is real. All data is mock (→ D-16).

## Open questions for the Round 3 scope lock

1. **Multi-trigger** — do we lift the one-trigger constraint, and what are the dedupe rules if we do
   (→ D-02)?
2. **Recipient resolution** — which parent receives the email when an applicant has two guardians,
   and what happens when the assigned counsellor leaves (→ D-13)?
3. **Mid-flight state changes** — an applicant pays while sitting inside a five-day delay. Does the
   workflow re-evaluate, or continue and send the reminder anyway? This is the single biggest
   execution-semantics question and it changes what the builder must let a user express.
4. **Goal / exit criteria** — should a workflow have a goal that removes an applicant the moment it
   is met, instead of every path ending in an explicit End?
5. **Templates** — who authors email templates, and does the builder ship a starter library so a
   school never faces a blank canvas?
6. **WhatsApp** — Round 4 scope or later? It changes the node model more than any other addition,
   because it brings opt-in state per family.
