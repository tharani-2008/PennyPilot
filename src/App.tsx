import { useState, lazy, Suspense } from 'react';
import { FinanceProvider } from '@/context/FinanceContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Dashboard } from '@/pages/Dashboard';

const Transactions = lazy(() => import('@/pages/Transactions').then(m => ({ default: m.Transactions })));
const Budgets = lazy(() => import('@/pages/Budgets').then(m => ({ default: m.Budgets })));
const SavingsGoals = lazy(() => import('@/pages/SavingsGoals').then(m => ({ default: m.SavingsGoals })));
const Subscriptions = lazy(() => import('@/pages/Subscriptions').then(m => ({ default: m.Subscriptions })));
const WhatIfSimulator = lazy(() => import('@/pages/WhatIfSimulator').then(m => ({ default: m.WhatIfSimulator })));
const Analytics = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));

export type Page =
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'savings'
  | 'subscriptions'
  | 'simulator'
  | 'analytics'
  | 'settings';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setMobileNavOpen(false);
  };

  return (
    <FinanceProvider>
      <ToastProvider>
      <div className="min-h-screen flex">
        <Sidebar currentPage={page} onNavigate={navigate} mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <TopBar onMobileMenuClick={() => setMobileNavOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-sm text-navy-400">Loading...</div>}>
              {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
              {page === 'transactions' && <Transactions />}
              {page === 'budgets' && <Budgets />}
              {page === 'savings' && <SavingsGoals />}
              {page === 'subscriptions' && <Subscriptions />}
              {page === 'simulator' && <WhatIfSimulator />}
              {page === 'analytics' && <Analytics />}
              {page === 'settings' && <Settings />}
            </Suspense>
          </main>
        </div>
      </div>
      </ToastProvider>
    </FinanceProvider>
  );
}

export default App;
