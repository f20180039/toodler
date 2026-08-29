/** Pure helpers the components used to declare inline. Nothing here touches
 *  React or CSS: a component maps the returned token to its own styles. */

import { Operator, WorkflowStage, type AdmissionField } from '../types/admissions'
import { isNumericOperator } from '../constants/admissions'
import { CONTAINER_KINDS, NodeKind, type Flow, type FlowNode, type PathCondition } from '../types/flow'

export type PathTone = 'yes' | 'no' | 'other'

/** Yes and No get their own colours; a named path (Waitlisted, No seat) gets a
 *  neutral accent, because a school can call a path anything. */
export function pathTone(label: string | undefined): PathTone {
  if (label === 'Yes') return 'yes'
  if (label === 'No') return 'no'
  return 'other'
}

/** `is empty` and `is not empty` need no value, so a path using one is
 *  configured even though its value is blank. */
export function isPathConfigured(condition: PathCondition | undefined): boolean {
  if (!condition) return false
  if (condition.operator === Operator.IsEmpty || condition.operator === Operator.IsNotEmpty) {
    return true
  }
  return condition.value !== ''
}

/** Whether this path is the catch-all: no condition of its own to match. */
export function isFallbackPath(condition: PathCondition | undefined): boolean {
  return !isPathConfigured(condition)
}

/** The condition as it is printed under a path label, or inside a two-path
 *  branch summary. A numeric comparison carries its unit, because "more than 3"
 *  on its own does not say three of what. */
export function formatCondition(condition: PathCondition | undefined): string {
  if (!isPathConfigured(condition) || !condition) return 'otherwise'
  if (condition.operator === Operator.IsEmpty || condition.operator === Operator.IsNotEmpty) {
    return condition.operator
  }
  if (isNumericOperator(condition.operator)) {
    return `${condition.operator} ${condition.value} days`
  }
  return `${condition.operator} ${condition.value}`
}

/** The same, prefixed with the field the branch tests. */
export function describeCondition(
  field: AdmissionField,
  condition: PathCondition | undefined,
): string {
  return `${field} ${formatCondition(condition)}`
}

/** The heading shown above the node picker. Every insertion point now says
 *  where the step lands, because the one that used to fan the node out said
 *  "parallel" and did it silently. */
export function addStepHeading(node: FlowNode, mode: 'after' | 'before'): string {
  if (mode === 'before') return `Insert a step above ${node.title}`
  return `Add a step after ${node.title}`
}

export function addStepTooltip(mode: 'after' | 'before'): string {
  return mode === 'before' ? 'Insert a step here' : 'Add a step'
}

/** The `+` under a node, which appends. It is offered only where appending
 *  cannot fan the node out: everywhere else the connector below it carries an
 *  insert control instead. Nothing runs after an End, and a container's paths
 *  are managed on the paths themselves. */
export function canAddAfter(node: FlowNode): boolean {
  return node.kind !== NodeKind.End && !isContainer(node) && node.children.length === 0
}

export function isContainer(node: FlowNode): boolean {
  return CONTAINER_KINDS.includes(node.kind)
}

/** Whether the palette can add relative to this node.
 *
 *  Wider than `canAddAfter`, and deliberately so: a node with a successor has
 *  no `+` of its own — the connector below it carries one — but the palette can
 *  still add there, because adding now splices instead of forking. Nothing can
 *  follow an End, and a container's paths are managed on the paths themselves. */
export function isAttachable(node: FlowNode): boolean {
  return node.kind !== NodeKind.End && !isContainer(node)
}

/* ---- option pools (the allocate node's comma-separated field) ------------ */

export function parseOptionList(raw: string): string[] {
  return raw
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean)
}

export function formatOptionList(options: readonly string[]): string {
  return options.join(', ')
}

/* ---- stages -------------------------------------------------------------- */

/** Stage order comes from the WorkflowStage enum, not from the order flows
 *  happen to be declared in. Stages with no workflow are left out. */
export function stagesWithFlows(flows: readonly Flow[]): WorkflowStage[] {
  return Object.values(WorkflowStage).filter((stage) =>
    flows.some((flow) => flow.stage === stage),
  )
}

export function flowsInStage(flows: readonly Flow[], stage: WorkflowStage): Flow[] {
  return flows.filter((flow) => flow.stage === stage)
}
