import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Folder,
  FolderPlus,
  Edit3,
  Trash2,
  ChevronRight,
  Plus,
  Save,
  X,
  Move,
  FolderOpen,
  Home,
  GripVertical
} from 'lucide-react';
import FieldHeader from '../../base/FieldHeader';
import FieldError from '../../base/FieldError';

// Tooltip Component
const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-8 left-1/2 -translate-x-1/2',
    bottom: 'top-8 left-1/2 -translate-x-1/2',
    left: 'right-8 top-1/2 -translate-y-1/2',
    right: 'left-8 top-1/2 -translate-y-1/2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 pointer-events-none animate-fadeIn`}
          role="tooltip"
        >
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Context Menu Component
const ContextMenu = ({ x, y, folder, onClose, onAction, isRootLevel }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    {
      icon: Plus,
      label: 'Add Subfolder',
      action: 'add',
      color: 'text-green-600',
      shortcut: 'Ctrl+N'
    },
    {
      icon: Edit3,
      label: 'Rename',
      action: 'rename',
      color: 'text-blue-600',
      shortcut: 'F2'
    },
    {
      icon: Move,
      label: 'Move Up',
      action: 'moveUp',
      color: 'text-gray-600',
      shortcut: 'Ctrl+↑'
    },
    {
      icon: Move,
      label: 'Move Down',
      action: 'moveDown',
      color: 'text-gray-600',
      shortcut: 'Ctrl+↓'
    },
  ];

  // Add delete only if not a default folder
  const protectedIds = [1, 2, 3, 4]; // WIP, SHARED, PUBLISHED, ARCHIVE
  if (!isRootLevel || !protectedIds.includes(folder.id)) {
    menuItems.push({
      icon: Trash2,
      label: 'Delete',
      action: 'delete',
      color: 'text-red-600',
      shortcut: 'Del'
    });
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50 min-w-48 animate-scaleIn"
      style={{ left: x, top: y }}
      role="menu"
      aria-label="Folder actions menu"
    >
      <div className="px-3 py-1 border-b border-gray-100 mb-1">
        <p className="text-xs font-semibold text-gray-500 truncate">{folder.name}</p>
      </div>
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors ${item.color}`}
          onClick={() => {
            onAction(item.action);
            onClose();
          }}
          role="menuitem"
        >
          <div className="flex items-center space-x-2">
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <span className="text-xs text-gray-400">{item.shortcut}</span>
        </button>
      ))}
    </div>
  );
};

// Breadcrumb Component
const Breadcrumb = ({ path, onNavigate }) => {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 px-6 py-3 bg-white border-b border-gray-200">
      <Home className="w-4 h-4 text-gray-400" />
      <button
        onClick={() => onNavigate(null)}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        Root
      </button>
      {path.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <button
            onClick={() => onNavigate(folder.id)}
            className={`text-sm ${
              index === path.length - 1
                ? 'text-gray-700 font-semibold'
                : 'text-blue-600 hover:text-blue-800 hover:underline'
            }`}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

const FolderStructureDiagram = ({ field, value, onChange, error }) => {
  const { name, label, number, required } = field;

  // Parse the value (could be string or object)
  const parseStructure = (val) => {
    if (typeof val === 'string') {
      // Convert text diagram to structured data
      const lines = val.split('\n').filter(line => line.trim());
      const structure = [];
      const stack = [{ children: structure, level: -1 }];

      lines.forEach(line => {
        const match = line.match(/^(\s*)(📁\s*)?(.+)$/);
        if (match) {
          const [, indent, , folderName] = match;
          const level = Math.floor(indent.length / 4); // Assuming 4 spaces per level
          const cleanName = folderName.replace(/[├└│─└┐┤┴┬┌│]/g, '').trim();

          // Pop stack to correct level
          while (stack.length > level + 1) {
            stack.pop();
          }

          const folder = {
            id: Date.now() + Math.random(),
            name: cleanName,
            children: []
          };

          stack[stack.length - 1].children.push(folder);
          stack.push(folder);
        }
      });

      return structure;
    }
    return val || getDefaultStructure();
  };

  const getDefaultStructure = () => [
    {
      id: 1,
      name: 'WIP (Work in Progress)',
      children: [
        {
          id: 11,
          name: 'Architecture',
          children: [
            { id: 111, name: 'Models', children: [] },
            { id: 112, name: 'Drawings', children: [] },
            { id: 113, name: 'Specifications', children: [] },
            { id: 114, name: 'Reports', children: [] }
          ]
        },
        {
          id: 12,
          name: 'Structure',
          children: [
            { id: 121, name: 'Models', children: [] },
            { id: 122, name: 'Drawings', children: [] },
            { id: 123, name: 'Calculations', children: [] }
          ]
        },
        {
          id: 13,
          name: 'MEP',
          children: [
            { id: 131, name: 'Mechanical', children: [] },
            { id: 132, name: 'Electrical', children: [] },
            { id: 133, name: 'Plumbing', children: [] },
            { id: 134, name: 'Fire Protection', children: [] }
          ]
        },
        {
          id: 14,
          name: 'Surveys',
          children: []
        },
        {
          id: 15,
          name: 'Clash Detection',
          children: []
        }
      ]
    },
    {
      id: 2,
      name: 'SHARED (Coordination)',
      children: [
        {
          id: 21,
          name: 'Architecture',
          children: [
            { id: 211, name: 'Models', children: [] },
            { id: 212, name: 'Drawings', children: [] },
            { id: 213, name: 'Specifications', children: [] }
          ]
        },
        {
          id: 22,
          name: 'Structure',
          children: [
            { id: 221, name: 'Models', children: [] },
            { id: 222, name: 'Drawings', children: [] },
            { id: 223, name: 'Calculations', children: [] }
          ]
        },
        {
          id: 23,
          name: 'MEP',
          children: [
            { id: 231, name: 'Mechanical', children: [] },
            { id: 232, name: 'Electrical', children: [] },
            { id: 233, name: 'Plumbing', children: [] }
          ]
        },
        {
          id: 24,
          name: 'Federated Models',
          children: []
        },
        {
          id: 25,
          name: 'Coordination Reports',
          children: []
        }
      ]
    },
    {
      id: 3,
      name: 'PUBLISHED (Approved)',
      children: [
        {
          id: 31,
          name: 'Documentation',
          children: [
            { id: 311, name: 'Contract Documents', children: [] },
            { id: 312, name: 'Construction Drawings', children: [] },
            { id: 313, name: 'Technical Specifications', children: [] },
            { id: 314, name: 'BOQ (Bill of Quantities)', children: [] }
          ]
        },
        {
          id: 32,
          name: 'Models',
          children: [
            { id: 321, name: 'As Designed', children: [] },
            { id: 322, name: 'Construction Issue', children: [] }
          ]
        },
        {
          id: 33,
          name: 'Compliance',
          children: [
            { id: 331, name: 'Building Regulations', children: [] },
            { id: 332, name: 'Health & Safety', children: [] },
            { id: 333, name: 'Sustainability', children: [] }
          ]
        },
        {
          id: 34,
          name: 'Handover',
          children: [
            { id: 341, name: 'As-Built Drawings', children: [] },
            { id: 342, name: 'O&M Manuals', children: [] },
            { id: 343, name: 'Asset Data', children: [] }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'ARCHIVE',
      children: [
        {
          id: 41,
          name: 'Superseded',
          children: []
        },
        {
          id: 42,
          name: 'Reference Material',
          children: []
        }
      ]
    }
  ];

  const [structure, setStructure] = useState(() => parseStructure(value));
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set([1, 2, 3, 4]));
  const [contextMenu, setContextMenu] = useState(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null); // 'before', 'after', 'inside'

  const generateTextDiagram = useCallback((folders, level = 0) => {
    let result = '';
    folders.forEach((folder, index) => {
      const isLast = index === folders.length - 1;
      const indent = '    '.repeat(level);
      const connector = level === 0 ? '' : (isLast ? '└── ' : '├── ');

      result += `${indent}${connector}📁 ${folder.name}\n`;

      if (folder.children && folder.children.length > 0) {
        result += generateTextDiagram(folder.children, level + 1);
      }
    });
    return result;
  }, []);

  const updateValue = useCallback((newStructure) => {
    setStructure(newStructure);
    const textDiagram = generateTextDiagram(newStructure);
    onChange(name, textDiagram);
  }, [name, onChange, generateTextDiagram]);

  const findNodeById = (nodes, id, parent = null, path = []) => {
    for (const node of nodes) {
      if (node.id === id) return { node, parent, path: [...path, node] };
      if (node.children) {
        const found = findNodeById(node.children, id, node, [...path, node]);
        if (found.node) return found;
      }
    }
    return { node: null, parent: null, path: [] };
  };

  const addFolder = (parentId) => {
    const newStructure = JSON.parse(JSON.stringify(structure));
    const { node: parentNode } = findNodeById(newStructure, parentId);

    if (parentNode) {
      const newFolder = {
        id: Date.now() + Math.random(),
        name: 'New Folder',
        children: []
      };
      parentNode.children.push(newFolder);
      setExpandedNodes(prev => new Set([...prev, parentId]));
      updateValue(newStructure);
      setEditingId(newFolder.id);
      setEditingName('New Folder');
    }
  };

  const removeFolder = (folderId) => {
    const newStructure = JSON.parse(JSON.stringify(structure));

    const removeFromNode = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === folderId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && removeFromNode(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    removeFromNode(newStructure);
    updateValue(newStructure);
  };

  const moveFolder = (folderId, direction) => {
    const newStructure = JSON.parse(JSON.stringify(structure));

    const moveInNode = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === folderId) {
          const newIndex = direction === 'up' ? i - 1 : i + 1;
          if (newIndex >= 0 && newIndex < nodes.length) {
            [nodes[i], nodes[newIndex]] = [nodes[newIndex], nodes[i]];
            return true;
          }
        }
        if (nodes[i].children && moveInNode(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    moveInNode(newStructure);
    updateValue(newStructure);
  };

  const renameFolder = (folderId, newName) => {
    const newStructure = JSON.parse(JSON.stringify(structure));
    const { node } = findNodeById(newStructure, folderId);

    if (node) {
      node.name = newName;
      updateValue(newStructure);
    }
  };

  const startEditing = (folderId, currentName) => {
    setEditingId(folderId);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      renameFolder(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const toggleExpanded = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleContextMenu = (e, folder, isRootLevel) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      folder,
      isRootLevel
    });
  };

  const handleContextMenuAction = (action) => {
    if (!contextMenu) return;

    const { folder } = contextMenu;

    switch (action) {
      case 'add':
        addFolder(folder.id);
        break;
      case 'rename':
        startEditing(folder.id, folder.name);
        break;
      case 'moveUp':
        moveFolder(folder.id, 'up');
        break;
      case 'moveDown':
        moveFolder(folder.id, 'down');
        break;
      case 'delete':
        removeFolder(folder.id);
        break;
      default:
        break;
    }
  };

  const handleBreadcrumbNavigate = (folderId) => {
    if (folderId === null) {
      setBreadcrumbPath([]);
      return;
    }

    const { path } = findNodeById(structure, folderId);
    setBreadcrumbPath(path.slice(0, -1));
  };

  // Drag and Drop handlers
  const handleDragStart = (e, folder) => {
    setDraggedItem(folder);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDropTarget(null);
    setDragOverPosition(null);
  };

  const handleDragOver = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.id === folder.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    // Determine drop position
    if (y < height * 0.25) {
      setDragOverPosition('before');
    } else if (y > height * 0.75) {
      setDragOverPosition('after');
    } else {
      setDragOverPosition('inside');
    }

    setDropTarget(folder);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear if we're actually leaving the element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDropTarget(null);
      setDragOverPosition(null);
    }
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.id === targetFolder.id) {
      setDraggedItem(null);
      setDropTarget(null);
      setDragOverPosition(null);
      return;
    }

    const newStructure = JSON.parse(JSON.stringify(structure));

    // Remove dragged item from its current location
    const removeDraggedItem = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === draggedItem.id) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && removeDraggedItem(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    const draggedItemCopy = JSON.parse(JSON.stringify(draggedItem));
    removeDraggedItem(newStructure);

    // Insert dragged item at new location
    const insertDraggedItem = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetFolder.id) {
          if (dragOverPosition === 'before') {
            nodes.splice(i, 0, draggedItemCopy);
          } else if (dragOverPosition === 'after') {
            nodes.splice(i + 1, 0, draggedItemCopy);
          } else if (dragOverPosition === 'inside') {
            nodes[i].children.push(draggedItemCopy);
            setExpandedNodes(prev => new Set([...prev, targetFolder.id]));
          }
          return true;
        }
        if (nodes[i].children && insertDraggedItem(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    insertDraggedItem(newStructure);
    updateValue(newStructure);

    setDraggedItem(null);
    setDropTarget(null);
    setDragOverPosition(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!focusedId) return;

      // Ctrl+N - Add subfolder
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addFolder(focusedId);
      }
      // F2 - Rename
      if (e.key === 'F2') {
        e.preventDefault();
        const { node } = findNodeById(structure, focusedId);
        if (node) startEditing(focusedId, node.name);
      }
      // Delete - Remove folder
      if (e.key === 'Delete') {
        e.preventDefault();
        const protectedIds = [1, 2, 3, 4]; // WIP, SHARED, PUBLISHED, ARCHIVE
        if (!protectedIds.includes(focusedId)) {
          removeFolder(focusedId);
        }
      }
      // Ctrl+Arrow Up - Move up
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        moveFolder(focusedId, 'up');
      }
      // Ctrl+Arrow Down - Move down
      if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        moveFolder(focusedId, 'down');
      }
      // Enter - Toggle expand
      if (e.key === 'Enter') {
        e.preventDefault();
        toggleExpanded(focusedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedId, structure]);

  const renderFolder = (folder, level = 0, parentId = null, isLast = false, ancestorLines = []) => {
    const isExpanded = expandedNodes.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isEditing = editingId === folder.id;
    const isFocused = focusedId === folder.id;
    const isDragging = draggedItem?.id === folder.id;
    const isDropTarget = dropTarget?.id === folder.id;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`
            flex items-center space-x-1 py-2 px-2 rounded-lg group relative
            transition-all duration-200 cursor-pointer
            ${isFocused ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-100'}
            ${isDragging ? 'opacity-50' : ''}
            ${isDropTarget && dragOverPosition === 'inside' ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
          `}
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, folder)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, folder)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder)}
          onContextMenu={(e) => handleContextMenu(e, folder, level === 0)}
          onClick={() => setFocusedId(folder.id)}
          tabIndex={0}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-label={`${folder.name}${hasChildren ? `, ${folder.children.length} subfolders` : ''}`}
        >
          {/* Drop indicator - before */}
          {isDropTarget && dragOverPosition === 'before' && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
          )}

          {/* Drop indicator - after */}
          {isDropTarget && dragOverPosition === 'after' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />
          )}

          {/* Tree Lines with improved styling */}
          {level > 0 && (
            <div className="flex items-center" style={{ width: `${level * 24}px` }}>
              {/* Ancestor vertical lines */}
              {ancestorLines.map((shouldShowLine, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ width: '24px', height: '28px' }}
                >
                  {shouldShowLine && (
                    <div
                      className="absolute left-3 top-0 w-px bg-gradient-to-b from-blue-300 to-blue-400"
                      style={{ height: '28px' }}
                    />
                  )}
                </div>
              ))}

              {/* Current level connector - improved arrows */}
              <div className="relative" style={{ width: '24px', height: '28px' }}>
                {/* Vertical line from parent */}
                {!isLast && (
                  <div
                    className="absolute left-3 top-0 w-px bg-gradient-to-b from-blue-300 to-blue-400"
                    style={{ height: '28px' }}
                  />
                )}

                {/* L-shaped connector */}
                <svg
                  className="absolute left-0 top-0"
                  width="24"
                  height="28"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d={`M 12 0 L 12 14 L 20 14`}
                    stroke="url(#gradient)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Arrow head */}
                  <path
                    d="M 18 12 L 20 14 L 18 16"
                    stroke="url(#gradient)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          {/* Drag handle */}
          <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Expand/Collapse Button with animation */}
          {hasChildren && (
            <Tooltip content={isExpanded ? "Collapse folder" : "Expand folder"}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(folder.id);
                }}
                className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-all"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
            </Tooltip>
          )}
          {!hasChildren && <div className="w-5" />}

          {/* Folder Icon with animation */}
          <div className={`transition-all duration-200 ${isExpanded ? 'text-blue-600' : 'text-blue-500'}`}>
            {isExpanded ? (
              <FolderOpen className="w-5 h-5 animate-folderOpen" />
            ) : (
              <Folder className="w-5 h-5" />
            )}
          </div>

          {/* Folder Name */}
          <div className="flex-1 flex items-center space-x-2">
            {isEditing ? (
              <div className="flex items-center space-x-2 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  aria-label="Folder name"
                />
                <Tooltip content="Save (Enter)">
                  <button
                    onClick={saveEdit}
                    className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    aria-label="Save changes"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Cancel (Esc)">
                  <button
                    onClick={cancelEdit}
                    className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-800 flex-1">
                  {folder.name}
                  {hasChildren && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({folder.children.length})
                    </span>
                  )}
                </span>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip content="Add subfolder (Ctrl+N)">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addFolder(folder.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-md transition-all hover:scale-110"
                      aria-label="Add subfolder"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Rename folder (F2)">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(folder.id, folder.name);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-md transition-all hover:scale-110"
                      aria-label="Rename folder"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  {(() => {
                    const protectedIds = [1, 2, 3, 4]; // WIP, SHARED, PUBLISHED, ARCHIVE
                    const canDelete = level > 0 || !protectedIds.includes(folder.id);
                    return canDelete && (
                      <Tooltip content="Delete folder (Del)">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFolder(folder.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-all hover:scale-110"
                          aria-label="Delete folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Children with collapse animation */}
        {hasChildren && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            {folder.children.map((child, index) => {
              const isLastChild = index === folder.children.length - 1;
              const newAncestorLines = [...ancestorLines, !isLast];
              return renderFolder(child, level + 1, folder.id, isLastChild, newAncestorLines);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8 w-full">
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />

      <div className="w-full border rounded-xl overflow-hidden shadow-lg bg-white">
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-6 py-4 border-b border-blue-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Move className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-semibold text-blue-900">Interactive File Structure</span>
                <p className="text-xs text-blue-600 mt-0.5">Drag & drop to reorganize • Right-click for options</p>
              </div>
            </div>
            <Tooltip content="Add new top-level CDE folder">
              <button
                onClick={() => {
                  const newFolder = {
                    id: Date.now() + Math.random(),
                    name: 'New CDE Level',
                    children: []
                  };
                  const newStructure = [...structure, newFolder];
                  updateValue(newStructure);
                  setEditingId(newFolder.id);
                  setEditingName('New CDE Level');
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                aria-label="Add CDE Level"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="font-medium">Add CDE Level</span>
              </button>
            </Tooltip>
          </div>
        </div>

        <Breadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />

        <div
          className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-80 max-h-[600px] overflow-y-auto custom-scrollbar"
          role="tree"
          aria-label="Folder structure tree"
        >
          {structure.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FolderPlus className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No folders yet</p>
              <p className="text-sm">Click "Add CDE Level" to create your first folder</p>
            </div>
          ) : (
            structure.map((folder, index) => {
              const isLastRoot = index === structure.length - 1;
              return renderFolder(folder, 0, null, isLastRoot, []);
            })
          )}
        </div>

        <div className="w-full bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-start space-x-2 text-gray-600">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Quick Tips:</p>
              <ul className="text-xs space-y-1">
                <li><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Right-click</kbd> on any folder for quick actions menu</li>
                <li><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Drag & drop</kbd> folders to reorganize your structure</li>
                <li><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Ctrl+N</kbd> Add subfolder • <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">F2</kbd> Rename • <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Del</kbd> Delete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FieldError
        error={error}
        className="mt-2 flex items-center space-x-1"
        icon={<X className="w-4 h-4" />}
        iconClassName="inline-flex"
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          folder={contextMenu.folder}
          isRootLevel={contextMenu.isRootLevel}
          onClose={() => setContextMenu(null)}
          onAction={handleContextMenuAction}
        />
      )}

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes folderOpen {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-10deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }

        .animate-folderOpen {
          animation: folderOpen 0.3s ease-out;
        }

        kbd {
          font-family: monospace;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default FolderStructureDiagram;
