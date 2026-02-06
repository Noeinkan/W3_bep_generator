import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title || 'Confirm'}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onConfirm}>Confirm</Button>
      </>
    }
  >
    <p className="text-gray-700">{message}</p>
  </Modal>
);

export default ConfirmDialog;
