import type { ReactNode } from 'react'
import styles from './Field.module.css'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  )
}

export function TextInput({
  value,
  onValueChange,
  placeholder,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      className={styles.control}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onValueChange(event.target.value)}
    />
  )
}

export function NumberInput({
  value,
  onValueChange,
  min = 0,
  max = 999,
}: {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
}) {
  return (
    <input
      type="number"
      className={[styles.control, styles.number].join(' ')}
      value={value}
      min={min}
      max={max}
      onChange={(event) => onValueChange(Number(event.target.value))}
    />
  )
}

export function Select<T extends string>({
  value,
  options,
  onValueChange,
}: {
  value: T
  options: readonly T[]
  onValueChange: (value: T) => void
}) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(event) => onValueChange(event.target.value as T)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  hint,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <label className={styles.checkboxRow}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span className={styles.checkboxBody}>
        <span className={styles.checkboxLabel}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </label>
  )
}

export function InlineFields({ children }: { children: ReactNode }) {
  return <div className={styles.inline}>{children}</div>
}

export function FieldGroup({
  title,
  trailing,
  children,
}: {
  title: string
  trailing?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={styles.group}>
      <h4 className={styles.groupTitle}>
        {title}
        {trailing}
      </h4>
      {children}
    </section>
  )
}
