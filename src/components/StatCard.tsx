import React from 'react';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  badge?: string;
  badgeType?: 'up' | 'down';
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, badge, badgeType, colorClass = 'blue' }) => {
  const bgClasses = {
    blue: 'bg-primary-bg',
    teal: 'bg-teal-bg',
    amber: 'bg-amber-bg',
    purple: 'bg-purple-bg',
    red: 'bg-red-bg',
    green: 'bg-green-bg'
  };

  return (
    <div className="stat-card">
      <div className={`stat-ico w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgClasses[colorClass as keyof typeof bgClasses]}`}>
        {icon}
      </div>
      <div>
        <div className="stat-val text-2xl font-extrabold tracking-tight leading-none">{value}</div>
        <div className="stat-lbl text-xs text-gray-500 font-medium mt-1">{label}</div>
      </div>
      {badge && (
        <div className={`stat-badge ml-auto text-[11px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${badgeType === 'up' ? 'bg-green-bg text-green-custom' : 'bg-red-bg text-red-custom'}`}>
          {badgeType === 'up' ? '↑' : '↓'} {badge}
        </div>
      )}
    </div>
  );
};
