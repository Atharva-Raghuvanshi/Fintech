import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Calculator, 
  Settings,
  Users,
  Target,
  Landmark,
  Lightbulb,
  LogOut,
  EyeOff,
  Eye,
  History,
  Database,
  FileSpreadsheet,
  Menu,
  X
} from 'lucide-react';
import { cn, togglePrivacyMode, isPrivacyMode } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const { logout } = useAuth();
  const [privacy, setPrivacy] = useState(isPrivacyMode);
  const [isOpen, setIsOpen] = useState(false);

  const handlePrivacyToggle = () => {
    togglePrivacyMode();
    setPrivacy(isPrivacyMode);
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/family', icon: Users, label: 'Family' },
    { to: '/banking', icon: Landmark, label: 'Banking' },
    { to: '/tax', icon: Calculator, label: 'Tax' },
    { to: '/trades', icon: History, label: 'Trades' },
    { to: '/execution', icon: ArrowRightLeft, label: 'Execution' },
    { to: '/export', icon: FileSpreadsheet, label: 'Export' },
    { to: '/audit', icon: Database, label: 'Audit' },
  ];

  return (
    <>
      {/* Backdrop for open state */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar - Collapsed/Expanded */}
      <div 
        className={cn(
          "h-screen border-r border-white/5 bg-base flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "w-[220px]" : "w-[64px]"
        )}
      >
        <div className="h-16 border-b border-white/5 flex items-center justify-center px-4 shrink-0">
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="bg-transparent flex items-center h-8">
                <img 
                  src="/Ams Bhumi_preview_bg.png" 
                  alt="Dhan Drishti Logo" 
                  className="h-8 w-auto object-contain brightness-0 invert" 
                />
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsOpen(true)} className="flex items-center justify-center w-8 h-8 hover:opacity-90 transition-opacity bg-transparent overflow-hidden">
              <img 
                src="/Ams Bhumi_preview_bg.png" 
                alt="Dhan Drishti Logo" 
                className="h-8 w-auto object-contain brightness-0 invert max-w-none" 
              />
            </button>
          )}
        </div>
        
        <div className="py-4 px-2 flex-1 overflow-y-auto overflow-x-hidden space-y-1">
          {isOpen && <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider px-3 mb-2 mt-2">Menu</div>}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center rounded-lg text-[13px] font-medium transition-colors group",
                isOpen ? "gap-3 px-3 py-2" : "justify-center py-3",
                isActive 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              )}
              title={!isOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="p-2 border-t border-white/5 space-y-1">
          <button 
            onClick={handlePrivacyToggle} 
            className={cn(
              "flex items-center rounded-lg text-[13px] font-medium transition-colors border",
              isOpen ? "gap-3 px-3 py-2 justify-between w-full" : "justify-center py-3 w-full",
              privacy 
                ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" 
                : "text-text-secondary border-transparent hover:bg-white/5 hover:text-text-primary"
            )}
            title={!isOpen ? (privacy ? 'Lock ON' : 'Privacy Lock') : undefined}
          >
            <div className="flex items-center gap-3">
              {privacy ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {isOpen && (privacy ? 'Lock ON' : 'Privacy Lock')}
            </div>
          </button>
          <button 
            onClick={logout} 
            className={cn(
              "flex items-center rounded-lg text-[13px] font-medium text-text-secondary hover:bg-white/5 hover:text-negative transition-colors",
              isOpen ? "gap-3 px-3 py-2 w-full" : "justify-center py-3 w-full"
            )}
            title={!isOpen ? 'Settings / Sign out' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Settings</span>}
          </button>
        </div>
      </div>
    </>
  );
}
