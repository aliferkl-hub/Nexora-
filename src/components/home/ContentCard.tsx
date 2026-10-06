import React, { useState } from 'react';
import { Play, Bookmark, Check, Star, Info, Radio } from 'lucide-react';
import { ContentItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ContentCardProps {
  content: ContentItem;
  size?: 'normal' | 'wide' | 'featured';
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  size = 'normal' 
}) => {
  const { openPlayer, openContentDetail, toggleFavorite, isFavorite } = useApp();
  const [imgError, setImgError] = useState(false);

  const isFav = isFavorite(content.id);

  // Age rating badge colors matching standard ratings
  const getRatingBg = (rating: string) => {
    switch (rating) {
      case 'L': return 'bg-emerald-600 text-white';
      case '10': return 'bg-blue-600 text-white';
      case '12': return 'bg-amber-600 text-white';
      case '14': return 'bg-orange-600 text-white';
      case '16': return 'bg-red-600 text-white';
      case '18': return 'bg-black border border-red-600 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  const aspectClass = size === 'wide' ? 'aspect-[16/9]' : 'aspect-[16/10]';

  return (
    <div 
      className="group relative flex flex-col bg-[#0A0E1A] border border-white/8 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40 transition-all duration-300 cursor-pointer"
      onClick={() => openContentDetail(content)}
    >
      
      {/* Visual Thumbnail Frame */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-slate-900`}>
        {!imgError && content.bannerUrl ? (
          <img
            src={content.bannerUrl}
            alt={content.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 flex flex-col items-center justify-center p-4 text-center">
            <span className="font-display font-bold text-cyan-400 text-sm tracking-wider uppercase">
              NEXORA PLAY
            </span>
            <span className="text-xs text-slate-300 mt-1 line-clamp-2">
              {content.title}
            </span>
          </div>
        )}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-black/30" />

        {/* Top Badges (Top Left & Top Right) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {content.type === 'channel' ? (
            <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-red-600 text-white uppercase shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>AO VIVO</span>
            </span>
          ) : content.badge ? (
            <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-500/90 text-slate-950 uppercase shadow-sm">
              {content.badge}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${getRatingBg(content.ageRating)}`}>
              {content.ageRating}
            </span>
          </div>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => openPlayer(content)}
            className="p-3.5 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:scale-110 transition-all shadow-lg shadow-cyan-500/40 cursor-pointer"
            title="Assistir Imediatamente"
          >
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </button>

          <button
            onClick={() => toggleFavorite(content.id)}
            className={`p-3 rounded-full border transition-all cursor-pointer ${
              isFav
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
            }`}
            title={isFav ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
          >
            {isFav ? <Check className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => openContentDetail(content)}
            className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Ver Detalhes"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata Row: Unboxed clean text */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="text-cyan-400 font-medium">
              {content.type === 'movie' ? 'Filme' : content.type === 'series' ? 'Série' : 'Canal'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{content.year}</span>
            {content.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px]">{content.duration}</span>
              </>
            )}
          </div>

          <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
            {content.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Card Footer: Specs + Action Buttons */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{content.rating}</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-[11px] text-slate-400">
              {content.audioSpecs?.[0] || '4K HDR'}
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleFavorite(content.id)}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer sm:hidden ${
                isFav ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
              }`}
              title={isFav ? 'Na Minha Lista' : 'Adicionar à Lista'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-cyan-400' : ''}`} />
            </button>

            <button
              onClick={() => openPlayer(content)}
              className="px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-cyan-300" />
              <span>Assistir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
