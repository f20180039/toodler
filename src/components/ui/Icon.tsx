import type { ReactNode, SVGProps } from 'react'

/** One inline SVG set for the whole prototype: no icon-font dependency, and
 *  every glyph inherits `currentColor` so components control colour via CSS. */
const glyphs: Record<string, ReactNode> = {
  workflow: (
    <>
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="M12 7v3.5a2 2 0 0 1-2 2H8.5a2 2 0 0 0-2 2V17" />
      <path d="M12 7v3.5a2 2 0 0 0 2 2h1.5a2 2 0 0 1 2 2V17" />
      <circle cx="6.5" cy="19.5" r="2.5" />
      <circle cx="17.5" cy="19.5" r="2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'arrow-left': <path d="M19 12H5m6-6-6 6 6 6" />,
  'more-horizontal': (
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="m20 6.5-11 11-5-5" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  'alert-triangle': (
    <>
      <path d="M12 3.5 21 19H3z" />
      <path d="M12 9.5v4M12 16.5h.01" />
    </>
  ),
  bolt: <path d="M13.5 2.5 5 14h5.5l-1 7.5L18 10h-5.5z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 5.5 8.5-5.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
  branch: (
    <>
      <path d="M6 3.5v17" />
      <path d="M6 12h5a4 4 0 0 0 4-4V6.5" />
      <path d="M6 12h5a4 4 0 0 1 4 4v1.5" />
      <circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="6.5" r="2" />
      <circle cx="16.5" cy="17.5" r="2" />
    </>
  ),
  task: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  bell: (
    <>
      <path d="M18 16.5V11a6 6 0 1 0-12 0v5.5L4.5 19h15z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </>
  ),
  tag: (
    <>
      <path d="M20.5 12.8 12.8 20.5 3.5 11.2V3.5h7.7z" />
      <circle cx="7.8" cy="7.8" r="1.5" />
    </>
  ),
  status: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 4v4.5H16" />
    </>
  ),
  undo: (
    <>
      <path d="M8 7 3.5 11.5 8 16" />
      <path d="M3.5 11.5H14a5.5 5.5 0 0 1 0 11h-3" />
    </>
  ),
  redo: (
    <>
      <path d="m16 7 4.5 4.5L16 16" />
      <path d="M20.5 11.5H10a5.5 5.5 0 0 0 0 11h3" />
    </>
  ),
  stop: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.2" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M15 6.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1.5" />
    </>
  ),
  pencil: <path d="M4 20h4L20.5 7.5 16.5 3.5 4 16z" />,
  trash: (
    <>
      <path d="M4 7h16M9.5 7V4h5v3" />
      <path d="m6.5 7 1 13h9l1-13" />
    </>
  ),
  play: <path d="M8.5 5.5 19 12 8.5 18.5z" />,
  pause: <path d="M9.5 5.5v13M14.5 5.5v13" />,
  templates: (
    <>
      <path d="M6 3h7.5L18 7.5V21H6z" />
      <path d="M13 3v5h5" />
      <path d="M9.5 13h5M9.5 17h5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 8h16M4 16h16" />
      <circle cx="9.5" cy="8" r="2.2" fill="var(--bg-surface)" />
      <circle cx="15" cy="16" r="2.2" fill="var(--bg-surface)" />
    </>
  ),
  users: (
    <>
      <circle cx="10" cy="8.5" r="3.5" />
      <path d="M3.5 20c0-3.4 2.9-5.5 6.5-5.5s6.5 2.1 6.5 5.5" />
      <path d="M16.5 5.5a3.2 3.2 0 0 1 0 6.2M18 14.8c1.7.7 2.5 2.4 2.5 5.2" />
    </>
  ),
}

export type IconName = keyof typeof glyphs

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyphs[name]}
    </svg>
  )
}
