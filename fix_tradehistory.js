import fs from 'fs';

let content = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');

// I will manually extract the hook body and the render part to fix this mess.
// Let's just restore the file or fix it with a better replace.

content = content.replace(`    });

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

  return () => {
      unsubscribePortfolio();
    };
  }, [user]);`, `    });

    return () => {
      unsubscribePortfolio();
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center text-indigo-600">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-4" />
          <h2 className="text-xl font-bold animate-pulse">Syncing with Supabase...</h2>
        </div>
      </div>
    );
  }`);

fs.writeFileSync('src/components/TradeHistory.tsx', content);
