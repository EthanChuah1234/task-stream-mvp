import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Profile } from '@/types';

interface XPDisplayProps {
  profile: Profile;
}

export function XPDisplay({ profile }: XPDisplayProps) {
  // Calculate XP needed for next level
  const getXPForLevel = (level: number) => {
    return level * level * 100; // Quadratic progression
  };

  const currentLevelXP = getXPForLevel(profile.level - 1);
  const nextLevelXP = getXPForLevel(profile.level);
  const xpInCurrentLevel = profile.xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const progressPercentage = (xpInCurrentLevel / xpNeededForNext) * 100;

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'first_task':
        return <Target className="w-3 h-3" />;
      case 'streak_3':
        return <Zap className="w-3 h-3" />;
      case 'focus_master':
        return <Star className="w-3 h-3" />;
      default:
        return <Trophy className="w-3 h-3" />;
    }
  };

  const getBadgeName = (badgeId: string) => {
    switch (badgeId) {
      case 'first_task':
        return 'First Task';
      case 'streak_3':
        return 'On Fire';
      case 'focus_master':
        return 'Focus Master';
      default:
        return 'Achievement';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level and XP */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="default" className="text-sm font-bold">
              Level {profile.level}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {profile.xp.toLocaleString()} XP
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-2" />
          
          <p className="text-xs text-muted-foreground">
            {xpInCurrentLevel} / {xpNeededForNext} XP to Level {profile.level + 1}
          </p>
        </div>

        {/* Focus Time Stats */}
        {profile.total_focus_time > 0 && (
          <div className="text-center pt-3 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {Math.floor(profile.total_focus_time / 60)}h {profile.total_focus_time % 60}m
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total focus time
            </p>
          </div>
        )}

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Achievements
            </h4>
            <div className="flex flex-wrap gap-1">
              {profile.badges.slice(0, 6).map((badgeId, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {getBadgeIcon(badgeId)}
                  {getBadgeName(badgeId)}
                </Badge>
              ))}
              {profile.badges.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.badges.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {profile.level}
            </div>
            <div className="text-xs text-muted-foreground">
              Current Level
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              {profile.badges?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              Badges Earned
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}