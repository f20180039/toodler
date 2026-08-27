import { useMemo, useState } from 'react'
import { Page } from '../components/shell'
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Menu,
  MenuItem,
  MenuSection,
  PageHeader,
  SearchInput,
  SegmentedControl,
  type Segment,
} from '../components/ui'
import { WorkflowTable } from '../components/workflow'
import { workflows } from '../data/workflows'
import type { WorkflowCategory, WorkflowStatus } from '../types/workflow'
import styles from './WorkflowListPage.module.css'

type StatusFilter = WorkflowStatus | 'all'
type CategoryFilter = WorkflowCategory | 'all'

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'All categories',
  admissions: 'Admissions',
  marketing: 'Marketing',
  enrolment: 'Enrolment',
}

export function WorkflowListPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')

  const statusSegments: Segment<StatusFilter>[] = useMemo(
    () => [
      { value: 'all', label: 'All', count: workflows.length },
      {
        value: 'active',
        label: 'Active',
        count: workflows.filter((workflow) => workflow.status === 'active').length,
      },
      {
        value: 'draft',
        label: 'Draft',
        count: workflows.filter((workflow) => workflow.status === 'draft').length,
      },
      {
        value: 'paused',
        label: 'Paused',
        count: workflows.filter((workflow) => workflow.status === 'paused').length,
      },
    ],
    [],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return workflows.filter((workflow) => {
      const matchesQuery =
        !needle ||
        workflow.name.toLowerCase().includes(needle) ||
        workflow.description.toLowerCase().includes(needle) ||
        workflow.trigger.toLowerCase().includes(needle)
      const matchesStatus = status === 'all' || workflow.status === status
      const matchesCategory = category === 'all' || workflow.category === category
      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [query, status, category])

  return (
    <Page>
      <PageHeader
        title="Workflows"
        description="Automate the admission journey from enquiry to payment. Workflows here are created and reviewed; nothing runs until you activate it."
        actions={
          <>
            <Button iconLeft="templates">Browse templates</Button>
            <Button variant="primary" iconLeft="plus">
              Create workflow
            </Button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchInput
            value={query}
            onValueChange={setQuery}
            label="Search workflows"
            placeholder="Search by name or trigger"
          />
        </div>
        <SegmentedControl
          segments={statusSegments}
          value={status}
          onChange={setStatus}
          label="Filter by status"
        />
        <Menu
          width={220}
          trigger={({ toggle }) => (
            <button type="button" className={styles.filterTrigger} onClick={toggle}>
              {categoryLabels[category]}
              <Icon name="chevron-down" size={14} />
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuSection>Category</MenuSection>
              {(Object.keys(categoryLabels) as CategoryFilter[]).map((key) => (
                <MenuItem
                  key={key}
                  label={categoryLabels[key]}
                  selected={key === category}
                  onSelect={() => {
                    setCategory(key)
                    close()
                  }}
                />
              ))}
            </>
          )}
        </Menu>
        <span className={styles.spacer} />
        <span className={styles.count}>
          {visible.length} of {workflows.length} workflows
        </span>
      </div>

      <Card>
        {visible.length > 0 ? (
          <WorkflowTable workflows={visible} />
        ) : (
          <EmptyState
            icon="search"
            title="No workflows match those filters"
            description="Try a different search term, or clear the status and category filters."
            action={
              <Button
                onClick={() => {
                  setQuery('')
                  setStatus('all')
                  setCategory('all')
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </Card>
    </Page>
  )
}
