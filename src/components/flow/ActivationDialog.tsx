import { useEffect } from 'react'
import { reviewFlow, type ReviewLine } from '../../utils/activation'
import type { FlowNode } from '../../types/flow'
import { Button, Icon, IconButton } from '../ui'
import styles from './ActivationDialog.module.css'

interface ActivationDialogProps {
  flowName: string
  root: FlowNode
  onCancel: () => void
  onActivate: () => void
}

/** The review that stands between a draft and three hundred emails.
 *
 *  It is deliberately a *read* of the whole workflow rather than a confirmation
 *  prompt: the question a school administrator is actually asking is "who does
 *  this write to, and what does it change?", and the answer is only credible if
 *  it is assembled from the nodes rather than written by hand (→ D-10).
 *  Incomplete steps block activation — warnings are advisory while drafting and
 *  binding here (→ D-09). */
export function ActivationDialog({
  flowName,
  root,
  onCancel,
  onActivate,
}: ActivationDialogProps) {
  const review = reviewFlow(root)
  const blocked = review.incomplete.length > 0

  /* Escape closes it: the whole point is that nothing happens by accident. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Activate ${flowName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Before this goes live</div>
            <h2 className={styles.title}>{flowName}</h2>
          </div>
          <IconButton icon="x" label="Close" size="sm" onClick={onCancel} />
        </header>

        <div className={styles.body}>
          <p className={styles.starts}>
            <Icon name="bolt" size={13} />
            Runs for every applicant matching <strong>{review.starts}</strong>
          </p>

          {blocked && (
            <section className={[styles.section, styles.blocking].join(' ')}>
              <h3 className={styles.sectionTitle}>
                <Icon name="alert-triangle" size={13} />
                {review.incomplete.length} step{review.incomplete.length === 1 ? '' : 's'} still
                incomplete
              </h3>
              <Lines lines={review.incomplete} />
              <p className={styles.note}>
                A draft can be saved in any state. Activation is where completeness is enforced.
              </p>
            </section>
          )}

          <Group
            title="Goes out to families and teams"
            empty="Nothing leaves the school."
            lines={review.outward}
          />
          <Group title="Work it creates" empty="It creates no tasks." lines={review.work} />
          <Group title="What it changes" empty="It changes no records." lines={review.changes} />
        </div>

        <footer className={styles.footer}>
          <Button variant="ghost" onClick={onCancel}>
            Keep it a draft
          </Button>
          <Button onClick={onActivate} disabled={blocked}>
            {blocked ? 'Fix the steps above first' : 'Activate this workflow'}
          </Button>
        </footer>
      </div>
    </div>
  )
}

function Group({ title, empty, lines }: { title: string; empty: string; lines: ReviewLine[] }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        {title}
        <span className={styles.count}>{lines.length}</span>
      </h3>
      {lines.length === 0 ? <p className={styles.note}>{empty}</p> : <Lines lines={lines} />}
    </section>
  )
}

function Lines({ lines }: { lines: ReviewLine[] }) {
  return (
    <ul className={styles.list}>
      {lines.map((line) => (
        <li className={styles.line} key={line.id}>
          <span className={styles.lineTitle}>{line.title}</span>
          <span className={styles.lineDetail}>{line.detail}</span>
        </li>
      ))}
    </ul>
  )
}
