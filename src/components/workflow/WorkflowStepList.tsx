import { nodeMeta } from '../../lib/nodeMeta'
import type { WorkflowStep } from '../../types/workflow'
import { Icon, NodeGlyph } from '../ui'
import styles from './WorkflowStepList.module.css'

/** A read-only, top-to-bottom reading of a workflow. It is deliberately not the
 *  canvas: it exists so navigation between workflows is meaningful before the
 *  canvas slice lands, and it already proves the D-07 rule - every node shows
 *  its configuration, never the word "Configured". */
export function WorkflowStepList({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className={styles.list}>
      {steps.map((step, index) => (
        <div key={step.id}>
          {index > 0 && <div className={styles.connector} />}
          <StepRow step={step} />
          {(step.yes || step.no) && (
            <div className={styles.paths}>
              <Path label="Yes" tone="yes" steps={step.yes ?? []} />
              <Path label="No" tone="no" steps={step.no ?? []} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StepRow({ step }: { step: WorkflowStep }) {
  const meta = nodeMeta[step.type]
  return (
    <div className={[styles.step, step.type === 'end' ? styles.end : ''].filter(Boolean).join(' ')}>
      <NodeGlyph type={step.type} />
      <div className={styles.body}>
        <span className={styles.type}>{meta.label}</span>
        <span className={styles.title}>{step.title}</span>
        <span className={styles.summary}>{step.summary}</span>
      </div>
      <span className={styles.spacer} />
      {step.warning && (
        <span className={styles.warning}>
          <Icon name="alert-triangle" size={12} />
          {step.warning}
        </span>
      )}
    </div>
  )
}

function Path({
  label,
  tone,
  steps,
}: {
  label: string
  tone: 'yes' | 'no'
  steps: WorkflowStep[]
}) {
  return (
    <div className={styles.path}>
      <span className={[styles.pathLabel, styles[tone]].join(' ')}>{label}</span>
      <WorkflowStepList steps={steps} />
    </div>
  )
}
