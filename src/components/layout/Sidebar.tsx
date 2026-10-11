import { Wallet, LayoutDashboard, ArrowLeftRight, PiggyBank, Target, Repeat, FlaskConical, BarChart3, Settings as SettingsIcon, X } from 'lucide-react';
import { Page } from '@/App';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/finance';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { id: 'simulator', label: 'What-if Simulator', icon: FlaskConical },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ currentPage, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const { state, currentDay, metrics } = useFinance();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-navy-975/70 backdrop-blur-sm lg:hidden animate-fade-in" onClick={onMobileClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass-strong border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-lime flex items-center justify-center shadow-lg shadow-lime-400/15">
                <Wallet className="text-navy-950" size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-navy-50 tracking-tight leading-none font-display">PennyPilot</h1>
              <p className="text-[9px] text-lime-400/70 font-medium uppercase tracking-[0.14em] mt-1">Money Coach</p>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:bg-white/[0.05]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Challenge Progress */}
        <div className="px-3.5 pb-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-3.5 pt-3 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-navy-300 uppercase tracking-wider">30-Day Challenge</span>
                <span className="text-xs font-mono text-lime-400 font-bold">{currentDay}/30</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-lime rounded-full transition-all duration-700"
                  style={{ width: `${(currentDay / 30) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-navy-400">{formatCurrency(state.startingBudget, state.currency)} budget</span>
                <span className={`text-[10px] font-medium ${metrics.riskLevel === 'Low' ? 'text-lime-400' : metrics.riskLevel === 'Moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                  {metrics.riskLevel} risk
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 group relative ${
                  isActive
                    ? 'bg-lime-400/8 text-lime-400'
                    : 'text-navy-300 hover:text-navy-50 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-lime-400" />}
                <Icon
                  size={17}
                  className={`transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3.5 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-300 to-lime-600 flex items-center justify-center text-navy-950 font-bold text-xs">
              {state.userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-navy-50 truncate">{state.userName}</p>
              <p className="text-[11px] text-navy-400">Day {currentDay} of 30</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
