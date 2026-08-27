import { AllocateMethod } from '../types/admissions'
import { DelayMode, NodeKind, type FlowNode, type Retry } from '../types/flow'
import { isPathConfigured } from './nodeView'

/** The line printed under the title on the node itself, so the diagram can be
 *  read without opening anything — never the word "Configured". */
export function summarise(node: FlowNode): string {
  switch (node.kind) {
    case NodeKind.Trigger:
      return [node.params.event, node.params.grade, node.params.academicYear]
        .filter(Boolean)
        .join(' · ')

    case NodeKind.Email:
      return `→ ${node.params.recipient || 'No recipient'} · "${node.params.subject || 'No subject'}"`

    case NodeKind.Delay:
      if (node.params.mode === DelayMode.Duration) {
        const base = `Wait ${node.params.amount} ${node.params.unit}`
        return node.params.excludeWeekends ? `${base} · excludes weekends` : base
      }
      if (node.params.mode === DelayMode.UntilEvent) {
        return `Wait until ${node.params.event} · max ${node.params.maxWaitDays} days`
      }
      return `Wait until ${node.params.date || 'a date'}`

    case NodeKind.Task:
      return `→ ${node.params.assignee} · ${node.params.priority} · due in ${node.params.dueInDays} days`

    case NodeKind.Notify:
      return `→ ${node.params.recipient} · ${node.params.channel}`

    case NodeKind.Status:
      return `${node.params.field} → ${node.params.value}`

    case NodeKind.Allocate: {
      const { target, method, options, value } = node.params
      if (method === AllocateMethod.PickOne) return `${target} → ${value || 'not chosen'}`
      if (method === AllocateMethod.MatchSibling) return `${target} · match the sibling`
      return `${target} · balanced across ${options.length} options`
    }

    case NodeKind.Branch: {
      /* Two paths read best as the plain condition; more than two read best as
         a count, with each path labelled on its own connector. */
      const [first] = node.children
      if (node.children.length === 2 && first?.pathCondition?.value) {
        return `${node.params.field} ${first.pathCondition.operator} ${first.pathCondition.value}`
      }
      return `${node.params.field} · ${node.children.length} paths`
    }

    case NodeKind.End:
      return 'This path stops here'
  }
}

export function nodeRetry(node: FlowNode): Retry | undefined {
  return node.kind === NodeKind.Email || node.kind === NodeKind.Notify
    ? node.params.retry
    : undefined
}

export function retryLabel(retry: Retry): string {
  return `Retry x${retry.attempts} · every ${retry.intervalHours}h`
}

/** Advisory only — an incomplete node never blocks editing. */
export function nodeWarning(node: FlowNode): string | undefined {
  switch (node.kind) {
    case NodeKind.Email:
      if (!node.params.recipient) return 'Add a recipient'
      if (!node.params.subject) return 'Add a subject'
      return undefined

    case NodeKind.Branch: {
      const configured = node.children.filter((child) => isPathConfigured(child.pathCondition))
        .length
      /* One path may legitimately be the fallback; two or more unset means the
         routing is ambiguous. */
      return node.children.length - configured > 1 ? 'Set the path conditions' : undefined
    }

    case NodeKind.Allocate:
      if (node.params.method === AllocateMethod.PickOne && !node.params.value) {
        return 'Choose an option'
      }
      return node.params.options.length === 0 ? 'Add the options to allocate from' : undefined

    case NodeKind.Delay:
      return node.params.mode === DelayMode.Duration && !node.params.amount
        ? 'Set how long to wait'
        : undefined

    default:
      return undefined
  }
}
