import styles from './SegmentedControl.module.css'

export interface Segment<T extends string> {
  value: T
  label: string
  count?: number
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className={styles.root} role="tablist" aria-label={label}>
      {segments.map((segment) => {
        const selected = segment.value === value
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className={[styles.segment, selected ? styles.selected : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(segment.value)}
          >
            {segment.label}
            {segment.count !== undefined && <span className={styles.count}>{segment.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
