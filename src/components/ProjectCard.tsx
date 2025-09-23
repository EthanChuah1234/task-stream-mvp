import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const upcomingDeadlines = project.tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 2);

  return (
    <Card 
      className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer group border-border/50"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {upcomingDeadlines.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Upcoming deadlines</span>
            </div>
            <div className="space-y-1">
              {upcomingDeadlines.map(task => (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate">{task.title}</span>
                  <span className="text-muted-foreground">
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {totalTasks === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}