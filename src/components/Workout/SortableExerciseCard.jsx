import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableExerciseCard({ id, isSupersetLinked, onToggleSuperset, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative rounded-3xl transition-all duration-300 ${
        isDragging 
          ? 'scale-105 opacity-80 backdrop-blur-xl shadow-[inset_0_0_20px_rgba(34,211,238,0.3)] shadow-[0_20px_50px_rgba(34,211,238,0.2)]' 
          : 'origin-center'
      }`}
    >
      {/* Visual Superset Link Bracket */}
      {isSupersetLinked && (
        <div className="absolute -top-10 left-5 w-4 h-12 border-l-2 border-b-2 border-primary-500/50 rounded-bl-xl -z-10"></div>
      )}

      {/* The 6-Dot Drag Handle & Superset Toggle */}
      <div className="absolute -left-2 sm:-left-4 top-0 bottom-0 flex flex-col items-center justify-center gap-4 z-20 opacity-40 hover:opacity-100 transition-opacity">
        <button
          className="p-2 touch-none cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-full"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 10-4 0 2 2 0 004 0zm0 8a2 2 0 10-4 0 2 2 0 004 0zm0 8a2 2 0 10-4 0 2 2 0 004 0zm6-16a2 2 0 10-4 0 2 2 0 004 0zm0 8a2 2 0 10-4 0 2 2 0 004 0zm0 8a2 2 0 10-4 0 2 2 0 004 0z" />
          </svg>
        </button>

        <button
          onClick={onToggleSuperset}
          className={`p-1.5 rounded-full border transition-all ${
            isSupersetLinked 
              ? 'bg-primary-500/20 border-primary-500/50 text-primary-400 glow-effect' 
              : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-white'
          }`}
          title="Link to previous exercise (Superset)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>

      <div className={`glass-card rounded-3xl p-6 sm:p-8 ml-4 sm:ml-6 ${isDragging ? 'bg-gray-900/80 border-cyan-500/30' : ''}`}>
        {children}
      </div>
    </div>
  );
}
