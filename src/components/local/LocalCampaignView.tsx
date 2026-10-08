import React from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  QrCode, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  Tv, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PizzaCineLogo } from '../brand/PizzaCineLogo';
import { QRCodeSVG } from '../common/QRCodeSVG';

export const LocalCampaignView: React.FC = () => {
  const { referralCode, startCheckoutForPlan, setActiveView } = useApp();

  const campaignUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?ref=${referralCode || 'BAIRRO-VIP'}` 
    : 'https://pizzacine.com.br';

  const handleShare = (network: string) => {
    const text = encodeURIComponent(`Moradores e vizinhos: conheçam o PIZZA CINE com desconto de condomínio! Filmes e séries em 4K HDR: ${campaignUrl}`);
    if (network === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } else {
      navigator.clipboard.writeText(campaignUrl);
    }
  };

  return (
    <div className="w-full py-12 sm:py-20 bg-[#080607] min-h-[90vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Neighborhood & Condominium Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-amber-300 text-xs font-mono mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>CAMPANHA DE BAIRRO & CONDOMÍNIO RESIDENCIAL</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight text-balance">
            PIZZA CINE NO SEU CONDOMÍNIO
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg mt-4 leading-relaxed">
            Streaming premium na Smart TV para moradores e famílias. Ativação no mesmo instante com condição exclusiva e pagamento via PIX.
          </p>
        </div>

        {/* Promo Hero Box with QR Code */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B1020] via-[#080D1A] to-[#04060E] border-2 border-cyan-500/30 shadow-2xl mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>OFERTA ESPECIAL PARA RESIDENTES</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight">
              ASSINE 3 MESES E GANHE 1 MÊS GRÁTIS
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sem necessidade de aparelho externo ou fiação. Funciona diretamente pelo navegador da sua Smart TV Samsung, LG ou Android TV, além de celulares e notebooks.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Qualidade 4K Ultra HD & Áudio Dolby Atmos</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Até 5 telas simultâneas para toda a família</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Transmissão 100% legalizada e autorizada</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => startCheckoutForPlan('trimestral')}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:from-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <span>Garantir Condição de Morador</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QR Code Presentation Frame */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-black/40 border border-white/8">
            <div className="p-3 bg-white rounded-2xl shadow-2xl mb-3">
              <QRCodeSVG value={campaignUrl} size={160} />
            </div>

            <span className="text-xs font-mono font-bold text-cyan-300 block">
              Aponte a câmera do celular
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Direciona imediatamente para a oferta de morador
            </span>
          </div>

        </div>

        {/* Share with Neighbors Strip */}
        <div className="p-6 rounded-2xl bg-[#090D18] border border-white/8 text-center">
          <h3 className="font-display font-bold text-base text-white mb-2">
            Compartilhe no Grupo do Condomínio ou Família
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Ajude seus vizinhos a terem entretenimento de alta qualidade sem travamentos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Grupo do WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="px-4 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('link')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Copiar Link da Campanha</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
