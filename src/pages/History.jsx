import { useSessions } from '../hooks/useSessions.js'
import { useExercises } from '../hooks/useExercises.js'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function History() {
  const { workoutLogs } = useSessions()
  const { allExercises } = useExercises()

  const sorted = [...workoutLogs].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight text-gradient">History</h1>
        <p className="text-gray-400">
          {sorted.length} workout{sorted.length !== 1 ? 's' : ''} logged
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="glass-panel text-center py-20 border-dashed border-gray-700/50 rounded-3xl">
          <p className="font-medium text-lg text-gray-400 mb-2">No workouts logged yet.</p>
          <p className="text-gray-500 text-sm">Finish a session to see it here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((log) => {
            const totalSets = log.entries.reduce((acc, e) => acc + e.sets.length, 0)
            const totalReps = log.entries.reduce(
              (acc, e) => acc + e.sets.reduce((a, s) => a + s.reps, 0), 0
            )

            return (
              <div key={log.id} className="glass-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                {/* Log header */}
                <div className="px-6 py-5 border-b border-gray-800/60 flex items-start justify-between gap-3 bg-gray-900/30">
                  <div>
                    <p className="text-white font-bold text-lg mb-1">{log.sessionName}</p>
                    <p className="text-primary-400/80 font-medium text-xs">
                      {formatDate(log.date)} • {formatTime(log.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 bg-gray-900/60 px-4 py-2 rounded-xl border border-gray-700/30">
                    <p className="text-white font-bold">{totalSets} sets</p>
                    <p className="text-gray-400 text-xs font-medium">{totalReps} reps</p>
                  </div>
                </div>

                {/* Exercises */}
                <div className="divide-y divide-gray-800/40">
                  {log.entries.map((entry) => {
                    const exercise = allExercises.find((e) => e.id === entry.exerciseId)
                    return (
                      <div key={entry.exerciseId} className="px-6 py-4">
                        <p className="text-gray-200 text-sm font-bold mb-3">
                          {exercise?.name ?? entry.exerciseName}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.sets.map((set, i) => (
                            <span
                              key={i}
                              className="text-xs font-semibold text-gray-300 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-1.5 shadow-sm"
                            >
                              {set.reps} <span className="text-gray-500 font-normal mx-0.5">×</span> {set.weight}{set.unit || 'kg'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
