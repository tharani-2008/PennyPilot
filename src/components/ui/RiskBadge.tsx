import { RiskLevel } from '@/types';

const riskConfig: Record<RiskLevel, { color: string; bg: string; border: string; dot: string }> = {
  Low: { color: 'text-lime-400', bg: 'bg-lime-400/8', border: 'border-lime-400/20', dot: 'bg-lime-400' },
  Moderate: { color: 'text-amber-400', bg: 'bg-amber-400/8', border: 'border-amber-400/20', dot: 'bg-amber-400' },
  High: { color: 'text-orange-400', bg: 'bg-orange-400/8', border: 'border-orange-400/20', dot: 'bg-orange-400' },
  Critical: { color: 'text-red-400', bg: 'bg-red-400/8', border: 'border-red-400/20', dot: 'bg-red-400' },
};

interface RiskBadgeProps {
  level: RiskLevel;
  showDot?: boolean;
}

export function RiskBadge({ level, showDot = true }: RiskBadgeProps) {
  const config = riskConfig[level];
  return (
    <span className={`badge ${config.bg} ${config.color} ${config.border} border`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {level} Risk
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  showGlow?: boolean;
}

export function ProgressBar({ value, max, color = '#84cc16', height = 'h-2', showGlow = false }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`w-full ${height} bg-white/[0.05] rounded-full overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: showGlow ? `0 0 8px ${color}40` : undefined,
        }}
      />
    </div>
  );
}
