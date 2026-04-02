import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSessions } from '../hooks/useSessions.js'
import { useExercises } from '../hooks/useExercises.js'
import { useProgress } from '../hooks/useProgress.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useRestTimer } from '../hooks/useRestTimer.js'
import DraggableWorkoutList from '../components/Workout/DraggableWorkoutList.jsx'
import SortableExerciseCard from '../components/Workout/SortableExerciseCard.jsx'
import SetLogger from '../components/SetLogger.jsx'
import LevelBadge from '../components/LevelBadge.jsx'
import BadgeNotification from '../components/BadgeNotification.jsx'
import MuscleGroupBadge from '../components/MuscleGroupBadge.jsx'
import FormCueToast from '../components/FormCueToast.jsx'
import PlateCalculator from '../components/PlateCalculator.jsx'
import PRModal from '../components/PRModal.jsx'
import RestTimer from '../components/RestTimer.jsx'
import { triggerHaptic } from '../utils/haptics.js'
import { useWorkoutSync } from '../context/WorkoutContext.jsx'
import { useIntelligence } from '../hooks/useIntelligence.js'

export default function ActiveWorkout() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { addWorkoutLog } = useSessions()
  const { logSession, getProgress } = useProgress()
  const { activeSession, finishSessionOfflineSafe, saveActiveSession, clearActiveSession } = useWorkoutSync()
  const { checkPR, getAutoRegulationInsights } = useIntelligence()

  // Rest timer state
  const [defaultRestDuration, setDefaultRestDuration] = useLocalStorage('restTimerDuration', 90)
  const restTimer = useRestTimer()

  // Weight unit preference (kg or lbs)
  const [weightUnit, setWeightUnit] = useLocalStorage('weightUnit', 'kg')
  const toggleWeightUnit = () => setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg')

  // Determine if we are rendering a historical session or the live Dexie stream
  const isLive = sessionId === 'live' || !sessionId
  const session = isLive ? activeSession : null
  const exercises = session?.exercises ?? []

  // Track the first exercise to show its form cue naturally
  const activeExerciseForCue = exercises.length > 0 ? exercises[0] : null;

  // [{exerciseName, newLevel}]
  const [levelUps, setLevelUps] = useState([])
  const [notifIndex, setNotifIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  
  // PR State
  const [showPRModal, setShowPRModal] = useState(false)
  const [prDetails, setPrDetails] = useState(null)

  // Rest timer picker state
  const [showRestPicker, setShowRestPicker] = useState(false)

  // Handlers for Live Session Sets Updates
  const updateSessionState = (newExercisesState) => {
    if (!isLive || !activeSession) return;
    saveActiveSession({
      ...activeSession,
      exercises: newExercisesState
    })
  }

  const handleAddSet = async (exerciseId, set) => {
    // Check for PR using local Dexie Intelligence
    try {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      const prCheck = await checkPR(exerciseId, set, exercise?.sets ?? []);
      if (prCheck.isNewPR) {
        setPrDetails(prCheck)
        setShowPRModal(true)
        triggerHaptic('PR')
      } else {
        triggerHaptic('LOGGED')
      }
    } catch (err) {
      console.error('PR check failed:', err);
      triggerHaptic('LOGGED')
    }

    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: [...ex.sets, set] }
      }
      return ex;
    })
    updateSessionState(updatedExercises)

    // Show rest timer picker
    setShowRestPicker(true)
  }

  const handleRemoveSet = (exerciseId, idx) => {
    const updatedExercises = exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter((_, i) => i !== idx) }
      }
      return ex;
    })
    updateSessionState(updatedExercises)
  }

  const handleFinish = () => {
    // Merge duplicate exercise entries and filter out invalid sets
    const mergedMap = new Map()
    exercises.forEach((exercise) => {
      const validSets = (exercise.sets || []).filter(s => s.reps > 0)
      if (validSets.length === 0) return

      if (mergedMap.has(exercise.id)) {
        const existing = mergedMap.get(exercise.id)
        existing.sets.push(...validSets)
      } else {
        mergedMap.set(exercise.id, {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets: [...validSets],
        })
      }
    })

    const entries = Array.from(mergedMap.values())

    // Level up for exercises with real sets
    const ups = []
    entries.forEach((entry) => {
      const result = logSession(entry.exerciseId)
      if (result.leveledUp) {
        ups.push({ exerciseName: entry.exerciseName, newLevel: result.newLevel })
      }
    })

    const workoutLog = { sessionId, sessionName: session.name, entries }
    addWorkoutLog(workoutLog)
    finishSessionOfflineSafe(workoutLog)
    
    // Check if we hit new PRs to trigger the special PR haptic pattern
    if (ups.length > 0) {
      triggerHaptic('PR')
    } else {
      triggerHaptic('REST_DONE') // Just a heavy pulse for finishing
    }
    
    setLevelUps(ups)
    setFinished(true)
  }

  const handleNotifClose = useCallback(() => {
    setNotifIndex((i) => i + 1)
  }, [])

  const totalSets = exercises.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0)

  // ── Session not found ──
  if (!session) {
    return (
      <div className="text-center py-20 flex flex-col items-center animate-fade-in-up">
        <div className="bg-gray-900/60 p-5 rounded-3xl border border-gray-800/80 shadow-2xl backdrop-blur-md mb-6 inline-flex text-4xl">
          👻
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">No active session</h2>
        <p className="text-gray-400 mb-8 max-w-sm">You haven't added any exercises to your live workout yet.</p>
        
        <button
          onClick={() => navigate('/exercises')}
          className="bg-primary-500 text-gray-950 font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-primary-400 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-4"
        >
          + Add First Exercise
        </button>
        
        <Link to="/sessions" className="text-gray-500 hover:text-white underline text-sm transition-colors">
          Browse saved routines
        </Link>
      </div>
    )
  }

  // ── Workout complete screen ──
  if (finished) {
    const currentNotif = levelUps[notifIndex]
    return (
      <div className="max-w-lg mx-auto">
        {currentNotif && (
          <BadgeNotification
            key={notifIndex}
            level={currentNotif.newLevel}
            exerciseName={currentNotif.exerciseName}
            onClose={handleNotifClose}
          />
        )}

        <div className="text-center py-10">
          <p className="text-5xl mb-4">🎉</p>
          <h1 className="text-2xl font-bold text-white mb-2">Workout Complete!</h1>
          <p className="text-gray-400 text-sm mb-8">{session.name}</p>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-10 text-left">
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Exercises</p>
              <p className="text-white font-black text-4xl text-gradient">
                {exercises.filter((ex) => ex.sets.length > 0).length}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Sets</p>
              <p className="text-white font-black text-4xl text-gradient">{totalSets}</p>
            </div>
          </div>

          {/* Level-ups summary */}
          {levelUps.length > 0 && (
            <div className="mb-8 text-left">
              <h2 className="text-white font-semibold mb-3">Level Ups 🏅</h2>
              <div className="flex flex-col gap-2">
                {levelUps.map((lu, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                    <span className="text-white text-sm">{lu.exerciseName}</span>
                    <LevelBadge level={lu.newLevel} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/history')}
              className="w-full bg-primary-500 text-gray-950 font-bold py-3.5 rounded-xl hover:bg-primary-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)]"
            >
              View History
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full glass-panel hover:bg-gray-800/80 text-white font-medium py-3.5 rounded-xl transition-all shadow-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Drag & Drop Note ──
  // To implement Drag-and-Drop for supersets/reordering:
  // 1. Wrap the exercise list mapping below in `<DndContext onDragEnd={handleDragEnd}>` from @dnd-kit/core.
  // 2. Wrap each card in `<SortableItem id={exercise.id}>` using @dnd-kit/sortable.
  // 3. Update the `activeSession.exercises` array order logically on the `onDragEnd` callback.

  return (
    <div className="max-w-2xl relative">
      <PRModal 
        isOpen={showPRModal} 
        prDetails={prDetails} 
        onClose={() => setShowPRModal(false)} 
      />
      
      <FormCueToast
        cues={activeExerciseForCue?.globalFormCues}
        isVisible={!finished && !!activeExerciseForCue}
      />

      <RestTimer
        timer={restTimer}
        defaultDuration={defaultRestDuration}
        onDurationChange={setDefaultRestDuration}
        isWorkoutActive={!finished && !!session}
        showPicker={showRestPicker}
        onPickerClose={() => setShowRestPicker(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-800/60">
        <div>
          <h1 className="text-3xl font-black text-white text-gradient tracking-tight">{session.name}</h1>
          <p className="text-gray-400 font-medium mt-1">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} • <span className="text-white">{totalSets}</span> set{totalSets !== 1 ? 's' : ''} logged
          </p>
        </div>
        <button
          onClick={handleFinish}
          className="shrink-0 bg-primary-500 text-gray-950 font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] w-full sm:w-auto text-center"
        >
          Finish Workout
        </button>
      </div>

      {/* Exercise cards */}
      <DraggableWorkoutList exercises={exercises} onReorder={updateSessionState}>
        {exercises.map((exercise, index) => {
          const progress = getProgress(exercise.id)
          const exerciseSets = exercise.sets ?? []
          const autoRegInsight = getAutoRegulationInsights(exercise.id)

          return (
            <SortableExerciseCard 
              key={exercise.id} 
              id={exercise.id}
              isSupersetLinked={exercise.isSupersetLinked}
              onToggleSuperset={() => {
                const updated = [...exercises];
                updated[index].isSupersetLinked = !updated[index].isSupersetLinked;
                updateSessionState(updated);
              }}
            >
              {/* Exercise header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exercise.muscleGroups.slice(0, 3).map((m) => (
                      <MuscleGroupBadge key={m} muscle={m} />
                    ))}
                  </div>
                </div>
                <LevelBadge level={progress.currentLevel} />
              </div>

              {progress.currentWeight > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                  <div className="inline-block bg-gray-900/60 border border-gray-700/50 px-3 py-1.5 rounded-lg shrink-0">
                    <p className="text-gray-400 font-medium text-sm">
                      Working weight: <span className="text-white font-bold">{progress.currentWeight}kg</span>
                    </p>
                  </div>
                  <div className="sm:ml-auto">
                    <PlateCalculator targetWeight={progress.currentWeight} />
                  </div>
                </div>
              )}

              {/* Logged sets */}
              {exerciseSets.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-900/40 rounded-2xl border border-gray-800/40">
                  {exerciseSets.map((set, idx) => (
                    <span
                      key={set.id ?? idx}
                      onClick={() => handleRemoveSet(exercise.id, idx)}
                      className="text-sm font-semibold text-gray-200 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 cursor-pointer hover:border-red-400/80 hover:bg-red-400/10 hover:text-red-300 transition-all shadow-sm flex items-center gap-1"
                      title="Click to remove"
                    >
                      {set.reps} <span className="text-gray-500 font-normal text-xs">×</span> {set.weight}{set.unit || weightUnit}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Auto-regulation Deload/Overload Alert */}
              {autoRegInsight && (
                <div className={`mb-5 p-4 rounded-2xl border ${autoRegInsight.type === 'deload' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-primary-500/10 border-primary-500/30'} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{autoRegInsight.type === 'deload' ? '⚠️' : '📈'}</span>
                    <h4 className={`font-bold text-sm ${autoRegInsight.type === 'deload' ? 'text-orange-400' : 'text-primary-400'}`}>
                      {autoRegInsight.warning}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-xs mt-1 ml-7">
                    {autoRegInsight.suggestion}
                  </p>
                </div>
              )}

              {/* Set logger */}
              <SetLogger
                exerciseId={exercise.id}
                nextExerciseId={exercises[index + 1]?.isSupersetLinked ? exercises[index + 1].id : null}
                defaultWeight={progress.currentWeight}
                onAdd={(set) => handleAddSet(exercise.id, set)}
                weightUnit={weightUnit}
                onUnitToggle={toggleWeightUnit}
              />
            </SortableExerciseCard>
          )
        })}
      </DraggableWorkoutList>

      {/* Bottom finish button */}
      <div className="mt-8 pb-4 flex flex-col gap-3">
        <button
          onClick={() => navigate('/exercises')}
          className="w-full glass-panel hover:bg-gray-800/80 border-dashed text-primary-400 font-semibold py-3.5 rounded-xl transition-all shadow-sm mb-2"
        >
          + Add Another Exercise
        </button>
        <button
          onClick={handleFinish}
          className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
        >
          Finish Workout
        </button>
        <button
          onClick={async () => { await clearActiveSession(); navigate('/'); }}
          className="w-full mt-2 text-gray-500 hover:text-white text-sm py-2 transition-colors"
        >
          Discard Session
        </button>
      </div>
    </div>
  )
}
