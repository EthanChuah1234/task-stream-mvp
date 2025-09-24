export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  notes?: string; // Markdown notes
  deadline?: string;
  status: 'todo' | 'in-progress' | 'done';
  xp_reward: number;
  focus_time: number; // in minutes
  created_at: string;
  updated_at: string;
  // Legacy support for existing code
  createdAt?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  // Legacy support for existing code
  createdAt?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  xp: number;
  level: number;
  badges: string[];
  total_focus_time: number; // in minutes
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

export interface FocusSession {
  id: string;
  task_id: string;
  start_time: string;
  end_time?: string;
  duration?: number; // in minutes
  type: 'work' | 'break';
}