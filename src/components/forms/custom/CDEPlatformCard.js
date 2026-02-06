import React, { useState } from 'react';
import {
  Box,
  Hexagon,
  Database,
  Triangle,
  Cloud,
  Layers,
  HardDrive,
  Building2,
  Settings,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  GripVertical
} from 'lucide-react';
import { PLATFORM_ROLES, getPlatformById, getRoleById } from '../../../data/cdePlatformLibrary';
import BaseTextInput from '../base/BaseTextInput';
import BaseTextArea from '../base/BaseTextArea';

// Icon mapping for vendors
const ICON_MAP = {
  autodesk: Box,
  bentley: Hexagon,
  oracle: Database,
  trimble: Triangle,
  microsoft: Cloud,
  nemetschek: Layers,
  dropbox: HardDrive,
  procore: Building2,
  custom: Settings
};

/**
 * CDEPlatformCard
 * Displays a single CDE platform with its configuration
 * Can be in selection mode (checkbox) or configuration mode (expanded)
 */
const CDEPlatformCard = ({
  platform,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onRemove,
  onUpdate,
  onToggleExpand,
  disabled = false,
  selectionMode = false,
  draggable = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(platform.name || '');

  // Get platform template data
  const platformTemplate = getPlatformById(platform.type);
  const IconComponent = ICON_MAP[platformTemplate.icon] || Settings;
  const role = getRoleById(platform.role);

  // Handle name edit
  const handleNameSave = () => {
    if (editName.trim()) {
      onUpdate({ ...platform, name: editName.trim() });
    }
    setIsEditing(false);
  };

  // Handle role change
  const handleRoleChange = (newRole) => {
    onUpdate({ ...platform, role: newRole });
  };

  // Handle data types change
  const handleDataTypesChange = (format) => {
    const currentTypes = platform.dataTypes || [];
    const newTypes = currentTypes.includes(format)
      ? currentTypes.filter(t => t !== format)
      : [...currentTypes, format];
    onUpdate({ ...platform, dataTypes: newTypes });
  };

  // Selection mode - compact card with checkbox
  if (selectionMode) {
    return (
      <button
        onClick={() => !disabled && onSelect(platform)}
        disabled={disabled}
        className={`
          relative flex flex-col items-center p-4 rounded-xl border-2 transition-all
          ${isSelected
            ? 'border-indigo-500 bg-indigo-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ minWidth: '120px' }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Platform icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
          style={{ backgroundColor: `${platformTemplate.color}20` }}
        >
          <IconComponent
            className="w-6 h-6"
            style={{ color: platformTemplate.color }}
          />
        </div>

        {/* Platform name */}
        <span className="text-sm font-medium text-gray-900 text-center line-clamp-2">
          {platformTemplate.name}
        </span>

        {/* Vendor */}
        <span className="text-xs text-gray-500 mt-1">
          {platformTemplate.vendor}
        </span>
      </button>
    );
  }

  // Configuration mode - expandable card
  return (
    <div
      className={`
        bg-white rounded-xl border-2 transition-all overflow-hidden
        ${isExpanded ? 'border-indigo-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => onToggleExpand && onToggleExpand(platform.id)}
      >
        {/* Drag handle */}
        {draggable && (
          <div className="text-gray-400 hover:text-gray-600 cursor-grab">
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        {/* Platform icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${platformTemplate.color}20` }}
        >
          <IconComponent
            className="w-5 h-5"
            style={{ color: platformTemplate.color }}
          />
        </div>

        {/* Platform info */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <BaseTextInput
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                onBlur={handleNameSave}
                autoFocus
                className="flex-1 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={handleNameSave}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {platform.name || platformTemplate.name}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setEditName(platform.name || platformTemplate.name);
                  setIsEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Role badge */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: role.bgColor,
                color: role.color,
                borderColor: role.borderColor,
                borderWidth: '1px'
              }}
            >
              {role.shortLabel}
            </span>
            <span className="text-xs text-gray-500">
              {platformTemplate.vendor}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove(platform.id);
            }}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="text-gray-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Functional Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(PLATFORM_ROLES).map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  disabled={disabled}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                    ${platform.role === r.id
                      ? 'ring-2 ring-offset-1'
                      : 'hover:bg-gray-50'
                    }
                  `}
                  style={{
                    backgroundColor: platform.role === r.id ? r.bgColor : undefined,
                    color: platform.role === r.id ? r.color : '#6B7280',
                    ringColor: platform.role === r.id ? r.color : undefined
                  }}
                >
                  {r.shortLabel}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {role.description}
            </p>
          </div>

          {/* Data types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supported Data Formats
            </label>
            <div className="flex flex-wrap gap-2">
              {platformTemplate.supportedFormats[0] === '*' ? (
                <span className="text-sm text-gray-500 italic">All formats supported</span>
              ) : (
                platformTemplate.supportedFormats.map(format => {
                  const isActive = (platform.dataTypes || []).includes(format);
                  return (
                    <button
                      key={format}
                      onClick={() => handleDataTypesChange(format)}
                      disabled={disabled}
                      className={`
                        px-2 py-1 rounded text-xs font-medium transition-all
                        ${isActive
                          ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {format}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Notes
            </label>
            <BaseTextArea
              value={platform.description || ''}
              onChange={e => onUpdate({ ...platform, description: e.target.value })}
              disabled={disabled}
              placeholder={platformTemplate.description}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          {/* Capabilities */}
          {platformTemplate.capabilities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Capabilities
              </label>
              <div className="flex flex-wrap gap-1">
                {platformTemplate.capabilities.map(cap => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CDEPlatformCard;
