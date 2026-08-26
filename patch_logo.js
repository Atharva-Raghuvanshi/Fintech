import fs from 'fs';

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const oldLogo = `<div className="flex items-center justify-between w-full">
              <h1 className="text-[15px] font-bold tracking-tight text-text-primary flex items-center gap-2.5">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-[1px] rotate-45"></div>
                </div>
                Dhan Drishti
              </h1>`;

const newLogo = `<div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-1 ring-white/20">
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent font-serif text-[22px] tracking-wide mt-1">
                    धन दृष्टि
                  </span>
                </div>
              </h1>`;

sidebar = sidebar.replace(oldLogo, newLogo);

// Also replace the collapsed state logo
const oldCollapsed = `<button onClick={() => setIsOpen(true)} className="text-text-tertiary hover:text-text-primary flex items-center justify-center w-8 h-8">
              <Menu className="w-5 h-5" />
            </button>`;

const newCollapsed = `<button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 shadow-lg shadow-orange-500/30 ring-1 ring-white/20 hover:opacity-90 transition-opacity">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </button>`;
sidebar = sidebar.replace(oldCollapsed, newCollapsed);

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
