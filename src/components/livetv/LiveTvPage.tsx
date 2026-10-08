import React, { useState } from 'react';
import { 
  Radio, 
  Play, 
  Tv, 
  Calendar, 
  Clock, 
  Volume2, 
  Maximize2, 
  ShieldCheck, 
  Check, 
  Bookmark,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types';
import { StreamingImage } from '../common/StreamingImage';
import { isContentPlayable } from '../../utils/catalogValidation';

export const LiveTvPage: React.FC = () => {
  const { 
    contents, 
    activeLiveChannel, 
    setActiveLiveChannel, 
    openPlayer,
    toggleFavorite,
    isFavorite 
  } = useApp();

  const channels = contents.filter((c) => c.type === 'channel' && !c.hidden && !c.isDemo);

  const categories = [
    'Todos os Canais',
    'Notícias',
    'Ciência & Espaço',
    'Cultura',
    'Educativo'
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos os Canais');
  const currentChannel = activeLiveChannel || channels[0];

  const filteredChannels = channels.filter((c) => {
    if (selectedCategory === 'Todos os Canais') return true;
    return c.genre.some((g) => g.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  const isFav = currentChannel ? isFavorite(currentChannel.id) : false;
  const playable = currentChannel ? isContentPlayable(currentChannel) : false;

  return (
    <div className="w-full bg-[#06080F] min-h-screen text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>TRANSMISSÕES OFICIAIS AO VIVO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">SINAIS HOMOLOGADOS</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight">
              TV AO VIVO EM ALTA DEFINIÇÃO
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sinais e programações homologadas em 60 FPS com baixa latência para todos os aparelhos.
            </p>
          </div>
        </div>

        {/* Featured Live Screen / Player Anchor */}
        {currentChannel && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-cyan-500/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Broadcast Preview Frame */}
              <div className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group shadow-xl">
                <StreamingImage
                  src={currentChannel.bannerUrl}
                  alt={currentChannel.title}
                  type="channel"
                  aspect="banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* On-air badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-mono font-bold text-xs uppercase shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>AO VIVO</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-slate-200 font-mono text-xs">
                    60 FPS
                  </span>
                </div>

                {/* Channel Logo Watermark */}
                {currentChannel.logoUrl && (
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-black/70 border border-white/20 p-1 backdrop-blur-sm z-10 shadow-lg">
                    <img 
                      src={currentChannel.logoUrl} 
                      alt="" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Play trigger overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {playable ? (
                    <button
                      onClick={() => openPlayer(currentChannel)}
                      className="p-5 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:scale-110 transition-all shadow-2xl shadow-cyan-500/50 cursor-pointer"
                      title="Assistir Transmissão Ao Vivo"
                    >
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-full bg-black/80 border border-amber-500/40 text-amber-300 font-mono text-xs">
                      Sinal em manutenção ou autorização pendente
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 font-mono z-10">
                  <span>{currentChannel.audioSpecs?.[0] || '1080p 60 FPS'}</span>
                  <span>Sinal Estável CDN Edge</span>
                </div>
              </div>

              {/* Channel Info & EPG Guide */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {currentChannel.logoUrl && (
                        <img 
                          src={currentChannel.logoUrl} 
                          alt="" 
                          className="w-7 h-7 rounded-lg object-cover border border-white/10"
                        />
                      )}
                      <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                        📡 CANAL {currentChannel.channelNumber || '01'}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Sinal Homologado
                    </span>
                  </div>

                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                    {currentChannel.title}
                  </h2>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {currentChannel.description}
                  </p>
                </div>

                {/* EPG Schedule Grid with "No ar agora" and "A seguir" */}
                {currentChannel.epgSchedule && currentChannel.epgSchedule.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/8 pb-2">
                      <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        Guia de Programação (EPG)
                      </span>
                      <span className="text-[11px] text-slate-400">Horário Oficial de Brasília</span>
                    </div>

                    <div className="space-y-2">
                      {/* No ar agora */}
                      {currentChannel.epgSchedule[0] && (
                        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-extrabold uppercase shrink-0 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            NO AR AGORA
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-white text-xs font-bold block line-clamp-1">
                              {currentChannel.epgSchedule[0].title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Início: {currentChannel.epgSchedule[0].time}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* A seguir */}
                      {currentChannel.epgSchedule[1] && (
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] font-bold uppercase shrink-0 mt-0.5">
                            A SEGUIR
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-slate-200 text-xs font-semibold block line-clamp-1">
                              {currentChannel.epgSchedule[1].title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Às {currentChannel.epgSchedule[1].time}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {playable ? (
                    <button
                      onClick={() => openPlayer(currentChannel)}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm hover:from-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>ASSISTIR TRANSMISSÃO</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-400 text-xs text-center font-mono">
                      Aguardando liberação de sinal
                    </div>
                  )}

                  <button
                    onClick={() => toggleFavorite(currentChannel.id)}
                    className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      isFav 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                    }`}
                    title={isFav ? 'Remover dos Favoritos' : 'Salvar Canal'}
                  >
                    {isFav ? <Check className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-white/8 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channels Grid with Distinct Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredChannels.map((channel) => {
            const isSelected = currentChannel?.id === channel.id;
            return (
              <div
                key={channel.id}
                onClick={() => {
                  setActiveLiveChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#0E1526] border-cyan-400 shadow-lg shadow-cyan-950/40' 
                    : 'bg-[#090D18] border-white/8 hover:border-cyan-500/30'
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                    <StreamingImage
                      src={channel.bannerUrl}
                      alt={channel.title}
                      type="channel"
                      aspect="banner"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 font-mono text-[9px] font-bold text-white uppercase z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>AO VIVO</span>
                    </div>

                    {channel.logoUrl && (
                      <div className="absolute bottom-2 right-2 w-9 h-9 rounded-lg bg-black/80 border border-white/20 p-1 z-10">
                        <img src={channel.logoUrl} alt="" className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    {channel.logoUrl && (
                      <img src={channel.logoUrl} alt="" className="w-6 h-6 rounded object-cover border border-white/10" />
                    )}
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold block">
                      CANAL {channel.channelNumber || '01'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {channel.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {channel.audioSpecs?.[0] || 'HD 60 FPS'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPlayer(channel);
                    }}
                    className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Assistir</span>
                    <span>▶</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
