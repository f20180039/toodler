/** The workflow model. Mirrors docs/03-node-library.md and docs/04-node-configuration.md.
 *  Configuration is held as a display-ready summary plus a loose config bag: this is a
 *  design prototype, so nothing here is meant to be executed (docs/06 D-16). */

export type WorkflowStatus = 'active' | 'draft' | 'paused'

export type WorkflowCategory = 'admissions' | 'marketing' | 'enrolment'

/** The four groups the node library is organised by (docs/06 D-01). */
export type NodeCategory = 'trigger' | 'action' | 'logic' | 'delay'

export type NodeType =
  | 'trigger'
  | 'send-email'
  | 'create-task'
  | 'send-notification'
  | 'update-status'
  | 'add-tag'
  | 'allocate'
  | 'branch'
  | 'delay'
  | 'end'

export interface WorkflowStep {
  id: string
  type: NodeType
  /** The node's own label, e.g. "Application reminder". */
  title: string
  /** The collapsed string printed on the canvas, e.g. "Wait 3 days" (docs/06 D-07). */
  summary: string
  /** Advisory validation message. Never blocks saving a draft (docs/06 D-09). */
  warning?: string
  /** Branch nodes only: the two labelled paths (docs/06 D-03). */
  yes?: WorkflowStep[]
  no?: WorkflowStep[]
}

export interface Workflow {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  status: WorkflowStatus
  /** Human-readable trigger summary for the list screen. */
  trigger: string
  createdBy: string
  /** ISO date. */
  updatedAt: string
  steps: WorkflowStep[]
}

export interface NodeDefinition {
  type: NodeType
  category: NodeCategory
  name: string
  description: string
  /** Deferred nodes appear in the library labelled "Coming soon" (docs/03). */
  comingSoon?: boolean
}
