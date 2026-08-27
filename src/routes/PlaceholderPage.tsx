import { useNavigate } from 'react-router-dom'
import { Page } from '../components/shell'
import { Button, Card, EmptyState, PageHeader, type IconName } from '../components/ui'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: IconName
  emptyTitle: string
  emptyDescription: string
}

/** Nav destinations that exist so the shell is honest about its own shape.
 *  Labelled as not-built rather than faked (docs/07). */
export function PlaceholderPage({
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
}: PlaceholderPageProps) {
  const navigate = useNavigate()
  return (
    <Page>
      <PageHeader title={title} description={description} />
      <Card>
        <EmptyState
          icon={icon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button iconLeft="workflow" onClick={() => navigate('/workflows')}>
              Back to workflows
            </Button>
          }
        />
      </Card>
    </Page>
  )
}
