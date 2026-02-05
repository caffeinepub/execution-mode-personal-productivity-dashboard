import { Card } from '@/components/ui/card';
import { Quote as QuoteIcon } from 'lucide-react';
import { useQuote } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyQuote() {
  const { data: quote, isLoading } = useQuote();

  if (isLoading) {
    return (
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-accent/20">
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-card/50 to-accent/10 backdrop-blur-sm border-accent/20 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <img 
            src="/assets/generated/quote-icon-transparent.dim_48x48.png" 
            alt="Quote" 
            className="w-12 h-12 opacity-70"
          />
        </div>
        <div className="flex-1">
          <blockquote className="text-2xl font-medium text-foreground leading-relaxed mb-4">
            "{quote?.text}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <cite className="text-lg text-muted-foreground not-italic">
              — {quote?.author}
            </cite>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </Card>
  );
}
