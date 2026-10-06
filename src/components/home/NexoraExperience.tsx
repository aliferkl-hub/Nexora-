import React from 'react';
import { Tv, Zap, ShieldCheck, Smartphone, Volume2, Film } from 'lucide-react';

export const NexoraExperience: React.FC = () => {
  const features = [
    {
      icon: Film,
      title: 'Resolução 4K HDR Real',
      desc: 'Bitrate dinâmico calibrado para reprodução cristalina sem compressão agressiva, com suporte a HDR10 e Dolby Vision.'
    },
    {
      icon: Volume2,
      title: 'Áudio Imersivo Dolby Atmos',
      desc: 'Experiência sonora tridimensional que envolve o ambiente, com suporte nativo a sistemas de home theater 5.1 e 7.1 canais.'
    },
    {
      icon: Zap,
      title: 'Zero Travamentos (CDN Edge)',
      desc: 'Infraestrutura distribuída com servidores em múltiplos pontos do Brasil para início instantâneo de vídeo e sem buffering.'
    },
    {
      icon: Smartphone,
      title: 'Acesso Multiplataforma Fluido',
      desc: 'Comece a assistir na Smart TV da sala e continue exatamente do mesmo segundo no seu smartphone ou tablet.'
    },
    {
      icon: ShieldCheck,
      title: 'Transmissão 100% Homologada',
      desc: 'Operamos rigorosamente com direitos de distribuição autorizados, proporcionando estabilidade contínua sem riscos de quedas.'
    },
    {
      icon: Tv,
      title: 'Canais Ao Vivo em 60 FPS',
      desc: 'Transmissões esportivas e notícias com alta taxa de quadros para máxima nitidez nos lances mais rápidos.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#080B14] border-y border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400 font-mono">
            ENGENHARIA E DESIGN DE ENTRETENIMENTO
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight mt-2 text-balance">
            A EXPERIÊNCIA NEXORA PLAY
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Desenvolvida para quem valoriza imagem impecável, velocidade instantânea e simplicidade extrema no controle remoto ou na tela do celular.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#0B0F1E] border border-white/8 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1">
                  0{idx + 1}. PADRÃO PREMIUM
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
