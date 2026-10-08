import React from 'react';
import { 
  Play, 
  Bookmark, 
  Check, 
  ArrowLeft, 
  Star, 
  Film, 
  Share2, 
  Clock, 
  Calendar, 
  Globe, 
  Volume2, 
  Subtitles, 
  ShieldCheck,
  Lock,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../home/ContentCard';
import { StreamingImage } from '../common/StreamingImage';
import { isContentPlayable, getRightsStatusInfo } from '../../utils/catalogValidation';

export const MovieDetailPage: React.FC = () => {
  const { 
    selectedContentForDetail, 
    closeContentDetail, 
    openPlayer, 
    toggleFavorite, 
    isFavorite,
    contents 
  } = useApp();

  if (!selectedContentForDetail) {
    return null;
  }

  const movie = selectedContentForDetail;
  const isFav = isFavorite(movie.id);
  const playable = isContentPlayable(movie);
  const rightsInfo = getRightsStatusInfo(movie.rightsStatus);

  // Related movies in same category or genre
  const related = contents
    .filter((c) => c.id !== movie.id && c.type === 'movie' && !c.hidden && !c.isDemo)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#06080F] min-h-screen text-slate-100">
      
      {/* Hero Backdrop Frame */}
      <div className="relative w-full h-[55vh] sm:h-[70vh] overflow-hidden bg-slate-950">
        <StreamingImage
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          type="movie"
          aspect="banner"
          imgClassName="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/70 to-[#06080F]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/60 to-transparent pointer-events-none" />

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={closeContentDetail}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>
      </div>

      {/* Movie Details Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Poster Column */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-64 sm:w-72 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 border border-white/10 bg-slate-900 relative">
              <StreamingImage
                src={movie.posterUrl || movie.bannerUrl}
                alt={movie.title}
                type="movie"
                aspect="poster"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-xs font-mono font-bold z-10">
                {movie.audioSpecs?.[0] || '4K HDR'}
              </div>
            </div>
          </div>

          {/* Metadata & Actions Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top metadata row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-semibold uppercase">{movie.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{movie.year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{movie.duration}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                {movie.ageRating === 'L' ? 'Classificação Livre' : `${movie.ageRating} Anos`}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {movie.rating}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
              {movie.title}
            </h1>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <h2 className="text-sm text-slate-400 font-mono">
                Título Original: {movie.originalTitle}
              </h2>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-white/8 text-xs text-slate-300 font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {playable ? (
                <button
                  onClick={() => openPlayer(movie)}
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:from-cyan-300 transition-all flex items-center gap-2.5 cursor-pointer transform active:scale-95"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>ASSISTIR AGORA</span>
                </button>
              ) : (
                <div className="px-6 py-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Em Processo de Licenciamento (Disponível em Breve)</span>
                </div>
              )}

              <button
                onClick={() => toggleFavorite(movie.id)}
                className={`px-5 py-3.5 rounded-2xl border transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer ${
                  isFav
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isFav ? <Check className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                <span>{isFav ? '✓ Na Minha Lista' : 'Adicionar à Minha Lista'}</span>
              </button>

              {movie.trailerUrl && playable && (
                <button
                  onClick={() => openPlayer(movie)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Ver Trailer</span>
                </button>
              )}
            </div>

            {/* Synopsis */}
            <div className="mt-4 pt-4 border-t border-white/8">
              <h3 className="font-display font-bold text-base text-white mb-2">
                Sinopse
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {movie.synopsis || movie.description}
              </p>
            </div>

            {/* Rights & Compliance Card */}
            <div className="p-4 rounded-2xl bg-[#090D18] border border-white/8 space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Licenciamento e Distribuição
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${rightsInfo.color}`}>
                  {rightsInfo.label}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-mono pt-1">
                {movie.distributor && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">Distribuidora / Estúdio:</span>
                    <span>{movie.distributor}</span>
                  </div>
                )}
                {movie.availabilityStart && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">Vigência de Exibição:</span>
                    <span>{movie.availabilityStart} {movie.availabilityEnd ? `até ${movie.availabilityEnd}` : '(Contínua)'}</span>
                  </div>
                )}
              </div>
              {movie.licenseNotes && (
                <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-white/5">
                  Termo: {movie.licenseNotes}
                </p>
              )}
            </div>

            {/* Credits and Technical Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/8 text-xs text-slate-400">
              {movie.director && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Direção:</span>
                  <span className="text-slate-200 font-medium">{movie.director}</span>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Elenco Principal:</span>
                  <span className="text-slate-200 font-medium">{movie.cast.join(', ')}</span>
                </div>
              )}

              {movie.language && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Áudio Disponível:</span>
                  <span className="text-slate-200 font-medium">{movie.language}</span>
                </div>
              )}

              {movie.subtitles && movie.subtitles.length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Legendas:</span>
                  <span className="text-slate-200 font-medium">{movie.subtitles.join(', ')}</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Related Content Row */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/8">
            <h3 className="font-display font-bold text-xl text-white mb-6">
              Mais Filmes Recomendados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((rel) => (
                <ContentCard key={rel.id} content={rel} layout="poster" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
