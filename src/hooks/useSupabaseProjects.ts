import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, Task } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          tasks (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map database format to interface format
      const mappedProjects = (data || []).map(project => ({
        ...project,
        createdAt: project.created_at, // Legacy support
        tasks: project.tasks?.map((task: any) => ({
          ...task,
          status: task.status as 'todo' | 'in-progress' | 'done',
          createdAt: task.created_at, // Legacy support
        })) || []
      }));
      setProjects(mappedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newProject = { 
        ...data, 
        tasks: [],
        createdAt: data.created_at // Legacy support
      };
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: "Project created",
        description: `${name} has been created successfully.`,
      });
      
      return newProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? { ...project, ...data }
            : project
        )
      );
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTask = async (projectId: string, task: Omit<Task, 'id' | 'project_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          project_id: projectId,
        })
        .select()
        .single();

      if (error) throw error;

      const mappedTask = {
        ...data,
        status: data.status as 'todo' | 'in-progress' | 'done',
        createdAt: data.created_at // Legacy support
      };

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                tasks: [...(project.tasks || []), mappedTask],
              }
            : project
        )
      );

      toast({
        title: "Task added",
        description: `${task.title} has been added to the project.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const mappedTaskUpdate = {
        ...data,
        status: data.status as 'todo' | 'in-progress' | 'done',
        createdAt: data.created_at // Legacy support
      };

      setProjects(prev =>
        prev.map(project => ({
          ...project,
          tasks: project.tasks?.map(task =>
            task.id === taskId ? { ...task, ...mappedTaskUpdate } : task
          ),
        }))
      );

      // Show level up notification if task was completed
      if (updates.status === 'done') {
        toast({
          title: "Task completed! 🎉",
          description: `You earned ${data.xp_reward} XP!`,
        });
      }
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project => ({
          ...project,
          tasks: project.tasks?.filter(task => task.id !== taskId),
        }))
      );

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchProjects,
  };
}