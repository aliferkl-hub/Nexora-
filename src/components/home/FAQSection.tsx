import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FAQSection: React.FC = () => {
  const { adminConfig } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona a NEXORA PLAY?',
      a: 'A NEXORA PLAY é uma plataforma moderna de entretenimento digital que reúne filmes, séries, documentários e canais ao vivo homologados em uma única assinatura. Todo o catálogo opera em servidores distribuídos de ultra-alta velocidade, garantindo reprodução instantânea em 4K sem buffering.'
    },
    {
      q: 'Como assinar?',
      a: 'Basta escolher o plano ideal na nossa página de planos (Mensal, Trimestral, Semestral ou Anual), preencher seus dados básicos e efetuar o pagamento. Com a ativação imediata via PIX ou cartão de crédito, seu acesso é liberado no mesmo minuto.'
    },
    {
      q: 'Como funciona o plano anual?',
      a: 'O Plano Anual oferece a maior economia da plataforma (50% de desconto em relação ao plano mensal), garantindo 12 meses de acesso ininterrupto com valor congelado, até 5 telas simultâneas e suporte prioritário Master Owner.'
    },
    {
      q: 'Como acessar?',
      a: 'Você pode acessar diretamente pelo navegador do seu computador, tablet ou smartphone (através do nosso Web App PWA de carregamento rápido) ou digitando nexoraplay.com.br no navegador da sua Smart TV. Após o login na área "MEU NEXORA", seu catálogo estará pronto.'
    },
    {
      q: 'Quais dispositivos são compatíveis?',
      a: 'A plataforma é compatível com Smart TVs (Samsung Tizen, LG webOS, Android TV, Fire TV Stick), smartphones e tablets (iPhone/iOS e Android), computadores (Windows, Mac, Linux) e notebooks. Não exige receptores ou aparelhos dedicados.'
    },
    {
      q: 'Como cancelar a assinatura?',
      a: 'O cancelamento é 100% transparente e pode ser feito diretamente na sua área "MEU NEXORA" com apenas um clique. Não cobramos multas nem fidelidade oculta. Se você cancelar, seu acesso permanece ativo até o fim do período já pago.'
    },
    {
      q: 'Como funciona o aplicativo?',
      a: 'Para os planos que incluem aplicativo, você tem suporte a PWA otimizado com instalação em 1 toque na tela inicial do celular ou TV, garantindo tela cheia, sem barra de navegação e carregamento acelerado por cache local.'
    },
    {
      q: 'Como entrar em contato com o suporte?',
      a: 'Nosso atendimento oficial está disponível diariamente através do botão flutuante "Precisa de Ajuda?" no rodapé, ou diretamente pelo WhatsApp oficial no número ' + adminConfig.supportWhatsApp + ' e pelo e-mail ' + adminConfig.supportEmail + '.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#080B14] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TUDO O QUE VOCÊ PRECISA SABER</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight">
            PERGUNTAS FREQUENTES
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Tire suas dúvidas sobre planos, compatibilidade e funcionamento da NEXORA PLAY.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#0B0F1E] border border-white/8 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
