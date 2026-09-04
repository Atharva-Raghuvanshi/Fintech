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
  
  // Replace card backgrounds
  code = code.replace(/bg-white\b(?!\/[0-9])/g, 'bg-surface');
  code = code.replace(/border-slate-200/g, 'border-white/10');
  code = code.replace(/border-slate-100/g, 'border-white/5');
  code = code.replace(/bg-slate-50\b(?!\/[0-9])/g, 'bg-white/5');
  code = code.replace(/bg-slate-100/g, 'bg-white/10');
  code = code.replace(/hover:bg-slate-50\b(?!\/[0-9])/g, 'hover:bg-white/5 cursor-pointer');
  code = code.replace(/hover:bg-slate-100/g, 'hover:bg-white/10 cursor-pointer');
  code = code.replace(/shadow-sm/g, 'shadow-md shadow-black/20');
  
  if (original !== code) {
    fs.writeFileSync(filePath, code);
  }
}

walkDir('src', processFile);
console.log('Fixed cards');
