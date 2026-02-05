import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import GoalEditor from './GoalEditor';

interface TimeUnit {
  value: number;
  prevValue: number;
}

interface GoalConfig {
  name: string;
  targetDate: string;
  startDate: string;
}

export default function ReverseLifeClock() {
  const [goalConfig, setGoalConfig] = useState<GoalConfig>({
    name: 'CFA Level 1',
    targetDate: '2026-06-30T23:59:59',
    startDate: new Date().toISOString(),
  });

  const [timeRemaining, setTimeRemaining] = useState({
    days: { value: 0, prevValue: 0 },
    hours: { value: 0, prevValue: 0 },
    minutes: { value: 0, prevValue: 0 },
    seconds: { value: 0, prevValue: 0 },
    totalDays: 0,
    daysElapsed: 0,
    percentUsed: 0,
  });

  useEffect(() => {
    const savedGoal = localStorage.getItem('goalConfig');
    if (savedGoal) {
      setGoalConfig(JSON.parse(savedGoal));
    } else {
      const defaultGoal: GoalConfig = {
        name: 'CFA Level 1',
        targetDate: '2026-06-30T23:59:59',
        startDate: new Date().toISOString(),
      };
      localStorage.setItem('goalConfig', JSON.stringify(defaultGoal));
      setGoalConfig(defaultGoal);
    }
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const deadline = new Date(goalConfig.targetDate);
      const now = new Date();
      const startDate = new Date(goalConfig.startDate);
      
      const diff = deadline.getTime() - now.getTime();
      const totalDiff = deadline.getTime() - startDate.getTime();
      const elapsedDiff = now.getTime() - startDate.getTime();
      
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
      
      const totalDays = Math.floor(totalDiff / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.floor(elapsedDiff / (1000 * 60 * 60 * 24));
      const percentUsed = totalDays > 0 ? Math.min(100, Math.floor((daysElapsed / totalDays) * 100)) : 0;

      setTimeRemaining(prev => ({
        days: { value: days, prevValue: prev.days.value },
        hours: { value: hours, prevValue: prev.hours.value },
        minutes: { value: minutes, prevValue: prev.minutes.value },
        seconds: { value: seconds, prevValue: prev.seconds.value },
        totalDays,
        daysElapsed,
        percentUsed,
      }));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [goalConfig]);

  const handleGoalUpdate = (newGoal: GoalConfig) => {
    setGoalConfig(newGoal);
  };

  const DigitDisplay = ({ unit }: { unit: TimeUnit }) => {
    const hasChanged = unit.value !== unit.prevValue;
    
    return (
      <div className="relative overflow-hidden">
        <div 
          className={`transition-all duration-300 ${hasChanged ? 'animate-flip-number' : ''}`}
          style={{
            textShadow: '0 0 28px oklch(var(--chart-1) / 0.7), 0 0 56px oklch(var(--chart-1) / 0.5)',
          }}
        >
          {String(unit.value).padStart(2, '0')}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-10 bg-card/60 backdrop-blur-sm border-accent/25 shadow-2xl relative overflow-hidden scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1/8 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-9 h-9 text-chart-1" />
            <h2 className="text-3xl font-bold text-foreground">Reverse Life-Clock</h2>
          </div>
          <GoalEditor onGoalUpdate={handleGoalUpdate} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="text-center">
            <div className="text-7xl font-extrabold text-chart-1 mb-3 tabular-nums tracking-widest digital-font">
              <DigitDisplay unit={timeRemaining.days} />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Days</div>
          </div>
          <div className="text-center">
            <div className="text-7xl font-extrabold text-chart-2 mb-3 tabular-nums tracking-widest digital-font">
              <DigitDisplay unit={timeRemaining.hours} />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-7xl font-extrabold text-chart-3 mb-3 tabular-nums tracking-widest digital-font">
              <DigitDisplay unit={timeRemaining.minutes} />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-7xl font-extrabold text-chart-4 mb-3 tabular-nums tracking-widest digital-font">
              <DigitDisplay unit={timeRemaining.seconds} />
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Seconds</div>
          </div>
        </div>

        <div className="space-y-4">
          <Progress value={timeRemaining.percentUsed} className="h-3" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{timeRemaining.daysElapsed} days elapsed</span>
            <span className="font-semibold text-foreground">{timeRemaining.percentUsed}% used</span>
            <span>{timeRemaining.days.value} days remaining</span>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-xl font-semibold text-destructive animate-pulse">
            You will never get this day back.
          </p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
            CURRENT MISSION: <span className="text-chart-1">{goalConfig.name}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
