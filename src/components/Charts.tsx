import React from 'react';

export const BarChart: React.FC<{ data: number[], color?: string }> = ({ data, color = '#0066FF' }) => {
  const max = Math.max(...data);
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  
  return (
    <svg viewBox={`0 0 ${data.length * 38} 160`} className="w-full h-40">
      {data.map((v, i) => {
        const h = max ? (v / max) * 120 : 0;
        const x = i * (32 + 6) + 6;
        return (
          <rect
            key={i}
            x={x}
            y={140 - h}
            width="32"
            height={h}
            fill={color}
            rx="4"
            opacity={0.5 + 0.5 * (v / max)}
          />
        );
      })}
      {labels.slice(0, data.length).map((l, i) => (
        <text
          key={i}
          x={i * (32 + 6) + 22}
          y="155"
          textAnchor="middle"
          fontSize="9"
          fill="#9AA5B4"
        >
          {l}
        </text>
      ))}
    </svg>
  );
};

export const LineChart: React.FC<{ data: number[], color?: string }> = ({ data, color = '#00C9A7' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 320;
  const H = 120;
  const pad = 8;
  
  const pts = data.map((v, i) => {
    const x = pad + i * ((W - 2 * pad) / (data.length - 1));
    const y = pad + (1 - (v - min) / (max - min || 1)) * (H - 2 * pad);
    return [x, y];
  });
  
  const d = pts.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(' ');
  const area = `${d} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[140px]">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)"/>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} stroke="white" strokeWidth="1.5"/>
      ))}
    </svg>
  );
};

export const DonutChart: React.FC<{ segments?: { v: number, c: string }[] }> = ({ segments }) => {
  const segs = segments || [
    { v: 35, c: '#0066FF' },
    { v: 25, c: '#FF8B00' },
    { v: 20, c: '#00B37E' },
    { v: 20, c: '#FF3B3B' }
  ];
  const total = segs.reduce((a, s) => a + s.v, 0);
  let start = -90;
  
  return (
    <svg viewBox="0 0 130 130" className="w-[130px] h-[130px] shrink-0">
      <circle cx="65" cy="65" r="50" fill="white"/>
      {segs.map((s, i) => {
        const angle = (s.v / total) * 360;
        const r = 50, cx = 65, cy = 65;
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
            opacity="0.9"
          />
        );
      })}
      <circle cx="65" cy="65" r="30" fill="white"/>
    </svg>
  );
};
