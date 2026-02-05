import { Card } from '@/components/ui/card';
import { useStudyData } from '../hooks/useQueries';
import { useEffect, useState } from 'react';
import { STUDY_COLORS, getActivityColor } from '../lib/studyActivityColors';

interface DailyData {
  date: string;
  hours: number;
  label: string;
}

export default function StudyProgressBarChart() {
  const { getDailyProgressData } = useStudyData();
  const [chartData, setChartData] = useState<DailyData[]>(getDailyProgressData());

  // Subscribe to study session updates
  useEffect(() => {
    const handleUpdate = () => {
      setChartData(getDailyProgressData());
    };

    window.addEventListener('studySessionUpdated', handleUpdate);
    return () => window.removeEventListener('studySessionUpdated', handleUpdate);
  }, []);

  const maxHours = Math.max(...chartData.map(d => d.hours), 8);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Study Progress</h3>
      <div className="relative h-48 flex items-end gap-1 overflow-x-auto pb-8">
        {chartData.map((day, index) => {
          const heightPercent = (day.hours / maxHours) * 100;
          const barColor = getActivityColor(day.hours);
          
          return (
            <div key={index} className="flex-1 min-w-[8px] flex flex-col items-center group">
              <div className="relative w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: barColor,
                    minHeight: day.hours > 0 ? '2px' : '0',
                  }}
                  title={`${day.label}: ${day.hours.toFixed(1)} hours`}
                />
              </div>
              {index % 7 === 0 && (
                <div className="absolute bottom-0 text-[9px] text-muted-foreground/60 mt-1 whitespace-nowrap">
                  {day.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground/60 mt-2 border-t border-border/30 pt-2">
        <span>Last 30 days</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: STUDY_COLORS.moderate }} 
            />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-sm" 
              style={{ backgroundColor: STUDY_COLORS.high }} 
            />
            <span>High</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
