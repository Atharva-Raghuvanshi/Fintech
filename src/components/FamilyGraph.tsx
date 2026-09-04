import React, { useState, useEffect } from 'react';
import { Users, Network, UserCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import type { FamilyMember, JointAsset } from '../types';

export function FamilyGraph() {
  const [familyData, setFamilyData] = useState<{ members: FamilyMember[], jointAssets: JointAsset[], nomineeHealth: any } | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    fetch('/api/family')
      .then(res => res.headers.get('content-type')?.includes('application/json') ? res.json() : null)
      .then(data => data && setFamilyData(data))
      .catch(console.error);
  }, []);

  const handleFixNominees = async () => {
    setIsFixing(true);
    try {
      const res = await fetch('/api/family/fix-nominee', { method: 'POST' });
      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          setFamilyData(data.familyData);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsFixing(false);
  };

  if (!familyData) return <div className="p-8">Loading family data...</div>;

  const { members: familyMembers, jointAssets, nomineeHealth } = familyData;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Family Asset Splits</h1>
          <p className="text-slate-400 mt-1">Graph-based ownership distribution across family members.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="glass-panel overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/5 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-300 flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                Ownership Distribution
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {familyMembers.map((member) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-slate-400" />
                      <span className="font-semibold text-slate-300">{member.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">{member.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{formatCurrency(member.totalValue)}</span>
                      <span className="text-slate-400 ml-2">({member.ownership}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${member.ownership}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-slate-50/50">
              <h2 className="font-bold text-slate-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Joint Entities & Graph Edges
              </h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-3">Asset Node</th>
                  <th className="px-6 py-3">Linked Members</th>
                  <th className="px-6 py-3">Split Ratio</th>
                  <th className="px-6 py-3 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                {jointAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-300">{asset.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {asset.members.map((m, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-600" title={m}>
                            {m.substring(0, 2).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-md text-xs font-medium">{asset.split}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">{formatCurrency(asset.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 text-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Nominee Health</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-sm text-slate-300">Total Demat Accounts</span>
                <span className="font-semibold text-white">4</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-sm text-slate-300">Nominee Registered</span>
                <span className="font-semibold text-emerald-400">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Action Required</span>
                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">1 Missing</span>
              </div>
            </div>
            <button 
              onClick={handleFixNominees}
              disabled={isFixing || nomineeHealth.missing === 0}
              className="mt-6 w-full glass-button-amber text-amber-500 font-bold text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {nomineeHealth.missing === 0 ? 'All Linked' : isFixing ? 'Fixing...' : <>Fix Nominee Linkages <ChevronRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
