/**
 * FieldListDraggable Component
 *
 * Draggable list of fields using @dnd-kit.
 * Handles reordering of fields via drag and drop.
 */

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import FieldCard from './FieldCard';

/**
 * FieldListDraggable
 *
 * @param {Object} props
 * @param {Array} props.fields - Array of field objects
 * @param {string|number} props.stepNumber - Step number for dynamic field numbering
 * @param {boolean} props.isEditMode - Whether edit mode is active
 * @param {Function} props.onEditField - Called when edit is clicked
 * @param {Function} props.onDeleteField - Called when delete is clicked
 * @param {Function} props.onToggleVisibility - Called when visibility is toggled
 * @param {Function} props.onToggleRequired - Called when required is toggled
 * @param {Function} props.onReorderFields - Called when fields are reordered
 */
export default function FieldListDraggable({
  fields,
  stepNumber,
  isEditMode = false,
  onEditField,
  onDeleteField,
  onToggleVisibility,
  onToggleRequired,
  onReorderFields
}) {
  const [activeId, setActiveId] = useState(null);
  const [overlayOffset, setOverlayOffset] = useState({ x: 0, y: 0 });

  // Custom drop animation for smooth transitions
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    }),
    duration: 250,
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
  };

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Find active field for drag overlay
  const activeField = activeId ? fields.find(f => f.id === activeId) : null;

  // Handle drag start - capture pointer offset from element top-left
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);

    // Calculate offset between pointer and element's top-left corner
    if (active.rect.current.initial && event.activatorEvent) {
      const rect = active.rect.current.initial;
      const pointerX = event.activatorEvent.clientX;
      const pointerY = event.activatorEvent.clientY;

      setOverlayOffset({
        x: pointerX - rect.left,
        y: pointerY - rect.top
      });
    }
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Calculate new order
    const oldIndex = fields.findIndex(f => f.id === active.id);
    const newIndex = fields.findIndex(f => f.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Create new order array
    const newFields = [...fields];
    const [movedField] = newFields.splice(oldIndex, 1);
    newFields.splice(newIndex, 0, movedField);

    // Create orders array for API
    const orders = newFields.map((field, index) => ({
      id: field.id,
      order_index: index
    }));

    onReorderFields?.(orders);
  }, [fields, onReorderFields]);

  // Handle drag cancel
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No fields in this step</p>
        {isEditMode && (
          <p className="text-xs mt-1">Click "Add Field" to create one</p>
        )}
      </div>
    );
  }

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
        items={fields.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {fields.map((field, index) => (
            <FieldCard
              key={field.id}
              field={field}
              stepNumber={stepNumber}
              fieldIndex={index}
              isEditMode={isEditMode}
              onEdit={onEditField}
              onDelete={onDeleteField}
              onToggleVisibility={onToggleVisibility}
              onToggleRequired={onToggleRequired}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - follows cursor smoothly */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeField && (
          <div
            className="shadow-2xl rounded-lg ring-2 ring-blue-400 ring-opacity-50"
            style={{
              marginLeft: -overlayOffset.x,
              marginTop: -overlayOffset.y
            }}
          >
            <FieldCard
              field={activeField}
              stepNumber={stepNumber}
              fieldIndex={fields.findIndex(f => f.id === activeId)}
              isEditMode={true}
              isDragOverlay={true}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
