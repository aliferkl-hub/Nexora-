import React, { useState } from 'react';
import { MessageCircle, HelpCircle, X, Send, PhoneCall, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FloatingSupport: React.FC = () => {
  const { adminConfig, setActiveView, addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const cleanWhatsAppNumber = (adminConfig.supportWhatsApp || '11973479473').replace(/\D/g, '');

  const openWhatsApp = () => {
    const text = encodeURIComponent('Olá! Gostaria de falar com o suporte oficial do PIZZA CINE sobre planos e ativação.');
    const finalNumber = cleanWhatsAppNumber.startsWith('55') ? cleanWhatsAppNumber : `55${cleanWhatsAppNumber}`;
    window.open(`https://wa.me/${finalNumber}?text=${text}`, '_blank');
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
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-rose-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/30"
          aria-label="Abrir central de ajuda"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span>PRECISA DE AJUDA?</span>
        </button>
      )}

      {/* Floating Support Modal Window */}
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] rounded-3xl bg-[#0C090A] border border-rose-500/30 p-5 shadow-2xl backdrop-blur-xl animate-fadeIn flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 flex items-center justify-center text-rose-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-white">Central Pizza Cine</h4>
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
            <a
              href={`https://wa.me/55${cleanWhatsAppNumber}?text=${encodeURIComponent('Olá! Gostaria de falar no WhatsApp oficial da NEXORA PLAY sobre os planos e ativação.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 text-emerald-300 flex flex-col items-center text-center gap-1 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-[11px]">Falar comigo no WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                setActiveView('home');
                const el = document.getElementById('faq');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 rounded-xl bg-black/60 border border-white/8 hover:bg-white/5 text-slate-300 flex flex-col items-center text-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
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
                className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <textarea
                required
                rows={2}
                placeholder="Como podemos te ajudar hoje?"
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-xs rounded-lg hover:from-rose-500 hover:to-amber-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Dúvida</span>
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Tel: +55 11 97347-9473</span>
            <span>suporte@pizzacine.com.br</span>
          </div>

        </div>
      )}
    </div>
  );
};
