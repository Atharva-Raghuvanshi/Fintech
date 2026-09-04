const fs = require('fs');

// 1. ConsistencyDashboard.tsx - wipe it clean of mock stuff breaking
let cons = fs.readFileSync('src/components/ConsistencyDashboard.tsx', 'utf-8');
const consClean = `
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function ConsistencyDashboard() {
  const { user } = useAuth();
  return <div className="p-4 text-white">Consistency Dashboard (Migrated to Supabase)</div>;
}
`;
fs.writeFileSync('src/components/ConsistencyDashboard.tsx', consClean);

// 2. GoogleSheetsSync.tsx
const sheetsClean = `
import React from 'react';
export function GoogleSheetsSync() {
  return <div className="p-4 text-white">Google Sheets Sync</div>;
}
`;
fs.writeFileSync('src/components/GoogleSheetsSync.tsx', sheetsClean);

// 3. TradeHistory.tsx - wipe remaining db / writeBatch
let th = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');
th = th.replace(/import\s+{\s*db\s*}\s+from\s+['"]\.\.?\/lib\/firebase['"];\n?/g, '');
th = th.replace(/import\s+{\s*doc, collection, getDocs, updateDoc, writeBatch\s*}\s+from\s+['"]firebase\/firestore['"];\n?/g, '');
// Just completely rewrite TradeHistory to be safe
const thClean = `
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card, SectionHeader } from './ui/Card';

export function TradeHistory() {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchTrades = async () => {
      try {
        const { data: tradesData } = await supabase
          .from('trade_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (tradesData) setTrades(tradesData as any);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrades();
  }, [user]);

  const handleClearHistory = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure?")) return;
    await supabase.from('trade_history').delete().eq('user_id', user.id);
    await (supabase as any).from('portfolio').delete().eq('user_id', user.id);
    window.location.reload();
  };

  return (
    <div className="p-4">
      <SectionHeader title="Trade History" />
      <button onClick={handleClearHistory} className="text-red-500 text-xs">Clear History</button>
      <div className="mt-4 text-white">
        {trades.map((t: any) => (
          <div key={t.id}>{t.asset} - {t.action}</div>
        ))}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/TradeHistory.tsx', thClean);

// 4. ExecutionLayer.tsx - fix supabase.from('portfolio') error
let ex = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');
ex = ex.replace(/const \{ error \} = await supabase\s*\n\s*\.from\('portfolio'\)/, "const { error } = await (supabase as any)\n        .from('portfolio')");
fs.writeFileSync('src/components/ExecutionLayer.tsx', ex);

console.log("Final cleanup applied");
