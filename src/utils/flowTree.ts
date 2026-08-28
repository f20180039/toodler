import { DEFAULT_HOUSES, isNumericField, isNumericOperator } from '../constants/admissions'
import {
  AcademicYear,
  AdjustBasis,
  AdjustKind,
  AdjustValidity,
  AdmissionField,
  AllocateMethod,
  AllocateTarget,
  ApplicationStatus,
  DocumentStatus,
  Grade,
  NotifyChannel,
  NotifyPriority,
  CreditSource,
  FeeConcession,
  FeeHead,
  Operator,
  ReentryRule,
  Role,
  TaskPriority,
  TriggerEvent,
} from '../types/admissions'
import {
  DelayMode,
  DelayUnit,
  NodeKind,
  type AnyParams,
  type FlowNode,
  type PathPatch,
} from '../types/flow'

let sequence = 0

export function nextId(kind: NodeKind): string {
  sequence += 1
  return `${kind}-${sequence}`
}

/** Sensible starting parameters, so a freshly added node is already readable
 *  on the canvas instead of saying "not configured". */
export function makeNode(kind: NodeKind): FlowNode {
  const id = nextId(kind)

  switch (kind) {
    case NodeKind.Trigger:
      return {
        id,
        kind,
        title: 'Application submitted',
        children: [],
        params: {
          event: TriggerEvent.ApplicationSubmitted,
          grade: Grade.AllGrades,
          academicYear: AcademicYear.Y2026,
          reentry: ReentryRule.Once,
        },
      }
    case NodeKind.Email:
      return {
        id,
        kind,
        title: 'New email',
        children: [],
        params: {
          recipient: Role.Parent,
          subject: '',
          sender: Role.AdmissionsTeam,
          retry: { enabled: true, attempts: 2, intervalHours: 24 },
        },
      }
    case NodeKind.Delay:
      return {
        id,
        kind,
        title: 'Wait',
        children: [],
        params: {
          mode: DelayMode.Duration,
          amount: 3,
          unit: DelayUnit.Days,
          excludeWeekends: true,
          event: TriggerEvent.DocumentsSubmitted,
          maxWaitDays: 5,
          date: '',
        },
      }
    case NodeKind.Task:
      return {
        id,
        kind,
        title: 'Follow up',
        children: [],
        params: {
          assignee: Role.AdmissionsOfficer,
          priority: TaskPriority.Medium,
          dueInDays: 2,
        },
      }
    case NodeKind.Notify:
      return {
        id,
        kind,
        title: 'Notify the team',
        children: [],
        params: {
          recipient: Role.AdmissionsTeam,
          channel: NotifyChannel.InApp,
          priority: NotifyPriority.Normal,
          retry: { enabled: false, attempts: 1, intervalHours: 6 },
        },
      }
    case NodeKind.Status:
      return {
        id,
        kind,
        title: 'Move the applicant on',
        children: [],
        params: {
          field: AdmissionField.ApplicationStatus,
          value: ApplicationStatus.UnderReview,
        },
      }
    case NodeKind.Allocate:
      return {
        id,
        kind,
        title: 'Allocate a house',
        children: [],
        params: {
          target: AllocateTarget.House,
          method: AllocateMethod.Balance,
          options: [...DEFAULT_HOUSES],
          value: '',
        },
      }
    case NodeKind.AdjustFee:
      return {
        id,
        kind,
        title: 'Apply the concession',
        children: [],
        params: {
          kind: AdjustKind.Concession,
          concession: FeeConcession.MeritCumNeed,
          creditFrom: CreditSource.TokenFee,
          appliesTo: FeeHead.AdmissionFee,
          basis: AdjustBasis.Percentage,
          value: 25,
          approvalRequired: true,
          approver: Role.Principal,
          validity: AdjustValidity.ThisYear,
        },
      }
    case NodeKind.Branch:
      return {
        id,
        kind,
        title: 'Check a condition',
        children: [
          {
            ...makeNode(NodeKind.End),
            title: 'End',
            pathLabel: 'Yes',
            pathCondition: { operator: Operator.Equals, value: DocumentStatus.Complete },
          },
          /* The last path carries no value: it is the fallback. */
          {
            ...makeNode(NodeKind.End),
            title: 'End',
            pathLabel: 'No',
            pathCondition: { operator: Operator.Equals, value: '' },
          },
        ],
        params: { field: AdmissionField.DocumentStatus },
      }
    case NodeKind.End:
      return { id, kind, title: 'End', children: [], params: {} }
  }
}

export function findNode(node: FlowNode, id: string): FlowNode | undefined {
  if (node.id === id) return node
  for (const child of node.children) {
    const found = findNode(child, id)
    if (found) return found
  }
  return undefined
}

function replace(node: FlowNode, id: string, update: (node: FlowNode) => FlowNode): FlowNode {
  if (node.id === id) return update(node)
  return { ...node, children: node.children.map((child) => replace(child, id, update)) }
}

export function renameNode(root: FlowNode, id: string, title: string): FlowNode {
  return replace(root, id, (node) => ({ ...node, title }))
}

/** Params are a discriminated union, so the merge is cast once here rather than
 *  at every form field. */
export function updateParams(root: FlowNode, id: string, patch: Partial<AnyParams>): FlowNode {
  return replace(
    root,
    id,
    (node) =>
      ({
        ...node,
        params: { ...node.params, ...patch },
      }) as FlowNode,
  )
}

export function addChild(root: FlowNode, parentId: string, kind: NodeKind): FlowNode {
  const child = makeNode(kind)
  return replace(root, parentId, (node) => ({ ...node, children: [...node.children, child] }))
}

/** Inserts a step immediately above `targetId`, pushing it (and everything
 *  below it) down. This is what makes an End node extendable: a Yes/No path
 *  that already terminates can still have steps added to it. */
export function insertBefore(
  root: FlowNode,
  targetId: string,
  kind: NodeKind,
): { tree: FlowNode; insertedId: string } {
  const inserted = makeNode(kind)

  function walk(node: FlowNode): FlowNode {
    return {
      ...node,
      children: node.children.map((child) => {
        if (child.id !== targetId) return walk(child)
        /* The path label belongs to whichever node now heads the path. */
        return {
          ...inserted,
          pathLabel: child.pathLabel,
          children: [{ ...child, pathLabel: undefined }],
        }
      }),
    } as FlowNode
  }

  return { tree: walk(root), insertedId: inserted.id }
}

/** Deleting a step splices what came after it back onto its parent, so a chain
 *  does not lose everything below the node you removed. Deleting a *branch*
 *  keeps the Yes path and discards the No path - the alternative (promoting
 *  both) would silently turn a decision into two parallel steps. */
export function deleteNode(root: FlowNode, id: string): FlowNode {
  function prune(node: FlowNode): FlowNode {
    const children = node.children.flatMap((child) => {
      if (child.id !== id) return [prune(child)]
      const survivors =
        child.kind === NodeKind.Branch ? child.children.slice(0, 1) : child.children
      return survivors.map((survivor, index) => ({
        ...survivor,
        pathLabel: index === 0 ? child.pathLabel : survivor.pathLabel,
      }))
    })
    return { ...node, children }
  }
  return prune(root)
}

/** A branch can have as many paths as the school needs - route by seat
 *  availability, by destination campus, by fee plan. Two paths is just the
 *  common case, not the limit. */
export function addPath(root: FlowNode, branchId: string): { tree: FlowNode; addedId: string } {
  const added = makeNode(NodeKind.End)
  const tree = replace(root, branchId, (node) => ({
    ...node,
    children: [
      ...node.children,
      {
        ...added,
        pathLabel: `Path ${node.children.length + 1}`,
        pathCondition: { operator: Operator.Equals, value: '' },
      },
    ],
  }))
  return { tree, addedId: added.id }
}

/** Changing which field a branch tests invalidates every path value, since
 *  they came from the old field's vocabulary. One update, so it is one undo. */
export function setBranchField(root: FlowNode, branchId: string, field: AdmissionField): FlowNode {
  return replace(root, branchId, (node) => ({
    ...node,
    params: { ...node.params, field },
    children: node.children.map((child) => ({
      ...child,
      pathCondition: {
        operator: operatorFor(field, child.pathCondition?.operator),
        value: '' as const,
      },
    })),
  }) as FlowNode)
}

/** Keeps the operator in the family the field accepts: `= Pending` is nonsense
 *  on a day count, and `more than` is nonsense on a status (→ D-33). */
function operatorFor(field: AdmissionField, current: Operator | undefined): Operator {
  const numericField = isNumericField(field)
  const operator = current ?? Operator.Equals
  if (numericField) return isNumericOperator(operator) ? operator : Operator.MoreThan
  return isNumericOperator(operator) ? Operator.Equals : operator
}

export function updatePath(
  root: FlowNode,
  branchId: string,
  index: number,
  patch: PathPatch,
): FlowNode {
  return replace(root, branchId, (node) => ({
    ...node,
    children: node.children.map((child, childIndex) =>
      childIndex !== index
        ? child
        : {
            ...child,
            pathLabel: patch.label ?? child.pathLabel,
            pathCondition: {
              operator: patch.operator ?? child.pathCondition?.operator ?? Operator.Equals,
              value: patch.value ?? child.pathCondition?.value ?? '',
            },
          },
    ),
  }))
}

/** Removing a path removes everything on it. A branch keeps at least two. */
export function removePath(root: FlowNode, branchId: string, index: number): FlowNode {
  return replace(root, branchId, (node) =>
    node.children.length <= 2
      ? node
      : { ...node, children: node.children.filter((_, childIndex) => childIndex !== index) },
  )
}

export function countNodes(node: FlowNode): number {
  return 1 + node.children.reduce((total, child) => total + countNodes(child), 0)
}

export function collectWarnings(
  node: FlowNode,
  check: (node: FlowNode) => string | undefined,
): number {
  return (
    (check(node) ? 1 : 0) +
    node.children.reduce((total, child) => total + collectWarnings(child, check), 0)
  )
}
