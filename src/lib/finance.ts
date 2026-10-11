import {
  Transaction,
  SavingsGoal,
  Subscription,
  Budget,
  Commitment,
  FinanceState,
  RiskLevel,
  Category,
} from '@/types';

export interface FinanceMetrics {
  startingBudget: number;
  totalIncome: number;
  totalSpending: number;
  remainingBalance: number;
  currentDay: number;
  daysRemaining: number;
  safeToSpend: number;
  projectedEndBalance: number;
  totalSavingsTarget: number;
  totalSavingsCurrent: number;
  totalSavingsProgress: number;
  totalCommitments: number;
  unpaidCommitments: number;
  totalSubscriptions: number;
  monthlySubscriptionsCost: number;
  healthScore: number;
  riskLevel: RiskLevel;
  spendRate: number;
  burnRate: number;
  forecastData: ForecastPoint[];
  categoryBreakdown: CategoryBreakdown[];
  budgetStatus: BudgetStatus[];
  recentTransactions: Transaction[];
  insights: Insight[];
}

export interface ForecastPoint {
  day: number;
  balance: number;
  isToday: boolean;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

export interface BudgetStatus {
  category: Category;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'over';
}

export interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  icon: string;
}

function formatInsightCurrency(amount: number, currency: string): string {
  return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function calculateMetrics(state: FinanceState, currentDay: number): FinanceMetrics {
  const { startingBudget, transactions, savingsGoals, subscriptions, budgets, commitments } = state;

  const incomeTxns = transactions.filter((t) => t.type === 'income');
  const expenseTxns = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalSpending = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
  const remainingBalance = startingBudget + totalIncome - totalSpending;

  const daysRemaining = 30 - currentDay;
  const daysRemainingSafe = Math.max(1, daysRemaining);

  const totalCommitments = commitments.reduce((sum, c) => sum + c.amount, 0);
  const unpaidCommitments = commitments.filter((c) => !c.paid).reduce((sum, c) => sum + c.amount, 0);
  const totalSubscriptions = subscriptions.filter((s) => s.active).length;
  const monthlySubscriptionsCost = subscriptions.filter((s) => s.active).reduce((sum, s) => sum + s.amount, 0);

  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalSavingsProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

  const forecastData = generateForecast(state, currentDay, remainingBalance);
  const projectedEndBalance = forecastData.length > 0
    ? forecastData[forecastData.length - 1].balance
    : Math.round(remainingBalance);

  const safeToSpend = Math.max(0, projectedEndBalance / daysRemainingSafe);

  const spendRate = currentDay > 0 ? totalSpending / currentDay : 0;

  const burnRate = (totalSpending / (startingBudget + totalIncome)) * 100;

  const healthScore = calculateHealthScore({
    remainingBalance,
    startingBudget,
    totalSpending,
    totalIncome,
    currentDay,
    savingsProgress: totalSavingsProgress,
    unpaidCommitments,
    projectedEndBalance,
  });

  const riskLevel = getRiskLevel(healthScore, projectedEndBalance);

  const categoryBreakdown = generateCategoryBreakdown(expenseTxns);

  const budgetStatus = generateBudgetStatus(budgets, expenseTxns);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.day - a.day)
    .slice(0, 8);

  const insights = generateInsights({
    remainingBalance,
    projectedEndBalance,
    safeToSpend,
    spendRate,
    currentDay,
    totalSpending,
    totalIncome,
    savingsProgress: totalSavingsProgress,
    unpaidCommitments,
    monthlySubscriptionsCost,
    categoryBreakdown,
    budgetStatus,
    currency: state.currency,
  });

  return {
    startingBudget,
    totalIncome,
    totalSpending,
    remainingBalance,
    currentDay,
    daysRemaining,
    safeToSpend,
    projectedEndBalance,
    totalSavingsTarget,
    totalSavingsCurrent,
    totalSavingsProgress,
    totalCommitments,
    unpaidCommitments,
    totalSubscriptions,
    monthlySubscriptionsCost,
    healthScore,
    riskLevel,
    spendRate,
    burnRate,
    forecastData,
    categoryBreakdown,
    budgetStatus,
    recentTransactions,
    insights,
  };
}

function calculateHealthScore(params: {
  remainingBalance: number;
  startingBudget: number;
  totalSpending: number;
  totalIncome: number;
  currentDay: number;
  savingsProgress: number;
  unpaidCommitments: number;
  projectedEndBalance: number;
}): number {
  let score = 100;
  const { remainingBalance, startingBudget, totalSpending, totalIncome, currentDay, savingsProgress, unpaidCommitments, projectedEndBalance } = params;

  const totalAvailable = startingBudget + totalIncome;
  const spentPercentage = (totalSpending / totalAvailable) * 100;
  const expectedSpendByNow = (currentDay / 30) * 100;

  if (spentPercentage > expectedSpendByNow) {
    const overshoot = spentPercentage - expectedSpendByNow;
    score -= Math.min(30, overshoot * 0.8);
  }

  if (projectedEndBalance < 0) {
    score -= 35;
  } else if (projectedEndBalance < startingBudget * 0.1) {
    score -= 20;
  } else if (projectedEndBalance < startingBudget * 0.2) {
    score -= 10;
  }

  if (savingsProgress < 10) {
    score -= 10;
  } else if (savingsProgress < 25) {
    score -= 5;
  } else if (savingsProgress >= 50) {
    score += 5;
  }

  if (unpaidCommitments > remainingBalance * 0.5) {
    score -= 10;
  }

  if (totalIncome > totalSpending) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getRiskLevel(healthScore: number, projectedEndBalance: number): RiskLevel {
  if (projectedEndBalance < 0 || healthScore < 30) return 'Critical';
  if (healthScore < 50) return 'High';
  if (healthScore < 70) return 'Moderate';
  return 'Low';
}

function generateForecast(state: FinanceState, currentDay: number, currentBalance: number): ForecastPoint[] {
  const { subscriptions, commitments } = state;
  const points: ForecastPoint[] = [];
  const futureObligationsByDay: Record<number, number> = {};

  subscriptions.filter((s) => s.active).forEach((s) => {
    if (s.billingDay > currentDay) {
      futureObligationsByDay[s.billingDay] = (futureObligationsByDay[s.billingDay] || 0) - s.amount;
    }
  });

  commitments.filter((c) => !c.paid).forEach((c) => {
    if (c.dueDay > currentDay) {
      futureObligationsByDay[c.dueDay] = (futureObligationsByDay[c.dueDay] || 0) - c.amount;
    }
  });

  let runningBalance = currentBalance;

  for (let day = currentDay + 1; day <= 30; day++) {
    const delta = futureObligationsByDay[day] || 0;
    runningBalance += delta;
    points.push({ day, balance: Math.round(runningBalance), isToday: false });
  }

  return points;
}

function generateCategoryBreakdown(expenseTxns: Transaction[]): CategoryBreakdown[] {
  const total = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
  const byCategory: Record<string, { amount: number; count: number }> = {};

  expenseTxns.forEach((t) => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = { amount: 0, count: 0 };
    }
    byCategory[t.category].amount += t.amount;
    byCategory[t.category].count += 1;
  });

  const categoryColors: Record<string, string> = {
    'Food & Dining': '#fb7185',
    Groceries: '#84cc16',
    Transport: '#38bdf8',
    Shopping: '#a78bfa',
    Entertainment: '#fbbf24',
    Health: '#2dd4bf',
    'Bills & Utilities': '#f87171',
    Education: '#60a5fa',
    Subscriptions: '#c084fc',
    Unexpected: '#ef4444',
    Other: '#94a3b8',
  };

  return Object.entries(byCategory)
    .map(([category, data]) => ({
      category: category as Category,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      color: categoryColors[category] || '#94a3b8',
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function generateBudgetStatus(budgets: Budget[], expenseTxns: Transaction[]): BudgetStatus[] {
  return budgets.map((budget) => {
    const spent = expenseTxns
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.limit - spent;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const status: BudgetStatus['status'] = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'safe';
    return { category: budget.category, limit: budget.limit, spent, remaining, percentage, status };
  });
}

function generateInsights(params: {
  remainingBalance: number;
  projectedEndBalance: number;
  safeToSpend: number;
  spendRate: number;
  currentDay: number;
  totalSpending: number;
  totalIncome: number;
  savingsProgress: number;
  unpaidCommitments: number;
  monthlySubscriptionsCost: number;
  categoryBreakdown: CategoryBreakdown[];
  budgetStatus: BudgetStatus[];
  currency: string;
}): Insight[] {
  const insights: Insight[] = [];
  const {
    remainingBalance,
    projectedEndBalance,
    safeToSpend,
    spendRate,
    currentDay,
    totalSpending,
    totalIncome,
    savingsProgress,
    unpaidCommitments,
    monthlySubscriptionsCost,
    categoryBreakdown,
    budgetStatus,
    currency,
  } = params;

  if (projectedEndBalance < 0) {
    insights.push({
      id: 'critical-balance',
      type: 'critical',
      title: 'Projected overdraft risk',
      message: `You're projected to end the month ${formatInsightCurrency(Math.abs(projectedEndBalance), currency)} in the red. Cut discretionary spending now.`,
      icon: 'AlertTriangle',
    });
  } else if (projectedEndBalance < remainingBalance * 0.15) {
    insights.push({
      id: 'warning-balance',
      type: 'warning',
      title: 'Tight runway ahead',
      message: `Your projected end-of-month balance is only ${formatInsightCurrency(projectedEndBalance, currency)}. Consider pausing non-essential purchases.`,
      icon: 'TrendingDown',
    });
  }

  if (categoryBreakdown.length > 0 && categoryBreakdown[0].percentage > 35) {
    insights.push({
      id: 'top-category',
      type: 'info',
      title: `${categoryBreakdown[0].category} dominates your spending`,
      message: `${categoryBreakdown[0].percentage.toFixed(0)}% of your expenses go to ${categoryBreakdown[0].category}. That's ${formatInsightCurrency(categoryBreakdown[0].amount, currency)} so far.`,
      icon: 'PieChart',
    });
  }

  const overBudget = budgetStatus.filter((b) => b.status === 'over');
  if (overBudget.length > 0) {
    insights.push({
      id: 'over-budget',
      type: 'warning',
      title: `${overBudget.length} budget${overBudget.length > 1 ? 's' : ''} exceeded`,
      message: `You've gone over your ${overBudget[0].category} budget by ${formatInsightCurrency(Math.abs(overBudget[0].remaining), currency)}.`,
      icon: 'AlertCircle',
    });
  }

  if (spendRate > safeToSpend * 1.2 && safeToSpend > 0) {
    insights.push({
      id: 'spend-rate',
      type: 'warning',
      title: "You're spending faster than your safe rate",
      message: `Your daily spend is ${formatInsightCurrency(spendRate, currency)} but your safe-to-spend is only ${formatInsightCurrency(safeToSpend, currency)}.`,
      icon: 'Gauge',
    });
  }

  if (totalIncome > totalSpending && projectedEndBalance > 0) {
    insights.push({
      id: 'positive-income',
      type: 'positive',
      title: "You're living within your means",
      message: `Your income exceeds spending by ${formatInsightCurrency(totalIncome - totalSpending, currency)}. Keep it up!`,
      icon: 'TrendingUp',
    });
  }

  if (savingsProgress >= 50) {
    insights.push({
      id: 'savings-good',
      type: 'positive',
      title: 'Great savings progress',
      message: `You've saved ${savingsProgress.toFixed(0)}% of your total goal. You're on track!`,
      icon: 'PiggyBank',
    });
  } else if (savingsProgress < 25) {
    insights.push({
      id: 'savings-low',
      type: 'info',
      title: 'Boost your savings',
      message: `You're at ${savingsProgress.toFixed(0)}% of your savings target. Even ${currency}200/day gets you much closer.`,
      icon: 'Target',
    });
  }

  if (monthlySubscriptionsCost > 500) {
    insights.push({
      id: 'subs-cost',
      type: 'info',
      title: 'Subscription audit suggested',
      message: `You spend ${formatInsightCurrency(monthlySubscriptionsCost, currency)}/month on subscriptions. Review if you use all of them.`,
      icon: 'Repeat',
    });
  }

  if (unpaidCommitments > remainingBalance * 0.4 && unpaidCommitments > 0) {
    insights.push({
      id: 'commitments-risk',
      type: 'warning',
      title: 'Upcoming commitments could strain your balance',
      message: `${formatInsightCurrency(unpaidCommitments, currency)} in unpaid commitments is ${((unpaidCommitments / remainingBalance) * 100).toFixed(0)}% of your remaining balance.`,
      icon: 'CalendarClock',
    });
  }

  return insights;
}

export function simulateScenario(
  state: FinanceState,
  currentDay: number,
  params: { spendReduction: number; additionalIncome: number; extraSavings: number }
): {
  projectedEndBalance: number;
  projectedSavings: number;
  safeToSpend: number;
  newHealthScore: number;
} {
  const metrics = calculateMetrics(state, currentDay);
  const spendSavings = metrics.totalSpending * (params.spendReduction / 100);
  const adjustedBalance = metrics.remainingBalance + spendSavings + params.additionalIncome - params.extraSavings;
  const futureDelta = metrics.projectedEndBalance - metrics.remainingBalance;
  const projectedEndBalance = adjustedBalance + futureDelta;
  const daysRemaining = Math.max(1, metrics.daysRemaining);
  const safeToSpend = Math.max(0, projectedEndBalance / daysRemaining);
  const projectedSavings = metrics.totalSavingsCurrent + params.extraSavings;
  const reducedSpend = metrics.totalSpending - spendSavings;

  const newHealthScore = calculateHealthScore({
    remainingBalance: adjustedBalance,
    startingBudget: metrics.startingBudget,
    totalSpending: reducedSpend,
    totalIncome: metrics.totalIncome + params.additionalIncome,
    currentDay: metrics.currentDay,
    savingsProgress: metrics.totalSavingsTarget > 0 ? (projectedSavings / metrics.totalSavingsTarget) * 100 : 0,
    unpaidCommitments: metrics.unpaidCommitments,
    projectedEndBalance,
  });

  return {
    projectedEndBalance: Math.round(projectedEndBalance),
    projectedSavings: Math.round(projectedSavings),
    safeToSpend: Math.round(safeToSpend),
    newHealthScore,
  };
}

export function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCompact(amount: number, currency = '₹'): string {
  if (Math.abs(amount) >= 100000) {
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  }
  return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
}
