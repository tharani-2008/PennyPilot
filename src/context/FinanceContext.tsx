import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { FinanceState, Transaction, SavingsGoal, Subscription, Budget, Commitment } from '@/types';
import { loadState, saveState, createDefaultState, generateId, getDayNumber } from '@/lib/storage';
import { calculateMetrics, FinanceMetrics } from '@/lib/finance';

interface FinanceContextValue {
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

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinanceState>(() => {
    return loadState() || createDefaultState();
  });

  const [currentDay, setCurrentDay] = useState(() => getDayNumber(state.startDate));

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDay(getDayNumber(state.startDate));
    }, 60000);
    return () => clearInterval(interval);
  }, [state.startDate]);

  const metrics = calculateMetrics(state, currentDay);

  const resetData = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    setCurrentDay(getDayNumber(fresh.startDate));
  }, []);

  const addTransaction = useCallback((txn: Omit<Transaction, 'id'>) => {
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, { ...txn, id: generateId() }],
    }));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, { ...goal, id: generateId() }],
    }));
  }, []);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
  }, []);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setState((prev) => {
      const goal = prev.savingsGoals.find((g) => g.id === id);
      if (!goal) return prev;
      const actualAmount = Math.min(amount, goal.targetAmount - goal.currentAmount);
      if (actualAmount <= 0) return prev;
      return {
        ...prev,
        savingsGoals: prev.savingsGoals.map((g) =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + actualAmount } : g
        ),
        transactions: [
          ...prev.transactions,
          {
            id: generateId(),
            type: 'expense' as const,
            amount: actualAmount,
            category: 'Other' as const,
            description: `Savings: ${goal.name}`,
            date: new Date().toISOString().split('T')[0],
            day: getDayNumber(prev.startDate),
          },
        ],
      };
    });
  }, []);

  const addSubscription = useCallback((sub: Omit<Subscription, 'id'>) => {
    setState((prev) => ({
      ...prev,
      subscriptions: [...prev.subscriptions, { ...sub, id: generateId() }],
    }));
  }, []);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    setState((prev) => ({
      ...prev,
      budgets: [...prev.budgets, { ...budget, id: generateId() }],
    }));
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
  }, []);

  const toggleCommitmentPaid = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) => (c.id === id ? { ...c, paid: !c.paid } : c)),
    }));
  }, []);

  const addCommitment = useCallback((commitment: Omit<Commitment, 'id'>) => {
    setState((prev) => ({
      ...prev,
      commitments: [...prev.commitments, { ...commitment, id: generateId() }],
    }));
  }, []);

  const deleteCommitment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<Pick<FinanceState, 'userName' | 'currency'>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        state,
        metrics,
        currentDay,
        resetData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        contributeToGoal,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        addBudget,
        updateBudget,
        deleteBudget,
        toggleCommitmentPaid,
        addCommitment,
        deleteCommitment,
        updateSettings,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
