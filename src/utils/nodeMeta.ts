import type { IconName } from '../components/ui/Icon'
import { NodeGroup, NodeKind } from '../types/flow'

interface NodeMeta {
  label: string
  icon: IconName
  group: NodeGroup
  hint: string
}

/** How each node type presents itself. One entry per NodeKind, so adding a node
 *  type is a compile error until it is described here. */
export const kindMeta: Record<NodeKind, NodeMeta> = {
  [NodeKind.Trigger]: {
    label: 'Trigger',
    icon: 'bolt',
    group: NodeGroup.Trigger,
    hint: 'Starts the workflow when something happens',
  },
  [NodeKind.Email]: {
    label: 'Send email',
    icon: 'mail',
    group: NodeGroup.Action,
    hint: 'Email a family or a school team',
  },
  [NodeKind.Task]: {
    label: 'Create task',
    icon: 'task',
    group: NodeGroup.Action,
    hint: 'Work someone has to complete',
  },
  [NodeKind.Notify]: {
    label: 'Notify team',
    icon: 'bell',
    group: NodeGroup.Action,
    hint: 'Tell a team, with no task attached',
  },
  [NodeKind.Status]: {
    label: 'Update status',
    icon: 'status',
    group: NodeGroup.Action,
    hint: 'Move the applicant to a new stage',
  },
  [NodeKind.Allocate]: {
    label: 'Allocate',
    icon: 'users',
    group: NodeGroup.Action,
    hint: 'Assign a house or a class section',
  },
  [NodeKind.AdjustFee]: {
    label: 'Adjust fee',
    icon: 'rupee',
    group: NodeGroup.Action,
    hint: 'Apply a concession, or credit a fee already paid',
  },
  [NodeKind.Branch]: {
    label: 'Branch',
    icon: 'branch',
    group: NodeGroup.Logic,
    hint: 'Split into two or more labelled paths',
  },
  [NodeKind.Delay]: {
    label: 'Delay',
    icon: 'clock',
    group: NodeGroup.Delay,
    hint: 'Wait before the next step',
  },
  [NodeKind.End]: {
    label: 'End',
    icon: 'stop',
    group: NodeGroup.Logic,
    hint: 'Stops this path',
  },
}

export const groupLabels: Record<NodeGroup, string> = {
  [NodeGroup.Trigger]: 'Trigger',
  [NodeGroup.Action]: 'Actions',
  [NodeGroup.Logic]: 'Logic',
  [NodeGroup.Delay]: 'Delays',
}

/** Node types a user can add. A flow starts from exactly one trigger, and
 *  nothing can be placed after an End. */
export const ADDABLE_KINDS: readonly NodeKind[] = Object.values(NodeKind).filter(
  (kind) => kind !== NodeKind.Trigger && kind !== NodeKind.End,
)

export function kindsInGroup(group: NodeGroup): readonly NodeKind[] {
  return ADDABLE_KINDS.filter((kind) => kindMeta[kind].group === group)
}
