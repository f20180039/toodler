import { Navigate, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/shell'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Icon,
  IconButton,
  Menu,
  MenuDivider,
  MenuItem,
  StatusBadge,
} from '../components/ui'
import { WorkflowStepList, WorkflowSwitcher } from '../components/workflow'
import { getWorkflow } from '../data/workflows'
import { countSteps, formatRelativeDate, workflowWarningCount } from '../lib/workflow'
import styles from './WorkflowBuilderPage.module.css'

export function WorkflowBuilderPage() {
  const { workflowId } = useParams()
  const workflow = getWorkflow(workflowId)

  if (!workflow) return <Navigate to="/workflows" replace />

  const warnings = workflowWarningCount(workflow)

  return (
    <>
      <header className={styles.header}>
        <Breadcrumb items={[{ label: 'Workflows', to: '/workflows' }, { label: workflow.name }]} />

        <div className={styles.titleRow}>
          <WorkflowSwitcher current={workflow} />
          <StatusBadge status={workflow.status} />
          {warnings > 0 && (
            <span className={styles.warnings}>
              <Icon name="alert-triangle" size={12} />
              {warnings} to configure
            </span>
          )}
          {workflow.status === 'draft' && (
            <span className={styles.unsaved}>
              <span className={styles.unsavedDot} />
              Unsaved changes
            </span>
          )}

          <span className={styles.spacer} />

          <div className={styles.actions}>
            <IconButton icon="undo" label="Undo" size="sm" disabled />
            <IconButton icon="redo" label="Redo" size="sm" disabled />
            <span className={styles.toolDivider} />
            <Button size="sm">Save draft</Button>
            {workflow.status === 'active' ? (
              <Button size="sm" iconLeft="pause">
                Pause
              </Button>
            ) : (
              <Button size="sm" variant="primary" iconLeft="play">
                Review &amp; activate
              </Button>
            )}
            <Menu
              align="end"
              trigger={({ toggle }) => (
                <IconButton
                  icon="more-horizontal"
                  label="Workflow actions"
                  size="sm"
                  onClick={toggle}
                />
              )}
            >
              {(close) => (
                <>
                  <MenuItem label="Rename workflow" icon="pencil" onSelect={close} />
                  <MenuItem label="Duplicate workflow" icon="copy" onSelect={close} />
                  <MenuDivider />
                  <MenuItem label="Delete workflow" icon="trash" danger onSelect={close} />
                </>
              )}
            </Menu>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <Card>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Trigger</span>
              <span className={styles.summaryValue}>{workflow.trigger}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Category</span>
              <span className={styles.summaryValue}>
                <Badge tone="action">{workflow.category}</Badge>
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Steps</span>
              <span className={styles.summaryValue}>{countSteps(workflow.steps)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Last updated</span>
              <span className={styles.summaryValue}>{formatRelativeDate(workflow.updatedAt)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Created by</span>
              <span className={styles.summaryValue}>{workflow.createdBy}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Workflow steps"
            subtitle={workflow.description}
            actions={<Button size="sm" iconLeft="plus">Add step</Button>}
          />
          <div style={{ padding: 'var(--space-5)' }}>
            <WorkflowStepList steps={workflow.steps} />
          </div>
        </Card>

        <Card>
          <div className={styles.note}>
            <Icon name="alert-triangle" size={16} className={styles.noteIcon} />
            <span>
              This is the reading view. The visual canvas, the node library and the per-node
              configuration panel are the next slice — this screen exists so navigation between
              workflows is real first.
            </span>
          </div>
        </Card>
      </div>
    </>
  )
}
