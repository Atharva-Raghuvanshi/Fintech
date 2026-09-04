const fs = require('fs');
let code = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');

// 1. Remove mock generators
code = code.replace(/const generateChartData =.*?return data;\s*\};/s, '');
code = code.replace(/const mockMarketDepth = \{[\s\S]*?\};\s*const ASSET_CLASSES/s, 'const ASSET_CLASSES');

// 2. Add state for marketDepth and chartData
code = code.replace(
  "  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);",
  "  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);\n  const [chartData, setChartData] = useState<any[]>([]);\n  const [marketDepth, setMarketDepth] = useState<{ bids: any[], asks: any[] }>({ bids: [], asks: [] });"
);

// 3. Remove old chartData useMemo
code = code.replace(/  const chartData = useMemo\(\(\) => generateChartData[\s\S]*?\], \[activeAssetClass, activeAsset\]\);/, '');

// 4. Update currentPrice, dayChange
code = code.replace(/  const currentPrice = chartData\[chartData\.length - 1\]\.price;/, "  const currentPrice = chartData.length ? chartData[chartData.length - 1].price : 0;");
code = code.replace(/  const dayChange = currentPrice - chartData\[0\]\.price;/, "  const dayChange = chartData.length ? currentPrice - chartData[0].price : 0;");
code = code.replace(/  const dayChangePct = \(dayChange \/ chartData\[0\]\.price\) \* 100;/, "  const dayChangePct = chartData.length ? (dayChange / chartData[0].price) * 100 : 0;");

// 5. Replace handleAssetClassClick logic
code = code.replace(
  "onClick={() => setActiveAssetClass(ac)}",
  `onClick={() => {
              setActiveAssetClass(ac);
              const defaults: Record<string, string> = {
                'Stocks': 'RELIANCE.NS',
                'F&O': 'NIFTY24DEC15000CE',
                'Gold': 'GOLDBEES',
                'Silver': 'SILVERBEES',
                'Crypto': 'BTC-USD',
                'ETFs': 'NIFTYBEES',
                'Mutual Funds': 'PARAGPARIKH-FLEXI',
                'Bonds': 'SGB24DEC',
                'Forex': 'USDINR'
              };
              setActiveAsset(defaults[ac] || 'RELIANCE.NS');
            }}`
);

// 6. Wrap chart with loader
code = code.replace(
  /<ResponsiveContainer width="100%" height="100%">[\s\S]*?<\/ResponsiveContainer>/,
  `{chartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} minTickGap={30} />
                    <YAxis yAxisId="price" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} orientation="right" />
                    <YAxis yAxisId="volume" domain={[0, 'dataMax * 3']} hide />
                    {activeIndicators.includes('RSI') && <YAxis yAxisId="rsi" domain={[0, 100]} hide />}
                    
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(5, 7, 10, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    
                    <Area yAxisId="price" type="monotone" dataKey="price" stroke="#4f46e5" fillOpacity={1} fill="url(#colorPrice)" />
                    {activeIndicators.includes('Volume') && (
                      <Bar yAxisId="volume" dataKey="volume" fill="#cbd5e1" fillOpacity={0.5} barSize={4} />
                    )}
                    {activeIndicators.includes('MA') && (
                      <Line isAnimationActive={true} animationDuration={1500} yAxisId="price" type="monotone" dataKey="ma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                    )}
                    {activeIndicators.includes('RSI') && (
                      <Line isAnimationActive={true} animationDuration={1500} yAxisId="rsi" type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              )}`
);

// 7. Update market depth to use state and show loader if empty
code = code.replace(
  /<div className="flex divide-x divide-slate-100">[\s\S]*?<\/div>\s*<\/motion\.div>/,
  `<div className="flex divide-x divide-white/10 h-64">
                {marketDepth.bids.length === 0 && marketDepth.asks.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-white/5">
                        <span>Bid</span>
                        <span>Qty</span>
                      </div>
                      {marketDepth.bids.map((bid, i) => (
                        <div key={i} className="flex justify-between px-4 py-1.5 text-xs hover:bg-emerald-500/10 relative group text-white">
                          <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/20" style={{ width: \`\${(bid.qty / 3000) * 100}%\` }}></div>
                          <span className="relative text-emerald-400 font-mono">{bid.price.toFixed(2)}</span>
                          <span className="relative text-slate-300 font-mono">{bid.qty}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-white/5">
                        <span>Ask</span>
                        <span>Qty</span>
                      </div>
                      {marketDepth.asks.map((ask, i) => (
                        <div key={i} className="flex justify-between px-4 py-1.5 text-xs hover:bg-rose-500/10 relative group text-white">
                          <div className="absolute right-0 top-0 bottom-0 bg-rose-500/20" style={{ width: \`\${(ask.qty / 3000) * 100}%\` }}></div>
                          <span className="relative text-rose-400 font-mono">{ask.price.toFixed(2)}</span>
                          <span className="relative text-slate-300 font-mono">{ask.qty}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>`
);

// 8. Remove auditLog unused state
code = code.replace(/  const \[auditLog, setAuditLog\] = useState<AuditLogEntry\[\]>\(\[\]\);\s*/, '');
code = code.replace(/    fetch\("\/api\/audit-log"\)\.then\(res => res\.headers\.get\('content-type'\)\?\.includes\('application\/json'\) \? res\.json\(\) : null\)\.then\(data => data && setAuditLog\(data\)\);\s*/, '');

fs.writeFileSync('src/components/ExecutionLayer.tsx', code);
console.log("ExecutionLayer Updated");
