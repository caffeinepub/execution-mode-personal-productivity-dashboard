import { Card } from '@/components/ui/card';
import { useStudyData } from '../hooks/useQueries';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { STUDY_COLORS, getActivityLevel } from '../lib/studyActivityColors';

interface HeatmapDay {
  date: string;
  hours: number;
}

export default function StudyHeatmap() {
  const { getHeatmapData } = useStudyData();
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>(getHeatmapData());

  // Subscribe to study session updates
  useEffect(() => {
    const handleUpdate = () => {
      setHeatmapData(getHeatmapData());
    };

    window.addEventListener('studySessionUpdated', handleUpdate);
    return () => window.removeEventListener('studySessionUpdated', handleUpdate);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20 shadow-lg">
      <div className="mb-3">
        <p className="text-xs text-muted-foreground/70 tracking-wide font-light italic">
          Consistency compounds.
        </p>
      </div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">Activity Heatmap</h3>
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1.5">
              {week.map((day, dayIndex) => {
                const level = getActivityLevel(day.hours);
                return (
                  <Tooltip key={`${weekIndex}-${dayIndex}`}>
                    <TooltipTrigger asChild>
                      <button
                        className="w-3 h-3 rounded-sm border relative focus:outline-none focus:ring-1 focus:ring-accent transition-transform hover:scale-110"
                        style={{
                          backgroundColor: 'oklch(var(--heatmap-base))',
                          borderColor: 'oklch(var(--heatmap-border))',
                        }}
                        aria-label={`${formatDate(day.date)}: ${day.hours.toFixed(1)} hours studied`}
                      >
                        {level === 'moderate' && (
                          <div 
                            className="absolute inset-[2px] rounded-[1px]" 
                            style={{ backgroundColor: STUDY_COLORS.moderate }}
                          />
                        )}
                        {level === 'high' && (
                          <div 
                            className="absolute inset-[2px] rounded-[1px]" 
                            style={{ backgroundColor: STUDY_COLORS.high }}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-popover/95 backdrop-blur-sm border-accent/30 px-2 py-1"
                    >
                      <p className="text-xs font-normal">
                        {formatDate(day.date)} — {day.hours.toFixed(1)} hours studied
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1.5 items-center">
          <div 
            className="w-3 h-3 rounded-sm border" 
            style={{
              backgroundColor: 'oklch(var(--heatmap-base))',
              borderColor: 'oklch(var(--heatmap-border))',
            }}
          />
          <div 
            className="w-3 h-3 rounded-sm border relative"
            style={{
              backgroundColor: 'oklch(var(--heatmap-base))',
              borderColor: 'oklch(var(--heatmap-border))',
            }}
          >
            <div 
              className="absolute inset-[2px] rounded-[1px]" 
              style={{ backgroundColor: STUDY_COLORS.moderate }}
            />
          </div>
          <div 
            className="w-3 h-3 rounded-sm border relative"
            style={{
              backgroundColor: 'oklch(var(--heatmap-base))',
              borderColor: 'oklch(var(--heatmap-border))',
            }}
          >
            <div 
              className="absolute inset-[2px] rounded-[1px]" 
              style={{ backgroundColor: STUDY_COLORS.high }}
            />
          </div>
        </div>
        <span>More</span>
      </div>
    </Card>
  );
}
