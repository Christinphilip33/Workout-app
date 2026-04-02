import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessions } from '../hooks/useSessions.js'
import { useExercises } from '../hooks/useExercises.js'
import { useWorkoutSync } from '../context/WorkoutContext.jsx'
import { CATEGORIES } from '../data/exercises.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function SessionModal({ allExercises, onSave, onClose, initialName = '', initialSelectedIds = [] }) {
  const [name, setName] = useState(initialName)
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const isEditing = initialName !== ''

  const filtered = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchCat = category === 'All' || ex.category === category
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [allExercises, category, search])

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!name.trim() || selectedIds.length === 0) return
    onSave({ name: name.trim(), exerciseIds: selectedIds })
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
    >
      <div className="glass-panel border-gray-700/50 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/60">
          <h2 id="session-modal-title" className="text-white font-bold text-xl">
            {isEditing ? 'Edit Session' : 'New Session'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {/* Session name */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Session name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Exercise picker */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Add exercises ({selectedIds.length} selected)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 mb-2"
            />
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    category === cat
                      ? 'bg-white text-gray-900 border-white'
                      : 'text-gray-500 border-gray-700 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Exercise list */}
            <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
              {filtered.map((ex) => {
                const isSelected = selectedIds.includes(ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggle(ex.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm border transition-colors text-left ${
                      isSelected
                        ? 'bg-white/5 border-gray-600 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <span>{ex.name}</span>
                    {isSelected && <span className="text-green-400 text-base leading-none">✓</span>}
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <p className="text-gray-600 text-xs py-2 text-center">No exercises found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-6 border-t border-gray-800/60 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-medium text-sm py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || selectedIds.length === 0}
            className="flex-1 bg-primary-500 text-gray-950 font-bold text-sm py-3 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            {isEditing ? 'Save Changes' : 'Create Session'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sessions() {
  const navigate = useNavigate()
  const { sessions, addSession, deleteSession, updateSession } = useSessions()
  const { allExercises } = useExercises()
  const { startSessionFromTemplate } = useWorkoutSync()
  const [showModal, setShowModal] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleSave = (data) => {
    if (editingSession) {
      updateSession(editingSession.id, data)
    } else {
      addSession(data)
    }
    setShowModal(false)
    setEditingSession(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSession(null)
  }

  const handleEdit = (session) => {
    setEditingSession(session)
    setShowModal(true)
  }

  const handleDelete = (session) => {
    setConfirmDelete(session);
  }

  const handleStart = async (session) => {
    // Convert template exerciseIds to full exercise objects
    const exercises = session.exerciseIds
      .map((id) => allExercises.find((e) => e.id === id))
      .filter(Boolean)

    if (exercises.length === 0) return // Don't start empty sessions

    // Initialize the active workout session
    await startSessionFromTemplate(session.name, exercises)

    // Navigate to the live workout
    navigate('/workout/live')
  }

  return (
    <div>
      {confirmDelete && (
        <ConfirmDialog
          message={`Delete session "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={() => { deleteSession(confirmDelete.id); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      {showModal && (
        <SessionModal
          allExercises={allExercises}
          onSave={handleSave}
          onClose={handleCloseModal}
          initialName={editingSession?.name || ''}
          initialSelectedIds={editingSession?.exerciseIds || []}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Sessions</h1>
          <p className="text-gray-400">Group exercises into a workout session.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-gray-950 font-bold px-5 py-2.5 rounded-xl hover:bg-primary-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500/20 shrink-0"
        >
          + New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-panel text-center py-24 border-dashed border-gray-700/50 rounded-3xl">
          <p className="text-gray-400 mb-4 bg-gray-800/50 px-4 py-2 rounded-full text-sm inline-block">No sessions yet.</p>
          <br/>
          <button
            onClick={() => setShowModal(true)}
            className="text-primary-400 font-medium text-sm hover:text-primary-300 transition-colors"
          >
            Create your first session →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session) => {
            const exercises = session.exerciseIds
              .map((id) => allExercises.find((e) => e.id === id))
              .filter(Boolean)

            const isEmpty = exercises.length === 0

            return (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <p className="text-white font-bold text-xl">{session.name}</p>
                  <p className={`font-medium text-sm mt-1 ${isEmpty ? 'text-orange-400' : 'text-primary-400'}`}>
                    {isEmpty ? (
                      <span className="flex items-center gap-1.5">
                        <span>⚠️</span> 0 exercises — edit to add some
                      </span>
                    ) : (
                      `${exercises.length} exercise${exercises.length !== 1 ? 's' : ''}`
                    )}
                  </p>
                </div>

                {/* Exercise preview */}
                <ul className="flex flex-col gap-1">
                  {exercises.slice(0, 4).map((ex) => (
                    <li key={ex.id} className="text-gray-400 text-xs flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                      {ex.name}
                    </li>
                  ))}
                  {exercises.length > 4 && (
                    <li className="text-gray-600 text-xs pl-2.5">
                      +{exercises.length - 4} more
                    </li>
                  )}
                </ul>

                <div className="flex gap-3 mt-auto pt-2">
                  <button
                    onClick={() => handleStart(session)}
                    disabled={isEmpty}
                    className={`flex-1 font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm group-hover:shadow-md ${
                      isEmpty
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-primary-500 hover:text-gray-950'
                    }`}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handleEdit(session)}
                    className="px-4 py-2.5 border border-gray-700 text-gray-400 hover:text-primary-400 hover:border-primary-400/50 hover:bg-primary-400/10 rounded-xl text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session)}
                    className="px-4 py-2.5 border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 rounded-xl text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
