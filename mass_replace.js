const fs = require('fs');
const glob = require('glob');

// We use the glob pattern to find all tsx files in src/components
const files = glob.sync('src/components/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // We want to replace standard bg-surface border/shadow combos with our glass classes
  // Typically they look like: className="bg-surface rounded-xl border border-white/10 shadow-md shadow-black/20"
  // or "bg-slate-900 rounded-xl p-6 text-white shadow-lg"
  
  // A naive approach: Let's replace card definitions in ui/Card.tsx first
  if (file.includes('ui/Card.tsx')) {
    content = content.replace(/bg-surface border border-white\/5 rounded-2xl overflow-hidden relative group transition-colors duration-200/, 'glass-panel overflow-hidden relative group transition-all duration-300');
    content = content.replace(/\$\{elevated \? 'bg-elevated shadow-inner shadow-white\/5' : 'hover:bg-elevated\/50'\}/, "${elevated ? 'glass-panel-heavy' : 'hover:glass-panel-heavy'}");
  }

  content = content.replace(/bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800/g, 'glass-panel overflow-hidden');
  content = content.replace(/bg-slate-900 rounded-xl p-6 text-white shadow-md shadow-black\/20/g, 'glass-panel p-6 text-white');
  content = content.replace(/bg-slate-900 rounded-xl p-6 text-white shadow-lg/g, 'glass-panel p-6 text-white');
  content = content.replace(/bg-surface rounded-xl border border-white\/10 shadow-md shadow-black\/20/g, 'glass-panel');
  content = content.replace(/bg-surface border border-white\/10 rounded-xl shadow-md shadow-black\/20/g, 'glass-panel');
  content = content.replace(/bg-surface border border-white\/10 rounded-xl p-6 shadow-md shadow-black\/20/g, 'glass-panel p-6');
  
  fs.writeFileSync(file, content);
});
console.log("Done");
