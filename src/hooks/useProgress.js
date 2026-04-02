import { useLocalStorage } from './useLocalStorage.js'
import { getLevelFromSessions } from '../utils/levels.js'

const defaultProgress = () => ({
  currentWeight: 0,
  currentLevel: 1,
  totalSessions: 0,
  badges: [],
})

export function useProgress() {
  const [userProgress, setUserProgress] = useLocalStorage('userProgress', {})

  const getProgress = (exerciseId) => {
    return userProgress[exerciseId] ?? defaultProgress()
  }

  const updateWeight = (exerciseId, newWeight) => {
    setUserProgress((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] ?? defaultProgress()),
        currentWeight: newWeight,
      },
    }))
  }

  const logSession = (exerciseId) => {
    // Read current snapshot synchronously so we can return a reliable result.
    const current = userProgress[exerciseId] ?? defaultProgress()
    const newTotalSessions = current.totalSessions + 1
    const newLevel = getLevelFromSessions(newTotalSessions)
    const leveledUp = newLevel > current.currentLevel

    // Functional updater keeps the write side-effect correct even under batching.
    setUserProgress((prev) => {
      const prevCurrent = prev[exerciseId] ?? defaultProgress()
      const prevNewTotal = prevCurrent.totalSessions + 1
      const prevNewLevel = getLevelFromSessions(prevNewTotal)
      const prevLeveledUp = prevNewLevel > prevCurrent.currentLevel

      const updatedBadges = prevLeveledUp
        ? [...prevCurrent.badges, { level: prevNewLevel, earnedAt: new Date().toISOString() }]
        : prevCurrent.badges

      return {
        ...prev,
        [exerciseId]: {
          ...prevCurrent,
          totalSessions: prevNewTotal,
          currentLevel: prevNewLevel,
          badges: updatedBadges,
        },
      }
    })

    return { leveledUp, newLevel: leveledUp ? newLevel : null }
  }

  return { getProgress, updateWeight, logSession }
}
