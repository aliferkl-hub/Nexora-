import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingSupport } from './components/layout/FloatingSupport';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { MovieDetailPage } from './components/detail/MovieDetailPage';
import { SeriesDetailPage } from './components/detail/SeriesDetailPage';
import { LiveTvPage } from './components/livetv/LiveTvPage';
import { PlansView } from './components/plans/PlansView';
import { CheckoutView } from './components/checkout/CheckoutModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { MasterOwnerDashboard } from './components/admin/MasterOwnerDashboard';
import { MarketingKitView } from './components/marketing/MarketingKitView';
import { LocalCampaignView } from './components/local/LocalCampaignView';
import { CinematicPlayerModal } from './components/player/CinematicPlayerModal';
import { AnnualPlanPixModal } from './components/checkout/AnnualPlanPixModal';
import { LegalModal } from './components/legal/LegalModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Zap, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    adminConfig, 
    toasts, 
    removeToast,
    startCheckoutForPlan
  } = useApp();

  const isLegalModal = ['about', 'terms', 'privacy', 'licenses'].includes(activeView);

  const isCatalogRoute = [
    'catalog', 
    'films', 
    'series', 
    'genres', 
    'trending', 
    'releases', 
    'mylist'
  ].includes(activeView);

  return (
    <div className="min-h-screen flex flex-col bg-[#080607] text-slate-100 font-sans selection:bg-rose-600/30 selection:text-rose-200 pb-16 lg:pb-0">
      
      {/* Top Promotional Announcement Banner */}
      {adminConfig.promoBannerActive && (
        <aside 
          aria-label="Aviso de promoção"
          className="bg-gradient-to-r from-rose-950/90 via-red-950/80 to-amber-950/80 border-b border-rose-500/20 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide">
            {adminConfig.promoBannerText}
          </span>
          <button
            onClick={() => startCheckoutForPlan('trimestral')}
            className="ml-2 underline font-bold text-white hover:text-amber-300 transition-colors cursor-pointer"
          >
            Aproveitar agora
          </button>
        </aside>
      )}

      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {isCatalogRoute && <CatalogView />}
        {activeView === 'movie-detail' && <MovieDetailPage />}
        {activeView === 'series-detail' && <SeriesDetailPage />}
        {activeView === 'live-tv' && <LiveTvPage />}
        {activeView === 'plans' && <PlansView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'client' && <ClientDashboard />}
        {activeView === 'admin' && <MasterOwnerDashboard />}
        {activeView === 'marketing-kit' && <MarketingKitView />}
        {activeView === 'local-campaign' && <LocalCampaignView />}
        
        {/* If legal view is triggered directly, keep home behind and show modal */}
        {isLegalModal && <HomeView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Support Button ("PRECISA DE AJUDA?") */}
      <FloatingSupport />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Cinematic HTML5 Video Player Modal */}
      <CinematicPlayerModal />

      {/* Dedicated Annual Plan PIX + WhatsApp Modal */}
      <AnnualPlanPixModal />

      {/* Legal & About Modal */}
      {isLegalModal && (
        <LegalModal
          type={activeView}
          onClose={() => setActiveView('home')}
        />
      )}

      {/* Global Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs animate-slideUp ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-red-500/40 text-red-300'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/95 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
              <span className="font-medium text-slate-200">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
