import fs from 'fs';
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// Replace xl:col-span-9 with xl:col-span-12
content = content.replace(
  '<div className="xl:col-span-9 h-full min-h-0">',
  '<div className="xl:col-span-12 h-full min-h-0">'
);

// Remove the entire xl:col-span-3 block
const regex = /<div className="xl:col-span-3 h-full min-h-0 flex flex-col gap-4">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* ROW 2:/;
content = content.replace(regex, '</div>\n\n      {/* ROW 2:');

fs.writeFileSync('src/components/Dashboard.tsx', content);
