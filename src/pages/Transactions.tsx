import { useState, useMemo, useEffect } from 'react';
import { useFinance } from '@/context/useFinance';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/finance';
import { getIcon } from '@/lib/icons';
import { CATEGORY_META, Category, CATEGORIES, Transaction } from '@/types';
import { Plus, Search, Filter, Trash2, CreditCard as Edit, CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, Wallet, ChevronDown, Repeat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function Transactions() {
  const { state, addTransaction, updateTransaction, deleteTransaction, currentDay } = useFinance();
  const { showToast } = useToast();
  const currency = state.currency;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [deleteTxn, setDeleteTxn] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return [...state.transactions]
      .filter((t) => {
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.day - a.day);
  }, [state.transactions, search, categoryFilter, typeFilter]);

  const openAdd = () => {
    setEditTxn(null);
    setModalOpen(true);
  };

  const openEdit = (txn: Transaction) => {
    setEditTxn(txn);
    setModalOpen(true);
  };

  const handleDelete = (txn: Transaction) => {
    setDeleteTxn(txn);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="Transactions"
        subtitle={`${state.transactions.length} transactions this month`}
        action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Transaction</button>}
      />

      {/* Filters */}
      <Card delay={1} className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              className="input pl-10"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
              <select
                className="input pl-9 pr-8 appearance-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                className="input pr-8 appearance-none cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card delay={2}>
        {filtered.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((txn) => {
              const catMeta = CATEGORY_META[txn.category as Category] || CATEGORY_META.Other;
              const Icon = getIcon(catMeta.icon) as LucideIcon;
              return (
                <div key={txn.id} className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${catMeta.color}12`, color: catMeta.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-100 truncate">{txn.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-navy-400">
                        <span>{txn.category}</span>
                        <span>·</span>
                        <span>Day {txn.day}</span>
                        {txn.isRecurring && (
                          <>
                            <span>·</span>
                            <span className="text-lime-400 flex items-center gap-0.5"><Repeat size={9} /> Recurring</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm font-mono font-semibold ${txn.type === 'income' ? 'text-lime-400' : 'text-navy-100'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(txn)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-lime-400 hover:bg-white/[0.05] transition-all icon-btn"
                        aria-label={`Edit transaction: ${txn.description}`}
                      >
                        <Edit size={14} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(txn)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all icon-btn"
                        aria-label={`Delete transaction: ${txn.description}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Wallet size={26} />}
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction to get started."
            action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Transaction</button>}
          />
        )}
      </Card>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editTxn={editTxn}
        currentDay={currentDay}
        onSubmit={(data) => {
          if (editTxn) {
            updateTransaction(editTxn.id, data);
            showToast('Transaction updated');
          } else {
            addTransaction(data);
            showToast('Transaction added');
          }
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteTxn}
        onClose={() => setDeleteTxn(null)}
        onConfirm={() => { if (deleteTxn) { deleteTransaction(deleteTxn.id); showToast('Transaction deleted', 'info'); } }}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteTxn?.description || ''}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  editTxn: Transaction | null;
  currentDay: number;
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
}

function TransactionFormModal({ open, onClose, editTxn, currentDay, onSubmit }: TransactionFormModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(editTxn?.type || 'expense');
  const [amount, setAmount] = useState(editTxn?.amount.toString() || '');
  const [category, setCategory] = useState<Category>(editTxn?.category || 'Food & Dining');
  const [description, setDescription] = useState(editTxn?.description || '');
  const [day, setDay] = useState(editTxn?.day.toString() || currentDay.toString());

  useEffect(() => {
    if (open) {
      setType(editTxn?.type || 'expense');
      setAmount(editTxn?.amount.toString() || '');
      setCategory(editTxn?.category || 'Food & Dining');
      setDescription(editTxn?.description || '');
      setDay(editTxn?.day.toString() || currentDay.toString());
    }
  }, [open, editTxn, currentDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !description.trim()) return;
    const dayNum = parseInt(day) || currentDay;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (30 - dayNum));
    onSubmit({
      type,
      amount: amt,
      category,
      description: description.trim(),
      day: dayNum,
      date: startDate.toISOString().split('T')[0],
      isRecurring: editTxn?.isRecurring,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={editTxn ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              type === 'expense'
                ? 'bg-coral/10 border-coral/30 text-coral'
                : 'bg-white/[0.03] border-white/[0.08] text-navy-400 hover:border-white/[0.12]'
            }`}
          >
            <ArrowDownCircle size={18} /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              type === 'income'
                ? 'bg-lime-400/10 border-lime-400/30 text-lime-400'
                : 'bg-white/[0.03] border-white/[0.08] text-navy-400 hover:border-white/[0.12]'
            }`}
          >
            <ArrowUpCircle size={18} /> Income
          </button>
        </div>

        <div>
          <label className="label">Description</label>
          <input
            className="input"
            placeholder="e.g. Lunch at cafeteria"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Amount</label>
            <input
              className="input font-mono"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Day (1-30)</label>
            <input
              className="input font-mono"
              type="number"
              min="1"
              max="30"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
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
          <button type="submit" className="btn-primary flex-1">{editTxn ? 'Save Changes' : 'Add Transaction'}</button>
        </div>
      </form>
    </Modal>
  );
}
