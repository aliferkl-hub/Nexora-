import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarketingCtaBanner: React.FC = () => {
  const { startCheckoutForPlan, setActiveView } = useApp();

  return (
    <section className="w-full py-16 sm:py-24 bg-[#06080F] relative overflow-hidden">
      {/* Background aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-blue-900/10 to-purple-900/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ENTRE NO UNIVERSO NEXORA</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight text-balance leading-tight">
          ENTRETENIMENTO PREMIUM<br />
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            SEM COMPLICAÇÃO.
          </span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Assista a produções licenciadas, canais ao vivo e novidades em 4K HDR. Ativação imediata em todos os seus aparelhos.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => startCheckoutForPlan('trimestral')}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:from-cyan-300 hover:to-teal-200 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>QUERO SER NEXORA</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveView('plans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-4 bg-slate-900 border border-white/15 text-white font-semibold text-sm sm:text-base rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            VER TODOS OS PLANOS
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Licenciamento homologado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Sem taxas ocultas ou carência</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Cancele online quando quiser</span>
          </div>
        </div>

      </div>
    </section>
  );
};
