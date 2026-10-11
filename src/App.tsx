import { useState } from 'react';
import { FinanceProvider } from '@/context/FinanceContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Budgets } from '@/pages/Budgets';
import { SavingsGoals } from '@/pages/SavingsGoals';
import { Subscriptions } from '@/pages/Subscriptions';
import { WhatIfSimulator } from '@/pages/WhatIfSimulator';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';

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
      <div className="min-h-screen flex">
        <Sidebar currentPage={page} onNavigate={navigate} mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <TopBar onMobileMenuClick={() => setMobileNavOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
            {page === 'transactions' && <Transactions />}
            {page === 'budgets' && <Budgets />}
            {page === 'savings' && <SavingsGoals />}
            {page === 'subscriptions' && <Subscriptions />}
            {page === 'simulator' && <WhatIfSimulator />}
            {page === 'analytics' && <Analytics />}
            {page === 'settings' && <Settings />}
          </main>
        </div>
      </div>
    </FinanceProvider>
  );
}

export default App;
