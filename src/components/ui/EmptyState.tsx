import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-navy-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-navy-100 mb-1.5">{title}</h3>
      <p className="text-sm text-navy-400 max-w-sm leading-relaxed mb-5">{description}</p>
      {action}
    </div>
  );
}
