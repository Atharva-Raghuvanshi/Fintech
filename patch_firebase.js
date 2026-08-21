const fs = require('fs');
const content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
const newContent = content.replace(
  "import { getFirestore, Firestore } from 'firebase/firestore';",
  "import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';"
).replace(
  "db = getFirestore(app, firestoreDatabaseId || undefined);",
  "db = initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDatabaseId || undefined);"
);
fs.writeFileSync('src/lib/firebase.ts', newContent);
