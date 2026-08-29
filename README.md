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

## Deploy

Hosted on Render as a static site, configured by [`render.yaml`](render.yaml) — a Blueprint rather
than dashboard settings, so what is serving the demo is in the diff.

```bash
npm ci && npm run build   # exactly what Render runs; output in dist/
npm run preview           # serve that build locally before pushing
```

There is no server: `dist/` is static files, which is the honest shape for a prototype that executes
nothing. The Blueprint's `buildFilter` limits rebuilds to files that affect the bundle, so once real
backend and frontend code lands in this repo, working on it will not redeploy the prototype.

## What it does

One screen, three columns, fifteen seed workflows.

- **Stage tabs** — the journey stages: Enquiry, Application, Review, Decision, Registration,
  Enrolment, Payment — plus Transfer, an inter-branch move that is a group-level flow rather than an
  admissions one. Registration is its own stage because the admission-fee checkpoint is its own
  milestone. A stage can own more than one workflow; where it does, a picker next to the tabs
  switches between them. Edits to a stage survive switching tabs; **Reset stage** restores the seed.
- **Lifecycle** — beside the workflow name sits Draft / Active / Paused. Moving *into* Active opens
  a review of everything the workflow will send, create and change, assembled from the nodes; an
  incomplete step blocks activation. Pausing is immediate, because the response to an incident is
  "stop it now".
- **Node types (left)** — the vocabulary a flow is built from: Trigger, Send email, Create task,
  Notify team, Update status, Allocate, Adjust fee, Branch, Delay, End, plus the deferred ones
  marked *Soon*. Clicking one attaches it to the selected step.
- **Diagram (middle)** — the flow as connected boxes. Two node types fan out, and they mean opposite
  things: a **Branch** sends the applicant down one path, a **Parallel** runs all of them — which is
  how "email the parent **and** the admissions officer" is expressed. Nothing else can have a second
  child. Every connector carries a `+` that inserts a step at that point; a step with nothing after
  it also has one below that appends.
- **Parameters (right)** — the selected step's configuration. The trigger picks its event, a grade
  and year filter, and how often one applicant may re-enter. Email has recipient / subject / sender
  plus a **retry** block. Delay switches between a duration, an event to wait for (with a give-up
  limit), or a fixed date, and can skip weekends. Adjust fee is either a concession or a credit,
  names the fee head it touches, and can hold for a named person's approval. Branch picks one field
  and then holds a list of paths — name, operator and value each — where the last path with no value
  is the fallback.

Every value is picked from the field's own closed list, so a condition cannot silently fail to
match; the exception is the three *overdue* day counts, which are numbers compared with `more than`
/ `less than`. Every node prints its own configuration under its title, so the diagram is readable
without opening anything. Incomplete steps show an advisory warning and never block editing — until
activation.

Undo and redo (⌘Z / ⇧⌘Z) cover every edit, across stages. The open workflow and the selected step
live in the query string as `?flow=…&step=…`, so a diagram is linkable.

## Structure

```
src/
  components/flow/       FlowCanvas, NodePalette, ConfigPanel, ActivationDialog  ← the app
  components/ui/         reusable primitives (Button, Menu, Field/Select/Checkbox, Icon, …)
  routes/FlowBuilderPage the one screen
  data/flows.ts          the fifteen seed workflows
  constants/admissions   the option lists every panel renders from
  hooks/useFlowLocation  the open workflow and selected step, in the URL
  utils/flowTree         add / rename / update / delete on the tree (+ its test)
  utils/nodeMeta         node kind → icon, label, group, hint
  utils/nodeSummary      the line each node prints, and its warning
  utils/nodeView         pure view helpers: conditions, paths, stages
  utils/activation       what a workflow will do, read off the tree
  types/admissions.ts    the school's vocabulary, as enums
  types/flow.ts          the flow model
  styles/tokens.css      the design system: colour, spacing, radius, type, elevation
```

`types/admissions.ts` is where the product's policy is encoded: an option that does not exist cannot
be chosen. The Adjust fee node does not offer Token fee as a target, and that is the whole
enforcement of "a token fee is non-negotiable".

`styles/tokens.css` is the single source of truth for the visual system — no component hard-codes a
colour or a pixel step.
