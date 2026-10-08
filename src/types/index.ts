export type ContentType = 'movie' | 'series' | 'channel' | 'documentary';

export type AgeRating = 'L' | '10' | '12' | '14' | '16' | '18';

export type RightsStatus = 'licensed' | 'owned' | 'authorized' | 'pending' | 'unavailable';

export type AvailabilityStatus = 'available' | 'coming_soon' | 'unavailable' | 'licensed' | 'metadata_only';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  streamUrl?: string;
  subtitles?: string[];
  audioTracks?: string[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  description?: string;
  episodes: Episode[];
}

export interface ChannelProgram {
  time: string;
  title: string;
  description?: string;
  rating?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: ContentType;
  category: string;
  genre: string[];
  ageRating: AgeRating;
  year: number;
  duration?: string; // e.g. "2h 18m" or "3 Temporadas" or "Ao Vivo 24h"
  description: string;
  synopsis?: string;
  bannerUrl: string;
  posterUrl: string;
  logoUrl?: string; // Specific channel logo
  videoUrl?: string;
  trailerUrl?: string;
  audioSpecs?: string[]; // e.g. ["4K HDR", "Dolby Atmos", "5.1 Surround"]
  badge?: 'NOVIDADE' | 'MAIS ASSISTIDO' | 'DESTAQUE' | 'EXCLUSIVO' | 'AO VIVO';
  isAuthorized: boolean;
  featured: boolean;
  hidden: boolean;
  order: number;
  viewsCount: number;
  rating: number; // e.g. 4.9
  
  // Real Streaming Attributes
  cast?: string[];
  director?: string;
  country?: string;
  language?: string;
  subtitles?: string[];
  isTrending?: boolean; // 🔥 Em Alta
  isNewRelease?: boolean; // 🆕 Lançamentos
  isTopWatched?: boolean; // ⭐ Mais Assistido
  releaseDate?: string;
  dateAdded?: string;
  seasons?: Season[]; // For Series
  epgSchedule?: ChannelProgram[]; // For Live Channels
  channelNumber?: string;
  broadcastStatus?: 'online' | 'offline' | 'scheduled';
  status?: 'published' | 'processing' | 'archived' | 'coming_soon';
  
  // Licensing & Rights Compliance
  rightsStatus: RightsStatus; // 'licensed' | 'owned' | 'authorized' | 'pending' | 'unavailable'
  availabilityStatus: AvailabilityStatus; // 'available' | 'coming_soon' | 'unavailable' | 'licensed' | 'metadata_only'
  availabilityStart?: string;
  availabilityEnd?: string;
  licenseNotes?: string;
  distributor?: string;
  isDemo?: boolean; // Distinguishes test/demo items from production catalog
}

export interface PlanConfig {
  id: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  name: string;
  subtitle: string;
  priceMonthlyEquiv: number;
  totalPrice: number;
  billingCycle: string;
  billingPeriodMonths: number;
  savingsLabel?: string;
  promoTag?: string;
  badgeText?: string;
  includesApp: boolean;
  screensCount: number;
  resolution: string;
  isMostPopular?: boolean;
  isBestValue?: boolean;
  benefits: string[];
  active: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  expiresAt: string;
  active: boolean;
  description: string;
}

export interface CatalogSyncLog {
  id: string;
  timestamp: string;
  sourceType: 'API' | 'Feed JSON' | 'CSV' | 'Painel Master';
  sourceUrl?: string;
  status: 'success' | 'warning' | 'idle' | 'waiting_source';
  addedCount: number;
  updatedCount: number;
  removedCount: number;
  notes: string;
}

export interface AdminPlatformConfig {
  promotionsHeadline: string;
  promoBannerActive: boolean;
  promoBannerText: string;
  supportWhatsApp: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  referralRewardPercent: number;
  officialAnnouncement: string;
  
  // Catalog Integration and Feed settings
  catalogFeedUrl?: string;
  catalogApiEndpoint?: string;
  lastSyncTimestamp?: string;
  syncLogs?: CatalogSyncLog[];
}

export type PaymentOrderStatus = 
  | 'waiting_payment'       // Aguardando pagamento
  | 'proof_received'        // Comprovante recebido
  | 'payment_confirmed'     // Pagamento confirmado
  | 'plan_activated'        // Plano ativado
  | 'payment_rejected';     // Pagamento recusado

export interface PaymentOrder {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  pixKey: string;
  status: PaymentOrderStatus;
  transactionId: string;
  notes?: string;
  proofSentAt?: string;
  activatedAt?: string;
}

export interface UserDevice {
  id: string;
  name: string;
  type: 'smartphone' | 'smart_tv' | 'pc' | 'tablet';
  browser: string;
  lastActive: string;
  current: boolean;
}

export interface InvoiceItem {
  id: string;
  date: string;
  planName: string;
  amount: number;
  status: 'paid' | 'pending' | 'canceled' | PaymentOrderStatus;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto';
  transactionId: string;
}

export interface ContinueWatchingItem {
  contentId: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  progressPercent: number;
  durationMinutes: number;
  lastWatchedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  currentPlanId?: string;
  subscriptionStatus: 'active' | 'pending' | 'canceled' | 'expired' | 'none';
  subscriptionValidUntil?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  pendingOrderStatus?: PaymentOrderStatus;
  favorites: string[];
  continueWatching: ContinueWatchingItem[];
  devices: UserDevice[];
  invoices: InvoiceItem[];
  referralCode: string;
  createdAt: string;
}

export type ActiveView = 
  | 'home' 
  | 'catalog'
  | 'films'
  | 'series'
  | 'genres'
  | 'trending'
  | 'releases'
  | 'mylist'
  | 'live-tv'
  | 'movie-detail'
  | 'series-detail'
  | 'plans' 
  | 'checkout' 
  | 'client' 
  | 'admin' 
  | 'marketing-kit' 
  | 'local-campaign' 
  | 'about' 
  | 'terms' 
  | 'privacy' 
  | 'licenses';

