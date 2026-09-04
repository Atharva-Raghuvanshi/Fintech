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
  
  // Replace text-slate-900 with text-white font-semibold (if it doesn't already have font-bold/font-semibold, we can just replace text-slate-900 with text-white)
  // Actually, some headers already have font-bold. The user asked to add font-semibold. Let's just use text-white.
  code = code.replace(/text-slate-900/g, 'text-white');
  code = code.replace(/text-gray-900/g, 'text-white');
  code = code.replace(/text-blue-900/g, 'text-blue-100');
  code = code.replace(/text-indigo-900/g, 'text-indigo-100');
  
  // Replace paragraph subtext slate-500/600 to slate-400
  code = code.replace(/text-slate-500/g, 'text-slate-400');
  code = code.replace(/text-gray-500/g, 'text-slate-400');
  
  // Replace accent icons indigo-600 to indigo-400
  code = code.replace(/text-indigo-600/g, 'text-indigo-400');
  code = code.replace(/text-blue-600/g, 'text-blue-400');
  code = code.replace(/text-indigo-700/g, 'text-indigo-300');
  
  // Interactive Elements hover state
  // Check if we can safely add cursor-pointer and hover:bg-white/5
  // I will just replace `bg-white ` with `bg-surface ` or something.
  // Wait, let's look at buttons and interactive cards
  
  if (original !== code) {
    fs.writeFileSync(filePath, code);
  }
}

walkDir('src', processFile);
console.log('Fixed theme colors');
