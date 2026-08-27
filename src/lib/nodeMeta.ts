import type { IconName } from '../components/ui/Icon'
import type { NodeCategory, NodeType } from '../types/workflow'

/** One place that maps a node type to how it looks and reads. The canvas, the
 *  node library and the step list all render from this, so a new node type is
 *  added in exactly one file. */
export const nodeMeta: Record<NodeType, { label: string; icon: IconName; category: NodeCategory }> = {
  trigger: { label: 'Trigger', icon: 'bolt', category: 'trigger' },
  'send-email': { label: 'Send email', icon: 'mail', category: 'action' },
  'create-task': { label: 'Create task', icon: 'task', category: 'action' },
  'send-notification': { label: 'Send notification', icon: 'bell', category: 'action' },
  'update-status': { label: 'Update status', icon: 'status', category: 'action' },
  'add-tag': { label: 'Add tag', icon: 'tag', category: 'action' },
  allocate: { label: 'Allocate', icon: 'users', category: 'action' },
  branch: { label: 'Branch', icon: 'branch', category: 'logic' },
  delay: { label: 'Delay', icon: 'clock', category: 'delay' },
  end: { label: 'End', icon: 'stop', category: 'logic' },
}
