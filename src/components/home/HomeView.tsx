import React from 'react';
import { Hero } from './Hero';
import { ContentSection } from './ContentSection';
import { NexoraExperience } from './NexoraExperience';
import { AppDownloadSection } from './AppDownloadSection';
import { PlansView } from '../plans/PlansView';
import { FAQSection } from './FAQSection';
import { MarketingCtaBanner } from './MarketingCtaBanner';
import { useApp } from '../../context/AppContext';
import { Play, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    contents, 
    setActiveView, 
    setSelectedCategory,
    currentUser,
    openPlayer 
  } = useApp();

  // Categories & Sections per prompt instructions:
  // 🔥 Em Alta
  const trending = contents.filter((c) => (c.isTrending || c.viewsCount > 130000) && !c.hidden);
  // 🆕 Lançamentos
  const newReleases = contents.filter((c) => (c.isNewRelease || c.year >= 2025) && !c.hidden);
  // 🎬 Filmes
  const movies = contents.filter((c) => c.type === 'movie' && !c.hidden);
  // 📺 Séries
  const series = contents.filter((c) => c.type === 'series' && !c.hidden);
  // 📡 TV Ao Vivo
  const liveChannels = contents.filter((c) => c.type === 'channel' && !c.hidden);
  // ⭐ Mais Assistidos
  const mostWatched = contents.filter((c) => (c.badge === 'MAIS ASSISTIDO' || c.rating >= 4.85) && !c.hidden);

  // Continuar Assistindo items with matched content
  const continueWatchingItems = currentUser?.continueWatching?.map((cw) => {
    const item = contents.find((c) => c.id === cw.contentId);
    return { ...cw, item };
  }).filter((ci) => ci.item) || [];

  const goToCatalog = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col bg-[#06080F]">
      
      {/* 1. HERO */}
      <Hero />

      {/* 2. CONTINUAR ASSISTINDO (When user has in-progress items) */}
      {continueWatchingItems.length > 0 && (
        <section className="w-full py-6 sm:py-8 bg-[#070B16] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <h2 className="font-display font-bold text-xl text-white">
                  Continuar Assistindo
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {continueWatchingItems.length} em andamento
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {continueWatchingItems.map(({ item, progressPercent, seasonNumber, episodeNumber, episodeTitle }) => item && (
                <div
                  key={item.id}
                  onClick={() => openPlayer(item)}
                  className="group relative p-3 rounded-2xl bg-[#090D18] border border-white/8 hover:border-cyan-500/40 hover:bg-[#0C1222] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                    <img
                      src={item.bannerUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950/80">
                      <div className="h-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-300">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1 font-mono">
                      <span>
                        {seasonNumber ? `T${seasonNumber}:E${episodeNumber}` : `${progressPercent}% assistido`}
                      </span>
                      <span className="text-cyan-400 text-[11px] font-bold">Continuar ▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* If catalog has items, render the streaming sections */}
      {contents.length > 0 ? (
        <>
          {/* 🔥 EM ALTA */}
          {trending.length > 0 && (
            <ContentSection
              title="🔥 Em Alta"
              subtitle="As produções com maior audiência e engajamento nesta semana"
              items={trending}
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}

          {/* 🆕 LANÇAMENTOS */}
          {newReleases.length > 0 && (
            <ContentSection
              title="🆕 Lançamentos"
              subtitle="Adições recentes homologadas ao catálogo"
              items={newReleases}
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}

          {/* 🎬 FILMES */}
          {movies.length > 0 && (
            <ContentSection
              title="🎬 Filmes em 4K HDR"
              subtitle="Produções completas em resolução cinematográfica"
              items={movies}
              viewAllAction={() => {
                setActiveView('films');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 📺 SÉRIES */}
          {series.length > 0 && (
            <ContentSection
              title="📺 Séries & Temporadas"
              subtitle="Episódios completos com controle de reprodução"
              items={series}
              viewAllAction={() => {
                setActiveView('series');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 📡 TV AO VIVO */}
          {liveChannels.length > 0 && (
            <ContentSection
              title="📡 TV Ao Vivo"
              subtitle="Sinais de canais transmitidos continuamente em 60 FPS"
              items={liveChannels}
              viewAllAction={() => {
                setActiveView('live-tv');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* ⭐ MAIS ASSISTIDOS */}
          {mostWatched.length > 0 && (
            <ContentSection
              title="⭐ Mais Assistidos"
              subtitle="Os títulos melhor avaliados pela comunidade NEXORA"
              items={mostWatched}
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}
        </>
      ) : (
        /* Zero Fake Content State per prompt requirements */
        <div className="max-w-4xl mx-auto my-16 px-4 py-12 rounded-3xl bg-[#090D18] border border-white/10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            Novos conteúdos sendo adicionados ao catálogo NEXORA.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
            Fique atento às estreias semanais e aos novos títulos homologados. O Master Owner pode sincronizar feeds autorizados ou cadastrar produções no painel administrativo.
          </p>
          <button
            onClick={() => setActiveView('admin')}
            className="mt-6 px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors"
          >
            Acessar Painel de Importação
          </button>
        </div>
      )}

      {/* EXPLORE POR CATEGORIA */}
      <section className="w-full py-12 bg-[#080D1A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              ORGANIZAÇÃO INTELIGENTE
            </span>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-white uppercase mt-1">
              EXPLORE POR CATEGORIA
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Filmes', view: 'films', count: '100% 4K' },
              { name: 'Séries', view: 'series', count: 'Temporadas' },
              { name: 'TV Ao Vivo', view: 'live-tv', count: '60 FPS' },
              { name: 'Ficção Científica', cat: 'Ficção Científica', count: 'Espaço & Futuro' },
              { name: 'Ação & Aventura', cat: 'Ação', count: 'Adrenalina' },
              { name: 'Documentários', cat: 'Documentários', count: 'Ciência & Natureza' },
              { name: 'Fantasia', cat: 'Fantasia', count: 'Mundos Místicos' },
              { name: 'Comédia & Animação', cat: 'Comédia', count: 'Para Toda a Família' },
              { name: 'Notícias & Ciência', cat: 'Notícias', count: 'Informação Oficial' },
              { name: 'Esportes', cat: 'Esportes', count: 'Ação Extrema' },
              { name: 'Minha Lista', cat: 'Favoritos', count: 'Seus Salvos' },
              { name: 'Catálogo Completo', cat: 'Todos', count: 'Ver Todos' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.view) {
                    setActiveView(item.view as any);
                  } else {
                    goToCatalog(item.cat || 'Todos');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-4 rounded-2xl bg-[#0B0F1E] border border-white/8 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono mt-2">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIA NEXORA */}
      <NexoraExperience />

      {/* PLANOS E PREÇOS */}
      <div id="planos">
        <PlansView />
      </div>

      {/* APLICATIVO MULTIPLATAFORMA */}
      <AppDownloadSection />

      {/* PERGUNTAS FREQUENTES (FAQ) */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* CTA FINAL */}
      <MarketingCtaBanner />

    </div>
  );
};
