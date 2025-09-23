import { useState } from 'react';
import { Task, KanbanColumn } from '@/types';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'done', title: 'Done', status: 'done' },
];

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

interface SortableTaskProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

function SortableTask({ task, onDelete }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onDelete={onDelete} isDragging={isDragging} />
    </div>
  );
}

export function KanbanBoard({ tasks, onUpdateTask, onDeleteTask, onAddTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeTask = tasks.find(task => task.id === event.active.id);
    setActiveTask(activeTask || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const overColumn = columns.find(col => col.id === over.id);
    if (overColumn && activeTask.status !== overColumn.status) {
      onUpdateTask(activeTask.id, { status: overColumn.status });
      return;
    }

    // Handle task reordering within the same column
    const overTask = tasks.find(task => task.id === over.id);
    if (overTask && activeTask.status === overTask.status) {
      // Reordering logic would go here if needed
      // For now, we're just updating status when moving between columns
    }
  };

  return (
    <DndContext 
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div key={column.id} className="space-y-4">
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext 
                    items={columnTasks.map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[200px]">
                      {columnTasks.map(task => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onDelete={onDeleteTask}
                        />
                      ))}
                      
                      {column.status === 'todo' && (
                        <Button
                          onClick={onAddTask}
                          variant="ghost"
                          className="w-full h-20 border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Task
                        </Button>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} onDelete={() => {}} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}