import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { triggerHaptic } from '../../utils/haptics.js';

export default function DraggableWorkoutList({ exercises, onReorder, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before triggering (prevents accidental drags when tapping)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    triggerHaptic('LOGGED'); // Light tactile click on pickup
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      triggerHaptic('PR'); // Heavier satisfying pulse on drop
      
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over.id);

      const reordered = arrayMove(exercises, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext 
        items={exercises.map(ex => ex.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-5 relative">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
}
