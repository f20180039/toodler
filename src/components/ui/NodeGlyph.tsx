import { nodeMeta } from '../../lib/nodeMeta'
import type { NodeType } from '../../types/workflow'
import { Icon } from './Icon'
import styles from './NodeGlyph.module.css'

/** The tinted, category-coloured square that identifies a node type. Shared by
 *  the node library, the step list and (next slice) the canvas. */
export function NodeGlyph({ type, size = 'md' }: { type: NodeType; size?: 'sm' | 'md' }) {
  const meta = nodeMeta[type]
  return (
    <span className={[styles.glyph, styles[size], styles[meta.category]].join(' ')}>
      <Icon name={meta.icon} size={size === 'sm' ? 14 : 16} />
    </span>
  )
}
