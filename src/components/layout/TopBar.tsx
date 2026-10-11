import { useState, useEffect, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { formatCurrency } from '@/lib/finance';

interface TopBarProps {
  onMobileMenuClick: () => void;
}

export function TopBar({ onMobileMenuClick }: TopBarProps) {
  const { metrics, state, currentDay } = useFinance();
  const daysLeft = 30 - currentDay;
  const warningCount = metrics.insights.filter((i) => i.type === 'critical' || i.type === 'warning').length;
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [notifOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuClick}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-navy-300 hover:bg-white/[0.05] transition-all"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:block">
              <p className="text-[11px] text-navy-400 font-medium">Welcome back,</p>
              <p className="text-sm font-semibold text-navy-50 leading-tight">{state.userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-navy-400">Balance</span>
              <span className="text-sm font-mono font-semibold text-navy-50">{formatCurrency(metrics.remainingBalance, state.currency)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-navy-400">Days left</span>
              <span className="text-sm font-mono font-semibold text-lime-400">{daysLeft}</span>
            </div>
            <RiskBadge level={metrics.riskLevel} />
            <button
              ref={bellRef}
              onClick={() => setNotifOpen((v) => !v)}
              className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                notifOpen ? 'bg-lime-400/10 text-lime-400' : 'text-navy-300 hover:bg-white/[0.05]'
              }`}
              aria-label="Toggle notifications"
            >
              <Bell size={17} />
              {warningCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-1 rounded-full bg-coral text-navy-950 text-[8px] font-bold flex items-center justify-center">
                  {warningCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} insights={metrics.insights} />
    </>
  );
}
