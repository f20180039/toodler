import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'trigger'
  | 'action'
  | 'logic'
  | 'delay'

interface BadgeProps {
  tone?: BadgeTone
  pill?: boolean
  withDot?: boolean
  children: ReactNode
}

export function Badge({ tone = 'neutral', pill, withDot, children }: BadgeProps) {
  const classes = [styles.badge, styles[tone], pill ? styles.pill : ''].filter(Boolean).join(' ')
  return (
    <span className={classes}>
      {withDot && <span className={styles.dot} />}
      {children}
    </span>
  )
}
