import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Sunrise } from 'lucide-react';

interface TimeBasedMessageProps {
  currentTime: Date;
}

export default function TimeBasedMessage({ currentTime }: TimeBasedMessageProps) {
  const hour = currentTime.getHours();

  if (hour < 12) {
    return (
      <Badge variant="outline" className="px-4 py-2 text-sm border-chart-3/50 bg-chart-3/10">
        <Sunrise className="w-4 h-4 mr-2" />
        Win the morning. Win the day.
      </Badge>
    );
  }

  if (hour >= 23) {
    return (
      <Badge variant="outline" className="px-4 py-2 text-sm border-chart-4/50 bg-chart-4/10">
        <Moon className="w-4 h-4 mr-2" />
        Day closing. Evaluate your execution.
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="px-4 py-2 text-sm border-accent/50 bg-accent/10">
      <Sun className="w-4 h-4 mr-2" />
      Execute relentlessly.
    </Badge>
  );
}
