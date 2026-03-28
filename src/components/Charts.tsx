import React from 'react';

export const BarChart: React.FC<{ data: number[], color?: string }> = ({ data, color = '#2563eb' }) => {
  const max = Math.max(...data);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  
  return (
    <svg viewBox={`0 0 ${data.length * 40} 160`} className="w-full h-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = max ? (v / max) * 120 : 0;
        const x = i * 40 + 4;
        return (
          <rect
            key={i}
            x={x}
            y={140 - h}
            width="32"
            height={h}
            fill={color}
            rx="6"
            className="transition-all duration-500 ease-out"
            opacity={0.3 + 0.7 * (v / max)}
          />
        );
      })}
    </svg>
  );
};

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  color = '#2563eb', 
  height = 120, 
  showGrid = true 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 400;
  const H = height;
  const pad = 10;
  
  const pts = data.map((v, i) => {
    const x = pad + i * ((W - 2 * pad) / (data.length - 1));
    const y = pad + (1 - (v - min) / (max - min || 1)) * (H - 2 * pad);
    return [x, y];
  });
  
  const d = pts.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(' ');
  const area = `${d} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {showGrid && (
        <g stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5">
          {[0, 0.25, 0.5, 0.75, 1].map(p => (
            <line key={p} x1={pad} y1={pad + p * (H - 2 * pad)} x2={W - pad} y2={pad + p * (H - 2 * pad)} />
          ))}
        </g>
      )}
      <path d={area} fill={`url(#lg-${color})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {!showGrid && (
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill={color} />
      )}
    </svg>
  );
};

export const DonutChart: React.FC<{ segments?: { v: number, c: string }[] }> = ({ segments }) => {
  const segs = segments || [
    { v: 35, c: '#2563eb' },
    { v: 25, c: '#f59e0b' },
    { v: 20, c: '#10b981' },
    { v: 20, c: '#ef4444' }
  ];
  const total = segs.reduce((a, s) => a + s.v, 0);
  let start = -90;
  
  return (
    <svg viewBox="0 0 140 140" className="w-[140px] h-[140px] shrink-0 transform hover:scale-105 transition-transform duration-300">
      {segs.map((s, i) => {
        const angle = (s.v / total) * 360;
        const r = 55, cx = 70, cy = 70;
        const x1 = cx + r * Math.cos((start * Math.PI) / 180);
        const y1 = cy + r * Math.sin((start * Math.PI) / 180);
        start += angle;
        const x2 = cx + r * Math.cos((start * Math.PI) / 180);
        const y2 = cy + r * Math.sin((start * Math.PI) / 180);
        const large = angle > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
            fill={s.c}
            className="transition-all duration-300 hover:opacity-100 opacity-90 cursor-pointer"
          />
        );
      })}
      <circle cx="70" cy="70" r="35" fill="white" className="dark:fill-card-custom transition-colors" />
    </svg>
  );
};
