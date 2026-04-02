const CATEGORY_COLORS = {
  Push:    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Pull:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Legs:    'bg-green-500/10 text-green-400 border-green-500/20',
  Core:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Cardio:  'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function ExerciseCard({ exercise, onClick, onAdd }) {
  const categoryStyle = CATEGORY_COLORS[exercise.category] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'

  const handleAddClick = (e) => {
    e.stopPropagation()
    onAdd?.(exercise)
  }

  return (
    <div
      onClick={onClick}
      className="w-full text-left glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-semibold text-base leading-tight">
          {exercise.name}
        </h3>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${categoryStyle}`}>
          {exercise.category}
        </span>
      </div>

      {exercise.gifUrl && (
        <div className="mb-4 rounded-xl overflow-hidden bg-gray-900 border border-gray-800/60 aspect-video relative">
          <img 
            src={exercise.gifUrl} 
            alt={exercise.name} 
            loading="lazy" 
            decoding="async"
            className="w-full h-full object-cover opacity-80 mix-blend-screen hover:opacity-100 transition-opacity" 
          />
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {exercise.muscleGroups.map((muscle) => (
          <span
            key={muscle}
            className="text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded-full px-2 py-0.5"
          >
            {muscle}
          </span>
        ))}
      </div>

      {exercise.isCustom && (
        <div className="mt-3 text-xs text-yellow-500/70 font-medium">
          Custom
        </div>
      )}
      {onAdd && (
        <div className="mt-4 pt-4 border-t border-gray-800/60 flex justify-end">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-sm font-bold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 px-4 py-2 rounded-xl transition-all"
          >
            <span className="text-lg leading-none">+</span> Add to Workout
          </button>
        </div>
      )}
    </div>
  )
}
