import fs from 'fs';

let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const newInitBlock = `if (firebaseConfig.apiKey) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app, firestoreDatabaseId || undefined);`;

// Let's replace everything from 'if (firebaseConfig.apiKey) {' up to 'onAuthStateChanged'
const blockRegex = /if \(firebaseConfig\.apiKey\) \{[\s\S]*?auth = getAuth\(app\);/m;
content = content.replace(blockRegex, newInitBlock);

fs.writeFileSync('src/lib/firebase.ts', content);
