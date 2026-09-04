
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
