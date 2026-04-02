import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExercises } from '../hooks/useExercises.js'
import { useProgress } from '../hooks/useProgress.js'
import { useSessions } from '../hooks/useSessions.js'
import LevelBadge from '../components/LevelBadge.jsx'
import MuscleGroupBadge from '../components/MuscleGroupBadge.jsx'
import MuscleMap from '../components/MuscleMap.jsx'
import TipCard from '../components/TipCard.jsx'
import PerformanceChart from '../components/PerformanceChart.jsx'
import { LEVEL_THRESHOLDS, getNextThreshold } from '../utils/levels.js'
import { useIntelligence } from '../hooks/useIntelligence.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const CATEGORY_COLORS = {
  Push:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Pull:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Legs:   'bg-green-500/10 text-green-400 border-green-500/20',
  Core:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Cardio: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { allExercises, deleteCustomExercise } = useExercises()
  const { getProgress, updateWeight } = useProgress()
  const { workoutLogs } = useSessions()
  const { getExerciseProgress } = useIntelligence()

  const exercise = allExercises.find((e) => e.id === id)

  const progressData = exercise ? getProgress(exercise.id) : null
  const progress = progressData || { currentLevel: 1, totalSessions: 0, currentWeight: 0, badges: [] }
  const [weightInput, setWeightInput] = useState(() =>
    progress?.currentWeight > 0 ? String(progress.currentWeight) : ''
  )
  const [weightSaved, setWeightSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!exercise) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Exercise not found.</p>
        <button onClick={() => navigate('/exercises')} className="text-white underline text-sm">
          Back to library
        </button>
      </div>
    )
  }

  const categoryStyle = CATEGORY_COLORS[exercise.category] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  const nextThreshold = progress ? getNextThreshold(progress.currentLevel) : null
  const sessionsToNext = nextThreshold && progress ? nextThreshold.sessions - progress.totalSessions : null

  // Logs for this exercise across all workouts
  const exerciseLogs = (workoutLogs || [])
    .filter((log) => log?.entries?.some((e) => e.exerciseId === id))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const handleSaveWeight = () => {
    const w = parseFloat(weightInput)
    if (isNaN(w) || w < 0) return
    updateWeight(exercise.id, w)
    setWeightSaved(true)
    setTimeout(() => setWeightSaved(false), 2000)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  }

  return (
    <div className="max-w-2xl">
      {showDeleteConfirm && (
        <ConfirmDialog
          message={`Delete "${exercise.name}"? This cannot be undone.`}
          onConfirm={() => { deleteCustomExercise(exercise.id); navigate('/exercises'); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {/* Back */}
      <button
        onClick={() => navigate('/exercises')}
        className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back to library
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-4xl font-black text-white leading-tight tracking-tight text-gradient pb-1">{exercise.name}</h1>
        <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border mt-2 shadow-sm ${categoryStyle}`}>
          {exercise.category}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(exercise.muscleGroups || []).map((m) => (
          <MuscleGroupBadge key={m} muscle={m} />
        ))}
      </div>

      {/* Muscle Diagram */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <MuscleMap highlightedMuscles={exercise.muscleGroups || []} />
        <p className="text-center text-xs text-gray-500">Target muscles highlighted in red</p>
      </div>

      {/* Description */}
      {exercise.description && (
        <p className="text-gray-300 text-sm leading-relaxed mb-8">{exercise.description}</p>
      )}

      {/* Performance Chart */}
      <div className="mb-10">
        <PerformanceChart data={getExerciseProgress(exercise.id)} />
      </div>

      {/* Progress card */}
      <div className="glass-card rounded-3xl p-6 mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-accent-500"></div>
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">⏱️ Your Progress</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/40 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-700/30">
            <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Level</p>
            <LevelBadge level={progress.currentLevel} size="lg" />
          </div>
          <div className="bg-gray-800/40 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-700/30">
            <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Sessions</p>
            <p className="text-white font-black text-3xl">{progress.totalSessions}</p>
          </div>
          <div className="bg-gray-800/40 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-700/30">
            <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Top Weight</p>
            <p className="text-white font-black text-2xl truncate">
              {progress.currentWeight > 0 ? `${progress.currentWeight}kg` : '—'}
            </p>
          </div>
        </div>

        {/* Next level progress bar */}
        {sessionsToNext !== null ? (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{sessionsToNext} session{sessionsToNext !== 1 ? 's' : ''} to next level</span>
              <span>
                {progress.totalSessions} / {nextThreshold.sessions}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-500"
                style={{ width: `${Math.min((progress.totalSessions / nextThreshold.sessions) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-yellow-400 text-xs mb-5">🏆 Max level reached!</p>
        )}

        {/* Weight updater */}
        <div className="pt-5 border-t border-gray-800/60 mt-2">
          <p className="text-gray-400 text-sm font-medium mb-3">Update Working Weight</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="e.g. 80"
              min={0}
              step={0.5}
              className="w-32 bg-gray-900/80 border border-gray-700/60 shadow-inner rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all font-semibold"
            />
            <span className="text-gray-500 text-sm font-medium">kg</span>
            <button
              onClick={handleSaveWeight}
              className="ml-auto bg-primary-500 text-gray-950 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary-500/20"
            >
              {weightSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Badges earned */}
      {progress.badges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Badges Earned</h2>
          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badge) => (
              <div
                key={badge.level}
                className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5"
              >
                <span>{badge.level === 4 ? '🏆' : badge.level === 3 ? '🥇' : badge.level === 2 ? '🥈' : '🥉'}</span>
                <span className="text-xs text-gray-300">
                  {LEVEL_THRESHOLDS.find((t) => t.level === badge.level)?.name} — {formatDate(badge.earnedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-3">Technique Tips</h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((lvl) => (
            <TipCard
              key={lvl}
              tipLevel={lvl}
              content={exercise.tips?.[lvl] || ''}
              currentLevel={progress.currentLevel}
            />
          ))}
        </div>
      </div>

      {/* Recent logs for this exercise */}
      {exerciseLogs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Recent Sessions</h2>
          <div className="flex flex-col gap-2">
            {exerciseLogs.map((log) => {
              const entry = log.entries.find((e) => e.exerciseId === id)
              return (
                <div key={log.id} className="glass-card rounded-2xl p-5 hover:border-gray-700 hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-center mb-3 border-b border-gray-800/60 pb-2">
                    <p className="text-white text-base font-bold">{log.sessionName}</p>
                    <p className="text-gray-400 text-xs font-medium bg-gray-900 px-2 py-1 rounded-lg">{formatDate(log.date)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.sets.map((set, i) => (
                      <span key={i} className="text-xs font-semibold text-gray-300 bg-gray-800/80 border border-gray-700/80 rounded-full px-3 py-1.5 shadow-sm">
                        {set.reps} <span className="text-gray-500 font-normal mx-0.5">×</span> {set.weight}{set.unit || 'kg'}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Delete (custom only) */}
      {exercise.isCustom && (
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Delete this exercise
          </button>
        </div>
      )}
    </div>
  )
}
