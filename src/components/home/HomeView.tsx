import React from 'react';
import { Hero } from './Hero';
import { ContentSection } from './ContentSection';
import { NexoraExperience } from './NexoraExperience';
import { AppDownloadSection } from './AppDownloadSection';
import { PlansView } from '../plans/PlansView';
import { FAQSection } from './FAQSection';
import { MarketingCtaBanner } from './MarketingCtaBanner';
import { useApp } from '../../context/AppContext';
import { Play, Sparkles, AlertCircle, RefreshCw, Bookmark, Tv, Film, Radio, TrendingUp, Flame } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    contents, 
    setActiveView, 
    setSelectedCategory,
    currentUser,
    openPlayer 
  } = useApp();

  // Public catalog only: exclude hidden and demo items
  const publicContents = contents.filter((c) => !c.hidden && !c.isDemo);

  // 1. 🔥 EM ALTA (Dynamic, based on admin flag, views, or high popularity)
  const trending = publicContents.filter((c) => c.isTrending || c.viewsCount >= 140000);

  // 2. 🆕 LANÇAMENTOS (Exclusive for recently added or latest production year)
  const newReleases = publicContents.filter((c) => c.isNewRelease || c.year >= 2025);

  // 3. 🎬 FILMES (Dedicated movie collection with poster cards)
  const movies = publicContents.filter((c) => c.type === 'movie');

  // 4. 📺 SÉRIES (Dedicated series collection with seasons and episodes)
  const series = publicContents.filter((c) => c.type === 'series');

  // 5. 📡 CANAIS / TV AO VIVO (Dedicated channel collection with channel logos)
  const liveChannels = publicContents.filter((c) => c.type === 'channel');

  // 6. ⭐ MAIS ASSISTIDOS (Highest audience and viewsCount)
  const mostWatched = publicContents
    .filter((c) => c.isTopWatched || c.badge === 'MAIS ASSISTIDO' || c.rating >= 4.9)
    .sort((a, b) => b.viewsCount - a.viewsCount);

  // 7. CONTINUAR ASSISTINDO (In-progress user items)
  const continueWatchingItems = currentUser?.continueWatching?.map((cw) => {
    const item = publicContents.find((c) => c.id === cw.contentId);
    return { ...cw, item };
  }).filter((ci) => ci.item) || [];

  // 8. MINHA LISTA (User saved favorites)
  const myFavorites = publicContents.filter((c) => currentUser?.favorites?.includes(c.id));

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
              {continueWatchingItems.map(({ item, progressPercent, seasonNumber, episodeNumber }) => item && (
                <div
                  key={item.id}
                  onClick={() => openPlayer(item)}
                  className="group relative p-3 rounded-2xl bg-[#090D18] border border-white/8 hover:border-cyan-500/40 hover:bg-[#0C1222] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                    <img
                      src={item.bannerUrl || item.posterUrl}
                      alt={item.title}
                      loading="lazy"
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

      {/* 3. MINHA LISTA (When user has favorites) */}
      {myFavorites.length > 0 && (
        <ContentSection
          title="🔖 Minha Lista"
          subtitle="Títulos que você salvou para assistir depois"
          items={myFavorites}
          layout="poster"
          viewAllAction={() => goToCatalog('Favoritos')}
        />
      )}

      {/* Dynamic Streaming Sections */}
      {publicContents.length > 0 ? (
        <>
          {/* 🔥 EM ALTA */}
          {trending.length > 0 && (
            <ContentSection
              title="🔥 Em Alta no Pizza Cine"
              subtitle="As produções com maior audiência e engajamento dinâmico"
              items={trending}
              layout="backdrop"
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}

          {/* 🎬 FILMES EM 4K (Poster proportion layout) */}
          {movies.length > 0 && (
            <ContentSection
              title="🎬 Filmes em 4K HDR"
              subtitle="Catálogo oficial com produções completas em resolução de cinema"
              items={movies}
              layout="poster"
              viewAllAction={() => {
                setActiveView('films');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 📺 SÉRIES & TEMPORADAS */}
          {series.length > 0 && (
            <ContentSection
              title="📺 Séries & Temporadas"
              subtitle="Episódios completos com reprodução contínua e áudio master"
              items={series}
              layout="backdrop"
              viewAllAction={() => {
                setActiveView('series');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 📡 TV AO VIVO (Dedicated channel layout) */}
          {liveChannels.length > 0 && (
            <ContentSection
              title="📡 Canais & TV Ao Vivo 24h"
              subtitle="Transmissões oficiais em 60 FPS com baixa latência e guia de programação"
              items={liveChannels}
              layout="channel"
              viewAllAction={() => {
                setActiveView('live-tv');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 🆕 LANÇAMENTOS */}
          {newReleases.length > 0 && (
            <ContentSection
              title="🆕 Lançamentos Recentes"
              subtitle="Novas adições autorizadas e homologadas para reprodução"
              items={newReleases}
              layout="backdrop"
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}

          {/* ⭐ MAIS ASSISTIDOS */}
          {mostWatched.length > 0 && (
            <ContentSection
              title="⭐ Mais Assistidos de Todos os Tempos"
              subtitle="Obras aclamadas pelo público e recordistas de reprodução"
              items={mostWatched}
              layout="poster"
              viewAllAction={() => goToCatalog('Todos')}
            />
          )}
        </>
      ) : (
        <div className="max-w-4xl mx-auto my-16 px-4 py-12 rounded-3xl bg-[#090D18] border border-white/10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-xl text-white">
            Catálogo em sincronização contínua.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
            Nenhuma produção pendente encontrada. Acesse o Painel Master Owner para importar feeds autorizados ou cadastrar novas obras.
          </p>
          <button
            onClick={() => setActiveView('admin')}
            className="mt-6 px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors"
          >
            Acessar Painel Master Owner
          </button>
        </div>
      )}

      {/* 9. EXPLORE POR CATEGORIA */}
      <section className="w-full py-12 bg-[#080D1A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              ORGANIZAÇÃO INTELIGENTE
            </span>
            <h2 className="font-display font-bold text-xl sm:text-3xl text-white uppercase mt-1">
              EXPLORE POR CATEGORIA & GÊNERO
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Filmes 4K', view: 'films', count: `${movies.length} Títulos` },
              { name: 'Séries', view: 'series', count: `${series.length} Séries` },
              { name: 'TV Ao Vivo', view: 'live-tv', count: `${liveChannels.length} Canais` },
              { name: 'Ficção Científica', cat: 'Ficção Científica', count: 'Espaço & Futuro' },
              { name: 'Fantasia & Épico', cat: 'Fantasia', count: 'Mundos Místicos' },
              { name: 'Ação & Aventura', cat: 'Ação', count: 'Adrenalina' },
              { name: 'Animação 3D', cat: 'Animação', count: 'Arte Digital' },
              { name: 'Comédia', cat: 'Comédia', count: 'Para Toda Família' },
              { name: 'Notícias & Sociedade', cat: 'Notícias', count: 'Transmissão Oficial' },
              { name: 'Ciência & Espaço', cat: 'Ciência', count: 'Exploração' },
              { name: 'Minha Lista', cat: 'Favoritos', count: `${currentUser?.favorites?.length || 0} Salvos` },
              { name: 'Catálogo Geral', cat: 'Todos', count: 'Ver Tudo' }
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
                className="group p-4 rounded-2xl bg-[#0F0A0C] border border-white/8 hover:border-rose-500/40 hover:bg-[#1A1014] transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
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

      {/* EXPERIÊNCIA PIZZA CINE */}
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
