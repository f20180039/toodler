import { useNavigate } from 'react-router-dom'
import { workflows } from '../../data/workflows'
import { countSteps } from '../../lib/workflow'
import type { Workflow } from '../../types/workflow'
import { Icon, IconButton, Menu, MenuDivider, MenuItem, MenuSection } from '../ui'
import styles from './WorkflowSwitcher.module.css'

/** Moves between workflows without a trip back to the list. Paired with
 *  previous/next controls, because comparing two workflows side by side is the
 *  thing an admissions head actually does during a review. */
export function WorkflowSwitcher({ current }: { current: Workflow }) {
  const navigate = useNavigate()
  const index = workflows.findIndex((workflow) => workflow.id === current.id)
  const previous = workflows[index - 1]
  const next = workflows[index + 1]

  return (
    <div className={styles.group}>
      <IconButton
        icon="chevron-down"
        label={previous ? `Previous workflow: ${previous.name}` : 'No previous workflow'}
        size="sm"
        disabled={!previous}
        style={{ transform: 'rotate(90deg)' }}
        onClick={() => previous && navigate(`/workflows/${previous.id}`)}
      />
      <IconButton
        icon="chevron-down"
        label={next ? `Next workflow: ${next.name}` : 'No next workflow'}
        size="sm"
        disabled={!next}
        style={{ transform: 'rotate(-90deg)' }}
        onClick={() => next && navigate(`/workflows/${next.id}`)}
      />

      <Menu
        width={320}
        trigger={({ open, toggle }) => (
          <button
            type="button"
            className={[styles.trigger, open ? styles.triggerOpen : ''].filter(Boolean).join(' ')}
            onClick={toggle}
            aria-label="Switch workflow"
          >
            <span className={styles.name}>{current.name}</span>
            <Icon name="chevron-down" size={16} />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuSection>Switch workflow</MenuSection>
            {workflows.map((workflow) => (
              <MenuItem
                key={workflow.id}
                label={workflow.name}
                description={workflow.trigger}
                selected={workflow.id === current.id}
                trailing={
                  <span className={styles.steps}>{countSteps(workflow.steps)} steps</span>
                }
                icon={undefined}
                onSelect={() => {
                  close()
                  navigate(`/workflows/${workflow.id}`)
                }}
              />
            ))}
            <MenuDivider />
            <MenuItem
              label="View all workflows"
              icon="workflow"
              onSelect={() => {
                close()
                navigate('/workflows')
              }}
            />
          </>
        )}
      </Menu>
    </div>
  )
}
