import { useNavigate, Link } from 'react-router-dom'
import { useSessions } from '../hooks/useSessions.js'
import { useExercises } from '../hooks/useExercises.js'
import { useProgress } from '../hooks/useProgress.js'
import VolumeHeatmap from '../components/VolumeHeatmap.jsx'
import StrengthChart from '../components/StrengthChart.jsx'
import VolumeBreakdown from '../components/VolumeBreakdown.jsx'
import AchievementBadges from '../components/AchievementBadges.jsx'
import DataManager from '../components/DataManager.jsx'
import { useIntelligence } from '../hooks/useIntelligence.js'
import { useState } from 'react'

const EXERCISE_DROPDOWN_LIMIT = 50;

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  )
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { sessions, workoutLogs } = useSessions()
  const { allExercises } = useExercises()
  const { getProgress } = useProgress()
  const { getVolumeHeatmap } = useIntelligence()
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)

  const recentLogs = [...workoutLogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const trackedCount = allExercises.filter(
    (ex) => getProgress(ex.id).totalSessions > 0
  ).length

  return (
    <div className="animate-fade-in divide-y divide-gray-800/40">
      <div className="pb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Dashboard</h1>
        <p className="text-gray-400">Track your progress, start a session.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-8">
        <div className="glass-card p-6 flex flex-col justify-center rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Workouts</p>
          <p className="text-white text-4xl font-black text-gradient">{workoutLogs.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-center rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Sessions Saved</p>
          <p className="text-white text-4xl font-black text-gradient">{sessions.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-center rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">Exercises Tracked</p>
          <p className="text-white text-4xl font-black text-gradient">{trackedCount}</p>
        </div>
      </div>

      {/* Intelligence Layer: Volume Heatmap */}
      <section className="py-4">
        <VolumeHeatmap data={getVolumeHeatmap()} />
      </section>

      {/* Performance Analytics Dashboard */}
      <section className="py-6 flex flex-col gap-6">
        {/* Strength Curve Chart with Exercise Selector */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedExerciseId || ''}
              onChange={(e) => setSelectedExerciseId(e.target.value || null)}
              aria-label="Select exercise to view progress chart"
              className="bg-gray-900/80 border border-gray-800/60 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-primary-500/50 transition-all max-w-xs w-full"
            >
              <option value="">Select exercise to chart...</option>
              {[...allExercises]
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, EXERCISE_DROPDOWN_LIMIT)
                .map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
          <StrengthChart 
            exerciseId={selectedExerciseId} 
            exerciseName={allExercises.find(ex => ex.id === selectedExerciseId)?.name}
          />
        </div>

        {/* Volume Radar Breakdown */}
        <VolumeBreakdown />

        {/* Achievement Milestones */}
        <AchievementBadges />

        {/* Data Management */}
        <DataManager />
      </section>

      {/* Sessions quick-start */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Your Sessions</h2>
          <Link to="/sessions" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
            Manage <span className="text-lg leading-none">→</span>
          </Link>
        </div>
        {sessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center border-dashed border-gray-700/50">
            <p className="text-gray-400 mb-4 bg-gray-800/50 px-4 py-2 rounded-full text-sm">No sessions created yet.</p>
            <button
              onClick={() => navigate('/sessions')}
              className="font-semibold text-gray-950 bg-primary-500 hover:bg-primary-400 hover:scale-105 active:scale-95 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20"
            >
              Create your first session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <p className="text-white font-bold text-lg">{session.name}</p>
                  <p className="text-primary-400 text-sm font-medium mt-1">
                    {session.exerciseIds.length} exercise{session.exerciseIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/workout/${session.id}`)}
                  className="w-full bg-white text-gray-900 font-bold text-sm py-2.5 rounded-xl hover:bg-primary-500 hover:text-gray-950 transition-colors shadow-sm group-hover:shadow-md"
                >
                  Start Workout
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent workouts */}
      <section className="py-8 border-b-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Recent Workouts</h2>
          {workoutLogs.length > 0 && (
            <Link to="/history" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View all <span className="text-lg leading-none">→</span>
            </Link>
          )}
        </div>
        {recentLogs.length === 0 ? (
          <div className="glass-panel opacity-60 rounded-2xl p-6 border-dashed border-gray-700/50 flex">
            <p className="text-gray-500 text-sm">No workouts logged yet. Start a session to begin.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="glass-card rounded-2xl p-5 hover:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-white font-bold text-base">{log.sessionName}</p>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    {log.entries.length} exercise{log.entries.length !== 1 ? 's' : ''} •{' '}
                    <span className="text-gray-500">{log.entries.reduce((acc, e) => acc + e.sets.length, 0)} sets</span>
                  </p>
                </div>
                <div className="bg-gray-800/70 border border-gray-700/50 px-3 py-1.5 rounded-lg shrink-0">
                  <p className="text-gray-300 text-xs font-semibold tracking-wide uppercase">{formatDate(log.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
