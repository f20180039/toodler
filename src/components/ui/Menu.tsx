import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import styles from './Menu.module.css'

interface MenuProps {
  /** Rendered as the button that opens the panel. */
  trigger: (args: { open: boolean; toggle: () => void }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  /** Fixed panel width, for switchers where a jumping width would be jarring. */
  width?: number
}

export function Menu({ trigger, children, align = 'start', width }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef}>
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          className={[styles.panel, styles[align]].join(' ')}
          style={width ? { width } : undefined}
          role="menu"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  label: string
  description?: string
  icon?: IconName
  onSelect?: () => void
  selected?: boolean
  danger?: boolean
  trailing?: ReactNode
}

export function MenuItem({
  label,
  description,
  icon,
  onSelect,
  selected,
  danger,
  trailing,
}: MenuItemProps) {
  const classes = [styles.item, selected ? styles.selected : '', danger ? styles.danger : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" role="menuitem" className={classes} onClick={onSelect}>
      {icon && <Icon name={icon} size={16} className={styles.itemIcon} />}
      <span className={styles.itemBody}>
        <span className={styles.itemLabel}>{label}</span>
        {description && <span className={styles.itemDescription}>{description}</span>}
      </span>
      {trailing}
      {selected && !trailing && <Icon name="check" size={15} />}
    </button>
  )
}

export function MenuSection({ children }: { children: ReactNode }) {
  return <div className={styles.section}>{children}</div>
}

export function MenuDivider() {
  return <div className={styles.divider} role="separator" />
}
