import { Card } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import { useStudyData } from '../hooks/useQueries';

export default function StreakDisplay() {
  const { getCurrentStreak, getLongestStreak, isStreakBroken } = useStudyData();
  const currentStreak = getCurrentStreak();
  const longestStreak = getLongestStreak();
  const streakBroken = isStreakBroken();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="flex items-center gap-3">
          <Flame className={`w-8 h-8 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          <div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-2xl font-bold text-foreground">{currentStreak} days</div>
            {streakBroken && (
              <div className="text-xs text-destructive mt-1">
                Streak broken. Restart stronger.
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/trophy-icon-transparent.dim_64x64.png" 
            alt="Trophy" 
            className="w-8 h-8"
          />
          <div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
            <div className="text-2xl font-bold text-foreground">{longestStreak} days</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
