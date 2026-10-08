import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  RotateCw,
  ShieldCheck, 
  Sliders, 
  Subtitles, 
  Bookmark,
  Check,
  AlertCircle,
  Radio,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CinematicPlayerModal: React.FC = () => {
  const { 
    activePlayingContent, 
    activePlayingEpisode,
    closePlayer, 
    isFavorite, 
    toggleFavorite, 
    updateContinueWatching 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [quality, setQuality] = useState<'4K HDR' | '1080p Full HD'>('4K HDR');
  const [showControls, setShowControls] = useState<boolean>(true);
  const [audioLang, setAudioLang] = useState<string>('Português (Original)');
  const [subtitleLang, setSubtitleLang] = useState<string>('Português (BR)');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!activePlayingContent) return;

    // Reset states on open
    setIsPlaying(true);
    setProgress(0);
    setHasError(false);
    setIsLoading(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePlayer();
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.key === 'm') setIsMuted((prev) => !prev);
      if (e.key === 'ArrowRight') forward10();
      if (e.key === 'ArrowLeft') rewind10();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [activePlayingContent, activePlayingEpisode]);

  if (!activePlayingContent) return null;

  const currentMediaUrl = activePlayingEpisode?.streamUrl || 
                          activePlayingContent.videoUrl || 
                          activePlayingContent.trailerUrl || '';

  const isEmbedUrl = currentMediaUrl.includes('youtube.com') || 
                     currentMediaUrl.includes('youtu.be') || 
                     currentMediaUrl.includes('vimeo.com') ||
                     currentMediaUrl.includes('/embed/');

  const getEmbedSrc = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    return url;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const rewind10 = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
  };

  const forward10 = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(curr);
    setDuration(dur);
    const pct = Math.round((curr / dur) * 100);
    setProgress(pct);

    // Record continue watching
    if (pct > 5 && pct % 10 === 0) {
      updateContinueWatching(activePlayingContent.id, pct, activePlayingEpisode || undefined);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    const newTime = (val / 100) * (duration || 1);
    videoRef.current.currentTime = newTime;
    setProgress(val);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
        setShowSubtitlesMenu(false);
      }
    }, 3500);
  };

  const fav = isFavorite(activePlayingContent.id);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 select-none"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Video Container Frame */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        
        {/* Video / Embed Player */}
        {!hasError ? (
          isEmbedUrl ? (
            <div className="w-full h-full max-w-6xl aspect-video flex items-center justify-center p-4">
              <iframe
                src={getEmbedSrc(currentMediaUrl)}
                title={activePlayingContent.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded-2xl border border-white/10 shadow-2xl bg-black"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentMediaUrl}
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlayPause}
            />
          )
        ) : (
          /* Error Fallback: Exact required message */
          <div className="p-8 max-w-md w-full text-center flex flex-col items-center gap-4 bg-[#0B0F1E] border border-white/10 rounded-3xl shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Este conteúdo está temporariamente indisponível ou em processamento.
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                A fonte de transmissão autorizada está em validação ou sendo processada pelos servidores do PIZZA CINE.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => setHasError(true));
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs hover:from-rose-500 hover:to-amber-400 transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={closePlayer}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Fechar Player
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
              <span className="text-xs font-mono text-amber-300 tracking-wider">
                Carregando sinal...
              </span>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div 
          className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex items-center justify-between z-10 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">
              PIZZA <span className="text-rose-500">CINE</span>
            </span>
            <span className="hidden sm:inline-block text-slate-600">·</span>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-medium text-sm line-clamp-1">
                {activePlayingEpisode 
                  ? `${activePlayingContent.title} — T${activePlayingEpisode.seasonNumber}:E${activePlayingEpisode.episodeNumber} "${activePlayingEpisode.title}"`
                  : activePlayingContent.title}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>{activePlayingContent.category}</span>
                <span>·</span>
                <span>{activePlayingContent.year}</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Stream Homologado
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(activePlayingContent.id)}
              className={`p-2.5 rounded-full border transition-colors ${
                fav 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
              }`}
              title={fav ? 'Salvo na Minha Lista' : 'Adicionar à Minha Lista'}
            >
              <Bookmark className={`w-4 h-4 ${fav ? 'fill-cyan-400' : ''}`} />
            </button>

            <button
              onClick={closePlayer}
              className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/20 hover:text-cyan-400 transition-colors cursor-pointer"
              title="Fechar Player (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Pause/Play Watermark Flash */}
        {!isPlaying && !isLoading && !hasError && (
          <div 
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-transform">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </div>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div 
          className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-10 flex flex-col gap-3 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Slider (Hidden on pure live channels with continuous stream) */}
          {activePlayingContent.type !== 'channel' ? (
            <div className="flex items-center gap-3 w-full group">
              <span className="text-xs font-mono text-slate-300 tabular-nums min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all"
              />
              <span className="text-xs font-mono text-slate-400 tabular-nums min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-red-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>TRANSMISSÃO AO VIVO EM TEMPO REAL</span>
            </div>
          )}

          {/* Action buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlayPause}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Rewind 10s */}
              <button
                onClick={rewind10}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Voltar 10 segundos"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Forward 10s */}
              <button
                onClick={forward10}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Avançar 10 segundos"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-medium">
                  {quality}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  DOLBY ATMOS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Subtitles Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSubtitlesMenu(!showSubtitlesMenu)}
                  className="p-2 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="Legendas"
                >
                  <Subtitles className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Legendas</span>
                </button>

                {showSubtitlesMenu && (
                  <div className="absolute bottom-10 right-0 w-48 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                      Legendas
                    </span>
                    {['Desativadas', 'Português (BR)', 'Inglês', 'Espanhol'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSubtitleLang(sub);
                          setShowSubtitlesMenu(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          subtitleLang === sub ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{sub}</span>
                        {subtitleLang === sub && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality & Audio Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <Sliders className="w-4 h-4" />
                  <span className="hidden sm:inline">Qualidade</span>
                </button>

                {showSettings && (
                  <div className="absolute bottom-10 right-0 w-64 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md z-30 flex flex-col gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Qualidade de Transmissão
                      </span>
                      <div className="flex flex-col gap-1">
                        {(['4K HDR', '1080p Full HD'] as const).map((q) => (
                          <button
                            key={q}
                            onClick={() => { setQuality(q); setShowSettings(false); }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              quality === q ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span>{q}</span>
                            {quality === q && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Áudio & Dublagem
                      </span>
                      <div className="flex flex-col gap-1">
                        {['Português (Original)', 'Inglês (Dolby 5.1)'].map((l) => (
                          <button
                            key={l}
                            onClick={() => { setAudioLang(l); setShowSettings(false); }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              audioLang === l ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span>{l}</span>
                            {audioLang === l && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Tela Cheia"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
