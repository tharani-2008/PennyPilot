import { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/RiskBadge';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { PageHeader } from '@/pages/Analytics';
import { simulateScenario, formatCurrency, calculateMetrics } from '@/lib/finance';
import { FlaskConical, TrendingDown, TrendingUp, PiggyBank, Gauge, Zap, RefreshCw } from 'lucide-react';

export function WhatIfSimulator() {
  const { state, currentDay } = useFinance();
  const currency = state.currency;

  const [spendReduction, setSpendReduction] = useState(10);
  const [additionalIncome, setAdditionalIncome] = useState(0);
  const [extraSavings, setExtraSavings] = useState(0);

  const currentMetrics = calculateMetrics(state, currentDay);
  const simulated = useMemo(() => {
    return simulateScenario(state, currentDay, { spendReduction, additionalIncome, extraSavings });
  }, [state, currentDay, spendReduction, additionalIncome, extraSavings]);

  const balanceDiff = simulated.projectedEndBalance - currentMetrics.projectedEndBalance;
  const healthDiff = simulated.newHealthScore - currentMetrics.healthScore;
  const savingsDiff = simulated.projectedSavings - currentMetrics.totalSavingsCurrent;

  const presets = [
    { name: `Cut 20% spending`, spendReduction: 20, additionalIncome: 0, extraSavings: 0 },
    { name: `Earn ${currency}1,000 extra`, spendReduction: 0, additionalIncome: 1000, extraSavings: 0 },
    { name: `Save ${currency}500 more`, spendReduction: 0, additionalIncome: 0, extraSavings: 500 },
    { name: 'Aggressive saver', spendReduction: 25, additionalIncome: 500, extraSavings: 1000 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setSpendReduction(preset.spendReduction);
    setAdditionalIncome(preset.additionalIncome);
    setExtraSavings(preset.extraSavings);
  };

  const reset = () => {
    setSpendReduction(0);
    setAdditionalIncome(0);
    setExtraSavings(0);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <PageHeader
        title="What-if Simulator"
        subtitle="See how changes affect your month-end outlook"
        action={<button onClick={reset} className="btn-secondary"><RefreshCw size={16} /> Reset</button>}
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-2 animate-fade-in">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className="badge bg-white/[0.03] text-navy-200 border border-white/[0.08] hover:border-lime-400/30 hover:text-lime-400 transition-all cursor-pointer"
          >
            <Zap size={12} /> {preset.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls */}
        <Card delay={1}>
          <CardHeader title="Simulation Controls" subtitle="Adjust the sliders to see outcomes" icon={<FlaskConical size={16} />} />
          <div className="px-5 pb-5 space-y-6">
            {/* Spend Reduction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-navy-200 font-medium flex items-center gap-2">
                  <TrendingDown size={15} className="text-coral" /> Reduce Spending
                </label>
                <span className="text-sm font-mono font-semibold text-coral">{spendReduction}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={spendReduction}
                onChange={(e) => setSpendReduction(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                style={{ ['--val' as string]: `${(spendReduction / 50) * 100}%` }}
              />
              <p className="text-xs text-navy-400 mt-1">Cut discretionary spending by {spendReduction}%</p>
            </div>

            {/* Additional Income */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-navy-200 font-medium flex items-center gap-2">
                  <TrendingUp size={15} className="text-lime-400" /> Extra Income
                </label>
                <span className="text-sm font-mono font-semibold text-lime-400">{formatCurrency(additionalIncome, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={additionalIncome}
                onChange={(e) => setAdditionalIncome(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                style={{ ['--val' as string]: `${(additionalIncome / 5000) * 100}%` }}
              />
              <p className="text-xs text-navy-400 mt-1">Additional income this month</p>
            </div>

            {/* Extra Savings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-navy-200 font-medium flex items-center gap-2">
                  <PiggyBank size={15} className="text-accent-blue" /> Extra Savings
                </label>
                <span className="text-sm font-mono font-semibold text-accent-blue">{formatCurrency(extraSavings, currency)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={extraSavings}
                onChange={(e) => setExtraSavings(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                style={{ ['--val' as string]: `${(extraSavings / 3000) * 100}%` }}
              />
              <p className="text-xs text-navy-400 mt-1">Move extra money to savings goals</p>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card delay={2}>
          <CardHeader title="Projected Outcome" subtitle="After applying your changes" icon={<Gauge size={16} />} />
          <div className="px-5 pb-5 space-y-3">
            {/* Balance Comparison */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="section-label mb-1">Month-End Balance</p>
                  <AnimatedNumber value={simulated.projectedEndBalance} prefix={currency} className="text-2xl font-bold text-navy-50 font-mono" />
                </div>
                {balanceDiff !== 0 && (
                  <div className={`text-right ${balanceDiff > 0 ? 'text-lime-400' : 'text-coral'}`}>
                    <p className="text-xs text-navy-400">Change</p>
                    <p className="text-sm font-mono font-semibold">
                      {balanceDiff > 0 ? '+' : ''}{formatCurrency(balanceDiff, currency)}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-navy-400">
                  Current: <span className="font-mono text-navy-200">{formatCurrency(currentMetrics.projectedEndBalance, currency)}</span>
                </div>
                <div className="text-navy-400 text-right">
                  Simulated: <span className="font-mono text-lime-400">{formatCurrency(simulated.projectedEndBalance, currency)}</span>
                </div>
              </div>
            </div>

            {/* Health Score Comparison */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">Health Score</p>
                {healthDiff !== 0 && (
                  <span className={`text-xs font-mono ${healthDiff > 0 ? 'text-lime-400' : 'text-coral'}`}>
                    {healthDiff > 0 ? '+' : ''}{healthDiff} pts
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <AnimatedNumber value={simulated.newHealthScore} className="text-2xl font-bold font-mono" />
                <span className="text-sm text-navy-400">/ 100</span>
              </div>
              <ProgressBar value={simulated.newHealthScore} max={100} color={simulated.newHealthScore >= 70 ? '#84cc16' : simulated.newHealthScore >= 50 ? '#fbbf24' : '#ef4444'} height="h-2" showGlow />
            </div>

            {/* Savings Comparison */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label mb-1">Projected Savings</p>
                  <AnimatedNumber value={simulated.projectedSavings} prefix={currency} className="text-xl font-bold text-navy-50 font-mono" />
                </div>
                {savingsDiff > 0 && (
                  <span className="text-xs font-mono text-accent-blue">+{formatCurrency(savingsDiff, currency)}</span>
                )}
              </div>
            </div>

            {/* Safe to Spend */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label mb-1">New Safe-to-Spend</p>
                  <AnimatedNumber value={simulated.safeToSpend} prefix={currency} className="text-xl font-bold text-navy-50 font-mono" />
                  <span className="text-xs text-navy-400"> / day</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card delay={3} className="p-5">
        <h3 className="text-sm font-semibold text-navy-50 mb-4">Impact Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${balanceDiff >= 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'}`}>
              {balanceDiff >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            <div>
              <p className="text-xs text-navy-400">Balance Impact</p>
              <p className={`text-sm font-semibold ${balanceDiff >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                {balanceDiff > 0 ? '+' : ''}{formatCurrency(balanceDiff, currency)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${healthDiff >= 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'}`}>
              <Gauge size={18} />
            </div>
            <div>
              <p className="text-xs text-navy-400">Health Impact</p>
              <p className={`text-sm font-semibold ${healthDiff >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
                {healthDiff > 0 ? '+' : ''}{healthDiff} points
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent-blue/10 text-accent-blue">
              <PiggyBank size={18} />
            </div>
            <div>
              <p className="text-xs text-navy-400">Savings Impact</p>
              <p className="text-sm font-semibold text-accent-blue">+{formatCurrency(savingsDiff, currency)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
