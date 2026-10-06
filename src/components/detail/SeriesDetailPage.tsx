import React, { useState } from 'react';
import { 
  Play, 
  Bookmark, 
  Check, 
  ArrowLeft, 
  Star, 
  Clock, 
  ChevronRight, 
  Tv, 
  Layers 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Episode, Season } from '../../types';

export const SeriesDetailPage: React.FC = () => {
  const { 
    selectedContentForDetail, 
    closeContentDetail, 
    openPlayer, 
    toggleFavorite, 
    isFavorite,
    currentUser 
  } = useApp();

  if (!selectedContentForDetail) {
    return null;
  }

  const series = selectedContentForDetail;
  const isFav = isFavorite(series.id);

  // Seasons support
  const seasons: Season[] = series.seasons || [
    {
      seasonNumber: 1,
      title: 'Temporada 1',
      episodes: [
        {
          id: `${series.id}-s1-e1`,
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Episódio 1: A Descoberta',
          description: series.description,
          duration: '45m',
          thumbnailUrl: series.bannerUrl,
          streamUrl: series.videoUrl,
          audioTracks: ['Português (5.1)', 'Áudio Original'],
          subtitles: ['Português', 'Inglês']
        }
      ]
    }
  ];

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(seasons[0]?.seasonNumber || 1);
  const activeSeason = seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  // Check last watched episode progress
  const continueWatchingData = currentUser?.continueWatching?.find((c) => c.contentId === series.id);

  const handlePlayEpisode = (ep: Episode) => {
    openPlayer(series, ep);
  };

  return (
    <div className="w-full bg-[#06080F] min-h-screen text-slate-100">
      
      {/* Series Hero Banner */}
      <div className="relative w-full h-[55vh] sm:h-[70vh] overflow-hidden bg-slate-950">
        <img
          src={series.bannerUrl}
          alt={series.title}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/70 to-[#06080F]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/60 to-transparent" />

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={closeContentDetail}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-10 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Poster */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-64 sm:w-72 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 border border-white/10 bg-slate-900">
              <img
                src={series.posterUrl || series.bannerUrl}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-semibold uppercase">SÉRIE ORIGINAL</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{series.year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{seasons.length} {seasons.length === 1 ? 'Temporada' : 'Temporadas'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                {series.ageRating === 'L' ? 'Livre' : `${series.ageRating} Anos`}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {series.rating}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
              {series.title}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-1">
              {series.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-white/8 text-xs text-slate-300 font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => {
                  const firstEp = activeSeason.episodes[0];
                  if (firstEp) handlePlayEpisode(firstEp);
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:from-cyan-300 transition-all flex items-center gap-2.5 cursor-pointer transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>
                  {continueWatchingData 
                    ? `CONTINUAR T${continueWatchingData.seasonNumber || 1}:E${continueWatchingData.episodeNumber || 1}` 
                    : 'ASSISTIR TEMPORADA 1'}
                </span>
              </button>

              <button
                onClick={() => toggleFavorite(series.id)}
                className={`px-5 py-3.5 rounded-2xl border transition-colors flex items-center gap-2 text-sm font-semibold cursor-pointer ${
                  isFav
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isFav ? <Check className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                <span>{isFav ? '✓ Na Minha Lista' : 'Adicionar à Minha Lista'}</span>
              </button>
            </div>

            {/* Synopsis */}
            <div className="mt-3 pt-4 border-t border-white/8">
              <h3 className="font-display font-bold text-base text-white mb-2">
                Sinopse
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {series.synopsis || series.description}
              </p>
            </div>

          </div>

        </div>

        {/* Season Selector & Episode List */}
        <div className="border-t border-white/8 pt-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-display font-bold text-2xl text-white">
              Episódios
            </h2>

            {/* Season tabs / selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {seasons.map((s) => (
                <button
                  key={s.seasonNumber}
                  onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSeasonNumber === s.seasonNumber
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-white/8 text-slate-300 hover:text-white'
                  }`}
                >
                  TEMPORADA {s.seasonNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSeason.episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => handlePlayEpisode(ep)}
                className="group p-4 rounded-2xl bg-[#090D18] border border-white/8 hover:border-cyan-500/40 hover:bg-[#0C1220] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Episode thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3.5">
                    <img
                      src={ep.thumbnailUrl || series.bannerUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-slate-200">
                      {ep.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                    <span>EPISÓDIO {ep.episodeNumber}</span>
                    <span className="text-slate-400">{ep.duration}</span>
                  </div>

                  <h4 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {ep.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {ep.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{ep.audioTracks?.[0] || 'Áudio Master'}</span>
                  <button className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    <span>Assistir</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
