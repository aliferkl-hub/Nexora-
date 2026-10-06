import React, { useState } from 'react';
import { MessageCircle, HelpCircle, X, Send, PhoneCall, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FloatingSupport: React.FC = () => {
  const { adminConfig, setActiveView, addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const cleanWhatsAppNumber = adminConfig.supportWhatsApp.replace(/\D/g, '');

  const openWhatsApp = () => {
    const text = encodeURIComponent('Olá! Gostaria de falar com o suporte oficial da NEXORA PLAY sobre planos e ativação.');
    window.open(`https://api.whatsapp.com/send?phone=${cleanWhatsAppNumber}&text=${text}`, '_blank');
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;
    setTicketSent(true);
    addToast('Sua mensagem foi enviada para nossa equipe de atendimento!', 'success');
    setTimeout(() => {
      setTicketSent(false);
      setTicketSubject('');
      setTicketMsg('');
      setIsOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Abrir central de ajuda"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span>PRECISA DE AJUDA?</span>
        </button>
      )}

      {/* Floating Support Modal Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] rounded-3xl bg-[#090D18] border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl animate-fadeIn flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white">Central NEXORA</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Suporte Humano Ativo</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Channels */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={openWhatsApp}
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 text-emerald-300 flex flex-col items-center text-center gap-1 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold text-[11px]">Chamar no WhatsApp</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setActiveView('home');
                const el = document.getElementById('faq');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 rounded-xl bg-slate-900 border border-white/8 hover:bg-slate-800 text-slate-300 flex flex-col items-center text-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-[11px]">Ver FAQ Completo</span>
            </button>
          </div>

          {/* Direct Ticket Form */}
          {ticketSent ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-300">
              Mensagem recebida com sucesso! Retornaremos em instantes no seu e-mail cadastrado.
            </div>
          ) : (
            <form onSubmit={handleSendTicket} className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block text-[11px]">
                Envie uma mensagem rápida:
              </span>
              <input
                type="text"
                required
                placeholder="Seu nome ou assunto..."
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <textarea
                required
                rows={2}
                placeholder="Como podemos te ajudar hoje?"
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Dúvida</span>
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Tel: {adminConfig.supportPhone}</span>
            <span>{adminConfig.supportEmail}</span>
          </div>

        </div>
      )}
    </div>
  );
};
