import React from 'react';
import { Home, Film, Tv, Flame, Bookmark, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'films', label: 'Filmes', icon: Film },
    { id: 'series', label: 'Séries', icon: Tv },
    { id: 'trending', label: 'Em Alta', icon: Flame },
    { id: 'mylist', label: 'Minha Lista', icon: Bookmark },
    { id: 'plans', label: 'Planos', icon: Sparkles },
  ];

  const handleNav = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Navegação inferior mobile"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0A0708]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl relative cursor-pointer ${
                isActive
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-rose-500 drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${isActive ? 'text-white font-semibold' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
