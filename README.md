# Toddle Admissions Workflow Builder — Round 2 prototype

A product-design prototype of the workflow **creation** experience. Nothing executes: no backend,
no sending, no scheduling (see `docs/07-prototype-scope.md`).

The product thinking behind every node, configuration field and scope decision lives in
[`docs/`](docs/README.md) — read that first; this app is the spec made clickable.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (Vite picks the next free port if taken)
npm run build      # typecheck + production build
npm run typecheck
```

## What it does

One screen, three columns.

- **Stage tabs** — the six journey stages from the brief: Enquiry, Application, Review, Decision,
  Enrolment, Payment — plus Transfer, an inter-branch move that is a group-level flow rather than an
  admissions one. A stage can own more than one workflow; where it does, a picker next to the tabs
  switches between them. Edits to a stage survive
  switching tabs; **Reset stage** restores the seed.
- **Node types (left)** — the vocabulary a flow is built from: Trigger, Send email, Create task,
  Notify team, Branch, Delay, plus the deferred ones marked *Soon*. Clicking one attaches it to the
  selected step.
- **Diagram (middle)** — the flow as connected boxes. A step with two or more children fans out and
  is drawn side by side, which is how "email the parent **and** the admissions officer" is
  expressed. Branches draw labelled Yes / No paths. The `+` on any connector adds a step after it;
  clicking `+` on a step that already has children adds a parallel one.
- **Parameters (right)** — the selected step's configuration. Email has recipient / subject / sender
  plus a **retry** block (attempts and interval). Delay switches between a duration, an event to
  wait for (with a give-up limit), or a fixed date, and can skip weekends. Task has assignee,
  priority and due date; Branch picks one field and then holds a list of paths — name, operator and
  value each — where the last path with no value is the fallback.

Every node prints its own configuration under its title, so the diagram is readable without opening
anything. Incomplete steps show an advisory warning and never block editing.

## Structure

```
src/
  components/flow/       FlowCanvas, NodePalette, ConfigPanel  ← the app
  components/ui/         reusable primitives (Button, Menu, Field/Select/Checkbox, NodeGlyph, …)
  routes/FlowBuilderPage the one screen
  data/flows.ts          the five stage diagrams
  lib/flowTree.ts        add / rename / update / delete on the tree
  lib/flowMeta.ts        node kind → icon, label, and its one-line summary
  types/flow.ts          the flow model
  styles/tokens.css      the design system: colour, spacing, radius, type, elevation
```

An earlier, larger version of this prototype (workflow list, product nav, shell) is still on disk
under `components/shell/`, `components/workflow/` and `routes/Workflow*` but is no longer routed —
kept only so nothing is lost. Delete it whenever.

`styles/tokens.css` is the single source of truth for the visual system — no component hard-codes a
colour or a pixel step.
