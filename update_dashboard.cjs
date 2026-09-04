const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Add imports
code = code.replace(
  "import { useAuth } from '../contexts/AuthContext';",
  "import { useAuth } from '../contexts/AuthContext';\nimport { supabase } from '../lib/supabase';\nimport { useNavigate } from 'react-router-dom';"
);

// 2. Remove Mocks and generateNetWorthData
code = code.replace(/\/\/ Mock Data[\s\S]*?export function Dashboard/m, "export function Dashboard");

// 3. Inject new state and hooks
const dashboardBody = `  const [heroPeriod, setHeroPeriod] = useState('1M');
  const [tradeAsset, setTradeAsset] = useState('NIFTYBEES');
  const [tradeAmount, setTradeAmount] = useState('10000');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTrading, setIsTrading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [rebalanceData, setRebalanceData] = useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const { data: trades } = await supabase
          .from('trade_history')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(10);
        if (trades) setRecentTrades(trades);
        
        // As no real goals/rebalance/portfolio tables exist yet in supabase types, use clean empty states
        setGoals([]);
        setRebalanceData([]);
        setPortfolio({ cash: 0, equity: 0, mutualFunds: 0, gold: 0, crypto: 0, silver: 0, bonds: 0 });
      } catch(e) { console.error(e); }
    };
    fetchData();
  }, [user]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Asking AI:", aiQuery);
    setAiQuery('');
  };

  const handleRebalance = () => {
    console.log("Review Proposed Trades");
  };

  const handleQuickTrade =`;

code = code.replace(/  const \[heroPeriod.*?const handleQuickTrade =/s, dashboardBody);

// 4. Fix pieData to use portfolio instead of mockPortfolio
code = code.replace(/const pieData = Object\.entries\(mockPortfolio\)/g, "const pieData = Object.entries(portfolio || {})");

// 5. Fix chartData
code = code.replace(/const chartData = React\.useMemo\(\(\) => generateNetWorthData\(heroPeriod, total\), \[heroPeriod, total\]\);/, "const chartData: any[] = [];");

// 6. Fix AI Input and Button
code = code.replace(/<input [\s\S]*?placeholder="Ask Virtual CA to analyze..."[\s\S]*?\/>\s*<button className="p-1\.5[\s\S]*?<\/button>/m, 
`<form onSubmit={handleAskAI} className="flex-1 flex gap-2">
  <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Ask Virtual CA to analyze..." className="flex-1 bg-transparent text-[11px] text-text-primary focus:outline-none" />
  <button type="submit" className="p-1.5 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
    <ArrowUpRight className="w-3.5 h-3.5" />
  </button>
</form>`);

// 7. Fix Rebalance Button
code = code.replace(/<button className="w-full mt-3 py-1\.5 bg-primary\/10 text-primary border border-primary\/20 rounded-md text-\[12px\] font-medium hover:bg-primary hover:text-white transition-colors shrink-0">/, 
`<button onClick={handleRebalance} className="w-full mt-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[12px] font-medium hover:bg-primary hover:text-white transition-colors shrink-0">`);

// 8. Fix Recent Activity "View all"
code = code.replace(/action={<button className="text-\[11px\] text-primary hover:underline">View all<\/button>}/,
`action={<button onClick={() => navigate('/trades')} className="text-[11px] text-primary hover:underline">View all</button>}`);

// 9. Fix Active Goals "Manage"
code = code.replace(/action={<button className="text-\[11px\] text-primary hover:underline">Manage<\/button>}/,
`action={<button onClick={() => navigate('/goals')} className="text-[11px] text-primary hover:underline">Manage</button>}`);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Updated Dashboard");
