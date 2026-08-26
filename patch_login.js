import fs from 'fs';

let login = fs.readFileSync('src/components/Login.tsx', 'utf-8');

const oldLoginHeader = `<div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to Dhan Drishti</h1>`;

const newLoginHeader = `<div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-orange-500/30 ring-1 ring-white/20 mb-4">
            <div className="w-7 h-7 border-4 border-white rounded-md rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif flex flex-col items-center gap-1">
            <span className="text-sm font-sans text-slate-500 font-medium tracking-wide uppercase">Sign in to</span>
            <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 bg-clip-text text-transparent tracking-wide">
              धन दृष्टि
            </span>
          </h1>`;

login = login.replace(oldLoginHeader, newLoginHeader);
fs.writeFileSync('src/components/Login.tsx', login);
