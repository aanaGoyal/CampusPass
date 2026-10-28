import { memo } from 'react';

// Category posters: pure SVG, no assets. Cobalt leads, vermilion appears once per poster, ink for structure.
const C = '#315BE8', V = '#E65A43', I = '#20211F';
const bars = [18, 44, 30, 62, 80, 50, 70, 36, 56, 24, 40, 14];

function Art({ category }) {
  switch (category) {
    case 'Music':
      return <>{bars.map((h, i) => <rect key={i} x={10 + i * 15} y={60 - h / 2} width="8" height={h} fill={i === 4 ? V : C} />)}</>;
    case 'Technology':
      return <>
        {Array.from({ length: 8 }).flatMap((_, r) => Array.from({ length: 13 }).map((__, c) => <circle key={`${r}-${c}`} cx={14 + c * 14} cy={12 + r * 14} r="1.4" fill={I} opacity=".5" />))}
        <path d="M14 96 H56 V54 H98 V26 H154" fill="none" stroke={C} strokeWidth="2.5" />
        <rect x="150" y="22" width="9" height="9" fill={V} />
      </>;
    case 'Culture':
      return <>
        <text x="8" y="104" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="118" fill={C}>Aa</text>
        <line x1="112" y1="24" x2="188" y2="24" stroke={I} strokeWidth="1.5" /><line x1="112" y1="32" x2="170" y2="32" stroke={I} strokeWidth="1.5" />
        <circle cx="176" cy="92" r="9" fill={V} />
      </>;
    case 'Sports':
      return <>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${10 + i * 22} 108 L${52 + i * 22} 12 H${72 + i * 22} L${30 + i * 22} 108Z`} fill={i === 3 ? V : C} opacity={i === 3 ? 1 : 0.28 + i * 0.24} />)}
      </>;
    case 'Workshop':
      return <>
        <rect x="20" y="16" width="120" height="88" fill="none" stroke={I} strokeWidth="1.5" />
        <rect x="44" y="38" width="72" height="44" fill={C} />
        <line x1="20" y1="112" x2="140" y2="112" stroke={I} /><line x1="150" y1="16" x2="150" y2="104" stroke={I} />
        <circle cx="116" cy="38" r="6" fill={V} />
        <line x1="44" y1="60" x2="16" y2="60" stroke={I} strokeDasharray="3 3" />
      </>;
    default: // Festival and anything unrecognised
      return <>
        <circle cx="70" cy="60" r="44" fill={C} /><rect x="76" y="20" width="84" height="80" fill={V} style={{ mixBlendMode: 'multiply' }} />
        <path d="M120 104 A36 36 0 0 1 192 104Z" fill={I} />
      </>;
  }
}

function Graphic({ category, className = '' }) {
  return (
    <svg viewBox="0 0 200 120" role="img" aria-label={`${category} event artwork`} preserveAspectRatio="xMidYMid slice" className={`block h-full w-full bg-paper ${className}`}>
      <Art category={category} />
    </svg>
  );
}
export default memo(Graphic);
