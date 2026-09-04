import React, { useState, useEffect } from 'react';
import { 
  Landmark, CreditCard, Building2, Plus, CheckCircle2, X, Calculator, 
  TrendingDown, Repeat, Trash2, Send, Smartphone, Shield, AlertTriangle, 
  Wallet, PieChart as PieChartIcon, Activity, Lock, Unlock, Settings,
  ArrowRight, ArrowUpRight, ArrowDownRight, Fingerprint, Sparkles, FileText,
  BadgePercent, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

export function BankTransactions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Accounts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const TABS = ['Accounts', 'Transfers & Bills', 'Card Control', 'Credit & EMI', 'Security & Health'];

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse text-indigo-400">
          <Landmark className="w-10 h-10 mb-4" />
          <h2 className="text-xl font-bold">Connecting to Banking Core...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-400" />
            Core Banking & Credit Suite
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl">
            Unified accounts, instant transfers, smart credit controls, and comprehensive financial health tracking.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
              activeTab === tab 
                ? "border-indigo-600 text-indigo-300" 
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Accounts' && <AccountsTab />}
            {activeTab === 'Transfers & Bills' && <TransfersTab />}
            {activeTab === 'Card Control' && <CardsTab />}
            {activeTab === 'Credit & EMI' && <CreditTab />}
            {activeTab === 'Security & Health' && <SecurityHealthTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// 1. ACCOUNTS DASHBOARD
// ==========================================
function AccountsTab() {
  const accounts = [
    { type: 'Savings', bank: 'HDFC Bank', balance: 450250.00, acct: '**** 4432', change: '+2.4%' },
    { type: 'Current', bank: 'ICICI Bank', balance: 125400.50, acct: '**** 9901', change: '-1.2%' },
  ];

  const creditAccount = { limit: 500000, used: 124500, available: 375500 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="font-bold text-slate-300 text-lg">Unified Accounts Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc, i) => (
            <div key={i} className="bg-surface rounded-xl border border-white/10 p-5 shadow-md shadow-black/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{acc.type} Account</p>
                  <p className="font-semibold text-white mt-1">{acc.bank}</p>
                </div>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Building2 className="w-5 h-5"/></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatCurrency(acc.balance)}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs font-mono text-slate-400">{acc.acct}</p>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", acc.change.startsWith('+') ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400")}>
                    {acc.change} This Month
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-xl border border-white/10 p-6 shadow-md shadow-black/20">
          <h3 className="font-bold text-slate-300 mb-4">Credit Utilization Overview</h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-32 h-32 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie isAnimationActive={true} animationDuration={1500}
                    data={[{value: creditAccount.used, fill: '#6366f1'}, {value: creditAccount.available, fill: '#e2e8f0'}]}
                    innerRadius={45} outerRadius={60}
                    dataKey="value" stroke="none"
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{Math.round((creditAccount.used/creditAccount.limit)*100)}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Limit</p>
                  <p className="font-bold text-white">{formatCurrency(creditAccount.limit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Available</p>
                  <p className="font-bold text-emerald-400">{formatCurrency(creditAccount.available)}</p>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-slate-600">Your credit utilization is healthy. Keeping it below 30% improves your credit score over time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet className="w-32 h-32" /></div>
          <h3 className="font-semibold text-slate-300 text-sm">Net Worth</h3>
          <p className="text-3xl font-bold mt-2">₹48,25,000</p>
          <div className="mt-8 space-y-3 relative z-10">
            <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
              <span className="text-slate-400">Total Assets</span>
              <span className="font-medium">₹54,00,000</span>
            </div>
            <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
              <span className="text-slate-400">Total Liabilities</span>
              <span className="font-medium text-rose-400">-₹5,75,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. TRANSFERS & BILLS
// ==========================================
function TransfersTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h3 className="font-bold text-slate-300 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-400" /> Instant Money Transfers
          </h3>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">UPI & IMPS</span>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Send To (UPI ID / Account / Phone)</label>
            <input type="text" placeholder="e.g. user@okhdfcbank or 9876543210" className="w-full border-slate-300 rounded-lg p-3 text-sm border focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input type="number" placeholder="0.00" className="w-full border-slate-300 rounded-lg p-3 pl-8 text-lg font-bold border focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Pay From</label>
            <select className="w-full border-slate-300 rounded-lg p-3 text-sm border focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option>HDFC Bank Savings (**** 4432)</option>
              <option>ICICI Bank Current (**** 9901)</option>
            </select>
          </div>
          <button className="w-full glass-button-amber text-amber-500 font-bold text-white font-bold py-3.5 rounded-lg shadow-md shadow-black/20 transition-colors">
            Send Money Securely
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/5">
          <h3 className="font-bold text-slate-300 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-amber-500" /> Smart Bill Payments
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { icon: Smartphone, name: 'Airtel Postpaid', amount: 899, due: 'Due in 2 days', urgent: true },
              { icon: Zap, name: 'Tata Power', amount: 3450, due: 'Due in 12 days', urgent: false },
              { icon: Shield, name: 'LIC Insurance', amount: 12500, due: 'Auto-pay active', urgent: false },
            ].map((bill, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-surface hover:border-indigo-500/20 hover:shadow-md shadow-black/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                    <bill.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{bill.name}</p>
                    <p className={cn("text-xs font-medium", bill.urgent ? "text-rose-500" : "text-slate-400")}>{bill.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">₹{bill.amount}</p>
                  <button className="text-xs font-bold text-indigo-400 hover:text-indigo-200 mt-1 uppercase tracking-wider">Pay Now</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 border border-dashed border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white/5 transition-colors">
            + Add New Biller
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CARD CONTROL HUB
// ==========================================
function CardsTab() {
  const [frozen, setFrozen] = useState(false);
  const [intEnabled, setIntEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-slate-300 text-lg">Card Control Hub</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Visuals */}
        <div className="lg:col-span-1 space-y-6">
          <div className={cn("relative rounded-2xl p-6 text-white shadow-xl overflow-hidden transition-all duration-500", frozen ? "bg-slate-800" : "bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-600")}>
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none"><circle cx="40" cy="20" r="20" fill="white"/><circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.5"/></svg>
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="font-mono tracking-widest text-indigo-200">PLATINUM</span>
              {frozen && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Lock className="w-3 h-3"/> FROZEN</span>}
            </div>
            <div className="font-mono text-xl tracking-[0.2em] mb-2 relative z-10 opacity-90">
              4532  88XX  XX90  1204
            </div>
            <div className="flex justify-between text-xs font-mono opacity-80 relative z-10">
              <span>ATHARVA R</span>
              <span>12/28</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setFrozen(!frozen)} className="p-4 rounded-xl border border-white/10 bg-surface shadow-md shadow-black/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              {frozen ? <Unlock className="w-6 h-6 text-emerald-500" /> : <Lock className="w-6 h-6 text-rose-500" />}
              <span className="text-xs font-bold text-slate-700">{frozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>
            <button className="p-4 rounded-xl border border-white/10 bg-surface shadow-md shadow-black/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <Settings className="w-6 h-6 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Reset PIN</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2"><Sliders className="w-5 h-5 text-indigo-400"/> Spending Limits & Controls</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Daily Transaction Limit</span>
                  <span className="font-bold text-white">₹50,000 / ₹1,00,000</span>
                </div>
                <input type="range" min="0" max="100000" defaultValue="50000" className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">International Usage</h4>
                  <p className="text-xs text-slate-400 mt-1">Allow transactions in foreign currencies</p>
                </div>
                <button 
                  onClick={() => setIntEnabled(!intEnabled)}
                  className={cn("w-12 h-6 rounded-full transition-colors relative", intEnabled ? "bg-emerald-500" : "bg-white/20")}
                >
                  <div className={cn("w-4 h-4 bg-surface rounded-full absolute top-1 transition-transform", intEnabled ? "left-7" : "left-1")} />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Tap to Pay (NFC)</h4>
                  <p className="text-xs text-slate-400 mt-1">Contactless payments up to ₹5,000</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors">
                  <div className="w-4 h-4 bg-surface rounded-full absolute top-1 left-7 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. COMPREHENSIVE EMI & CREDIT SUITE
// ==========================================
function CreditTab() {
  const [emiAmount, setEmiAmount] = useState(50000);
  const [emiMonths, setEmiMonths] = useState(12);
  const rate = 12; // 12% PA
  const r = rate / 100 / 12;
  const emi = (emiAmount * r * Math.pow(1 + r, emiMonths)) / (Math.pow(1 + r, emiMonths) - 1);
  const totalPayable = emi * emiMonths;
  const totalInterest = totalPayable - emiAmount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Onboarding & BNPL */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-surface rounded-full shadow-md shadow-black/20 flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Pre-Approved Limit</h3>
            <p className="text-3xl font-bold text-emerald-400 mt-2">₹1,50,000</p>
            <p className="text-xs text-emerald-300/80 mt-2 mb-4">Based on your pristine credit health and banking history.</p>
            <button className="w-full glass-button text-emerald-400 font-bold text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
              Activate Instant Credit
            </button>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <BadgePercent className="w-5 h-5 text-indigo-400" />
              Buy Now, Pay Later (BNPL)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Convert recent transactions into easy EMIs with one click.</p>
            <div className="space-y-3">
              {[
                { name: 'Apple Store', date: 'Yesterday', amount: 84000 },
                { name: 'MakeMyTrip', date: '3 days ago', amount: 32500 }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5">
                  <div>
                    <p className="text-sm font-bold text-slate-300">{tx.name}</p>
                    <p className="text-xs text-slate-400">₹{tx.amount}</p>
                  </div>
                  <button className="text-[10px] font-bold bg-surface border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded hover:bg-indigo-500/10 transition-colors">
                    SPLIT TO EMI
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive EMI Calculator & Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-indigo-400" />
              Interactive EMI Calculator & Ledger
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600">Loan Amount</span>
                    <span className="font-bold text-white">{formatCurrency(emiAmount)}</span>
                  </div>
                  <input type="range" min="10000" max="500000" step="5000" value={emiAmount} onChange={(e) => setEmiAmount(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600">Duration (Months)</span>
                    <span className="font-bold text-white">{emiMonths} Mos</span>
                  </div>
                  <input type="range" min="3" max="36" step="1" value={emiMonths} onChange={(e) => setEmiMonths(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Interest Rate</span>
                    <span className="font-semibold text-white">{rate}% P.A.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Processing Fee (1.5%)</span>
                    <span className="font-semibold text-white">{formatCurrency(emiAmount * 0.015)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 rounded-xl p-6 text-white flex flex-col justify-center shadow-inner">
                <p className="text-indigo-200 text-sm font-medium">Monthly EMI Outflow</p>
                <p className="text-4xl font-bold mt-1 mb-6">{formatCurrency(emi)}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-indigo-800 pb-2">
                    <span className="text-indigo-300">Principal</span>
                    <span className="font-medium">{formatCurrency(emiAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-indigo-800 pb-2">
                    <span className="text-indigo-300">Total Interest</span>
                    <span className="font-medium text-amber-400">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1">
                    <span>Total Payable</span>
                    <span>{formatCurrency(totalPayable)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="font-semibold text-slate-300 text-sm mb-4">Flexible Repayment Controls</h4>
              <div className="flex gap-4">
                <button className="flex-1 py-2 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-100 hover:bg-indigo-500/20 transition-colors">
                  Setup Auto-Debit
                </button>
                <button className="flex-1 py-2 bg-white/5 text-slate-700 text-xs font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  Make Part-Payment
                </button>
                <button className="flex-1 py-2 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-lg border border-rose-100 hover:bg-rose-500/20 transition-colors">
                  Foreclose Loan
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. SECURITY & FINANCIAL HEALTH
// ==========================================
function SecurityHealthTab() {
  const expenseData = [
    { name: 'Housing', value: 35000 },
    { name: 'Food', value: 18000 },
    { name: 'Transport', value: 8000 },
    { name: 'Entertainment', value: 12000 },
    { name: 'Utilities', value: 5000 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Security Module */}
      <div className="glass-panel p-6">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-indigo-400" />
          Security Guardrails & Biometrics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Biometric Authentication</p>
                <p className="text-xs text-slate-400">Require FaceID/TouchID for transactions</p>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors">
              <div className="w-4 h-4 bg-surface rounded-full absolute top-1 left-7 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Hidden Fee Transparency</p>
                <p className="text-xs text-slate-400">Pre-transaction breakdown of GST & charges</p>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors">
              <div className="w-4 h-4 bg-surface rounded-full absolute top-1 left-7 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Budget Breach Alerts</p>
                <p className="text-xs text-slate-400">AI notifies when approaching limits</p>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors">
              <div className="w-4 h-4 bg-surface rounded-full absolute top-1 left-7 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl border border-slate-800 shadow-md shadow-black/20 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-indigo-200 text-sm">Experian Credit Score</h3>
              <p className="text-4xl font-bold mt-2 text-emerald-400">784</p>
              <p className="text-xs text-indigo-200 mt-1">Excellent · Checked today</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-400/30 flex items-center justify-center border-t-emerald-400">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-800/50">
            <p className="text-xs text-indigo-200"><strong className="text-white">Tip:</strong> Your utilization dropped by 4%. Keep balances low to reach 800+.</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-400" /> AI Expense Analytics
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={90} />
                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(val) => formatCurrency(Number(val))} />
                <Bar isAnimationActive={true} animationDuration={1500}  dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sliders({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21"/><line x1="4" x2="20" y1="14" y2="14"/><line x1="4" x2="20" y1="7" y2="7"/><polyline points="10 21 14 21 14 21"/><polyline points="10 14 14 14 14 14"/><polyline points="10 7 14 7 14 7"/><line x1="12" x2="12" y1="21" y2="21"/><line x1="12" x2="12" y1="14" y2="14"/><line x1="12" x2="12" y1="7" y2="7"/><circle cx="12" cy="7" r="2"/><circle cx="8" cy="14" r="2"/><circle cx="16" cy="21" r="2"/></svg>
}

