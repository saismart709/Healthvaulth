import React from 'react';
import { NavSection } from '../navConfig';
import { User } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  navConfig: NavSection[];
  activePage: string;
  onNavigate: (page: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ navConfig, activePage, onNavigate, user, onLogout, isOpen, isCollapsed, onToggleCollapse }) => {
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={`sidebar fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-[200] transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[var(--sidebar-w)]`}>
      <div className={`sidebar-header flex items-center border-b border-sidebar-border relative transition-all duration-300 ${isCollapsed ? 'p-5 justify-center' : 'p-5'}`}>
        <div className="sidebar-icon w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-300">🏥</div>
        <div className={`sidebar-name text-white font-extrabold text-base tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-2.5'}`}>
          Health<span className="text-[#64B5FF]">Vault</span>
        </div>
        
        <button 
          className={`hidden md:flex absolute ${isCollapsed ? '-right-3' : 'right-4'} top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-primary text-white/50 hover:text-white items-center justify-center transition-colors shadow-sm z-10`}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      
      <nav className="sidebar-nav flex-1 p-3.5 overflow-y-auto scrollbar-hide">
        {navConfig.map((section, idx) => (
          <div key={idx} className="nav-section mb-2">
            <div className={`nav-section-label font-bold uppercase tracking-[1.2px] text-white/25 px-2.5 truncate transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0 py-0 text-[0px]' : 'max-h-10 opacity-100 pt-2 pb-1 text-[10px]'}`}>
              {section.section}
            </div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item flex items-center p-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-300 relative group ${activePage === item.id ? 'active bg-primary/20 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/85'} ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="nav-icon text-base w-5 text-center shrink-0 transition-transform duration-300">{item.icon}</span>
                <span className={`truncate transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'}`}>
                  {item.label}
                </span>
                
                {item.badge && (
                  <span className={`transition-all duration-300 flex items-center justify-center bg-red-custom relative ${isCollapsed ? 'absolute top-1 right-1 w-2 h-2 rounded-full' : 'ml-auto text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px]'}`}>
                    <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 text-[0px]' : 'opacity-100'}`}>
                      {item.badge}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom p-3 border-t border-sidebar-border">
        <div className={`sidebar-user flex items-center rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-300 ${isCollapsed ? 'justify-center py-2' : 'gap-2.5 p-2.5'}`}>
          <div className="su-avatar w-8.5 h-8.5 rounded-full flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-primary to-teal-custom shrink-0 transition-transform duration-300">
            {initials}
          </div>
          
          <div className={`overflow-hidden flex flex-col justify-center transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100 flex-1'}`}>
            <div className="su-name text-xs font-semibold text-white truncate">{user.name}</div>
            <div className="su-role text-[10px] text-white/35 capitalize truncate">{user.role}</div>
          </div>
          
          <button 
            className={`su-logout shrink-0 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-md h-7 text-white/40 text-sm flex items-center justify-center transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0 p-0 pointer-events-none' : 'w-7 opacity-100'}`} 
            onClick={onLogout} 
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
};
