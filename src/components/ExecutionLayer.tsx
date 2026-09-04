import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, ComposedChart, Area, ReferenceLine 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Activity, BarChart2, ShieldCheck, 
  Lock, CheckCircle2, Sliders, List, Zap, TrendingUp, TrendingDown,
  Layers, Clock, Crosshair, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import type { Portfolio, AuditLogEntry } from '../types';
import { doc, runTransaction, collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { insertAppData } from '../lib/supabaseActions';


// Mock Data Generators
const generateChartData = (volatility: number = 10, trend: number = 0) => {
  let basePrice = 1500;
  const data = [];
  for (let i = 0; i < 60; i++) {
    basePrice += (Math.random() - 0.5 + trend) * volatility;
    const ma20 = basePrice - (Math.random() * (volatility/2));
    const rsi = 30 + Math.random() * 40;
    const volume = Math.random() * 10000;
    data.push({
      time: `10:${i.toString().padStart(2, '0')}`,
      price: Number(basePrice.toFixed(2)),
      ma20: Number(ma20.toFixed(2)),
      rsi: Number(rsi.toFixed(2)),
      volume: Math.floor(volume),
    });
  }
  return data;
};

const mockMarketDepth = {
  bids: [
    { price: 1499.5, qty: 500, orders: 12 },
    { price: 1499.0, qty: 1200, orders: 45 },
    { price: 1498.5, qty: 800, orders: 18 },
    { price: 1498.0, qty: 2500, orders: 89 },
    { price: 1497.5, qty: 150, orders: 4 },
  ],
  asks: [
    { price: 1500.5, qty: 400, orders: 15 },
    { price: 1501.0, qty: 1800, orders: 60 },
    { price: 1501.5, qty: 650, orders: 22 },
    { price: 1502.0, qty: 3200, orders: 110 },
    { price: 1502.5, qty: 900, orders: 35 },
  ]
};

const ASSET_CLASSES = ['Stocks', 'F&O', 'Gold', 'Silver', 'Crypto', 'ETFs', 'Mutual Funds', 'Bonds', 'Forex'];
const ORDER_TYPES = ['Market', 'Limit', 'SL', 'Bracket', 'GTT'];
const INDICATORS = ['MA', 'RSI', 'MACD', 'Volume'];

export function ExecutionLayer() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  
  const [activeAssetClass, setActiveAssetClass] = useState('Stocks');
  const [activeAsset, setActiveAsset] = useState('RELIANCE.NS');
  
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState('Market');
  const [quantity, setQuantity] = useState('10');
  const [price, setPrice] = useState('1500.00');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['MA', 'Volume']);
  
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);

  const chartData = useMemo(() => generateChartData(activeAssetClass === 'Crypto' ? 30 : 10), [activeAssetClass, activeAsset]);
  const currentPrice = chartData[chartData.length - 1].price;
  const dayChange = currentPrice - chartData[0].price;
  const dayChangePct = (dayChange / chartData[0].price) * 100;

  useEffect(() => {
    if (!user) return;
    const portfolioRef = doc(db, "users", user.uid, "portfolio", "main");
    const unsub = onSnapshot(portfolioRef, (snap) => {
      if (snap.exists()) setPortfolio(snap.data() as Portfolio);
      else {
        // Initialize from mock if not exists
        fetch("/api/portfolio").then(r => r.json()).then(data => setPortfolio(data));
      }
    });
    fetch("/api/audit-log").then(res => res.json()).then(data => setAuditLog(data));
    return () => unsub();
  }, [user]);

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolio || !user) return;
    setStatus({ type: "loading", msg: "Executing ACID Transaction..." });



    
    const totalAmount = Number(quantity) * (orderType === "Market" ? currentPrice : Number(price));
    try {
      await insertAppData({
        user_id: user.uid,
        type: action,
        asset: activeAsset,
        amount: totalAmount,
        order_type: orderType,
        quantity: Number(quantity),
        price: orderType === "Market" ? currentPrice : Number(price)
      });
    } catch (e) {
      console.error("Supabase insert failed", e);
    }
    try {
      await runTransaction(db, async (transaction) => {
        const portfolioRef = doc(db, "users", user.uid, "portfolio", "main");
        const portfolioDoc = await transaction.get(portfolioRef);
        
        let currentCash = portfolio.cash;
        if (portfolioDoc.exists()) {
          currentCash = portfolioDoc.data().cash;
        }
        
        if (action === "BUY" && currentCash < totalAmount) {
          throw new Error("Insufficient margin for this transaction.");
        }
        
        const newCash = action === "BUY" ? currentCash - totalAmount : currentCash + totalAmount;
        const assetKey = activeAssetClass === "Crypto" ? "crypto" : activeAssetClass === "Gold" ? "gold" : activeAssetClass === "Silver" ? "silver" : activeAssetClass === "Mutual Funds" ? "mutualFunds" : activeAssetClass === "Bonds" ? "bonds" : "equity";
        
        let currentAssetVal = portfolioDoc.exists() ? (portfolioDoc.data()[assetKey] || 0) : ((portfolio as any)[assetKey] || 0);
        const newAssetVal = action === "BUY" ? currentAssetVal + totalAmount : Math.max(0, currentAssetVal - totalAmount);
        
        const newPortfolioData = {
          userId: user.uid,
          cash: newCash,
          equity: assetKey === "equity" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().equity || 0 : portfolio.equity || 0),
          mutualFunds: assetKey === "mutualFunds" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().mutualFunds || 0 : portfolio.mutualFunds || 0),
          gold: assetKey === "gold" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().gold || 0 : portfolio.gold || 0),
          crypto: assetKey === "crypto" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().crypto || 0 : 0),
          silver: assetKey === "silver" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().silver || 0 : 0),
          bonds: assetKey === "bonds" ? newAssetVal : (portfolioDoc.exists() ? portfolioDoc.data().bonds || 0 : 0),
        };
        
        transaction.set(portfolioRef, newPortfolioData, { merge: true });
        
        const tradeRef = doc(collection(db, "users", user.uid, "trades"));
        transaction.set(tradeRef, {
          userId: user.uid,
          asset: activeAsset,
          action,
          amount: totalAmount,
          price: orderType === "Market" ? currentPrice : Number(price),
          quantity: Number(quantity),
          orderType,
          timestamp: Date.now(),
          consentId: `cons_${orderType.toLowerCase()}_${Date.now()}`
        });
      });
      setStatus({ type: "success", msg: `${orderType} ${action} order placed successfully with ACID guarantees.` });
      // Note: Component state updates will occur via the onSnapshot listener if added, 
      // but for immediate feedback we rely on local state updates if needed, though here we just rely on standard fetching for now.
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Execution failed." });
    } finally {
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const toggleIndicator = (ind: string) => {
    setActiveIndicators(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  const requiredMargin = Number(quantity) * (orderType === 'Market' ? currentPrice : Number(price));
  const availableMargin = portfolio?.cash || 0;
  const marginUtilizedPct = portfolio ? Math.min((requiredMargin / availableMargin) * 100, 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-400" />
          Pro Trading Terminal
        </h1>
        <p className="text-slate-400 mt-1">Advanced execution layer with Level 2 market data, multi-asset routing, and risk management.</p>
      </div>

      {/* Asset Class Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {ASSET_CLASSES.map(ac => (
          <button
            key={ac}
            onClick={() => setActiveAssetClass(ac)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
              activeAssetClass === ac 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-surface text-slate-600 border-white/10 hover:bg-white/5"
            )}
          >
            {ac}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT/CENTER COLUMN: Chart & Market Depth */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main Chart Module */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="glass-panel overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{activeAsset}</h2>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-slate-600">{activeAssetClass}</span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-bold text-white">{currentPrice.toFixed(2)}</span>
                  <span className={cn("flex items-center text-sm font-semibold", dayChange >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {dayChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(dayChange).toFixed(2)} ({Math.abs(dayChangePct).toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              {/* Chart Controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white/10 p-1 rounded-lg">
                  {INDICATORS.map(ind => (
                    <button
                      key={ind}
                      onClick={() => toggleIndicator(ind)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        activeIndicators.includes(ind) ? "bg-surface text-indigo-300 shadow-md shadow-black/20" : "text-slate-400 hover:text-slate-700"
                      )}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} minTickGap={30} />
                  <YAxis yAxisId="price" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} orientation="right" />
                  
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  />
                  
                  <Line isAnimationActive={true} animationDuration={1500} yAxisId="price" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  
                  {activeIndicators.includes('MA') && (
                    <Line isAnimationActive={true} animationDuration={1500} yAxisId="price" type="monotone" dataKey="ma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                  )}
                  
                  {activeIndicators.includes('Volume') && (
                    <YAxis yAxisId="vol" domain={[0, 'dataMax * 5']} hide />
                  )}
                  {activeIndicators.includes('Volume') && (
                    <Bar isAnimationActive={true} animationDuration={1500} yAxisId="vol" dataKey="volume" fill="#e2e8f0" opacity={0.5} />
                  )}
                  
                  {activeIndicators.includes('RSI') && (
                    <YAxis yAxisId="rsi" domain={[0, 100]} hide />
                  )}
                  {activeIndicators.includes('RSI') && (
                    <Line isAnimationActive={true} animationDuration={1500} yAxisId="rsi" type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Market Depth & Risk Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Market Depth (Level 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
              className="glass-panel overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-300 text-sm">Market Depth (Level 2)</h3>
              </div>
              <div className="flex divide-x divide-slate-100">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-slate-50">
                    <span>Bid</span>
                    <span>Qty</span>
                  </div>
                  {mockMarketDepth.bids.map((bid, i) => (
                    <div key={i} className="flex justify-between px-4 py-1.5 text-xs hover:bg-emerald-500/10 relative group">
                      <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/20/50" style={{ width: `${(bid.qty / 3000) * 100}%` }}></div>
                      <span className="text-emerald-400 font-medium relative z-10">{bid.price.toFixed(2)}</span>
                      <span className="text-slate-600 relative z-10">{bid.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-slate-50">
                    <span>Ask</span>
                    <span>Qty</span>
                  </div>
                  {mockMarketDepth.asks.map((ask, i) => (
                    <div key={i} className="flex justify-between px-4 py-1.5 text-xs hover:bg-rose-500/10 relative group">
                      <div className="absolute right-0 top-0 bottom-0 bg-rose-500/20/50" style={{ width: `${(ask.qty / 4000) * 100}%` }}></div>
                      <span className="text-rose-400 font-medium relative z-10">{ask.price.toFixed(2)}</span>
                      <span className="text-slate-600 relative z-10">{ask.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Live Portfolio Risk */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="glass-panel p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-300 text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Portfolio Risk & Margin
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Available Margin</span>
                      <span className="font-bold text-white">{formatCurrency(availableMargin)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Margin Required</span>
                      <span className="font-medium text-white">{formatCurrency(requiredMargin)}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", marginUtilizedPct > 80 ? "bg-rose-500" : marginUtilizedPct > 50 ? "bg-amber-500" : "bg-indigo-500")}
                        style={{ width: `${marginUtilizedPct}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-right">{marginUtilizedPct.toFixed(1)}% utilized</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-lg mt-4 flex items-start gap-2 border border-indigo-100">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-200 leading-relaxed">
                  GTT and Bracket orders require 15% span margin. Real-time monitoring active.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* RIGHT COLUMN: Order Entry Module */}
        <div className="xl:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.25 }}
            className="glass-panel sticky top-6"
          >
            <div className="flex border-b border-white/5 p-2 gap-2 bg-slate-50/50 rounded-t-xl">
              <motion.button 
                whileHover={{ scale: 1.02, rotate: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAction('BUY')}
                className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors", action === 'BUY' ? "bg-emerald-500 text-white shadow-md shadow-black/20" : "bg-transparent text-slate-400 hover:bg-white/10")}
              >
                BUY
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAction('SELL')}
                className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-colors", action === 'SELL' ? "bg-rose-500 text-white shadow-md shadow-black/20" : "bg-transparent text-slate-400 hover:bg-white/10")}
              >
                SELL
              </motion.button>
            </div>

            <form onSubmit={handleExecute} className="p-5 space-y-5">
              {/* Asset Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instrument</label>
                <input
                  type="text"
                  value={activeAsset}
                  onChange={(e) => setActiveAsset(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Order Types */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {ORDER_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={cn(
                        "py-1.5 text-xs font-medium rounded-md border transition-colors",
                        orderType === type 
                          ? (action === 'BUY' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20")
                          : "bg-surface text-slate-600 border-white/10 hover:bg-white/5"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Qty</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price</label>
                  <input
                    type="number"
                    value={orderType === 'Market' ? currentPrice : price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={orderType === 'Market'}
                    className={cn("w-full border-white/10 rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-indigo-500 focus:outline-none", orderType === 'Market' && "bg-white/10 text-slate-400")}
                    step="0.05"
                  />
                </div>
              </div>

              {/* Advanced Fields (SL/Bracket/GTT) */}
              <AnimatePresence>
                {(orderType === 'SL' || orderType === 'Bracket' || orderType === 'GTT') && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden pt-1"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Crosshair className="w-3 h-3"/> Trigger Price</label>
                        <input
                          type="number"
                          value={triggerPrice}
                          onChange={(e) => setTriggerPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border"
                        />
                      </div>
                      {(orderType === 'Bracket') && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target</label>
                          <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none border"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Alert */}
              <AnimatePresence>
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={cn(
                      "p-3 rounded-lg text-xs font-medium flex items-start gap-2",
                      status.type === 'success' ? "bg-emerald-500/10 text-emerald-400" : 
                      status.type === 'loading' ? "bg-indigo-500/10 text-indigo-300" : "bg-rose-500/10 text-rose-400"
                    )}
                  >
                    {status.type === 'loading' ? <Clock className="w-4 h-4 animate-spin shrink-0" /> : 
                     status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, rotate: (action === 'BUY' ? -1 : 1) }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  type="submit"
                  disabled={status?.type === 'loading'}
                  className={cn(
                    "w-full py-3.5 rounded-lg text-white font-bold tracking-wide transition-all shadow-md flex justify-center items-center gap-2",
                    action === 'BUY' 
                      ? "bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/20" 
                      : "bg-rose-500 hover:bg-rose-600 hover:shadow-rose-500/20",
                    status?.type === 'loading' && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {status?.type === 'loading' ? 'PROCESSING...' : `${action} ${activeAsset}`}
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Encrypted & routed to direct market access.</span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
