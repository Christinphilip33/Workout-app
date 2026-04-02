import { useEffect, useState } from 'react'
import { getLevelName, LEVEL_STYLES } from '../utils/levels.js'

const LEVEL_ICONS = { 1: '🥉', 2: '🥈', 3: '🥇', 4: '🏆' }

export default function BadgeNotification({ level, exerciseName, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance
    const show = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 4000)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(timer)
    }
  }, [onClose])

  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES[1]

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-xs w-full glass-card rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-start gap-3 transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-x-0 slide-in-right' : 'opacity-0 translate-x-12'
      }`}
    >
      <span className="text-2xl leading-none mt-0.5">{LEVEL_ICONS[level] ?? '🏅'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">Level Up!</p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">
          {exerciseName}
        </p>
        <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
          {getLevelName(level)}
        </span>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none mt-0.5"
      >
        ×
      </button>
    </div>
  )
}
