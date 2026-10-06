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
          title: 'Sobre a NEXORA PLAY',
          subtitle: 'NASCEMOS PARA TRANSFORMAR A FORMA COMO VOCÊ VIVE O ENTRETENIMENTO.',
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                A <strong>NEXORA PLAY</strong> nasceu da convicção de que o entretenimento digital não precisa ser complicado, fragmentado ou instável. Em um mercado repleto de opções com interfaces confusas e transmissões propensas a congelamento, estabelecemos um padrão intransigente de excelência: velocidade instantânea de carregamento, resolução cristalina e facilidade radical para o usuário final.
              </p>
              <p>
                Nossa arquitetura técnica distribui o processamento em servidores de borda (CDN Edge) localizados nos principais centros de dados, garantindo que o seu filme ou transmissão de canal chegue em 4K HDR e som Dolby Atmos sem requerer aparelhos piratas ou instalações invasivas na sua residência.
              </p>
              <p>
                Valorizamos a clareza e a transparência em cada etapa. Desde a assinatura de 1 clique via PIX até o gerenciamento transparente de dispositivos e cancelamento, a NEXORA PLAY coloca você no comando do seu tempo e da sua diversão.
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
                <strong>1. Aceitação dos Termos:</strong> Ao criar uma conta ou assinar qualquer plano da NEXORA PLAY, o usuário concorda plenamente com os presentes termos e com as leis vigentes de proteção ao consumidor e propriedade intelectual.
              </p>
              <p>
                <strong>2. Uso do Serviço:</strong> O acesso ao catálogo e às transmissões é concedido para fins exclusivamente pessoais e não comerciais, respeitando o limite de telas simultâneas contratadas em cada plano.
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
                <strong>2. Dados Financeiros:</strong> Transações com cartão de crédito são processadas diretamente por gateways certificados com PCI-DSS. A NEXORA PLAY não armazena dados sensíveis ou códigos de segurança de cartões.
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
                <strong>1. Conteúdo Homologado:</strong> A NEXORA PLAY trabalha rigorosamente com conteúdos, canais, filmes, séries e aplicativos que possui autorização ou licença expressa para distribuir, retransmitir ou exibir.
              </p>
              <p>
                <strong>2. Fontes e Obras Licenciadas:</strong> Todo o catálogo operado pela NEXORA PLAY é composto exclusivamente por produções com licenças de distribuição concedidas pelos detentores, obras sob licença Creative Commons com atribuição e sinais de transmissão pública devidamente homologados.
              </p>
              <p>
                <strong>3. Notificação de Titulares:</strong> Detentores de direitos autorais que desejarem estabelecer parcerias de licenciamento ou solicitar informações técnicas podem entrar em contato diretamente com o departamento jurídico pelo e-mail <em>juridico@nexoraplay.com.br</em>.
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
      <div className="bg-[#0B0F1E] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl relative">
        <div className="flex items-start justify-between border-b border-white/8 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXORA PLAY INSTITUCIONAL</span>
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
            className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
