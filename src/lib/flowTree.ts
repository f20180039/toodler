import type { AnyParams, FlowNode, NodeKind } from '../types/flow'

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
    case 'trigger':
      return {
        id,
        kind,
        title: 'Application submitted',
        children: [],
        params: { event: 'Application submitted', grade: 'All grades', academicYear: '2026–27' },
      }
    case 'email':
      return {
        id,
        kind,
        title: 'New email',
        children: [],
        params: {
          recipient: 'Parent / Guardian',
          subject: '',
          sender: 'Admissions team',
          retry: { enabled: true, attempts: 2, intervalHours: 24 },
        },
      }
    case 'delay':
      return {
        id,
        kind,
        title: 'Wait',
        children: [],
        params: {
          mode: 'duration',
          amount: 3,
          unit: 'days',
          excludeWeekends: true,
          event: 'Documents submitted',
          maxWaitDays: 5,
          date: '',
        },
      }
    case 'task':
      return {
        id,
        kind,
        title: 'Follow up',
        children: [],
        params: { assignee: 'Admissions officer', priority: 'Medium', dueInDays: 2 },
      }
    case 'notify':
      return {
        id,
        kind,
        title: 'Notify the team',
        children: [],
        params: {
          recipient: 'Admissions team',
          channel: 'In-app',
          priority: 'Normal',
          retry: { enabled: false, attempts: 1, intervalHours: 6 },
        },
      }
    case 'status':
      return {
        id,
        kind,
        title: 'Move the applicant on',
        children: [],
        params: { field: 'Application status', value: 'Under review' },
      }
    case 'allocate':
      return {
        id,
        kind,
        title: 'Allocate a house',
        children: [],
        params: {
          target: 'House',
          method: 'Balance across options',
          options: ['Red', 'Yellow', 'Blue', 'Green'],
          value: '',
        },
      }
    case 'branch':
      return {
        id,
        kind,
        title: 'Check a condition',
        children: [
          {
            ...makeNode('end'),
            title: 'End',
            pathLabel: 'Yes',
            pathCondition: { operator: '=', value: 'Complete' },
          },
          /* The last path carries no value: it is the fallback. */
          { ...makeNode('end'), title: 'End', pathLabel: 'No', pathCondition: { operator: '=', value: '' } },
        ],
        params: { field: 'Document status' },
      }
    case 'end':
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
      const survivors = child.kind === 'branch' ? child.children.slice(0, 1) : child.children
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
  const added = makeNode('end')
  const tree = replace(root, branchId, (node) => ({
    ...node,
    children: [
      ...node.children,
      { ...added, pathLabel: `Path ${node.children.length + 1}`, pathCondition: { operator: '=', value: '' } },
    ],
  }))
  return { tree, addedId: added.id }
}

export function updatePath(
  root: FlowNode,
  branchId: string,
  index: number,
  patch: { label?: string; operator?: string; value?: string },
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
              operator: patch.operator ?? child.pathCondition?.operator ?? '=',
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
