import { getLevelName, LEVEL_STYLES } from '../utils/levels.js'

export default function TipCard({ tipLevel, content, currentLevel }) {
  const isUnlocked = currentLevel >= tipLevel
  const style = LEVEL_STYLES[tipLevel] ?? LEVEL_STYLES[1]

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${
      isUnlocked ? 'glass-card' : 'bg-gray-900/30 border-gray-800/50 backdrop-blur-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
          {getLevelName(tipLevel)}
        </span>
        {!isUnlocked && (
          <span className="text-xs text-gray-600 flex items-center gap-1">
            🔒 Locked
          </span>
        )}
      </div>
      {isUnlocked ? (
        <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed select-none" style={{ filter: 'blur(4px)' }}>
          {content}
        </p>
      )}
    </div>
  )
}
