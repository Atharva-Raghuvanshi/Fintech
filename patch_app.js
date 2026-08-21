import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Topbar import
content = content.replace(
  "import { Sidebar } from './components/Sidebar';",
  "import { Sidebar } from './components/Sidebar';\nimport { Topbar } from './components/Topbar';"
);

// Replace layout structure
const oldLayoutRegex = /<div className="flex h-screen bg-slate-50">[\s\S]*?<Sidebar \/>[\s\S]*?<main className="flex-1 ml-64 overflow-y-auto">[\s\S]*?<div className="p-8">/m;
if (content.match(oldLayoutRegex)) {
  content = content.replace(oldLayoutRegex, `<div className="flex h-screen overflow-hidden bg-base text-text-primary">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6 space-y-6">`);
} else {
  console.log("Could not find layout regex");
}

fs.writeFileSync('src/App.tsx', content);
