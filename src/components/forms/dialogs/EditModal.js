import React from 'react';
import BaseTextInput from '../base/BaseTextInput';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const EditModal = ({
  editingNode,
  editingText,
  setEditingText,
  onSave,
  onCancel
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave();
  };

  return (
    <Modal
      open={!!editingNode}
      onClose={onCancel}
      title="Edit Node"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="success" onClick={onSave}>Save</Button>
        </>
      }
    >
      <BaseTextInput
        type="text"
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        className="border-gray-300 focus:ring-green-500 focus:border-green-500"
        placeholder="Node name"
        autoFocus
        aria-label="Edit node name"
        onKeyDown={handleKeyDown}
      />
    </Modal>
  );
};

export default EditModal;