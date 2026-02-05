import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface GoalConfig {
  name: string;
  targetDate: string;
  startDate: string;
}

export default function DaysRemaining() {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const savedGoal = localStorage.getItem('goalConfig');
      let targetDate: Date;
      
      if (savedGoal) {
        const goal: GoalConfig = JSON.parse(savedGoal);
        targetDate = new Date(goal.targetDate);
      } else {
        targetDate = new Date('2026-06-30T23:59:59');
      }
      
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      setDaysRemaining(days);
    };

    calculateDays();
    const timer = setInterval(calculateDays, 60000);
    
    // Listen for goal updates
    const handleGoalUpdate = () => {
      calculateDays();
    };
    
    window.addEventListener('goalUpdated', handleGoalUpdate);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('goalUpdated', handleGoalUpdate);
    };
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-br from-destructive/15 to-destructive/5 backdrop-blur-sm border-destructive/30 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <Target className="w-6 h-6 text-destructive" />
        <h3 className="text-lg font-semibold text-foreground">Days Remaining</h3>
      </div>
      <p className="text-3xl font-bold text-destructive mb-2 digital-font">
        {daysRemaining}
      </p>
      <p className="text-sm text-muted-foreground font-medium">
        Execution {'>'} Mood.
      </p>
    </Card>
  );
}
