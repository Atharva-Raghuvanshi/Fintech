import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowUpRight, TrendingUp, Zap, Calendar as CalendarIcon, Target, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { historicalNetWorth } from '../data';
import type { Portfolio } from '../types';
import { Card, SectionHeader, KpiCard, StatusPill, PeriodToggle } from './ui/Card';
import { ASSET_COLORS, getAssetColor } from '../lib/assetColors';

// Mock Data
const mockPortfolio: Portfolio = {
  cash: 1250000,
  equity: 4500000,
  mutualFunds: 2800000,
  gold: 850000,
  crypto: 420000,
  silver: 150000,
  bonds: 500000,
  totalNetWorth: 10470000
};

const recentTrades = [
  { id: 1, asset: 'NIFTYBEES', type: 'BUY', amount: 50000, date: '2026-08-20', status: 'Executed' },
  { id: 2, asset: 'RELIANCE', type: 'SELL', amount: 120000, date: '2026-08-19', status: 'Executed' },
  { id: 3, asset: 'GOLDBEES', type: 'BUY', amount: 25000, date: '2026-08-18', status: 'Pending' },
];

const goals = [
  { name: 'Vacation Fund', target: 500000, current: 310000 },
  { name: 'Retirement', target: 50000000, current: 9000000 },
  { name: 'Emergency', target: 1000000, current: 1000000 },
];

export function Dashboard() {
  const [tradeAsset, setTradeAsset] = useState('NIFTYBEES');
  const [tradeAmount, setTradeAmount] = useState('10000');
  
  const pieData = Object.entries(mockPortfolio)
    .filter(([key, val]) => key !== 'totalNetWorth' && typeof val === 'number' && val > 0)
    .map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      value: val as number
    }))
    .sort((a, b) => b.value - a.value);

  const total = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* ROW 1: Hero Net Worth + Utility Rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <Card className="h-[320px] flex flex-col justify-between relative overflow-hidden" noPadding>
            <div className="p-6 pb-0 flex justify-between items-start z-10 relative">
              <div>
                <h2 className="text-[13px] text-text-secondary uppercase tracking-wider font-semibold mb-2">Total Net Worth</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-[40px] font-mono text-text-primary tabular-nums tracking-tight">
                    {formatCurrency(total)}
                  </span>
                  <StatusPill label="+12.4%" variant="positive" />
                </div>
              </div>
              <PeriodToggle options={['1W', '1M', '3M', '1Y', 'ALL']} active="1M" onChange={() => {}} />
            </div>
            
            <div className="h-[220px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalNetWorth} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#17171A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F5F7' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={ASSET_COLORS['Equity']} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col justify-center items-center">
             <CalendarIcon className="w-8 h-8 text-text-tertiary mb-3" />
             <div className="text-[15px] text-text-primary font-medium">August 2026</div>
             <div className="text-[13px] text-text-tertiary">3 upcoming SIPs</div>
          </Card>
          <KpiCard 
            title="Monthly Contribution" 
            value={formatCurrency(125000)}
            trend={{ value: 4.2, isPositive: true, label: 'vs last month' }}
          />
        </div>
      </div>

      {/* ROW 2: Allocation, AI, Rebalancer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allocation Donut */}
        <div className="lg:col-span-4">
          <Card className="h-[380px] flex flex-col">
            <SectionHeader title="Asset Allocation" action={<PeriodToggle options={['Live']} active="Live" onChange={() => {}} />} />
            
            <div className="h-[180px] w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={getAssetColor(entry.name)} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#17171A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2.5">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getAssetColor(item.name) }} />
                    <span className="text-text-secondary">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-mono tabular-nums text-text-primary">{formatCurrency(item.value)}</span>
                    <span className="text-[11px] font-mono w-8 text-right text-text-tertiary">{Math.round((item.value / total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Insight Teaser */}
        <div className="lg:col-span-4">
          <Card className="h-[380px] flex flex-col bg-gradient-to-br from-surface to-elevated">
            <SectionHeader title="Virtual CA Insights" />
            <div className="flex-1 flex flex-col gap-4 mt-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[13px] text-text-primary leading-relaxed">
                  "Your equity exposure has drifted 5% above your target threshold due to recent market rallies. Consider booking partial profits in NIFTYBEES to rebalance into Gold."
                </p>
              </div>
              <div className="flex gap-2">
                <StatusPill label="Rebalance: 3 assets" variant="warning" />
                <StatusPill label="Risk: Moderate" variant="neutral" />
              </div>
            </div>
            <div className="mt-auto pt-4 relative">
               <input 
                 type="text"
                 placeholder="Ask your AI CA..."
                 className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50"
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
                 <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
          </Card>
        </div>

        {/* Rebalancer */}
        <div className="lg:col-span-4">
          <Card className="h-[380px] flex flex-col">
            <SectionHeader title="Rebalancer" />
            <div className="flex-1 flex flex-col gap-5 mt-2 overflow-y-auto scrollbar-hide">
              {['Equity', 'Mutual Funds', 'Gold', 'Bonds'].map((asset) => {
                const isOver = asset === 'Equity' || asset === 'Mutual Funds';
                return (
                  <div key={asset}>
                    <div className="flex justify-between text-[12px] mb-2">
                      <span className="text-text-secondary">{asset}</span>
                      <span className="font-mono text-text-primary tabular-nums">
                        {isOver ? '+' : '-'}3.2% drift
                      </span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden flex relative">
                      {/* Target marker */}
                      <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/20 z-10" />
                      <div 
                        className={`h-full ${isOver ? 'bg-warning' : 'bg-primary'}`} 
                        style={{ width: `${isOver ? 53 : 47}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 py-2 bg-primary text-white rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors">
              Review Proposed Trades
            </button>
          </Card>
        </div>
      </div>

      {/* ROW 3: Quick Trade, Trades, Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Trade */}
        <div className="lg:col-span-3">
          <Card className="h-[260px] flex flex-col">
            <SectionHeader title="Quick Trade" />
            <div className="space-y-4 mt-2 flex-1">
              <div>
                <label className="text-[11px] text-text-tertiary uppercase mb-1.5 block">Asset Ticker</label>
                <input 
                  type="text" 
                  value={tradeAsset}
                  onChange={e => setTradeAsset(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-[13px] text-text-primary focus:outline-none focus:border-white/20 uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-tertiary uppercase mb-1.5 block">Amount (₹)</label>
                <input 
                  type="number" 
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-[13px] font-mono tabular-nums text-text-primary focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-1.5 border border-negative/30 bg-negative/10 text-negative rounded-lg text-[13px] font-medium hover:bg-negative/20 transition-colors">Sell</button>
              <button className="py-1.5 bg-positive text-white rounded-lg text-[13px] font-medium hover:bg-positive/90 transition-colors">Buy</button>
            </div>
          </Card>
        </div>

        {/* Recent Trades Table */}
        <div className="lg:col-span-5">
          <Card className="h-[260px] flex flex-col">
            <SectionHeader title="Recent Activity" action={<button className="text-[12px] text-primary hover:underline">View all</button>} />
            <div className="mt-2 flex-1 overflow-y-auto scrollbar-hide -mx-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] text-text-tertiary uppercase">
                    <th className="pb-2 px-2 font-medium">Asset</th>
                    <th className="pb-2 px-2 font-medium">Type</th>
                    <th className="pb-2 px-2 font-medium text-right">Amount</th>
                    <th className="pb-2 px-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {recentTrades.map(trade => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-2.5 px-2 text-text-primary font-medium">{trade.asset}</td>
                      <td className="py-2.5 px-2">
                        <span className={`text-[11px] font-medium ${trade.type === 'BUY' ? 'text-positive' : 'text-negative'}`}>{trade.type}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-text-secondary">{formatCurrency(trade.amount)}</td>
                      <td className="py-2.5 px-2 text-right">
                        <StatusPill label={trade.status} variant={trade.status === 'Executed' ? 'neutral' : 'warning'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Goals Progress Strip */}
        <div className="lg:col-span-4">
          <Card className="h-[260px] flex flex-col">
            <SectionHeader title="Active Goals" action={<button className="text-[12px] text-primary hover:underline">Manage</button>} />
            <div className="mt-2 flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide">
              {goals.map(goal => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div key={goal.name} className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-medium text-text-primary">{goal.name}</span>
                      <span className="text-[12px] font-mono text-text-secondary tabular-nums">{percent}%</span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[11px] font-mono text-text-tertiary tabular-nums">
                      <span>{formatCurrency(goal.current)}</span>
                      <span>{formatCurrency(goal.target)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
