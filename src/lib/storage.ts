import {
  Transaction,
  SavingsGoal,
  Subscription,
  Budget,
  Commitment,
  FinanceState,
  RiskLevel,
  Category,
  CATEGORIES,
} from '@/types';

const STORAGE_KEY = 'pennypilot_state_v1';

export function loadState(): FinanceState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FinanceState;
  } catch {
    return null;
  }
}

export function saveState(state: FinanceState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silently fail
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getDayNumber(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(30, diffDays + 1));
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createInitialBudgets(): Budget[] {
  return [
    { id: generateId(), category: 'Food & Dining', limit: 1200 },
    { id: generateId(), category: 'Groceries', limit: 1500 },
    { id: generateId(), category: 'Transport', limit: 600 },
    { id: generateId(), category: 'Shopping', limit: 800 },
    { id: generateId(), category: 'Entertainment', limit: 500 },
    { id: generateId(), category: 'Health', limit: 400 },
    { id: generateId(), category: 'Bills & Utilities', limit: 1000 },
    { id: generateId(), category: 'Education', limit: 300 },
  ];
}

export function createInitialSavingsGoals(): SavingsGoal[] {
  return [
    {
      id: generateId(),
      name: 'Emergency Fund',
      targetAmount: 3000,
      currentAmount: 800,
      color: '#84cc16',
      icon: 'Shield',
    },
    {
      id: generateId(),
      name: 'Concert Tickets',
      targetAmount: 1500,
      currentAmount: 450,
      color: '#38bdf8',
      icon: 'Music',
    },
    {
      id: generateId(),
      name: 'New Headphones',
      targetAmount: 2000,
      currentAmount: 300,
      color: '#a78bfa',
      icon: 'Headphones',
    },
  ];
}

export function createInitialSubscriptions(): Subscription[] {
  return [
    { id: generateId(), name: 'Spotify Premium', amount: 119, billingDay: 5, category: 'Entertainment', active: true, icon: 'Music' },
    { id: generateId(), name: 'Netflix', amount: 199, billingDay: 12, category: 'Entertainment', active: true, icon: 'Tv' },
    { id: generateId(), name: 'Amazon Prime', amount: 149, billingDay: 18, category: 'Shopping', active: true, icon: 'ShoppingBag' },
    { id: generateId(), name: 'Gym Membership', amount: 500, billingDay: 1, category: 'Health', active: true, icon: 'Dumbbell' },
  ];
}

export function createInitialCommitments(): Commitment[] {
  return [
    { id: generateId(), name: 'Phone Bill', amount: 399, dueDay: 8, category: 'Bills & Utilities', paid: false },
    { id: generateId(), name: 'Internet Bill', amount: 699, dueDay: 15, category: 'Bills & Utilities', paid: false },
    { id: generateId(), name: 'Rent Share', amount: 2000, dueDay: 1, category: 'Bills & Utilities', paid: true },
  ];
}

export function createInitialTransactions(startingBudget: number): Transaction[] {
  const today = new Date();
  const isoDate = (d: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (30 - d));
    return date.toISOString().split('T')[0];
  };

  return [
    { id: generateId(), type: 'income', amount: 5000, category: 'Other', description: 'Monthly pocket money', date: isoDate(1), day: 1 },
    { id: generateId(), type: 'income', amount: 2000, category: 'Other', description: 'Freelance project payment', date: isoDate(10), day: 10 },
    { id: generateId(), type: 'expense', amount: 2000, category: 'Bills & Utilities', description: 'Rent share', date: isoDate(1), day: 1, isRecurring: true },
    { id: generateId(), type: 'expense', amount: 240, category: 'Food & Dining', description: 'Dinner with friends', date: isoDate(4), day: 4 },
    { id: generateId(), type: 'expense', amount: 350, category: 'Groceries', description: 'Weekly groceries', date: isoDate(5), day: 5 },
    { id: generateId(), type: 'expense', amount: 85, category: 'Transport', description: 'Metro card top-up', date: isoDate(6), day: 6 },
    { id: generateId(), type: 'expense', amount: 450, category: 'Shopping', description: 'New sneakers', date: isoDate(8), day: 8 },
    { id: generateId(), type: 'expense', amount: 180, category: 'Food & Dining', description: 'Lunch out', date: isoDate(9), day: 9 },
    { id: generateId(), type: 'expense', amount: 300, category: 'Entertainment', description: 'Movie + snacks', date: isoDate(10), day: 10 },
    { id: generateId(), type: 'expense', amount: 220, category: 'Groceries', description: 'Mid-month groceries', date: isoDate(12), day: 12 },
    { id: generateId(), type: 'expense', amount: 150, category: 'Health', description: 'Pharmacy', date: isoDate(13), day: 13 },
    { id: generateId(), type: 'expense', amount: 320, category: 'Food & Dining', description: 'Birthday dinner', date: isoDate(14), day: 14 },
  ];
}

export function createDefaultState(): FinanceState {
  const startDate = new Date().toISOString().split('T')[0];
  return {
    startDate,
    startingBudget: 10000,
    transactions: createInitialTransactions(10000),
    savingsGoals: createInitialSavingsGoals(),
    subscriptions: createInitialSubscriptions(),
    budgets: createInitialBudgets(),
    commitments: createInitialCommitments(),
    scenarios: [],
    currency: '₹',
    userName: 'Explorer',
  };
}
