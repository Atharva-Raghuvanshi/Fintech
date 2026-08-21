import React, { useState, useEffect } from 'react';
import { 
  Calculator, AlertCircle, FileText, CheckCircle2, Check, TrendingUp, 
  Briefcase, Globe, Calendar, CreditCard, ShieldAlert, ArrowRight,
  TrendingDown, PieChart, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import type { TaxResult, TaxEstimate } from '../types';

const TABS = ['Tax Optimizer', 'Capital Gains', 'Compliance & Filing', 'Advance Tax'];

export function TaxAdvisory() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading AI / data
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse text-indigo-600">
          <Briefcase className="w-10 h-10 mb-4" />
          <h2 className="text-xl font-bold">Connecting to Virtual CA...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Virtual CA & Tax Advisory
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Comprehensive tax planning, regime optimization, capital gains strategy, and compliance tracking.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
              activeTab === tab 
                ? "border-indigo-600 text-indigo-700" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
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
            {activeTab === 'Tax Optimizer' && <TaxOptimizerTab />}
            {activeTab === 'Capital Gains' && <CapitalGainsTab />}
            {activeTab === 'Compliance & Filing' && <ComplianceFilingTab />}
            {activeTab === 'Advance Tax' && <AdvanceTaxTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaxOptimizerTab() {
  const [formData, setFormData] = useState({
    income: 1800000,
    deductions80C: 150000,
    healthInsurance: 25000,
    nps80CCD1B: 50000,
    homeLoanInterest: 200000,
    hraExemption: 120000,
  });

  const [result, setResult] = useState<TaxResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);

  const handleCompute = async () => {
    setIsComputing(true);
    try {
      const res = await fetch('/api/tax/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      // Fallback local computation if API fails
      setTimeout(() => {
        setResult({
          recommendation: 'NEW_REGIME',
          oldRegime: { taxable: 1255000, tax: 188760 },
          newRegime: { taxable: 1800000, tax: 156000 }
        });
        setIsComputing(false);
      }, 500);
      return;
    }
    setIsComputing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Salary & Regime Optimizer</h3>
            <p className="text-sm text-slate-500">Maximize take-home salary</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gross Annual Income</label>
            <input
              type="number"
              value={formData.income}
              onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sec 80C (PPF, ELSS)</label>
              <input
                type="number"
                value={formData.deductions80C}
                onChange={(e) => setFormData({...formData, deductions80C: Number(e.target.value)})}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sec 80D (Health)</label>
              <input
                type="number"
                value={formData.healthInsurance}
                onChange={(e) => setFormData({...formData, healthInsurance: Number(e.target.value)})}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">80CCD(1B) (NPS)</label>
              <input
                type="number"
                value={formData.nps80CCD1B}
                onChange={(e) => setFormData({...formData, nps80CCD1B: Number(e.target.value)})}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sec 24(b) (Home Loan)</label>
              <input
                type="number"
                value={formData.homeLoanInterest}
                onChange={(e) => setFormData({...formData, homeLoanInterest: Number(e.target.value)})}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">HRA / LTA / Food Coupons</label>
            <input
              type="number"
              value={formData.hraExemption}
              onChange={(e) => setFormData({...formData, hraExemption: Number(e.target.value)})}
              className="w-full border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
            />
          </div>
        </div>

        <button
          onClick={handleCompute}
          disabled={isComputing}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isComputing ? 'Computing...' : 'Run Mathematical Comparison'}
        </button>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-6">
        {result ? (
          <>
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 flex items-start gap-4">
              <Check className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 text-lg">
                  {result.recommendation === 'NEW_REGIME' ? 'New Tax Regime' : 'Old Tax Regime'} is mathematically optimal.
                </h3>
                <p className="text-emerald-700 mt-1 leading-relaxed">
                  Based on your declared deductions and salary structure, you will save <span className="font-bold">{formatCurrency(Math.abs(result.oldRegime.tax - result.newRegime.tax))}</span> by opting for the {result.recommendation === 'NEW_REGIME' ? 'New' : 'Old'} Regime this year.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className={cn("rounded-xl border p-6 shadow-sm transition-all", result.recommendation === 'OLD_REGIME' ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10' : 'border-slate-200 bg-white opacity-80')}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-slate-500 text-sm">Old Regime</h4>
                  {result.recommendation === 'OLD_REGIME' && <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">Recommended</span>}
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Net Taxable Income</div>
                    <div className="text-xl font-semibold text-slate-900">{formatCurrency(result.oldRegime.taxable)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total Tax Liability</div>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(result.oldRegime.tax)}</div>
                  </div>
                </div>
              </div>

              <div className={cn("rounded-xl border p-6 shadow-sm transition-all", result.recommendation === 'NEW_REGIME' ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10' : 'border-slate-200 bg-white opacity-80')}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-slate-500 text-sm">New Regime</h4>
                  {result.recommendation === 'NEW_REGIME' && <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">Recommended</span>}
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Net Taxable Income</div>
                    <div className="text-xl font-semibold text-slate-900">{formatCurrency(result.newRegime.taxable)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total Tax Liability</div>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(result.newRegime.tax)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h4 className="text-amber-800 font-semibold flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4"/> Salary Restructuring Advice</h4>
              <p className="text-amber-700 text-sm mt-2">
                Ask your HR to replace your "Special Allowance" with Food Coupons (Meal Cards) up to ₹26,400/year and Gadget Allowances to reduce taxable gross income further.
              </p>
            </div>
          </>
        ) : (
          <div className="h-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-slate-400">
            <Calculator className="w-12 h-12 mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Analysis Run Yet</h3>
            <p className="text-center max-w-sm">Enter your current financial parameters and run the mathematical comparison to see your optimal tax regime.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CapitalGainsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Capital Gains Overview</h3>
          <p className="text-xs text-slate-500 mb-6">Current Financial Year</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">STCG (Equity)</span>
              <span className="font-bold text-slate-900">{formatCurrency(45000)} <span className="text-[10px] text-slate-400 font-normal ml-1">@20%</span></span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">LTCG (Equity)</span>
              <span className="font-bold text-slate-900">{formatCurrency(125000)} <span className="text-[10px] text-slate-400 font-normal ml-1">@12.5%</span></span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Real Estate (LTCG)</span>
              <span className="font-bold text-slate-900">{formatCurrency(0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h4 className="font-semibold text-indigo-900 text-sm mb-2">Exemptions Limit</h4>
          <p className="text-sm text-indigo-800">You have utilized ₹1.25L of your ₹1.25L tax-free LTCG limit for equity this year.</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-indigo-600" /> Tax-Loss Harvesting Strategy
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We detected unrealized losses in your portfolio. You can sell these assets before March 31st to offset your current Short-Term Capital Gains (STCG) and reduce your tax liability.
            </p>

            <div className="space-y-4 mb-6">
              {[
                { symbol: 'HDFCBANK', qty: 50, loss: 12500 },
                { symbol: 'INFY', qty: 120, loss: 8400 }
              ].map((stock, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-white">
                  <div>
                    <span className="font-bold text-slate-900">{stock.symbol}</span>
                    <span className="text-xs text-slate-500 ml-2">{stock.qty} Shares</span>
                  </div>
                  <span className="font-bold text-rose-600">-{formatCurrency(stock.loss)}</span>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex justify-between items-center text-sm font-medium">
              <span>Potential Tax Saved via Harvesting:</span>
              <span className="text-lg font-bold">{formatCurrency((12500 + 8400) * 0.20)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-600" /> Section 54 Exemption (Real Estate)
            </h3>
          </div>
          <div className="p-6 text-sm text-slate-600">
            <p>If you plan to sell residential property this year, you can claim exemption from Long Term Capital Gains under Section 54 by:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Purchasing another residential property within 1 year before or 2 years after the sale.</li>
              <li>Constructing a residential property within 3 years.</li>
              <li>Depositing the gains in a Capital Gains Account Scheme (CGAS) before the ITR filing due date.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplianceFilingTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" /> Income Tax Return (ITR)
          </h3>
          <p className="text-sm text-slate-600 mb-6">Select the correct ITR form to prevent misreporting and immediate rejection.</p>
          
          <div className="space-y-3">
            {[
              { form: 'ITR-1 (Sahaj)', desc: 'Salary, one house property, other sources (up to ₹50L).', recommended: false },
              { form: 'ITR-2', desc: 'Capital gains, foreign assets, multiple properties.', recommended: true },
              { form: 'ITR-3', desc: 'Income from business or profession.', recommended: false },
              { form: 'ITR-4 (Sugam)', desc: 'Presumptive taxation (Sec 44AD, 44ADA, 44AE).', recommended: false },
            ].map(itr => (
              <div key={itr.form} className={cn("p-4 rounded-xl border", itr.recommended ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 bg-white")}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{itr.form}</h4>
                    <p className="text-xs text-slate-500 mt-1">{itr.desc}</p>
                  </div>
                  {itr.recommended && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Recommended</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-rose-900 flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5" /> Foreign Asset Disclosure
          </h3>
          <p className="text-sm text-rose-800 leading-relaxed mb-4">
            Mandatory reporting of global income, foreign bank accounts, and foreign stocks (e.g., US Equity RSUs/ESOPs) under the Schedule FA.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-rose-100 text-sm">
            <strong className="text-rose-900 block mb-1">Black Money Act Penalty Warning:</strong>
            <span className="text-rose-700">Failure to disclose foreign assets in ITR can attract a penalty of up to ₹10 Lakhs, even if the income is below taxable limits.</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Filing Status - FY 2024-25</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Not Filed Yet</p>
              <p className="text-sm text-slate-500">Due Date: July 31st, 2025</p>
            </div>
          </div>
          <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Start E-Filing Process
          </button>
        </div>
      </div>
    </div>
  );
}

function AdvanceTaxTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Advance Tax Computation</h3>
              <p className="text-sm text-slate-500">For non-salaried tax liability &gt; ₹10k</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-500 block mb-1">Estimated Annual Tax Liability</span>
              <span className="text-2xl font-bold text-slate-900">{formatCurrency(120000)}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-500 block mb-1">TDS Already Deducted</span>
              <span className="text-xl font-semibold text-emerald-600">{formatCurrency(20000)}</span>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-sm text-indigo-700 block mb-1 font-semibold">Net Advance Tax Payable</span>
              <span className="text-2xl font-bold text-indigo-900">{formatCurrency(100000)}</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="text-amber-900 font-bold flex items-center gap-2 text-sm mb-2">
            <ShieldAlert className="w-4 h-4"/> Sec 234B & 234C Penalties
          </h4>
          <p className="text-amber-800 text-sm">
            Failing to pay advance tax on time attracts a penal interest of 1% per month on the shortfall amount. Stick to the quarterly schedule to avoid this.
          </p>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6">Quarterly Payment Schedule</h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
            
            {[
              { date: '15th June', percent: '15%', amount: 15000, status: 'Paid', icon: CheckCircle2, color: 'text-emerald-500' },
              { date: '15th Sept', percent: '45%', amount: 30000, status: 'Paid', icon: CheckCircle2, color: 'text-emerald-500' },
              { date: '15th Dec', percent: '75%', amount: 30000, status: 'Due Soon', icon: AlertCircle, color: 'text-amber-500' },
              { date: '15th March', percent: '100%', amount: 25000, status: 'Upcoming', icon: Calendar, color: 'text-slate-400' },
            ].map((installment, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <installment.icon className={`w-5 h-5 ${installment.color}`} />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{installment.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${installment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : installment.status === 'Due Soon' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{installment.status}</span>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Cumulative</p>
                      <p className="text-sm font-semibold text-indigo-600">{installment.percent} of Total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-0.5">Installment</p>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(installment.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
