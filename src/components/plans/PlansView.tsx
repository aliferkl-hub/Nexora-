import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  HelpCircle, 
  Tag, 
  ArrowRight,
  Tv,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanConfig } from '../../types';
import { getWhatsAppNegotiateUrl, OFFICIAL_PIX_CONFIG } from '../../utils/pixHelper';

export const PlansView: React.FC = () => {
  const { 
    plans, 
    startCheckoutForPlan, 
    openAnnualPixModal,
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    adminConfig
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; err?: boolean } | null>(null);

  // Reference monthly plan price for accurate dynamic savings math
  const monthlyPlan = plans.find((p) => p.id === 'mensal') || plans[0];
  const baseMonthlyPrice = monthlyPlan.priceMonthlyEquiv;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback({ msg: res.message, err: !res.success });
  };

  return (
    <div className="w-full py-12 sm:py-20 bg-[#080607] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-amber-300 text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACESSO COMPLETO E SEM FIDELIDADE</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight text-balance">
            ESCOLHA SEU PLANO PIZZA CINE
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg mt-4 leading-relaxed">
            {adminConfig.promoBannerActive ? adminConfig.promoBannerText : 'Assista em 4K HDR nos seus dispositivos favoritos. Cancele online quando quiser.'}
          </p>
        </div>

        {/* Promo Notice Strip */}
        <div className="max-w-4xl mx-auto mb-10 p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-amber-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider block">
                CONDIÇÃO ESPECIAL DE LANÇAMENTO
              </span>
              <span className="text-sm text-slate-200 font-medium">
                Planos Trimestral, Semestral e Anual com ativação via PIX e atendimento WhatsApp.
              </span>
            </div>
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
            {appliedCoupon ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs text-emerald-300">
                <Tag className="w-3.5 h-3.5" />
                <span className="font-bold">{appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="ml-1 text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  placeholder="Cupom (ex: PIZZA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 w-full sm:w-44 uppercase"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-extrabold bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-xl hover:from-rose-500 hover:to-amber-400 transition-colors whitespace-nowrap cursor-pointer border border-amber-300/30"
                >
                  Aplicar
                </button>
              </div>
            )}
          </form>
        </div>

        {couponFeedback && (
          <p className={`text-xs text-center mb-6 font-medium ${couponFeedback.err ? 'text-red-400' : 'text-emerald-400'}`}>
            {couponFeedback.msg}
          </p>
        )}

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {plans.filter(p => p.active).map((plan) => {
            const isAnnual = plan.id === 'anual';
            const isQuarterly = plan.id === 'trimestral';
            const isSemiannual = plan.id === 'semestral';

            // Dynamic savings calculation
            const nominalFullPrice = baseMonthlyPrice * plan.billingPeriodMonths;
            const savings = nominalFullPrice - plan.totalPrice;
            const savingsPercent = Math.round((savings / nominalFullPrice) * 100);

            // Discount with coupon if applied
            const discountAmt = appliedCoupon ? (plan.totalPrice * appliedCoupon.discountPercent) / 100 : 0;
            const finalPrice = Math.max(0, plan.totalPrice - discountAmt);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl p-6 transition-all duration-300 ${
                  isAnnual
                    ? 'bg-gradient-to-b from-[#0F172A] via-[#0A1020] to-[#070B16] border-2 border-cyan-400 shadow-2xl shadow-cyan-950/60 lg:-translate-y-2'
                    : isQuarterly
                    ? 'bg-[#0A0E1C] border border-cyan-500/40 shadow-xl'
                    : 'bg-[#080C18] border border-white/8 hover:border-white/20'
                }`}
              >
                {/* Top Badge */}
                {plan.badgeText && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                      isAnnual
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-extrabold'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {plan.badgeText}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-5 pt-1">
                  <h3 className="font-display font-bold text-xl text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-4 pb-4 border-b border-white/8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-medium">R$</span>
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
                      {plan.priceMonthlyEquiv.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-slate-400">/ mês</span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1.5 flex items-center justify-between">
                    <span>Total: R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isAnnual ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {isAnnual ? 'PIX à vista ou até 12x' : 'À vista no PIX'}
                    </span>
                  </div>

                  {/* Savings Visual Callout */}
                  {plan.savingsLabel && (
                    <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{plan.savingsLabel}</span>
                    </div>
                  )}

                  {savings > 0 && !plan.savingsLabel && (
                    <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-semibold text-emerald-300">
                      Economize R$ {savings.toFixed(2).replace('.', ',')} ({savingsPercent}% OFF)
                    </div>
                  )}
                </div>

                {/* App Access Callout */}
                {plan.includesApp ? (
                  <div className="mb-4 px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-[11px]">INCLUI ACESSO PELO APLICATIVO</span>
                  </div>
                ) : (
                  <div className="mb-4 px-3 py-2 rounded-xl bg-white/5 text-xs text-slate-400 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-[11px]">Acesso via Navegador Web</span>
                  </div>
                )}

                {/* Benefits List */}
                <div className="flex-1 flex flex-col gap-2.5 mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Benefícios Inclusos:
                  </div>
                  {plan.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Buttons & Installment Notices */}
                {isAnnual ? (
                  <div className="space-y-2.5">
                    {/* Primary Button: Assinar Plano Anual */}
                    <button
                      type="button"
                      onClick={() => openAnnualPixModal()}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/30 hover:from-cyan-300 hover:to-teal-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>ASSINAR PLANO ANUAL</span>
                    </button>

                    {/* Notice of Installments */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
                      <span className="text-[11px] font-bold text-white block">
                        Plano anual — pagamento parcelado disponível
                      </span>
                      <p className="text-[10px] text-emerald-300/90 leading-tight">
                        Para pagamento parcelado, fale conosco pelo WhatsApp.
                      </p>
                    </div>

                    {/* Button 4: PAGAR / FALAR NO WHATSAPP */}
                    <a
                      href={getWhatsAppNegotiateUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-[11px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>PAGAR / FALAR NO WHATSAPP</span>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() => startCheckoutForPlan(plan.id)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/10"
                  >
                    <span>ASSINAR AGORA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <p className="text-[10px] text-center text-slate-400 mt-2.5">
                  {isAnnual ? 'Chave Pix oficial + Suporte direto WhatsApp' : 'Ativação instantânea · Cancele quando quiser'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Trust Seals */}
        <div className="mt-16 pt-10 border-t border-white/8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Transmissão Licenciada</h4>
              <p className="text-xs text-slate-400 mt-0.5">Sinal estável e catálogo 100% autorizado por direitos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Liberação Imediata</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pagou via PIX? Seu login e streaming funcionam no mesmo minuto.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Suporte Humano</h4>
              <p className="text-xs text-slate-400 mt-0.5">Atendimento ágil direto no WhatsApp para tirar dúvidas.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
