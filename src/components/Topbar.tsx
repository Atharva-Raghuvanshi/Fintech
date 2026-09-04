import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, TrendingUp, History, Bot, ArrowRight, Hexagon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PeriodToggle } from './ui/Card';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/insights');
      setSearchQuery('');
      inputRef.current?.blur();
      setIsSearchFocused(false);
    }
  };

  const handleSelectResult = (path: string) => {
    navigate(path);
    setSearchQuery('');
    inputRef.current?.blur();
    setIsSearchFocused(false);
  };

  return (
    <header className="h-16 glass-nav flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex-1 max-w-2xl flex items-center gap-4 relative">
        <div className="flex items-center gap-3 mr-6">
          <Hexagon className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
          <div className="h-5 w-[2px] bg-gray-700 rounded-full"></div>
          <span className="text-2xl text-white tracking-wider pb-1" style={{ fontFamily: "'Yatra One', system-ui" }}>धन दृष्टि</span>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            ref={inputRef}
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={handleSearchEnter}
            placeholder="Search assets, trades, or ask AI..." 
            className="w-full bg-surface border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-white/10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block bg-black/40 border border-white/5 rounded px-1.5 text-[10px] text-text-tertiary font-mono">⌘K</kbd>
          </div>
        </div>

        {isSearchFocused && (
          <div className="absolute top-full left-0 w-full mt-2 glass-modal overflow-hidden z-50">
            {searchQuery.trim() ? (
              <div className="flex flex-col">
                <button 
                  onClick={() => handleSelectResult('/execution')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors border-b border-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-text-primary truncate font-medium">Search Assets: "{searchQuery}"</div>
                    <div className="text-[11px] text-text-tertiary truncate">Trade & Execute</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-tertiary" />
                </button>
                <button 
                  onClick={() => handleSelectResult('/trades')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors border-b border-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-positive/10 text-positive flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-text-primary truncate font-medium">Search Ledger: "{searchQuery}"</div>
                    <div className="text-[11px] text-text-tertiary truncate">View historical transactions</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-tertiary" />
                </button>
                <button 
                  onClick={() => handleSelectResult('/insights')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-text-primary truncate font-medium">Ask Virtual CA</div>
                    <div className="text-[11px] text-text-tertiary truncate">"{searchQuery}"</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-[12px] text-text-tertiary">
                Type to search across the platform or interact with AI.
              </div>
            )}
          </div>
        )}
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
