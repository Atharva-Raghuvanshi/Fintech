const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/const \[hasEntered, setHasEntered\] = useState\(false\);/, 'const [hasEntered, setHasEntered] = useState(true);');
fs.writeFileSync('src/App.tsx', code);
