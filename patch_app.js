import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace ml-[220px] with ml-[64px]
content = content.replace(/ml-\[220px\]/g, 'ml-[64px]');

// Replace p-6 with p-4 h-full
content = content.replace(/<div className="max-w-\[1600px\] mx-auto p-6">/g, '<div className="max-w-[1600px] mx-auto p-4 h-full">');

fs.writeFileSync('src/App.tsx', content);
