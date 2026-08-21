import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

content = content.replace(
  "import { historicalNetWorth } from '../data';",
  "import { historicalNetWorth } from '../data';\nimport { AssetAllocationChart } from './AssetAllocationChart';"
);

// Remove the pieData block
const pieDataRegex = /  const pieData = \[\s*{\s*name: 'Equity'[\s\S]*?\];\s*/m;
content = content.replace(pieDataRegex, '');

// Replace the actual motion.div containing the old pie chart
// The old pie chart block:
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
//           className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
//         >
//           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">Asset Allocation</h3>
// ... up to the next <motion.div

const oldPieChartStart = '        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.5, ease: \'easeOut\', delay: 0.3 }}\n          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"\n        >\n          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">Asset Allocation</h3>';
const oldPieChartEnd = '        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.5, ease: \'easeOut\', delay: 0.4 }}\n          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"';

if (content.includes(oldPieChartStart) && content.includes(oldPieChartEnd)) {
  const startIdx = content.indexOf(oldPieChartStart);
  const endIdx = content.indexOf(oldPieChartEnd);
  const newPieChart = `        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        >
          <AssetAllocationChart portfolio={portfolio} />
        </motion.div>
`;
  content = content.substring(0, startIdx) + newPieChart + content.substring(endIdx);
} else {
  console.log("Could not find exact block to replace");
}

fs.writeFileSync('src/components/Dashboard.tsx', content);
