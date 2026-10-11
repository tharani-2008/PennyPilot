import { useState, useEffect } from 'react';
import { useFinance } from '@/context/useFinance';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/finance';
import { getIcon } from '@/lib/icons';
import { Subscription, CATEGORIES, Category } from '@/types';
import { Plus, Trash2, CreditCard as Edit, Repeat, Power, CalendarClock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const subIcons = ['Music', 'Tv', 'ShoppingBag', 'Dumbbell', 'Headphones', 'Film', 'Gamepad2', 'BookOpen', 'Smartphone', 'Wifi', 'Camera', 'Laptop'];

export function Subscriptions() {
  const { state, metrics, addSubscription, updateSubscription, deleteSubscription } = useFinance();
  const { showToast } = useToast();
  const currency = state.currency;

  const [modalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [deleteSubItem, setDeleteSubItem] = useState<Subscription | null>(null);

  const activeSubs = state.subscriptions.filter((s) => s.active);
  const inactiveSubs = state.subscriptions.filter((s) => !s.active);

  const openAdd = () => {
    setEditSub(null);
    setModalOpen(true);
  };

  const openEdit = (sub: Subscription) => {
    setEditSub(sub);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="Subscriptions"
        subtitle="Manage recurring monthly charges"
        action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Subscription</button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card delay={1} className="p-4">
          <p className="section-label mb-1.5">Monthly Cost</p>
          <AnimatedNumber value={metrics.monthlySubscriptionsCost} prefix={currency} className="text-xl font-bold text-navy-50 font-mono" />
        </Card>
        <Card delay={2} className="p-4">
          <p className="section-label mb-1.5">Active</p>
          <p className="text-xl font-bold text-lime-400 font-mono">{activeSubs.length}</p>
        </Card>
        <Card delay={3} className="p-4">
          <p className="section-label mb-1.5">Yearly Cost</p>
          <AnimatedNumber value={metrics.monthlySubscriptionsCost * 12} prefix={currency} className="text-xl font-bold text-coral font-mono" />
        </Card>
      </div>

      {/* Active Subscriptions */}
      <div>
        <h3 className="section-label mb-3">Active Subscriptions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeSubs.map((sub, idx) => {
            const Icon = getIcon(sub.icon) as LucideIcon;
            return (
              <Card key={sub.id} hover delay={Math.min(idx + 1, 6)} className="p-4 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-lime-400">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-50">{sub.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-navy-400">
                        <CalendarClock size={11} />
                        Billed on Day {sub.billingDay}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-navy-50">{formatCurrency(sub.amount, currency)}</p>
                    <p className="text-xs text-navy-400">/month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => updateSubscription(sub.id, { active: false })}
                    className="flex items-center gap-1.5 text-xs text-navy-400 hover:text-amber-400 transition-colors"
                  >
                    <Power size={13} /> Pause
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(sub)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-lime-400 hover:bg-white/[0.05] transition-all icon-btn" aria-label={`Edit subscription: ${sub.name}`}>
                      <Edit size={14} aria-hidden="true" />
                    </button>
                    <button onClick={() => setDeleteSubItem(sub)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all icon-btn" aria-label={`Delete subscription: ${sub.name}`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
          {activeSubs.length === 0 && (
            <Card className="col-span-full p-8 text-center">
              <Repeat size={26} className="text-navy-400 mx-auto mb-2" />
              <p className="text-sm text-navy-300">No active subscriptions</p>
            </Card>
          )}
        </div>
      </div>

      {/* Paused Subscriptions */}
      {inactiveSubs.length > 0 && (
        <div>
          <h3 className="section-label mb-3">Paused</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inactiveSubs.map((sub) => {
              const Icon = getIcon(sub.icon) as LucideIcon;
              return (
                <Card key={sub.id} className="p-4 opacity-60 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center text-navy-400">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-200">{sub.name}</p>
                        <p className="text-xs text-navy-500">Paused</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateSubscription(sub.id, { active: true })} className="btn-ghost text-xs">
                        <Power size={13} /> Resume
                      </button>
                      <button onClick={() => setDeleteSubItem(sub)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-400 hover:bg-white/[0.05] transition-all icon-btn" aria-label={`Delete subscription: ${sub.name}`}>
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <SubFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editSub={editSub}
        onSubmit={(data) => {
          if (editSub) {
            updateSubscription(editSub.id, data);
            showToast('Subscription updated');
          } else {
            addSubscription(data);
            showToast('Subscription added');
          }
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteSubItem}
        onClose={() => setDeleteSubItem(null)}
        onConfirm={() => { if (deleteSubItem) { deleteSubscription(deleteSubItem.id); showToast('Subscription deleted', 'info'); } }}
        title="Delete Subscription"
        message={`Delete "${deleteSubItem?.name || ''}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

interface SubFormModalProps {
  open: boolean;
  onClose: () => void;
  editSub: Subscription | null;
  onSubmit: (data: Omit<Subscription, 'id'>) => void;
}

function SubFormModal({ open, onClose, editSub, onSubmit }: SubFormModalProps) {
  const [name, setName] = useState(editSub?.name || '');
  const [amount, setAmount] = useState(editSub?.amount.toString() || '');
  const [billingDay, setBillingDay] = useState(editSub?.billingDay.toString() || '1');
  const [category, setCategory] = useState(editSub?.category || 'Entertainment');
  const [icon, setIcon] = useState(editSub?.icon || subIcons[0]);

  useEffect(() => {
    if (open) {
      setName(editSub?.name || '');
      setAmount(editSub?.amount.toString() || '');
      setBillingDay(editSub?.billingDay.toString() || '1');
      setCategory(editSub?.category || 'Entertainment');
      setIcon(editSub?.icon || subIcons[0]);
    }
  }, [open, editSub]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !name.trim()) return;
    onSubmit({
      name: name.trim(),
      amount: amt,
      billingDay: parseInt(billingDay) || 1,
      category,
      active: editSub?.active ?? true,
      icon,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={editSub ? 'Edit Subscription' : 'Add Subscription'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sub-name" className="label">Name</label>
          <input id="sub-name" className="input" placeholder="e.g. Spotify Premium" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sub-amount" className="label">Amount / month</label>
            <input id="sub-amount" className="input font-mono" type="number" min="0" step="1" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="sub-billing-day" className="label">Billing Day (1-30)</label>
            <input id="sub-billing-day" className="input font-mono" type="number" min="1" max="30" value={billingDay} onChange={(e) => setBillingDay(e.target.value)} required />
          </div>
        </div>
        <div>
          <label htmlFor="sub-category" className="label">Category</label>
          <select id="sub-category" className="input cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {subIcons.map((ic) => {
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
          <button type="submit" className="btn-primary flex-1">{editSub ? 'Save Changes' : 'Add Subscription'}</button>
        </div>
      </form>
    </Modal>
  );
}
