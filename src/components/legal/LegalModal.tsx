import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../../types';

interface LegalModalProps {
  type: ActiveView;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const getModalContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'Sobre o PIZZA CINE',
          subtitle: 'SEU FILME FAVORITO. SUA SÉRIE FAVORITA. DO SEU JEITO.',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                O <strong>PIZZA CINE</strong> nasceu da combinação perfeita entre a paixão pelo cinema e o sabor do entretenimento de verdade. Desenvolvida para quem valoriza imagem impecável, velocidade instantânea e simplicidade extrema no controle remoto ou na tela do celular.
              </p>
              <p>
                Nossa arquitetura técnica distribui o processamento em servidores de borda (CDN Edge) de alta velocidade, garantindo que o seu filme ou série chegue em 4K HDR e som imersivo sem travamentos, sem aparelhos piratas ou instalações invasivas.
              </p>
              <p>
                Valorizamos a clareza e a transparência em cada etapa. Desde a assinatura de 1 clique via PIX até o atendimento humanizado via WhatsApp, o PIZZA CINE coloca você no comando do seu tempo e da sua diversão.
              </p>
            </div>
          )
        };

      case 'terms':
        return {
          title: 'Termos de Uso da Plataforma',
          subtitle: 'Condições gerais de navegação e utilização do serviço',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>1. Aceitação dos Termos:</strong> Ao criar uma conta ou assinar qualquer plano do PIZZA CINE, o usuário concorda plenamente com os presentes termos e com as leis vigentes de proteção ao consumidor e propriedade intelectual.
              </p>
              <p>
                <strong>2. Uso do Serviço:</strong> O acesso ao catálogo é concedido para fins exclusivamente pessoais e não comerciais, respeitando o limite de telas simultâneas contratadas em cada plano.
              </p>
              <p>
                <strong>3. Segurança e Acesso:</strong> O usuário é responsável por manter o sigilo de suas credenciais de login. Nossa infraestrutura monitora sessões para evitar acessos não autorizados sem penalizar a flexibilidade do titular.
              </p>
            </div>
          )
        };

      case 'privacy':
        return {
          title: 'Política de Privacidade e Proteção de Dados (LGPD)',
          subtitle: 'Seus dados protegidos com criptografia de ponta a ponta',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>1. Coleta Mínima:</strong> Coletamos exclusivamente os dados necessários para o fornecimento do serviço (Nome, e-mail para autenticação e número de telefone para suporte).
              </p>
              <p>
                <strong>2. Dados Financeiros:</strong> Transações financeiras e pagamentos via PIX são processados em conformidade com o Banco Central do Brasil. O PIZZA CINE não armazena dados sensíveis ou códigos de segurança bancários.
              </p>
              <p>
                <strong>3. Direitos do Titular:</strong> Em conformidade com a LGPD (Lei Geral de Proteção de Dados), você pode solicitar a qualquer momento a visualização, atualização ou exclusão definitiva dos seus dados cadastrais.
              </p>
            </div>
          )
        };

      case 'licenses':
        return {
          title: 'Transparência, Direitos e Licenciamento',
          subtitle: 'Compromisso formal com conformidade regulatória',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>1. Conteúdo Homologado:</strong> O PIZZA CINE trabalha rigorosamente com conteúdos, filmes e séries que possui autorização, licença expressa ou domínio público para distribuir e exibir.
              </p>
              <p>
                <strong>2. Fontes e Obras Licenciadas:</strong> Todo o catálogo operado pelo PIZZA CINE é composto exclusivamente por produções com licenças de distribuição concedidas pelos detentores, obras sob licença Creative Commons com atribuição e títulos devidamente homologados.
              </p>
              <p>
                <strong>3. Notificação de Titulares:</strong> Detentores de direitos autorais que desejarem estabelecer parcerias de licenciamento ou solicitar informações técnicas podem entrar em contato diretamente com o departamento jurídico pelo e-mail <em>juridico@pizzacine.com.br</em>.
              </p>
            </div>
          )
        };

      default:
        return null;
    }
  };

  const modalData = getModalContent();
  if (!modalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0C090A] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl relative">
        <div className="flex items-start justify-between border-b border-white/8 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>PIZZA CINE INSTITUCIONAL</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {modalData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {modalData.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {modalData.content}
        </div>

        <div className="mt-6 pt-4 border-t border-white/8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-950/40 hover:from-rose-500 hover:to-amber-400 transition-colors border border-amber-300/30 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
