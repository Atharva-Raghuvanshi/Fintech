import fs from 'fs';

let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

content = content.replace(
  "import { initializeApp, FirebaseApp } from 'firebase/app';",
  "import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';"
);

const initBlock = `if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDatabaseId || undefined);`;

const newInitBlock = `if (firebaseConfig.apiKey) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDatabaseId || undefined);
  } else {
    app = getApp();
    db = getFirestore(app, firestoreDatabaseId || undefined);
  }
  auth = getAuth(app);`;

content = content.replace(initBlock, newInitBlock);

fs.writeFileSync('src/lib/firebase.ts', content);
