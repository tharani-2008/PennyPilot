import { useState, useEffect } from 'react';
import { useFinance } from '@/context/useFinance';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/RiskBadge';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/finance';
import { getIcon } from '@/lib/icons';
import { SavingsGoal } from '@/types';
import { Plus, Trash2, CreditCard as Edit, Target, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const goalColors = ['#84cc16', '#38bdf8', '#a78bfa', '#fbbf24', '#2dd4bf', '#fb7185'];
const goalIcons = ['Shield', 'Music', 'Headphones', 'Target', 'Trophy', 'Gift', 'Plane', 'Home', 'Camera', 'Laptop', 'Watch', 'Footprints'];

export function SavingsGoals() {
  const { state, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, contributeToGoal } = useFinance();
  const currency = state.currency;

  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [deleteGoalItem, setDeleteGoalItem] = useState<SavingsGoal | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const openAdd = () => {
    setEditGoal(null);
    setModalOpen(true);
  };

  const openEdit = (goal: SavingsGoal) => {
    setEditGoal(goal);
    setModalOpen(true);
  };

  const openContribute = (goal: SavingsGoal) => {
    setContributeGoal(goal);
    setContributeAmount('');
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contributeAmount);
    if (!amt || amt <= 0 || !contributeGoal) return;
    contributeToGoal(contributeGoal.id, amt);
    setContributeGoal(null);
  };

  const totalTarget = state.savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = state.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="Savings Goals"
        subtitle="Track progress toward what matters"
        action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> New Goal</button>}
      />

      {/* Total Progress */}
      <Card delay={1} className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1.5">Total Savings Progress</p>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={totalCurrent} prefix={currency} className="text-3xl font-bold text-navy-50 font-mono" />
              <span className="text-sm text-navy-400">of {formatCurrency(totalTarget, currency)}</span>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-navy-400">Overall</span>
              <span className="text-xs font-mono text-lime-400">{totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(0) : 0}%</span>
            </div>
            <ProgressBar value={totalCurrent} max={totalTarget} color="#84cc16" height="h-3" showGlow />
          </div>
        </div>
      </Card>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.savingsGoals.map((goal, idx) => {
          const pct = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const isComplete = pct >= 100;
          const Icon = getIcon(goal.icon) as LucideIcon;
          return (
            <Card key={goal.id} hover delay={Math.min(idx + 1, 6)} className="p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${goal.color}12`, color: goal.color }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-50">{goal.name}</p>
                    <p className="text-xs text-navy-400">{pct.toFixed(0)}% complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(goal)} className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:text-lime-400 hover:bg-white/[0.05] transition-all" aria-label="Edit goal">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => setDeleteGoalItem(goal)} className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all" aria-label="Delete goal">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color={goal.color} height="h-2.5" showGlow />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-semibold text-navy-50">{formatCurrency(goal.currentAmount, currency)}</span>
                <span className="text-xs text-navy-400 font-mono">{formatCurrency(goal.targetAmount, currency)}</span>
              </div>

              {isComplete ? (
                <div className="flex items-center justify-center gap-2 py-2 text-lime-400 text-sm font-medium">
                  <Check size={16} /> Goal Reached!
                </div>
              ) : (
                <button onClick={() => openContribute(goal)} className="btn-secondary w-full text-xs">
                  <Plus size={14} /> Contribute
                </button>
              )}
            </Card>
          );
        })}

        {state.savingsGoals.length === 0 && (
          <Card className="col-span-full">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Target size={28} className="text-navy-400 mb-3" />
              <p className="text-sm text-navy-300 mb-1">No savings goals yet</p>
              <p className="text-xs text-navy-400 mb-4">Create your first goal to start saving</p>
              <button onClick={openAdd} className="btn-primary"><Plus size={16} /> New Goal</button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <GoalFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editGoal={editGoal}
        onSubmit={(data) => {
          if (editGoal) {
            updateSavingsGoal(editGoal.id, data);
          } else {
            addSavingsGoal(data);
          }
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteGoalItem}
        onClose={() => setDeleteGoalItem(null)}
        onConfirm={() => { if (deleteGoalItem) deleteSavingsGoal(deleteGoalItem.id); }}
        title="Delete Savings Goal"
        message={`Delete "${deleteGoalItem?.name || ''}"? This cannot be undone.`}
        confirmLabel="Delete"
      />

      {/* Contribute Modal */}
      <Modal open={!!contributeGoal} onClose={() => setContributeGoal(null)} title={`Contribute to ${contributeGoal?.name || ''}`} size="sm">
        <form onSubmit={handleContribute} className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-navy-400">Current</span>
              <span className="font-mono text-navy-100">{formatCurrency(contributeGoal?.currentAmount || 0, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-navy-400">Target</span>
              <span className="font-mono text-navy-100">{formatCurrency(contributeGoal?.targetAmount || 0, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-navy-400">Remaining</span>
              <span className="font-mono text-lime-400">{formatCurrency((contributeGoal?.targetAmount || 0) - (contributeGoal?.currentAmount || 0), currency)}</span>
            </div>
          </div>
          <div>
            <label className="label">Amount to Add</label>
            <input className="input font-mono" type="number" min="0" step="1" placeholder="0" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} required autoFocus />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setContributeGoal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Money</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
  editGoal: SavingsGoal | null;
  onSubmit: (data: Omit<SavingsGoal, 'id'>) => void;
}

function GoalFormModal({ open, onClose, editGoal, onSubmit }: GoalFormModalProps) {
  const [name, setName] = useState(editGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(editGoal?.targetAmount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(editGoal?.currentAmount.toString() || '0');
  const [color, setColor] = useState(editGoal?.color || goalColors[0]);
  const [icon, setIcon] = useState(editGoal?.icon || goalIcons[0]);

  useEffect(() => {
    if (open) {
      setName(editGoal?.name || '');
      setTargetAmount(editGoal?.targetAmount.toString() || '');
      setCurrentAmount(editGoal?.currentAmount.toString() || '0');
      setColor(editGoal?.color || goalColors[0]);
      setIcon(editGoal?.icon || goalIcons[0]);
    }
  }, [open, editGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;
    if (!target || target <= 0 || !name.trim()) return;
    onSubmit({ name: name.trim(), targetAmount: target, currentAmount: Math.min(current, target), color, icon });
  };

  return (
    <Modal open={open} onClose={onClose} title={editGoal ? 'Edit Goal' : 'New Savings Goal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Goal Name</label>
          <input className="input" placeholder="e.g. Emergency Fund" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Target Amount</label>
            <input className="input font-mono" type="number" min="0" step="1" placeholder="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
          </div>
          <div>
            <label className="label">Current Amount</label>
            <input className="input font-mono" type="number" min="0" step="1" placeholder="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Color</label>
          <div className="flex gap-2 flex-wrap">
            {goalColors.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-navy-900 scale-110' : ''}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <div>
          <label className="label">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {goalIcons.map((ic) => {
              const Icon = getIcon(ic);
              return (
                <button key={ic} type="button" onClick={() => setIcon(ic)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${icon === ic ? 'bg-lime-400/20 text-lime-400 ring-1 ring-lime-400/30' : 'bg-white/[0.03] text-navy-400 hover:text-navy-200'}`}>
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{editGoal ? 'Save Changes' : 'Create Goal'}</button>
        </div>
      </form>
    </Modal>
  );
}
