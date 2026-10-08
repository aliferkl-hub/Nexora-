import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  Clock, 
  Lock, 
  CheckCircle, 
  QrCode, 
  Smartphone,
  ChevronRight,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from '../common/QRCodeSVG';
import { 
  OFFICIAL_PIX_CONFIG, 
  generatePixCopiaECola, 
  getWhatsAppNegotiateUrl, 
  getWhatsAppProofUrl 
} from '../../utils/pixHelper';

export const AnnualPlanPixModal: React.FC = () => {
  const { 
    isAnnualPixModalOpen, 
    closeAnnualPixModal, 
    plans, 
    appliedCoupon, 
    currentUser, 
    createPaymentOrder, 
    setActiveView, 
    addToast 
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [stage, setStage] = useState<'payment' | 'confirmation'>('payment');
  const [registeredOrderId, setRegisteredOrderId] = useState<string>('');

  // Client form fields (if not already logged in)
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');

  if (!isAnnualPixModalOpen) return null;

  const annualPlan = plans.find((p) => p.id === 'anual') || plans[3] || plans[0];
  const discount = appliedCoupon ? (annualPlan.totalPrice * appliedCoupon.discountPercent) / 100 : 0;
  const finalPrice = Math.max(0, annualPlan.totalPrice - discount);
  const pixCopiaECola = generatePixCopiaECola(finalPrice, registeredOrderId || 'PIZZACINEANUAL');

  // Copy raw phone key: 11973479473
  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_PIX_CONFIG.rawKey);
      setCopiedKey(true);
      addToast(`Chave Pix ${OFFICIAL_PIX_CONFIG.formattedKey} copiada com sucesso!`, 'success');
      setTimeout(() => setCopiedKey(false), 3500);
    } catch {
      addToast('Copie a chave manualmente: 11973479473', 'info');
    }
  };

  // Copy full EMVCo Copia e Cola code
  const handleCopyPixPayload = async () => {
    try {
      await navigator.clipboard.writeText(pixCopiaECola);
      setCopiedPayload(true);
      addToast('Código Pix Copia e Cola copiado!', 'success');
      setTimeout(() => setCopiedPayload(false), 3500);
    } catch {
      // fallback
    }
  };

  // Handle "PAGAMENTO REALIZADO / JÁ REALIZEI O PAGAMENTO"
  const handlePaymentDone = () => {
    const nameToUse = clientName.trim() || currentUser?.name || 'Cliente Pizza Cine';
    const emailToUse = clientEmail.trim() || currentUser?.email || 'cliente@pizzacine.com.br';
    const phoneToUse = clientPhone.trim() || currentUser?.phone || OFFICIAL_PIX_CONFIG.formattedKey;

    // Registers order with SECURITY RULE: Marked as WAITING CONFIRMATION (never automatically activated)
    const order = createPaymentOrder({
      planId: 'anual',
      paymentMethod: 'PIX',
      customerName: nameToUse,
      customerEmail: emailToUse,
      customerPhone: phoneToUse,
      status: 'waiting_payment',
      notes: `Chave Pix ${OFFICIAL_PIX_CONFIG.rawKey} utilizada. Cliente notificou conclusão do pagamento.`
    });

    setRegisteredOrderId(order.id);
    setStage('confirmation');
  };

  const openWhatsAppProof = () => {
    const url = getWhatsAppProofUrl(
      registeredOrderId 
        ? `Olá! Acabei de realizar o pagamento do plano anual (Pedido ${registeredOrderId}). Estou enviando meu comprovante para ativação.`
        : undefined
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openWhatsAppNegotiate = () => {
    const url = getWhatsAppNegotiateUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAnnualPixModal();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#090D18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 my-8 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeAnnualPixModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === 'payment' ? (
          <div className="space-y-6">
            
            {/* Header: Plano Anual */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>PAGAMENTO OFICIAL · PLANO ANUAL</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase">
                ASSINATURA DO PLANO ANUAL
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Acesso completo por 12 meses, 5 telas simultâneas em 4K HDR e aplicativo incluso.
              </p>
            </div>

            {/* Price Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0C1428] via-[#091022] to-[#070B16] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase block">
                  Valor Total do Plano Anual (12 Meses):
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-sm text-slate-400 font-bold">R$</span>
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
                    {finalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-slate-400">
                    (Equivalente a R$ {(finalPrice / 12).toFixed(2).replace('.', ',')}/mês)
                  </span>
                </div>
                {appliedCoupon && (
                  <span className="text-xs font-mono text-emerald-400 font-semibold mt-1 block">
                    ✓ Cupom {appliedCoupon.code} aplicado ({appliedCoupon.discountPercent}% OFF)
                  </span>
                )}
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase self-start sm:self-auto shadow-md shadow-cyan-500/30">
                50% de Economia
              </div>
            </div>

            {/* SECTION: PARCELAMENTO CALLOUT & WHATSAPP BUTTON */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-blue-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="font-bold text-sm text-white block">
                    💳 Plano anual — pagamento parcelado disponível
                  </span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Para pagamento parcelado, fale conosco pelo WhatsApp. Nossa equipe oferece opções facilitadas de parcelamento direto.
                  </p>
                </div>
              </div>

              {/* Botão: PAGAR / FALAR NO WHATSAPP */}
              <button
                type="button"
                onClick={openWhatsAppNegotiate}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>PAGAR / FALAR NO WHATSAPP (+55 11 97347-9473)</span>
              </button>
            </div>

            {/* SECTION: PAGAMENTO VIA PIX */}
            <div className="p-5 rounded-2xl bg-[#060A14] border border-cyan-500/40 space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Pagamento Instantâneo via PIX
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Chave oficial verificada
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Tipo: Telefone
                </span>
              </div>

              {/* Highlighted Pix Key Box */}
              <div className="p-4 rounded-2xl bg-[#090D1A] border-2 border-cyan-400/80 shadow-lg shadow-cyan-950/40 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Chave Pix Principal (Telefone):</span>
                  <span className="text-emerald-400 font-bold">✓ Homologada</span>
                </div>

                {/* Display formatted key */}
                <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/10 gap-2">
                  <div className="flex flex-col">
                    <span className="font-mono text-lg sm:text-xl font-extrabold text-cyan-300 tracking-wider">
                      {OFFICIAL_PIX_CONFIG.formattedKey}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Chave para transferência: {OFFICIAL_PIX_CONFIG.rawKey}
                    </span>
                  </div>

                  {/* BUTTON: COPIAR CHAVE PIX */}
                  <button
                    type="button"
                    onClick={handleCopyPixKey}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 ${
                      copiedKey
                        ? 'bg-emerald-400 text-slate-950 scale-105'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/30'
                    }`}
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Chave Copiada!' : 'COPIAR CHAVE PIX'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Toque no botão acima para copiar a chave diretamente para a área de transferência do seu celular.
                </p>
              </div>

              {/* QR Code Pix & Instruções */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-1">
                
                {/* QR Code Container */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200">
                  <QRCodeSVG value={pixCopiaECola} size={160} />
                  <span className="text-[10px] font-mono text-slate-800 font-bold mt-2 text-center">
                    QR Code Oficial PIZZA CINE
                  </span>
                </div>

                {/* Simple Instructions */}
                <div className="sm:col-span-7 space-y-2.5 text-xs text-slate-300">
                  <span className="font-bold text-white text-xs uppercase font-mono block text-cyan-300">
                    Instruções Simples para Pagamento:
                  </span>
                  
                  <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed">
                    <li>
                      Abra o aplicativo do seu banco no celular.
                    </li>
                    <li>
                      Acesse a área <strong>Pix</strong> e escolha <strong>Transferir</strong> por <strong>Telefone</strong> ou <strong>Ler QR Code</strong>.
                    </li>
                    <li>
                      Cole a chave <strong>{OFFICIAL_PIX_CONFIG.rawKey}</strong> ({OFFICIAL_PIX_CONFIG.formattedKey}).
                    </li>
                    <li>
                      Confirme o valor de <strong>R$ {finalPrice.toFixed(2).replace('.', ',')}</strong> e finalize a transferência.
                    </li>
                    <li>
                      Clique no botão abaixo para <strong>Enviar o Comprovante</strong> pelo WhatsApp para ativação rápida.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Alternative: Pix Copia e Cola code */}
              <div className="pt-2 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Prefere o código Pix Copia e Cola longo?
                </span>
                <button
                  type="button"
                  onClick={handleCopyPixPayload}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-white/10 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Código Copiado' : 'Copiar Pix Copia e Cola'}</span>
                </button>
              </div>

            </div>

            {/* Client Registration fields (if not logged in) */}
            {!currentUser && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                <span className="font-bold text-white block">
                  Seus Dados para Vinculação do Plano Anual:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Seu Nome"
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">E-mail para Login</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">WhatsApp com DDD</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Progression Button: PAGAMENTO REALIZADO */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handlePaymentDone}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base hover:from-cyan-300 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 cursor-pointer transform active:scale-95"
              >
                <span>PAGAMENTO REALIZADO / ENVIAR COMPROVANTE</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        ) : (
          /* STAGE 2: PÓS-PAGAMENTO & CONFIRMAÇÃO */
          <div className="py-4 space-y-6 text-center flex flex-col items-center">
            
            {/* Status Badge: PAGAMENTO AGUARDANDO CONFIRMAÇÃO */}
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>PAGAMENTO AGUARDANDO CONFIRMAÇÃO</span>
              </span>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase mt-1">
                JÁ REALIZOU O PAGAMENTO?
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-2 leading-relaxed">
                Para sua segurança e liberação imediata do seu acesso ao Plano Anual, envie agora o comprovante de pagamento Pix para nossa equipe pelo WhatsApp.
              </p>
            </div>

            {/* Pedido Info Card */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-black/50 border border-white/10 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Número do Pedido:</span>
                <span className="text-cyan-300 font-bold">{registeredOrderId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plano:</span>
                <span className="text-white">Plano Anual Premium (12 Meses)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Valor:</span>
                <span className="text-white font-bold">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chave Pix Utilizada:</span>
                <span className="text-cyan-300">{OFFICIAL_PIX_CONFIG.formattedKey}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                <span>Status Atual:</span>
                <span className="text-amber-400 font-bold">Aguardando Comprovante</span>
              </div>
            </div>

            {/* BUTTON 5: ENVIAR COMPROVANTE PELO WHATSAPP */}
            <div className="w-full max-w-md space-y-3">
              <button
                type="button"
                onClick={openWhatsAppProof}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/50 cursor-pointer transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>ENVIAR COMPROVANTE PELO WHATSAPP</span>
              </button>

              <p className="text-[11px] text-slate-400 leading-normal">
                Ao clicar no botão verde, seu WhatsApp abrirá automaticamente com o número <strong>+55 11 97347-9473</strong> para você anexar a foto ou comprovante do Pix.
              </p>
            </div>

            {/* Security Explanation */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/8 text-left text-xs text-slate-400 max-w-md flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-slate-200 block mb-0.5">Segurança & Política de Ativação</strong>
                A ativação definitiva da sua conta ocorre logo após a conferência do comprovante pelo atendente no WhatsApp ou pelo painel administrativo da plataforma.
              </div>
            </div>

            {/* Final Actions */}
            <div className="pt-2 flex gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  closeAnnualPixModal();
                  setActiveView('client');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Ver Status no Meu Pizza Cine
              </button>
              <button
                type="button"
                onClick={closeAnnualPixModal}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
