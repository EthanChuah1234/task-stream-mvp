import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

interface AITaskBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTasksCreated: (tasks: Array<{ title: string; description: string; deadline: string; status: 'todo'; xp_reward: number }>) => void;
}

export function AITaskBreakdownDialog({ open, onOpenChange, onTasksCreated }: AITaskBreakdownDialogProps) {
  const [mainTask, setMainTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleGenerateSubtasks = async () => {
    if (!mainTask.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai', {
        body: { 
          message: `Break down this task: "${mainTask}". Provide 3-5 specific, actionable subtasks. Format each subtask as a single line starting with "- ". Keep each subtask focused and concrete.`
        }
      });

      if (error) throw error;

      const response = data?.response;
      if (!response) throw new Error('No response from AI');

      // Parse the AI response to extract subtasks
      const tasks = response
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-'))
        .map((line: string) => line.replace(/^-\s*/, '').trim())
        .filter((task: string) => task.length > 0);

      setSuggestedTasks(tasks);
      setSelectedTasks(new Set(tasks.map((_, index) => index)));
    } catch (error: any) {
      console.error('Error generating subtasks:', error);
      toast({
        title: "Error generating subtasks",
        description: error.message || "Failed to generate subtasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (index: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };

  const handleCreateTasks = () => {
    const tasksToCreate = suggestedTasks
      .filter((_, index) => selectedTasks.has(index))
      .map(task => ({
        title: task,
        description: `Generated from: ${mainTask}`,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        status: 'todo' as const,
        xp_reward: 10,
      }));

    onTasksCreated(tasksToCreate);
    
    // Reset state
    setMainTask('');
    setSuggestedTasks([]);
    setSelectedTasks(new Set());
    onOpenChange(false);

    toast({
      title: "Tasks created successfully! 🚀",
      description: `${tasksToCreate.length} subtasks have been added to your project.`,
    });
  };

  const handleReset = () => {
    setSuggestedTasks([]);
    setSelectedTasks(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Task Breakdown
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let AI help you break down complex tasks into smaller, actionable steps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input for main task */}
          <div className="space-y-2">
            <Label htmlFor="main-task" className="text-foreground">
              What's the main task you want to break down?
            </Label>
            <Input
              id="main-task"
              value={mainTask}
              onChange={(e) => setMainTask(e.target.value)}
              placeholder="e.g., Build authentication system, Create landing page, Set up CI/CD pipeline..."
              className="bg-background border-input"
            />
          </div>

          {/* Generate button */}
          {suggestedTasks.length === 0 && (
            <Button
              onClick={handleGenerateSubtasks}
              disabled={!mainTask.trim() || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating subtasks...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Subtasks
                </>
              )}
            </Button>
          )}

          {/* Suggested tasks */}
          {suggestedTasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                  AI-Generated Subtasks
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Generate New
                </Button>
              </div>

              <div className="space-y-2">
                {suggestedTasks.map((task, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all border ${
                      selectedTasks.has(index)
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border'
                    }`}
                    onClick={() => toggleTaskSelection(index)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 transition-colors ${
                          selectedTasks.has(index) 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`}>
                          {selectedTasks.has(index) ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{task}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              +10 XP
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              1 week deadline
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTasks}
                  disabled={selectedTasks.size === 0}
                  className="flex-1"
                >
                  Create {selectedTasks.size} Task{selectedTasks.size !== 1 ? 's' : ''}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}