import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Film, 
  Tag, 
  Settings, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Trash2, 
  Star, 
  Check, 
  Save, 
  LogOut, 
  AlertCircle,
  Sparkles,
  Tv,
  Radio,
  Download,
  Upload,
  RefreshCw,
  FileText,
  Calendar,
  Layers,
  Flame,
  Image as ImageIcon,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Clock,
  HelpCircle,
  CreditCard,
  MessageCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem, PlanConfig, AgeRating, ContentType, Season, Episode, ChannelProgram, RightsStatus, AvailabilityStatus, PaymentOrder, PaymentOrderStatus } from '../../types';
import { checkImageDuplication, getRightsStatusInfo } from '../../utils/catalogValidation';
import { OFFICIAL_PIX_CONFIG } from '../../utils/pixHelper';

export const MasterOwnerDashboard: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin, 
    contents, 
    addContent, 
    updateContent, 
    deleteContent,
    plans,
    updatePlan,
    coupons,
    addCoupon,
    deleteCoupon,
    adminConfig,
    updateAdminConfig,
    importCatalogFromJson,
    syncCatalogFromFeed,
    paymentOrders,
    updateOrderStatus,
    confirmPaymentAndActivate,
    rejectPaymentOrder,
    addToast
  } = useApp();

  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'payments' | 'metrics' | 'import_sync' | 'pricing' | 'promotions' | 'settings'>('content');

  // Filter in content management
  const [contentFilterType, setContentFilterType] = useState<'all' | 'movie' | 'series' | 'channel'>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'production' | 'demo_pending'>('all');

  // Payment management state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | PaymentOrderStatus>('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [editingNoteOrderId, setEditingNoteOrderId] = useState<string | null>(null);
  const [orderNoteText, setOrderNoteText] = useState('');

  // Add/Edit Content Form Modal
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formOriginalTitle, setFormOriginalTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Filmes');
  const [formType, setFormType] = useState<ContentType>('movie');
  const [formGenres, setFormGenres] = useState('Ficção Científica, Ação');
  const [formAgeRating, setFormAgeRating] = useState<AgeRating>('12');
  const [formYear, setFormYear] = useState('2026');
  const [formDuration, setFormDuration] = useState('1h 45m');
  const [formDescription, setFormDescription] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formPosterUrl, setFormPosterUrl] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formTrailerUrl, setFormTrailerUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formDirector, setFormDirector] = useState('');
  const [formCast, setFormCast] = useState('');
  const [formCountry, setFormCountry] = useState('Brasil');
  const [formLanguage, setFormLanguage] = useState('Português (Áudio Original)');
  const [formSubtitles, setFormSubtitles] = useState('Português (BR), Inglês');
  const [formChannelNumber, setFormChannelNumber] = useState('01');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTrending, setFormTrending] = useState(false);
  const [formNewRelease, setFormNewRelease] = useState(false);
  const [formTopWatched, setFormTopWatched] = useState(false);
  const [formHidden, setFormHidden] = useState(false);
  const [formIsDemo, setFormIsDemo] = useState(false);

  // Rights & Licensing
  const [formRightsStatus, setFormRightsStatus] = useState<RightsStatus>('licensed');
  const [formAvailabilityStatus, setFormAvailabilityStatus] = useState<AvailabilityStatus>('available');
  const [formDistributor, setFormDistributor] = useState('Distribuição Homologada');
  const [formAvailabilityStart, setFormAvailabilityStart] = useState('2024-01-01');
  const [formAvailabilityEnd, setFormAvailabilityEnd] = useState('2030-12-31');
  const [formLicenseNotes, setFormLicenseNotes] = useState('Contrato de distribuição e exibição digital homologado');

  // Series Episodes builder state
  const [seriesSeasons, setSeriesSeasons] = useState<Season[]>([
    {
      seasonNumber: 1,
      title: 'Temporada 1',
      episodes: [
        {
          id: 'ep-1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Episódio 1: A Origem',
          description: 'Apresentação dos personagens e início do conflito principal.',
          duration: '45m',
          thumbnailUrl: '',
          streamUrl: ''
        }
      ]
    }
  ]);

  // Feed & JSON Import
  const [jsonImportText, setJsonImportText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Coupons
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Editable prices state
  const [editablePlans, setEditablePlans] = useState(plans);

  // Image Duplication Validation Checks
  const posterDupCheck = checkImageDuplication(formPosterUrl, editingContentId, contents);
  const bannerDupCheck = checkImageDuplication(formBannerUrl, editingContentId, contents);
  const logoDupCheck = checkImageDuplication(formLogoUrl, editingContentId, contents);

  // Handle local device image file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'poster' | 'banner' | 'logo' | { seasonIndex: number; episodeIndex: number }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Por favor, selecione um arquivo de imagem válido.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      if (targetField === 'poster') {
        const dup = checkImageDuplication(dataUrl, editingContentId, contents);
        setFormPosterUrl(dataUrl);
        if (dup.isDuplicate) {
          addToast(`Atenção: Esta imagem já está vinculada a: ${dup.duplicateTitles.join(', ')}`, 'warning');
        } else {
          addToast('Capa carregada com sucesso do seu dispositivo!', 'success');
        }
      } else if (targetField === 'banner') {
        const dup = checkImageDuplication(dataUrl, editingContentId, contents);
        setFormBannerUrl(dataUrl);
        if (dup.isDuplicate) {
          addToast(`Atenção: Este banner já está vinculado a: ${dup.duplicateTitles.join(', ')}`, 'warning');
        } else {
          addToast('Banner carregado com sucesso!', 'success');
        }
      } else if (targetField === 'logo') {
        const dup = checkImageDuplication(dataUrl, editingContentId, contents);
        setFormLogoUrl(dataUrl);
        if (dup.isDuplicate) {
          addToast(`Atenção: Este logo já está em uso por: ${dup.duplicateTitles.join(', ')}`, 'warning');
        } else {
          addToast('Logo do canal carregado com sucesso!', 'success');
        }
      } else if (typeof targetField === 'object') {
        // Episode thumbnail
        const { seasonIndex, episodeIndex } = targetField;
        setSeriesSeasons((prev) => {
          const updated = [...prev];
          if (updated[seasonIndex]?.episodes[episodeIndex]) {
            updated[seasonIndex].episodes[episodeIndex].thumbnailUrl = dataUrl;
          }
          return updated;
        });
        addToast('Miniatura do episódio atualizada!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // If not authenticated as Admin
  if (!isAdminLoggedIn) {
    return (
      <div className="w-full py-20 bg-[#06080F] min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-[#090D18] border border-cyan-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              ACESSO RESTRITO
            </span>
            <h1 className="font-display font-extrabold text-2xl text-white uppercase mt-1">
              PAINEL MASTER OWNER
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Área de controle administrativo do PIZZA CINE. Digite sua credencial Master.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAdmin(adminPassword);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Chave de Acesso Master
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Digite a senha (padrão: pizzacine2026)"
                className="w-full px-4 py-3 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-sm rounded-xl hover:from-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Acessar Painel Master Owner
            </button>

            <p className="text-[11px] text-center text-slate-500">
              Autenticação protegida para o titular da plataforma.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Handle Save Content (Add or Edit)
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      addToast('O título do conteúdo é obrigatório.', 'warning');
      return;
    }

    // Notice: we do NOT invent fake placeholder images!
    // If not provided, it saves as empty string and displays as "Imagem não disponível" in admin.
    const payload = {
      title: formTitle.trim(),
      originalTitle: formOriginalTitle.trim() || formTitle.trim(),
      type: formType,
      category: formCategory,
      genre: formGenres.split(',').map((g) => g.trim()).filter(Boolean),
      ageRating: formAgeRating,
      year: parseInt(formYear) || 2026,
      duration: formDuration,
      description: formDescription,
      synopsis: formSynopsis || formDescription,
      bannerUrl: formBannerUrl.trim(),
      posterUrl: formPosterUrl.trim() || (formType === 'channel' ? formLogoUrl.trim() : ''),
      logoUrl: formType === 'channel' ? (formLogoUrl.trim() || formPosterUrl.trim()) : undefined,
      trailerUrl: formTrailerUrl.trim(),
      videoUrl: formVideoUrl.trim(),
      director: formDirector.trim(),
      cast: formCast.split(',').map((c) => c.trim()).filter(Boolean),
      country: formCountry,
      language: formLanguage,
      subtitles: formSubtitles.split(',').map((s) => s.trim()).filter(Boolean),
      channelNumber: formType === 'channel' ? formChannelNumber : undefined,
      isAuthorized: formRightsStatus === 'licensed' || formRightsStatus === 'owned' || formRightsStatus === 'authorized',
      rightsStatus: formRightsStatus,
      availabilityStatus: formAvailabilityStatus,
      distributor: formDistributor,
      availabilityStart: formAvailabilityStart,
      availabilityEnd: formAvailabilityEnd,
      licenseNotes: formLicenseNotes,
      isDemo: formIsDemo,
      featured: formFeatured,
      isTrending: formTrending,
      isNewRelease: formNewRelease,
      isTopWatched: formTopWatched,
      hidden: formHidden,
      rating: 4.9,
      seasons: formType === 'series' ? seriesSeasons : undefined
    };

    if (editingContentId) {
      updateContent(editingContentId, payload);
    } else {
      addContent(payload);
    }

    setShowAddContentModal(false);
    setEditingContentId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormOriginalTitle('');
    setFormDescription('');
    setFormSynopsis('');
    setFormBannerUrl('');
    setFormPosterUrl('');
    setFormLogoUrl('');
    setFormTrailerUrl('');
    setFormVideoUrl('');
    setFormDirector('');
    setFormCast('');
    setFormCountry('Brasil');
    setFormLanguage('Português (Áudio Original)');
    setFormSubtitles('Português (BR), Inglês');
    setFormChannelNumber('01');
    setFormFeatured(false);
    setFormTrending(false);
    setFormNewRelease(false);
    setFormTopWatched(false);
    setFormHidden(false);
    setFormIsDemo(false);
    setFormRightsStatus('licensed');
    setFormAvailabilityStatus('available');
    setFormDistributor('Distribuição Homologada');
    setFormAvailabilityStart('2024-01-01');
    setFormAvailabilityEnd('2030-12-31');
    setFormLicenseNotes('Contrato de distribuição e exibição digital homologado');
  };

  const openEditModal = (item: ContentItem) => {
    setEditingContentId(item.id);
    setFormTitle(item.title);
    setFormOriginalTitle(item.originalTitle || item.title);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormGenres(item.genre.join(', '));
    setFormAgeRating(item.ageRating);
    setFormYear(item.year.toString());
    setFormDuration(item.duration || '');
    setFormDescription(item.description);
    setFormSynopsis(item.synopsis || item.description);
    setFormBannerUrl(item.bannerUrl || '');
    setFormPosterUrl(item.posterUrl || '');
    setFormLogoUrl(item.logoUrl || '');
    setFormTrailerUrl(item.trailerUrl || '');
    setFormVideoUrl(item.videoUrl || '');
    setFormDirector(item.director || '');
    setFormCast(item.cast ? item.cast.join(', ') : '');
    setFormCountry(item.country || 'Brasil');
    setFormLanguage(item.language || 'Português (Áudio Original)');
    setFormSubtitles(item.subtitles ? item.subtitles.join(', ') : 'Português (BR), Inglês');
    setFormChannelNumber(item.channelNumber || '01');
    setFormFeatured(item.featured);
    setFormTrending(item.isTrending || false);
    setFormNewRelease(item.isNewRelease || false);
    setFormTopWatched(item.isTopWatched || false);
    setFormHidden(item.hidden);
    setFormIsDemo(item.isDemo || false);
    setFormRightsStatus(item.rightsStatus || 'licensed');
    setFormAvailabilityStatus(item.availabilityStatus || 'available');
    setFormDistributor(item.distributor || 'Distribuição Homologada');
    setFormAvailabilityStart(item.availabilityStart || '2024-01-01');
    setFormAvailabilityEnd(item.availabilityEnd || '2030-12-31');
    setFormLicenseNotes(item.licenseNotes || '');
    if (item.seasons && item.seasons.length > 0) {
      setSeriesSeasons(item.seasons);
    }
    setShowAddContentModal(true);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncCatalogFromFeed();
    setIsSyncing(false);
  };

  const handleJsonImportSubmit = () => {
    if (!jsonImportText.trim()) {
      addToast('Insira a estrutura JSON para importar.', 'warning');
      return;
    }
    importCatalogFromJson(jsonImportText);
    setJsonImportText('');
  };

  // Filter contents in admin table
  const filteredAdminContents = contents.filter((c) => {
    if (contentFilterType !== 'all' && c.type !== contentFilterType) return false;
    if (scopeFilter === 'production' && c.isDemo) return false;
    if (scopeFilter === 'demo_pending' && !c.isDemo && c.rightsStatus !== 'pending') return false;
    return true;
  });

  return (
    <div className="w-full py-10 bg-[#06080F] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090D18] border border-cyan-500/20 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PAINEL ADMINISTRATIVO MASTER OWNER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white uppercase mt-0.5">
              CENTRAL DE CONTROLE DA PLATAFORMA
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gestão de catálogo licenciado, metadados, direitos autorais, planos e regras de negócio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingContentId(null);
                setShowAddContentModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs rounded-xl hover:from-cyan-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Produção</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 bg-slate-900 border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
              title="Encerrar Sessão Master"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/8 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'content', label: 'Catálogo & Produções', icon: Film, count: contents.length },
            { 
              id: 'payments', 
              label: 'Pagamentos & Pix', 
              icon: CreditCard, 
              badge: paymentOrders.filter(o => o.status === 'proof_received' || o.status === 'waiting_payment').length 
            },
            { id: 'metrics', label: 'Métricas & Faturamento', icon: TrendingUp },
            { id: 'import_sync', label: 'Sincronização & Feeds', icon: RefreshCw },
            { id: 'pricing', label: 'Planos & Valores', icon: DollarSign },
            { id: 'promotions', label: 'Cupons & Ofertas', icon: Tag },
            { id: 'settings', label: 'Configurações Globais', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: CONTENT MANAGEMENT */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Catálogo Homologado ({contents.length} produções cadastradas)
                </h3>
                <p className="text-xs text-slate-400">
                  Gerenciamento individual de filmes, séries (temporadas e episódios) e canais ao vivo autorizados.
                </p>
              </div>

              {/* Format and Scope Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Scope filter (Production vs Demo) */}
                <select
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value as any)}
                  aria-label="Filtrar escopo do catálogo"
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="all">Todos os Escopos</option>
                  <option value="production">Catálogo de Produção (Oficial)</option>
                  <option value="demo_pending">Demonstração / Direitos Pendentes</option>
                </select>

                {/* Format filter */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'movie', label: 'Filmes' },
                    { id: 'series', label: 'Séries' },
                    { id: 'channel', label: 'Canais TV' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setContentFilterType(f.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        contentFilterType === f.id
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#090D18] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-900/60 border-b border-white/8">
                    <tr>
                      <th className="py-3 px-4">Identidade Visual / Título</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Direitos & Licença</th>
                      <th className="py-3 px-4">Destaques</th>
                      <th className="py-3 px-4">Audiência</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAdminContents.map((item) => {
                      const rights = getRightsStatusInfo(item.rightsStatus);
                      const hasImage = Boolean(item.bannerUrl || item.posterUrl || item.logoUrl);

                      return (
                        <tr key={item.id} className="text-slate-300 hover:bg-white/[0.02]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {hasImage ? (
                                <img
                                  src={item.bannerUrl || item.posterUrl || item.logoUrl}
                                  alt={item.title}
                                  className="w-12 h-8 rounded object-cover bg-slate-800 shrink-0 border border-white/10"
                                />
                              ) : (
                                <div className="w-12 h-8 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                                  SEM CAPA
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-white block">{item.title}</span>
                                  {item.isDemo && (
                                    <span className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-[9px] font-mono font-bold">
                                      DEMO
                                    </span>
                                  )}
                                  {!hasImage && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-[9px] font-mono">
                                      Imagem não cadastrada
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.year} · {item.duration} · {item.ageRating} {item.director ? `· Dir: ${item.director}` : ''}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize font-mono text-cyan-300">
                            {item.type === 'movie' ? 'Filme' : item.type === 'series' ? 'Série' : 'Canal TV'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${rights.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${rights.dotColor}`} />
                              <span>{rights.shortLabel}</span>
                            </span>
                            {item.distributor && (
                              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                                {item.distributor}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.featured && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                  Destaque
                                </span>
                              )}
                              {item.isTrending && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                                  Em Alta
                                </span>
                              )}
                              {item.isNewRelease && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                  Novo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums">{item.viewsCount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${
                              item.hidden 
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800' 
                                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                            }`}>
                              {item.hidden ? 'Oculto' : 'Ativo'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateContent(item.id, { isTrending: !item.isTrending })}
                                className={`p-1.5 rounded hover:bg-white/10 ${item.isTrending ? 'text-red-400' : 'text-slate-500'}`}
                                title={item.isTrending ? 'Remover de Em Alta' : 'Definir Em Alta'}
                              >
                                <Flame className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button
                                onClick={() => updateContent(item.id, { featured: !item.featured })}
                                className={`p-1.5 rounded hover:bg-white/10 ${item.featured ? 'text-amber-400' : 'text-slate-500'}`}
                                title={item.featured ? 'Remover destaque' : 'Destacar na Home'}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button
                                onClick={() => updateContent(item.id, { hidden: !item.hidden })}
                                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                                title={item.hidden ? 'Publicar' : 'Ocultar'}
                              >
                                {item.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 rounded hover:bg-white/10 text-cyan-400"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja remover "${item.title}"?`)) {
                                    deleteContent(item.id);
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-white/10 text-red-400"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PAGAMENTOS & PIX (FLUXO OFICIAL HOMOLOGADO) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            
            {/* Header & Official Pix Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#091024] to-[#070B18] border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>MÓDULO OFICIAL DE PAGAMENTO · CHAVE PIX & WHATSAPP</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">
                    Gestão de Pagamentos & Ativações de Acesso
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Controle manual e seguro de aprovação de assinaturas. A ativação só ocorre quando o administrador valida o comprovante recebido no extrato bancário.
                  </p>
                </div>

                {/* WhatsApp Link to view messages */}
                <a
                  href={`https://wa.me/${OFFICIAL_PIX_CONFIG.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 self-start md:self-auto cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>ABRIR WHATSAPP OFICIAL (+55 11 97347-9473)</span>
                </a>
              </div>

              {/* Official Credentials Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Chave Pix Oficial Homologada:</span>
                  <span className="text-cyan-300 font-bold text-sm block mt-0.5">{OFFICIAL_PIX_CONFIG.rawKey}</span>
                  <span className="text-[10px] text-slate-400">Tipo: {OFFICIAL_PIX_CONFIG.keyType} ({OFFICIAL_PIX_CONFIG.formattedKey})</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Titular & Cidade Pix:</span>
                  <span className="text-white font-bold block mt-0.5">{OFFICIAL_PIX_CONFIG.recipientName}</span>
                  <span className="text-[10px] text-slate-400">{OFFICIAL_PIX_CONFIG.recipientCity} · Banco Central do Brasil</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Regra de Segurança Ativa:</span>
                  <span className="text-amber-300 font-bold block mt-0.5">Ativação Estritamente Manual</span>
                  <span className="text-[10px] text-slate-400">Clique "Já paguei" não ativa sem conferência</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar for Orders */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { 
                  label: 'Total Pedidos', 
                  count: paymentOrders.length, 
                  color: 'text-white', 
                  filter: 'all' 
                },
                { 
                  label: 'Aguardando Pagamento', 
                  count: paymentOrders.filter(o => o.status === 'waiting_payment').length, 
                  color: 'text-amber-400', 
                  filter: 'waiting_payment' 
                },
                { 
                  label: 'Comprovante Recebido', 
                  count: paymentOrders.filter(o => o.status === 'proof_received').length, 
                  color: 'text-blue-400', 
                  filter: 'proof_received' 
                },
                { 
                  label: 'Pagamento Confirmado', 
                  count: paymentOrders.filter(o => o.status === 'payment_confirmed').length, 
                  color: 'text-emerald-400', 
                  filter: 'payment_confirmed' 
                },
                { 
                  label: 'Plano Ativado', 
                  count: paymentOrders.filter(o => o.status === 'plan_activated').length, 
                  color: 'text-cyan-400', 
                  filter: 'plan_activated' 
                },
                { 
                  label: 'Pagamento Recusado', 
                  count: paymentOrders.filter(o => o.status === 'payment_rejected').length, 
                  color: 'text-red-400', 
                  filter: 'payment_rejected' 
                }
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setPaymentStatusFilter(m.filter as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentStatusFilter === m.filter 
                      ? 'bg-slate-800 border-cyan-400 shadow-md' 
                      : 'bg-[#090D18] border-white/8 hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">{m.label}</span>
                  <span className={`text-xl font-bold font-display tabular-nums mt-1 block ${m.color}`}>
                    {m.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#090D18] p-3 rounded-2xl border border-white/8">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, e-mail, telefone ou nº do pedido..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Select Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                  aria-label="Filtrar por status de pagamento"
                  className="bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Todos os Status ({paymentOrders.length})</option>
                  <option value="waiting_payment">Aguardando pagamento</option>
                  <option value="proof_received">Comprovante recebido</option>
                  <option value="payment_confirmed">Pagamento confirmado</option>
                  <option value="plan_activated">Plano ativado</option>
                  <option value="payment_rejected">Pagamento recusado</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#090D18] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-black/40 text-[11px] font-mono uppercase text-slate-400 border-b border-white/8">
                    <tr>
                      <th className="p-3.5 pl-4">Pedido / Data</th>
                      <th className="p-3.5">Cliente & Contato WhatsApp</th>
                      <th className="p-3.5">Plano & Valor</th>
                      <th className="p-3.5">Chave Pix</th>
                      <th className="p-3.5">Status Atual</th>
                      <th className="p-3.5">Comprovante / Notas</th>
                      <th className="p-3.5 text-right pr-4">Ações do Administrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {paymentOrders
                      .filter((o) => {
                        if (paymentStatusFilter !== 'all' && o.status !== paymentStatusFilter) return false;
                        if (!paymentSearch.trim()) return true;
                        const q = paymentSearch.toLowerCase();
                        return (
                          o.id.toLowerCase().includes(q) ||
                          o.customerName.toLowerCase().includes(q) ||
                          o.customerEmail.toLowerCase().includes(q) ||
                          o.customerPhone.toLowerCase().includes(q) ||
                          o.transactionId.toLowerCase().includes(q) ||
                          o.planName.toLowerCase().includes(q)
                        );
                      })
                      .map((order) => {
                        const cleanPhone = order.customerPhone.replace(/\D/g, '');
                        return (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Order ID & Date */}
                            <td className="p-3.5 pl-4 align-top">
                              <span className="font-mono font-bold text-cyan-300 block">
                                {order.id}
                              </span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {order.date}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[130px]">
                                {order.transactionId}
                              </span>
                            </td>

                            {/* Customer info + direct WhatsApp link */}
                            <td className="p-3.5 align-top">
                              <span className="font-bold text-white block">
                                {order.customerName}
                              </span>
                              <span className="text-[11px] text-slate-400 block font-mono">
                                {order.customerEmail}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[11px] text-slate-300 font-mono">
                                  {order.customerPhone}
                                </span>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}?text=${encodeURIComponent(`Olá ${order.customerName}! Aqui é do suporte oficial do PIZZA CINE sobre o seu pedido ${order.id}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 transition-colors"
                                    title="Conversar com o cliente no WhatsApp"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Plan & Amount */}
                            <td className="p-3.5 align-top">
                              <span className="font-semibold text-white block">
                                {order.planName}
                              </span>
                              <span className="font-display font-bold text-emerald-400 text-sm block mt-0.5 tabular-nums">
                                R$ {order.amount.toFixed(2).replace('.', ',')}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {order.paymentMethod}
                              </span>
                            </td>

                            {/* Pix Key */}
                            <td className="p-3.5 align-top">
                              <span className="font-mono text-cyan-300 font-semibold block text-[11px]">
                                {order.pixKey || OFFICIAL_PIX_CONFIG.rawKey}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Telefone Homologado
                              </span>
                            </td>

                            {/* Status Badge (The 5 official statuses) */}
                            <td className="p-3.5 align-top">
                              {order.status === 'waiting_payment' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  <span>Aguardando pagamento</span>
                                </span>
                              )}
                              {order.status === 'proof_received' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                  <span>Comprovante recebido</span>
                                </span>
                              )}
                              {order.status === 'payment_confirmed' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Pagamento confirmado</span>
                                </span>
                              )}
                              {order.status === 'plan_activated' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950">
                                  <Sparkles className="w-3 h-3 text-cyan-400" />
                                  <span>Plano ativado</span>
                                </span>
                              )}
                              {order.status === 'payment_rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/40">
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  <span>Pagamento recusado</span>
                                </span>
                              )}

                              {order.activatedAt && (
                                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                                  Ativado: {order.activatedAt}
                                </span>
                              )}
                            </td>

                            {/* Proof Sent info / Notes */}
                            <td className="p-3.5 align-top max-w-[200px]">
                              {order.proofSentAt && (
                                <span className="text-[10px] text-emerald-300 font-mono block mb-1">
                                  ✓ Comprovante: {order.proofSentAt}
                                </span>
                              )}
                              <p className="text-[11px] text-slate-400 italic line-clamp-2">
                                {order.notes || 'Sem observações adicionais.'}
                              </p>
                            </td>

                            {/* Admin Action Controls */}
                            <td className="p-3.5 text-right pr-4 align-top">
                              <div className="flex flex-col items-end gap-1.5">
                                
                                {/* Primary Quick Activation Action */}
                                {order.status !== 'plan_activated' && (
                                  <button
                                    type="button"
                                    onClick={() => confirmPaymentAndActivate(order.id)}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all"
                                    title="Confirmar pagamento e ativar acesso 4K do cliente"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Confirmar & Ativar</span>
                                  </button>
                                )}

                                {/* Status Switcher Dropdown with the 5 statuses */}
                                <div className="flex items-center gap-1">
                                  <label htmlFor={`order-status-${order.id}`} className="sr-only">Alterar status do pedido</label>
                                  <select
                                    id={`order-status-${order.id}`}
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as PaymentOrderStatus)}
                                    className="bg-slate-900 border border-white/10 text-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-400 cursor-pointer"
                                  >
                                    <option value="waiting_payment">Aguardando pagamento</option>
                                    <option value="proof_received">Comprovante recebido</option>
                                    <option value="payment_confirmed">Pagamento confirmado</option>
                                    <option value="plan_activated">Plano ativado</option>
                                    <option value="payment_rejected">Pagamento recusado</option>
                                  </select>

                                  {/* Quick Reject Button */}
                                  {order.status !== 'payment_rejected' && (
                                    <button
                                      type="button"
                                      onClick={() => rejectPaymentOrder(order.id)}
                                      className="p-1 rounded hover:bg-red-950/50 text-red-400 border border-transparent hover:border-red-500/30 cursor-pointer"
                                      title="Recusar pagamento"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {paymentOrders.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum pedido de pagamento registrado ainda.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Assinantes Totais', value: '1.428', sub: '+12% este mês', icon: Users, color: 'text-cyan-400' },
                { title: 'Assinaturas Ativas', value: '1.294', sub: '90,6% de retenção', icon: Check, color: 'text-emerald-400' },
                { title: 'Receita Mensal Estimada', value: 'R$ 51.748', sub: 'Média R$ 36,20/usuário', icon: DollarSign, color: 'text-amber-400' },
                { title: 'Taxa de Churn', value: '1,8%', sub: 'Abaixo da média global', icon: TrendingUp, color: 'text-purple-400' }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="p-6 rounded-2xl bg-[#090D18] border border-white/8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400">{stat.title}</span>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="font-display font-extrabold text-2xl text-white tracking-tight tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090D18] border border-white/8">
                <h3 className="font-display font-bold text-base text-white mb-4">
                  Evolução de Faturamento dos Últimos Meses (R$)
                </h3>
                <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6">
                  {[
                    { month: 'Mai', val: 32400, h: '55%' },
                    { month: 'Jun', val: 38900, h: '65%' },
                    { month: 'Jul', val: 42100, h: '72%' },
                    { month: 'Ago', val: 46800, h: '80%' },
                    { month: 'Set', val: 49200, h: '88%' },
                    { month: 'Out', val: 51748, h: '95%' }
                  ].map((col) => (
                    <div key={col.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-300 tabular-nums">
                        {(col.val / 1000).toFixed(1)}k
                      </span>
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-teal-300 rounded-t-lg transition-all"
                        style={{ height: col.h }}
                      />
                      <span className="text-xs text-slate-400 font-medium">{col.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090D18] border border-white/8 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white mb-4">
                    Vendas por Tipo de Plano
                  </h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { name: 'Plano Trimestral (Pague 2 Leve 3)', pct: 44, color: 'bg-cyan-400' },
                      { name: 'Plano Anual Premium (Maior Economia)', pct: 36, color: 'bg-emerald-400' },
                      { name: 'Plano Semestral', pct: 12, color: 'bg-indigo-400' },
                      { name: 'Plano Mensal', pct: 8, color: 'bg-slate-400' }
                    ].map((p) => (
                      <div key={p.name} className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>{p.name}</span>
                          <span className="font-mono font-bold">{p.pct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 mt-6">
                  💡 <strong>Status:</strong> Assinaturas sincronizadas com o gateway homologado.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPORT & SYNC */}
        {activeTab === 'import_sync' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Automated Feed Integration */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sincronização com Feed / API Autorizada</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Conecte o endpoint de catálogo de seu distribuidor, feed de parceiro ou API licenciada. O sistema atualizará metadados, títulos e disponibilidade automaticamente.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      URL do Feed de Conteúdo (JSON / REST API)
                    </label>
                    <input
                      type="url"
                      value={adminConfig.catalogFeedUrl || ''}
                      onChange={(e) => updateAdminConfig({ catalogFeedUrl: e.target.value })}
                      placeholder="https://api.distribuidor.com/v1/catalog.json"
                      className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>Última Sincronização:</span>
                    <span className="text-cyan-300 font-bold">{adminConfig.lastSyncTimestamp || 'Aguardando sincronização inicial'}</span>
                  </div>

                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold rounded-xl hover:from-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando Feed...' : 'Sincronizar Agora com o Provedor'}</span>
                  </button>
                </div>
              </div>

              {/* JSON Import Tool */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                  <Upload className="w-4 h-4" />
                  <span>Importação Estruturada em Lote (JSON)</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Cole uma matriz de produções estruturada em JSON para inclusão direta no catálogo oficial.
                </p>

                <div className="space-y-3 text-xs">
                  <textarea
                    rows={6}
                    value={jsonImportText}
                    onChange={(e) => setJsonImportText(e.target.value)}
                    placeholder='[&#10;  {&#10;    "title": "Nome da Produção",&#10;    "type": "movie",&#10;    "category": "Filmes",&#10;    "genre": ["Ação", "Drama"],&#10;    "year": 2026,&#10;    "videoUrl": "https://...",&#10;    "rightsStatus": "licensed",&#10;    "isAuthorized": true&#10;  }&#10;]'
                    className="w-full p-3 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px] resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleJsonImportSubmit}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Processar e Importar Catálogo</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Sync History Logs */}
            <div className="p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Histórico de Sincronizações e Auditoria de Fontes
              </h3>

              {adminConfig.syncLogs && adminConfig.syncLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-white/8">
                      <tr>
                        <th className="py-2.5 px-3">Data e Hora</th>
                        <th className="py-2.5 px-3">Origem</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Adicionados</th>
                        <th className="py-2.5 px-3">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {adminConfig.syncLogs.map((log) => (
                        <tr key={log.id} className="text-slate-300">
                          <td className="py-2.5 px-3">{log.timestamp}</td>
                          <td className="py-2.5 px-3 text-cyan-300">{log.sourceType}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-emerald-400 font-bold uppercase">
                              ✓ {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">+{log.addedCount} itens</td>
                          <td className="py-2.5 px-3 text-slate-400 font-sans">{log.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-black/40 text-center text-xs text-slate-500 font-mono">
                  Catálogo aguardando primeira sincronização com fonte de conteúdo autorizada.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRICING & PLANS */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Gerenciador de Planos e Valores Comerciais
              </h3>
              <p className="text-xs text-slate-400">
                O Master Owner pode alterar os valores, períodos promocionais e benefícios sem mexer no código-fonte.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editablePlans.map((plan, idx) => (
                <div key={plan.id} className="p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/8 pb-3">
                    <h4 className="font-display font-bold text-base text-cyan-300">
                      {plan.name} ({plan.billingCycle})
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      ID: {plan.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Preço Total (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={plan.totalPrice}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, totalPrice: parseFloat(e.target.value) || 0 };
                          setEditablePlans(updated);
                        }}
                        className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Preço Mensal Equivalente (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={plan.priceMonthlyEquiv}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, priceMonthlyEquiv: parseFloat(e.target.value) || 0 };
                          setEditablePlans(updated);
                        }}
                        className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Subtítulo Comercial</label>
                      <input
                        type="text"
                        value={plan.subtitle}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, subtitle: e.target.value };
                          setEditablePlans(updated);
                        }}
                        className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Badge Promocional</label>
                      <input
                        type="text"
                        value={plan.promoTag || ''}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, promoTag: e.target.value };
                          setEditablePlans(updated);
                        }}
                        placeholder="Ex: PAGUE 2 LEVE 3"
                        className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={plan.includesApp}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, includesApp: e.target.checked };
                          setEditablePlans(updated);
                        }}
                        className="rounded accent-cyan-400"
                      />
                      <span>Inclui Acesso pelo Aplicativo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={plan.active}
                        onChange={(e) => {
                          const updated = [...editablePlans];
                          updated[idx] = { ...plan, active: e.target.checked };
                          setEditablePlans(updated);
                        }}
                        className="rounded accent-cyan-400"
                      />
                      <span>Plano Ativo no Site</span>
                    </label>
                  </div>

                  <button
                    onClick={() => updatePlan(editablePlans[idx].id, editablePlans[idx])}
                    className="w-full py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Alterações do Plano</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROMOTIONS & COUPONS */}
        {activeTab === 'promotions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Faixa Promocional Global
              </h3>
              
              <div className="text-xs space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Headline de Conversão</label>
                  <input
                    type="text"
                    value={adminConfig.promotionsHeadline}
                    onChange={(e) => updateAdminConfig({ promotionsHeadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Texto da Oferta de Lançamento</label>
                  <textarea
                    rows={3}
                    value={adminConfig.promoBannerText}
                    onChange={(e) => updateAdminConfig({ promoBannerText: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={adminConfig.promoBannerActive}
                    onChange={(e) => updateAdminConfig({ promoBannerActive: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <span>Exibir banner promocional no topo do site</span>
                </label>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
              <h3 className="font-display font-bold text-base text-white">
                Cupons de Desconto Ativos
              </h3>

              <div className="space-y-2">
                {coupons.map((cp) => (
                  <div key={cp.code} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-cyan-300">{cp.code}</span>
                      <span className="text-slate-400 ml-2">({cp.discountPercent}% OFF)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{cp.description}</p>
                    </div>
                    <button
                      onClick={() => deleteCoupon(cp.code)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/8 space-y-3 text-xs">
                <span className="font-semibold text-slate-300 block">Criar Novo Cupom</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="CÓDIGO (ex: VIP2026)"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="p-2 bg-slate-900 border border-white/10 rounded-lg text-white uppercase font-mono"
                  />
                  <input
                    type="number"
                    placeholder="% de Desconto"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Descrição da campanha"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                />
                <button
                  onClick={() => {
                    if (!newCouponCode.trim()) return;
                    addCoupon({
                      code: newCouponCode.trim(),
                      discountPercent: parseInt(newCouponDiscount) || 10,
                      expiresAt: '2026-12-31',
                      active: true,
                      description: newCouponDesc || 'Desconto Promocional'
                    });
                    setNewCouponCode('');
                    setNewCouponDesc('');
                  }}
                  className="w-full py-2 bg-cyan-400 text-slate-950 font-bold rounded-lg hover:bg-cyan-300 transition-colors"
                >
                  Cadastrar Cupom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl p-6 rounded-2xl bg-[#090D18] border border-white/8 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Canais Oficiais de Suporte e Licenciamento
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">WhatsApp de Suporte Oficial</label>
                <input
                  type="text"
                  value={adminConfig.supportWhatsApp}
                  onChange={(e) => updateAdminConfig({ supportWhatsApp: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  value={adminConfig.supportEmail}
                  onChange={(e) => updateAdminConfig({ supportEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Telefone / Central 0800</label>
                <input
                  type="text"
                  value={adminConfig.supportPhone}
                  onChange={(e) => updateAdminConfig({ supportPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => addToast('Configurações do Master Owner salvas com sucesso!', 'success')}
                  className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold rounded-xl hover:bg-cyan-300 transition-colors"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT CONTENT WITH IMAGE UPLOADS AND DUPLICATION VALIDATION */}
      {showAddContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B0F1E] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 shadow-2xl">
            
            <div className="flex items-center justify-between mb-4 border-b border-white/8 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  CATÁLOGO STREAMING HOMOLOGADO
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-0.5">
                  {editingContentId ? 'Editar Produção do Catálogo' : 'Cadastrar Nova Produção Autorizada'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddContentModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* DUPLICATION WARNING ALERTS */}
            {(posterDupCheck.isDuplicate || bannerDupCheck.isDuplicate || logoDupCheck.isDuplicate) && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-bold">
                    ⚠️ ALERTA DE DUPLICAÇÃO DE IMAGEM DETECTADO:
                  </strong>
                  <span className="text-[11px] leading-relaxed text-amber-200/90">
                    A imagem selecionada já está associada a outra produção no catálogo (
                    {[...posterDupCheck.fieldMatches, ...bannerDupCheck.fieldMatches, ...logoDupCheck.fieldMatches].join(', ')}
                    ). Para garantir que cada título possua identidade visual exclusiva, recomendamos enviar uma arte própria.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveContent} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              
              {/* SECTION: BASIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Título Principal *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Interestelar 4K"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Formato do Conteúdo</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      const t = e.target.value as ContentType;
                      setFormType(t);
                      if (t === 'movie') setFormCategory('Filmes');
                      if (t === 'series') setFormCategory('Séries');
                      if (t === 'channel') setFormCategory('TV Ao Vivo');
                    }}
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white capitalize font-semibold"
                  >
                    <option value="movie">Filme</option>
                    <option value="series">Série</option>
                    <option value="channel">Canal TV Ao Vivo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Título Original</label>
                  <input
                    type="text"
                    value={formOriginalTitle}
                    onChange={(e) => setFormOriginalTitle(e.target.value)}
                    placeholder="Ex: Interstellar"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Classificação Indicativa</label>
                  <select
                    value={formAgeRating}
                    onChange={(e) => setFormAgeRating(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="L">Livre (L)</option>
                    <option value="10">10 anos</option>
                    <option value="12">12 anos</option>
                    <option value="14">14 anos</option>
                    <option value="16">16 anos</option>
                    <option value="18">18 anos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ano / Duração</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="2h 15m ou Ao Vivo 24h"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Gêneros (separados por vírgula)</label>
                  <input
                    type="text"
                    value={formGenres}
                    onChange={(e) => setFormGenres(e.target.value)}
                    placeholder="Ficção Científica, Ação, Drama"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Diretor / Produtora</label>
                  <input
                    type="text"
                    value={formDirector}
                    onChange={(e) => setFormDirector(e.target.value)}
                    placeholder="Ex: Ian Hubert / Blender Studio"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Elenco Principal</label>
                <input
                  type="text"
                  value={formCast}
                  onChange={(e) => setFormCast(e.target.value)}
                  placeholder="Ator 1, Ator 2, Ator 3"
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sinopse da Obra</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a obra autorizada..."
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white resize-none"
                />
              </div>

              {/* SECTION: RIGHTS & LICENSING COMPLIANCE */}
              <div className="p-4 rounded-2xl bg-[#070B16] border border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Conformidade de Direitos Autorais & Licenciamento</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Situação dos Direitos</label>
                    <select
                      value={formRightsStatus}
                      onChange={(e) => setFormRightsStatus(e.target.value as RightsStatus)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-semibold"
                    >
                      <option value="licensed">Licenciado (Pronto para Exibição)</option>
                      <option value="authorized">Transmissão Pública Autorizada</option>
                      <option value="owned">Produção Própria Pizza Cine Originals</option>
                      <option value="pending">Pendente (Sem reprodução pública)</option>
                      <option value="unavailable">Indisponível</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Disponibilidade</label>
                    <select
                      value={formAvailabilityStatus}
                      onChange={(e) => setFormAvailabilityStatus(e.target.value as AvailabilityStatus)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-semibold"
                    >
                      <option value="available">Disponível Imediatamente</option>
                      <option value="coming_soon">Em Breve (Lançamento)</option>
                      <option value="licensed">Licenciado em Processamento</option>
                      <option value="metadata_only">Apenas Metadados</option>
                      <option value="unavailable">Indisponível</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Distribuidora / Titular</label>
                    <input
                      type="text"
                      value={formDistributor}
                      onChange={(e) => setFormDistributor(e.target.value)}
                      placeholder="Ex: Blender Foundation"
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Vigência Inicial</label>
                    <input
                      type="date"
                      value={formAvailabilityStart}
                      onChange={(e) => setFormAvailabilityStart(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Notas da Licença / Contrato</label>
                  <input
                    type="text"
                    value={formLicenseNotes}
                    onChange={(e) => setFormLicenseNotes(e.target.value)}
                    placeholder="Ex: Licença Creative Commons Attribution CC-BY com direitos de transmissão digital"
                    className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* SECTION: IMAGES & ARTWORK (UPLOAD FROM DEVICE + URL INPUT) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    Identidade Visual Própria (Upload ou URL)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Cada título deve ter sua capa individual
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Poster / Capa (2:3) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <label className="block text-slate-300 font-semibold">
                      Capa / Pôster Proporcional (2:3)
                    </label>
                    <input
                      type="text"
                      value={formPosterUrl}
                      onChange={(e) => setFormPosterUrl(e.target.value)}
                      placeholder="URL ou arquivo do dispositivo..."
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono text-[11px]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <label className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer border border-cyan-500/20 flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Carregar do Dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'poster')}
                        />
                      </label>
                      {formPosterUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Imagem carregada</span>
                      )}
                    </div>
                  </div>

                  {/* Banner / Backdrop (16:9) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <label className="block text-slate-300 font-semibold">
                      Backdrop / Banner Panorâmico (16:9)
                    </label>
                    <input
                      type="text"
                      value={formBannerUrl}
                      onChange={(e) => setFormBannerUrl(e.target.value)}
                      placeholder="URL ou arquivo do dispositivo..."
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono text-[11px]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <label className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer border border-cyan-500/20 flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Carregar do Dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'banner')}
                        />
                      </label>
                      {formBannerUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Banner carregado</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* If TV channel, show Logo upload */}
                {formType === 'channel' && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5 mt-2">
                    <label className="block text-slate-300 font-semibold">
                      Logo Oficial do Canal (1:1 Quadrado)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formLogoUrl}
                        onChange={(e) => setFormLogoUrl(e.target.value)}
                        placeholder="URL do logo do canal..."
                        className="flex-1 p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono text-[11px]"
                      />
                      <label className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold cursor-pointer border border-cyan-500/20 flex items-center gap-1 shrink-0">
                        <Upload className="w-3 h-3" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* STREAM / PLAYBACK SOURCE */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Fonte de Reprodução Autorizada / Stream HLS ou MP4
                </label>
                <input
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://servidor-autorizado.com/stream.mp4"
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px]"
                />
              </div>

              {/* SERIES SEASONS & EPISODES BUILDER */}
              {formType === 'series' && (
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      Gerenciador de Temporadas e Episódios
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newSeasonNum = seriesSeasons.length + 1;
                        setSeriesSeasons([
                          ...seriesSeasons,
                          {
                            seasonNumber: newSeasonNum,
                            title: `Temporada ${newSeasonNum}`,
                            episodes: [
                              {
                                id: `ep-${newSeasonNum}-1`,
                                seasonNumber: newSeasonNum,
                                episodeNumber: 1,
                                title: `Episódio 1 da Temporada ${newSeasonNum}`,
                                description: 'Sinopse do episódio...',
                                duration: '45m',
                                thumbnailUrl: '',
                                streamUrl: ''
                              }
                            ]
                          }
                        ]);
                      }}
                      className="px-2.5 py-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar Temporada</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {seriesSeasons.map((season, sIdx) => (
                      <div key={season.seasonNumber} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{season.title} ({season.episodes.length} episódios)</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newEpNum = season.episodes.length + 1;
                              const updated = [...seriesSeasons];
                              updated[sIdx].episodes.push({
                                id: `ep-${season.seasonNumber}-${newEpNum}`,
                                seasonNumber: season.seasonNumber,
                                episodeNumber: newEpNum,
                                title: `Episódio ${newEpNum}`,
                                description: 'Sinopse...',
                                duration: '45m',
                                thumbnailUrl: '',
                                streamUrl: ''
                              });
                              setSeriesSeasons(updated);
                            }}
                            className="text-cyan-400 hover:underline text-[11px]"
                          >
                            + Novo Episódio
                          </button>
                        </div>

                        {season.episodes.map((ep, eIdx) => (
                          <div key={ep.id} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block">Título do Ep {ep.episodeNumber}</label>
                              <input
                                type="text"
                                value={ep.title}
                                onChange={(e) => {
                                  const updated = [...seriesSeasons];
                                  updated[sIdx].episodes[eIdx].title = e.target.value;
                                  setSeriesSeasons(updated);
                                }}
                                className="w-full p-1.5 bg-black/40 border border-white/10 rounded text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block">Duração (ex: 45m)</label>
                              <input
                                type="text"
                                value={ep.duration}
                                onChange={(e) => {
                                  const updated = [...seriesSeasons];
                                  updated[sIdx].episodes[eIdx].duration = e.target.value;
                                  setSeriesSeasons(updated);
                                }}
                                className="w-full p-1.5 bg-black/40 border border-white/10 rounded text-xs text-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block">Miniatura do Episódio</label>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  value={ep.thumbnailUrl}
                                  placeholder="URL ou arquivo..."
                                  onChange={(e) => {
                                    const updated = [...seriesSeasons];
                                    updated[sIdx].episodes[eIdx].thumbnailUrl = e.target.value;
                                    setSeriesSeasons(updated);
                                  }}
                                  className="flex-1 p-1.5 bg-black/40 border border-white/10 rounded text-[11px] text-white font-mono"
                                />
                                <label className="px-2 py-1 bg-slate-800 rounded text-[10px] text-cyan-300 font-semibold cursor-pointer">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, { seasonIndex: sIdx, episodeIndex: eIdx })}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROMOTIONAL & VISIBILITY TOGGLES */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <span>Destacar no Hero Principal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTrending}
                    onChange={(e) => setFormTrending(e.target.checked)}
                    className="accent-red-400"
                  />
                  <span>Adicionar a "🔥 Em Alta"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNewRelease}
                    onChange={(e) => setFormNewRelease(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <span>Adicionar a "🆕 Lançamentos"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTopWatched}
                    onChange={(e) => setFormTopWatched(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Adicionar a "⭐ Mais Assistidos"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHidden}
                    onChange={(e) => setFormHidden(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Ocultar temporariamente da vitrine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-purple-300">
                  <input
                    type="checkbox"
                    checked={formIsDemo}
                    onChange={(e) => setFormIsDemo(e.target.checked)}
                    className="accent-purple-400"
                  />
                  <span>Marcar como Registro Demonstrativo (DEMO)</span>
                </label>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setShowAddContentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold rounded-xl hover:from-cyan-300 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Salvar Produção no Catálogo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
