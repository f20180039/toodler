import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  iconLeft?: IconName
  iconRight?: IconName
  fullWidth?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  )
}
