import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
content = content.replace(/  totalNetWorth: 10470000\n/g, "");
fs.writeFileSync('src/components/Dashboard.tsx', content);
