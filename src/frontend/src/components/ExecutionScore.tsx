import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface ExecutionScoreProps {
  hours: number;
}

export default function ExecutionScore({ hours }: ExecutionScoreProps) {
  const currentHour = new Date().getHours();
  
  // Check if any study has been logged today
  const hasStudyActivity = hours > 0;
  
  // Check if midday has passed (12:00 PM or later)
  const isAfterMidday = currentHour >= 12;
  
  // Before any study is logged AND before midday, show awaiting message
  if (!hasStudyActivity && !isAfterMidday) {
    return (
      <Card className="p-6 bg-gradient-to-br from-chart-2/20 to-chart-3/20 backdrop-blur-sm border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-chart-2" />
          <h3 className="text-lg font-semibold text-foreground">Execution Score</h3>
        </div>
        <div className="text-base text-muted-foreground font-medium">
          Status: Awaiting today's execution.
        </div>
      </Card>
    );
  }
  
  // Calculate tier based on hours
  const getScore = () => {
    if (hours === 0) return { 
      label: 'CRITICAL', 
      color: 'bg-destructive text-destructive-foreground',
      textColor: 'text-destructive'
    };
    if (hours < 3) return { 
      label: 'BELOW STANDARD', 
      color: 'bg-orange-600 text-white',
      textColor: 'text-orange-500'
    };
    if (hours >= 3 && hours < 4) return { 
      label: 'ON TARGET', 
      color: 'bg-chart-3 text-black',
      textColor: 'text-chart-3'
    };
    if (hours >= 4 && hours < 5) return { 
      label: 'ELITE', 
      color: 'bg-chart-2 text-black',
      textColor: 'text-chart-2'
    };
    return { 
      label: 'SAVAGE', 
      color: 'bg-chart-1 text-black',
      textColor: 'text-chart-1'
    };
  };

  const score = getScore();

  return (
    <Card className="p-6 bg-gradient-to-br from-chart-2/20 to-chart-3/20 backdrop-blur-sm border-accent/20">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-6 h-6 text-chart-2" />
        <h3 className="text-lg font-semibold text-foreground">Execution Score</h3>
      </div>
      <Badge className={`text-xl px-6 py-3 font-extrabold tracking-wide ${score.color} shadow-lg`}>
        {score.label}
      </Badge>
      <p className="text-sm text-muted-foreground mt-4">
        Based on today's <span className={`font-bold ${score.textColor}`}>{hours.toFixed(1)}h</span>
      </p>
    </Card>
  );
}
