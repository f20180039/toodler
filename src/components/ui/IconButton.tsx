import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'
import styles from './IconButton.module.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  /** Required: icon-only controls must still be announced. */
  label: string
  size?: 'sm' | 'md'
  bordered?: boolean
  active?: boolean
}

export function IconButton({
  icon,
  label,
  size = 'md',
  bordered,
  active,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const classes = [
    styles.iconButton,
    styles[size],
    bordered ? styles.bordered : '',
    active ? styles.active : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 15 : 17} />
    </button>
  )
}
