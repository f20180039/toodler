import { NodeGroup, NodeKind, type FlowNode } from '../../types/flow'
import { groupLabels, kindMeta, kindsInGroup } from '../../utils/nodeMeta'
import { nodeRetry, nodeWarning, retryLabel, summarise } from '../../utils/nodeSummary'
import {
  addStepHeading,
  addStepTooltip,
  canAddAfter,
  formatCondition,
  pathTone,
  type PathTone,
} from '../../utils/nodeView'
import { Icon, IconButton, Menu, MenuItem, MenuSection } from '../ui'
import { NodeGlyph } from './NodeGlyph'
import styles from './FlowCanvas.module.css'

/** The util returns a semantic tone; the stylesheet is the component's own
 *  business. Looking up styles[tone] directly silently yielded undefined. */
const TONE_CLASS: Record<PathTone, string> = {
  yes: styles.pathYes,
  no: styles.pathNo,
  other: styles.pathOther,
}

interface CanvasHandlers {
  selectedId: string
  onSelect: (id: string) => void
  onAdd: (parentId: string, kind: NodeKind) => void
  onInsertBefore: (targetId: string, kind: NodeKind) => void
  onDelete: (id: string) => void
}

export function FlowCanvas({ root, ...handlers }: CanvasHandlers & { root: FlowNode }) {
  return (
    <div className={styles.canvas}>
      <div className={styles.inner}>
        <Subtree node={root} {...handlers} />
      </div>
    </div>
  )
}

function Subtree({ node, ...handlers }: CanvasHandlers & { node: FlowNode }) {
  const { selectedId, onSelect, onAdd, onInsertBefore, onDelete } = handlers
  const hasChildren = node.children.length > 0
  const showAddAfter = canAddAfter(node)

  return (
    <div className={styles.subtree}>
      <NodeCard
        node={node}
        selected={node.id === selectedId}
        onSelect={() => onSelect(node.id)}
        onDelete={() => onDelete(node.id)}
      />

      {showAddAfter && (
        <>
          <span className={styles.stem} />
          <AddMenu node={node} mode="after" onPick={(kind) => onAdd(node.id, kind)} />
        </>
      )}

      {hasChildren && (
        <>
          <span className={styles.stem} />
          <div className={styles.children}>
            {node.children.map((child, index) => {
              const many = node.children.length > 1
              return (
                <div className={styles.childCol} key={child.id}>
                  {many && index > 0 && <span className={styles.railLeft} />}
                  {many && index < node.children.length - 1 && (
                    <span className={styles.railRight} />
                  )}
                  <span className={styles.childStem} />
                  {child.pathLabel && (
                    <span className={styles.pathTag}>
                      <span
                        className={[styles.pathLabel, TONE_CLASS[pathTone(child.pathLabel)]].join(' ')}
                      >
                        {child.pathLabel}
                      </span>
                      {/* With more than two paths the label alone is not enough
                          to tell you why this path was taken. A Parallel runs
                          every path, so there is no "why" to print. */}
                      {node.kind === NodeKind.Branch && node.children.length > 2 && (
                        <span className={styles.pathCond}>
                          {formatCondition(child.pathCondition)}
                        </span>
                      )}
                    </span>
                  )}
                  {/* Every connector carries its own insert point, so a step
                      goes *into* the chain rather than beside it. */}
                  <AddMenu
                    node={child}
                    mode="before"
                    onPick={(kind) => onInsertBefore(child.id, kind)}
                  />
                  <span className={styles.stem} />
                  <Subtree node={child} {...handlers} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function NodeCard({
  node,
  selected,
  onSelect,
  onDelete,
}: {
  node: FlowNode
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const meta = kindMeta[node.kind]
  const retry = nodeRetry(node)
  const warning = nodeWarning(node)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      className={[
        styles.card,
        selected ? styles.selected : '',
        node.kind === NodeKind.End ? styles.endCard : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <div className={styles.head}>
        <NodeGlyph kind={node.kind} size="sm" />
        <span className={styles.kind}>{meta.label}</span>
      </div>

      {node.kind !== NodeKind.End && (
        <>
          <div className={styles.title}>{node.title}</div>
          <div className={styles.summary}>{summarise(node)}</div>
        </>
      )}

      {(retry?.enabled || warning) && (
        <div className={styles.chips}>
          {retry?.enabled && (
            <span className={styles.chip}>
              <Icon name="undo" size={11} />
              {retryLabel(retry)}
            </span>
          )}
          {warning && (
            <span className={[styles.chip, styles.chipWarn].join(' ')}>
              <Icon name="alert-triangle" size={11} />
              {warning}
            </span>
          )}
        </div>
      )}

      {node.kind !== NodeKind.Trigger && (
        <span className={styles.delete}>
          <IconButton
            icon="trash"
            label={`Delete ${node.title}`}
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
          />
        </span>
      )}
    </div>
  )
}

const ADDABLE_GROUPS: readonly NodeGroup[] = [NodeGroup.Action, NodeGroup.Delay, NodeGroup.Logic]

function AddMenu({
  node,
  mode,
  onPick,
}: {
  node: FlowNode
  mode: 'after' | 'before'
  onPick: (kind: NodeKind) => void
}) {
  const heading = addStepHeading(node, mode)

  return (
    <Menu
      width={264}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          className={[styles.plus, open ? styles.plusOpen : ''].filter(Boolean).join(' ')}
          onClick={toggle}
          aria-label={heading}
          title={addStepTooltip(mode)}
        >
          <Icon name="plus" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          <MenuSection>{heading}</MenuSection>
          {ADDABLE_GROUPS.map((group) => (
            <div key={group}>
              <MenuSection>{groupLabels[group]}</MenuSection>
              {kindsInGroup(group).map((kind) => (
                  <MenuItem
                    key={kind}
                    label={kindMeta[kind].label}
                    description={kindMeta[kind].hint}
                    icon={kindMeta[kind].icon}
                    onSelect={() => {
                      onPick(kind)
                      close()
                    }}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </Menu>
  )
}

