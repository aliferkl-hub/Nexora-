import React, { useState } from 'react';
import { Play, Sparkles, Bookmark, Check, ShieldCheck, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isContentPlayable } from '../../utils/catalogValidation';

export const Hero: React.FC = () => {
  const { 
    contents, 
    openPlayer, 
    openContentDetail,
    toggleFavorite, 
    isFavorite, 
    setActiveView 
  } = useApp();

  // Get all valid public featured items
  const featuredItems = contents.filter((c) => c.featured && !c.hidden && !c.isDemo);
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredItem = featuredItems[currentIndex] || featuredItems[0] || contents[0];
  const isFav = featuredItem ? isFavorite(featuredItem.id) : false;
  const playable = isContentPlayable(featuredItem);

  const nextFeatured = () => {
    if (featuredItems.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const prevFeatured = () => {
    if (featuredItems.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#06080F]">
      {/* Background Visual Asset with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        {featuredItem?.bannerUrl ? (
          <img
            key={featuredItem.id}
            src={featuredItem.bannerUrl}
            alt={featuredItem.title}
            className="w-full h-full object-cover object-center scale-105 transform animate-fadeSlow transition-all duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-[#070D1E] to-[#0A1428]" />
        )}

        {/* Anti-slop measured dark scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080607] via-[#080607]/70 to-[#080607]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080607] via-[#080607]/75 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(225,29,72,0.12),transparent_50%)]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col justify-end min-h-[75vh]">
        <div className="max-w-3xl flex flex-col gap-4">
          
          {/* Brand Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>PIZZA CINE · O SABOR DO CINEMA</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px] normal-case">
              <ShieldCheck className="w-3.5 h-3.5" />
              Catálogo 100% Homologado
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase text-balance drop-shadow-md">
            SEU FILME FAVORITO.<br />
            SUA SÉRIE FAVORITA.<br />
            <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">
              DO SEU JEITO.
            </span>
          </h1>

          {/* Value Proposition Subtitle */}
          <p className="text-slate-200 text-base sm:text-lg lg:text-xl font-normal max-w-2xl leading-relaxed">
            Filmes, séries, animações e produções autorizadas em 4K HDR. A combinação perfeita de cinema e entretenimento de alta velocidade.
          </p>

          {/* Featured Content Metadata */}
          {featuredItem && (
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="font-semibold text-white">Destaque: {featuredItem.title}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{featuredItem.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-amber-300">{featuredItem.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono text-[10px]">
                {featuredItem.ageRating === 'L' ? 'Livre' : `${featuredItem.ageRating}+`}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400 font-mono">★ {featuredItem.rating}</span>
            </div>
          )}

          {/* Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4">
            
            {/* Primary Action Button (Leads to Plans) */}
            <button
              onClick={() => {
                setActiveView('plans');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 rounded-xl shadow-lg shadow-rose-900/40 hover:from-rose-500 hover:to-amber-400 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap border border-amber-300/30"
            >
              <Sparkles className="w-5 h-5 fill-white" />
              <span>ASSINAR PLANOS</span>
            </button>

            {/* Direct Watch Button for the featured content */}
            {featuredItem && playable && (
              <button
                onClick={() => openPlayer(featuredItem)}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-slate-950/90 hover:bg-slate-900 border border-rose-500/50 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>ASSISTIR</span>
              </button>
            )}

            {/* Ver Detalhes */}
            {featuredItem && (
              <button
                onClick={() => openContentDetail(featuredItem)}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Info className="w-4 h-4" />
                <span>Ver Detalhes</span>
              </button>
            )}

            {/* Adicionar à Minha Lista */}
            {featuredItem && (
              <button
                onClick={() => toggleFavorite(featuredItem.id)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center gap-1.5 text-sm cursor-pointer ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-slate-900/60 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={isFav ? 'Salvo na lista' : 'Adicionar à minha lista'}
              >
                {isFav ? <Check className="w-4 h-4 text-rose-400" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Quick Carousel Selector between Featured productions */}
          {featuredItems.length > 1 && (
            <div className="flex items-center gap-2 pt-6">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-2">
                Destaques ({currentIndex + 1}/{featuredItems.length}):
              </span>
              <button
                onClick={prevFeatured}
                className="p-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300 hover:text-white hover:border-rose-400 transition-colors"
                title="Destaque anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {featuredItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-rose-500' : 'w-2 bg-white/20 hover:bg-white/50'
                    }`}
                    title={item.title}
                  />
                ))}
              </div>
              <button
                onClick={nextFeatured}
                className="p-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300 hover:text-white hover:border-rose-400 transition-colors"
                title="Próximo destaque"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
