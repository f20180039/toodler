import type { Workflow, WorkflowStep } from '../types/workflow'

/** Steps are a tree once a branch appears, so counting has to recurse. */
export function countSteps(steps: WorkflowStep[]): number {
  return steps.reduce(
    (total, step) =>
      total + 1 + countSteps(step.yes ?? []) + countSteps(step.no ?? []),
    0,
  )
}

export function collectWarnings(steps: WorkflowStep[]): string[] {
  return steps.flatMap((step) => [
    ...(step.warning ? [step.warning] : []),
    ...collectWarnings(step.yes ?? []),
    ...collectWarnings(step.no ?? []),
  ])
}

export function workflowWarningCount(workflow: Workflow): number {
  return collectWarnings(workflow.steps).length
}

/** "3 days ago" style labels, computed against a fixed "today" so the
 *  prototype reads the same whenever it is demoed. */
const DEMO_TODAY = new Date('2026-08-27T10:00:00Z')

export function formatRelativeDate(iso: string): string {
  const then = new Date(iso)
  const days = Math.round(
    (DEMO_TODAY.getTime() - then.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'Last week'
  if (days < 60) return `${Math.round(days / 7)} weeks ago`
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
