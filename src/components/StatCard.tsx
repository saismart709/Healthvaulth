import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  badgeType?: 'up' | 'down';
  colorClass?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  value, 
  label, 
  badge, 
  badgeType, 
  colorClass = 'blue',
  trend 
}) => {
  const bgClasses = {
    blue: 'bg-primary-bg text-primary',
    teal: 'bg-teal-bg text-teal-custom',
    amber: 'bg-amber-bg text-amber-custom',
    purple: 'bg-purple-bg text-purple-custom',
    red: 'bg-red-bg text-red-custom',
    green: 'bg-green-bg text-green-custom'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="stat-card group relative overflow-hidden transition-all duration-300"
    >
      <div className={`stat-ico w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${bgClasses[colorClass as keyof typeof bgClasses]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="stat-val text-3xl font-extrabold tracking-tight leading-none text-text-custom">{value}</div>
          {badge && (
            <div className={`stat-badge text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full ${badgeType === 'up' ? 'bg-green-bg text-green-custom' : 'bg-red-bg text-red-custom'}`}>
              {badgeType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {badge}
            </div>
          )}
        </div>
        <div className="stat-lbl text-[13px] text-text-3 font-semibold tracking-wide uppercase">{label}</div>
        {trend && <div className="text-[11px] text-text-2 mt-2 font-medium opacity-60">{trend}</div>}
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${bgClasses[colorClass as keyof typeof bgClasses].split(' ')[0]}`}></div>
    </motion.div>
  );
};
