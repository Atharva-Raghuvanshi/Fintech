import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ReferenceLine } from 'recharts';
import { ArrowUpRight, TrendingUp, Zap, Calendar as CalendarIcon, Target, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { historicalNetWorth } from '../data';
import type { Portfolio } from '../types';
import { Card, SectionHeader, KpiCard, StatusPill, PeriodToggle } from './ui/Card';
import { insertAppData } from '../lib/supabaseActions';
import { useAuth } from '../contexts/AuthContext';
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

const generateNetWorthData = (period: string, currentTotal: number) => {
  const now = new Date();
  const data = [];
  let points = 12;
  let startValue = 4200000;
  let volatility = 100000;
  let trend = 50000;

  if (period === '1W') { points = 7; startValue = currentTotal * 0.98; volatility = 50000; trend = 30000; }
  else if (period === '1M') { points = 30; startValue = currentTotal * 0.92; volatility = 80000; trend = 20000; }
  else if (period === '3M') { points = 90; startValue = currentTotal * 0.85; volatility = 100000; trend = 25000; }
  else if (period === '1Y') { points = 12; startValue = currentTotal * 0.70; volatility = 150000; trend = 100000; }
  else if (period === 'ALL') { points = 60; startValue = currentTotal * 0.30; volatility = 300000; trend = 80000; }

  let currentVal = startValue;
  for (let i = 0; i < points; i++) {
    const d = new Date(now);
    let dateStr = '';
    
    if (period === '1W' || period === '1M' || period === '3M') {
      d.setDate(d.getDate() - (points - 1 - i));
      dateStr = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    } else if (period === '1Y') {
      d.setMonth(d.getMonth() - (points - 1 - i));
      dateStr = `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().substr(2,2)}`;
    } else if (period === 'ALL') {
      d.setMonth(d.getMonth() - (points - 1 - i));
      dateStr = `${d.getFullYear()}`;
    }

    data.push({
      date: dateStr,
      value: Math.round(currentVal)
    });
    currentVal += trend + (Math.random() - 0.4) * volatility;
  }
  
  // Tie the final data point to the exact current portfolio value
  data[data.length - 1].value = currentTotal;
  return data;
};

export function Dashboard() {
  const [heroPeriod, setHeroPeriod] = useState('1M');
  const [tradeAsset, setTradeAsset] = useState('NIFTYBEES');
  const [tradeAmount, setTradeAmount] = useState('10000');

  const { user } = useAuth();
  const [isTrading, setIsTrading] = useState(false);

  const handleQuickTrade = async (action: 'BUY' | 'SELL') => {
    if (!user || !tradeAsset || !tradeAmount) return;
    setIsTrading(true);
    try {
      await insertAppData({
        user_id: user.uid,
        type: action,
        asset: tradeAsset,
        amount: Number(tradeAmount),
        order_type: 'Market',
        source: 'Quick Trade'
      });
      // Optionally reset
      setTradeAmount('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsTrading(false);
    }
  };

  
  const pieData = Object.entries(mockPortfolio)
    .filter(([key, val]) => key !== 'totalNetWorth' && typeof val === 'number' && val > 0)
    .map(([key, val]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      value: val as number
    }))
    .sort((a, b) => b.value - a.value);

  const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
  const chartData = React.useMemo(() => generateNetWorthData(heroPeriod, total), [heroPeriod, total]);

  const LiveBadge = () => (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
      <span className="text-[9px] text-text-secondary uppercase tracking-wider font-medium">Live</span>
    </div>
  );

  return (
    <div className="h-full grid grid-rows-3 gap-4 overflow-hidden pb-2">
      {/* ROW 1: Hero Net Worth + Utility Rail */}
      <div className="min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-4">
        <motion.div 
          className="xl:col-span-12 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
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
              <PeriodToggle options={['1W', '1M', '3M', '1Y', 'ALL']} active={heroPeriod} onChange={setHeroPeriod} />
            </div>
            
            <div className="flex-1 w-full min-h-0 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={ASSET_COLORS['Equity']} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={8} minTickGap={20} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(val) => `${(val/100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#17171A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#F5F5F7' }}
                  />
                  <ReferenceLine 
                    y={6000000} 
                    stroke="#6B7280" 
                    strokeDasharray="4 4" 
                    label={{ position: 'insideTopLeft', value: 'Target: ₹60L', fill: '#9CA3AF', fontSize: 10 }} 
                  />
                  <Area 
                    isAnimationActive={true}
                    animationDuration={1500}
                    type="monotone" 
                    dataKey="value" 
                    stroke={ASSET_COLORS['Equity']} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#17171A', stroke: ASSET_COLORS['Equity'], strokeWidth: 1.5 }}
                    activeDot={{ r: 4, fill: '#17171A', stroke: ASSET_COLORS['Equity'], strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        </div>

      {/* ROW 2: Allocation, AI, Rebalancer */}
      <div className="min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Allocation Donut */}
        <motion.div 
          className="lg:col-span-4 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <Card className="h-full flex flex-col p-4">
            <SectionHeader title="Asset Allocation" action={<LiveBadge />} />
            
            <div className="flex-1 flex items-center min-h-0 mt-2 overflow-hidden gap-4">
              <div className="w-[120px] h-[120px] shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      isAnimationActive={true}
                      animationDuration={1000}
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
        </motion.div>

        {/* AI Insight Teaser */}
        <motion.div 
          className="lg:col-span-4 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
        >
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
        </motion.div>

        {/* Rebalancer */}
        <motion.div 
          className="lg:col-span-4 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
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
                      <div className="absolute top-[-2px] bottom-[-2px] w-0.5 bg-surface z-10 rounded-full" style={{ left: `${data.target}%` }} />
                      
                      {/* Current bar */}
                      <div 
                        className={`h-full rounded-full ${isOver ? 'bg-primary' : 'bg-white/40'}`} 
                        style={{ width: `${data.current}%` }} 
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
        </motion.div>
      </div>

      {/* ROW 3: Quick Trade, Trades, Goals */}
      <div className="min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Trade */}
        <motion.div 
          className="lg:col-span-3 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
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
              <motion.button 
    whileHover={{ scale: 1.05, rotate: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300 }}
    onClick={() => handleQuickTrade('SELL')}
    disabled={isTrading}
    className="py-1 border border-negative/30 bg-negative/10 text-negative rounded-md text-[12px] font-medium hover:bg-negative/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
  >
    {isTrading && <div className="w-3 h-3 rounded-full border-2 border-negative border-t-transparent animate-spin" />}
    Sell
  </motion.button>
              <motion.button 
    whileHover={{ scale: 1.05, rotate: 2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300 }}
    onClick={() => handleQuickTrade('BUY')}
    disabled={isTrading}
    className="py-1 bg-positive/90 text-white rounded-md text-[12px] font-medium hover:bg-positive transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
  >
    {isTrading && <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
    Buy
  </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Recent Trades Table */}
        <motion.div 
          className="lg:col-span-5 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.25 }}
        >
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
                        <span className={`text-[10px] font-medium ${trade.type === 'BUY' ? 'text-positive' : 'text-negative'}`}>{trade.type}</span>
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
        </motion.div>

        {/* Goals Progress Strip */}
        <motion.div 
          className="lg:col-span-4 h-full min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
        >
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
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
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
        </motion.div>
      </div>
    </div>
  );
}
