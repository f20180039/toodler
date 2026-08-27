import { kindMeta, summarise } from '../../lib/flowMeta'
import type {
  AnyParams,
  DelayMode,
  FlowNode,
  NotifyParams,
  Retry,
  EmailParams,
} from '../../types/flow'
import {
  Button,
  Checkbox,
  IconButton,
  Field,
  FieldGroup,
  InlineFields,
  NodeGlyph,
  NumberInput,
  SegmentedControl,
  Select,
  TextInput,
} from '../ui'
import styles from './ConfigPanel.module.css'

const TRIGGER_EVENTS = [
  'Enquiry submitted',
  'Application submitted',
  'Documents submitted',
  'Interview scheduled',
  'Interview completed',
  'Offer accepted',
  'Applicant enrolled',
  'Payment received',
  'Transfer request raised',
] as const

/** Pre-primary through to school-leaving, in journey order - a school picks a
 *  grade far more often than it types one. */
const GRADES = [
  'All grades',
  'Nursery',
  'LKG',
  'UKG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
] as const
const YEARS = ['2026–27', '2027–28'] as const

const RECIPIENTS = [
  'Parent / Guardian',
  'Applicant',
  'Admissions officer',
  'Assigned counsellor',
  'Class teacher',
  'Finance team',
  'Admissions team',
  'Admissions head',
  'Interview panel',
  'Destination coordinator',
  'House captain',
] as const

const SENDERS = ['Admissions team', 'Assigned counsellor', 'Principal', 'Finance team'] as const
const UNITS = ['minutes', 'hours', 'days'] as const
const WAIT_EVENTS = [
  'Documents submitted',
  'Payment received',
  'Interview completed',
  'Application submitted',
] as const
const ASSIGNEES = [
  'Admissions officer',
  'Assigned counsellor',
  'Admissions team',
  'Finance team',
  'Destination admissions officer',
  'Records team',
  'Interview panel',
  'Principal',
] as const
const PRIORITIES = ['Low', 'Medium', 'High'] as const
const CHANNELS = ['In-app', 'In-app + email'] as const
const NOTIFY_PRIORITIES = ['Normal', 'Urgent'] as const
const CONDITION_FIELDS = [
  'Document status',
  'Payment status',
  'Application status',
  'Interview status',
  'Decision',
  'Dues status',
  'Seat availability',
  'Transfer status',
  'Offer status',
  'Enrolment status',
  'House',
] as const
const OPERATORS = ['=', 'is not', 'is empty', 'is not empty'] as const

/** The school's own stage vocabulary. Picking a field narrows the values,
 *  which is the whole argument for admissions-native fields over generic
 *  CRM properties - the options can be right by default. */
const STATUS_VALUES: Record<string, readonly string[]> = {
  'Application status': [
    'Submitted',
    'Under review',
    'Shortlisted',
    'Needs a second look',
    'Waitlisted',
    'Rejected',
  ],
  'Document status': ['Complete', 'Incomplete', 'Rejected'],
  'Interview status': ['Scheduled', 'Completed', 'No show', 'Rescheduled'],
  'Payment status': ['Pending', 'Partial', 'Paid'],
  Decision: ['Offered', 'Waitlisted', 'Rejected'],
  'Dues status': ['Cleared', 'Pending'],
  'Seat availability': ['Available', 'Waitlist', 'No seat'],
  'Transfer status': ['Requested', 'Approved', 'Waitlisted', 'Declined', 'Completed'],
  'Offer status': ['Accepted', 'Declined', 'Expired'],
  'Enrolment status': ['Pending', 'Confirmed', 'Withdrawn'],
  House: ['Red', 'Yellow', 'Blue', 'Green'],
}

const ALLOCATE_TARGETS = ['House', 'Class & section'] as const
const ALLOCATE_METHODS = ['Balance across options', 'Match a sibling', 'Pick one option'] as const

/** The school's house colours, so the options read as houses rather than as
 *  four arbitrary words. Not design tokens - they belong to the school. */
const HOUSE_COLOURS: Record<string, string> = {
  Red: '#dc2626',
  Yellow: '#eab308',
  Blue: '#2563eb',
  Green: '#16a34a',
}

interface ConfigPanelProps {
  node: FlowNode
  onRename: (title: string) => void
  onParams: (patch: Partial<AnyParams>) => void
  onDelete: () => void
  onAddPath: () => void
  onUpdatePath: (index: number, patch: { label?: string; operator?: string; value?: string }) => void
  onRemovePath: (index: number) => void
}

export function ConfigPanel({
  node,
  onRename,
  onParams,
  onDelete,
  onAddPath,
  onUpdatePath,
  onRemovePath,
}: ConfigPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Step configuration">
      <header className={styles.header}>
        <NodeGlyph type={glyphType(node)} />
        <div>
          <div className={styles.kind}>{kindMeta[node.kind].label}</div>
          <div className={styles.summary}>{summarise(node)}</div>
        </div>
      </header>

      <div className={styles.body}>
        {node.kind !== 'end' && (
          <Field label="Step name" hint="Shown on the node in the diagram">
            <TextInput value={node.title} onValueChange={onRename} />
          </Field>
        )}

        {node.kind === 'trigger' && (
          <>
            <Field label="Starts when" hint="A flow has exactly one trigger">
              <Select
                value={node.params.event}
                options={TRIGGER_EVENTS}
                onValueChange={(event) => onParams({ event })}
              />
            </Field>
            <Field label="Grade">
              <Select
                value={node.params.grade}
                options={GRADES}
                onValueChange={(grade) => onParams({ grade })}
              />
            </Field>
            <Field label="Academic year">
              <Select
                value={node.params.academicYear}
                options={YEARS}
                onValueChange={(academicYear) => onParams({ academicYear })}
              />
            </Field>
          </>
        )}

        {node.kind === 'email' && (
          <>
            <Field label="To" hint="A role, resolved per applicant — not a fixed address">
              <Select
                value={node.params.recipient}
                options={RECIPIENTS}
                onValueChange={(recipient) => onParams({ recipient })}
              />
            </Field>
            <Field label="Subject">
              <TextInput
                value={node.params.subject}
                placeholder="We've received your application"
                onValueChange={(subject) => onParams({ subject })}
              />
            </Field>
            <Field label="From">
              <Select
                value={node.params.sender}
                options={SENDERS}
                onValueChange={(sender) => onParams({ sender })}
              />
            </Field>
            <RetryFields
              retry={node.params.retry}
              onChange={(retry) => onParams({ retry } as Partial<EmailParams>)}
              hint="If the email cannot be delivered, try again this many times."
            />
          </>
        )}

        {node.kind === 'delay' && (
          <>
            <Field label="Wait for">
              <SegmentedControl<DelayMode>
                label="Delay type"
                value={node.params.mode}
                segments={[
                  { value: 'duration', label: 'A duration' },
                  { value: 'until-event', label: 'An event' },
                  { value: 'until-date', label: 'A date' },
                ]}
                onChange={(mode) => onParams({ mode })}
              />
            </Field>

            {node.params.mode === 'duration' && (
              <>
                <Field label="How long">
                  <InlineFields>
                    <NumberInput
                      value={node.params.amount}
                      onValueChange={(amount) => onParams({ amount })}
                    />
                    <Select
                      value={node.params.unit}
                      options={UNITS}
                      onValueChange={(unit) => onParams({ unit })}
                    />
                  </InlineFields>
                </Field>
                <Checkbox
                  checked={node.params.excludeWeekends}
                  onCheckedChange={(excludeWeekends) => onParams({ excludeWeekends })}
                  label="Skip weekends"
                  hint="A Thursday + 3 days would otherwise land a task on Sunday, when the school is shut."
                />
              </>
            )}

            {node.params.mode === 'until-event' && (
              <>
                <Field label="Wait until" hint="Stops waiting the moment this happens">
                  <Select
                    value={node.params.event}
                    options={WAIT_EVENTS}
                    onValueChange={(event) => onParams({ event })}
                  />
                </Field>
                <Field label="Give up after" hint="Then the flow continues anyway">
                  <InlineFields>
                    <NumberInput
                      value={node.params.maxWaitDays}
                      onValueChange={(maxWaitDays) => onParams({ maxWaitDays })}
                    />
                    <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>days</span>
                  </InlineFields>
                </Field>
              </>
            )}

            {node.params.mode === 'until-date' && (
              <Field label="Date" hint="For a fixed deadline, e.g. the fee cut-off">
                <TextInput
                  value={node.params.date}
                  placeholder="15 April 2026"
                  onValueChange={(date) => onParams({ date })}
                />
              </Field>
            )}
          </>
        )}

        {node.kind === 'task' && (
          <>
            <Field label="Assign to">
              <Select
                value={node.params.assignee}
                options={ASSIGNEES}
                onValueChange={(assignee) => onParams({ assignee })}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={node.params.priority}
                options={PRIORITIES}
                onValueChange={(priority) => onParams({ priority })}
              />
            </Field>
            <Field label="Due in">
              <InlineFields>
                <NumberInput
                  value={node.params.dueInDays}
                  onValueChange={(dueInDays) => onParams({ dueInDays })}
                />
                <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>
                  days after this step
                </span>
              </InlineFields>
            </Field>
          </>
        )}

        {node.kind === 'notify' && (
          <>
            <Field label="Notify">
              <Select
                value={node.params.recipient}
                options={RECIPIENTS}
                onValueChange={(recipient) => onParams({ recipient })}
              />
            </Field>
            <Field label="Channel">
              <Select
                value={node.params.channel}
                options={CHANNELS}
                onValueChange={(channel) => onParams({ channel })}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={node.params.priority}
                options={NOTIFY_PRIORITIES}
                onValueChange={(priority) => onParams({ priority })}
              />
            </Field>
            <RetryFields
              retry={node.params.retry}
              onChange={(retry) => onParams({ retry } as Partial<NotifyParams>)}
              hint="Re-notify if nobody has opened it."
            />
          </>
        )}

        {node.kind === 'status' && (
          <>
            <Field label="Field">
              <Select
                value={node.params.field}
                options={CONDITION_FIELDS}
                onValueChange={(field) =>
                  /* Keep the value valid for the field that was just chosen. */
                  onParams({ field, value: STATUS_VALUES[field][0] })
                }
              />
            </Field>
            <Field label="New value" hint="Set the moment this step runs">
              <Select
                value={node.params.value}
                options={STATUS_VALUES[node.params.field] ?? []}
                onValueChange={(value) => onParams({ value })}
              />
            </Field>
          </>
        )}

        {node.kind === 'allocate' && (
          <>
            <Field label="Allocate">
              <Select
                value={node.params.target}
                options={ALLOCATE_TARGETS}
                onValueChange={(target) =>
                  onParams({
                    target,
                    /* Switching target switches the pool it draws from. */
                    options:
                      target === 'House'
                        ? ['Red', 'Yellow', 'Blue', 'Green']
                        : ['A', 'B', 'C'],
                    value: '',
                  })
                }
              />
            </Field>

            <Field label="How" hint="Balancing keeps the houses and sections even in size">
              <Select
                value={node.params.method}
                options={ALLOCATE_METHODS}
                onValueChange={(method) => onParams({ method })}
              />
            </Field>

            <Field
              label={node.params.target === 'House' ? 'Houses' : 'Sections'}
              hint="Comma separated"
            >
              <TextInput
                value={node.params.options.join(', ')}
                onValueChange={(raw) =>
                  onParams({
                    options: raw
                      .split(',')
                      .map((option) => option.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>

            <div className={styles.options}>
              {node.params.options.map((option) => (
                <span className={styles.option} key={option}>
                  {node.params.target === 'House' && (
                    <span
                      className={styles.dot}
                      style={{ background: HOUSE_COLOURS[option] ?? 'var(--c-neutral-400)' }}
                    />
                  )}
                  {option}
                </span>
              ))}
            </div>

            {node.params.method === 'Pick one option' && (
              <Field label="Which one">
                <Select
                  value={node.params.value}
                  options={['', ...node.params.options]}
                  onValueChange={(value) => onParams({ value })}
                />
              </Field>
            )}

            {node.params.method === 'Match a sibling' && (
              <p className={styles.note}>
                Siblings usually share a house. If the applicant has no sibling in the school, the
                flow falls back to balancing.
              </p>
            )}
          </>
        )}

        {node.kind === 'branch' && (
          <>
            <Field label="Check which field" hint="Every path tests this one field">
              <Select
                value={node.params.field}
                options={CONDITION_FIELDS}
                onValueChange={(field) => onParams({ field })}
              />
            </Field>

            <FieldGroup
              title={`Paths (${node.children.length})`}
              trailing={
                <Button size="sm" variant="ghost" iconLeft="plus" onClick={onAddPath}>
                  Add path
                </Button>
              }
            >
              {node.children.map((child, index) => {
                const values = STATUS_VALUES[node.params.field] ?? []
                const isLast = index === node.children.length - 1
                return (
                  <div className={styles.path} key={child.id}>
                    <div className={styles.pathHead}>
                      <span className={styles.pathIndex}>{index + 1}</span>
                      <TextInput
                        value={child.pathLabel ?? ''}
                        placeholder="Path name"
                        onValueChange={(label) => onUpdatePath(index, { label })}
                      />
                      <IconButton
                        icon="trash"
                        label={`Remove ${child.pathLabel ?? 'path'}`}
                        size="sm"
                        disabled={node.children.length <= 2}
                        onClick={() => onRemovePath(index)}
                      />
                    </div>
                    <InlineFields>
                      <Select
                        value={child.pathCondition?.operator ?? '='}
                        options={OPERATORS}
                        onValueChange={(operator) => onUpdatePath(index, { operator })}
                      />
                      {values.length > 0 ? (
                        <Select
                          value={child.pathCondition?.value ?? ''}
                          options={['', ...values]}
                          onValueChange={(value) => onUpdatePath(index, { value })}
                        />
                      ) : (
                        <TextInput
                          value={child.pathCondition?.value ?? ''}
                          placeholder="Value"
                          onValueChange={(value) => onUpdatePath(index, { value })}
                        />
                      )}
                    </InlineFields>
                    {!child.pathCondition?.value && (
                      <p className={styles.pathNote}>
                        {isLast
                          ? 'No value: this is the fallback path, taken when nothing else matches.'
                          : 'No value set — move this below the others if you meant it as the fallback.'}
                      </p>
                    )}
                  </div>
                )
              })}
            </FieldGroup>
          </>
        )}

        {node.kind === 'end' && (
          <p className={styles.note}>
            This path stops here. Nothing further is sent for an applicant who reaches it.
          </p>
        )}
      </div>

      {node.kind !== 'trigger' && (
        <div className={styles.footer}>
          <Button variant="danger" iconLeft="trash" fullWidth onClick={onDelete}>
            Delete this step
          </Button>
        </div>
      )}
    </aside>
  )
}

function RetryFields({
  retry,
  onChange,
  hint,
}: {
  retry: Retry
  onChange: (retry: Retry) => void
  hint: string
}) {
  return (
    <FieldGroup title="Retry">
      <Checkbox
        checked={retry.enabled}
        onCheckedChange={(enabled) => onChange({ ...retry, enabled })}
        label="Retry if it fails"
        hint={hint}
      />
      {retry.enabled && (
        <InlineFields>
          <Field label="Attempts">
            <NumberInput
              value={retry.attempts}
              min={1}
              max={5}
              onValueChange={(attempts) => onChange({ ...retry, attempts })}
            />
          </Field>
          <Field label="Every (hours)">
            <NumberInput
              value={retry.intervalHours}
              min={1}
              max={72}
              onValueChange={(intervalHours) => onChange({ ...retry, intervalHours })}
            />
          </Field>
        </InlineFields>
      )}
    </FieldGroup>
  )
}

function glyphType(node: FlowNode) {
  const map = {
    trigger: 'trigger',
    email: 'send-email',
    task: 'create-task',
    notify: 'send-notification',
    status: 'update-status',
    allocate: 'allocate',
    branch: 'branch',
    delay: 'delay',
    end: 'end',
  } as const
  return map[node.kind]
}
