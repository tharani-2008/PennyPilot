import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className = '', hover = false, delay }: CardProps) {
  const animationClass = delay ? `animate-stagger-${delay}` : 'animate-fade-in';
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${animationClass} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-lime-400">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-navy-50 tracking-tight truncate">{title}</h3>
          {subtitle && <p className="text-xs text-navy-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
