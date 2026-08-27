import { useCallback, useEffect, useMemo, useState } from 'react'
import { ConfigPanel, FlowCanvas, NodePalette } from '../components/flow'
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  SegmentedControl,
  type Segment,
} from '../components/ui'
import { flows } from '../data/flows'
import { WorkflowStage } from '../types/admissions'
import { nodeWarning } from '../utils/nodeSummary'
import {
  addChild,
  addPath,
  collectWarnings,
  countNodes,
  deleteNode,
  findNode,
  insertBefore,
  removePath,
  renameNode,
  updateParams,
  updatePath,
} from '../utils/flowTree'
import type { AnyParams, FlowNode, NodeKind, PathPatch } from '../types/flow'
import { flowsInStage, stagesWithFlows } from '../utils/nodeView'
import styles from './FlowBuilderPage.module.css'

/** Every stage keeps its own edited tree, so switching stages does not throw
 *  away what you just changed. */
type Trees = Record<string, FlowNode>

const seedTrees: Trees = Object.fromEntries(flows.map((flow) => [flow.id, flow.root]))

export function FlowBuilderPage() {
  const [trees, setTrees] = useState<Trees>(seedTrees)
  /* Snapshots of the whole map, so undo works across stages too. */
  const [past, setPast] = useState<Trees[]>([])
  const [future, setFuture] = useState<Trees[]>([])
  const [flowId, setFlowId] = useState(flows[1].id) // Application acknowledgement
  const [selectedId, setSelectedId] = useState(flows[1].root.id)

  const flow = flows.find((candidate) => candidate.id === flowId)!
  /* Stage order comes from the WorkflowStage enum, not from the order the flows
     happen to be declared in. A stage may own several workflows. */
  const stages = useMemo(() => stagesWithFlows(flows), [])
  const stageFlows = flowsInStage(flows, flow.stage)
  const root = trees[flowId]
  const selected = findNode(root, selectedId) ?? root
  const warnings = collectWarnings(root, nodeWarning)

  const stageSegments: Segment<WorkflowStage>[] = useMemo(
    () => stages.map((stage) => ({ value: stage, label: stage })),
    [stages],
  )

  /** Every edit goes through here, which is what makes undo reliable. */
  const commit = useCallback(
    (next: FlowNode) => {
      setPast((history) => [...history, trees])
      setFuture([])
      setTrees((current) => ({ ...current, [flowId]: next }))
    },
    [flowId, trees],
  )

  const undo = useCallback(() => {
    setPast((history) => {
      if (history.length === 0) return history
      setFuture((forward) => [trees, ...forward])
      setTrees(history[history.length - 1])
      return history.slice(0, -1)
    })
  }, [trees])

  const redo = useCallback(() => {
    setFuture((forward) => {
      if (forward.length === 0) return forward
      setPast((history) => [...history, trees])
      setTrees(forward[0])
      return forward.slice(1)
    })
  }, [trees])

  /* Cmd/Ctrl+Z and Shift+Cmd/Ctrl+Z - a live demo is exactly where a mis-click
     needs to be undoable without having to explain it away. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') return
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  function openFlow(nextFlowId: string) {
    setFlowId(nextFlowId)
    setSelectedId(trees[nextFlowId].id)
  }

  function handleStageChange(nextStage: WorkflowStage) {
    const first = flows.find((candidate) => candidate.stage === nextStage)
    if (first) openFlow(first.id)
  }

  function handleAdd(parentId: string, kind: NodeKind) {
    const next = addChild(root, parentId, kind)
    commit(next)
    /* Select what was just added, so its parameters are immediately editable. */
    const parent = findNode(next, parentId)
    const added = parent?.children[parent.children.length - 1]
    if (added) setSelectedId(added.id)
  }

  function handleInsertBefore(targetId: string, kind: NodeKind) {
    const { tree, insertedId } = insertBefore(root, targetId, kind)
    commit(tree)
    setSelectedId(insertedId)
  }

  function handleDelete(id: string) {
    commit(deleteNode(root, id))
    if (selectedId === id) setSelectedId(root.id)
  }

  function handleRename(title: string) {
    commit(renameNode(root, selected.id, title))
  }

  function handleParams(patch: Partial<AnyParams>) {
    commit(updateParams(root, selected.id, patch))
  }

  function handleAddPath() {
    const { tree, addedId } = addPath(root, selected.id)
    commit(tree)
    setSelectedId(addedId)
  }

  function handleUpdatePath(index: number, patch: PathPatch) {
    commit(updatePath(root, selected.id, index, patch))
  }

  function handleRemovePath(index: number) {
    commit(removePath(root, selected.id, index))
  }

  function handleReset() {
    setPast((history) => [...history, trees])
    setFuture([])
    setTrees((current) => ({ ...current, [flowId]: flow.root }))
    setSelectedId(flow.root.id)
  }

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <Icon name="workflow" size={15} />
          </span>
          <span className={styles.brandText}>Admission workflows</span>
        </div>

        <span className={styles.divider} />

        <SegmentedControl
          label="Admission stage"
          segments={stageSegments}
          value={flow.stage}
          onChange={handleStageChange}
        />

        {stageFlows.length > 1 ? (
          <Menu
            width={300}
            trigger={({ open, toggle }) => (
              <button
                type="button"
                className={[styles.flowPicker, open ? styles.flowPickerOpen : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={toggle}
              >
                {flow.name}
                <span className={styles.flowCount}>
                  {stageFlows.findIndex((candidate) => candidate.id === flow.id) + 1} of{' '}
                  {stageFlows.length}
                </span>
                <Icon name="chevron-down" size={14} />
              </button>
            )}
          >
            {(close) => (
              <>
                <MenuSection>Workflows in {flow.stage}</MenuSection>
                {stageFlows.map((candidate) => (
                  <MenuItem
                    key={candidate.id}
                    label={candidate.name}
                    selected={candidate.id === flow.id}
                    onSelect={() => {
                      openFlow(candidate.id)
                      close()
                    }}
                  />
                ))}
              </>
            )}
          </Menu>
        ) : (
          <span className={styles.flowName}>{flow.name}</span>
        )}

        <span className={styles.spacer} />

        <div className={styles.meta}>
          <span>{countNodes(root)} steps</span>
          {warnings > 0 && (
            <span className={styles.warn}>
              <Icon name="alert-triangle" size={12} />
              {warnings} to configure
            </span>
          )}
          <span className={styles.divider} />
          <IconButton
            icon="undo"
            label="Undo (Cmd+Z)"
            size="sm"
            disabled={past.length === 0}
            onClick={undo}
          />
          <IconButton
            icon="redo"
            label="Redo (Shift+Cmd+Z)"
            size="sm"
            disabled={future.length === 0}
            onClick={redo}
          />
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Reset stage
          </Button>
        </div>
      </header>

      <div className={styles.workspace}>
        <NodePalette selected={selected} onAdd={handleAdd} />
        <FlowCanvas
          root={root}
          selectedId={selected.id}
          onSelect={setSelectedId}
          onAdd={handleAdd}
          onInsertBefore={handleInsertBefore}
          onDelete={handleDelete}
        />
        <ConfigPanel
          node={selected}
          onRename={handleRename}
          onParams={handleParams}
          onDelete={() => handleDelete(selected.id)}
          onAddPath={handleAddPath}
          onUpdatePath={handleUpdatePath}
          onRemovePath={handleRemovePath}
        />
      </div>
    </div>
  )
}
