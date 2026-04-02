import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExercises } from '../hooks/useExercises.js'
import ExerciseCard from '../components/ExerciseCard.jsx'
import { CATEGORIES, ALL_MUSCLE_GROUPS } from '../data/exercises.js'
import { useWorkoutSync } from '../context/WorkoutContext.jsx'

const ALL = 'All'
const FILTER_TABS = [ALL, ...CATEGORIES]

function AddExerciseModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Push',
    description: '',
    muscleGroups: [],
    tips: { 1: '', 2: '', 3: '', 4: '' },
  })

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const toggleMuscle = (muscle) => {
    setForm((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscle)
        ? prev.muscleGroups.filter((m) => m !== muscle)
        : [...prev.muscleGroups, muscle],
    }))
  }

  const setTip = (level, value) => {
    setForm((prev) => ({ ...prev, tips: { ...prev.tips, [level]: value } }))
  }

  const canSave = form.name.trim() && form.muscleGroups.length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      muscleGroups: form.muscleGroups,
      tips: form.tips,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
      <div className="glass-panel border-gray-700/50 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/60">
          <h2 className="text-white font-bold text-xl">Add Custom Exercise</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Cable Fly"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Category *</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => set('category', cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.category === cat
                      ? 'bg-white text-gray-900 border-white'
                      : 'text-gray-500 border-gray-700 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Muscle groups */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Muscle Groups * ({form.muscleGroups.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_MUSCLE_GROUPS.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => toggleMuscle(muscle)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    form.muscleGroups.includes(muscle)
                      ? 'bg-white/10 text-white border-gray-500'
                      : 'text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the exercise…"
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none"
            />
          </div>

          {/* Tips */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Tips (optional)</label>
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((lvl) => {
                const labels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Elite' }
                return (
                  <input
                    key={lvl}
                    type="text"
                    value={form.tips[lvl]}
                    onChange={(e) => setTip(lvl, e.target.value)}
                    placeholder={`${labels[lvl]} tip…`}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800/60 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-medium text-sm py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 bg-primary-500 text-gray-950 font-bold text-sm py-3 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            Add Exercise
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExerciseLibrary() {
  const navigate = useNavigate()
  const { allExercises, addCustomExercise } = useExercises()
  const { addExerciseToSession, activeSession } = useWorkoutSync()
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [autoNavigate, setAutoNavigate] = useState(true)
  const [toastMessage, setToastMessage] = useState('')

  const filtered = allExercises.filter((ex) => {
    const matchesCategory = activeCategory === ALL || ex.category === activeCategory
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddCustom = async (data) => {
    try {
      const created = await addCustomExercise(data)
      setShowModal(false)
      navigate(`/exercises/${created.id}`)
    } catch (err) {
      console.error('Failed to add custom exercise:', err)
    }
  }

  const handleAddToSession = async (exercise) => {
    try {
      await addExerciseToSession(exercise)

      // Visual feedback
      setToastMessage(`Added ${exercise.name} to workout!`)
      setTimeout(() => setToastMessage(''), 3000)

      // Auto-Navigation
      if (autoNavigate) {
        // Need a small timeout to let the toast be seen or let context settle
        setTimeout(() => navigate(`/workout/live`), 300)
      }
    } catch (err) {
      console.error('Failed to add exercise to session:', err)
    }
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
      <div 
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="glass-card rounded-2xl px-5 py-3 shadow-2xl border-primary-500/50 bg-gray-900/90 backdrop-blur-xl flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-white font-bold text-sm m-0">{toastMessage}</p>
        </div>
      </div>

      {showModal && (
        <AddExerciseModal onSave={handleAddCustom} onClose={() => setShowModal(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Exercise Library</h1>
          <p className="text-gray-400">{allExercises.length} exercises available</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 bg-primary-500 text-gray-950 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500/20"
        >
          + Add Exercise
        </button>
      </div>

      {/* Search & Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-panel border-gray-700/60 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 shadow-inner transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer bg-gray-900/40 px-4 py-3 rounded-xl border border-gray-800/50 hover:bg-gray-800/30 transition-colors">
          <input
            type="checkbox"
            checked={autoNavigate}
            onChange={(e) => setAutoNavigate(e.target.checked)}
            className="w-4 h-4 rounded text-primary-500 bg-gray-800 border-gray-700 focus:ring-primary-500 focus:ring-offset-gray-950"
          />
          <span className="text-sm font-medium text-gray-300 whitespace-nowrap">
            Go to active workout after adding
          </span>
        </label>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TABS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 shadow-sm ${
              activeCategory === cat
                ? 'bg-primary-500/20 text-primary-400 border-primary-500/50 glow-effect'
                : 'glass-panel text-gray-400 hover:border-gray-500/80 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => navigate(`/exercises/${exercise.id}`)}
              onAdd={handleAddToSession}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center py-20 text-gray-500 rounded-3xl border-dashed border-gray-700/50">
          <p className="font-medium text-lg text-gray-400 mb-2">No exercises found.</p>
          <p className="text-sm">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  )
}
