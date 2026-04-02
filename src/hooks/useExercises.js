import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../context/WorkoutContext.jsx'

export function useExercises() {
  // Lazily streams the full 1300+ DB directly into the UI state in ~1-5ms
  const allExercises = useLiveQuery(() => db.exercises.toArray(), [], [])

  const addCustomExercise = async (exercise) => {
    const newExercise = {
      ...exercise,
      id: `custom-${Date.now()}`,
      isCustom: true,
      category: exercise.category || 'Other',
      muscleGroups: exercise.muscleGroups || [],
      bodyPart: exercise.category,
      equipment: exercise.equipment || 'body weight'
    }
    await db.exercises.put(newExercise)
    return newExercise
  }

  const deleteCustomExercise = async (id) => {
    await db.exercises.delete(id)
  }

  return { allExercises, addCustomExercise, deleteCustomExercise }
}
