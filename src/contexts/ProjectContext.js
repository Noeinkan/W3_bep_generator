import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { draftStorageService } from '../services/draftStorageService';
import apiService from '../services/apiService';
import { draftApiService } from '../services/draftApiService';
import { getTemplateById } from '../data/templateRegistry';

const ProjectContext = createContext();

const SAMPLE_PROJECT_NAME = 'Sample Project';

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

/**
 * Seed BEP drafts and EIR draft into the Sample Project when it has none.
 * Runs once per session after the project is created or found.
 */
const seedSampleDrafts = async (projectId) => {
  try {
    const draftsRes = await draftApiService.getAllDrafts(projectId);
    const existingDrafts = Array.isArray(draftsRes) ? draftsRes : [];
    const promises = [];

    if (!existingDrafts.some(d => d.type === 'pre-appointment' || d.bepType === 'pre-appointment')) {
      const preData = getTemplateById('commercial-office-pre');
      if (preData) {
        promises.push(
          draftApiService.createDraft('Commercial Office — Pre-Appointment BEP', 'pre-appointment', preData, projectId)
        );
      }
    }

    if (!existingDrafts.some(d => d.type === 'post-appointment' || d.bepType === 'post-appointment')) {
      const postData = getTemplateById('commercial-office-post');
      if (postData) {
        promises.push(
          draftApiService.createDraft('Commercial Office — Post-Appointment BEP', 'post-appointment', postData, projectId)
        );
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      console.log(`Seeded ${promises.length} template draft(s) into Sample Project`);
    }
  } catch (err) {
    console.error('Failed to seed Sample Project drafts:', err);
  }
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

        // Ensure "Sample Project" always exists (once per session)
        if (!seedRunRef.current) {
          let sampleProject = projectList.find(p => p.name === SAMPLE_PROJECT_NAME);

          if (!sampleProject) {
            try {
              const createRes = await apiService.createProject({ name: SAMPLE_PROJECT_NAME });
              if (createRes.success) {
                sampleProject = createRes.project;
                projectList = [sampleProject, ...projectList];

                const migrated = draftStorageService.migrateOrphanedDrafts(user.id, sampleProject.id);
                if (migrated > 0) {
                  console.log(`Migrated ${migrated} orphaned draft(s) to Sample Project`);
                }
              }
            } catch (seedErr) {
              console.error('Failed to create Sample Project:', seedErr);
            }
          }

          if (sampleProject) {
            seedRunRef.current = true;
            seedSampleDrafts(sampleProject.id);

            // Auto-select Sample Project when no project is currently selected
            if (!localStorage.getItem('currentProjectId')) {
              setCurrentProject(sampleProject);
              localStorage.setItem('currentProjectId', sampleProject.id);
            }
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
