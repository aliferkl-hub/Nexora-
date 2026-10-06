import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Film, 
  Tv, 
  Radio, 
  Sparkles, 
  X,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../home/ContentCard';
import { ContentItem } from '../../types';

export const CatalogView: React.FC = () => {
  const { 
    contents, 
    activeView,
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    currentUser 
  } = useApp();

  // Initial type filter depending on current route
  const defaultType = activeView === 'films' ? 'movie' : activeView === 'series' ? 'series' : 'all';
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series' | 'channel' | 'documentary'>(defaultType);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'title'>('popular');

  const categories = [
    'Todos',
    'Favoritos',
    'Continue assistindo',
    'Filmes',
    'Séries',
    'TV Ao Vivo',
    'Ficção Científica',
    'Ação',
    'Aventura',
    'Comédia',
    'Drama',
    'Fantasia',
    'Documentários',
    'Infantil',
    'Esportes',
    'Notícias'
  ];

  // Dynamic Page Title
  const pageTitle = activeView === 'films' 
    ? 'CATÁLOGO DE FILMES EM 4K'
    : activeView === 'series'
    ? 'CATÁLOGO DE SÉRIES E TEMPORADAS'
    : 'UNIVERSO DE STREAMING NEXORA';

  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      if (item.hidden) return false;

      // Special category: Favoritos
      if (selectedCategory === 'Favoritos') {
        if (!currentUser?.favorites?.includes(item.id)) return false;
      }
      // Special category: Continue assistindo
      else if (selectedCategory === 'Continue assistindo') {
        const hasProgress = currentUser?.continueWatching?.some((c) => c.contentId === item.id);
        if (!hasProgress) return false;
      }
      // Category filter
      else if (selectedCategory !== 'Todos') {
        const matchesCat = item.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesGenre = item.genre.some((g) => g.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!matchesCat && !matchesGenre) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Search Query filter (matches title, original title, genre, category, synopsis, description, cast, director)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inOrigTitle = item.originalTitle?.toLowerCase().includes(q) || false;
        const inCategory = item.category.toLowerCase().includes(q);
        const inGenre = item.genre.some((g) => g.toLowerCase().includes(q));
        const inDesc = item.description.toLowerCase().includes(q) || (item.synopsis?.toLowerCase().includes(q) || false);
        const inCast = item.cast?.some((actor) => actor.toLowerCase().includes(q)) || false;
        const inDirector = item.director?.toLowerCase().includes(q) || false;

        if (!inTitle && !inOrigTitle && !inCategory && !inGenre && !inDesc && !inCast && !inDirector) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
  }, [contents, selectedCategory, typeFilter, searchQuery, sortBy, currentUser]);

  // Grouped search results when active search query exists
  const isSearchMode = searchQuery.trim().length > 0;
  const searchMovies = filteredContents.filter((c) => c.type === 'movie');
  const searchSeries = filteredContents.filter((c) => c.type === 'series');
  const searchChannels = filteredContents.filter((c) => c.type === 'channel');

  return (
    <div className="w-full py-8 sm:py-12 bg-[#06080F] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <span>STREAMING HOMOLOGADO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">CATÁLOGO AUTORIZADO</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Filmes, séries e transmissões com qualidade de cinema 4K HDR e som Dolby Atmos.
            </p>
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar filme, série, diretor, ator..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#0B0F1E] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-[#0B0F1E] text-slate-300 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#090D18] border border-white/5 mb-8 text-xs text-slate-300">
          
          {/* Type filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-slate-500 mr-2 hidden sm:inline font-mono">Formato:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'movie', label: 'Filmes' },
              { id: 'series', label: 'Séries' },
              { id: 'channel', label: 'TV Ao Vivo' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                  typeFilter === t.id
                    ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500 hidden sm:inline font-mono">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="popular">Mais Assistidos</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="newest">Lançamentos</option>
              <option value="title">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        {/* Search Results Summary or Grouped Search Sections */}
        {isSearchMode ? (
          <div className="space-y-10">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/8 pb-3">
              <div>
                Resultados para: <strong className="text-white">"{searchQuery}"</strong> ({filteredContents.length} encontrados)
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Limpar Busca
              </button>
            </div>

            {filteredContents.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-[#090D18] border border-white/5 p-6">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white">
                  Nenhum título encontrado para "{searchQuery}"
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Verifique a ortografia ou tente pesquisar por gênero como "Ficção", "Ação" ou "Ciência".
                </p>
              </div>
            ) : (
              <>
                {/* Filmes encontrados */}
                {searchMovies.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                      <Film className="w-4 h-4 text-cyan-400" />
                      <span>FILMES ({searchMovies.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {searchMovies.map((movie) => (
                        <ContentCard key={movie.id} content={movie} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Séries encontradas */}
                {searchSeries.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      <span>SÉRIES ({searchSeries.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {searchSeries.map((s) => (
                        <ContentCard key={s.id} content={s} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Canais encontrados */}
                {searchChannels.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <span>TV AO VIVO & CANAIS ({searchChannels.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {searchChannels.map((ch) => (
                        <ContentCard key={ch.id} content={ch} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Normal Catalog Grid View */
          <>
            <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
              <div>
                Exibindo <span className="text-cyan-300 font-mono font-bold">{filteredContents.length}</span> conteúdos autorizados
              </div>
              {(selectedCategory !== 'Todos' || typeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setTypeFilter('all');
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Redefinir filtros
                </button>
              )}
            </div>

            {filteredContents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredContents.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            ) : (
              <div className="w-full py-16 text-center rounded-2xl bg-[#090D18] border border-white/5 p-6">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white">
                  Novos conteúdos sendo adicionados ao catálogo NEXORA.
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Fique atento às estreias semanais e aos lançamentos autorizados da plataforma.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setTypeFilter('all');
                  }}
                  className="mt-5 px-4 py-2 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  Ver Catálogo Geral
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
