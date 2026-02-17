import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title || 'Confirm'}
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
      </>
    }
  >
    <p className="text-gray-700">{message}</p>
  </Modal>
);

export default ConfirmDialog;
