export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
}