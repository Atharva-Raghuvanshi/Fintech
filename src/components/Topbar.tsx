import React from 'react';
import { Search, Bell, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PeriodToggle } from './ui/Card';

export function Topbar() {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b border-white/5 bg-base/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex-1 max-w-xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search assets, trades, or ask AI..." 
            className="w-full bg-surface border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-white/10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block bg-black/40 border border-white/5 rounded px-1.5 text-[10px] text-text-tertiary font-mono">⌘K</kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <PeriodToggle 
          options={['Weekly', 'Monthly', 'Yearly', 'Range']}
          active="Monthly"
          onChange={() => {}}
        />
        
        <div className="flex items-center gap-4 pl-4 border-l border-white/5">
          <button className="relative text-text-tertiary hover:text-text-primary transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-base"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface border border-white/10 overflow-hidden flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[11px] font-medium text-text-secondary">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
