/** The flow model: a tree. A node with two or more children fans out and the
 *  canvas draws them side by side, which is how "email the parent AND the
 *  admissions officer" is expressed. */

export type NodeKind =
  | 'trigger'
  | 'email'
  | 'delay'
  | 'task'
  | 'notify'
  | 'status'
  | 'allocate'
  | 'branch'
  | 'end'

/** Delivery retry, on the nodes that talk to someone outside the school. */
export interface Retry {
  enabled: boolean
  attempts: number
  intervalHours: number
}

export interface TriggerParams {
  event: string
  grade: string
  academicYear: string
}

export interface EmailParams {
  recipient: string
  subject: string
  sender: string
  retry: Retry
}

export type DelayMode = 'duration' | 'until-event' | 'until-date'

export interface DelayParams {
  mode: DelayMode
  amount: number
  unit: 'minutes' | 'hours' | 'days'
  excludeWeekends: boolean
  event: string
  maxWaitDays: number
  date: string
}

export interface TaskParams {
  assignee: string
  priority: 'Low' | 'Medium' | 'High'
  dueInDays: number
}

export interface NotifyParams {
  recipient: string
  channel: 'In-app' | 'In-app + email'
  priority: 'Normal' | 'Urgent'
  retry: Retry
}

/** A branch checks one field and routes down one of its paths. The condition
 *  that selects a path lives on the path itself (see `pathCondition`), which is
 *  what lets a branch have two paths or six. */
export interface BranchParams {
  field: string
}

export interface PathCondition {
  operator: string
  /** Empty value = the fallback path, taken when nothing else matches. */
  value: string
}

/** Moves the applicant along the admission stages, e.g. Application status ->
 *  Under review. The field list is the school's own vocabulary, not generic
 *  CRM properties. */
export interface StatusParams {
  field: string
  value: string
}

/** Assigns the student to a house or a class section. Allocation is usually a
 *  balancing job rather than a fixed value, which is why `method` exists at all
 *  - a school wants its four houses to come out even. */
export interface AllocateParams {
  target: 'House' | 'Class & section'
  method: 'Balance across options' | 'Match a sibling' | 'Pick one option'
  /** The pool being allocated from, e.g. the four houses or this grade's sections. */
  options: string[]
  /** Used only when the method is "Pick one option". */
  value: string
}

export type AnyParams =
  | TriggerParams
  | EmailParams
  | DelayParams
  | TaskParams
  | NotifyParams
  | StatusParams
  | AllocateParams
  | BranchParams
  | Record<string, never>

interface NodeBase {
  id: string
  title: string
  /** Label printed on the connector into this node, e.g. "Yes" or "Waitlisted". */
  pathLabel?: string
  /** Set on the children of a branch: the test that routes down this path. */
  pathCondition?: PathCondition
  children: FlowNode[]
}

export type FlowNode = NodeBase &
  (
    | { kind: 'trigger'; params: TriggerParams }
    | { kind: 'email'; params: EmailParams }
    | { kind: 'delay'; params: DelayParams }
    | { kind: 'task'; params: TaskParams }
    | { kind: 'notify'; params: NotifyParams }
    | { kind: 'status'; params: StatusParams }
    | { kind: 'allocate'; params: AllocateParams }
    | { kind: 'branch'; params: BranchParams }
    | { kind: 'end'; params: Record<string, never> }
  )

/** One diagram. The admission journey has several stages, so there are several. */
export interface Flow {
  id: string
  stage: string
  name: string
  root: FlowNode
}
