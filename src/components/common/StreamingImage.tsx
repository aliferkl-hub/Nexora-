import React, { useState } from 'react';
import { Film, Tv, Radio, ImageOff, Clapperboard } from 'lucide-react';
import { ContentType } from '../../types';

interface StreamingImageProps {
  src?: string;
  alt: string;
  type?: ContentType;
  aspect?: 'poster' | 'banner' | 'square' | 'video';
  className?: string;
  imgClassName?: string;
}

export const StreamingImage: React.FC<StreamingImageProps> = ({
  src,
  alt,
  type = 'movie',
  aspect = 'poster',
  className = '',
  imgClassName = ''
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getAspectClass = () => {
    switch (aspect) {
      case 'poster': return 'aspect-[2/3]';
      case 'banner': return 'aspect-[16/9]';
      case 'video': return 'aspect-[16/10]';
      case 'square': return 'aspect-square';
      default: return 'aspect-[16/9]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'movie': return <Film className="w-8 h-8 text-rose-400/80 mb-2" />;
      case 'series': return <Tv className="w-8 h-8 text-amber-400/80 mb-2" />;
      case 'channel': return <Radio className="w-8 h-8 text-red-400/80 mb-2" />;
      default: return <Clapperboard className="w-8 h-8 text-rose-400/80 mb-2" />;
    }
  };

  const hasValidSrc = Boolean(src && src.trim().length > 0 && !error);

  return (
    <div className={`relative w-full overflow-hidden bg-[#0C080A] ${getAspectClass()} ${className}`}>
      {hasValidSrc ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${imgClassName}`}
        />
      ) : (
        /* Estado oficial obrigatório: Imagem Indisponível (Sem duplicação de artes) */
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#120B0E] via-[#160D11] to-[#0A0608] border border-rose-950/40">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-800/30 flex items-center justify-center mb-2 shadow-inner">
            <ImageOff className="w-5 h-5 text-rose-400/80" />
          </div>
          
          <span className="text-[11px] font-bold text-slate-200 line-clamp-2 px-1 mb-1">
            {alt}
          </span>
          
          <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/40 shadow-sm">
            Imagem indisponível
          </span>

          <span className="text-[8px] text-slate-400 font-mono mt-1">
            Aguardando arte oficial
          </span>
        </div>
      )}
    </div>
  );
};
