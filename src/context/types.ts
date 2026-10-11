import type { FinanceState, Transaction, SavingsGoal, Subscription, Budget, Commitment } from '@/types';
import type { FinanceMetrics } from '@/lib/finance';

export interface FinanceContextValue {
  state: FinanceState;
  metrics: FinanceMetrics;
  currentDay: number;
  resetData: () => void;
  addTransaction: (txn: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  toggleCommitmentPaid: (id: string) => void;
  addCommitment: (commitment: Omit<Commitment, 'id'>) => void;
  deleteCommitment: (id: string) => void;
  updateSettings: (updates: Partial<Pick<FinanceState, 'userName' | 'currency'>>) => void;
}
