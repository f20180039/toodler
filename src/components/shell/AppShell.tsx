import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

/** Standard centred page container. The builder opts out of this to run
 *  full-bleed, which is why it is a separate component rather than baked in. */
export function Page({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>
}
