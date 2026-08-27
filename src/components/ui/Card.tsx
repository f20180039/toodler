import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  padded?: boolean
  className?: string
}

export function Card({ children, padded, className }: CardProps) {
  return (
    <section
      className={[styles.card, padded ? styles.padded : '', className ?? ''].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function CardHeader({ title, subtitle, actions }: CardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions}
    </header>
  )
}
