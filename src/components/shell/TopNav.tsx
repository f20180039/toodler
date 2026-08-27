import { NavLink } from 'react-router-dom'
import { Icon, Menu, MenuDivider, MenuItem, MenuSection } from '../ui'
import type { IconName } from '../ui'
import styles from './TopNav.module.css'

/** The product-level navigation bar. It stays fixed across every screen so the
 *  builder never feels like a modal the user has to escape from. */
const links: { to: string; label: string; icon: IconName }[] = [
  { to: '/workflows', label: 'Workflows', icon: 'workflow' },
  { to: '/templates', label: 'Templates', icon: 'templates' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

const schools = [
  { name: 'Greenwood International', meta: 'Bengaluru · CBSE' },
  { name: 'Greenwood Primary', meta: 'Bengaluru · CBSE' },
  { name: 'Riverdale Academy', meta: 'Pune · ICSE' },
]

export function TopNav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <NavLink to="/workflows" className={styles.brand}>
        <span className={styles.mark}>
          <Icon name="workflow" size={16} />
        </span>
        Toddle
      </NavLink>

      <span className={styles.divider} />

      <Menu
        width={260}
        trigger={({ toggle }) => (
          <button type="button" className={styles.schoolTrigger} onClick={toggle}>
            <span className={styles.schoolName}>{schools[0].name}</span>
            <Icon name="chevron-down" size={14} />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuSection>Switch school</MenuSection>
            {schools.map((school, index) => (
              <MenuItem
                key={school.name}
                label={school.name}
                description={school.meta}
                selected={index === 0}
                onSelect={close}
              />
            ))}
          </>
        )}
      </Menu>

      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.linkActive : ''].filter(Boolean).join(' ')
              }
            >
              <Icon name={link.icon} size={16} />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <span className={styles.spacer} />

      <div className={styles.right}>
        <span className={styles.year}>
          <Icon name="clock" size={14} />
          2026–27
        </span>
        <Menu
          align="end"
          width={220}
          trigger={({ toggle }) => (
            <button
              type="button"
              className={styles.avatar}
              onClick={toggle}
              aria-label="Account menu"
            >
              PM
            </button>
          )}
        >
          {(close) => (
            <>
              <MenuItem label="Priya Menon" description="Admissions head" onSelect={close} />
              <MenuDivider />
              <MenuItem label="Team & permissions" icon="users" onSelect={close} />
              <MenuItem label="Sign out" icon="x" onSelect={close} />
            </>
          )}
        </Menu>
      </div>
    </nav>
  )
}
