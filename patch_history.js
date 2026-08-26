import fs from 'fs';

let content = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');

const importToAdd = `import { fetchAppData } from '../lib/supabaseActions';\n`;
content = content.replace("import { formatCurrency, cn } from '../lib/utils';", "import { formatCurrency, cn } from '../lib/utils';\n" + importToAdd);

// In useEffect
const supabaseEffect = `
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadSupabaseData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAppData();
        // data contains the rows from app_data table
        setTrades(data || []);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupabaseData();

    if (!db) return;
    // Listen to Portfolio
    const portfolioRef = doc(db, 'users', user.uid, 'portfolio', 'main');
    const unsubscribePortfolio = onSnapshot(portfolioRef, (docSnap) => {
      if (docSnap.exists()) {
        setPortfolio(docSnap.data());
      }
    });

    return () => {
      unsubscribePortfolio();
    };
  }, [user]);
`;

const blockRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[user\]\);/m;
content = content.replace(blockRegex, supabaseEffect);

// Add loading state in the render if isLoading
const loadingJSX = `
  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center text-indigo-600">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-4" />
          <h2 className="text-xl font-bold animate-pulse">Syncing with Supabase...</h2>
        </div>
      </div>
    );
  }
`;
content = content.replace("return (", loadingJSX + "\n  return (");

fs.writeFileSync('src/components/TradeHistory.tsx', content);
