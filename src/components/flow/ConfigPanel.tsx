import { kindMeta, summarise } from '../../lib/flowMeta'
import {
  ACADEMIC_YEAR_OPTIONS,
  ADMISSION_FIELD_OPTIONS,
  ALLOCATE_METHOD_OPTIONS,
  ALLOCATE_TARGET_OPTIONS,
  ASSIGNEE_OPTIONS,
  DEFAULT_HOUSES,
  DEFAULT_SECTIONS,
  DELAY_UNIT_OPTIONS,
  fieldValues,
  GRADE_OPTIONS,
  HOUSE_COLOURS,
  NOTIFY_CHANNEL_OPTIONS,
  NOTIFY_PRIORITY_OPTIONS,
  OPERATOR_OPTIONS,
  RECIPIENT_OPTIONS,
  SENDER_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TRIGGER_EVENT_OPTIONS,
  WAIT_EVENT_OPTIONS,
} from '../../constants/admissions'
import { AllocateTarget, type House } from '../../types/admissions'
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
                options={TRIGGER_EVENT_OPTIONS}
                onValueChange={(event) => onParams({ event })}
              />
            </Field>
            <Field label="Grade">
              <Select
                value={node.params.grade}
                options={GRADE_OPTIONS}
                onValueChange={(grade) => onParams({ grade })}
              />
            </Field>
            <Field label="Academic year">
              <Select
                value={node.params.academicYear}
                options={ACADEMIC_YEAR_OPTIONS}
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
                options={RECIPIENT_OPTIONS}
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
                options={SENDER_OPTIONS}
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
                      options={DELAY_UNIT_OPTIONS}
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
                    options={WAIT_EVENT_OPTIONS}
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
                options={ASSIGNEE_OPTIONS}
                onValueChange={(assignee) => onParams({ assignee })}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={node.params.priority}
                options={TASK_PRIORITY_OPTIONS}
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
                options={RECIPIENT_OPTIONS}
                onValueChange={(recipient) => onParams({ recipient })}
              />
            </Field>
            <Field label="Channel">
              <Select
                value={node.params.channel}
                options={NOTIFY_CHANNEL_OPTIONS}
                onValueChange={(channel) => onParams({ channel })}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={node.params.priority}
                options={NOTIFY_PRIORITY_OPTIONS}
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
                options={ADMISSION_FIELD_OPTIONS}
                onValueChange={(field) =>
                  /* Keep the value valid for the field that was just chosen. */
                  onParams({ field, value: fieldValues(field)[0] })
                }
              />
            </Field>
            <Field label="New value" hint="Set the moment this step runs">
              <Select
                value={node.params.value}
                options={fieldValues(node.params.field)}
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
                options={ALLOCATE_TARGET_OPTIONS}
                onValueChange={(target) =>
                  onParams({
                    target,
                    /* Switching target switches the pool it draws from. */
                    options: [
                      ...(target === AllocateTarget.House ? DEFAULT_HOUSES : DEFAULT_SECTIONS),
                    ],
                    value: '',
                  })
                }
              />
            </Field>

            <Field label="How" hint="Balancing keeps the houses and sections even in size">
              <Select
                value={node.params.method}
                options={ALLOCATE_METHOD_OPTIONS}
                onValueChange={(method) => onParams({ method })}
              />
            </Field>

            <Field
              label={node.params.target === AllocateTarget.House ? 'Houses' : 'Sections'}
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
                  {node.params.target === AllocateTarget.House && (
                    <span
                      className={styles.dot}
                      style={{ background: HOUSE_COLOURS[option as House] ?? 'var(--c-neutral-400)' }}
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
                options={ADMISSION_FIELD_OPTIONS}
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
                const values = fieldValues(node.params.field)
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
                        options={OPERATOR_OPTIONS}
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
