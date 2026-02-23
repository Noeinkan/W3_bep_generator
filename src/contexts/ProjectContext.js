import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { draftStorageService } from '../services/draftStorageService';
import apiService from '../services/apiService';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const seedRunRef = useRef(false);

  const loadProjects = useCallback(async () => {
    if (!user?.id) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getProjects();
      if (response.success) {
        let projectList = response.projects;

        // Auto-create "Sample Project" if no projects exist (once per successful attempt)
        if (projectList.length === 0 && !seedRunRef.current) {
          try {
            const createRes = await apiService.createProject({
              name: 'Sample Project'
            });
            if (createRes.success) {
              seedRunRef.current = true; // only lock after success so failures allow a retry
              const sampleProject = createRes.project;
              projectList = [sampleProject];

              // Migrate orphaned localStorage drafts to this project
              const migrated = draftStorageService.migrateOrphanedDrafts(user.id, sampleProject.id);
              if (migrated > 0) {
                console.log(`Migrated ${migrated} orphaned draft(s) to Sample Project`);
              }

              // Auto-select it
              setCurrentProject(sampleProject);
              localStorage.setItem('currentProjectId', sampleProject.id);
            }
          } catch (seedErr) {
            console.error('Failed to seed Sample Project:', seedErr);
          }
        }

        setProjects(projectList);

        // Restore last selected project from localStorage (if not already set by seeding)
        if (!currentProject) {
          const savedProjectId = localStorage.getItem('currentProjectId');
          if (savedProjectId) {
            const saved = projectList.find(p => p.id === savedProjectId);
            if (saved) {
              setCurrentProject(saved);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const selectProject = useCallback((project) => {
    setCurrentProject(project);
    if (project) {
      localStorage.setItem('currentProjectId', project.id);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  }, []);

  const createProject = useCallback(async (name) => {
    if (!user?.id) throw new Error('Must be logged in');

    const response = await apiService.createProject({
      name
    });

    if (response.success) {
      const newProject = response.project;
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    }
    throw new Error('Failed to create project');
  }, [user?.id]);

  const updateProject = useCallback(async (id, name) => {
    const response = await apiService.updateProject(id, { name });

    if (response.success) {
      const updated = response.project;
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      if (currentProject?.id === id) {
        setCurrentProject(updated);
      }
      return updated;
    }
    throw new Error('Failed to update project');
  }, [currentProject?.id]);

  const deleteProject = useCallback(async (id) => {
    await apiService.deleteProject(id);

    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
      localStorage.removeItem('currentProjectId');
    }
  }, [currentProject?.id]);

  const clearProject = useCallback(() => {
    setCurrentProject(null);
    localStorage.removeItem('currentProjectId');
  }, []);

  const value = {
    currentProject,
    projects,
    loading,
    selectProject,
    createProject,
    updateProject,
    deleteProject,
    clearProject,
    loadProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
