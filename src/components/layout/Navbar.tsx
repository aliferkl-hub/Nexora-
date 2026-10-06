import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NexoraLogo } from '../brand/NexoraLogo';
import { ActiveView } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentUser, 
    isAdminLoggedIn, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    startCheckoutForPlan
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navigateTo = (view: ActiveView, category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; view: ActiveView; cat?: string }[] = [
    { label: 'Início', view: 'home' },
    { label: 'Filmes', view: 'films' },
    { label: 'Séries', view: 'series' },
    { label: 'TV Ao Vivo', view: 'live-tv' },
    { label: 'Catálogo', view: 'catalog' },
    { label: 'Planos', view: 'plans' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#06080F]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* ZONE 1: Brand Wordmark (Single clean element) */}
          <div className="flex items-center gap-4">
            <NexoraLogo 
              size="md" 
              onClick={() => navigateTo('home')} 
              className="hover:opacity-95 transition-opacity"
            />
          </div>

          {/* ZONE 2: Clean Text Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => navigateTo(link.view, link.cat)}
                  className={`text-sm font-medium transition-colors hover:text-cyan-400 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'text-cyan-400 font-bold' 
                      : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => navigateTo('marketing-kit')}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Kit de Divulgação e Afiliados"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Indique</span>
            </button>
          </nav>

          {/* ZONE 3: Primary Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search toggler */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar filmes, canais..."
                    autoFocus
                    className="w-40 sm:w-60 px-3 py-1.5 pl-8 text-xs bg-slate-900 border border-cyan-500/50 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 pointer-events-none" />
                  <button
                    onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                    className="absolute right-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearchInput(true);
                    if (activeView !== 'catalog') setActiveView('catalog');
                  }}
                  className="p-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Pesquisar catálogo"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Client Area button */}
            <button
              onClick={() => navigateTo('client')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeView === 'client'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">
                {currentUser?.subscriptionStatus === 'active' ? 'Meu Nexora' : 'Minha Conta'}
              </span>
            </button>

            {/* Master Owner Admin Access shortcut */}
            <button
              onClick={() => navigateTo('admin')}
              className={`p-2 text-xs rounded-lg transition-colors hidden xl:flex items-center gap-1 cursor-pointer ${
                activeView === 'admin' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800' 
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Painel Master Owner"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>

            {/* Primary High-Intent CTA */}
            <button
              onClick={() => startCheckoutForPlan('trimestral')}
              className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-lg shadow-sm shadow-cyan-500/20 hover:from-cyan-300 hover:to-cyan-200 transition-all transform active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Assinar Agora</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Abrir menu mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-18 z-30 bg-[#06080F]/98 backdrop-blur-xl border-b border-white/10 lg:hidden flex flex-col p-6 overflow-y-auto animate-fadeIn">
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-2">
              Navegação
            </span>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigateTo(link.view, link.cat)}
                className="flex items-center justify-between px-3 py-3 text-base font-medium text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors text-left"
              >
                <span>{link.label}</span>
                {activeView === link.view && <CheckCircle className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => navigateTo('marketing-kit')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl text-left"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Kit de Divulgação & Parcerias</span>
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-amber-300/80 hover:bg-white/5 rounded-xl text-left"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Painel Master Owner</span>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                startCheckoutForPlan('trimestral');
              }}
              className="w-full py-3.5 text-center font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Assinar com Desconto
            </button>
          </div>
        </div>
      )}
    </>
  );
};
