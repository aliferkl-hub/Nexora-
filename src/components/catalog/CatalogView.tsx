import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Film, 
  Tv, 
  Radio, 
  Sparkles, 
  X,
  Filter,
  ArrowUpDown,
  Check,
  ShieldCheck,
  RotateCcw
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
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series' | 'channel'>(defaultType);
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'title'>('popular');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const categories = [
    'Todos',
    'Favoritos',
    'Filmes',
    'Séries',
    'Animações',
    'Ação',
    'Aventura',
    'Comédia',
    'Drama',
    'Terror',
    'Ficção Científica',
    'Romance',
    'Documentários',
    'Família',
    'Nacionais',
    'Internacionais',
    'Lançamentos',
    'Em Alta'
  ];

  // Dynamic Page Title
  const pageTitle = activeView === 'films' 
    ? 'CATÁLOGO EXCLUSIVO DE FILMES EM 4K'
    : activeView === 'series'
    ? 'CATÁLOGO DE SÉRIES E TEMPORADAS'
    : activeView === 'trending'
    ? 'EM ALTA · PRODUÇÕES MAIS ASSISTIDAS'
    : activeView === 'releases'
    ? 'LANÇAMENTOS & NOVIDADES'
    : activeView === 'mylist'
    ? 'MINHA LISTA DE FAVORITOS'
    : activeView === 'genres'
    ? 'EXPLORAR POR GÊNERO & CATEGORIA'
    : 'UNIVERSO DE STREAMING PIZZA CINE';

  const pageSubtitle = activeView === 'films'
    ? 'Filmes completos licenciados e autorizados com qualidade cinematográfica 4K HDR e som imersivo.'
    : activeView === 'series'
    ? 'Séries completas com controle individual de episódios, temporadas e reprodução instantânea.'
    : activeView === 'trending'
    ? 'Os títulos com maior audiência e engajamento dinâmico na plataforma.'
    : activeView === 'releases'
    ? 'Novas adições autorizadas adicionadas recentemente ao catálogo.'
    : activeView === 'mylist'
    ? 'Seus títulos marcados e favoritos salvos para assistir a qualquer momento.'
    : activeView === 'genres'
    ? 'Navegue por gêneros: Ação, Aventura, Ficção Científica, Animação, Comédia e mais.'
    : 'Catálogo homologado de filmes, séries e produções em 4K HDR.';

  // Reset all filters
  const resetFilters = () => {
    setTypeFilter(defaultType);
    setGenreFilter('all');
    setYearFilter('all');
    setRatingFilter('all');
    setLanguageFilter('all');
    setSelectedCategory('Todos');
    setSearchQuery('');
  };

  const hasActiveCustomFilters = 
    genreFilter !== 'all' || 
    yearFilter !== 'all' || 
    ratingFilter !== 'all' || 
    languageFilter !== 'all' || 
    (typeFilter !== defaultType && typeFilter !== 'all');

  const filteredContents = useMemo(() => {
    // Only public, non-demo items
    return contents.filter((item) => {
      if (item.hidden || item.isDemo) return false;

      // Special category: Favoritos or mylist view
      if (selectedCategory === 'Favoritos' || activeView === 'mylist') {
        if (!currentUser?.favorites?.includes(item.id)) return false;
      }
      // Special category: Continue assistindo
      else if (selectedCategory === 'Continue assistindo') {
        const hasProgress = currentUser?.continueWatching?.some((c) => c.contentId === item.id);
        if (!hasProgress) return false;
      }
      // Special category: Em Alta
      else if (selectedCategory === 'Em Alta' || activeView === 'trending') {
        if (!item.isTrending && !item.isTopWatched && (item.rating || 0) < 4.8) return false;
      }
      // Special category: Lançamentos
      else if (selectedCategory === 'Lançamentos' || activeView === 'releases') {
        if (!item.isNewRelease && item.year < 2023) return false;
      }
      // General Category tabs filter
      else if (selectedCategory !== 'Todos') {
        const matchesCat = item.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesGenre = item.genre.some((g) => g.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!matchesCat && !matchesGenre) return false;
      }

      // Route-based force filter (if on /films or /series)
      if (activeView === 'films' && item.type !== 'movie') return false;
      if (activeView === 'series' && item.type !== 'series') return false;

      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Genre filter
      if (genreFilter !== 'all') {
        const hasGenre = item.genre.some((g) => g.toLowerCase() === genreFilter.toLowerCase());
        if (!hasGenre) return false;
      }

      // Year filter
      if (yearFilter !== 'all') {
        if (item.year.toString() !== yearFilter) return false;
      }

      // Age Rating filter
      if (ratingFilter !== 'all') {
        if (item.ageRating !== ratingFilter) return false;
      }

      // Language filter
      if (languageFilter !== 'all') {
        const langStr = (item.language || '').toLowerCase();
        if (languageFilter === 'pt' && !langStr.includes('português')) return false;
        if (languageFilter === 'en' && !langStr.includes('inglês')) return false;
        if (languageFilter === 'none' && !langStr.includes('sem diálogos')) return false;
      }

      // Search Query filter (matches title, original title, genre, category, synopsis, description, cast, director, year, type)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inOrigTitle = item.originalTitle?.toLowerCase().includes(q) || false;
        const inCategory = item.category.toLowerCase().includes(q);
        const inGenre = item.genre.some((g) => g.toLowerCase().includes(q));
        const inDesc = item.description.toLowerCase().includes(q) || (item.synopsis?.toLowerCase().includes(q) || false);
        const inCast = item.cast?.some((actor) => actor.toLowerCase().includes(q)) || false;
        const inDirector = item.director?.toLowerCase().includes(q) || false;
        const inYear = item.year.toString().includes(q);
        const inType = (item.type === 'movie' ? 'filme' : item.type === 'series' ? 'série' : 'canal').includes(q);

        if (!inTitle && !inOrigTitle && !inCategory && !inGenre && !inDesc && !inCast && !inDirector && !inYear && !inType) {
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
  }, [contents, activeView, selectedCategory, typeFilter, genreFilter, yearFilter, ratingFilter, languageFilter, searchQuery, sortBy, currentUser]);

  return (
    <div className="w-full py-8 sm:py-12 bg-[#080607] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>PIZZA CINE · STREAMING HOMOLOGADO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">4K HDR SEM TRAVAMENTOS</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {pageSubtitle}
            </p>
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, gênero, ator, diretor, ano..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-black/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
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
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-950/50 border border-amber-300/30'
                    : 'bg-black/50 border border-white/8 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Bar & Controls */}
        <div className="bg-[#0C090A] border border-white/8 rounded-2xl p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Quick Type Toggles (if on generic Catalog) */}
            {activeView === 'catalog' && (
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'movie', label: 'Filmes' },
                  { id: 'series', label: 'Séries' },
                  { id: 'channel', label: 'Canais TV' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTypeFilter(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      typeFilter === t.id
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Toggle Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                showAdvancedFilters || hasActiveCustomFilters
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : 'bg-black/40 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros Detalhados</span>
              {hasActiveCustomFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Ordenar:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Critério de ordenação do catálogo"
                className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
                <option value="newest">Lançamentos Recentes</option>
                <option value="title">Ordem Alfabética</option>
              </select>
            </div>

            {/* Total Results Counter */}
            <div className="text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-bold">{filteredContents.length}</span> {filteredContents.length === 1 ? 'título encontrado' : 'títulos encontrados'}
            </div>

          </div>

          {/* Expanded Filter Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              
              {/* Gênero */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Gênero</label>
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  aria-label="Filtrar catálogo por gênero"
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="all">Todos os Gêneros</option>
                  <option value="ficção científica">Ficção Científica</option>
                  <option value="fantasia">Fantasia</option>
                  <option value="ação">Ação</option>
                  <option value="aventura">Aventura</option>
                  <option value="animação">Animação</option>
                  <option value="comédia">Comédia</option>
                  <option value="notícias">Notícias</option>
                  <option value="ciência">Ciência</option>
                  <option value="drama">Drama</option>
                </select>
              </div>

              {/* Ano */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ano de Produção</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  aria-label="Filtrar catálogo por ano de produção"
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="all">Todos os Anos</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Classificação Indicativa */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Classificação</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  aria-label="Filtrar catálogo por classificação indicativa"
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="all">Todas as Faixas</option>
                  <option value="L">Livre (L)</option>
                  <option value="10">10 Anos</option>
                  <option value="12">12 Anos</option>
                  <option value="14">14 Anos</option>
                  <option value="16">16 Anos</option>
                  <option value="18">18 Anos</option>
                </select>
              </div>

              {/* Idioma */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Idioma / Áudio</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  aria-label="Filtrar catálogo por idioma ou áudio"
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="all">Todos os Idiomas</option>
                  <option value="pt">Português (BR)</option>
                  <option value="en">Inglês Original</option>
                  <option value="none">Sem Diálogos (Trilha Master)</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveCustomFilters && (
                <div className="col-span-2 sm:col-span-4 flex justify-end pt-2">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar todos os filtros</span>
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Content Grid */}
        {filteredContents.length > 0 ? (
          <div className={`grid gap-5 sm:gap-6 ${
            activeView === 'films' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {filteredContents.map((item) => (
              <ContentCard 
                key={item.id} 
                content={item} 
                layout={activeView === 'films' ? 'poster' : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center p-6 rounded-3xl bg-[#090D18] border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Nenhum resultado correspondente
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">
              Não encontramos títulos correspondentes aos filtros selecionados. Tente ajustar a busca ou limpar os filtros.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Restaurar Catálogo Completo
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
