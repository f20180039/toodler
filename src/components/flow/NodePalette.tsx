import { CONTAINER_KINDS, NodeGroup, NodeKind, type FlowNode } from '../../types/flow'
import { groupLabels, kindMeta, kindsInGroup } from '../../utils/nodeMeta'
import { isAttachable } from '../../utils/nodeView'
import { NodeGlyph } from './NodeGlyph'
import styles from './NodePalette.module.css'

const GROUPS: readonly NodeGroup[] = Object.values(NodeGroup)

/** Nodes that are designed for but not built. They stay visible so the node
 *  vocabulary reads as extensible rather than as everything there will ever be. */
const COMING_SOON: readonly { name: string; kind: NodeKind }[] = [
  { name: 'Send WhatsApp', kind: NodeKind.Email },
  { name: 'Send SMS', kind: NodeKind.Email },
  { name: 'Schedule interview', kind: NodeKind.Delay },
  { name: 'Request documents', kind: NodeKind.Task },
]

interface PaletteProps {
  /** The node a click will attach to. */
  selected: FlowNode
  onAdd: (parentId: string, kind: NodeKind) => void
}

export function NodePalette({ selected, onAdd }: PaletteProps) {
  /* A branch's paths are edited on the paths themselves, and nothing runs after
     an End - so neither can be an attach point. */
  const attachable = isAttachable(selected)
  /* Something already follows, so a new step goes *into* the chain. */
  const splices = attachable && selected.children.length > 0

  return (
    <aside className={styles.panel} aria-label="Node types">
      <div className={styles.header}>
        <div className={styles.title}>Node types</div>
        <div className={styles.hint}>
          {CONTAINER_KINDS.includes(selected.kind) ? (
            <>Select a step on one of its paths to add to it</>
          ) : selected.kind === NodeKind.End ? (
            <>Nothing runs after an End — use the + on the connector above it</>
          ) : (
            <>
              {splices ? 'Inserts after ' : 'Adds after '}
              <span className={styles.target}>{selected.title}</span>
            </>
          )}
        </div>
      </div>

      {GROUPS.map((group) => {
        /* The trigger is listed for completeness but never addable: a flow has
           exactly one, and it is already on the canvas. */
        const kinds =
          group === NodeGroup.Trigger ? [NodeKind.Trigger] : [...kindsInGroup(group)]
        if (kinds.length === 0) return null

        return (
          <div className={styles.group} key={group}>
            <div className={styles.groupTitle}>{groupLabels[group]}</div>
            {kinds.map((kind) => {
              /* A flow has exactly one trigger, and it is already on the canvas. */
              const disabled = kind === NodeKind.Trigger || !attachable
              return (
                <button
                  type="button"
                  key={kind}
                  className={styles.item}
                  disabled={disabled}
                  onClick={() => onAdd(selected.id, kind)}
                  title={
                    kind === NodeKind.Trigger
                      ? 'A flow starts from one trigger'
                      : `Add ${kindMeta[kind].label}`
                  }
                >
                  <NodeGlyph kind={kind} size="sm" />
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
        {COMING_SOON.map((item) => (
          <button type="button" className={styles.item} key={item.name} disabled>
            <NodeGlyph kind={item.kind} size="sm" />
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

