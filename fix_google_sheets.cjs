const fs = require('fs');
let code = fs.readFileSync('src/components/GoogleSheetsSync.tsx', 'utf-8');
code = code.replace(/import { getAccessToken, loginWithGoogle } from '\.\.\/lib\/firebase';\n/, '');

code = code.replace(/await loginWithGoogle\(\);/, 'console.log("Mock loginWithGoogle");');
code = code.replace(/const token = await getAccessToken\(\);/, 'const token = "mock_token";');

fs.writeFileSync('src/components/GoogleSheetsSync.tsx', code);
