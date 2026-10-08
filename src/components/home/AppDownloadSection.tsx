import React, { useState } from 'react';
import { Smartphone, Tv, Laptop, Check, AlertCircle, ArrowUpRight, QrCode } from 'lucide-react';
import { QRCodeSVG } from '../common/QRCodeSVG';

export const AppDownloadSection: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'all' | 'ios' | 'android' | 'tv'>('all');
  const [showQrModal, setShowQrModal] = useState(false);

  const devices = [
    {
      id: 'ios',
      title: 'iPhone & iPad',
      status: 'Disponível via Web App PWA',
      availabilityLabel: 'Acesso imediato no Safari',
      isAppStoreLive: false,
      storeNotice: 'Aplicativo nativo na App Store em breve (Q3 2026)',
      icon: Smartphone,
      instructions: 'Abra no Safari > Toque no botão Compartilhar > Selecionar "Adicionar à Tela de Início". Pronto! Funciona com ícone de app e tela cheia.'
    },
    {
      id: 'android',
      title: 'Smartphones & Tablets Android',
      status: 'Disponível via Web App PWA',
      availabilityLabel: 'Instalação Direta 1-Clique',
      isAppStoreLive: false,
      storeNotice: 'Aplicativo na Google Play Store em breve (Homologação)',
      icon: Smartphone,
      instructions: 'No Google Chrome, toque nos 3 pontinhos > Selecionar "Instalar aplicativo". Cria atalho nativo com carregamento instantâneo.'
    },
    {
      id: 'tv',
      title: 'Smart TVs & TV Sticks',
      status: 'Compatível via Navegador',
      availabilityLabel: 'Samsung, LG, Android TV e Fire TV',
      isAppStoreLive: false,
      storeNotice: 'Aplicativo dedicado para lojas de TV em breve',
      icon: Tv,
      instructions: 'Abra o navegador de internet da sua TV (Internet Browser), acesse a plataforma e faça login na sua conta.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#070506]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <span>DISPOSITIVOS SUPORTADOS</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">MULTIPLATAFORMA</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight mt-1">
              📱 ASSISTA ONDE ESTIVER
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Nossa plataforma foi concebida para rodar com fluidez em todos os seus aparelhos, sem necessidade de downloads complicados.
            </p>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 hover:text-white hover:border-cyan-500/50 text-xs font-medium transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Escanear QR Code no Celular</span>
          </button>
        </div>

        {/* Device Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div
                key={device.id}
                className="p-6 rounded-2xl bg-[#090D18] border border-white/8 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {device.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">
                    {device.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    {device.availabilityLabel}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <span className="text-cyan-400 font-semibold block mb-1">Como acessar agora:</span>
                    {device.instructions}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px]">{device.storeNotice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0F1E] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center relative shadow-2xl">
            <h3 className="font-display font-bold text-xl text-white">
              Acesse no Celular ou TV
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Aponte a câmera do seu smartphone para o QR Code abaixo para abrir instantaneamente o PIZZA CINE.
            </p>

            <div className="flex justify-center mb-6">
              <QRCodeSVG 
                value={typeof window !== 'undefined' ? window.location.href : 'https://pizzacine.com.br'} 
                size={190} 
              />
            </div>

            <p className="text-xs text-amber-300 font-mono mb-6">
              {typeof window !== 'undefined' ? window.location.origin : 'pizzacine.com.br'}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-medium text-xs hover:bg-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
