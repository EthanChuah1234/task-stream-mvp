import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Timer, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FocusTimerProps {
  taskId: string;
  taskTitle: string;
  onFocusComplete: (taskId: string, focusTimeMinutes: number) => void;
}

export function FocusTimer({ taskId, taskTitle, onFocusComplete }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const { toast } = useToast();

  const workDuration = 25 * 60; // 25 minutes
  const shortBreakDuration = 5 * 60; // 5 minutes
  const longBreakDuration = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      const focusMinutes = workDuration / 60;
      setTotalFocusTime(prev => prev + focusMinutes);
      setSessionCount(prev => prev + 1);
      
      onFocusComplete(taskId, focusMinutes);
      
      toast({
        title: "Focus session complete! 🎯",
        description: `Great work! You focused for ${focusMinutes} minutes.`,
      });
      
      // Switch to break
      const newSessionCount = sessionCount + 1;
      const isLongBreak = newSessionCount % 4 === 0;
      setMode('break');
      setTimeLeft(isLongBreak ? longBreakDuration : shortBreakDuration);
      
      toast({
        title: `Time for a ${isLongBreak ? 'long' : 'short'} break! ☕`,
        description: `Take ${isLongBreak ? '15' : '5'} minutes to recharge.`,
      });
    } else {
      toast({
        title: "Break time's over! 💪",
        description: "Ready for another focus session?",
      });
      
      // Switch back to work
      setMode('work');
      setTimeLeft(workDuration);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    
    // Calculate and save partial focus time if it was a work session
    if (mode === 'work' && startTimeRef.current) {
      const elapsedMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
      if (elapsedMinutes > 0) {
        setTotalFocusTime(prev => prev + elapsedMinutes);
        onFocusComplete(taskId, elapsedMinutes);
      }
    }
    
    setMode('work');
    setTimeLeft(workDuration);
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = mode === 'work' 
      ? workDuration 
      : (sessionCount % 4 === 0 ? longBreakDuration : shortBreakDuration);
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {mode === 'work' ? (
            <Timer className="w-4 h-4 text-primary" />
          ) : (
            <Coffee className="w-4 h-4 text-secondary" />
          )}
          Focus Timer
          <Badge variant={mode === 'work' ? 'default' : 'secondary'} className="text-xs">
            {mode === 'work' ? 'Work' : 'Break'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-foreground mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={getProgress()} className="h-2 mb-3" />
          <p className="text-sm text-muted-foreground truncate">
            {taskTitle}
          </p>
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="flex-1"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="secondary"
              className="flex-1"
              size="sm"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleStop}
            variant="outline"
            size="sm"
            disabled={!isRunning && timeLeft === workDuration}
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>

        {totalFocusTime > 0 && (
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Total focus time: <span className="font-medium text-foreground">{totalFocusTime} minutes</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Sessions completed: <span className="font-medium text-foreground">{sessionCount}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}