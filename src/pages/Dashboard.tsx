import { useFinance } from '@/context/useFinance';
import { Card, CardHeader } from '@/components/ui/Card';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ProgressBar, RiskBadge } from '@/components/ui/RiskBadge';
import { formatCurrency } from '@/lib/finance';
import { tooltipStyle, axisTickStyle, gridStroke } from '@/lib/chartTheme';
import { getIcon } from '@/lib/icons';
import { Page } from '@/App';
import { Wallet, TrendingDown, TrendingUp, CalendarClock, ChartPie as PieChartIcon, ChartLine as LineChartIcon, ArrowRight, Sparkles, Target, Zap, FlaskConical } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from 'recharts';
import { CATEGORY_META, Category } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const insightStyleMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  positive: { bg: 'bg-lime-400/[0.04]', border: 'border-lime-400/10', text: 'text-lime-400', iconBg: 'bg-lime-400/10' },
  warning: { bg: 'bg-amber-400/[0.04]', border: 'border-amber-400/10', text: 'text-amber-400', iconBg: 'bg-amber-400/10' },
  critical: { bg: 'bg-red-400/[0.04]', border: 'border-red-400/10', text: 'text-red-400', iconBg: 'bg-red-400/10' },
  info: { bg: 'bg-sky-400/[0.04]', border: 'border-sky-400/10', text: 'text-sky-400', iconBg: 'bg-sky-400/10' },
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { metrics, state, currentDay } = useFinance();
  const currency = state.currency;

  const forecastData = [
    { day: currentDay, balance: Math.round(metrics.remainingBalance), isToday: true },
    ...metrics.forecastData,
  ];

  const healthColor = metrics.healthScore >= 70 ? '#84cc16' : metrics.healthScore >= 50 ? '#fbbf24' : metrics.healthScore >= 30 ? '#fb923c' : '#ef4444';
  const healthLabel = metrics.healthScore >= 70 ? 'Healthy' : metrics.healthScore >= 50 ? 'Fair' : metrics.healthScore >= 30 ? 'At Risk' : 'Critical';

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Hero — Balance focal point */}
      <section className="animate-slide-up" aria-label="Balance overview">
        <div className="card relative overflow-hidden p-5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
          <div className="absolute -top-12 -right-6 w-48 h-48 bg-lime-400/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-white/[0.04] text-navy-300 border border-white/[0.08]">
                  <CalendarClock size={11} aria-hidden="true" /> Day {currentDay} of 30
                </span>
                <RiskBadge level={metrics.riskLevel} />
              </div>
              <p className="section-label mb-2">Available Balance</p>
              <AnimatedNumber
                value={metrics.remainingBalance}
                prefix={currency}
                className="text-3xl sm:text-4xl font-bold font-mono text-gradient-balance leading-none tracking-tight"
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <TrendingDown size={14} className="text-accent-coral" aria-hidden="true" />
                  <span className="text-xs text-navy-400">Spent {formatCurrency(metrics.totalSpending, currency)}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-lime-400" aria-hidden="true" />
                  <span className="text-xs text-navy-400">Income {formatCurrency(metrics.totalIncome, currency)}</span>
                </div>
              </div>
            </div>

            {/* 30-day progress ring */}
            <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
              <div className="text-center">
                <p className="section-label mb-1.5">Safe to Spend</p>
                <AnimatedNumber value={metrics.safeToSpend} prefix={currency} className="text-2xl font-bold font-mono text-navy-50" />
                <p className="text-[11px] text-navy-400 mt-0.5">per day · {metrics.daysRemaining}d left</p>
              </div>
              <div className="w-px h-16 bg-white/[0.08]" />
              <div className="text-center">
                <p className="section-label mb-1.5">Health Score</p>
                <div className="flex items-baseline gap-1 justify-center">
                  <AnimatedNumber value={metrics.healthScore} className="text-2xl font-bold font-mono" style={{ color: healthColor } as React.CSSProperties} />
                  <span className="text-xs text-navy-400">/100</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: healthColor }}>{healthLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spending Trend + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card delay={1} className="lg:col-span-3">
          <CardHeader
            title="Balance Forecast"
            subtitle={`Projected end: ${formatCurrency(metrics.projectedEndBalance, currency)}`}
            icon={<LineChartIcon size={16} />}
            action={
              <button onClick={() => onNavigate('simulator')} className="btn-ghost text-xs">
                Simulate <ArrowRight size={12} />
              </button>
            }
          />
          <div className="px-4 sm:px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={forecastData} margin={{ top: 18, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} strokeOpacity={0.4} />
                <XAxis dataKey="day" tick={axisTickStyle} axisLine={false} tickLine={false} tickMargin={8} />
                <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${currency}${(v / 1000).toFixed(0)}K`} tickMargin={4} />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.2} />
                <ReferenceLine x={currentDay} stroke="#84cc16" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: 'Today', fill: '#84cc16', fontSize: 9, position: 'top' }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value), currency), 'Balance']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area type="monotone" dataKey="balance" stroke="#84cc16" strokeWidth={2.5} fill="url(#balanceGradient)" dot={false} activeDot={{ r: 4, fill: '#84cc16', stroke: '#080f1c', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={2} className="lg:col-span-2">
          <CardHeader
            title="Spending by Category"
            icon={<PieChartIcon size={16} />}
            action={
              <button onClick={() => onNavigate('analytics')} className="btn-ghost text-xs">
                Details <ArrowRight size={12} />
              </button>
            }
          />
          <div className="px-4 sm:px-5 pb-5">
            {metrics.categoryBreakdown.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={metrics.categoryBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {metrics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value), currency)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full mt-2 space-y-1.5">
                  {metrics.categoryBreakdown.slice(0, 4).map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                        <span className="text-navy-300 truncate">{cat.category}</span>
                      </div>
                      <span className="font-mono text-navy-100 flex-shrink-0">{formatCurrency(cat.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-navy-400">No spending yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Savings + Simulator CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={3} className="lg:col-span-2">
          <CardHeader
            title="Savings Goals"
            subtitle={`${metrics.totalSavingsProgress.toFixed(0)}% of total target`}
            icon={<Target size={16} />}
            action={
              <button onClick={() => onNavigate('savings')} className="btn-ghost text-xs">
                Manage <ArrowRight size={12} />
              </button>
            }
          />
          <div className="px-4 sm:px-5 pb-5 space-y-3">
            {state.savingsGoals.map((goal) => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-navy-100 font-medium">{goal.name}</span>
                  <span className="text-xs font-mono text-navy-400">
                    {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                  </span>
                </div>
                <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color={goal.color} height="h-2" showGlow />
              </div>
            ))}
          </div>
        </Card>

        {/* Simulator CTA */}
        <Card delay={4} hover className="relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-lime-400/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="p-5 relative h-full flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400 mb-3">
              <FlaskConical size={20} aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-navy-50 mb-1">What-if Simulator</h3>
            <p className="text-xs text-navy-400 leading-relaxed mb-4 flex-1">
              See how cutting spending, earning more, or saving extra changes your month-end outlook.
            </p>
            <button onClick={() => onNavigate('simulator')} className="btn-primary w-full text-sm">
              <Zap size={15} aria-hidden="true" /> Try Simulator
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions + Smart Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card delay={5}>
          <CardHeader
            title="Recent Transactions"
            subtitle={`${state.transactions.length} total`}
            icon={<Wallet size={16} />}
            action={
              <button onClick={() => onNavigate('transactions')} className="btn-ghost text-xs">
                View all <ArrowRight size={12} />
              </button>
            }
          />
          <div className="px-3 pb-3 space-y-0.5 max-h-[300px] overflow-y-auto scrollbar-thin" role="list" aria-label="Recent transactions">
            {metrics.recentTransactions.length > 0 ? (
              metrics.recentTransactions.map((txn) => {
                const catMeta = CATEGORY_META[txn.category as Category] || CATEGORY_META.Other;
                const Icon = getIcon(catMeta.icon) as LucideIcon;
                return (
                  <div key={txn.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-all" role="listitem">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${catMeta.color}12`, color: catMeta.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-navy-100 font-medium truncate">{txn.description}</p>
                        <p className="text-[11px] text-navy-400">{txn.category} · Day {txn.day}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-semibold flex-shrink-0 ${txn.type === 'income' ? 'text-lime-400' : 'text-navy-100'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-navy-400">No transactions yet</div>
            )}
          </div>
        </Card>

        <Card delay={6}>
          <CardHeader title="Smart Money Coach" subtitle="Personalized insights" icon={<Sparkles size={16} />} />
          <div className="px-5 pb-5 space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin" role="list" aria-label="Financial insights">
            {metrics.insights.length > 0 ? (
              metrics.insights.map((insight) => {
                const style = insightStyleMap[insight.type];
                const Icon = getIcon(insight.icon);
                return (
                  <div key={insight.id} className={`p-3 rounded-xl ${style.bg} ${style.border} border`} role="listitem">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg} ${style.text}`}>
                        <Icon size={13} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy-50">{insight.title}</p>
                        <p className="text-xs text-navy-300 mt-0.5 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles size={22} className="text-lime-400 mb-2" aria-hidden="true" />
                <p className="text-sm text-navy-300">Your finances look healthy!</p>
                <p className="text-xs text-navy-400 mt-1">No warnings at this time.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
