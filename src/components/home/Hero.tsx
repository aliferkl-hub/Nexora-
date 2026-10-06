import React from 'react';
import { Play, Sparkles, Bookmark, Check, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CINEMATIC_ASSETS } from '../../data/seedData';

export const Hero: React.FC = () => {
  const { 
    contents, 
    openPlayer, 
    openContentDetail,
    toggleFavorite, 
    isFavorite, 
    setActiveView 
  } = useApp();

  // Pick first featured item or first available
  const featuredItem = contents.find((c) => c.featured && !c.hidden) || contents[0];
  const isFav = featuredItem ? isFavorite(featuredItem.id) : false;

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#06080F]">
      {/* Background Visual Asset with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={featuredItem?.bannerUrl || CINEMATIC_ASSETS.heroSpace}
          alt={featuredItem?.title || "NEXORA PLAY Cinema"}
          className="w-full h-full object-cover object-center scale-105 transform animate-fadeSlow transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Anti-slop measured dark scrims for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/65 to-[#06080F]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(0,240,255,0.08),transparent_50%)]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col justify-end min-h-[75vh]">
        <div className="max-w-3xl flex flex-col gap-4">
          
          {/* Brand Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-cyan-400 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEXORA PLAY · PLATAFORMA OFICIAL</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px] normal-case">
              <ShieldCheck className="w-3.5 h-3.5" />
              Catálogo 100% Homologado
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase text-balance drop-shadow-md">
            SEU ENTRETENIMENTO.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              DO SEU JEITO.
            </span>
          </h1>

          {/* Value Proposition Subtitle */}
          <p className="text-slate-200 text-base sm:text-lg lg:text-xl font-normal max-w-2xl leading-relaxed">
            Filmes, séries e canais ao vivo autorizados em uma experiência cinematográfica 4K HDR. Sem travamentos, onde você estiver.
          </p>

          {/* Featured Content Metadata */}
          {featuredItem && (
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="font-semibold text-white">Destaque: {featuredItem.title}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{featuredItem.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-cyan-300">{featuredItem.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono text-[10px]">
                {featuredItem.ageRating === 'L' ? 'Livre' : `${featuredItem.ageRating}+`}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400 font-mono">★ {featuredItem.rating}</span>
            </div>
          )}

          {/* Dual Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4">
            
            {/* Primary Action Button (Leads directly to Plans per prompt specifications) */}
            <button
              onClick={() => {
                setActiveView('plans');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 rounded-xl shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-teal-200 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>COMEÇAR AGORA</span>
            </button>

            {/* Direct Watch Button for the featured content */}
            {featuredItem && (
              <button
                onClick={() => openPlayer(featuredItem)}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>ASSISTIR</span>
              </button>
            )}

            {/* Ver Planos Secondary CTA */}
            <button
              onClick={() => {
                setActiveView('plans');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-300 bg-black/40 hover:bg-white/5 border border-white/15 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap backdrop-blur-sm"
            >
              <span>VER PLANOS</span>
            </button>

            {/* Ver Detalhes */}
            {featuredItem && (
              <button
                onClick={() => openContentDetail(featuredItem)}
                className="px-5 py-3.5 text-sm sm:text-base font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Info className="w-4 h-4" />
                <span>Mais Informações</span>
              </button>
            )}

            {/* Adicionar à Minha Lista */}
            {featuredItem && (
              <button
                onClick={() => toggleFavorite(featuredItem.id)}
                className={`p-3.5 rounded-xl border transition-colors flex items-center gap-1.5 text-sm cursor-pointer ${
                  isFav
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900/60 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={isFav ? 'Salvo na lista' : 'Adicionar à minha lista'}
              >
                {isFav ? <Check className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                <span className="hidden sm:inline">{isFav ? 'Na Minha Lista' : 'Minha Lista'}</span>
              </button>
            )}

          </div>

          {/* Social Proof / Guarantee Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Compatível com Smart TV, Celular, Tablet e PC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Qualidade 4K Ultra HD & Dolby Atmos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ativação Imediata via PIX</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
