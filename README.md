# Toddle Admissions Workflow Builder — Round 2 prototype

A product-design prototype of the workflow **creation** experience. Nothing executes: no backend, no
sending, no scheduling (see `docs/07-prototype-scope.md`).

The thinking behind every node, field and scope decision lives in [`docs/`](docs/README.md). Read
that first. This app is the spec made clickable.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, tests, then a production build
npm run test       # the tree-shape invariant
npm run typecheck
```

## Deploy

Hosted on Render as a static site, configured by [`render.yaml`](render.yaml). It is a Blueprint
rather than dashboard settings, so what serves the demo is visible in the diff.

```bash
npm ci && npm run build   # exactly what Render runs; output in dist/
npm run preview           # serve that build locally before pushing
```

There is no server. `dist/` is static files, which is the honest shape for a prototype that executes
nothing.

The Blueprint's `buildFilter` limits rebuilds to files that affect the bundle. Once real backend and
frontend code lands in this repo, working on it will not redeploy the prototype.

## What it does

One screen, three columns, fifteen seed workflows.

**Stage tabs.** The journey stages: Enquiry, Application, Review, Decision, Registration, Enrolment,
Payment. Then Transfer, an inter-branch move that is a group-level flow rather than an admissions
one. Registration is its own stage because the admission-fee checkpoint is its own milestone.

A stage can own more than one workflow. Where it does, a picker next to the tabs switches between
them. Edits survive switching tabs, and **Reset stage** restores the seed.

**Lifecycle.** Beside the workflow name sits Draft, Active or Paused. Moving into Active opens a
review of everything the workflow will send, create and change, assembled from the nodes. An
incomplete step blocks activation. Pausing is immediate, because the response to an incident is
"stop it now".

**Node types (left).** Trigger, Send email, Create task, Notify team, Update status, Allocate, Adjust
fee, Branch, Parallel, End. Plus the deferred ones, marked *Soon*. Clicking one attaches it to the
selected step.

**Diagram (middle).** Two node types fan out, and they mean opposite things. A **Branch** sends the
applicant down one path. A **Parallel** runs all of them, which is how "email the parent **and** the
admissions officer" is expressed. Nothing else can have a second child.

Every connector carries a `+` that inserts a step at that point. A step with nothing after it also
has one below that appends.

**Parameters (right).** The selected step's configuration. The trigger picks its event, a grade and
year filter, and how often one applicant may re-enter. Email has recipient, subject, sender and a
retry block. Delay switches between a duration, an event to wait for, or a fixed date, and can skip
weekends. Adjust fee is either a concession or a credit, names the fee head it touches, and can hold
for approval. Branch picks one field, then holds a list of paths.

Every value is picked from the field's own closed list, so a condition cannot silently fail to match.
The exception is the three *overdue* day counts, which are numbers compared with `more than` and
`less than`.

Every node prints its configuration under its title, so the diagram reads without opening anything.
Incomplete steps show an advisory warning and never block editing, until activation.

Undo and redo (⌘Z / ⇧⌘Z) cover every edit, across stages. The open workflow and selected step live in
the query string as `?flow=…&step=…`, so a diagram is linkable.

## Structure

```
src/
  components/flow/       FlowCanvas, NodePalette, ConfigPanel, ActivationDialog  ← the app
  components/ui/         reusable primitives (Button, Menu, Field/Select/Checkbox, Icon, …)
  routes/FlowBuilderPage the one screen
  data/flows.ts          the fifteen seed workflows
  constants/admissions   the option lists every panel renders from
  hooks/useFlowLocation  the open workflow and selected step, in the URL
  utils/flowTree         add / rename / update / delete on the tree, and its test
  utils/nodeMeta         node kind → icon, label, group, hint
  utils/nodeSummary      the line each node prints, and its warning
  utils/nodeView         pure view helpers: conditions, paths, stages
  utils/activation       what a workflow will do, read off the tree
  types/admissions.ts    the school's vocabulary, as enums
  types/flow.ts          the flow model
  styles/tokens.css      the design system: colour, spacing, radius, type, elevation
```

`types/admissions.ts` is where policy is encoded. An option that does not exist cannot be chosen. The
Adjust fee node does not offer Token fee as a target, and that is the whole enforcement of "a token
fee is non-negotiable".

`utils/flowTree.test.ts` pins one rule: a node with two or more children is always a Branch or a
Parallel, and each always has at least two. It is checked across insert, append, delete, add-path and
remove-path, including a sweep that deletes every step of every seed workflow in turn.

`styles/tokens.css` is the single source of truth for the visual system. No component hard-codes a
colour or a pixel step.
