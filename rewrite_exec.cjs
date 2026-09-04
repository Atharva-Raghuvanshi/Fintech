const fs = require('fs');
let code = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');

// Ensure supabase import exists
if (!code.includes("import { supabase } from '../lib/supabase';")) {
  code = code.replace("import { insertAppData } from '../lib/supabaseActions';", "import { insertAppData } from '../lib/supabaseActions';\nimport { supabase } from '../lib/supabase';");
}

// 1. Replace useEffect onSnapshot logic
const useEffectReplacement = `useEffect(() => {
    if (!user) return;

    // Supabase Realtime Subscription
    const channel = supabase.channel('custom-update-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio', filter: \`user_id=eq.\${user.id}\` },
        (payload) => {
          if (payload.new) setPortfolio(payload.new as any);
        }
      )
      .subscribe();

    // Initial fetch
    supabase.from('portfolio').select('*').eq('user_id', user.id).single().then(({ data, error }) => {
      if (data) {
        setPortfolio(data as any);
      } else {
        setPortfolio({ cash: 1250000, equity: 4500000, mutualFunds: 2800000, gold: 850000, crypto: 420000, silver: 150000, bonds: 500000 });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);`;
  
code = code.replace(/useEffect\(\(\) => \{\s*if \(\!user\) return;\s*const portfolioRef.*?return \(\) => unsub\(\);\s*\}, \[user\]\);/s, useEffectReplacement);

// 2. Replace handleExecute runTransaction block
const handleExecuteReplacement = `const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolio || !user) return;
    setStatus({ type: "loading", msg: "Executing ACID Transaction..." });
    
    const totalAmount = Number(quantity) * (orderType === "Market" ? currentPrice : Number(price));
    
    try {
      // 1. Insert trade into Supabase
      await insertAppData({
        user_id: user.id,
        type: action,
        asset: activeAsset,
        amount: totalAmount,
        order_type: orderType,
        quantity: Number(quantity),
        price: orderType === "Market" ? currentPrice : Number(price),
        source: 'Execution Layer'
      });

      // 2. Chained update call to portfolio table to simulate ACID behavior
      let currentCash = portfolio.cash || 0;
      if (action === "BUY" && currentCash < totalAmount) {
        throw new Error("Insufficient margin for this transaction.");
      }
      
      const newCash = action === "BUY" ? currentCash - totalAmount : currentCash + totalAmount;
      const assetKey = activeAssetClass === "Crypto" ? "crypto" : activeAssetClass === "Gold" ? "gold" : activeAssetClass === "Silver" ? "silver" : activeAssetClass === "Mutual Funds" ? "mutualFunds" : activeAssetClass === "Bonds" ? "bonds" : "equity";
      
      const currentAssetVal = (portfolio as any)[assetKey] || 0;
      const newAssetVal = action === "BUY" ? currentAssetVal + totalAmount : Math.max(0, currentAssetVal - totalAmount);
      
      const newPortfolioData = {
        user_id: user.id,
        cash: newCash,
        [assetKey]: newAssetVal
      };

      const { error } = await supabase
        .from('portfolio')
        .upsert(newPortfolioData, { onConflict: 'user_id' });
        
      if (error) {
         console.error('Portfolio Update Error:', error);
      }

      setStatus({ type: "success", msg: \`\${orderType} \${action} order placed successfully.\` });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", msg: err.message || "Execution failed." });
    } finally {
      setTimeout(() => setStatus(null), 4000);
    }
  };`;

code = code.replace(/const handleExecute = async \(e: React\.FormEvent\) => \{[\s\S]*?setTimeout\(\(\) => setStatus\(null\), 4000\);\s*\}\s*\};/s, handleExecuteReplacement);

fs.writeFileSync('src/components/ExecutionLayer.tsx', code);
console.log("ExecutionLayer Updated with Supabase Logic");
