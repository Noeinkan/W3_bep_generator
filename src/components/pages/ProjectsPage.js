import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, ArrowRight, Trash2, Pencil, Check, X } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import toast from 'react-hot-toast';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    loading,
    currentProject,
    selectProject,
    createProject,
    updateProject,
    deleteProject
  } = useProject();

  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async () => {
    const name = newProjectName.trim();
    if (!name) return;

    try {
      const project = await createProject(name);
      setNewProjectName('');
      setIsCreating(false);
      selectProject(project);
      toast.success(`Project "${name}" created`);
      navigate('/bep-generator');
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    }
  };

  const handleSelect = (project) => {
    selectProject(project);
    navigate('/bep-generator');
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    if (!window.confirm(`Delete project "${project.name}"? This will not delete associated drafts or TIDPs.`)) return;

    try {
      await deleteProject(project.id);
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleStartEdit = (e, project) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    const name = editName.trim();
    if (!name) return;

    try {
      await updateProject(editingId, name);
      setEditingId(null);
      toast.success('Project renamed');
    } catch (err) {
      toast.error('Failed to rename project');
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h1>
          <p className="text-gray-600">
            Select a project to work on, or create a new one.
          </p>
        </div>

        {/* Create New Project */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create New Project</span>
          </button>
        ) : (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                placeholder="e.g. London Bridge Station Redevelopment"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleCreate}
                disabled={!newProjectName.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => { setIsCreating(false); setNewProjectName(''); }}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Project List */}
        {projects.length === 0 && !isCreating ? (
          <div className="text-center py-16 text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No projects yet</p>
            <p className="text-sm mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => editingId !== project.id && handleSelect(project)}
                className={`group flex items-center justify-between px-6 py-4 bg-white rounded-xl border transition-all duration-200 cursor-pointer ${
                  currentProject?.id === project.id
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentProject?.id === project.id ? 'bg-blue-200' : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}>
                    <FolderOpen className={`w-5 h-5 ${
                      currentProject?.id === project.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === project.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(e);
                            if (e.key === 'Escape') handleCancelEdit(e);
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleSaveEdit} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Created {formatDate(project.created_at)}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {editingId !== project.id && (
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={(e) => handleStartEdit(e, project)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Rename project"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
