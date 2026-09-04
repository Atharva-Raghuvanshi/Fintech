const fs = require('fs');

function replaceInFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/user\.uid/g, 'user.id');
  fs.writeFileSync(file, code);
  console.log(`Updated ${file}`);
}

replaceInFile('src/components/Dashboard.tsx');
replaceInFile('src/components/ExecutionLayer.tsx');
