const fs = require('fs');
const files = [
  'src/components/BankTransactions.tsx',
  'src/components/TradeHistory.tsx',
  'src/components/AssetAllocationChart.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Bar
  code = code.replace(/<Bar([^>]*?)>/g, (match, attrs) => {
    if (attrs.includes('isAnimationActive')) return match;
    return `<Bar isAnimationActive={true} animationDuration={1500} ${attrs}>`;
  });
  
  // Line
  code = code.replace(/<Line([^>]*?)>/g, (match, attrs) => {
    if (attrs.includes('isAnimationActive')) return match;
    return `<Line isAnimationActive={true} animationDuration={1500} ${attrs}>`;
  });
  
  // Area
  code = code.replace(/<Area([^>]*?)>/g, (match, attrs) => {
    if (attrs.includes('isAnimationActive')) return match;
    return `<Area isAnimationActive={true} animationDuration={1500} ${attrs}>`;
  });
  
  // Pie
  code = code.replace(/<Pie(\s[^>]*?)>/g, (match, attrs) => {
    if (attrs.includes('isAnimationActive')) return match;
    return `<Pie isAnimationActive={true} animationDuration={1500}${attrs}>`;
  });
  code = code.replace(/<Pie>/g, `<Pie isAnimationActive={true} animationDuration={1500}>`);

  fs.writeFileSync(file, code);
}
console.log('Fixed charts');
