/** The flow model: a tree. A node with two or more children fans out and the
 *  canvas draws them side by side, which is how "email the parent AND the
 *  admissions officer" is expressed.
 *
 *  Every parameter is typed to the school's vocabulary in `./admissions`, so a
 *  recipient can only ever be a real role and a status can only ever be a real
 *  value for its field. */

import type {
  AcademicYear,
  AdjustBasis,
  AdjustKind,
  AdjustValidity,
  AdmissionField,
  AllocateMethod,
  AllocateTarget,
  CreditSource,
  FeeConcession,
  FeeHead,
  FieldValue,
  Grade,
  NotifyChannel,
  NotifyPriority,
  Operator,
  ReentryRule,
  Role,
  TaskPriority,
  TriggerEvent,
  WorkflowStage,
  WorkflowState,
} from './admissions'

export enum NodeKind {
  Trigger = 'trigger',
  Email = 'email',
  Delay = 'delay',
  Task = 'task',
  Notify = 'notify',
  Status = 'status',
  Allocate = 'allocate',
  AdjustFee = 'adjust-fee',
  Branch = 'branch',
  Parallel = 'parallel',
  End = 'end',
}

/** How the node library groups itself: the question the user is asking when
 *  they reach for a node — do something, decide, or wait. */
export enum NodeGroup {
  Trigger = 'trigger',
  Action = 'action',
  Logic = 'logic',
  Delay = 'delay',
}

export enum DelayMode {
  Duration = 'duration',
  UntilEvent = 'until-event',
  UntilDate = 'until-date',
}

export enum DelayUnit {
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
}

/** Delivery retry, on the nodes that talk to someone outside the school. */
export interface Retry {
  enabled: boolean
  attempts: number
  intervalHours: number
}

export interface TriggerParams {
  event: TriggerEvent
  grade: Grade
  academicYear: AcademicYear
  /** How often one applicant may enter this workflow (→ D-14). */
  reentry: ReentryRule
}

export interface EmailParams {
  recipient: Role
  subject: string
  sender: Role
  retry: Retry
}

export interface DelayParams {
  mode: DelayMode
  amount: number
  unit: DelayUnit
  excludeWeekends: boolean
  /** Only read when the mode is UntilEvent. */
  event: TriggerEvent
  maxWaitDays: number
  /** Only read when the mode is UntilDate. */
  date: string
}

export interface TaskParams {
  assignee: Role
  priority: TaskPriority
  dueInDays: number
}

export interface NotifyParams {
  recipient: Role
  channel: NotifyChannel
  priority: NotifyPriority
  retry: Retry
}

/** The two container kinds mean opposite things, which is why a fan-out has to
 *  be one of them and never an accident: a **Branch** sends one applicant down
 *  *one* path, a **Parallel** runs *all* of them. A node with two or more
 *  children is always one of these, and each always has at least two. */
export const CONTAINER_KINDS: readonly NodeKind[] = [NodeKind.Branch, NodeKind.Parallel]

/** A branch checks one field and routes down one of its paths. The condition
 *  that selects a path lives on the path itself (see `pathCondition`), which is
 *  what lets a branch have two paths or six. */
export interface BranchParams {
  field: AdmissionField
}

/** A status value from the field's own list, a number of days for the overdue
 *  fields, or blank for the fallback path. */
export type ConditionValue = FieldValue | number | ''

/** A partial edit to one of a branch's paths. */
export interface PathPatch {
  label?: string
  operator?: Operator
  value?: ConditionValue
}

export interface PathCondition {
  operator: Operator
  /** Empty value = the fallback path, taken when nothing else matches. */
  value: ConditionValue
}

/** Moves the applicant along the admission stages, e.g. Application status ->
 *  Under review. */
export interface StatusParams {
  field: AdmissionField
  value: FieldValue
}

/** Assigns the student to a house or a class section. Allocation is usually a
 *  balancing job rather than a fixed value, which is why `method` exists at all
 *  - a school wants its four houses to come out even. */
export interface AllocateParams {
  target: AllocateTarget
  method: AllocateMethod
  /** The pool being allocated from. Free strings: houses are fixed, but a
   *  school's section names are its own (A-D, Rose/Lotus, ...). */
  options: string[]
  /** Only read when the method is PickOne. */
  value: string
}

/** The only node that moves money. A *concession* reduces what a family owes;
 *  a *credit* deducts what the school already holds — the token fee coming off
 *  the final bill (→ D-25, D-37). */
export interface AdjustFeeParams {
  kind: AdjustKind
  /** Concessions only: the category, recorded on the applicant so finance can
   *  report by it. */
  concession: FeeConcession
  /** Credits only: what the money already received was paid as. */
  creditFrom: CreditSource
  /** The fee head this touches. Never the token fee (→ D-35). */
  appliesTo: FeeHead
  /** Concessions only — a credit is whatever was received. */
  basis: AdjustBasis
  value: number
  /** A concession is money leaving the school, so it can hold for a named
   *  person's sign-off (→ D-25). */
  approvalRequired: boolean
  approver: Role | ''
  validity: AdjustValidity
}

export type AnyParams =
  | TriggerParams
  | EmailParams
  | DelayParams
  | TaskParams
  | NotifyParams
  | StatusParams
  | AllocateParams
  | AdjustFeeParams
  | BranchParams
  | Record<string, never>

interface NodeBase {
  id: string
  title: string
  /** Label printed on the connector into this node, e.g. "Yes" or "Waitlisted".
   *  Free text: a school names its own paths. */
  pathLabel?: string
  /** Set on the children of a branch: the test that routes down this path. */
  pathCondition?: PathCondition
  children: FlowNode[]
}

export type FlowNode = NodeBase &
  (
    | { kind: NodeKind.Trigger; params: TriggerParams }
    | { kind: NodeKind.Email; params: EmailParams }
    | { kind: NodeKind.Delay; params: DelayParams }
    | { kind: NodeKind.Task; params: TaskParams }
    | { kind: NodeKind.Notify; params: NotifyParams }
    | { kind: NodeKind.Status; params: StatusParams }
    | { kind: NodeKind.Allocate; params: AllocateParams }
    | { kind: NodeKind.AdjustFee; params: AdjustFeeParams }
    | { kind: NodeKind.Branch; params: BranchParams }
    | { kind: NodeKind.Parallel; params: Record<string, never> }
    | { kind: NodeKind.End; params: Record<string, never> }
  )

/** One diagram. The admission journey has several stages, so there are several,
 *  and a stage can own more than one. */
export interface Flow {
  id: string
  stage: WorkflowStage
  name: string
  /** Where the workflow is in its lifecycle. Seeded per workflow, then moved
   *  by the header control — activation goes through a review (→ D-10). */
  state: WorkflowState
  root: FlowNode
}
