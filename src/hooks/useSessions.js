import { useLocalStorage } from './useLocalStorage.js'

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage('sessions', [])
  const [workoutLogs, setWorkoutLogs] = useLocalStorage('workoutLogs', [])

  const addSession = (session) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
    }
    setSessions((prev) => [...prev, newSession])
    return newSession
  }

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSession = (id, updates) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  const addWorkoutLog = (log) => {
    const newLog = {
      ...log,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
    }
    setWorkoutLogs((prev) => [...prev, newLog])
    return newLog
  }

  return { sessions, addSession, deleteSession, updateSession, workoutLogs, addWorkoutLog }
}
