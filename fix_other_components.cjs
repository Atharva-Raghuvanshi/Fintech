const fs = require('fs');

// TradeHistory.tsx
let code = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');
code = code.replace(/import { doc, collection, getDocs, updateDoc, writeBatch } from 'firebase\/firestore';/, '');
code = code.replace(/import { db } from '\.\.\/lib\/firebase';/, '');

if (!code.includes("import { supabase } from '../lib/supabase';")) {
  code = code.replace("import { useAuth } from '../contexts/AuthContext';", "import { useAuth } from '../contexts/AuthContext';\nimport { supabase } from '../lib/supabase';");
}

const tradeFetchLogic = `
      try {
        const { data: tradesData } = await supabase
          .from('trade_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (tradesData) {
          setTrades(tradesData as any);
        }
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
`;
code = code.replace(/try\s*\{\s*const portfolioRef = doc\(db.*?\s*setTrades\(tradesData\.sort.*?\);\s*\} catch \(error\) \{[\s\S]*?console\.error\('Error fetching trades:', error\);\s*\}/s, tradeFetchLogic);

fs.writeFileSync('src/components/TradeHistory.tsx', code);

// ConsistencyDashboard.tsx
let code2 = fs.readFileSync('src/components/ConsistencyDashboard.tsx', 'utf-8');
code2 = code2.replace(/import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase\/firestore';/, '');
code2 = code2.replace(/import { db } from '\.\.\/lib\/firebase';/, '');

if (!code2.includes("import { supabase } from '../lib/supabase';")) {
  code2 = code2.replace("import { useAuth } from '../contexts/AuthContext';", "import { useAuth } from '../contexts/AuthContext';\nimport { supabase } from '../lib/supabase';");
}

const consistencyFetchLogic = `
      try {
        const { data: tradesSnap } = await supabase.from('trade_history').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        
        const trades = (tradesSnap || []).map((t: any) => ({
          ...t,
          timestamp: new Date(t.created_at || t.timestamp).getTime()
        }));
        
        setRawTrades(trades);
        
        const { data: portData } = await supabase.from('portfolio').select('*').eq('user_id', user.id).single();
        if (portData) {
          setStartCapital(portData.cash || 1000000);
        } else {
          setStartCapital(1000000);
        }
        
      } catch (err) {
        console.error(err);
      }
`;

code2 = code2.replace(/try\s*\{\s*const tradesRef = collection\(db.*?\s*\}\s*\} catch \(err\) \{[\s\S]*?console\.error\(err\);\s*\}/s, consistencyFetchLogic);

fs.writeFileSync('src/components/ConsistencyDashboard.tsx', code2);
console.log("Updated TradeHistory and ConsistencyDashboard");
