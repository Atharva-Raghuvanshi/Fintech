import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import type { Goal } from '../types';

export function GoalPlanner() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch('/api/goals')
      .then(res => res.json())
      .then(data => {
        setGoals(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleCreateGoal = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Vacation Fund', target: 500000, monthlySip: 10000, year: 2026 })
      });
      const data = await res.json();
      if (res.ok) {
        setGoals(data.goals);
      }
    } catch (e) {
      console.error(e);
    }
    setIsCreating(false);
  };

  if (isLoading) return <div className="p-8">Loading goals...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Goal Planning</h1>
          <p className="text-slate-500 mt-1">Monte Carlo simulations for target corpus achievement.</p>
        </div>
        <button 
          onClick={handleCreateGoal}
          disabled={isCreating}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white shadow-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors"
        >
          {isCreating ? 'Creating...' : 'Create New Goal'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${goal.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{goal.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target: {goal.year}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                goal.status === 'On Track' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {goal.status}
              </span>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-slate-900">{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${goal.status === 'On Track' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Corpus</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(goal.target)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Saved</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(goal.current)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Required SIP:</span>
              </div>
              <span className="font-bold text-indigo-600">{formatCurrency(goal.monthlySip)}/mo</span>
            </div>
            
            <div className="mt-4 bg-slate-50 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 ${goal.probability > 80 ? 'text-emerald-500' : 'text-amber-500'}`} />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{goal.probability}% probability</span> of achieving this goal based on 10,000 market simulations.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
