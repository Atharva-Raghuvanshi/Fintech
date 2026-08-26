import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const generatorFn = `const generateNetWorthData = (period: string, currentTotal: number) => {
  const now = new Date();
  const data = [];
  let points = 12;
  let startValue = 4200000;
  let volatility = 100000;
  let trend = 50000;

  if (period === '1W') { points = 7; startValue = currentTotal * 0.98; volatility = 50000; trend = 30000; }
  else if (period === '1M') { points = 30; startValue = currentTotal * 0.92; volatility = 80000; trend = 20000; }
  else if (period === '3M') { points = 90; startValue = currentTotal * 0.85; volatility = 100000; trend = 25000; }
  else if (period === '1Y') { points = 12; startValue = currentTotal * 0.70; volatility = 150000; trend = 100000; }
  else if (period === 'ALL') { points = 60; startValue = currentTotal * 0.30; volatility = 300000; trend = 80000; }

  let currentVal = startValue;
  for (let i = 0; i < points; i++) {
    const d = new Date(now);
    let dateStr = '';
    
    if (period === '1W' || period === '1M' || period === '3M') {
      d.setDate(d.getDate() - (points - 1 - i));
      dateStr = \`\${d.getDate()} \${d.toLocaleString('default', { month: 'short' })}\`;
    } else if (period === '1Y') {
      d.setMonth(d.getMonth() - (points - 1 - i));
      dateStr = \`\${d.toLocaleString('default', { month: 'short' })} '\${d.getFullYear().toString().substr(2,2)}\`;
    } else if (period === 'ALL') {
      d.setMonth(d.getMonth() - (points - 1 - i));
      dateStr = \`\${d.getFullYear()}\`;
    }

    data.push({
      date: dateStr,
      value: Math.round(currentVal)
    });
    currentVal += trend + (Math.random() - 0.4) * volatility;
  }
  
  // Tie the final data point to the exact current portfolio value
  data[data.length - 1].value = currentTotal;
  return data;
};`;

content = content.replace("export function Dashboard() {", generatorFn + "\n\nexport function Dashboard() {");

content = content.replace("export function Dashboard() {", "export function Dashboard() {\n  const [heroPeriod, setHeroPeriod] = useState('1M');");

// The current data uses "total" which is computed as:
// const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
// We need to pass this total to generateNetWorthData.
content = content.replace("const total = pieData.reduce((acc, curr) => acc + curr.value, 0);", 
  "const total = pieData.reduce((acc, curr) => acc + curr.value, 0);\n  const chartData = React.useMemo(() => generateNetWorthData(heroPeriod, total), [heroPeriod, total]);");

content = content.replace(/<PeriodToggle options=\{\['1W', '1M', '3M', '1Y', 'ALL'\]\} active="1M" onChange=\{[^}]+\} \/>/, 
  "<PeriodToggle options={['1W', '1M', '3M', '1Y', 'ALL']} active={heroPeriod} onChange={setHeroPeriod} />");

content = content.replace(/data=\{historicalNetWorth\}/, "data={chartData}");

fs.writeFileSync('src/components/Dashboard.tsx', content);
