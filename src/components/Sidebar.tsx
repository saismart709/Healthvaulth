import React from 'react';
import { NavSection } from '../navConfig';
import { User } from '../types';

interface SidebarProps {
  navConfig: NavSection[];
  activePage: string;
  onNavigate: (page: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ navConfig, activePage, onNavigate, user, onLogout, isOpen }) => {
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`sidebar fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-[200] transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[var(--sidebar-w)]`}>
      <div className="sidebar-header p-5 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="sidebar-icon w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-lg shrink-0">🏥</div>
        <div className="sidebar-name text-white font-extrabold text-base tracking-tight">Health<span className="text-[#64B5FF]">Vault</span></div>
      </div>
      
      <nav className="sidebar-nav flex-1 p-3.5 overflow-y-auto scrollbar-hide">
        {navConfig.map((section, idx) => (
          <div key={idx} className="nav-section mb-2">
            <div className="nav-section-label text-[10px] font-bold uppercase tracking-[1.2px] text-white/25 px-2.5 pt-2 pb-1">
              {section.section}
            </div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item flex items-center gap-2.5 p-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all relative ${activePage === item.id ? 'active bg-primary/20 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/85'}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon text-base w-5 text-center shrink-0">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge ml-auto bg-red-custom text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom p-3 border-t border-sidebar-border">
        <div className="sidebar-user flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
          <div className="su-avatar w-8.5 h-8.5 rounded-full flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-primary to-teal-custom shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="su-name text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="su-role text-[10px] text-white/35 capitalize">{user.role}</div>
          </div>
          <button className="su-logout ml-auto bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-md w-7 h-7 text-white/40 text-sm flex items-center justify-center transition-all" onClick={onLogout} title="Logout">
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
};
