import React from 'react';
import { User } from '../types';

interface TopbarProps {
  pageName: string;
  user: User;
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
  onToggleNotifications: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ pageName, user, onNavigate, onToggleSidebar, onToggleNotifications }) => {
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="topbar h-[var(--topbar-h)] bg-white border-b border-border-custom flex items-center px-6 gap-4 sticky top-0 z-[100] shadow-sm">
      <button className="mobile-menu-btn md:hidden bg-transparent border-none text-xl text-text-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100" onClick={onToggleSidebar}>
        ☰
      </button>
      
      <div className="topbar-breadcrumb text-[13px] font-semibold text-text-2">
        <span className="text-text-3 font-normal">HealthVault</span> / <span>{pageName}</span>
      </div>
      
      <div className="topbar-search hidden md:flex items-center gap-2 bg-bg-custom border border-border-custom rounded-lg px-3 py-1.5 ml-auto w-[260px] focus-within:border-primary focus-within:bg-white focus-within:ring-3 focus-within:ring-primary/10 transition-all">
        <span>🔍</span>
        <input type="text" placeholder="Search patients, records, files..." className="border-none bg-transparent text-[13px] text-text-custom outline-none w-full" />
      </div>
      
      <div className="topbar-actions flex items-center gap-2 ml-auto md:ml-0">
        <div className="relative">
          <button className="icon-btn w-9 h-9 rounded-lg border border-border-custom bg-white flex items-center justify-center text-base hover:bg-bg-custom hover:border-primary transition-all relative" onClick={onToggleNotifications}>
            🔔
            <div className="dot absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-custom rounded-full border-1.5 border-white"></div>
          </button>
        </div>
        
        <button className="icon-btn w-9 h-9 rounded-lg border border-border-custom bg-white flex items-center justify-center text-base hover:bg-bg-custom hover:border-primary transition-all" onClick={() => onNavigate('settings')}>
          ⚙️
        </button>
        
        <div className="topbar-avatar w-9 h-9 rounded-full bg-gradient-to-br from-primary to-teal-custom flex items-center justify-center text-[13px] font-bold text-white cursor-pointer border-2 border-transparent hover:border-primary transition-all" onClick={() => onNavigate('settings')}>
          {initials}
        </div>
      </div>
    </header>
  );
};
