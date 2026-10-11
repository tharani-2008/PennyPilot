import { useState, useEffect } from 'react';
import { useFinance } from '@/context/useFinance';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/RiskBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/finance';
import { CATEGORY_META, Category, CATEGORIES, Budget } from '@/types';
import { Plus, Trash2, CreditCard as Edit, PiggyBank, CircleAlert as AlertCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function Budgets() {
  const { state, metrics, addBudget, updateBudget, deleteBudget } = useFinance();
  const { showToast } = useToast();
  const currency = state.currency;

  const [modalOpen, setModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteBudgetItem, setDeleteBudgetItem] = useState<Budget | null>(null);

  const usedCategories = state.budgets.map((b) => b.category);
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.includes(c));

  const openAdd = () => {
    setEditBudget(null);
    setModalOpen(true);
  };

  const openEdit = (budget: Budget) => {
    setEditBudget(budget);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="Budgets"
        subtitle="Set spending limits per category"
        action={<button onClick={openAdd} disabled={availableCategories.length === 0} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"><Plus size={16} /> Add Budget</button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card delay={1} className="p-4">
          <p className="section-label mb-1.5">Total Budget</p>
          <p className="text-xl font-bold text-navy-50 font-mono">{formatCurrency(state.budgets.reduce((s, b) => s + b.limit, 0), currency)}</p>
        </Card>
        <Card delay={2} className="p-4">
          <p className="section-label mb-1.5">Total Spent</p>
          <p className="text-xl font-bold text-coral font-mono">{formatCurrency(metrics.budgetStatus.reduce((s, b) => s + b.spent, 0), currency)}</p>
        </Card>
        <Card delay={3} className="p-4">
          <p className="section-label mb-1.5">Over Budget</p>
          <p className="text-xl font-bold font-mono" style={{ color: metrics.budgetStatus.filter((b) => b.status === 'over').length > 0 ? '#ef4444' : '#84cc16' }}>
            {metrics.budgetStatus.filter((b) => b.status === 'over').length} categories
          </p>
        </Card>
      </div>

      {/* Budget Cards */}
      {metrics.budgetStatus.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.budgetStatus.map((bs, idx) => {
            const catMeta = CATEGORY_META[bs.category as Category] || CATEGORY_META.Other;
            const statusColor = bs.status === 'over' ? '#ef4444' : bs.status === 'warning' ? '#fbbf24' : '#84cc16';
            return (
              <Card key={bs.category} hover delay={Math.min(idx + 1, 6)} className="p-5 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${catMeta.color}12`, color: catMeta.color }}>
                      {bs.status === 'over' ? <AlertCircle size={18} aria-hidden="true" /> : <PiggyBank size={18} aria-hidden="true" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-50">{bs.category}</p>
                      <p className="text-xs text-navy-400">
                        {formatCurrency(bs.spent, currency)} of {formatCurrency(bs.limit, currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(state.budgets.find((b) => b.category === bs.category)!)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-lime-400 hover:bg-white/[0.05] transition-all icon-btn" aria-label={`Edit ${bs.category} budget`}>
                      <Edit size={14} aria-hidden="true" />
                    </button>
                    <button onClick={() => setDeleteBudgetItem(state.budgets.find((b) => b.category === bs.category) || null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all icon-btn" aria-label={`Delete ${bs.category} budget`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <ProgressBar value={bs.spent} max={bs.limit} color={statusColor} height="h-2.5" showGlow={bs.status === 'safe'} />
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${bs.status === 'over' ? 'text-red-400' : bs.status === 'warning' ? 'text-amber-400' : 'text-lime-400'}`}>
                    {bs.percentage.toFixed(0)}% used
                  </span>
                  <span className="text-xs font-mono text-navy-400">
                    {bs.remaining >= 0 ? `${formatCurrency(bs.remaining, currency)} left` : `${formatCurrency(Math.abs(bs.remaining), currency)} over`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card delay={2}>
          <EmptyState
            icon={<PiggyBank size={26} />}
            title="No budgets set yet"
            description="Create spending limits for your categories to stay on track and avoid overspending."
            action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Your First Budget</button>}
          />
        </Card>
      )}

      <BudgetFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editBudget={editBudget}
        availableCategories={availableCategories}
        onSubmit={(data) => {
          if (editBudget) {
            updateBudget(editBudget.id, data);
            showToast('Budget updated');
          } else {
            addBudget(data);
            showToast('Budget added');
          }
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteBudgetItem}
        onClose={() => setDeleteBudgetItem(null)}
        onConfirm={() => { if (deleteBudgetItem) { deleteBudget(deleteBudgetItem.id); showToast('Budget deleted', 'info'); } }}
        title="Delete Budget"
        message={`Remove the ${deleteBudgetItem?.category || ''} budget? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

interface BudgetFormModalProps {
  open: boolean;
  onClose: () => void;
  editBudget: Budget | null;
  availableCategories: Category[];
  onSubmit: (data: Omit<Budget, 'id'>) => void;
}

function BudgetFormModal({ open, onClose, editBudget, availableCategories, onSubmit }: BudgetFormModalProps) {
  const [category, setCategory] = useState<Category>(editBudget?.category || availableCategories[0] || 'Food & Dining');
  const [limit, setLimit] = useState(editBudget?.limit.toString() || '');

  useEffect(() => {
    if (open) {
      setCategory(editBudget?.category || availableCategories[0] || 'Food & Dining');
      setLimit(editBudget?.limit.toString() || '');
    }
  }, [open, editBudget, availableCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lim = parseFloat(limit);
    if (!lim || lim <= 0) return;
    onSubmit({ category, limit: lim });
  };

  return (
    <Modal open={open} onClose={onClose} title={editBudget ? 'Edit Budget' : 'Add Budget'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="budget-category" className="label">Category</label>
          <select
            id="budget-category"
            className="input cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            disabled={!!editBudget}
          >
            {editBudget ? (
              <option value={editBudget.category}>{editBudget.category}</option>
            ) : (
              availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))
            )}
          </select>
        </div>
        <div>
          <label htmlFor="budget-limit" className="label">Monthly Limit</label>
          <input id="budget-limit" className="input font-mono" type="number" min="0" step="1" placeholder="0" value={limit} onChange={(e) => setLimit(e.target.value)} required />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{editBudget ? 'Save' : 'Add Budget'}</button>
        </div>
      </form>
    </Modal>
  );
}
