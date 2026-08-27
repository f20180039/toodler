import { useNavigate } from 'react-router-dom'
import { countSteps, formatRelativeDate, workflowWarningCount } from '../../lib/workflow'
import type { Workflow } from '../../types/workflow'
import { Icon, IconButton, Menu, MenuDivider, MenuItem, StatusBadge, Table, Td, Th, Tr } from '../ui'
import styles from './WorkflowTable.module.css'

/** The workflow list from docs/07. Rows navigate; the row menu carries the
 *  secondary lifecycle actions so the primary path stays one click. */
export function WorkflowTable({ workflows }: { workflows: Workflow[] }) {
  const navigate = useNavigate()

  return (
    <Table label="Workflows">
      <thead>
        <tr>
          <Th>Workflow</Th>
          <Th>Trigger</Th>
          <Th>Status</Th>
          <Th>Steps</Th>
          <Th>Last updated</Th>
          <Th>Created by</Th>
          <Th alignEnd>
            <span className="visually-hidden">Actions</span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {workflows.map((workflow) => {
          const warnings = workflowWarningCount(workflow)
          return (
            <Tr key={workflow.id} onClick={() => navigate(`/workflows/${workflow.id}`)}>
              <Td>
                <span className={styles.name}>
                  <span className={styles.nameText}>{workflow.name}</span>
                  <span className={styles.description}>{workflow.description}</span>
                </span>
              </Td>
              <Td>
                <span className={styles.trigger}>
                  <Icon name="bolt" size={14} className={styles.triggerIcon} />
                  {workflow.trigger}
                </span>
              </Td>
              <Td>
                <StatusBadge status={workflow.status} />
                {warnings > 0 && (
                  <div className={styles.warning}>
                    <Icon name="alert-triangle" size={12} />
                    {warnings} to configure
                  </div>
                )}
              </Td>
              <Td>
                <span className={styles.steps}>{countSteps(workflow.steps)}</span>
              </Td>
              <Td>
                <span className={styles.meta}>{formatRelativeDate(workflow.updatedAt)}</span>
              </Td>
              <Td>
                <span className={styles.meta}>{workflow.createdBy}</span>
              </Td>
              <Td alignEnd>
                <div
                  className={styles.actions}
                  /* The row navigates, so the menu must not navigate with it. */
                  onClick={(event) => event.stopPropagation()}
                >
                  <Menu
                    align="end"
                    trigger={({ toggle }) => (
                      <IconButton
                        icon="more-horizontal"
                        label={`Actions for ${workflow.name}`}
                        size="sm"
                        onClick={toggle}
                      />
                    )}
                  >
                    {(close) => (
                      <>
                        <MenuItem
                          label="Open in builder"
                          icon="workflow"
                          onSelect={() => {
                            close()
                            navigate(`/workflows/${workflow.id}`)
                          }}
                        />
                        <MenuItem label="Rename" icon="pencil" onSelect={close} />
                        <MenuItem label="Duplicate" icon="copy" onSelect={close} />
                        {workflow.status === 'active' ? (
                          <MenuItem label="Pause" icon="pause" onSelect={close} />
                        ) : (
                          <MenuItem label="Activate" icon="play" onSelect={close} />
                        )}
                        <MenuDivider />
                        <MenuItem label="Delete" icon="trash" danger onSelect={close} />
                      </>
                    )}
                  </Menu>
                </div>
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}
