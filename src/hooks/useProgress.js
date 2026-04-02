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
    let result = { leveledUp: false, newLevel: null };

    setUserProgress((prev) => {
      const current = prev[exerciseId] ?? defaultProgress();
      const newTotalSessions = current.totalSessions + 1;
      const newLevel = getLevelFromSessions(newTotalSessions);
      const leveledUp = newLevel > current.currentLevel;

      result = { leveledUp, newLevel: leveledUp ? newLevel : null };

      const updatedBadges = leveledUp
        ? [...current.badges, { level: newLevel, earnedAt: new Date().toISOString() }]
        : current.badges;

      return {
        ...prev,
        [exerciseId]: {
          ...current,
          totalSessions: newTotalSessions,
          currentLevel: newLevel,
          badges: updatedBadges,
        },
      };
    });

    return result;
  }

  return { getProgress, updateWeight, logSession }
}
