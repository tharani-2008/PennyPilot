import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency, formatCompact } from '@/lib/finance';
import { tooltipStyle, axisTickStyle, legendStyle, gridStroke } from '@/lib/chartTheme';
import { CATEGORY_META, Category } from '@/types';
import { BarChart3, TrendingDown, TrendingUp, CalendarClock, PieChart as PieChartIcon, Activity } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar, Legend,
} from 'recharts';

export function Analytics() {
  const { state, metrics } = useFinance();
  const currency = state.currency;

  const dailySpending: { day: number; spending: number; income: number }[] = [];
  for (let day = 1; day <= 30; day++) {
    const dayTxns = state.transactions.filter((t) => t.day === day);
    const spending = dayTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const income = dayTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    dailySpending.push({ day, spending, income });
  }

  const incomeVsExpense = [
    { name: 'Income', amount: metrics.totalIncome, fill: '#84cc16' },
    { name: 'Expenses', amount: metrics.totalSpending, fill: '#fb7185' },
  ];

  const budgetRadial = metrics.budgetStatus.map((b) => ({
    name: b.category,
    value: Math.min(100, b.percentage),
    fill: b.status === 'over' ? '#ef4444' : b.status === 'warning' ? '#fbbf24' : '#84cc16',
  }));

  const topCategories = metrics.categoryBreakdown.slice(0, 5);
  const netFlow = metrics.totalIncome - metrics.totalSpending;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <PageHeader title="Analytics" subtitle="Deep dive into your spending patterns" />

      {/* Summary Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-label="Summary statistics">
        <SummaryStat delay={1} icon={<TrendingDown size={15} />} iconColor="text-coral" label="Daily Avg Spend" value={formatCurrency(metrics.spendRate, currency)} />
        <SummaryStat delay={2} icon={<Activity size={15} />} iconColor="text-amber-400" label="Burn Rate" value={`${metrics.burnRate.toFixed(1)}%`} />
        <SummaryStat delay={3} icon={<TrendingUp size={15} />} iconColor={netFlow >= 0 ? 'text-lime-400' : 'text-coral'} label="Net Flow" value={`${netFlow >= 0 ? '+' : ''}${formatCurrency(netFlow, currency)}`} valueColor={netFlow >= 0 ? 'text-lime-400' : 'text-coral'} />
        <SummaryStat delay={4} icon={<CalendarClock size={15} />} iconColor="text-accent-blue" label="Subscriptions" value={formatCurrency(metrics.monthlySubscriptionsCost, currency)} />
      </section>

      {/* Daily Spending Chart */}
      <Card delay={2}>
        <CardHeader title="Daily Spending & Income" subtitle="Day-by-day breakdown" icon={<BarChart3 size={16} />} />
        <div className="px-4 sm:px-5 pb-5">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailySpending} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={axisTickStyle} axisLine={false} tickLine={false} tickMargin={8} />
              <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v, currency)} tickMargin={4} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value), currency)} labelFormatter={(label) => `Day ${label}`} />
              <Bar dataKey="spending" name="Spending" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="income" name="Income" fill="#84cc16" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Pie */}
        <Card delay={3}>
          <CardHeader title="Category Distribution" subtitle="Full breakdown" icon={<PieChartIcon size={16} />} />
          <div className="px-4 sm:px-5 pb-5">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={metrics.categoryBreakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={92} innerRadius={45} paddingAngle={2} stroke="none">
                  {metrics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value), currency)} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#889fc4' }} iconType="circle" iconSize={7} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Income vs Expense */}
        <Card delay={4}>
          <CardHeader title="Income vs Expenses" subtitle="This month" icon={<Activity size={16} />} />
          <div className="px-4 sm:px-5 pb-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={incomeVsExpense} layout="vertical" margin={{ top: 8, right: 20, left: 10, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} strokeOpacity={0.4} />
                <XAxis type="number" tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v, currency)} tickMargin={4} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#889fc4', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value), currency)} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={36}>
                  {incomeVsExpense.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Budget Radial */}
      <Card delay={5}>
        <CardHeader title="Budget Utilization" subtitle="How close you are to each limit" icon={<BarChart3 size={16} />} />
        <div className="px-4 sm:px-5 pb-5">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart data={budgetRadial} innerRadius="22%" outerRadius="88%" startAngle={90} endAngle={-270}>
              <RadialBar background={{ fill: gridStroke }} dataKey="value" cornerRadius={5} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value).toFixed(0)}% used`} />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#889fc4' }} iconType="circle" iconSize={7} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Categories */}
      <Card delay={6}>
        <CardHeader title="Top Spending Categories" subtitle="Where your money goes" icon={<PieChartIcon size={16} />} />
        <div className="px-5 pb-5 space-y-3">
          {topCategories.map((cat, idx) => {
            const catMeta = CATEGORY_META[cat.category as Category] || CATEGORY_META.Other;
            return (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="text-xs font-mono text-navy-500 w-5 text-right">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-navy-100 font-medium truncate">{cat.category}</span>
                    <div className="flex items-center gap-3 text-xs flex-shrink-0">
                      <span className="text-navy-400 hidden sm:inline">{cat.count} txns</span>
                      <span className="font-mono font-semibold text-navy-50">{formatCurrency(cat.amount, currency)}</span>
                      <span className="font-mono text-navy-400 w-10 text-right">{cat.percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.percentage}%`, background: catMeta.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function SummaryStat({ delay, icon, iconColor, label, value, valueColor = 'text-navy-50' }: {
  delay: number; icon: React.ReactNode; iconColor: string; label: string; value: string; valueColor?: string;
}) {
  return (
    <Card delay={delay} className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={iconColor}>{icon}</span>
        <span className="section-label">{label}</span>
      </div>
      <p className={`text-lg sm:text-xl font-bold font-mono ${valueColor}`}>{value}</p>
    </Card>
  );
}
