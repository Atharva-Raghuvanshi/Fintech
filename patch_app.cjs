const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/if \(!user\) \{\s*return <Login \/>;\s*\}/, '');
fs.writeFileSync('src/App.tsx', code);
