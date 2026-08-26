import fs from 'fs';

let execContent = fs.readFileSync('src/components/ExecutionLayer.tsx', 'utf-8');
execContent = execContent.replace(/action: action,/, 'type: action,');
fs.writeFileSync('src/components/ExecutionLayer.tsx', execContent);

let dashContent = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
dashContent = dashContent.replace(/action,/g, 'type: action,');
// wait, the parameter is `action: 'BUY' | 'SELL'`, so `action,` was shorthand for `action: action`. 
fs.writeFileSync('src/components/Dashboard.tsx', dashContent);

