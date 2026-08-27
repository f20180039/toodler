import type { NodeKind } from '../../types/flow'
import { kindMeta } from '../../utils/nodeMeta'
import { Icon } from '../ui'
import styles from './NodeGlyph.module.css'

/** The tinted, group-coloured square that identifies a node type. It reads its
 *  icon and colour group from kindMeta, so the palette, the canvas and the
 *  config panel cannot drift apart. Lives with the flow components rather than
 *  in ui/ because it knows about the domain. */
export function NodeGlyph({ kind, size = 'md' }: { kind: NodeKind; size?: 'sm' | 'md' }) {
  const meta = kindMeta[kind]
  return (
    <span className={[styles.glyph, styles[size], styles[meta.group]].join(' ')}>
      <Icon name={meta.icon} size={size === 'sm' ? 14 : 16} />
    </span>
  )
}
