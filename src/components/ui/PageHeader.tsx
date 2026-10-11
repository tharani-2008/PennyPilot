import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-navy-50 tracking-tight font-display">{title}</h2>
        <p className="text-sm text-navy-400 mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
