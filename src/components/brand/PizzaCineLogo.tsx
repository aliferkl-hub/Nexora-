import React from 'react';

interface PizzaCineLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'symbol' | 'stacked';
  withSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Pizza Cine Symbol:
 * Sophisticated vector emblem combining:
 * 1. Pizza slice geometry with modern curved crust
 * 2. Film reel sprocket perforations on the crust edge
 * 3. Film reel / pepperoni circular nodes
 * 4. Illuminated Play energy triangle in the heart
 * 5. Molten cheese gold (#F59E0B) and cinema crimson (#E11D48) gradients
 */
export const PizzaCineSymbol: React.FC<{ sizePx?: number; className?: string }> = ({ 
  sizePx = 36, 
  className = '' 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      {/* Outer ambient cinematic glow */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-600/30 via-red-600/25 to-amber-500/25 blur-md pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Vector Pizza + Cinema Reel + Play Symbol */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_2px_14px_rgba(225,29,72,0.45)]"
      >
        <defs>
          {/* Pizza Sauce / Cinema Red gradient */}
          <linearGradient id="pc-grad-slice" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#BE123C" />
            <stop offset="45%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          {/* Golden Crust & Melted Cheese gradient */}
          <linearGradient id="pc-grad-crust" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Play Symbol radiant white-gold gradient */}
          <linearGradient id="pc-grad-play" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Film Reel edge gradient */}
          <linearGradient id="pc-grad-film-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* 1. Golden Pizza Crust / Cinema Arc (Top) with Film Reel Perforations */}
        <path 
          d="M18 22 C38 12, 62 12, 82 22 L85 28 C64 19, 36 19, 15 28 Z" 
          fill="url(#pc-grad-crust)" 
          stroke="#78350F"
          strokeWidth="0.8"
        />

        {/* Film reel 35mm sprocket holes along the crust arc */}
        <rect x="23" y="20" width="4.5" height="4" rx="1.2" fill="#0C080A" opacity="0.9" />
        <rect x="35" y="17.5" width="4.5" height="4" rx="1.2" fill="#0C080A" opacity="0.9" />
        <rect x="48" y="16.5" width="4.5" height="4" rx="1.2" fill="#0C080A" opacity="0.9" />
        <rect x="61" y="17.5" width="4.5" height="4" rx="1.2" fill="#0C080A" opacity="0.9" />
        <rect x="73" y="20" width="4.5" height="4" rx="1.2" fill="#0C080A" opacity="0.9" />

        {/* 2. Main Pizza Slice Body pointing downward like a cinema spotlight / cone */}
        <path 
          d="M18 28 C38 21, 62 21, 82 28 L52 90 C50.8 92.4, 49.2 92.4, 48 90 Z" 
          fill="url(#pc-grad-slice)" 
          stroke="url(#pc-grad-film-edge)"
          strokeWidth="1.8"
        />

        {/* 3. Cheese stream wavy filaments (delicate, appetizing, premium) */}
        <path 
          d="M26 31 C32 37, 36 34, 42 42 C46 48, 48 45, 50 56" 
          stroke="#FDE68A" 
          strokeWidth="2.2" 
          strokeLinecap="round"
          opacity="0.85"
        />
        <path 
          d="M74 31 C68 36, 64 33, 58 40" 
          stroke="#FBBF24" 
          strokeWidth="1.8" 
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* 4. Film Reel / Pepperoni Circular Nodes */}
        {/* Left pepperoni */}
        <circle cx="35" cy="46" r="6.5" fill="#991B1B" stroke="#FDE68A" strokeWidth="1" />
        <circle cx="35" cy="46" r="2.2" fill="#450A0A" />

        {/* Right pepperoni */}
        <circle cx="65" cy="46" r="6.5" fill="#991B1B" stroke="#FDE68A" strokeWidth="1" />
        <circle cx="65" cy="46" r="2.2" fill="#450A0A" />

        {/* Bottom pepperoni */}
        <circle cx="50" cy="74" r="5" fill="#991B1B" stroke="#FDE68A" strokeWidth="0.8" />
        <circle cx="50" cy="74" r="1.8" fill="#450A0A" />

        {/* 5. Center Cinema PLAY Symbol (radiant triangle) */}
        <polygon 
          points="44,38 66,51 44,64" 
          fill="url(#pc-grad-play)" 
          className="filter drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
        />
      </svg>
    </div>
  );
};

export const PizzaCineLogo: React.FC<PizzaCineLogoProps> = ({
  size = 'md',
  variant = 'full',
  withSlogan = false,
  className = '',
  onClick
}) => {
  // Dimension scaling
  const symbolSize = {
    sm: 28,
    md: 36,
    lg: 46,
    xl: 58,
    hero: 76
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    hero: 'text-4xl md:text-5xl'
  }[size];

  const cineBadgeSize = {
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
        className={`inline-flex items-center cursor-pointer select-none ${className}`}
        role={onClick ? 'button' : undefined}
      >
        <PizzaCineSymbol sizePx={symbolSize} />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick} 
      className={`inline-flex ${variant === 'stacked' ? 'flex-col items-center text-center' : 'items-center gap-2.5'} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
    >
      <PizzaCineSymbol sizePx={symbolSize} />

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-display font-black tracking-wider text-white ${textSize} uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}
            style={{ letterSpacing: '0.06em' }}
          >
            PIZZA
          </span>
          <span 
            className={`font-sans font-extrabold tracking-widest uppercase bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white rounded-lg font-mono ${cineBadgeSize} shadow-md shadow-rose-950/60 border border-amber-400/30`}
            style={{ letterSpacing: '0.14em' }}
          >
            CINE
          </span>
        </div>

        {withSlogan && (
          <span className="text-[10px] sm:text-xs text-amber-200/90 font-medium tracking-wider mt-1 flex items-center gap-1">
            <span>Seu filme favorito. Sua série favorita. Do seu jeito.</span>
          </span>
        )}
      </div>
    </div>
  );
};

// Aliases for backward compatibility
export const NexoraLogo = PizzaCineLogo;
export const NexoraSymbol = PizzaCineSymbol;
export default PizzaCineLogo;
