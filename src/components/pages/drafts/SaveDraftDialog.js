import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const SaveDraftDialog = ({
  show,
  newDraftName,
  isNewDraftNameValid,
  newDraftNameValidation,
  onNewDraftNameChange,
  onSave,
  onCancel,
  existingDraft = null,
  onOverwrite,
  onSaveAsNew
}) => {
  // If there's an existing draft with the same name, show confirmation dialog
  if (existingDraft) {
    return (
      <Modal open={show} onClose={onCancel} title="Draft Already Exists" size="sm">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">
              A draft named "<span className="font-medium">{existingDraft.name}</span>" already exists.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Last modified: {new Date(existingDraft.lastModified).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button fullWidth onClick={onOverwrite}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Overwrite Existing Draft
          </Button>

          <Button variant="secondary" fullWidth onClick={onSaveAsNew}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Save as New Draft
          </Button>

          <Button variant="ghost" fullWidth onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }

  // Normal save dialog
  return (
    <Modal
      open={show}
      onClose={onCancel}
      title="Save Draft"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave} disabled={!isNewDraftNameValid}>Save</Button>
        </>
      }
    >
      <div className="space-y-2">
        <input
          type="text"
          value={newDraftName}
          onChange={(e) => onNewDraftNameChange(e.target.value)}
          placeholder="Draft name..."
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            newDraftName && !isNewDraftNameValid
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter' && isNewDraftNameValid) {
              onSave();
            }
          }}
        />
        {newDraftName && !isNewDraftNameValid && newDraftNameValidation.error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {newDraftNameValidation.error}
          </p>
        )}
        {newDraftName && isNewDraftNameValid && newDraftNameValidation.sanitized !== newDraftName && (
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Will be saved as: "{newDraftNameValidation.sanitized}"
          </p>
        )}
      </div>
    </Modal>
  );
};

export default SaveDraftDialog;