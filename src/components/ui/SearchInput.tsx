import type { InputHTMLAttributes } from 'react'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import styles from './SearchInput.module.css'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onValueChange: (value: string) => void
  label: string
}

export function SearchInput({ value, onValueChange, label, ...rest }: SearchInputProps) {
  return (
    <span className={styles.wrapper}>
      <Icon name="search" size={16} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        value={value}
        aria-label={label}
        onChange={(event) => onValueChange(event.target.value)}
        {...rest}
      />
      {value && (
        <IconButton
          icon="x"
          label="Clear search"
          size="sm"
          className={styles.clear}
          onClick={() => onValueChange('')}
        />
      )}
    </span>
  )
}
