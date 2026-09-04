const fs = require('fs');
let code = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');

const handleGenerateMockHistory = `
  const handleGenerateMockHistory = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const MOCK_ASSETS = [
        { name: 'RELIANCE.NS', type: 'equity', price: 2850 },
        { name: 'NIFTYBEES', type: 'equity', price: 250 },
        { name: 'GOLDBEES', type: 'gold', price: 65 },
        { name: 'BTC-USD', type: 'crypto', price: 62000 },
        { name: 'ETH-USD', type: 'crypto', price: 3100 },
        { name: 'SGB24DEC', type: 'bonds', price: 6800 },
        { name: 'PARAGPARIKH-FLEXI', type: 'mutualFunds', price: 72 },
        { name: 'SILVERBEES', type: 'silver', price: 85 }
      ];
      const orderTypes = ['Market', 'Limit'];
      const actions = ['BUY', 'SELL'];

      // Generate 150 trades
      const mockTrades = [];
      const now = Date.now();
      
      for (let i = 0; i < 150; i++) {
        const assetObj = MOCK_ASSETS[Math.floor(Math.random() * MOCK_ASSETS.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        const isRecent = i < 50; 
        const timeOffset = isRecent ? 
          Math.random() * 30 * 24 * 60 * 60 * 1000 : // past 30 days
          Math.random() * 365 * 24 * 60 * 60 * 1000; // past year
        
        const timestamp = now - timeOffset;
        const qty = Math.floor(Math.random() * 50) + 1;
        const priceOffset = (Math.random() - 0.5) * 0.1; // +/- 5%
        const price = assetObj.price * (1 + priceOffset);
        
        mockTrades.push({
          user_id: user.id,
          asset: assetObj.name,
          action: action,
          amount: qty * price,
          price: price,
          quantity: qty,
          order_type: orderType,
          created_at: new Date(timestamp).toISOString(),
          timestamp: new Date(timestamp).toISOString()
        });
      }

      await supabase.from('trade_history').insert(mockTrades);
      
      const newPortfolio = {
        user_id: user.id,
        cash: 1500000,
        equity: 1200000,
        crypto: 250000,
        gold: 150000,
        bonds: 300000,
        mutualFunds: 450000,
        silver: 80000
      };
      
      await supabase.from('portfolio').upsert(newPortfolio, { onConflict: 'user_id' });
      
      window.location.reload();
    } catch (error) {
      console.error('Error generating mock history:', error);
      alert('Failed to generate mock history');
    } finally {
      setGenerating(false);
    }
  };
`;

const handleClearHistory = `
  const handleClearHistory = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to permanently delete all your trade history? This cannot be undone.")) return;
    
    setGenerating(true);
    try {
      await supabase.from('trade_history').delete().eq('user_id', user.id);
      await supabase.from('portfolio').delete().eq('user_id', user.id);
      window.location.reload();
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear history');
    } finally {
      setGenerating(false);
    }
  };
`;

code = code.replace(/const handleGenerateMockHistory = async \(\) => \{[\s\S]*?\}\s*const handleClearHistory/s, handleGenerateMockHistory + '\n' + 'const handleClearHistory');
code = code.replace(/const handleClearHistory = async \(\) => \{[\s\S]*?alert\('Failed to clear history'\);\s*\}\s*finally\s*\{\s*setGenerating\(false\);\s*\}\s*\};/s, handleClearHistory);

fs.writeFileSync('src/components/TradeHistory.tsx', code);
console.log("Updated TradeHistory handlers");
