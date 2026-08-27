import { groupLabels, kindMeta, type NodeGroup } from '../../lib/flowMeta'
import type { FlowNode, NodeKind } from '../../types/flow'
import { NodeGlyph } from '../ui'
import styles from './NodePalette.module.css'

const groups: NodeGroup[] = ['trigger', 'action', 'logic', 'delay']

/** Nodes that are designed for but not built. They stay visible so the node
 *  vocabulary reads as extensible rather than as everything there will ever be. */
const comingSoon = [
  { name: 'Send WhatsApp', glyph: 'send-email' },
  { name: 'Send SMS', glyph: 'send-email' },
  { name: 'Schedule interview', glyph: 'delay' },
  { name: 'Request documents', glyph: 'create-task' },
] as const

interface PaletteProps {
  /** The node a click will attach to. */
  selected: FlowNode
  onAdd: (parentId: string, kind: NodeKind) => void
}

export function NodePalette({ selected, onAdd }: PaletteProps) {
  /* A branch's two paths are edited on the paths themselves, and nothing runs
     after an End - so neither can be an attach point. */
  const attachable = selected.kind !== 'end' && selected.kind !== 'branch'
  const parallel = attachable && selected.children.length > 0

  return (
    <aside className={styles.panel} aria-label="Node types">
      <div className={styles.header}>
        <div className={styles.title}>Node types</div>
        <div className={styles.hint}>
          {selected.kind === 'branch' ? (
            <>Select a step on the Yes or No path to add to it</>
          ) : selected.kind === 'end' ? (
            <>Nothing runs after an End — use the + above it</>
          ) : (
            <>
              {parallel ? 'Adds alongside the steps after ' : 'Adds after '}
              <span className={styles.target}>{selected.title}</span>
            </>
          )}
        </div>
      </div>

      {groups.map((group) => {
        const kinds = (Object.keys(kindMeta) as NodeKind[]).filter(
          (kind) => kindMeta[kind].group === group && kind !== 'end',
        )
        if (kinds.length === 0) return null

        return (
          <div className={styles.group} key={group}>
            <div className={styles.groupTitle}>{groupLabels[group]}</div>
            {kinds.map((kind) => {
              /* A flow has exactly one trigger, and it is already on the canvas. */
              const disabled = kind === 'trigger' || !attachable
              return (
                <button
                  type="button"
                  key={kind}
                  className={styles.item}
                  disabled={disabled}
                  onClick={() => onAdd(selected.id, kind)}
                  title={
                    kind === 'trigger'
                      ? 'A flow starts from one trigger'
                      : `Add ${kindMeta[kind].label}`
                  }
                >
                  <NodeGlyph type={glyphType(kind)} size="sm" />
                  <span className={styles.itemBody}>
                    <span className={styles.itemName}>{kindMeta[kind].label}</span>
                    <span className={styles.itemHint}>{kindMeta[kind].hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )
      })}

      <div className={styles.group}>
        <div className={styles.groupTitle}>Later</div>
        {comingSoon.map((item) => (
          <button type="button" className={styles.item} key={item.name} disabled>
            <NodeGlyph type={item.glyph} size="sm" />
            <span className={styles.itemBody}>
              <span className={styles.itemName}>{item.name}</span>
            </span>
            <span className={styles.soon}>Soon</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

function glyphType(kind: NodeKind) {
  const map = {
    trigger: 'trigger',
    email: 'send-email',
    task: 'create-task',
    notify: 'send-notification',
    status: 'update-status',
    allocate: 'allocate',
    branch: 'branch',
    delay: 'delay',
    end: 'end',
  } as const
  return map[kind]
}
