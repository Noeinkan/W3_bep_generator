import React, { useState } from 'react';
import { Plus, X, Edit2, Check, GripVertical, Sparkles } from 'lucide-react';
import FieldHeader from './FieldHeader';
import CONFIG from '../../../config/bepConfig';

/**
 * CheckboxGroup Component
 * Riutilizzabile con funzionalità di aggiunta/rimozione/editing di checkbox dinamiche
 * 
 * @param {Object} field - Configurazione del campo (name, label, number, required, options)
 * @param {Array} value - Array di valori selezionati
 * @param {Function} onChange - Callback per aggiornare il valore
 * @param {String} error - Messaggio di errore da visualizzare
 */
const CheckboxGroup = React.memo(({ field, value, onChange, error }) => {
  const { name, label, number, required, options: presetOptionsKey } = field;
  
  // Gestione opzioni: possono essere preset o custom
  const [customOptions, setCustomOptions] = useState([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Opzioni preset dal config (se esistono)
  const presetOptions = presetOptionsKey ? 
    (CONFIG.options?.[presetOptionsKey] || []) : [];

  // Combina opzioni preset + custom
  const allOptions = [...presetOptions, ...customOptions];
  
  // Valore selezionato (array di stringhe)
  const selectedValues = Array.isArray(value) ? value : [];

  // Toggle checkbox
  const handleCheckboxChange = (option) => {
    const updated = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(name, updated);
  };

  // Aggiungi nuova opzione custom
  const addCustomOption = () => {
    const trimmed = newOptionText.trim();
    if (!trimmed) return;
    
    // Evita duplicati
    if (allOptions.includes(trimmed)) {
      alert('This option already exists!');
      return;
    }

    setCustomOptions([...customOptions, trimmed]);
    setNewOptionText('');
    setShowAddForm(false);
  };

  // Rimuovi opzione custom
  const removeCustomOption = (option) => {
    if (presetOptions.includes(option)) {
      alert('Cannot remove preset options. You can only remove custom options.');
      return;
    }

    // Rimuovi dalle opzioni custom
    setCustomOptions(customOptions.filter(opt => opt !== option));
    
    // Rimuovi anche dai valori selezionati se presente
    if (selectedValues.includes(option)) {
      onChange(name, selectedValues.filter(item => item !== option));
    }
  };

  // Inizia editing
  const startEditing = (option) => {
    if (presetOptions.includes(option)) {
      alert('Cannot edit preset options. You can only edit custom options.');
      return;
    }
    setEditingOption(option);
    setEditingText(option);
  };

  // Salva editing
  const saveEditing = () => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    // Verifica duplicati
    if (trimmed !== editingOption && allOptions.includes(trimmed)) {
      alert('This option already exists!');
      return;
    }

    // Aggiorna custom options
    setCustomOptions(customOptions.map(opt => 
      opt === editingOption ? trimmed : opt
    ));

    // Aggiorna valori selezionati se necessario
    if (selectedValues.includes(editingOption)) {
      onChange(name, selectedValues.map(item => 
        item === editingOption ? trimmed : item
      ));
    }

    setEditingOption(null);
    setEditingText('');
  };

  // Cancella editing
  const cancelEditing = () => {
    setEditingOption(null);
    setEditingText('');
  };

  // Select All / Deselect All
  const selectAll = () => {
    onChange(name, [...allOptions]);
  };

  const deselectAll = () => {
    onChange(name, []);
  };

  // Verifica se è preset
  const isPreset = (option) => presetOptions.includes(option);

  return (
    <div className="mb-8">
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      {/* Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border rounded-t-lg px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            {selectedValues.length} of {allOptions.length} selected
          </span>
          {allOptions.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Select All
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Deselect All
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
        >
          <Plus size={16} />
          <span>Add Custom Option</span>
        </button>
      </div>

      {/* Add Custom Option Form */}
      {showAddForm && (
        <div className="border-x border-b bg-blue-50 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomOption()}
              placeholder="Enter new option name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="button"
              onClick={addCustomOption}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewOptionText('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Checkbox Grid */}
      <div className="border rounded-b-lg">
        {allOptions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg mb-2">No options available</p>
            <p className="text-sm">Click "Add Custom Option" to create your first option</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {allOptions.map((option, index) => (
              <div
                key={option}
                className={`group relative flex items-start gap-2 p-3 border rounded-lg transition-all min-w-0 ${
                  selectedValues.includes(option)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {editingOption === option ? (
                  // Editing mode
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveEditing}
                      className="text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  // Normal mode
                  <>
                    <label 
                      htmlFor={`${name}-${option}`}
                      className="flex-1 flex items-start gap-2 cursor-pointer min-w-0"
                    >
                      <input
                        id={`${name}-${option}`}
                        type="checkbox"
                        checked={selectedValues.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500 shrink-0 mt-0.5"
                      />
                      <span className="text-sm select-none break-words min-w-0">{option}</span>
                      {isPreset(option) && (
                        <span className="shrink-0 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          Preset
                        </span>
                      )}
                    </label>
                    
                    {/* Action buttons for custom options */}
                    {!isPreset(option) && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startEditing(option)}
                          className="text-gray-500 hover:text-blue-600 p-1"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCustomOption(option)}
                          className="text-gray-500 hover:text-red-600 p-1"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}

      {/* Info footer */}
      {customOptions.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <Sparkles size={12} />
          <span>
            {customOptions.length} custom option{customOptions.length !== 1 ? 's' : ''} added
          </span>
        </div>
      )}
    </div>
  );
});

export default CheckboxGroup;
