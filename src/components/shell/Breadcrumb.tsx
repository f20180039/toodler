import { Link } from 'react-router-dom'
import { Icon } from '../ui'
import styles from './Breadcrumb.module.css'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.root} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {index > 0 && <Icon name="chevron-right" size={13} />}
          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
