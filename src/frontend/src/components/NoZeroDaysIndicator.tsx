interface NoZeroDaysIndicatorProps {
  hours: number;
}

export default function NoZeroDaysIndicator({ hours }: NoZeroDaysIndicatorProps) {
  const isZeroDay = hours === 0;

  return (
    <div className="flex items-center gap-2 ml-4">
      <div 
        className={`w-3 h-3 rounded-full ${isZeroDay ? 'bg-destructive' : 'bg-green-500'} shadow-lg`}
        style={{
          boxShadow: isZeroDay 
            ? '0 0 8px oklch(var(--destructive) / 0.6)' 
            : '0 0 8px rgb(34 197 94 / 0.6)',
        }}
      />
      <span className="text-xs text-muted-foreground font-medium">
        {isZeroDay ? 'Zero Day' : 'Active'}
      </span>
    </div>
  );
}
