import type { IconName } from '../components/ui/Icon'
import type { FlowNode, NodeKind, Retry } from '../types/flow'

export type NodeGroup = 'trigger' | 'action' | 'logic' | 'delay'

export const kindMeta: Record<
  NodeKind,
  { label: string; icon: IconName; group: NodeGroup; hint: string }
> = {
  trigger: {
    label: 'Trigger',
    icon: 'bolt',
    group: 'trigger',
    hint: 'Starts the workflow when something happens',
  },
  email: {
    label: 'Send email',
    icon: 'mail',
    group: 'action',
    hint: 'Email a family or a school team',
  },
  task: {
    label: 'Create task',
    icon: 'task',
    group: 'action',
    hint: 'Work someone has to complete',
  },
  notify: {
    label: 'Notify team',
    icon: 'bell',
    group: 'action',
    hint: 'Tell a team, with no task attached',
  },
  status: {
    label: 'Update status',
    icon: 'status',
    group: 'action',
    hint: 'Move the applicant to a new stage',
  },
  allocate: {
    label: 'Allocate',
    icon: 'users',
    group: 'action',
    hint: 'Assign a house or a class section',
  },
  branch: {
    label: 'Branch',
    icon: 'branch',
    group: 'logic',
    hint: 'Split into two or more labelled paths',
  },
  delay: {
    label: 'Delay',
    icon: 'clock',
    group: 'delay',
    hint: 'Wait before the next step',
  },
  end: { label: 'End', icon: 'stop', group: 'logic', hint: 'Stops this path' },
}

export const groupLabels: Record<NodeGroup, string> = {
  trigger: 'Trigger',
  action: 'Actions',
  logic: 'Logic',
  delay: 'Delays',
}

/** The line printed under the title on the node itself, so the diagram can be
 *  read without opening anything. */
export function summarise(node: FlowNode): string {
  switch (node.kind) {
    case 'trigger':
      return [node.params.event, node.params.grade, node.params.academicYear]
        .filter(Boolean)
        .join(' · ')
    case 'email':
      return `→ ${node.params.recipient || 'No recipient'} · "${node.params.subject || 'No subject'}"`
    case 'delay':
      if (node.params.mode === 'duration') {
        const base = `Wait ${node.params.amount} ${node.params.unit}`
        return node.params.excludeWeekends ? `${base} · excludes weekends` : base
      }
      if (node.params.mode === 'until-event') {
        return `Wait until ${node.params.event} · max ${node.params.maxWaitDays} days`
      }
      return `Wait until ${node.params.date || 'a date'}`
    case 'task':
      return `→ ${node.params.assignee} · ${node.params.priority} · due in ${node.params.dueInDays} days`
    case 'notify':
      return `→ ${node.params.recipient} · ${node.params.channel}`
    case 'status':
      return `${node.params.field} → ${node.params.value}`
    case 'allocate': {
      const { target, method, options, value } = node.params
      if (method === 'Pick one option') return `${target} → ${value || 'not chosen'}`
      if (method === 'Match a sibling') return `${target} · match the sibling`
      return `${target} · balanced across ${options.length} options`
    }
    case 'branch': {
      /* Two paths read best as the plain condition; more than two read best as
         a count, with each path labelled on its own connector. */
      const [first] = node.children
      if (node.children.length === 2 && first?.pathCondition?.value) {
        return `${node.params.field} ${first.pathCondition.operator} ${first.pathCondition.value}`
      }
      return `${node.params.field} · ${node.children.length} paths`
    }
    case 'end':
      return 'This path stops here'
  }
}

export function nodeRetry(node: FlowNode): Retry | undefined {
  return node.kind === 'email' || node.kind === 'notify' ? node.params.retry : undefined
}

/** Advisory only - an incomplete node never blocks editing. */
export function nodeWarning(node: FlowNode): string | undefined {
  if (node.kind === 'email') {
    if (!node.params.recipient) return 'Add a recipient'
    if (!node.params.subject) return 'Add a subject'
  }
  if (node.kind === 'branch') {
    const configured = node.children.filter((child) => child.pathCondition?.value).length
    /* One path may legitimately be the fallback; two or more unset means the
       routing is ambiguous. */
    if (node.children.length - configured > 1) return 'Set the path conditions'
  }
  if (node.kind === 'allocate') {
    if (node.params.method === 'Pick one option' && !node.params.value) return 'Choose an option'
    if (node.params.options.length === 0) return 'Add the options to allocate from'
  }
  if (node.kind === 'delay' && node.params.mode === 'duration' && !node.params.amount) {
    return 'Set how long to wait'
  }
  return undefined
}
