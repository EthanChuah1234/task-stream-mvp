import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  style?: React.CSSProperties;
  isDragging?: boolean;
}

export function TaskCard({ task, onDelete, style, isDragging }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';
  const deadlineDate = new Date(task.deadline);
  const isToday = deadlineDate.toDateString() === new Date().toDateString();
  
  return (
    <Card 
      className={`bg-gradient-card shadow-card hover:shadow-hover transition-all duration-200 border-border/50 ${
        isDragging ? 'opacity-50 rotate-3' : ''
      }`}
      style={style}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
            {task.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <CardDescription className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            <span className={`${isOverdue ? 'text-destructive' : isToday ? 'text-primary' : 'text-muted-foreground'}`}>
              {deadlineDate.toLocaleDateString()}
            </span>
          </div>
          {isOverdue && task.status !== 'done' && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
          {isToday && task.status !== 'done' && (
            <Badge variant="default" className="text-xs">
              Today
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}