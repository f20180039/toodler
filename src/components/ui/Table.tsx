import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import styles from './Table.module.css'

export function Table({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table} aria-label={label}>
        {children}
      </table>
    </div>
  )
}

export function Th({
  children,
  alignEnd,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { alignEnd?: boolean }) {
  return (
    <th
      scope="col"
      className={[styles.th, alignEnd ? styles.alignEnd : ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  alignEnd,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & { alignEnd?: boolean }) {
  return (
    <td
      className={[styles.td, alignEnd ? styles.alignEnd : ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </td>
  )
}

interface TrProps {
  children: ReactNode
  onClick?: () => void
}

export function Tr({ children, onClick }: TrProps) {
  const classes = [styles.row, onClick ? styles.clickable : ''].filter(Boolean).join(' ')
  return (
    <tr
      className={classes}
      onClick={onClick}
      /* Rows navigate, so they need to be reachable and operable by keyboard too. */
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </tr>
  )
}
