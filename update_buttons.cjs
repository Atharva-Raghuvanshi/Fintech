const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace primary solid buttons with our glass-button variations
  content = content.replace(/bg-indigo-600 hover:bg-indigo-700/g, 'glass-button-amber text-amber-500 font-bold');
  content = content.replace(/bg-indigo-500 hover:bg-indigo-600/g, 'glass-button-amber text-amber-500 font-bold');
  content = content.replace(/bg-emerald-600 hover:bg-emerald-700/g, 'glass-button text-emerald-400 font-bold');
  
  fs.writeFileSync(file, content);
});
console.log("Buttons updated");
