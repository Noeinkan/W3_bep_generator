import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Copy, Palette, Type } from 'lucide-react';
import { getNodeTypeConfig, NODE_TYPES } from '../../../utils/nodeTypes';
import BaseTextInput from '../base/BaseTextInput';

const NodeToolbar = ({ node, position, onRename, onDelete, onDuplicate, onChangeType, onClose }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node?.name || '');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const inputRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        console.log('Click outside toolbar, closing');
        onClose();
      }
    };

    // Delay adding the event listener to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleRename = () => {
    console.log('handleRename called, newName:', newName, 'node.name:', node.name);
    if (newName.trim() && newName !== node.name) {
      console.log('Calling onRename with:', newName.trim());
      onRename(newName.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewName(node.name);
    }
  };

  if (!node) return null;

  const nodeTypeConfig = getNodeTypeConfig(node.type);
  const availableTypes = Object.values(NODE_TYPES).filter(type => type !== NODE_TYPES.ROOT);

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 animate-scale-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 105}px`,
        transform: 'translateX(-50%)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        console.log('Toolbar clicked, preventing propagation');
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        console.log('Toolbar mousedown, preventing propagation');
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border-2 border-blue-400 overflow-visible">
        {isRenaming ? (
          <div className="p-2 min-w-64">
            <BaseTextInput
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              className="px-3 py-2 border-gray-300 rounded-md text-sm"
              placeholder="Node name..."
            />
            <div className="mt-1 text-xs text-gray-500">
              Press Enter to save, Esc to cancel
            </div>
          </div>
        ) : (
          <div className="flex items-center divide-x divide-gray-200">
            {/* Rename Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Rename button clicked');
                setIsRenaming(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 hover:bg-blue-50 transition-colors duration-200"
              title="Rename"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Rename</span>
            </button>

            {/* Change Type Button */}
            {node.type !== NODE_TYPES.ROOT && (
              <div className="relative">
                <button
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className="flex items-center space-x-1.5 px-3 py-2 hover:bg-purple-50 transition-colors duration-200"
                  title="Change Type"
                >
                  <Palette className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">Type</span>
                </button>

                {showTypeMenu && (
                  <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-48 z-50">
                    {availableTypes.map((type) => {
                      const config = getNodeTypeConfig(type);
                      return (
                        <button
                          key={type}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Change type clicked, type:', type);
                            onChangeType(type);
                            setShowTypeMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: config.bgColor }}
                          />
                          <span className="text-sm text-gray-700">{config.label}</span>
                          {node.type === type && (
                            <span className="ml-auto text-xs text-blue-600">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Duplicate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Duplicate button clicked');
                onDuplicate();
              }}
              className="flex items-center space-x-1.5 px-3 py-2 hover:bg-green-50 transition-colors duration-200"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Duplicate</span>
            </button>

            {/* Delete Button */}
            {node.id !== 'root' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Delete button clicked');
                  onDelete();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 hover:bg-red-50 transition-colors duration-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-medium text-gray-700">Delete</span>
              </button>
            )}
          </div>
        )}

        {/* Node info footer */}
        {!isRenaming && (
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <div
                  className="w-2.5 h-2.5 rounded"
                  style={{ backgroundColor: nodeTypeConfig.bgColor }}
                />
                <span className="text-xs font-medium text-gray-600">{nodeTypeConfig.label}</span>
              </div>
              <span className="text-xs text-gray-400 truncate max-w-32">{node.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Arrow pointing to node */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: '100%' }}
      >
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-400" />
      </div>
    </div>
  );
};

export default NodeToolbar;
