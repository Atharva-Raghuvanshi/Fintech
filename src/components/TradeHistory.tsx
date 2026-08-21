import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { collection, query, orderBy, onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, cn } from '../lib/utils';
import { History, Briefcase, Activity, ArrowUpRight, ArrowDownRight, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

export function TradeHistory() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!user || !db) return;

    // Listen to Trades
    const tradesRef = collection(db, 'users', user.uid, 'trades');
    const q = query(tradesRef, orderBy('timestamp', 'desc'));
    const unsubscribeTrades = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrades(data);
    });

    // Listen to Portfolio
    const portfolioRef = doc(db, 'users', user.uid, 'portfolio', 'main');
    const unsubscribePortfolio = onSnapshot(portfolioRef, (docSnap) => {
      if (docSnap.exists()) {
        setPortfolio(docSnap.data());
      }
    });

    return () => {
      unsubscribeTrades();
      unsubscribePortfolio();
    };
  }, [user]);

  const handleSeedData = async () => {
    if (!user || !db) return;
    setIsSeeding(true);
    try {
      const assets = [
        'AAPL', 'GOOGL', 'TSLA', 'HDFCBANK', 'RELIANCE', 'TCS', 'INFY', // Equity
        'GOLD', 'SGB', // Gold
        'BTC', 'ETH', 'SOL', // Crypto
        'SILVER', // Silver
        'NHAI_BOND', 'GOVT_BOND_10Y', // Bonds
        'PARAGPARIKH', 'QUANT_SMALLCAP', 'NIFTY50_ETF' // Mutual Funds
      ];
      const orderTypes = ['Market', 'Limit'];
      const actions = ['BUY', 'SELL'];

      // Process in batches of 500 max (Firestore batch limit)
      const batch = writeBatch(db);
      
      // Inject base healthy portfolio to ensure ALL categories appear richly
      let newEquity = (portfolio?.equity || 0) + 1200000;
      let newCash = (portfolio?.cash || 0) + 500000;
      let newCrypto = (portfolio?.crypto || 0) + 250000;
      let newGold = (portfolio?.gold || 0) + 300000;
      let newSilver = (portfolio?.silver || 0) + 100000;
      let newBonds = (portfolio?.bonds || 0) + 400000;
      let newMutualFunds = (portfolio?.mutualFunds || 0) + 800000;

      for (let i = 0; i < 200; i++) {
        const tradeRef = doc(collection(db, 'users', user.uid, 'trades'));
        const action = actions[Math.floor(Math.random() * actions.length)];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const price = Math.floor(Math.random() * 5000) + 100;
        const quantity = Math.floor(Math.random() * 50) + 1;
        const amount = price * quantity;
        
        // Random time in the last 90 days
        const timestamp = Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);

        batch.set(tradeRef, {
          userId: user.uid,
          asset,
          action,
          amount,
          price,
          quantity,
          orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
          timestamp,
          consentId: `cons_seed_${Date.now()}_${i}`
        });

        // Simulate portfolio impact roughly
        if (action === 'BUY') {
          newCash -= amount;
          if (['BTC', 'ETH', 'SOL'].includes(asset)) newCrypto += amount;
          else if (['GOLD', 'SGB'].includes(asset)) newGold += amount;
          else if (asset === 'SILVER') newSilver += amount;
          else if (['NHAI_BOND', 'GOVT_BOND_10Y'].includes(asset)) newBonds += amount;
          else if (['PARAGPARIKH', 'QUANT_SMALLCAP', 'NIFTY50_ETF'].includes(asset)) newMutualFunds += amount;
          else newEquity += amount;
        } else {
          newCash += amount;
          if (['BTC', 'ETH', 'SOL'].includes(asset)) newCrypto = Math.max(0, newCrypto - amount);
          else if (['GOLD', 'SGB'].includes(asset)) newGold = Math.max(0, newGold - amount);
          else if (asset === 'SILVER') newSilver = Math.max(0, newSilver - amount);
          else if (['NHAI_BOND', 'GOVT_BOND_10Y'].includes(asset)) newBonds = Math.max(0, newBonds - amount);
          else if (['PARAGPARIKH', 'QUANT_SMALLCAP', 'NIFTY50_ETF'].includes(asset)) newMutualFunds = Math.max(0, newMutualFunds - amount);
          else newEquity = Math.max(0, newEquity - amount);
        }
      }

      // Ensure cash doesn't go negative from random simulation
      newCash = Math.max(10000, newCash);

      // Update portfolio main
      const portfolioRef = doc(db, 'users', user.uid, 'portfolio', 'main');
      batch.set(portfolioRef, {
        userId: user.uid,
        cash: newCash,
        equity: newEquity,
        crypto: newCrypto,
        gold: newGold,
        mutualFunds: newMutualFunds,
        silver: newSilver,
        bonds: newBonds
      }, { merge: true });

      await batch.commit();
      alert('Successfully seeded comprehensive mock portfolio and trades!');
    } catch (e) {
      console.error(e);
      alert('Failed to seed data. See console for details.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Aggregate daily trade volume for chart
  const volumeData = React.useMemo(() => {
    if (!trades.length) return [];
    
    // Sort chronologically for chart
    const chronological = [...trades].sort((a, b) => a.timestamp - b.timestamp);
    const grouped = chronological.reduce((acc, trade) => {
      const date = new Date(trade.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = 0;
      acc[date] += trade.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([date, volume]) => ({ date, volume }));
  }, [trades]);

  const pieData = portfolio ? [
    { name: 'Equity', value: portfolio.equity || 0 },
    { name: 'Mutual Funds', value: portfolio.mutualFunds || 0 },
    { name: 'Gold', value: portfolio.gold || 0 },
    { name: 'Crypto', value: portfolio.crypto || 0 },
    { name: 'Silver', value: portfolio.silver || 0 },
    { name: 'Bonds', value: portfolio.bonds || 0 },
    { name: 'Cash', value: Math.max(0, portfolio.cash || 0) } // Ensure no negative cash display in pie
  ].filter(item => item.value > 0) : [];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            Trade History & Portfolio
          </h1>
          <p className="text-slate-500 mt-1">Real-time synchronized data backed by ACID transactions.</p>
        </div>
        <button
          onClick={handleSeedData}
          disabled={isSeeding}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <Database className="w-4 h-4" />
          {isSeeding ? 'Seeding...' : 'Seed 200 Mock Trades'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Current Portfolio</h3>
          </div>
          
          {portfolio ? (
            <div className="space-y-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {pieData.map((asset, i) => (
                  <div key={asset.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600">{asset.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{formatCurrency(asset.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 py-10 text-center">
              No portfolio data. Execute a trade to initialize.
            </div>
          )}
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Trading Volume</h3>
            </div>
          </div>
          
          <div className="h-[300px] w-full mt-4">
            {volumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${(val/1000)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                Execute trades to see activity volume.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Synchronized Ledger</h3>
          <p className="text-sm text-slate-500 mt-1">Globally consistent transaction history.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium text-right">Qty & Price</th>
                <th className="px-6 py-4 font-medium text-right">Total Value</th>
                <th className="px-6 py-4 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                    {new Date(trade.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {trade.asset}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider",
                      trade.action === 'BUY' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {trade.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-slate-700">{trade.quantity} @ {formatCurrency(trade.price)}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(trade.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {trade.orderType}
                    </span>
                  </td>
                </tr>
              ))}
              
              {trades.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
