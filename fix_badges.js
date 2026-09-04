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
  
  // Emerald
  code = code.replace(/bg-emerald-50\b/g, 'bg-emerald-500/10');
  code = code.replace(/bg-emerald-100\b/g, 'bg-emerald-500/20');
  code = code.replace(/text-emerald-700/g, 'text-emerald-400');
  code = code.replace(/text-emerald-600/g, 'text-emerald-400');
  code = code.replace(/border-emerald-200/g, 'border-emerald-500/20');
  code = code.replace(/hover:shadow-emerald-200/g, 'hover:shadow-emerald-500/20');
  
  // Rose
  code = code.replace(/bg-rose-50\b/g, 'bg-rose-500/10');
  code = code.replace(/bg-rose-100\b/g, 'bg-rose-500/20');
  code = code.replace(/text-rose-700/g, 'text-rose-400');
  code = code.replace(/text-rose-600/g, 'text-rose-400');
  code = code.replace(/border-rose-200/g, 'border-rose-500/20');
  code = code.replace(/hover:shadow-rose-200/g, 'hover:shadow-rose-500/20');

  // Amber
  code = code.replace(/bg-amber-50\b/g, 'bg-amber-500/10');
  code = code.replace(/bg-amber-100\b/g, 'bg-amber-500/20');
  code = code.replace(/text-amber-700/g, 'text-amber-400');
  code = code.replace(/text-amber-600/g, 'text-amber-400');
  code = code.replace(/border-amber-200/g, 'border-amber-500/20');
  
  // Indigo
  code = code.replace(/bg-indigo-50\b/g, 'bg-indigo-500/10');
  code = code.replace(/bg-indigo-100\b/g, 'bg-indigo-500/20');
  code = code.replace(/border-indigo-200/g, 'border-indigo-500/20');
  code = code.replace(/border-indigo-300/g, 'border-indigo-500/30');
  code = code.replace(/ring-indigo-500\/20/g, 'ring-indigo-500/40');
  
  // Slate
  code = code.replace(/bg-slate-200/g, 'bg-white/10');
  code = code.replace(/bg-slate-300/g, 'bg-white/20');
  code = code.replace(/text-slate-800/g, 'text-slate-300');
  code = code.replace(/text-emerald-800/g, 'text-emerald-300');
  
  if (original !== code) {
    fs.writeFileSync(filePath, code);
  }
}

walkDir('src', processFile);
console.log('Fixed badges');
