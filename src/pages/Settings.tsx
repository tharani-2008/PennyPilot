import { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/finance';
import { CalendarClock, Check, Trash2, Plus, Settings as SettingsIcon } from 'lucide-react';
import { Commitment, Category, CATEGORIES } from '@/types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function Settings() {
  const { state, metrics, currentDay, resetData, updateSettings, toggleCommitmentPaid, addCommitment, deleteCommitment } = useFinance();
  const currency = state.currency;

  const [userName, setUserName] = useState(state.userName);
  const [currencySymbol, setCurrencySymbol] = useState(state.currency);
  const [commitmentModalOpen, setCommitmentModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [deleteCommitmentItem, setDeleteCommitmentItem] = useState<Commitment | null>(null);

  const handleSaveSettings = () => {
    updateSettings({ userName: userName.trim() || 'Explorer', currency: currencySymbol });
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader title="Settings" subtitle="Customize your PennyPilot experience" />

      {/* Profile Settings */}
      <Card delay={1}>
        <CardHeader title="Profile" subtitle="Personalize your dashboard" icon={<SettingsIcon size={16} />} />
        <div className="p-5 pt-2 space-y-4">
          <div>
            <label className="label">Display Name</label>
            <input className="input" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="label">Currency Symbol</label>
            <div className="flex gap-2">
              {['₹', '$', '€', '£', '¥'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrencySymbol(sym)}
                  className={`w-12 h-10 rounded-xl font-mono text-sm font-semibold transition-all ${
                    currencySymbol === sym
                      ? 'bg-lime-400/15 text-lime-400 border border-lime-400/30'
                      : 'bg-white/[0.03] text-navy-400 border border-white/[0.08] hover:border-white/[0.12]'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSaveSettings} className="btn-primary">
            <Check size={16} /> Save Settings
          </button>
        </div>
      </Card>

      {/* Challenge Status */}
      <Card delay={2}>
        <CardHeader title="30-Day Challenge Status" subtitle="Your financial journey" icon={<CalendarClock size={16} />} />
        <div className="p-5 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="section-label mb-1">Day</p>
              <p className="text-lg font-bold text-navy-50 font-mono">{currentDay} / 30</p>
            </div>
            <div>
              <p className="section-label mb-1">Starting Budget</p>
              <p className="text-lg font-bold text-navy-50 font-mono">{formatCurrency(state.startingBudget, currency)}</p>
            </div>
            <div>
              <p className="section-label mb-1">Health Score</p>
              <p className="text-lg font-bold text-lime-400 font-mono">{metrics.healthScore}/100</p>
            </div>
            <div>
              <p className="section-label mb-1">Risk Level</p>
              <p className="text-lg font-bold" style={{
                color: metrics.riskLevel === 'Low' ? '#84cc16' : metrics.riskLevel === 'Moderate' ? '#fbbf24' : metrics.riskLevel === 'High' ? '#fb923c' : '#ef4444'
              }}>{metrics.riskLevel}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Commitments */}
      <Card delay={3}>
        <CardHeader
          title="Recurring Commitments"
          subtitle="Monthly bills and obligations"
          icon={<CalendarClock size={16} />}
          action={
            <button onClick={() => setCommitmentModalOpen(true)} className="btn-ghost text-xs">
              <Plus size={14} /> Add
            </button>
          }
        />
        <div className="p-5 pt-2 space-y-2">
          {state.commitments.length > 0 ? (
            state.commitments
              .sort((a, b) => a.dueDay - b.dueDay)
              .map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] group">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCommitmentPaid(c.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        c.paid ? 'bg-lime-400/20 text-lime-400' : 'bg-white/[0.05] text-navy-500 hover:text-navy-300'
                      }`}
                    >
                      {c.paid && <Check size={14} />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${c.paid ? 'text-navy-400 line-through' : 'text-navy-100'}`}>{c.name}</p>
                      <p className="text-xs text-navy-400">{c.category} · Due Day {c.dueDay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono font-semibold ${c.paid ? 'text-navy-500' : 'text-coral'}`}>
                      {formatCurrency(c.amount, currency)}
                    </span>
                    <button
                      onClick={() => setDeleteCommitmentItem(c)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Delete commitment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-sm text-navy-400 py-4 text-center">No commitments added yet</p>
          )}
        </div>
      </Card>

      {/* Data Management */}
      <Card delay={4}>
        <CardHeader title="Data Management" subtitle="Your data is stored locally in your browser" icon={<Trash2 size={16} />} />
        <div className="p-5 pt-2 space-y-3">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-100">Transactions</p>
                <p className="text-xs text-navy-400">{state.transactions.length} records</p>
              </div>
              <span className="text-sm font-mono text-navy-300">{formatCurrency(metrics.totalSpending, currency)}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-100">Savings Goals</p>
                <p className="text-xs text-navy-400">{state.savingsGoals.length} active goals</p>
              </div>
              <span className="text-sm font-mono text-navy-300">{formatCurrency(metrics.totalSavingsCurrent, currency)}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-400/[0.04] border border-amber-400/15">
            <p className="text-sm text-amber-300 mb-3">Reset all data to start fresh with new demo data. This cannot be undone.</p>
            <button onClick={() => setResetModalOpen(true)} className="btn-secondary text-amber-300 border-amber-400/30 hover:border-amber-400/50">
              <Trash2 size={16} /> Reset All Data
            </button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card delay={5} className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-lime flex items-center justify-center">
            <span className="text-navy-950 font-bold text-lg">P</span>
          </div>
          <div>
            <p className="text-sm font-bold text-navy-50">PennyPilot</p>
            <p className="text-xs text-navy-400">Your Gen Z money co-pilot</p>
          </div>
        </div>
        <p className="text-xs text-navy-400 leading-relaxed">
          PennyPilot helps you manage {formatCurrency(state.startingBudget, currency)} over 30 days with smart insights, forecasts, and a financial health score. All data stays in your browser — nothing is sent to any server.
        </p>
      </Card>

      {/* Reset Modal */}
      <Modal open={resetModalOpen} onClose={() => setResetModalOpen(false)} title="Reset All Data" size="sm">
        <p className="text-sm text-navy-300 mb-4">
          This will erase all your transactions, savings goals, budgets, subscriptions, and commitments, replacing them with fresh demo data. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setResetModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={() => {
              resetData();
              setResetModalOpen(false);
            }}
            className="btn-primary flex-1 bg-red-500 hover:bg-red-400 text-white"
          >
            Yes, Reset Everything
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteCommitmentItem}
        onClose={() => setDeleteCommitmentItem(null)}
        onConfirm={() => { if (deleteCommitmentItem) deleteCommitment(deleteCommitmentItem.id); }}
        title="Delete Commitment"
        message={`Delete "${deleteCommitmentItem?.name || ''}"? This cannot be undone.`}
        confirmLabel="Delete"
      />

      {/* Add Commitment Modal */}
      <CommitmentFormModal
        open={commitmentModalOpen}
        onClose={() => setCommitmentModalOpen(false)}
        onSubmit={(data) => {
          addCommitment(data);
          setCommitmentModalOpen(false);
        }}
      />
    </div>
  );
}

function CommitmentFormModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: Omit<Commitment, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('1');
  const [category, setCategory] = useState<Category>('Bills & Utilities');

  useEffect(() => {
    if (open) {
      setName('');
      setAmount('');
      setDueDay('1');
      setCategory('Bills & Utilities');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !name.trim()) return;
    onSubmit({ name: name.trim(), amount: amt, dueDay: parseInt(dueDay) || 1, category, paid: false });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Commitment" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="input" placeholder="e.g. Phone Bill" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Amount</label>
            <input className="input font-mono" type="number" min="0" step="1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="label">Due Day (1-30)</label>
            <input className="input font-mono" type="number" min="1" max="30" value={dueDay} onChange={(e) => setDueDay(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">Add Commitment</button>
        </div>
      </form>
    </Modal>
  );
}
