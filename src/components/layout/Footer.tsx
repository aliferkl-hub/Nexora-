import React from 'react';
import { ShieldCheck, Lock, Heart, MessageCircle, HelpCircle } from 'lucide-react';
import { NexoraLogo } from '../brand/NexoraLogo';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';

export const Footer: React.FC = () => {
  const { setActiveView, adminConfig } = useApp();

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#04060C] border-t border-white/5 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <NexoraLogo size="md" withSlogan />
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              NEXORA PLAY é uma plataforma de streaming premium com tecnologia de ultra-baixa latência e catálogo 100% autorizado. Qualidade 4K HDR e som imersivo Dolby Atmos para todos os seus dispositivos.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                Catálogo Homologado
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                SSL 256-bit Seguro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-cyan-400 transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('catalog')} className="hover:text-cyan-400 transition-colors">
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('plans')} className="hover:text-cyan-400 transition-colors">
                  Planos e Preços
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('client')} className="hover:text-cyan-400 transition-colors">
                  Meu Nexora (Área do Cliente)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="text-slate-500 hover:text-cyan-400 transition-colors">
                  Painel Master Owner
                </button>
              </li>
            </ul>
          </div>

          {/* Marketing & Parcerias */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Divulgação & Parcerias
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('local-campaign')} className="hover:text-cyan-400 transition-colors text-left">
                  Indique a Nexora (Condomínios)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('marketing-kit')} className="hover:text-cyan-400 transition-colors text-left">
                  Kit Oficial de Marketing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('marketing-kit')} className="hover:text-cyan-400 transition-colors text-left">
                  Gerador de Link de Indicação
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('plans')} className="text-cyan-400 font-semibold hover:underline">
                  Oferta Pague 2 Leve 3
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Suporte */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-cyan-400 transition-colors">
                  Sobre a Nexora Play
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('licenses')} className="hover:text-cyan-400 transition-colors text-left">
                  Direitos & Licenciamento
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-cyan-400 transition-colors">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-cyan-400 transition-colors">
                  Política de Privacidade
                </button>
              </li>
              <li>
                <span className="text-slate-400 block pt-1 font-mono text-[11px]">
                  WhatsApp: {adminConfig.supportWhatsApp}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Quiet Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} NEXORA PLAY ENTRETENIMENTO S.A. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <span>Operação 100% legalizada no Brasil</span>
            <span aria-hidden="true">·</span>
            <span>CNPJ: 48.910.201/0001-44</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
