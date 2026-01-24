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
  DragOverlay
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
 * @param {boolean} props.isEditMode - Whether edit mode is active
 * @param {Function} props.onEditField - Called when edit is clicked
 * @param {Function} props.onDeleteField - Called when delete is clicked
 * @param {Function} props.onToggleVisibility - Called when visibility is toggled
 * @param {Function} props.onToggleRequired - Called when required is toggled
 * @param {Function} props.onReorderFields - Called when fields are reordered
 */
export default function FieldListDraggable({
  fields,
  isEditMode = false,
  onEditField,
  onDeleteField,
  onToggleVisibility,
  onToggleRequired,
  onReorderFields
}) {
  const [activeId, setActiveId] = useState(null);

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
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              onEdit={onEditField}
              onDelete={onDeleteField}
              onToggleVisibility={onToggleVisibility}
              onToggleRequired={onToggleRequired}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeField && (
          <div className="opacity-90">
            <FieldCard
              field={activeField}
              isEditMode={true}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
