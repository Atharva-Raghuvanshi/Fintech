import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let original = code;
  
  code = code.replace(/text-indigo-800/g, 'text-indigo-200');
  
  if (original !== code) {
    fs.writeFileSync(filePath, code);
  }
}

walkDir('src', processFile);
console.log('Fixed indigo 800');
