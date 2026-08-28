/** What a workflow will actually do, read off the tree.
 *
 *  Activation is a deliberate step rather than a toggle: a misconfigured fee
 *  reminder to three hundred families cannot be recalled, so the user is shown
 *  what is about to happen before it starts happening (→ D-10). This is the
 *  read that makes that screen possible — and it is only trustworthy because
 *  every node prints its configuration rather than the word "Configured"
 *  (→ D-07). */

import { NodeKind, type FlowNode } from '../types/flow'
import { nodeWarning, summarise } from './nodeSummary'

export interface ReviewLine {
  id: string
  title: string
  detail: string
}

export interface ActivationReview {
  /** The trigger, in words. */
  starts: string
  /** Everything that leaves the school: emails and notifications. */
  outward: ReviewLine[]
  /** Work a person has to complete. */
  work: ReviewLine[]
  /** Status moves, allocations and money. */
  changes: ReviewLine[]
  /** Steps still incomplete. Completeness is advisory while drafting and
   *  enforced here (→ D-09). */
  incomplete: ReviewLine[]
}

export function reviewFlow(root: FlowNode): ActivationReview {
  const review: ActivationReview = {
    starts: summarise(root),
    outward: [],
    work: [],
    changes: [],
    incomplete: [],
  }

  walk(root, review)
  return review
}

function walk(node: FlowNode, review: ActivationReview) {
  const line: ReviewLine = { id: node.id, title: node.title, detail: summarise(node) }

  switch (node.kind) {
    case NodeKind.Email:
    case NodeKind.Notify:
      review.outward.push(line)
      break
    case NodeKind.Task:
      review.work.push(line)
      break
    case NodeKind.Status:
    case NodeKind.Allocate:
    case NodeKind.AdjustFee:
      review.changes.push(line)
      break
    default:
      break
  }

  const warning = nodeWarning(node)
  if (warning) review.incomplete.push({ id: node.id, title: node.title, detail: warning })

  for (const child of node.children) walk(child, review)
}
