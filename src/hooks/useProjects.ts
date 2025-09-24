import { useState, useEffect } from 'react';
import { Project, Task } from '@/types';

const STORAGE_KEY = 'projectmate-projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  };

  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      user_id: 'local',
      name,
      description,
      tasks: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    saveProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    saveProjects(projects.filter(project => project.id !== projectId));
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'project_id' | 'created_at' | 'updated_at'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      project_id: projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    );
    saveProjects(updatedProjects);
    return newTask;
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          }
        : project
    );
    saveProjects(updatedProjects);
  };

  const deleteTask = (projectId: string, taskId: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) }
        : project
    );
    saveProjects(updatedProjects);
  };

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  };
}