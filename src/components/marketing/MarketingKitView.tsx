import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  Sparkles, 
  Instagram, 
  MessageCircle, 
  Facebook, 
  Send,
  Printer,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PizzaCineLogo } from '../brand/PizzaCineLogo';
import { QRCodeSVG } from '../common/QRCodeSVG';

export const MarketingKitView: React.FC = () => {
  const { referralCode, setReferralCode, startCheckoutForPlan, addToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'stories' | 'feed' | 'facebook' | 'flyer' | 'whatsapp'>('stories');

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pizzacine.com.br';
  const customReferralUrl = `${originUrl}/?ref=${referralCode || 'PIZZA-VIP'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customReferralUrl);
    setCopiedLink(true);
    addToast('Link de indicação copiado!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Conheça o PIZZA CINE: Filmes e séries em 4K HDR. O sabor do cinema chegou! Acesse: ${customReferralUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full py-12 sm:py-20 bg-[#080607] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Headline specified by user */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KIT OFICIAL DE MARKETING & AFILIADOS</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight text-balance">
            O SABOR DO CINEMA NA SUA TELA.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Compartilhe o PIZZA CINE com amigos, condomínios ou nas suas redes sociais e acumule vantagens e mensalidades gratuitas.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => startCheckoutForPlan('trimestral')}
              className="px-6 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-950/40 hover:from-rose-500 hover:to-amber-400 transition-all cursor-pointer border border-amber-300/30"
            >
              QUERO SER PIZZA CINE
            </button>
            <button
              onClick={handleCopyLink}
              className="px-5 py-3.5 bg-slate-900 border border-white/15 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>COMPARTILHAR</span>
            </button>
          </div>
        </div>

        {/* Custom Referral Link Box */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#090D18] border border-cyan-500/30 mb-14">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-2">
            SEU LINK DE INDICAÇÃO PESSOAL
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 font-mono text-xs break-all select-all">
              {customReferralUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-5 py-3 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>Seu código atual: <strong className="text-white font-mono">{referralCode}</strong></span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 hover:bg-emerald-900/60 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Marketing Asset Generator for Social Networks & Physical Flyers */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-display font-bold text-2xl text-white">
              Banners e Artes Prontas para Download
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Formatos calibrados para Instagram Stories, Reels, TikTok, Feed 1:1, Facebook e Flyer para impressão em condomínios e comércios.
            </p>
          </div>

          {/* Format selector buttons */}
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            {[
              { id: 'stories', label: 'Stories & TikTok (9:16)' },
              { id: 'feed', label: 'Instagram Feed (1:1)' },
              { id: 'facebook', label: 'Facebook & Web (16:9)' },
              { id: 'flyer', label: 'Flyer A4 / Cartaz' },
              { id: 'whatsapp', label: 'WhatsApp Status' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedFormat === f.id
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#090D18] text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Interactive Live Art Preview */}
          <div className="max-w-xl mx-auto flex flex-col items-center">
            
            {/* 9:16 Stories / TikTok Mockup */}
            {selectedFormat === 'stories' && (
              <div className="w-[280px] sm:w-[320px] aspect-[9/16] rounded-3xl bg-gradient-to-b from-[#0F0A0C] via-[#050304] to-[#1A0B10] border-2 border-rose-500/40 p-6 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <PizzaCineLogo size="md" variant="stacked" className="mx-auto mt-2" />
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mt-4">
                    O SABOR DO CINEMA
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-white uppercase mt-1 leading-tight">
                    SEU FILME FAVORITO.<br />DO SEU JEITO.
                  </h3>
                </div>

                <div className="my-auto py-4">
                  <div className="inline-block p-2 rounded-2xl bg-white shadow-xl">
                    <QRCodeSVG value={customReferralUrl} size={130} />
                  </div>
                  <span className="text-[11px] text-amber-300 font-mono block mt-2">
                    Aponte a câmera e comece a assistir
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 mb-2">
                    Filmes · Séries · 4K HDR · Sem Travamentos
                  </div>
                  <div className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-xs uppercase shadow-md border border-amber-300/30">
                    pizzacine.com.br
                  </div>
                </div>
              </div>
            )}

            {/* 1:1 Feed Post Mockup */}
            {selectedFormat === 'feed' && (
              <div className="w-[300px] sm:w-[360px] aspect-square rounded-3xl bg-[#0D090B] border-2 border-rose-500/40 p-6 flex flex-col justify-between text-center shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <PizzaCineLogo size="sm" />
                  <span className="text-[10px] font-mono text-emerald-400">100% Homologado</span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-xl text-white uppercase">
                    SEU FILME FAVORITO.<br />SUA SÉRIE FAVORITA.
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Sem travamentos. Qualidade 4K Ultra HD & Dolby Atmos.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 py-2">
                  <QRCodeSVG value={customReferralUrl} size={100} />
                  <div className="text-left text-xs">
                    <span className="text-amber-400 font-mono font-bold block">PLANO ANUAL ESPECIAL</span>
                    <span className="text-white font-display font-extrabold text-lg">Chave Pix Oficial</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">Ativação imediata via WhatsApp</span>
                  </div>
                </div>

                <div className="py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-amber-300 text-xs font-mono">
                  {customReferralUrl}
                </div>
              </div>
            )}

            {/* Flyer / Cartaz Mockup */}
            {selectedFormat === 'flyer' && (
              <div className="w-[300px] sm:w-[360px] aspect-[1/1.4] rounded-2xl bg-white text-slate-950 p-6 flex flex-col justify-between shadow-2xl relative">
                <div className="border-b-2 border-slate-900 pb-3 text-center">
                  <span className="font-display font-black text-2xl text-slate-950 tracking-wider">
                    PIZZA <span className="text-rose-600">CINE</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 block uppercase">
                    Streaming Premium para Moradores e Parceiros
                  </span>
                </div>

                <div className="text-center my-3">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                    ★ CONDIÇÃO EXCLUSIVA DE CONDOMÍNIO ★
                  </span>
                  <h4 className="font-display font-extrabold text-2xl text-slate-950 uppercase mt-1 leading-tight">
                    ASSINE 3 MESES E GANHE 1 MÊS GRÁTIS
                  </h4>
                  <p className="text-xs text-slate-700 mt-2">
                    Acesse canais ao vivo, filmes de lançamento e séries em 4K na sua Smart TV e Celular.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-100 p-4 rounded-xl border border-slate-300">
                  <QRCodeSVG value={customReferralUrl} size={130} />
                  <span className="text-xs font-bold text-slate-900 mt-2">
                    ESCANIE O QR CODE COM A CÂMERA
                  </span>
                </div>

                <div className="text-center text-[11px] text-slate-600">
                  Dúvidas e Ativação: <strong>suporte oficial via WhatsApp</strong><br />
                  Acesso imediato sem burocracia.
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => addToast('Arquivo de alta resolução gerado para impressão/compartilhamento!', 'success')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white hover:border-cyan-400 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Baixar Arte em Alta Resolução</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white hover:border-cyan-400 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Imprimir Folheto</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
