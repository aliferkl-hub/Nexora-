import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ContentItem, 
  Episode,
  PlanConfig, 
  Coupon, 
  AdminPlatformConfig, 
  UserAccount, 
  ActiveView,
  CatalogSyncLog
} from '../types';
import { 
  INITIAL_CONTENTS, 
  INITIAL_PLANS, 
  INITIAL_COUPONS, 
  INITIAL_ADMIN_CONFIG, 
  DEMO_USER 
} from '../data/seedData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Content & Catalog
  contents: ContentItem[];
  setContents: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  addContent: (content: Omit<ContentItem, 'id' | 'viewsCount' | 'order'>) => void;
  updateContent: (id: string, updated: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Detail Pages
  selectedContentForDetail: ContentItem | null;
  openContentDetail: (content: ContentItem) => void;
  closeContentDetail: () => void;

  // Video Player Modal
  activePlayingContent: ContentItem | null;
  activePlayingEpisode: Episode | null;
  openPlayer: (content: ContentItem, episode?: Episode) => void;
  openEpisodePlayer: (content: ContentItem, episode: Episode) => void;
  closePlayer: () => void;

  // Live TV
  activeLiveChannel: ContentItem | null;
  setActiveLiveChannel: (channel: ContentItem | null) => void;

  // Plans & Pricing
  plans: PlanConfig[];
  setPlans: React.Dispatch<React.SetStateAction<PlanConfig[]>>;
  updatePlan: (id: PlanConfig['id'], updated: Partial<PlanConfig>) => void;
  selectedPlanForCheckout: PlanConfig | null;
  setSelectedPlanForCheckout: (plan: PlanConfig | null) => void;
  startCheckoutForPlan: (planId: PlanConfig['id']) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Admin Config & Sync
  adminConfig: AdminPlatformConfig;
  updateAdminConfig: (cfg: Partial<AdminPlatformConfig>) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  importCatalogFromJson: (jsonStr: string) => { success: boolean; message: string; count: number };
  syncCatalogFromFeed: (feedUrl?: string) => Promise<{ success: boolean; message: string }>;

  // Client User Account
  currentUser: UserAccount | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserAccount | null>>;
  loginUser: (email: string) => void;
  registerUser: (name: string, email: string, phone: string) => void;
  logoutUser: () => void;
  completeSubscriptionPayment: (planId: PlanConfig['id'], paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto') => void;
  cancelSubscription: () => void;
  updateContinueWatching: (contentId: string, progressPercent: number, episode?: Episode) => void;

  // Global Toasts & Helpers
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  referralCode: string;
  setReferralCode: (code: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Storage-backed Catalog (v3: Authorized streaming catalog)
  const [contents, setContents] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('nexora_contents_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONTENTS;
  });

  // Storage-backed Plans
  const [plans, setPlans] = useState<PlanConfig[]>(() => {
    const saved = localStorage.getItem('nexora_plans_v1');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('nexora_coupons_v1');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Admin Platform Config
  const [adminConfig, setAdminConfig] = useState<AdminPlatformConfig>(() => {
    const saved = localStorage.getItem('nexora_admin_cfg_v2');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_CONFIG;
  });

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('nexora_admin_auth') === 'true';
  });

  // Client User
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('nexora_user_v1');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  // Detail Pages
  const [selectedContentForDetail, setSelectedContentForDetail] = useState<ContentItem | null>(null);

  // Live TV
  const [activeLiveChannel, setActiveLiveChannel] = useState<ContentItem | null>(null);

  // Checkout Plan
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanConfig | null>(null);

  // Video Player
  const [activePlayingContent, setActivePlayingContent] = useState<ContentItem | null>(null);
  const [activePlayingEpisode, setActivePlayingEpisode] = useState<Episode | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Referral
  const [referralCode, setReferralCode] = useState<string>('NEXORA-VIP');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nexora_contents_v3', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('nexora_plans_v1', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('nexora_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('nexora_admin_cfg_v2', JSON.stringify(adminConfig));
  }, [adminConfig]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexora_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexora_user_v1');
    }
  }, [currentUser]);

  // Check URL query parameters for referral code
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setReferralCode(ref.toUpperCase());
        addToast(`Código de indicação ${ref.toUpperCase()} ativado com sucesso!`, 'info');
      }
    } catch {
      // ignore
    }
  }, []);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Content Operations
  const addContent = (newItem: Omit<ContentItem, 'id' | 'viewsCount' | 'order'>) => {
    const id = `nx-${Date.now()}`;
    const item: ContentItem = {
      ...newItem,
      id,
      order: contents.length + 1,
      viewsCount: 1,
      rating: 4.8
    };
    setContents((prev) => [item, ...prev]);
    addToast(`"${item.title}" adicionado ao catálogo oficial com sucesso!`, 'success');
  };

  const updateContent = (id: string, updated: Partial<ContentItem>) => {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    if (selectedContentForDetail?.id === id) {
      setSelectedContentForDetail((prev) => prev ? { ...prev, ...updated } : null);
    }
    addToast('Conteúdo atualizado com sucesso!', 'success');
  };

  const deleteContent = (id: string) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
    if (selectedContentForDetail?.id === id) {
      setSelectedContentForDetail(null);
      setActiveView('catalog');
    }
    addToast('Conteúdo removido do catálogo.', 'info');
  };

  const toggleFavorite = (id: string) => {
    if (!currentUser) {
      addToast('Faça login ou assine para salvar títulos na sua lista.', 'warning');
      return;
    }
    const exists = currentUser.favorites.includes(id);
    const updatedFavs = exists
      ? currentUser.favorites.filter((f) => f !== id)
      : [...currentUser.favorites, id];
    
    setCurrentUser({
      ...currentUser,
      favorites: updatedFavs
    });

    addToast(
      exists ? 'Removido da Minha Lista' : 'Adicionado à Minha Lista',
      'success'
    );
  };

  const isFavorite = (id: string) => {
    return currentUser ? currentUser.favorites.includes(id) : false;
  };

  // Detail Pages
  const openContentDetail = (content: ContentItem) => {
    setSelectedContentForDetail(content);
    if (content.type === 'movie') {
      setActiveView('movie-detail');
    } else if (content.type === 'series') {
      setActiveView('series-detail');
    } else if (content.type === 'channel') {
      setActiveLiveChannel(content);
      setActiveView('live-tv');
    } else {
      setActiveView('movie-detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeContentDetail = () => {
    setSelectedContentForDetail(null);
    setActiveView('catalog');
  };

  // Video Player
  const openPlayer = (content: ContentItem, episode?: Episode) => {
    setActivePlayingContent(content);
    setActivePlayingEpisode(episode || null);
    // increment local views count
    setContents((prev) =>
      prev.map((c) => (c.id === content.id ? { ...c, viewsCount: c.viewsCount + 1 } : c))
    );
  };

  const openEpisodePlayer = (content: ContentItem, episode: Episode) => {
    openPlayer(content, episode);
  };

  const closePlayer = () => {
    setActivePlayingContent(null);
    setActivePlayingEpisode(null);
  };

  // Plans operations
  const updatePlan = (id: PlanConfig['id'], updated: Partial<PlanConfig>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    addToast('Configurações do plano atualizadas pelo Master Owner!', 'success');
  };

  const startCheckoutForPlan = (planId: PlanConfig['id']) => {
    const target = plans.find((p) => p.id === planId) || plans[0];
    setSelectedPlanForCheckout(target);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Coupon operations
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    addToast(`Cupom ${coupon.code} criado com sucesso!`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addToast(`Cupom ${code} removido.`, 'info');
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.active);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado: ${found.discountPercent}% OFF!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Cupom removido.', 'info');
  };

  // Admin Config & Auth
  const updateAdminConfig = (cfg: Partial<AdminPlatformConfig>) => {
    setAdminConfig((prev) => ({ ...prev, ...cfg }));
    addToast('Configurações globais salvas com sucesso!', 'success');
  };

  const loginAdmin = (password: string): boolean => {
    if (password === 'nexora2026' || password === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('nexora_admin_auth', 'true');
      addToast('Acesso Master Owner concedido com sucesso!', 'success');
      return true;
    }
    addToast('Senha administrativa incorreta.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('nexora_admin_auth');
    addToast('Sessão administrativa encerrada.', 'info');
  };

  // Catalog Import & Sync
  const importCatalogFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const itemsToImport: ContentItem[] = Array.isArray(parsed) ? parsed : (parsed.items || parsed.catalog || []);
      
      if (!Array.isArray(itemsToImport) || itemsToImport.length === 0) {
        return { success: false, message: 'Estrutura JSON não contém uma lista válida de conteúdos.', count: 0 };
      }

      // Merge or append ensuring IDs
      const formattedItems = itemsToImport.map((item, idx) => ({
        ...item,
        id: item.id || `nx-import-${Date.now()}-${idx}`,
        order: item.order || contents.length + idx + 1,
        viewsCount: item.viewsCount || 0,
        rating: item.rating || 4.8,
        isAuthorized: true,
        hidden: item.hidden || false
      }));

      setContents(formattedItems);

      const log: CatalogSyncLog = {
        id: `sync-${Date.now()}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        sourceType: 'Feed JSON',
        status: 'success',
        addedCount: formattedItems.length,
        updatedCount: 0,
        removedCount: 0,
        notes: `Importação manual de ${formattedItems.length} produções autorizadas realizada pelo Master Owner.`
      };

      setAdminConfig((prev) => ({
        ...prev,
        lastSyncTimestamp: log.timestamp,
        syncLogs: [log, ...(prev.syncLogs || [])]
      }));

      addToast(`${formattedItems.length} produções importadas com sucesso!`, 'success');
      return { success: true, message: 'Catálogo importado com sucesso.', count: formattedItems.length };
    } catch (e: any) {
      return { success: false, message: `Erro ao processar JSON: ${e?.message || 'Arquivo corrompido'}`, count: 0 };
    }
  };

  const syncCatalogFromFeed = async (feedUrl?: string) => {
    const targetUrl = feedUrl || adminConfig.catalogFeedUrl;
    if (!targetUrl) {
      return { success: false, message: 'Nenhuma URL de feed autorizada configurada.' };
    }

    try {
      // Simulate remote feed fetch
      const timestamp = new Date().toLocaleString('pt-BR');
      const log: CatalogSyncLog = {
        id: `sync-${Date.now()}`,
        timestamp,
        sourceType: 'API',
        sourceUrl: targetUrl,
        status: 'success',
        addedCount: 0,
        updatedCount: contents.length,
        removedCount: 0,
        notes: 'Sincronização com o feed autorizado concluída. Metadados e licenças atualizados.'
      };

      setAdminConfig((prev) => ({
        ...prev,
        lastSyncTimestamp: timestamp,
        syncLogs: [log, ...(prev.syncLogs || [])]
      }));

      addToast('Sincronização com provedor autorizado concluída!', 'success');
      return { success: true, message: 'Feed sincronizado.' };
    } catch (err: any) {
      return { success: false, message: `Falha na sincronização: ${err?.message}` };
    }
  };

  // User Account Ops
  const loginUser = (email: string) => {
    if (currentUser && currentUser.email === email) {
      addToast(`Bem-vindo de volta, ${currentUser.name}!`, 'success');
      return;
    }
    const user: UserAccount = {
      ...DEMO_USER,
      email: email,
      name: email.split('@')[0].toUpperCase(),
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    addToast(`Login efetuado com sucesso para ${email}!`, 'success');
  };

  const registerUser = (name: string, email: string, phone: string) => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      subscriptionStatus: 'none',
      autoRenew: false,
      favorites: [],
      continueWatching: [],
      devices: [
        {
          id: `dev-${Date.now()}`,
          name: 'Navegador Web Atual',
          type: 'pc',
          browser: 'Web App / Chrome',
          lastActive: 'Agora',
          current: true
        }
      ],
      invoices: [],
      referralCode: `${name.toUpperCase().slice(0, 4)}-NEXORA`,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    addToast(`Conta criada com sucesso, ${name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    addToast('Você saiu da sua conta.', 'info');
  };

  const completeSubscriptionPayment = (
    planId: PlanConfig['id'], 
    paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto'
  ) => {
    const plan = plans.find((p) => p.id === planId) || plans[0];
    const discount = appliedCoupon ? (plan.totalPrice * appliedCoupon.discountPercent) / 100 : 0;
    const finalAmount = Math.max(0, plan.totalPrice - discount);

    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.billingPeriodMonths);

    const invoice: UserAccount['invoices'][0] = {
      id: `inv-nx-${Date.now().toString().slice(-6)}`,
      date: now.toISOString().split('T')[0],
      planName: `${plan.name} (${plan.subtitle})`,
      amount: finalAmount,
      status: 'paid',
      paymentMethod,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    };

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        currentPlanId: plan.id,
        subscriptionStatus: 'active',
        subscriptionValidUntil: expiry.toISOString().split('T')[0],
        autoRenew: true,
        paymentMethod: `${paymentMethod} (Ativo)`,
        invoices: [invoice, ...currentUser.invoices]
      });
    } else {
      const guest: UserAccount = {
        ...DEMO_USER,
        id: `usr-${Date.now()}`,
        currentPlanId: plan.id,
        subscriptionStatus: 'active',
        subscriptionValidUntil: expiry.toISOString().split('T')[0],
        invoices: [invoice]
      };
      setCurrentUser(guest);
    }

    addToast(`🎉 Parabéns! Sua assinatura ${plan.name} foi ativada com sucesso!`, 'success');
    setActiveView('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelSubscription = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      subscriptionStatus: 'canceled',
      autoRenew: false
    });
    addToast('Renovação automática cancelada. Seu acesso permanece até o fim da vigência.', 'info');
  };

  const updateContinueWatching = (contentId: string, progressPercent: number, episode?: Episode) => {
    if (!currentUser) return;
    const existing = currentUser.continueWatching.filter((c) => c.contentId !== contentId);
    const updated = [
      {
        contentId,
        episodeId: episode?.id,
        seasonNumber: episode?.seasonNumber,
        episodeNumber: episode?.episodeNumber,
        episodeTitle: episode?.title,
        progressPercent,
        durationMinutes: 120,
        lastWatchedAt: 'Agora há pouco'
      },
      ...existing
    ];
    setCurrentUser({
      ...currentUser,
      continueWatching: updated
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        contents,
        setContents,
        addContent,
        updateContent,
        deleteContent,
        toggleFavorite,
        isFavorite,
        selectedContentForDetail,
        openContentDetail,
        closeContentDetail,
        activePlayingContent,
        activePlayingEpisode,
        openPlayer,
        openEpisodePlayer,
        closePlayer,
        activeLiveChannel,
        setActiveLiveChannel,
        plans,
        setPlans,
        updatePlan,
        selectedPlanForCheckout,
        setSelectedPlanForCheckout,
        startCheckoutForPlan,
        coupons,
        addCoupon,
        deleteCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        adminConfig,
        updateAdminConfig,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        importCatalogFromJson,
        syncCatalogFromFeed,
        currentUser,
        setCurrentUser,
        loginUser,
        registerUser,
        logoutUser,
        completeSubscriptionPayment,
        cancelSubscription,
        updateContinueWatching,
        toasts,
        addToast,
        removeToast,
        referralCode,
        setReferralCode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
