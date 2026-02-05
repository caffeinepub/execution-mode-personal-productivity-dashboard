import { useEffect, useState } from 'react';

interface GoalConfig {
  name: string;
  targetDate: string;
  startDate: string;
}

export default function PsychologicalTriggerBar() {
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
    
    // Listen for storage changes to update when goal is modified
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'goalConfig') {
        calculateDays();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-window updates
    const handleGoalUpdate = () => {
      calculateDays();
    };
    
    window.addEventListener('goalUpdated', handleGoalUpdate);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('goalUpdated', handleGoalUpdate);
    };
  }, []);

  return (
    <div className="w-full bg-destructive/10 border-b border-destructive/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <p className="text-center text-xs font-medium text-destructive tracking-wide uppercase">
          TODAY IS NON-REFUNDABLE. YOU HAVE {daysRemaining} DAYS LEFT.
        </p>
      </div>
    </div>
  );
}
