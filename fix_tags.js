import fs from 'fs';

const files = [
  'src/components/BankTransactions.tsx',
  'src/components/TradeHistory.tsx',
  'src/components/AssetAllocationChart.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  code = code.replace(/<Bar isAnimationActive=\{true\} animationDuration=\{1500\} Chart/g, '<BarChart');
  code = code.replace(/<Line isAnimationActive=\{true\} animationDuration=\{1500\} Chart/g, '<LineChart');
  code = code.replace(/<Area isAnimationActive=\{true\} animationDuration=\{1500\} Chart/g, '<AreaChart');

  fs.writeFileSync(file, code);
}
console.log('Fixed tags');
