import fs from 'fs';

let content = fs.readFileSync('src/components/TradeHistory.tsx', 'utf-8');

// replace the timestamp logic for volume chart
const volumeDataUpdate = `
  const volumeData = React.useMemo(() => {
    if (!trades.length) return [];
    
    // Sort chronologically for chart
    const chronological = [...trades].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : a.timestamp;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : b.timestamp;
      return timeA - timeB;
    });
    const grouped = chronological.reduce((acc, trade) => {
      const ts = trade.created_at ? new Date(trade.created_at).getTime() : trade.timestamp;
      const date = new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = 0;
      acc[date] += trade.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([date, volume]) => ({ date, volume }));
  }, [trades]);
`;
content = content.replace(/const volumeData = React\.useMemo\(\(\) => \{[\s\S]*?\}, \[trades\]\);/m, volumeDataUpdate);

// replace render elements
content = content.replace(/\{new Date\(trade\.timestamp\)\.toLocaleString\(\)\}/g, "{new Date(trade.created_at ? trade.created_at : trade.timestamp).toLocaleString()}");
content = content.replace(/\{trade\.orderType\}/g, "{trade.order_type || trade.orderType}");

// Use trade.id for key
content = content.replace(/key=\{trade\.id\}/g, "key={trade.id || Math.random()}");

fs.writeFileSync('src/components/TradeHistory.tsx', content);
