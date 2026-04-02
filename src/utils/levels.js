export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Beginner',     sessions: 0  },
  { level: 2, name: 'Intermediate', sessions: 10 },
  { level: 3, name: 'Advanced',     sessions: 25 },
  { level: 4, name: 'Elite',        sessions: 50 },
]

export function getLevelFromSessions(totalSessions) {
  let result = LEVEL_THRESHOLDS[0]
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalSessions >= threshold.sessions) result = threshold
  }
  return result.level
}

export function getLevelName(level) {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.name ?? 'Beginner'
}

export function getNextThreshold(currentLevel) {
  return LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1) ?? null
}

export const LEVEL_STYLES = {
  1: { badge: 'bg-gray-500/20 text-gray-300 border-gray-500/40 shadow-[0_0_10px_rgba(156,163,175,0.1)]',   dot: 'bg-gray-400'   },
  2: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.15)]',   dot: 'bg-blue-400 glow-effect'   },
  3: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]', dot: 'bg-purple-400 glow-effect' },
  4: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.25)]', dot: 'bg-yellow-400 glow-effect' },
}
