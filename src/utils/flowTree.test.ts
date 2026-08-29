/** The shape invariant, pinned.
 *
 *  One rule governs every edit: **a node with two or more children is always a
 *  Branch or a Parallel, and a Branch or a Parallel always has at least two.**
 *
 *  It matters because the two container kinds mean opposite things — a Branch
 *  sends one applicant down *one* path, a Parallel runs *all* of them — and a
 *  fan-out that is neither says nothing about which it meant. Before the
 *  Parallel node existed, adding a step under a node that already had one
 *  silently produced exactly that: a fork nobody asked for. */

import { describe, expect, it } from 'vitest'
import { flows } from '../data/flows'
import { NodeKind, type FlowNode } from '../types/flow'
import { addChild, addPath, deleteNode, findNode, insertBefore, makeNode, removePath } from './flowTree'

const CONTAINERS: readonly NodeKind[] = [NodeKind.Branch, NodeKind.Parallel]

function isContainer(node: FlowNode): boolean {
  return CONTAINERS.includes(node.kind)
}

/** Every violation in the tree, named, so a failure says which node is wrong. */
function violations(root: FlowNode): string[] {
  const found: string[] = []
  function walk(node: FlowNode) {
    if (!isContainer(node) && node.children.length > 1) {
      found.push(`${node.kind} "${node.title}" has ${node.children.length} children but is not a container`)
    }
    if (isContainer(node) && node.children.length < 2) {
      found.push(`${node.kind} "${node.title}" has only ${node.children.length} path(s)`)
    }
    node.children.forEach(walk)
  }
  walk(root)
  return found
}

function chainTitles(node: FlowNode): string[] {
  return [node.title, ...node.children.flatMap(chainTitles)]
}

describe('the seed workflows', () => {
  it.each(flows.map((flow) => [flow.id, flow] as const))('%s holds the invariant', (_id, flow) => {
    expect(violations(flow.root)).toEqual([])
  })
})

describe('inserting into a linear chain', () => {
  /* The reported bug: A → B, insert between them, expect A → NEW → B and not
     A → (B, NEW). */
  it('splices rather than forking', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const { tree } = insertBefore(enquiry.root, 'e-delay-1', NodeKind.Task)

    const parent = findNode(tree, 'e-email-intro')!
    expect(parent.children).toHaveLength(1)

    const inserted = parent.children[0]
    expect(inserted.kind).toBe(NodeKind.Task)
    expect(inserted.children.map((child) => child.id)).toEqual(['e-delay-1'])
  })

  it('keeps everything below the insertion point', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const before = chainTitles(enquiry.root)
    const { tree } = insertBefore(enquiry.root, 'e-delay-1', NodeKind.Task)
    expect(chainTitles(tree)).toEqual(expect.arrayContaining(before))
  })

  it('never leaves a non-container forked', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const { tree } = insertBefore(enquiry.root, 'e-delay-1', NodeKind.Email)
    expect(violations(tree)).toEqual([])
  })
})

describe('inserting a container into a chain', () => {
  /* A container needs somewhere for the unmatched to go, so the existing chain
     becomes its first path and it gains a second. Inserting one with a single
     path produced a Branch the panel then refused to let you delete from. */
  it.each(CONTAINERS)('%s keeps at least two paths', (kind) => {
    const decision = flows.find((flow) => flow.id === 'decision-offer')!
    const { tree, insertedId } = insertBefore(decision.root, 'dc-end', kind)

    const inserted = findNode(tree, insertedId)!
    expect(inserted.kind).toBe(kind)
    expect(inserted.children.length).toBeGreaterThanOrEqual(2)
    expect(violations(tree)).toEqual([])
  })

  it('puts the existing chain on the first path', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const { tree, insertedId } = insertBefore(enquiry.root, 'e-delay-1', NodeKind.Parallel)
    const inserted = findNode(tree, insertedId)!
    expect(inserted.children[0].id).toBe('e-delay-1')
  })
})

describe('adding after a node', () => {
  it('appends when the node has no children', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const tree = addChild(enquiry.root, 'e-task', NodeKind.Email)
    expect(findNode(tree, 'e-task')!.children).toHaveLength(1)
    expect(violations(tree)).toEqual([])
  })

  it('refuses to fork a node that already has a successor', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const tree = addChild(enquiry.root, 'e-email-intro', NodeKind.Task)
    /* Unchanged: the caller must splice or use a container instead. */
    expect(findNode(tree, 'e-email-intro')!.children).toHaveLength(1)
    expect(violations(tree)).toEqual([])
  })
})

describe('containers built from scratch', () => {
  it.each(CONTAINERS)('%s is created with two paths', (kind) => {
    expect(makeNode(kind).children.length).toBeGreaterThanOrEqual(2)
  })

  it.each(CONTAINERS)('%s keeps at least two paths when one is removed', (kind) => {
    const node = makeNode(kind)
    const root: FlowNode = { ...makeNode(NodeKind.Trigger), children: [node] }
    const trimmed = removePath(root, node.id, 0)
    expect(findNode(trimmed, node.id)!.children).toHaveLength(2)
  })

  it.each(CONTAINERS)('%s can gain a path', (kind) => {
    const node = makeNode(kind)
    const root: FlowNode = { ...makeNode(NodeKind.Trigger), children: [node] }
    const { tree } = addPath(root, node.id)
    expect(findNode(tree, node.id)!.children).toHaveLength(3)
    expect(violations(tree)).toEqual([])
  })

  it('a Parallel path carries no condition — every path runs', () => {
    const node = makeNode(NodeKind.Parallel)
    for (const child of node.children) expect(child.pathCondition).toBeUndefined()
  })

  it('a Branch path carries a condition — one path is chosen', () => {
    const node = makeNode(NodeKind.Branch)
    for (const child of node.children) expect(child.pathCondition).toBeDefined()
  })
})

describe('deleting', () => {
  it('splices the survivors back onto the parent without forking it', () => {
    const enquiry = flows.find((flow) => flow.id === 'enquiry')!
    const tree = deleteNode(enquiry.root, 'e-delay-1')
    expect(findNode(tree, 'e-delay-1')).toBeUndefined()
    expect(findNode(tree, 'e-branch')).toBeDefined()
    expect(violations(tree)).toEqual([])
  })

  it.each(flows.map((flow) => [flow.id, flow] as const))(
    'holds the invariant when any single step of %s is deleted',
    (_id, flow) => {
      const ids: string[] = []
      const collect = (node: FlowNode) => {
        ids.push(node.id)
        node.children.forEach(collect)
      }
      collect(flow.root)

      for (const id of ids.slice(1)) {
        expect(violations(deleteNode(flow.root, id)), `deleting ${id}`).toEqual([])
      }
    },
  )
})
