import fs from 'fs';

let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  /import \{ getAuth, initializeAuth, browserLocalPersistence, GoogleAuthProvider/g,
  'import { getAuth, initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, GoogleAuthProvider'
);

code = code.replace(
  /persistence: browserLocalPersistence\s*\}/g,
  'persistence: browserLocalPersistence,\n      popupRedirectResolver: browserPopupRedirectResolver\n    }'
);

fs.writeFileSync('src/lib/firebase.ts', code);
