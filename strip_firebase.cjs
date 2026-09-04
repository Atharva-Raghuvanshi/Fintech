const fs = require('fs');

function processFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Strip firebase imports
  code = code.replace(/import\s+{[^}]*}\s+from\s+['"]firebase\/firestore['"];\n?/g, '');
  code = code.replace(/import\s+{\s*db\s*}\s+from\s+['"]\.\.?\/lib\/firebase['"];\n?/g, '');
  
  fs.writeFileSync(file, code);
  console.log(`Stripped imports from ${file}`);
}

processFile('src/components/ExecutionLayer.tsx');
processFile('src/components/TradeHistory.tsx');
processFile('src/components/ConsistencyDashboard.tsx');
