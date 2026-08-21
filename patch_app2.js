import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Topbar import
if (!content.includes("Topbar")) {
  content = content.replace(
    "import { Sidebar } from './components/Sidebar';",
    "import { Sidebar } from './components/Sidebar';\nimport { Topbar } from './components/Topbar';"
  );
}

const newLayout = `<BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-base text-text-primary">
        <Sidebar />
        <div className="flex-1 ml-[220px] flex flex-col overflow-hidden" key={privacyToggleRender}>
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-6">
              <Routes>`;

content = content.replace(
  /<BrowserRouter>[\s\S]*?<Routes>/m,
  newLayout
);

const endLayout = `              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>`;

content = content.replace(
  /<\/Routes>[\s\S]*?<\/BrowserRouter>/m,
  endLayout
);

content = content.replace(/bg-slate-50/g, 'bg-base');

fs.writeFileSync('src/App.tsx', content);
