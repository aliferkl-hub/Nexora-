import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'symbol' | 'stacked';
  withSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NexoraSymbol: React.FC<{ sizePx?: number; className?: string }> = ({ 
  sizePx = 36, 
  className = '' 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-md pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Vector Futuristic Nexus Emblem */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_2px_12px_rgba(0,240,255,0.4)]"
      >
        <defs>
          <linearGradient id="nx-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nx-grad-play" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A5F3FC" />
          </linearGradient>
          <linearGradient id="nx-grad-edge" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Prism Hex-Diamond Geometry */}
        <path 
          d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" 
          stroke="url(#nx-grad-edge)" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
          className="opacity-90"
        />

        {/* Futuristic Stylized 'N' Wings intersecting */}
        <path 
          d="M28 32 L28 68 L44 48 L44 32 Z" 
          fill="url(#nx-grad-main)" 
          opacity="0.9"
        />
        <path 
          d="M56 68 L56 52 L72 32 L72 68 Z" 
          fill="url(#nx-grad-main)" 
          opacity="0.9"
        />

        {/* Forward Play Energy Prism Diamond in Center */}
        <polygon 
          points="46,38 68,50 46,62" 
          fill="url(#nx-grad-play)" 
          className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        />

        {/* Top & Bottom Vertex Nodes */}
        <circle cx="50" cy="6" r="3" fill="#00F0FF" />
        <circle cx="50" cy="94" r="3" fill="#8B5CF6" />
      </svg>
    </div>
  );
};

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  variant = 'full',
  withSlogan = false,
  className = '',
  onClick
}) => {
  // Dimensions
  const symbolSize = {
    sm: 26,
    md: 34,
    lg: 44,
    xl: 56,
    hero: 72
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-4xl md:text-5xl'
  }[size];

  const playBadgeSize = {
    sm: 'text-[9px] px-1.5 py-0.2',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-0.5',
    xl: 'text-sm px-3 py-1',
    hero: 'text-base px-3.5 py-1'
  }[size];

  if (variant === 'symbol') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center cursor-pointer ${className}`}
        role={onClick ? 'button' : undefined}
      >
        <NexoraSymbol sizePx={symbolSize} />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick} 
      className={`inline-flex ${variant === 'stacked' ? 'flex-col items-center text-center' : 'items-center gap-2.5'} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
    >
      <NexoraSymbol sizePx={symbolSize} />

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-display font-extrabold tracking-wider text-white ${textSize} uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}
            style={{ letterSpacing: '0.08em' }}
          >
            NEXORA
          </span>
          <span 
            className={`font-sans font-bold tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 rounded font-mono ${playBadgeSize} shadow-sm shadow-cyan-500/20`}
            style={{ letterSpacing: '0.12em' }}
          >
            PLAY
          </span>
        </div>

        {withSlogan && (
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wider uppercase mt-1">
            Seu entretenimento. Do seu jeito.
          </span>
        )}
      </div>
    </div>
  );
};
