import type { WorkflowStatus } from '../../types/workflow'
import { Badge, type BadgeTone } from './Badge'

const statusMap: Record<WorkflowStatus, { label: string; tone: BadgeTone }> = {
  active: { label: 'Active', tone: 'success' },
  draft: { label: 'Draft', tone: 'neutral' },
  paused: { label: 'Paused', tone: 'warning' },
}

/** The Draft / Active / Paused lifecycle from docs/06 D-10. */
export function StatusBadge({ status }: { status: WorkflowStatus }) {
  const { label, tone } = statusMap[status]
  return (
    <Badge tone={tone} pill withDot>
      {label}
    </Badge>
  )
}
