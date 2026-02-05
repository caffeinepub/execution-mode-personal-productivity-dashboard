import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStudyData } from '../hooks/useQueries';
import StudyHeatmap from './StudyHeatmap';
import StudyProgressBarChart from './StudyProgressBarChart';
import StreakDisplay from './StreakDisplay';
import FailureAlert from './FailureAlert';
import NoZeroDaysIndicator from './NoZeroDaysIndicator';

export default function ChronographTimer() {
  const { 
    getTodayHours, 
    addStudyTime, 
    getTimerState, 
    saveTimerState,
  } = useStudyData();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [showMilliseconds, setShowMilliseconds] = useState(false);
  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    const state = getTimerState();
    if (state.isRunning && state.startTime) {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      setSeconds(elapsed);
      setIsRunning(true);
      setSessionStart(state.startTime);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (showMilliseconds) {
          setMilliseconds((Date.now() % 1000));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, showMilliseconds]);

  useEffect(() => {
    let msInterval: NodeJS.Timeout | null = null;
    
    if (isRunning && showMilliseconds) {
      msInterval = setInterval(() => {
        setMilliseconds((Date.now() % 1000));
      }, 10);
    }

    return () => {
      if (msInterval) clearInterval(msInterval);
    };
  }, [isRunning, showMilliseconds]);

  const handleStart = () => {
    const now = Date.now();
    setIsRunning(true);
    setSessionStart(now);
    saveTimerState({ isRunning: true, startTime: now });
  };

  const handlePause = () => {
    if (sessionStart) {
      const duration = Math.floor((Date.now() - sessionStart) / 1000);
      addStudyTime(duration);
    }
    setIsRunning(false);
    saveTimerState({ isRunning: false, startTime: null });
  };

  const handleReset = () => {
    if (isRunning && sessionStart) {
      const duration = Math.floor((Date.now() - sessionStart) / 1000);
      addStudyTime(duration);
    }
    setIsRunning(false);
    setSeconds(0);
    setMilliseconds(0);
    setSessionStart(null);
    saveTimerState({ isRunning: false, startTime: null });
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor(milliseconds / 10);
    
    if (showMilliseconds) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const todayHours = getTodayHours();
  const progressPercentage = Math.min((seconds / (8 * 3600)) * 100, 100);

  return (
    <div className="space-y-6">
      <FailureAlert />
      
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-accent/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/timer-icon-transparent.dim_64x64.png" 
                alt="Timer" 
                className="w-10 h-10"
              />
              <h2 className="text-2xl font-bold text-foreground">Chronograph Timer</h2>
              <NoZeroDaysIndicator hours={todayHours} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMilliseconds(!showMilliseconds)}
              className="text-xs"
            >
              {showMilliseconds ? 'Hide' : 'Show'} MS
            </Button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="oklch(var(--muted))"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="oklch(var(--chart-1))"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-300"
                style={{
                  filter: isRunning 
                    ? 'drop-shadow(0 0 12px oklch(var(--chart-1) / 0.8)) drop-shadow(0 0 24px oklch(var(--chart-1) / 0.4))' 
                    : 'drop-shadow(0 0 8px oklch(var(--chart-1) / 0.6))',
                }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className={`text-6xl font-bold text-chart-1 tabular-nums tracking-wider digital-font ${isRunning ? 'animate-pulse-subtle' : ''}`}
                  style={{
                    textShadow: isRunning 
                      ? '0 0 24px oklch(var(--chart-1) / 0.6), 0 0 48px oklch(var(--chart-1) / 0.4)' 
                      : '0 0 20px oklch(var(--chart-1) / 0.5), 0 0 40px oklch(var(--chart-1) / 0.3)',
                  }}
                >
                  {formatTime(seconds)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-lg text-muted-foreground">
              Today's Total: <span className="text-foreground font-semibold digital-font">{todayHours.toFixed(2)} hours</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {!isRunning ? (
              <Button 
                onClick={handleStart} 
                size="lg" 
                className="px-8 bg-chart-1 hover:bg-chart-1/80 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button 
                onClick={handlePause} 
                size="lg" 
                variant="secondary"
                className="px-8 transition-all duration-300"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button 
              onClick={handleReset} 
              size="lg" 
              variant="outline"
              className="px-8 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <StreakDisplay />
        </div>
      </Card>

      <StudyHeatmap />
      <StudyProgressBarChart />
    </div>
  );
}
