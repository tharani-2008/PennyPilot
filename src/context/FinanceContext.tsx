import { createContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { FinanceState, Transaction, SavingsGoal, Subscription, Budget, Commitment } from '@/types';
import { loadState, saveState, createDefaultState, generateId, getDayNumber } from '@/lib/storage';
import { calculateMetrics } from '@/lib/finance';
import type { FinanceContextValue } from '@/context/types';

export const FinanceContext = createContext<FinanceContextValue | null>(null);

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

  const metrics = useMemo(() => calculateMetrics(state, currentDay), [state, currentDay]);

  const resetData = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    setCurrentDay(getDayNumber(fresh.startDate));
  }, []);

  const addTransaction = useCallback((txn: Omit<Transaction, 'id'>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      transactions: [...prev.transactions, { ...txn, id: generateId() }],
    }));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      savingsGoals: [...prev.savingsGoals, { ...goal, id: generateId() }],
    }));
  }, []);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
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
        isDemoData: false,
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
      isDemoData: false,
      subscriptions: [...prev.subscriptions, { ...sub, id: generateId() }],
    }));
  }, []);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      subscriptions: prev.subscriptions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      budgets: [...prev.budgets, { ...budget, id: generateId() }],
    }));
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
  }, []);

  const toggleCommitmentPaid = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      commitments: prev.commitments.map((c) => (c.id === id ? { ...c, paid: !c.paid } : c)),
    }));
  }, []);

  const addCommitment = useCallback((commitment: Omit<Commitment, 'id'>) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      commitments: [...prev.commitments, { ...commitment, id: generateId() }],
    }));
  }, []);

  const deleteCommitment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      isDemoData: false,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<Pick<FinanceState, 'userName' | 'currency'>>) => {
    setState((prev) => ({ ...prev, ...updates, isDemoData: false }));
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


