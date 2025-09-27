import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AITaskBreakdownDialog } from '@/components/ai/AITaskBreakdownDialog';
import { Sparkles } from 'lucide-react';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: { title: string; description: string; deadline: string; status: 'todo'; xp_reward: number }) => void;
  onCreateMultipleTasks?: (tasks: Array<{ title: string; description: string; deadline: string; status: 'todo'; xp_reward: number }>) => void;
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask, onCreateMultipleTasks }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showAIDialog, setShowAIDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && deadline) {
      onCreateTask({
        title: title.trim(),
        description: description.trim(),
        deadline,
        status: 'todo',
        xp_reward: 10,
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      onOpenChange(false);
    }
  };

  const handleAITasksCreated = (tasks: Array<{ title: string; description: string; deadline: string; status: 'todo'; xp_reward: number }>) => {
    if (onCreateMultipleTasks) {
      onCreateMultipleTasks(tasks);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new task to your project and set a deadline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-foreground">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-input border-border text-foreground"
              required
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAIDialog(true)}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Breakdown
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Create Task
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
      
      <AITaskBreakdownDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        onTasksCreated={handleAITasksCreated}
      />
    </Dialog>
  );
}