import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivationDialog, ConfigPanel, FlowCanvas, NodePalette } from '../components/flow'
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
import { useFlowLocation } from '../hooks/useFlowLocation'
import { WORKFLOW_STATE_OPTIONS } from '../constants/admissions'
import { WorkflowStage, WorkflowState, type AdmissionField } from '../types/admissions'
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
  setBranchField,
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

/** Draft / Active / Paused, per workflow. Kept beside the trees rather than in
 *  them: the lifecycle is a property of the workflow, not of its diagram
 *  (→ D-10). */
type States = Record<string, WorkflowState>

const seedStates: States = Object.fromEntries(flows.map((flow) => [flow.id, flow.state]))

/** What each state means, said in the menu rather than assumed. */
const STATE_HINTS: Record<WorkflowState, string> = {
  [WorkflowState.Draft]: 'Being built. Nothing runs, and it can be saved incomplete.',
  [WorkflowState.Active]: 'Running for every applicant who matches the trigger.',
  [WorkflowState.Paused]: 'Stopped. Applicants already inside it stay where they are.',
}

/** How each state reads on the pill. */
const STATE_DOT: Record<WorkflowState, 'stateDraft' | 'stateActive' | 'statePaused'> = {
  [WorkflowState.Draft]: 'stateDraft',
  [WorkflowState.Active]: 'stateActive',
  [WorkflowState.Paused]: 'statePaused',
}

/** Where a bare URL lands: the flow the brief itself describes. */
const DEFAULT_FLOW_ID = 'application'

export function FlowBuilderPage() {
  const [trees, setTrees] = useState<Trees>(seedTrees)
  const [states, setStates] = useState<States>(seedStates)
  /* Set while the activation review is open. Nothing goes live until the user
     has read what the workflow will do (→ D-10). */
  const [reviewing, setReviewing] = useState(false)
  /* The step validator is called from the URL hook, which must not re-subscribe
     on every edit - so it reads the trees through a ref. */
  const treesRef = useRef(trees)
  treesRef.current = trees
  /* Snapshots of the whole map, so undo works across stages too. */
  const [past, setPast] = useState<Trees[]>([])
  const [future, setFuture] = useState<Trees[]>([])
  /* Which workflow is open and which step is selected live in the query string
     (?flow=...&step=...), so a diagram can be linked to and reloaded into. */
  const {
    flowId,
    stepId: selectedId,
    openFlow: openFlowAt,
    selectStep: setSelectedId,
  } = useFlowLocation({
    flows,
    fallbackFlowId: DEFAULT_FLOW_ID,
    isValidStep: (candidateFlowId, candidateStepId) => {
      const tree = treesRef.current[candidateFlowId]
      return Boolean(tree && findNode(tree, candidateStepId))
    },
  })

  const flow = flows.find((candidate) => candidate.id === flowId)!
  /* Stage order comes from the WorkflowStage enum, not from the order the flows
     happen to be declared in. A stage may own several workflows. */
  const stages = useMemo(() => stagesWithFlows(flows), [])
  const stageFlows = flowsInStage(flows, flow.stage)
  const root = trees[flowId]
  const selected = findNode(root, selectedId) ?? root
  const warnings = collectWarnings(root, nodeWarning)
  const state = states[flowId]

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
    openFlowAt(nextFlowId, trees[nextFlowId].id)
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

  function handleBranchField(field: AdmissionField) {
    commit(setBranchField(root, selected.id, field))
  }

  function handleUpdatePath(index: number, patch: PathPatch) {
    commit(updatePath(root, selected.id, index, patch))
  }

  function handleRemovePath(index: number) {
    commit(removePath(root, selected.id, index))
  }

  /* Any move *into* Active goes through the review. Pausing and going back to
     a draft are immediate: the response to an incident is "stop it now", and
     nothing about stopping needs a confirmation screen (→ D-10). */
  function handleStateChange(next: WorkflowState) {
    if (next === state) return
    if (next === WorkflowState.Active) {
      setReviewing(true)
      return
    }
    setStates((current) => ({ ...current, [flowId]: next }))
  }

  function handleActivate() {
    setStates((current) => ({ ...current, [flowId]: WorkflowState.Active }))
    setReviewing(false)
  }

  function handleReset() {
    setPast((history) => [...history, trees])
    setFuture([])
    setTrees((current) => ({ ...current, [flowId]: flow.root }))
    setStates((current) => ({ ...current, [flowId]: flow.state }))
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

        <Menu
          width={288}
          trigger={({ open, toggle }) => (
            <button
              type="button"
              className={[styles.state, open ? styles.stateOpen : ''].filter(Boolean).join(' ')}
              onClick={toggle}
              title="Draft, Active or Paused"
            >
              <span className={[styles.stateDot, styles[STATE_DOT[state]]].join(' ')} />
              {state}
              <Icon name="chevron-down" size={14} />
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuSection>Workflow state</MenuSection>
              {WORKFLOW_STATE_OPTIONS.map((candidate) => (
                <MenuItem
                  key={candidate}
                  label={candidate}
                  description={STATE_HINTS[candidate]}
                  selected={candidate === state}
                  onSelect={() => {
                    handleStateChange(candidate)
                    close()
                  }}
                />
              ))}
            </>
          )}
        </Menu>

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
          onBranchField={handleBranchField}
          onUpdatePath={handleUpdatePath}
          onRemovePath={handleRemovePath}
        />
      </div>

      {reviewing && (
        <ActivationDialog
          flowName={flow.name}
          root={root}
          onCancel={() => setReviewing(false)}
          onActivate={handleActivate}
        />
      )}
    </div>
  )
}
