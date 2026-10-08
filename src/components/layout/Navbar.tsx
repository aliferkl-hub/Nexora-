import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PizzaCineLogo } from '../brand/PizzaCineLogo';
import { ActiveView } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentUser, 
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
    { label: 'Gêneros', view: 'genres' },
    { label: 'Em Alta', view: 'trending' },
    { label: 'Lançamentos', view: 'releases' },
    { label: 'Minha Lista', view: 'mylist' },
    { label: 'Planos', view: 'plans' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080607]/95 backdrop-blur-md border-b border-white/8 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* ZONE 1: Brand Wordmark */}
          <div className="flex items-center gap-4">
            <PizzaCineLogo 
              size="md" 
              onClick={() => navigateTo('home')} 
              className="hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>

          {/* ZONE 2: Clean Text Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => navigateTo(link.view, link.cat)}
                  className={`text-xs xl:text-sm font-medium transition-colors hover:text-rose-400 whitespace-nowrap cursor-pointer relative py-1 ${
                    isActive 
                      ? 'text-rose-400 font-bold' 
                      : 'text-slate-300'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => navigateTo('marketing-kit')}
              className="text-xs text-amber-300/80 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Kit de Divulgação e Afiliados"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Divulgar</span>
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
                    placeholder="Buscar filmes, séries..."
                    autoFocus
                    className="w-40 sm:w-60 px-3 py-1.5 pl-8 text-xs bg-slate-900 border border-rose-500/50 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <Search className="w-3.5 h-3.5 text-rose-400 absolute left-2.5 pointer-events-none" />
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
                  className="p-2 text-slate-300 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
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
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">
                {currentUser?.subscriptionStatus === 'active' ? 'Meu Pizza Cine' : 'Minha Conta'}
              </span>
            </button>

            {/* Master Owner Admin Access shortcut */}
            <button
              onClick={() => navigateTo('admin')}
              className={`p-2 text-xs rounded-lg transition-colors hidden xl:flex items-center gap-1 cursor-pointer ${
                activeView === 'admin' 
                  ? 'text-rose-400 bg-rose-950/40 border border-rose-800' 
                  : 'text-slate-400 hover:text-rose-300'
              }`}
              title="Painel Master Owner"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>

            {/* Primary High-Intent CTA */}
            <button
              onClick={() => startCheckoutForPlan('trimestral')}
              className="px-3.5 sm:px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 rounded-lg shadow-sm shadow-rose-950/50 hover:from-rose-500 hover:to-amber-400 transition-all transform active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1.5 border border-amber-300/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Assinar</span>
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
        <div className="fixed inset-0 top-18 z-30 bg-[#080607]/98 backdrop-blur-xl border-b border-white/10 lg:hidden flex flex-col p-6 overflow-y-auto animate-fadeIn">
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold px-2 font-mono">
              Categorias & Canais
            </span>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigateTo(link.view, link.cat)}
                className="flex items-center justify-between px-3 py-3 text-base font-medium text-slate-200 rounded-xl hover:bg-white/5 hover:text-rose-400 transition-colors text-left"
              >
                <span>{link.label}</span>
                {activeView === link.view && <CheckCircle className="w-4 h-4 text-rose-500" />}
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => navigateTo('marketing-kit')}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-xl text-left"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
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

          <div className="mt-auto pt-6 border-t border-white/10 pb-16">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                startCheckoutForPlan('trimestral');
              }}
              className="w-full py-3.5 text-center font-extrabold text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-500 rounded-xl shadow-lg shadow-rose-950/40 border border-amber-300/30"
            >
              Assinar Plano com Desconto
            </button>
          </div>
        </div>
      )}
    </>
  );
};
