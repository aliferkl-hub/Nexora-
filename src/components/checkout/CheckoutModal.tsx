import React, { useState } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  FileText, 
  Copy, 
  Check, 
  ArrowLeft, 
  Lock, 
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanConfig } from '../../types';
import { QRCodeSVG } from '../common/QRCodeSVG';

export const CheckoutView: React.FC = () => {
  const { 
    plans, 
    selectedPlanForCheckout, 
    setSelectedPlanForCheckout,
    appliedCoupon,
    completeSubscriptionPayment,
    currentUser,
    setActiveView,
    addToast
  } = useApp();

  const currentPlan: PlanConfig = selectedPlanForCheckout || plans[1] || plans[0];

  // Steps: 1: Identificação, 2: Pagamento, 3: Processando, 4: Sucesso
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto'>('PIX');
  
  // Card state (purely tokenized simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Pix simulated state
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const discountAmount = appliedCoupon 
    ? (currentPlan.totalPrice * appliedCoupon.discountPercent) / 100 
    : 0;
  const finalPrice = Math.max(0, currentPlan.totalPrice - discountAmount);

  const pixPayload = `00020126580014br.gov.bcb.pix0136nexora-pay-${Date.now()}520400005303986540${finalPrice.toFixed(2)}5802BR5916NEXORA PLAY ENT6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    addToast('Código PIX Copia e Cola copiado para a área de transferência!', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setStep(3);

    // Simulate gateway authentication & webhooks settlement
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
      completeSubscriptionPayment(currentPlan.id, paymentMethod);
    }, 1800);
  };

  return (
    <div className="w-full py-10 sm:py-16 bg-[#06080F] min-h-[90vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Nav */}
        <button
          onClick={() => setActiveView('plans')}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Planos</span>
        </button>

        {/* Header Breadcrumbs */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
            CHECKOUT SEGURO SSL 256-BIT
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            FINALIZAR ASSINATURA NEXORA PLAY
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (Steps) */}
          <div className="lg:col-span-7 bg-[#090D18] border border-white/8 rounded-2xl p-6 sm:p-8">
            
            {/* Step 1: Customer Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <h2 className="font-display font-bold text-lg text-white">
                    1. Dados para Liberação da Conta
                  </h2>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    Etapa 1 de 2
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Alifer Gael"
                      className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      E-mail (para login e envio de credenciais)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp / Celular com DDD (para suporte direto)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!name.trim() || !email.trim()) {
                      addToast('Por favor, preencha nome e e-mail para continuar.', 'warning');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-sm rounded-xl hover:from-cyan-300 hover:to-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Pagamento</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">
                      2. Forma de Pagamento
                    </h2>
                    <p className="text-xs text-slate-400">
                      Ambiente criptografado. Escolha sua opção de preferência.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Editar dados
                  </button>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'PIX', label: 'PIX Imediato', badge: 'Ativação Instantânea', icon: QrCode },
                    { id: 'Cartão de Crédito', label: 'Cartão', badge: 'Até 12x', icon: CreditCard },
                    { id: 'Boleto', label: 'Boleto', badge: '1-2 dias úteis', icon: FileText }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                            : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-semibold">{m.label}</span>
                        <span className="text-[10px] text-slate-400 leading-none">{m.badge}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-view: PIX */}
                {paymentMethod === 'PIX' && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/8 text-center flex flex-col items-center">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-3">
                      <Sparkles className="w-4 h-4" />
                      <span>LIBERAÇÃO NO MESMO SEGUNDO VIA PIX</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl mb-3 shadow-lg">
                      <QRCodeSVG value={pixPayload} size={150} />
                    </div>

                    <p className="text-xs text-slate-300 max-w-xs mb-3">
                      Abra o aplicativo do seu banco, escolha PIX e aponte a câmera para o QR Code acima.
                    </p>

                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPix ? 'Copiado com Sucesso!' : 'Copiar Chave PIX (Copia e Cola)'}</span>
                    </button>
                  </div>
                )}

                {/* Sub-view: Cartão de Crédito */}
                {paymentMethod === 'Cartão de Crédito' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nome Impresso no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="NOME COMO NO CARTÃO"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Parcelamento
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="1">1x de R$ {finalPrice.toFixed(2).replace('.', ',')} (sem juros)</option>
                        {finalPrice > 100 && (
                          <>
                            <option value="3">3x de R$ {(finalPrice / 3).toFixed(2).replace('.', ',')} (sem juros)</option>
                            <option value="6">6x de R$ {(finalPrice / 6).toFixed(2).replace('.', ',')} (sem juros)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Transação criptografada com PCI-DSS Compliance. Não armazenamos o código de segurança.</span>
                    </p>
                  </div>
                )}

                {/* Sub-view: Boleto */}
                {paymentMethod === 'Boleto' && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/8 text-center text-xs text-slate-300">
                    <p className="mb-2">
                      O boleto bancário será gerado com vencimento para 3 dias úteis. A liberação ocorre após a compensação bancária.
                    </p>
                    <span className="font-mono text-cyan-300 block bg-slate-900 p-2 rounded-lg border border-white/5 break-all">
                      34191.79001 01043.510047 91020.150008 4 94520000007998
                    </span>
                  </div>
                )}

                {/* Confirm Pay Button */}
                <button
                  onClick={handleConfirmPayment}
                  className="w-full py-4 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl hover:from-cyan-300 hover:to-teal-200 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>
                    {paymentMethod === 'PIX' ? 'Já Paguei via PIX / Liberar Acesso' : `Pagar R$ ${finalPrice.toFixed(2).replace('.', ',')}`}
                  </span>
                </button>
              </div>
            )}

            {/* Step 3: Processing Animation */}
            {step === 3 && (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mb-6" />
                <h3 className="font-display font-bold text-xl text-white">
                  Validando Transação no Gateway...
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Estamos provisionando seus nós de streaming e sincronizando sua licença de acesso premium.
                </p>
              </div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mb-5 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <h3 className="font-display font-extrabold text-2xl text-white uppercase">
                  Acesso Liberado com Sucesso!
                </h3>

                <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
                  Bem-vindo à NEXORA PLAY! Sua assinatura do <strong className="text-cyan-300">{currentPlan.name}</strong> está ativa. Você já pode assistir a todos os filmes, séries e canais.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => {
                      setActiveView('client');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm hover:from-cyan-300 transition-all cursor-pointer"
                  >
                    Ir para Meu Nexora
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-white font-semibold text-xs sm:text-sm hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Explorar Catálogo Agora
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-[#090D18] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="font-display font-bold text-base text-white border-b border-white/8 pb-3">
              Resumo da Assinatura
            </h3>

            {/* Plan switcher */}
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                Plano Selecionado
              </span>
              <div className="flex flex-col gap-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanForCheckout(p)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentPlan.id === p.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-white'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.subtitle}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      R$ {p.totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plan specs */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Telas Simultâneas:</span>
                <span className="font-medium text-white">{currentPlan.screensCount} dispositivos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolução Máxima:</span>
                <span className="font-medium text-cyan-300">{currentPlan.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acesso por App:</span>
                <span className="font-medium text-emerald-400">
                  {currentPlan.includesApp ? 'Incluso' : 'Web App'}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 border-t border-white/8 pt-4 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({currentPlan.billingCycle}):</span>
                <span className="font-mono text-white">R$ {currentPlan.totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Cupom ({appliedCoupon.code} -{appliedCoupon.discountPercent}%):</span>
                  <span className="font-mono">- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/8 pt-2">
                <span>Total a Pagar:</span>
                <span className="font-mono text-cyan-400 text-base">
                  R$ {finalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Garantia de satisfação de 7 dias ou cancelamento sem taxas.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
