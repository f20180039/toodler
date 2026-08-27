import type { NodeCategory, NodeDefinition } from '../types/workflow'

/** The node library from docs/03-node-library.md. Nodes flagged `comingSoon`
 *  are shown but not buildable — they exist to show the taxonomy scales (D-16). */
export const nodeLibrary: NodeDefinition[] = [
  {
    type: 'trigger',
    category: 'trigger',
    name: 'Trigger',
    description: 'Starts the workflow when something happens',
  },
  {
    type: 'send-email',
    category: 'action',
    name: 'Send email',
    description: 'Email a family or a school team',
  },
  {
    type: 'create-task',
    category: 'action',
    name: 'Create task',
    description: 'Owned work with an assignee and a due date',
  },
  {
    type: 'send-notification',
    category: 'action',
    name: 'Send notification',
    description: 'Tell a team something, with no task attached',
  },
  {
    type: 'update-status',
    category: 'action',
    name: 'Update status',
    description: 'Set an admissions field to a new value',
  },
  {
    type: 'add-tag',
    category: 'action',
    name: 'Add tag',
    description: 'Label the applicant so queues can filter on it',
  },
  {
    type: 'branch',
    category: 'logic',
    name: 'Branch',
    description: 'Split into a Yes path and a No path',
  },
  {
    type: 'delay',
    category: 'delay',
    name: 'Delay',
    description: 'Wait for a duration, a date, or an event',
  },
]

export const categoryLabels: Record<NodeCategory, string> = {
  trigger: 'Triggers',
  action: 'Actions',
  logic: 'Logic',
  delay: 'Delays',
}

/** Deferred nodes, named admissions-first on purpose (docs/03). */
export const comingSoonNodes = [
  'Send WhatsApp',
  'Send SMS',
  'Schedule interview',
  'Request documents',
  'Assign counsellor',
  'Send offer letter',
  'Send payment link',
  'Move admission stage',
]
