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
  FileSpreadsheet
} from 'lucide-react';
import { cn, togglePrivacyMode, isPrivacyMode } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const { logout } = useAuth();
  const [privacy, setPrivacy] = useState(isPrivacyMode);

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
    <div className="w-[220px] h-screen border-r border-white/5 bg-base flex flex-col fixed left-0 top-0">
      <div className="h-16 border-b border-white/5 flex items-center px-6">
        <h1 className="text-[15px] font-bold tracking-tight text-text-primary flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-[1px] rotate-45"></div>
          </div>
          PWIS <span className="text-text-tertiary font-normal">v2</span>
        </h1>
      </div>
      
      <div className="py-4 px-3 flex-1 overflow-y-auto space-y-0.5">
        <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider px-3 mb-2 mt-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
              isActive 
                ? "bg-primary text-white shadow-sm" 
                : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 space-y-1">
        <button 
          onClick={handlePrivacyToggle} 
          className={cn(
            "flex items-center justify-between px-3 py-2 w-full rounded-lg text-[13px] font-medium transition-colors border",
            privacy 
              ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" 
              : "text-text-secondary border-transparent hover:bg-white/5 hover:text-text-primary"
          )}
        >
          <div className="flex items-center gap-3">
            {privacy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {privacy ? 'Lock ON' : 'Privacy Lock'}
          </div>
        </button>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[13px] font-medium text-text-secondary hover:bg-white/5 hover:text-negative transition-colors">
          <LogOut className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
