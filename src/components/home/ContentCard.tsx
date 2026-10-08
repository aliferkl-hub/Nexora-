import React from 'react';
import { Play, Bookmark, Check, Star, Info, Radio, Lock, ShieldCheck } from 'lucide-react';
import { ContentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { StreamingImage } from '../common/StreamingImage';
import { isContentPlayable, getRightsStatusInfo } from '../../utils/catalogValidation';

interface ContentCardProps {
  content: ContentItem;
  size?: 'normal' | 'wide' | 'featured' | 'poster';
  layout?: 'poster' | 'backdrop' | 'channel';
}

export const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  size = 'normal',
  layout
}) => {
  const { openPlayer, openContentDetail, toggleFavorite, isFavorite } = useApp();

  const isFav = isFavorite(content.id);
  const playable = isContentPlayable(content);
  const rightsInfo = getRightsStatusInfo(content.rightsStatus);

  // Age rating badge colors matching standard Brazilian ratings
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

  const isChannel = content.type === 'channel';
  const effectiveLayout = layout || (isChannel ? 'channel' : size === 'poster' ? 'poster' : 'backdrop');
  const imageSource = effectiveLayout === 'poster' 
    ? (content.posterUrl || content.bannerUrl)
    : isChannel
    ? (content.bannerUrl || content.logoUrl || content.posterUrl)
    : (content.bannerUrl || content.posterUrl);

  const aspectMode = effectiveLayout === 'poster' ? 'poster' : 'banner';

  return (
    <div 
      className="group relative flex flex-col bg-[#0C090A] border border-white/8 rounded-2xl overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-950/40 transition-all duration-300 cursor-pointer h-full"
      onClick={() => openContentDetail(content)}
    >
      
      {/* Visual Frame */}
      <div className="relative w-full overflow-hidden bg-black/60">
        <StreamingImage
          src={imageSource}
          alt={content.title}
          type={content.type}
          aspect={aspectMode}
          imgClassName="group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C090A] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          {isChannel ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-red-600 text-white uppercase shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>AO VIVO</span>
              </span>
              {content.channelNumber && (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-white/10">
                  CANAL {content.channelNumber}
                </span>
              )}
            </div>
          ) : content.badge ? (
            <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-rose-600 to-amber-500 text-white uppercase shadow-sm">
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
          className="absolute inset-0 bg-black/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {playable ? (
            <button
              onClick={() => openPlayer(content)}
              className="p-3.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white hover:scale-110 transition-all shadow-lg shadow-rose-950/60 cursor-pointer border border-amber-300/30"
              title="Assistir Imediatamente"
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
              title="Direitos pendentes de homologação"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Em Análise</span>
            </div>
          )}

          <button
            onClick={() => toggleFavorite(content.id)}
            className={`p-3 rounded-full border transition-all cursor-pointer ${
              isFav
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
            }`}
            title={isFav ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
          >
            {isFav ? <Check className="w-4 h-4 text-rose-400" /> : <Bookmark className="w-4 h-4" />}
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
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="text-amber-400 font-semibold font-mono">
              {content.type === 'movie' ? 'Filme' : content.type === 'series' ? 'Série' : 'Canal'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{content.year}</span>
            {content.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-slate-300">{content.duration}</span>
              </>
            )}
          </div>

          <h3 className="font-display font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
            {content.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{content.rating}</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{rightsInfo.shortLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {playable ? (
              <button
                onClick={() => openPlayer(content)}
                className="px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-cyan-300" />
                <span>Assistir</span>
              </button>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-white/5">
                Em Breve
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
