import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, addTask, updateTask, deleteTask, deleteProject } = useProjects();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project not found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const upcomingTasks = project.tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  const handleCreateTask = (taskData: { title: string; description: string; deadline: string; status: 'todo' }) => {
    addTask(project.id, taskData);
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    updateTask(project.id, taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(project.id, taskId);
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                      Delete Project
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Delete Project</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete "{project.name}"? This action cannot be undone and will remove all tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{totalTasks}</span>
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {project.tasks.filter(t => t.status === 'in-progress').length} in progress
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-1">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground truncate">{task.title}</span>
                        <span className="text-muted-foreground">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span className="text-xs">No upcoming deadlines</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <KanbanBoard
          tasks={project.tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={() => setCreateTaskOpen(true)}
        />

        <CreateTaskDialog
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
          onCreateTask={handleCreateTask}
        />
      </div>
    </div>
  );
}