import fs from 'fs';

const content = `import React, { useState } from 'react';
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
  { id: 4, asset: 'HDFCBANK', type: 'BUY', amount: 75000, date: '2026-08-15', status: 'Executed' },
];

const goals = [
  { name: 'Vacation Fund', target: 500000, current: 310000 },
  { name: 'Retirement', target: 50000000, current: 9000000 },
];

const rebalanceData = [
  { asset: 'Equity', target: 40, current: 43.2 },
  { asset: 'Mutual Funds', target: 30, current: 26.8 },
  { asset: 'Gold', target: 10, current: 8.1 },
  { asset: 'Bonds', target: 20, current: 21.9 },
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

  const LiveBadge = () => (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
      <span className="text-[9px] text-text-secondary uppercase tracking-wider font-medium">Live</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden pb-2">
      {/* ROW 1: Hero Net Worth + Utility Rail */}
      <div className="flex-[0.35] min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-9 h-full min-h-0">
          <Card className="h-full flex flex-col justify-between relative overflow-hidden" noPadding>
            <div className="p-4 pb-0 flex justify-between items-start z-10 relative shrink-0">
              <div>
                <h2 className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Total Net Worth</h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-[32px] font-mono text-text-primary tabular-nums tracking-tight">
                    {formatCurrency(total)}
                  </span>
                  <StatusPill label="+12.4%" variant="positive" />
                </div>
              </div>
              <PeriodToggle options={['1W', '1M', '3M', '1Y', 'ALL']} active="1M" onChange={() => {}} />
            </div>
            
            <div className="flex-1 w-full min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalNetWorth} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(val) => \`\${(val/100000).toFixed(0)}L\`} axisLine={false} tickLine={false} />
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
                    activeDot={{ r: 4, fill: '#17171A', stroke: ASSET_COLORS['Equity'], strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="xl:col-span-3 h-full min-h-0 flex flex-col gap-4">
          <Card className="flex-[0.6] min-h-0 flex flex-col justify-between p-4">
            <h4 className="text-[13px] text-text-secondary font-medium">Monthly Contrib</h4>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[24px] font-mono text-text-primary tabular-nums tracking-tight">{formatCurrency(125000)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StatusPill label="+4.2%" variant="positive" />
                <span className="text-[11px] text-text-tertiary">vs last mo</span>
              </div>
            </div>
            <div className="h-10 mt-3 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalNetWorth.slice(-6)}>
                  <Area type="step" dataKey="value" stroke={ASSET_COLORS['Cash']} fill={ASSET_COLORS['Cash']} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="flex-[0.4] min-h-0 flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <div>
                <div className="text-[12px] text-text-primary font-medium">Next SIP in 3d</div>
                <div className="text-[11px] text-text-tertiary">{formatCurrency(25000)} total</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ROW 2: Allocation, AI, Rebalancer */}
      <div className="flex-[0.35] min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Allocation Donut */}
        <div className="lg:col-span-4 h-full min-h-0">
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Asset Allocation" action={<LiveBadge />} />
            
            <div className="flex-1 flex items-center min-h-0 mt-2 overflow-hidden gap-4">
              <div className="w-[120px] h-[120px] shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={45}
                      outerRadius={60}
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
                      contentStyle={{ backgroundColor: '#17171A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', padding: '4px 8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-1 min-h-0 h-full">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAssetColor(item.name) }} />
                      <span className="text-text-secondary truncate max-w-[70px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono tabular-nums text-text-primary">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insight Teaser */}
        <div className="lg:col-span-4 h-full min-h-0">
          <Card className="h-full flex flex-col bg-gradient-to-br from-surface to-elevated p-4">
            <SectionHeader title="Virtual CA Insights" />
            <div className="flex-1 flex flex-col gap-3 mt-1 min-h-0">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex-1 overflow-y-auto scrollbar-hide">
                <p className="text-[12px] text-text-primary leading-relaxed">
                  "Your equity exposure has drifted above target threshold due to recent market rallies. Consider booking partial profits in NIFTYBEES to rebalance into Gold."
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <StatusPill label="Rebalance: 3 assets" variant="warning" />
                <StatusPill label="Risk: Moderate" variant="neutral" />
              </div>
            </div>
            <div className="mt-3 relative shrink-0">
               <input 
                 type="text"
                 placeholder="Ask your AI CA..."
                 className="w-full bg-black/40 border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
                 <ArrowUpRight className="w-3.5 h-3.5" />
               </button>
            </div>
          </Card>
        </div>

        {/* Rebalancer */}
        <div className="lg:col-span-4 h-full min-h-0">
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Rebalancer" />
            <div className="flex-1 flex flex-col gap-3 mt-1 overflow-y-auto scrollbar-hide min-h-0">
              {rebalanceData.map((data) => {
                const diff = (data.current - data.target).toFixed(1);
                const isOver = data.current > data.target;
                return (
                  <div key={data.asset}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-text-secondary">{data.asset}</span>
                      <span className="font-mono text-text-primary tabular-nums">
                        {isOver ? '+' : ''}{diff}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-black/40 rounded-full flex relative border border-white/5">
                      {/* Target marker (vertical white line) */}
                      <div className="absolute top-[-2px] bottom-[-2px] w-0.5 bg-white z-10 rounded-full" style={{ left: \`\${data.target}%\` }} />
                      
                      {/* Current bar */}
                      <div 
                        className={\`h-full rounded-full \${isOver ? 'bg-primary' : 'bg-text-tertiary'}\`} 
                        style={{ width: \`\${data.current}%\` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[12px] font-medium hover:bg-primary hover:text-white transition-colors shrink-0">
              Review Proposed Trades
            </button>
          </Card>
        </div>
      </div>

      {/* ROW 3: Quick Trade, Trades, Goals */}
      <div className="flex-[0.3] min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Trade */}
        <div className="lg:col-span-3 h-full min-h-0">
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Quick Trade" />
            <div className="space-y-3 mt-1 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              <div>
                <label className="text-[10px] text-text-tertiary uppercase mb-1 block">Asset Ticker</label>
                <input 
                  type="text" 
                  value={tradeAsset}
                  onChange={e => setTradeAsset(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-md px-2.5 py-1 text-[12px] text-text-primary focus:outline-none focus:border-white/20 uppercase"
                />
              </div>
              <div>
                <label className="text-[10px] text-text-tertiary uppercase mb-1 block">Amount (₹)</label>
                <input 
                  type="number" 
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-md px-2.5 py-1 text-[12px] font-mono tabular-nums text-text-primary focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 shrink-0">
              <button className="py-1 border border-negative/30 bg-negative/10 text-negative rounded-md text-[12px] font-medium hover:bg-negative/20 transition-colors">Sell</button>
              <button className="py-1 bg-positive/90 text-white rounded-md text-[12px] font-medium hover:bg-positive transition-colors">Buy</button>
            </div>
          </Card>
        </div>

        {/* Recent Trades Table */}
        <div className="lg:col-span-5 h-full min-h-0">
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Recent Activity" action={<button className="text-[11px] text-primary hover:underline">View all</button>} />
            <div className="mt-1 flex-1 overflow-y-auto scrollbar-hide -mx-2 min-h-0">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-white/5 text-[10px] text-text-tertiary uppercase">
                    <th className="pb-1.5 px-2 font-medium">Asset</th>
                    <th className="pb-1.5 px-2 font-medium">Type</th>
                    <th className="pb-1.5 px-2 font-medium text-right">Amount</th>
                    <th className="pb-1.5 px-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {recentTrades.map(trade => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-2 px-2 text-text-primary font-medium">{trade.asset}</td>
                      <td className="py-2 px-2">
                        <span className={\`text-[10px] font-medium \${trade.type === 'BUY' ? 'text-positive' : 'text-negative'}\`}>{trade.type}</span>
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums text-text-secondary">{formatCurrency(trade.amount)}</td>
                      <td className="py-2 px-2 text-right">
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
        <div className="lg:col-span-4 h-full min-h-0">
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Active Goals" action={<button className="text-[11px] text-primary hover:underline">Manage</button>} />
            <div className="mt-1 flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hide min-h-0 pr-1">
              {goals.map(goal => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div key={goal.name} className="p-2 bg-white/5 rounded-lg border border-white/5 shrink-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[12px] font-medium text-text-primary">{goal.name}</span>
                      <span className="text-[11px] font-mono text-text-secondary tabular-nums">{percent}%</span>
                    </div>
                    <div className="h-1 bg-black/40 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-primary rounded-full" style={{ width: \`\${percent}%\` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-text-tertiary tabular-nums">
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
`;

fs.writeFileSync('src/components/Dashboard.tsx', content);
