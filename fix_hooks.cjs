const fs = require('fs');
let code = fs.readFileSync('src/components/TradeHistory.tsx', 'utf8');

const loadingBlock = `  if (isLoading) {
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

code = code.replace(loadingBlock, '');

code = code.replace('  return (\n    <div className="max-w-6xl mx-auto p-8 space-y-8">', loadingBlock + '\n  return (\n    <div className="max-w-6xl mx-auto p-8 space-y-8">');

fs.writeFileSync('src/components/TradeHistory.tsx', code);
console.log('Hooks fixed');
