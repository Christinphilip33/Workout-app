import { getLevelName, LEVEL_STYLES } from '../utils/levels.js'

export default function LevelBadge({ level, size = 'sm' }) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES[1]
  const sizeClass = size === 'lg'
    ? 'text-sm px-3 py-1 gap-1.5'
    : 'text-xs px-2 py-0.5 gap-1'

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {getLevelName(level)}
    </span>
  )
}
