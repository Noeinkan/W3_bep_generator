import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, ArrowRight, Trash2, Pencil, Check, X, ArrowLeft, FileText, Calendar } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import toast from 'react-hot-toast';
import ConfirmDialog from '../common/ConfirmDialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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

  const handleDelete = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);
      toast.success('Project deleted');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-black opacity-10" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }} />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse" />
        <div className="absolute top-6 right-20 w-14 h-14 bg-white opacity-10 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-8 left-1/4 w-10 h-10 bg-white opacity-10 rounded-full animate-pulse delay-2000" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {/* Back to Home */}
          <button
            onClick={() => navigate('/home')}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white text-sm font-medium hover:bg-opacity-20 transition-all duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">Your Projects</h1>
              <p className="text-blue-100 text-base lg:text-lg">
                Select a project to work on, or create a new one
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
              <FolderOpen className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-medium text-white">{projects.length} {projects.length === 1 ? 'Project' : 'Projects'}</span>
            </div>
            {currentProject && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <FileText className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium text-white">Active: <span className="text-green-200">{currentProject.name}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Create New Project */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mb-8 flex items-center justify-center gap-3 px-6 py-5 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Create New Project</span>
          </button>
        ) : (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">New Project</h2>
            </div>
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleCreate}
                disabled={!newProjectName.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Create
              </button>
              <button
                onClick={() => { setIsCreating(false); setNewProjectName(''); }}
                className="px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Project List */}
        {projects.length === 0 && !isCreating ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-xl font-semibold text-gray-400 mb-2">No projects yet</p>
            <p className="text-gray-400 mb-6">Create your first project to start generating BEPs</p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => editingId !== project.id && handleSelect(project)}
                className={`group relative flex items-center justify-between px-6 py-5 bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  currentProject?.id === project.id
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {/* Active indicator */}
                {currentProject?.id === project.id && (
                  <div className="absolute -left-px top-4 bottom-4 w-1 bg-blue-500 rounded-r-full" />
                )}

                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    currentProject?.id === project.id
                      ? 'bg-blue-200'
                      : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}>
                    <FolderOpen className={`w-6 h-6 transition-colors ${
                      currentProject?.id === project.id
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-blue-500'
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
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancelEdit} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-gray-900 truncate text-lg">{project.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Created {formatDate(project.created_at)}
                          </span>
                          {currentProject?.id === project.id && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              Active
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {editingId !== project.id && (
                  <div className="flex items-center gap-1.5 ml-4">
                    <button
                      onClick={(e) => handleStartEdit(e, project)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                      title="Rename project"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-blue-100 transition-colors ml-1">
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Project"
        message={`Delete project "${projectToDelete?.name}"? This will permanently delete all associated drafts, BEPs, TIDPs, and MIDPs. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProjectsPage;
