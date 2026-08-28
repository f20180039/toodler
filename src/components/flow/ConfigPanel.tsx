import { kindMeta } from '../../utils/nodeMeta'
import { summarise } from '../../utils/nodeSummary'
import { formatOptionList, isFallbackPath, parseOptionList } from '../../utils/nodeView'
import {
  ACADEMIC_YEAR_OPTIONS,
  ADJUST_BASIS_OPTIONS,
  ADJUST_KIND_SEGMENTS,
  ADJUST_VALIDITY_OPTIONS,
  ADMISSION_FIELD_OPTIONS,
  ALLOCATE_METHOD_OPTIONS,
  ALLOCATE_TARGET_OPTIONS,
  APPROVER_OPTIONS,
  ASSIGNEE_OPTIONS,
  CONCESSION_OPTIONS,
  CREDIT_SOURCE_OPTIONS,
  DEFAULT_HOUSES,
  DEFAULT_SECTIONS,
  DELAY_MODE_SEGMENTS,
  DELAY_UNIT_OPTIONS,
  FEE_HEAD_OPTIONS,
  fieldValueOptionsWithBlank,
  fieldValues,
  GRADE_OPTIONS,
  HOUSE_COLOURS,
  isNumericField,
  NOTIFY_CHANNEL_OPTIONS,
  NOTIFY_PRIORITY_OPTIONS,
  operatorsFor,
  RECIPIENT_OPTIONS,
  REENTRY_OPTIONS,
  SENDER_OPTIONS,
  STATUS_FIELD_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TRIGGER_EVENT_OPTIONS,
  WAIT_EVENT_OPTIONS,
} from '../../constants/admissions'
import {
  AdjustBasis,
  AdjustKind,
  AllocateMethod,
  AllocateTarget,
  Operator,
  type AdmissionField,
  type FieldValue,
  type House,
  type Role,
} from '../../types/admissions'
import {
  DelayMode,
  NodeKind,
  type AnyParams,
  type ConditionValue as ConditionValueType,
  type EmailParams,
  type FlowNode,
  type NotifyParams,
  type PathPatch,
  type Retry,
} from '../../types/flow'
import {
  Button,
  Checkbox,
  IconButton,
  Field,
  FieldGroup,
  InlineFields,
  NumberInput,
  SegmentedControl,
  Select,
  TextInput,
} from '../ui'
import { NodeGlyph } from './NodeGlyph'
import styles from './ConfigPanel.module.css'

interface ConfigPanelProps {
  node: FlowNode
  onRename: (title: string) => void
  onParams: (patch: Partial<AnyParams>) => void
  onDelete: () => void
  onAddPath: () => void
  onBranchField: (field: AdmissionField) => void
  onUpdatePath: (index: number, patch: PathPatch) => void
  onRemovePath: (index: number) => void
}

export function ConfigPanel({
  node,
  onRename,
  onParams,
  onDelete,
  onAddPath,
  onBranchField,
  onUpdatePath,
  onRemovePath,
}: ConfigPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Step configuration">
      <header className={styles.header}>
        <NodeGlyph kind={node.kind} />
        <div>
          <div className={styles.kind}>{kindMeta[node.kind].label}</div>
          <div className={styles.summary}>{summarise(node)}</div>
        </div>
      </header>

      <div className={styles.body}>
        {node.kind !== NodeKind.End && (
          <Field label="Step name" hint="Shown on the node in the diagram">
            <TextInput value={node.title} onValueChange={onRename} />
          </Field>
        )}

        {node.kind === NodeKind.Trigger && (
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
            <Field
              label="Can an applicant enter again?"
              hint="Once only is the safe default. Waitlist promotion needs Every time, because a released seat fires this trigger for the next family."
            >
              <Select
                value={node.params.reentry}
                options={REENTRY_OPTIONS}
                onValueChange={(reentry) => onParams({ reentry })}
              />
            </Field>
          </>
        )}

        {node.kind === NodeKind.Email && (
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

        {node.kind === NodeKind.Delay && (
          <>
            <Field label="Wait for">
              <SegmentedControl<DelayMode>
                label="Delay type"
                value={node.params.mode}
                segments={DELAY_MODE_SEGMENTS}
                onChange={(mode) => onParams({ mode })}
              />
            </Field>

            {node.params.mode === DelayMode.Duration && (
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

            {node.params.mode === DelayMode.UntilEvent && (
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

            {node.params.mode === DelayMode.UntilDate && (
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

        {node.kind === NodeKind.Task && (
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

        {node.kind === NodeKind.Notify && (
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

        {node.kind === NodeKind.Status && (
          <>
            <Field label="Field" hint="An overdue day count is derived, so nothing sets it">
              <Select
                value={node.params.field}
                options={STATUS_FIELD_OPTIONS}
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

        {node.kind === NodeKind.Allocate && (
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
                value={formatOptionList(node.params.options)}
                onValueChange={(raw) => onParams({ options: parseOptionList(raw) })}
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

            {node.params.method === AllocateMethod.PickOne && (
              <Field label="Which one">
                <Select
                  value={node.params.value}
                  options={['', ...node.params.options]}
                  onValueChange={(value) => onParams({ value })}
                />
              </Field>
            )}

            {node.params.method === AllocateMethod.MatchSibling && (
              <p className={styles.note}>
                Siblings usually share a house. If the applicant has no sibling in the school, the
                flow falls back to balancing.
              </p>
            )}
          </>
        )}

        {node.kind === NodeKind.AdjustFee && (
          <>
            <Field
              label="Adjustment kind"
              hint="One node, two arithmetics: a concession reduces what is owed, a credit deducts money already received."
            >
              <SegmentedControl<AdjustKind>
                label="Adjustment kind"
                value={node.params.kind}
                segments={ADJUST_KIND_SEGMENTS}
                onChange={(kind) => onParams({ kind })}
              />
            </Field>

            {node.params.kind === AdjustKind.Concession ? (
              <Field label="Concession" hint="Recorded on the applicant, so finance can report by category">
                <Select
                  value={node.params.concession}
                  options={CONCESSION_OPTIONS}
                  onValueChange={(concession) => onParams({ concession })}
                />
              </Field>
            ) : (
              <Field label="Credit from" hint="What the family has already paid">
                <Select
                  value={node.params.creditFrom}
                  options={CREDIT_SOURCE_OPTIONS}
                  onValueChange={(creditFrom) => onParams({ creditFrom })}
                />
              </Field>
            )}

            <Field label="Applies to" hint="The token fee is not offered: it is a deposit against a held seat, and it cannot be reduced.">
              <Select
                value={node.params.appliesTo}
                options={FEE_HEAD_OPTIONS}
                onValueChange={(appliesTo) => onParams({ appliesTo })}
              />
            </Field>

            {node.params.kind === AdjustKind.Concession ? (
              <>
                <Field label="Adjustment">
                  <Select
                    value={node.params.basis}
                    options={ADJUST_BASIS_OPTIONS}
                    onValueChange={(basis) => onParams({ basis })}
                  />
                </Field>

                <Field label="Value">
                  <InlineFields>
                    <NumberInput
                      value={node.params.value}
                      max={node.params.basis === AdjustBasis.Percentage ? 100 : 10000000}
                      onValueChange={(value) => onParams({ value })}
                    />
                    <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>
                      {node.params.basis === AdjustBasis.Percentage ? 'per cent' : 'rupees'}
                    </span>
                  </InlineFields>
                </Field>

                <FieldGroup title="Approval">
                  <Checkbox
                    checked={node.params.approvalRequired}
                    onCheckedChange={(approvalRequired) => onParams({ approvalRequired })}
                    label="Hold until someone signs it off"
                    hint="A concession is money leaving the school, so the workflow can wait for a named person."
                  />
                  {node.params.approvalRequired && (
                    <Field label="Approved by">
                      <Select<Role | ''>
                        value={node.params.approver}
                        options={['', ...APPROVER_OPTIONS]}
                        onValueChange={(approver) => onParams({ approver })}
                      />
                    </Field>
                  )}
                </FieldGroup>

                <Field label="Valid for" hint="A concession that silently persists across years is an audit problem">
                  <Select
                    value={node.params.validity}
                    options={ADJUST_VALIDITY_OPTIONS}
                    onValueChange={(validity) => onParams({ validity })}
                  />
                </Field>
              </>
            ) : (
              <p className={styles.note}>
                A credit needs no value and no approval — the amount is whatever the family already
                paid, deducted rather than discounted.
              </p>
            )}
          </>
        )}

        {node.kind === NodeKind.Branch && (
          <>
            <Field
              label="Check which field"
              hint="Every path tests this one field. Changing it clears the path values."
            >
              <Select
                value={node.params.field}
                options={ADMISSION_FIELD_OPTIONS}
                onValueChange={onBranchField}
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
                      {/* Only the operators the chosen field accepts: `= Paid`
                          is nonsense on a day count, `more than` on a status. */}
                      <Select
                        value={child.pathCondition?.operator ?? Operator.Equals}
                        options={operatorsFor(node.params.field)}
                        onValueChange={(operator) => onUpdatePath(index, { operator })}
                      />
                      <ConditionValue
                        field={node.params.field}
                        value={child.pathCondition?.value ?? ''}
                        onChange={(value) => onUpdatePath(index, { value })}
                      />
                    </InlineFields>
                    {isFallbackPath(child.pathCondition) && (
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

        {node.kind === NodeKind.End && (
          <p className={styles.note}>
            This path stops here. Nothing further is sent for an applicant who reaches it.
          </p>
        )}
      </div>

      {node.kind !== NodeKind.Trigger && (
        <div className={styles.footer}>
          <Button variant="danger" iconLeft="trash" fullWidth onClick={onDelete}>
            Delete this step
          </Button>
        </div>
      )}
    </aside>
  )
}

/** A status is picked from the field's own closed list; an overdue day count is
 *  typed, because it is a number rather than one of a handful of values. Blank
 *  means the fallback either way (→ D-17, D-23, D-33). */
function ConditionValue({
  field,
  value,
  onChange,
}: {
  field: AdmissionField
  value: ConditionValueType
  onChange: (value: ConditionValueType) => void
}) {
  if (!isNumericField(field)) {
    return (
      <Select
        value={(value === '' ? '' : String(value)) as FieldValue | ''}
        options={fieldValueOptionsWithBlank(field)}
        onValueChange={onChange}
      />
    )
  }

  return (
    <>
      <TextInput
        value={value === '' ? '' : String(value)}
        placeholder="Blank = fallback"
        onValueChange={(raw) => {
          const trimmed = raw.trim()
          const parsed = Number(trimmed)
          onChange(trimmed === '' || Number.isNaN(parsed) ? '' : parsed)
        }}
      />
      <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>days</span>
    </>
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

