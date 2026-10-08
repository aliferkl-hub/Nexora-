import React, { useState } from 'react';
import { 
  Play, 
  Tv, 
  Smartphone, 
  Laptop, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  LogOut, 
  AlertTriangle, 
  Bookmark, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Receipt,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentCard } from '../home/ContentCard';
import { getWhatsAppProofUrl, OFFICIAL_PIX_CONFIG } from '../../utils/pixHelper';

export const ClientDashboard: React.FC = () => {
  const { 
    currentUser, 
    loginUser, 
    registerUser, 
    logoutUser, 
    plans, 
    cancelSubscription, 
    contents, 
    openPlayer,
    setActiveView,
    addToast
  } = useApp();

  // Auth form states if user is not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="w-full py-16 sm:py-24 bg-[#080607] min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-[#0C090A] border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              ÁREA EXCLUSIVA DE ASSINANTES
            </span>
            <h1 className="font-display font-extrabold text-2xl text-white uppercase mt-1">
              MEU PIZZA CINE
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Acesse sua conta para gerenciar planos, favoritos e dispositivos.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-900 rounded-xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                authMode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                authMode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {authMode === 'login' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                loginUser(email);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  E-mail Cadastrado
                </label>
                <input
                  type="email"
                  required
                  placeholder="alifergael76@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:from-rose-500 hover:to-amber-400 transition-all cursor-pointer shadow-md shadow-rose-950/40 border border-amber-300/30"
              >
                Acessar Meu Pizza Cine
              </button>

              <button
                type="button"
                onClick={() => loginUser('alifergael76@gmail.com')}
                className="w-full py-2.5 bg-slate-800 text-amber-300 border border-amber-500/30 font-medium text-xs rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Entrar com Conta Titular (alifergael76@gmail.com)
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name || !email) return;
                registerUser(name, email, phone);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Celular / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:from-cyan-300 transition-all cursor-pointer"
              >
                Criar Conta Gratuita
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Active plan lookup
  const userPlan = plans.find((p) => p.id === currentUser.currentPlanId) || plans[1];
  const isSubActive = currentUser.subscriptionStatus === 'active';
  const isSubPending = currentUser.subscriptionStatus === 'pending';

  // Get favorite contents
  const favoriteContents = contents.filter((c) => currentUser.favorites.includes(c.id));

  // Get continue watching contents
  const continueItems = currentUser.continueWatching.map((cw) => {
    const item = contents.find((c) => c.id === cw.contentId);
    return { ...cw, item };
  }).filter((ci) => ci.item);

  return (
    <div className="w-full py-10 sm:py-16 bg-[#06080F] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C1222] via-[#091020] to-[#070A14] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <span>MEU PIZZA CINE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">PAINEL DO ASSINANTE</span>
            </div>
            
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase">
              OLÁ, {currentUser.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Conta: <span className="text-slate-300 font-mono">{currentUser.email}</span> · Código de Indicação: <span className="text-cyan-300 font-mono font-bold">{currentUser.referralCode}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Action Button: ASSISTIR AGORA */}
            <button
              onClick={() => {
                setActiveView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:from-cyan-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>ASSISTIR AGORA</span>
            </button>

            <button
              onClick={logoutUser}
              className="p-3 bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pending payment banner notice */}
        {isSubPending && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-950/50 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-sm text-amber-300 block">
                  PAGAMENTO AGUARDANDO CONFIRMAÇÃO
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Seu pedido do {userPlan.name} está registrado. Para ativação imediata, envie seu comprovante Pix via WhatsApp.
                </p>
              </div>
            </div>

            <a
              href={getWhatsAppProofUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>ENVIAR COMPROVANTE NO WHATSAPP</span>
            </a>
          </div>
        )}

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Subscription Status Card */}
          <div className="lg:col-span-5 bg-[#090D18] border border-white/8 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/8 pb-3">
                <h2 className="font-display font-bold text-base text-white">
                  Status da Assinatura
                </h2>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isSubActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isSubPending
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {isSubActive ? 'ASSINATURA ATIVA' : isSubPending ? 'PAGAMENTO AGUARDANDO CONFIRMAÇÃO' : 'EXPIRADA / PENDENTE'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Plano Contratado:</span>
                  <span className="font-display font-bold text-base text-white">
                    {userPlan.name}
                  </span>
                  <span className="text-[11px] text-cyan-300 block">{userPlan.subtitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Vigência Até:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {currentUser.subscriptionValidUntil || '2026-11-20'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Renovação:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {currentUser.autoRenew ? 'Automática' : 'Manual'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Método de Pagamento:</span>
                  <span className="font-medium text-slate-200">{currentUser.paymentMethod || 'PIX Instantâneo'}</span>
                </div>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="pt-6 border-t border-white/8 mt-6 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setActiveView('plans')}
                className="flex-1 py-2.5 px-3 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Mudar ou Renovar Plano
              </button>

              {isSubActive && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="py-2.5 px-3 bg-transparent hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-900/40 text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar Assinatura
                </button>
              )}
            </div>
          </div>

          {/* Connected Devices Card */}
          <div className="lg:col-span-7 bg-[#090D18] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/8 pb-3">
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  Dispositivos Permitidos
                </h2>
                <p className="text-xs text-slate-400">
                  {currentUser.devices.length} de {userPlan.screensCount} telas em uso
                </p>
              </div>
              <span className="text-xs text-cyan-300 font-mono">
                {userPlan.resolution}
              </span>
            </div>

            <div className="space-y-3">
              {currentUser.devices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                      {dev.type === 'smart_tv' ? <Tv className="w-4 h-4" /> : dev.type === 'smartphone' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{dev.name}</span>
                        {dev.current && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                            Este aparelho
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px] block">{dev.browser} · Ativo: {dev.lastActive}</span>
                    </div>
                  </div>

                  {!dev.current && (
                    <button
                      onClick={() => addToast(`Dispositivo "${dev.name}" desconectado.`, 'info')}
                      className="text-slate-400 hover:text-red-400 text-[11px] font-medium"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Seus aparelhos são autenticados de forma segura e sem conflito de IP.</span>
            </div>
          </div>

        </div>

        {/* Continue Watching Section */}
        {continueItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-white">
                Continuar Assistindo
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {continueItems.length} em andamento
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {continueItems.map(({ item, progressPercent, lastWatchedAt }) => item && (
                <div
                  key={item.id}
                  className="group p-3 rounded-2xl bg-[#090D18] border border-white/8 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                    <img
                      src={item.bannerUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openPlayer(item)}
                        className="p-3 rounded-full bg-cyan-400 text-slate-950 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950/80">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span>{progressPercent}% assistido</span>
                      <span className="text-[11px]">{lastWatchedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Favorites Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white">
              Minha Lista de Favoritos
            </h2>
            <button
              onClick={() => setActiveView('catalog')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Explorar mais
            </button>
          </div>

          {favoriteContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteContents.map((c) => (
                <ContentCard key={c.id} content={c} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#090D18] border border-white/5 text-center text-slate-400 text-xs">
              Você ainda não adicionou nenhum título aos favoritos. Navegue pelo catálogo e clique no ícone de salvar!
            </div>
          )}
        </div>

        {/* Payment History Invoices Table */}
        <div className="bg-[#090D18] border border-white/8 rounded-2xl p-6">
          <h2 className="font-display font-bold text-base text-white mb-4">
            Histórico de Pagamentos e Faturas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-white/8">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Plano</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3">Forma</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentUser.invoices.map((inv) => (
                  <tr key={inv.id} className="text-slate-300">
                    <td className="py-3 px-3 font-mono">{inv.date}</td>
                    <td className="py-3 px-3 font-medium text-white">{inv.planName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                      R$ {inv.amount.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-3">{inv.paymentMethod}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aprovado
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => addToast(`Comprovante #${inv.id} baixado com sucesso!`, 'info')}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        Recibo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F1E] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-white">
                Deseja cancelar a renovação?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Você não será cobrado no próximo ciclo. Seu acesso permanecerá ativo até o final do período atual em <strong>{currentUser.subscriptionValidUntil}</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-xs hover:bg-slate-700"
              >
                Voltar e Manter
              </button>
              <button
                onClick={() => {
                  cancelSubscription();
                  setShowCancelModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
