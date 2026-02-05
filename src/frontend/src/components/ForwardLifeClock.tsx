import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';

interface TimeUnit {
  value: number;
  prevValue: number;
}

export default function ForwardLifeClock() {
  const [timeData, setTimeData] = useState({
    dayOfYear: { value: 0, prevValue: 0 },
    currentDate: '',
    hours: { value: 0, prevValue: 0 },
    minutes: { value: 0, prevValue: 0 },
    seconds: { value: 0, prevValue: 0 },
    percentComplete: { value: 0, prevValue: 0 },
    totalDays: 365,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const diff = now.getTime() - startOfYear.getTime();
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
      
      const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };
      
      const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365;
      const percentComplete = Math.floor((dayOfYear / totalDays) * 100);
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      const currentDate = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      setTimeData(prev => ({
        dayOfYear: { value: dayOfYear, prevValue: prev.dayOfYear.value },
        currentDate,
        hours: { value: hours, prevValue: prev.hours.value },
        minutes: { value: minutes, prevValue: prev.minutes.value },
        seconds: { value: seconds, prevValue: prev.seconds.value },
        percentComplete: { value: percentComplete, prevValue: prev.percentComplete.value },
        totalDays,
      }));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const DigitDisplay = ({ unit }: { unit: TimeUnit }) => {
    const hasChanged = unit.value !== unit.prevValue;
    
    return (
      <div className="relative overflow-hidden">
        <div 
          className={`transition-all duration-300 ${hasChanged ? 'animate-flip-number' : ''}`}
          style={{
            textShadow: '0 0 16px oklch(var(--chart-2) / 0.4), 0 0 32px oklch(var(--chart-2) / 0.2)',
          }}
        >
          {String(unit.value).padStart(2, '0')}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-7 bg-card/40 backdrop-blur-sm border-accent/15 shadow-lg relative overflow-hidden opacity-90 scale-95">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-2/3 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-6 h-6 text-chart-2 opacity-80" />
          <h2 className="text-xl font-semibold text-foreground/90">Forward Life-Clock</h2>
        </div>
        
        <div className="text-center mb-5">
          <div className="text-4xl font-semibold text-chart-2 mb-2 tabular-nums tracking-wide digital-font opacity-90">
            <DigitDisplay unit={timeData.dayOfYear} />
          </div>
          <div className="text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">
            Day of Year ({timeData.totalDays})
          </div>
        </div>

        <div className="text-center mb-5">
          <div className="text-base text-foreground/80 font-normal">
            {timeData.currentDate}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <div className="text-3xl font-semibold text-chart-3 mb-1 tabular-nums tracking-wide digital-font opacity-90">
              <DigitDisplay unit={timeData.hours} />
            </div>
            <div className="text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-chart-4 mb-1 tabular-nums tracking-wide digital-font opacity-90">
              <DigitDisplay unit={timeData.minutes} />
            </div>
            <div className="text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-chart-5 mb-1 tabular-nums tracking-wide digital-font opacity-90">
              <DigitDisplay unit={timeData.seconds} />
            </div>
            <div className="text-xs text-muted-foreground/80 uppercase tracking-wider font-medium">Seconds</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Progress value={timeData.percentComplete.value} className="h-2" />
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, oklch(var(--chart-2) / 0.2) 0%, oklch(var(--chart-2) / 0.05) 100%)`,
                width: `${timeData.percentComplete.value}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground/80">Year Progress</span>
            <span className="font-medium text-chart-2 digital-font opacity-90">
              {timeData.percentComplete.value}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
