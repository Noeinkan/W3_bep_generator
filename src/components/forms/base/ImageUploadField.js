/**
 * Image upload field: drag-drop or file picker, preview, optional compression.
 * Stores value as base64 data URL. Uses imageCompression for resize/quality.
 * Used by field type: image-upload (e.g. project map for Section 2).
 */
import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { compressBase64Image } from '../../../utils/imageCompression';
import FieldHeader from './FieldHeader';
import FieldError from './FieldError';

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/svg+xml';
const MAX_SIZE_MB = 10;

const ImageUploadField = ({ field, value, onChange, error }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { name, label, number, required } = field || {};
  const dataUrl = value && typeof value === 'string' ? value : '';

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let dataUrl = e.target?.result;
        if (typeof dataUrl !== 'string') return;
        try {
          dataUrl = await compressBase64Image(dataUrl, { maxWidth: 1200, maxHeight: 1600, quality: 0.85 });
        } catch {
          // keep original if compression fails
        }
        onChange(name, dataUrl);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return; // TODO: could set error via form context
      }
      processFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClear = () => onChange(name, '');

  return (
    <div>
      <FieldHeader fieldName={name} label={label} number={number} required={required} htmlFor={name} />
      {!dataUrl ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-ui-primary bg-ui-primary/5' : 'border-ui-border bg-ui-surface hover:border-ui-primary/50'
          } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
          <Upload className="mx-auto h-10 w-10 text-ui-text-muted" />
          <p className="mt-2 text-sm text-ui-text">
            {isProcessing ? 'Processing…' : 'Drag and drop an image here, or click to select'}
          </p>
          <p className="mt-1 text-xs text-ui-text-muted">PNG, JPG or SVG (max {MAX_SIZE_MB} MB)</p>
        </div>
      ) : (
        <div className="relative rounded-lg border border-ui-border bg-ui-surface p-2">
          <img src={dataUrl} alt="" className="max-h-64 w-auto rounded object-contain mx-auto" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-ui-surface border border-ui-border text-ui-text-muted hover:bg-ui-muted hover:text-ui-text shadow-sm"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <FieldError error={error} />
    </div>
  );
};

export default ImageUploadField;
