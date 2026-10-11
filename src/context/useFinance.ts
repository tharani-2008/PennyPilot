import { useContext } from 'react';
import { FinanceContext } from '@/context/FinanceContext';
import type { FinanceContextValue } from '@/context/types';

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
