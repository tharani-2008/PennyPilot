import { useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { Insight } from '@/lib/finance';
import { getIcon } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  insights: Insight[];
}

const typeConfig: Record<Insight['type'], { color: string; bg: string; border: string; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-400/[0.04]', border: 'border-red-400/15', label: 'Critical' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-400/[0.04]', border: 'border-amber-400/15', label: 'Warning' },
  info: { color: 'text-sky-400', bg: 'bg-sky-400/[0.04]', border: 'border-sky-400/15', label: 'Info' },
  positive: { color: 'text-lime-400', bg: 'bg-lime-400/[0.04]', border: 'border-lime-400/15', label: 'Good News' },
};

export function NotificationPanel({ open, onClose, insights }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const criticalCount = insights.filter((i) => i.type === 'critical').length;
  const warningCount = insights.filter((i) => i.type === 'warning').length;
  const positiveCount = insights.filter((i) => i.type === 'positive').length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed top-16 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md glass-strong rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 animate-slide-up overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-lime-400" />
            <h3 className="text-sm font-semibold text-navy-50">Notifications</h3>
            {insights.length > 0 && (
              <span className="text-[10px] font-mono text-navy-400 bg-white/[0.05] px-1.5 py-0.5 rounded-md">{insights.length}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-100 hover:bg-white/[0.05] transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {insights.length > 0 && (criticalCount > 0 || warningCount > 0 || positiveCount > 0) && (
          <div className="flex gap-2 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
            {criticalCount > 0 && (
              <span className="text-[10px] font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/15">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/15">
                {warningCount} warning{warningCount > 1 ? 's' : ''}
              </span>
            )}
            {positiveCount > 0 && (
              <span className="text-[10px] font-medium text-lime-400 bg-lime-400/10 px-2 py-1 rounded-lg border border-lime-400/15">
                {positiveCount} positive
              </span>
            )}
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {insights.length > 0 ? (
            <div className="p-3 space-y-2">
              {insights.map((insight) => {
                const cfg = typeConfig[insight.type];
                const Icon = getIcon(insight.icon) as LucideIcon;
                return (
                  <div key={insight.id} className={`p-3 rounded-xl ${cfg.bg} ${cfg.border} border`}>
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-navy-50 truncate">{insight.title}</p>
                          <span className={`text-[9px] font-medium uppercase tracking-wider ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-navy-300 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/10 flex items-center justify-center mb-3">
                <Bell size={24} className="text-lime-400" />
              </div>
              <p className="text-sm font-semibold text-navy-100 mb-1">All caught up!</p>
              <p className="text-xs text-navy-400 max-w-[240px]">No alerts right now. Your finances are looking healthy.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
