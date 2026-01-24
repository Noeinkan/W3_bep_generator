/**
 * StepListDraggable Component
 *
 * Draggable list of steps using @dnd-kit.
 * Handles reordering of steps via drag and drop.
 */

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import StepCard from './StepCard';

/**
 * StepListDraggable
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects
 * @param {string} props.selectedStepId - ID of currently selected step
 * @param {boolean} props.isEditMode - Whether edit mode is active
 * @param {Function} props.onSelectStep - Called when a step is selected
 * @param {Function} props.onEditStep - Called when edit is clicked
 * @param {Function} props.onDeleteStep - Called when delete is clicked
 * @param {Function} props.onToggleVisibility - Called when visibility is toggled
 * @param {Function} props.onReorderSteps - Called when steps are reordered
 */
export default function StepListDraggable({
  steps,
  selectedStepId,
  isEditMode = false,
  onSelectStep,
  onEditStep,
  onDeleteStep,
  onToggleVisibility,
  onReorderSteps
}) {
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Require 8px movement to start drag
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Find active step for drag overlay
  const activeStep = activeId ? steps.find(s => s.id === activeId) : null;

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Calculate new order
    const oldIndex = steps.findIndex(s => s.id === active.id);
    const newIndex = steps.findIndex(s => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Create new order array
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(oldIndex, 1);
    newSteps.splice(newIndex, 0, movedStep);

    // Create orders array for API
    const orders = newSteps.map((step, index) => ({
      id: step.id,
      order_index: index
    }));

    onReorderSteps?.(orders);
  }, [steps, onReorderSteps]);

  // Handle drag cancel
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={steps.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isSelected={step.id === selectedStepId}
              isEditMode={isEditMode}
              onSelect={onSelectStep}
              onEdit={onEditStep}
              onDelete={onDeleteStep}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeStep && (
          <div className="opacity-90">
            <StepCard
              step={activeStep}
              isSelected={false}
              isEditMode={true}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
