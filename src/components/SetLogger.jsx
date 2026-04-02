import { useState, useEffect } from 'react'
import { triggerHaptic } from '../utils/haptics.js'
import { useWorkoutFocus } from '../hooks/useWorkoutFocus.js'

// Sanity caps to prevent corrupted data entry
const MAX_WEIGHT = 999
const MAX_REPS = 100
const MAX_SETS = 20

export default function SetLogger({ defaultWeight = 0, onAdd, exerciseId, nextExerciseId, weightUnit, onUnitToggle }) {
  const [sets, setSets] = useState('1')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState(defaultWeight > 0 ? String(defaultWeight) : '')
  const { inputRefs, focusInput, focusNext } = useWorkoutFocus(3) // 0: sets, 1: reps, 2: weight

  // On mount, focus the sets input automatically
  useEffect(() => {
    focusInput(1) // Focus reps first since sets defaults to 1
  }, [focusInput])

  const handleAdd = () => {
    const s = Math.min(parseInt(sets, 10) || 1, MAX_SETS)
    const r = parseInt(reps, 10)
    const w = parseFloat(weight)
    if (!r || r <= 0 || r > MAX_REPS) return
    if (isNaN(w) || w < 0 || w > MAX_WEIGHT) return

    // Add multiple sets if sets > 1
    for (let i = 0; i < s; i++) {
      onAdd({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${i}`, reps: r, weight: w, unit: weightUnit })
    }
    triggerHaptic('LOGGED')

    setSets('1')
    setReps('')
    // Superset boundary jump or stay on current weight for next set
    if (nextExerciseId) {
      focusNext(2, nextExerciseId)
    } else {
      focusInput(1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Log a set">
        {/* Sets */}
        <input
          ref={(el) => (inputRefs.current[0] = el)}
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          onKeyDown={handleKeyDown}
          min={1}
          aria-label="Number of sets"
          className="w-16 bg-gray-900/80 border border-gray-700/60 shadow-inner rounded-xl px-2 py-2.5 text-sm text-white text-center focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-bold"
        />
        <span className="text-gray-500 font-medium text-xs">sets</span>

        <span className="text-gray-600 mx-1">|</span>

        {/* Reps */}
        <input
          ref={(el) => (inputRefs.current[1] = el)}
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onKeyDown={handleKeyDown}
          min={1}
          aria-label="Number of reps"
          className="w-16 bg-gray-900/80 border border-gray-700/60 shadow-inner rounded-xl px-2 py-2.5 text-sm text-white text-center focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-bold"
        />
        <span className="text-gray-500 font-medium" aria-hidden="true">×</span>

        {/* Weight */}
        <input
          ref={(el) => (inputRefs.current[2] = el)}
          data-exercise-id={exerciseId}
          type="number"
          placeholder={weightUnit}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={handleKeyDown}
          min={0}
          step={weightUnit === 'kg' ? 0.5 : 1}
          aria-label={`Weight in ${weightUnit}`}
          className="w-20 bg-gray-900/80 border border-gray-700/60 shadow-inner rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-bold"
        />

        {/* Unit toggle */}
        <button
          type="button"
          onClick={onUnitToggle}
          className="px-2 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          title="Toggle kg/lbs"
        >
          {weightUnit}
        </button>

        {/* Add button */}
        <button
          onClick={handleAdd}
          aria-label="Add set"
          className="bg-primary-500 text-gray-950 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] ml-auto"
        >
          + Add
        </button>
      </div>
    </div>
  )
}
