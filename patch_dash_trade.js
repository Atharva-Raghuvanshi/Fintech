import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Add imports
const importToAdd = `import { insertAppData } from '../lib/supabaseActions';\nimport { useAuth } from '../contexts/AuthContext';\n`;
content = content.replace("import { ASSET_COLORS, getAssetColor } from '../lib/assetColors';", importToAdd + "import { ASSET_COLORS, getAssetColor } from '../lib/assetColors';");

// Inside Dashboard component, add state and handlers
const stateToAdd = `
  const { user } = useAuth();
  const [isTrading, setIsTrading] = useState(false);

  const handleQuickTrade = async (action: 'BUY' | 'SELL') => {
    if (!user || !tradeAsset || !tradeAmount) return;
    setIsTrading(true);
    try {
      await insertAppData({
        user_id: user.uid,
        action,
        asset: tradeAsset,
        amount: Number(tradeAmount),
        order_type: 'Market',
        source: 'Quick Trade'
      });
      // Optionally reset
      setTradeAmount('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsTrading(false);
    }
  };
`;
content = content.replace("const [tradeAmount, setTradeAmount] = useState('10000');", "const [tradeAmount, setTradeAmount] = useState('10000');\n" + stateToAdd);

// Update buttons
content = content.replace(
  `<button className="py-1 border border-negative/30 bg-negative/10 text-negative rounded-md text-[12px] font-medium hover:bg-negative/20 transition-colors">Sell</button>`,
  `<button 
    onClick={() => handleQuickTrade('SELL')}
    disabled={isTrading}
    className="py-1 border border-negative/30 bg-negative/10 text-negative rounded-md text-[12px] font-medium hover:bg-negative/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
  >
    {isTrading && <div className="w-3 h-3 rounded-full border-2 border-negative border-t-transparent animate-spin" />}
    Sell
  </button>`
);

content = content.replace(
  `<button className="py-1 bg-positive/90 text-white rounded-md text-[12px] font-medium hover:bg-positive transition-colors">Buy</button>`,
  `<button 
    onClick={() => handleQuickTrade('BUY')}
    disabled={isTrading}
    className="py-1 bg-positive/90 text-white rounded-md text-[12px] font-medium hover:bg-positive transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
  >
    {isTrading && <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
    Buy
  </button>`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
