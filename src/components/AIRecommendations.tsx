import React, { useState } from 'react';
import { Card, SectionHeader, StatusPill } from './ui/Card';
import { MessageSquare, Send, Bot, AlertTriangle } from 'lucide-react';

export function AIRecommendations() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ca', content: "Hello! I am your AI Virtual CA. I've analyzed your latest bank sync. You have ₹1.2L sitting idle in your HDFC account. Should I propose a short-term liquid fund allocation?", type: 'insight' }
  ]);

  const recs = [
    { id: 1, text: "Equity allocation drifted +5% above target. Rebalance recommended.", severity: "warning" },
    { id: 2, text: "Tax-loss harvesting opportunity: Sell RELIANCE to offset ₹45k STCG.", severity: "action" },
    { id: 3, text: "SIP for 'Vacation Fund' is due in 3 days.", severity: "info" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      {/* Terminal Chat */}
      <div className="lg:col-span-8 flex flex-col">
        <Card className="flex-1 flex flex-col bg-[#0f0f11] border-white/10" noPadding>
          <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-surface">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="text-[14px] font-medium text-text-primary">Virtual CA Terminal</h2>
            <StatusPill label="Connected to DB" variant="positive" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-primary/20 text-primary'}`}>
                  {msg.role === 'user' ? <span className="text-[11px]">ME</span> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-surface text-text-primary border border-white/5' : 'bg-transparent text-text-secondary'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-surface border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about your portfolio, tax liability, or request a scenario analysis..."
                className="w-full bg-[#0f0f11] border border-white/10 rounded-lg py-3 pl-4 pr-12 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 font-mono"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Proactive Feed & Simulator */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card className="flex-1 overflow-y-auto" noPadding>
          <div className="p-5 border-b border-white/5 sticky top-0 bg-surface z-10">
            <SectionHeader title="Proactive Feed" />
          </div>
          <div className="p-5 space-y-3">
            {recs.map(rec => (
              <div key={rec.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${rec.severity === 'warning' ? 'text-warning' : rec.severity === 'action' ? 'text-primary' : 'text-text-tertiary'}`} />
                  <div>
                    <p className="text-[13px] text-text-primary leading-snug">{rec.text}</p>
                    <div className="flex gap-3 mt-3">
                      <button className="text-[11px] font-medium text-primary hover:underline">Apply</button>
                      <button className="text-[11px] font-medium text-text-tertiary hover:text-text-secondary">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-[220px]">
          <SectionHeader title="Stress Simulator" subtitle="Nifty 50 drops by 10%" />
          <div className="mt-6">
            <div className="flex justify-between text-[11px] font-mono text-text-secondary mb-2">
              <span>Current</span>
              <span>Stressed</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden flex mb-2">
              <div className="h-full bg-primary" style={{ width: '100%' }} />
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden flex">
              <div className="h-full bg-negative" style={{ width: '92%' }} />
            </div>
            <div className="mt-4 flex justify-between items-baseline border-t border-white/5 pt-4">
              <span className="text-[12px] text-text-tertiary uppercase">Max Drawdown</span>
              <span className="text-[20px] font-mono text-negative tabular-nums">-₹8,34,000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
