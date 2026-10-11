export type Category =
  | 'Food & Dining'
  | 'Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Bills & Utilities'
  | 'Education'
  | 'Subscriptions'
  | 'Unexpected'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Groceries',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills & Utilities',
  'Education',
  'Subscriptions',
  'Unexpected',
  'Other',
];

export const CATEGORY_META: Record<Category, { color: string; icon: string }> = {
  'Food & Dining': { color: '#fb7185', icon: 'UtensilsCrossed' },
  Groceries: { color: '#84cc16', icon: 'ShoppingCart' },
  Transport: { color: '#38bdf8', icon: 'Car' },
  Shopping: { color: '#a78bfa', icon: 'ShoppingBag' },
  Entertainment: { color: '#fbbf24', icon: 'Clapperboard' },
  Health: { color: '#2dd4bf', icon: 'HeartPulse' },
  'Bills & Utilities': { color: '#f87171', icon: 'Receipt' },
  Education: { color: '#60a5fa', icon: 'GraduationCap' },
  Subscriptions: { color: '#c084fc', icon: 'Repeat' },
  Unexpected: { color: '#ef4444', icon: 'AlertTriangle' },
  Other: { color: '#94a3b8', icon: 'MoreHorizontal' },
};

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date
  day: number; // 1-30
  isRecurring?: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  deadline?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay: number; // day of month 1-30
  category: string;
  active: boolean;
  icon: string;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
}

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // day 1-30
  category: Category;
  paid: boolean;
}

export interface SimScenario {
  id: string;
  name: string;
  description: string;
  spendReduction: number; // percentage
  additionalIncome: number;
  extraSavings: number;
}

export interface FinanceState {
  startDate: string;
  startingBudget: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  subscriptions: Subscription[];
  budgets: Budget[];
  commitments: Commitment[];
  scenarios: SimScenario[];
  currency: string;
  userName: string;
  isDemoData?: boolean;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
