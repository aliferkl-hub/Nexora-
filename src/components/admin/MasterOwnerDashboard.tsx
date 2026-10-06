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
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem, PlanConfig, AgeRating, ContentType, Season, Episode, ChannelProgram } from '../../types';

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
    addToast
  } = useApp();

  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'content' | 'import_sync' | 'pricing' | 'promotions' | 'settings'>('metrics');

  // Filter in content management
  const [contentFilterType, setContentFilterType] = useState<'all' | 'movie' | 'series' | 'channel'>('all');

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
  const [formTrailerUrl, setFormTrailerUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formDirector, setFormDirector] = useState('');
  const [formCast, setFormCast] = useState('');
  const [formChannelNumber, setFormChannelNumber] = useState('01');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTrending, setFormTrending] = useState(false);
  const [formNewRelease, setFormNewRelease] = useState(false);
  const [formHidden, setFormHidden] = useState(false);

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
              Área de controle administrativo da NEXORA PLAY. Digite sua credencial Master.
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
                placeholder="Digite a senha (padrão: nexora2026)"
                className="w-full px-4 py-3 text-sm bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
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
      bannerUrl: formBannerUrl || '/src/assets/images/hero_cinematic_space_1791309241143.jpg',
      posterUrl: formPosterUrl || formBannerUrl || '/src/assets/images/hero_cinematic_space_1791309241143.jpg',
      trailerUrl: formTrailerUrl,
      videoUrl: formVideoUrl,
      director: formDirector,
      cast: formCast.split(',').map((c) => c.trim()).filter(Boolean),
      channelNumber: formType === 'channel' ? formChannelNumber : undefined,
      isAuthorized: true,
      featured: formFeatured,
      isTrending: formTrending,
      isNewRelease: formNewRelease,
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
    setFormTrailerUrl('');
    setFormVideoUrl('');
    setFormDirector('');
    setFormCast('');
    setFormChannelNumber('01');
    setFormFeatured(false);
    setFormTrending(false);
    setFormNewRelease(false);
    setFormHidden(false);
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
    setFormBannerUrl(item.bannerUrl);
    setFormPosterUrl(item.posterUrl);
    setFormTrailerUrl(item.trailerUrl || '');
    setFormVideoUrl(item.videoUrl || '');
    setFormDirector(item.director || '');
    setFormCast(item.cast ? item.cast.join(', ') : '');
    setFormChannelNumber(item.channelNumber || '01');
    setFormFeatured(item.featured);
    setFormTrending(item.isTrending || false);
    setFormNewRelease(item.isNewRelease || false);
    setFormHidden(item.hidden);
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

  const filteredAdminContents = contents.filter((c) => {
    if (contentFilterType === 'all') return true;
    return c.type === contentFilterType;
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
              NEXORA PLAY MANAGEMENT
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setEditingContentId(null);
                setShowAddContentModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs rounded-xl hover:from-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Conteúdo</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2.5 bg-slate-900 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-white/8">
          {[
            { id: 'metrics', label: 'Dashboard & Métricas', icon: TrendingUp },
            { id: 'content', label: 'Gerenciador de Conteúdo', icon: Film },
            { id: 'import_sync', label: 'Importação & Sincronização', icon: RefreshCw },
            { id: 'pricing', label: 'Preços & Planos', icon: DollarSign },
            { id: 'promotions', label: 'Promoções & Cupons', icon: Tag },
            { id: 'settings', label: 'Configurações Globais', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: METRICS */}
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

        {/* TAB 2: CONTENT MANAGEMENT */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Catálogo Homologado ({contents.length} produções ativas)
                </h3>
                <p className="text-xs text-slate-400">
                  Cadastre filmes, séries com temporadas/episódios e canais de TV ao vivo autorizados.
                </p>
              </div>

              {/* Format filters */}
              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'movie', label: 'Filmes' },
                  { id: 'series', label: 'Séries' },
                  { id: 'channel', label: 'Canais TV' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setContentFilterType(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      contentFilterType === f.id
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#090D18] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-900/60 border-b border-white/8">
                    <tr>
                      <th className="py-3 px-4">Produção / Título</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Gênero</th>
                      <th className="py-3 px-4">Destaques</th>
                      <th className="py-3 px-4">Visualizações</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAdminContents.map((item) => (
                      <tr key={item.id} className="text-slate-300 hover:bg-white/[0.02]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.bannerUrl}
                              alt={item.title}
                              className="w-12 h-8 rounded object-cover bg-slate-800 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-white block">{item.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.year} · {item.duration} · {item.ageRating}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize font-mono text-cyan-300">
                          {item.type === 'movie' ? 'Filme' : item.type === 'series' ? 'Série' : 'Canal TV'}
                        </td>
                        <td className="py-3 px-4">{item.genre.slice(0, 2).join(', ')}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
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
                    ))}
                  </tbody>
                </table>
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
                    placeholder='[&#10;  {&#10;    "title": "Nome da Produção",&#10;    "type": "movie",&#10;    "category": "Filmes",&#10;    "genre": ["Ação", "Drama"],&#10;    "year": 2026,&#10;    "videoUrl": "https://...",&#10;    "isAuthorized": true&#10;  }&#10;]'
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
                          const val = parseFloat(e.target.value) || 0;
                          const updated = [...editablePlans];
                          updated[idx] = { 
                            ...plan, 
                            totalPrice: val,
                            priceMonthlyEquiv: val / plan.billingPeriodMonths 
                          };
                          setEditablePlans(updated);
                        }}
                        className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Equivalente / Mês (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={plan.priceMonthlyEquiv.toFixed(2)}
                        readOnly
                        className="w-full p-2 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-400 mb-1">Texto de Destaque / Promoção</label>
                    <input
                      type="text"
                      value={plan.savingsLabel || ''}
                      onChange={(e) => {
                        const updated = [...editablePlans];
                        updated[idx] = { ...plan, savingsLabel: e.target.value };
                        setEditablePlans(updated);
                      }}
                      placeholder="Ex: ASSINE 3 MESES E GANHE 1 MÊS"
                      className="w-full p-2 bg-slate-900 border border-white/10 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs">
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

      {/* Modal: Add/Edit Real Content */}
      {showAddContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0B0F1E] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 shadow-2xl">
            <h3 className="font-display font-bold text-xl text-white mb-4">
              {editingContentId ? 'Editar Produção do Catálogo' : 'Cadastrar Nova Produção Autorizada'}
            </h3>

            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Título Principal</label>
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
                  <label className="block text-slate-400 mb-1 font-semibold">Formato</label>
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
                  <label className="block text-slate-400 mb-1">Título Original (se houver)</label>
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
                    placeholder="2h 15m ou Ao Vivo"
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
                    placeholder="Ex: Christopher Nolan"
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Elenco Principal (separados por vírgula)</label>
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
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a obra autorizada..."
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">URL Imagem Banner (16:9)</label>
                  <input
                    type="text"
                    value={formBannerUrl}
                    onChange={(e) => setFormBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">URL Imagem Capa / Pôster (2:3)</label>
                  <input
                    type="text"
                    value={formPosterUrl}
                    onChange={(e) => setFormPosterUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fonte de Reprodução Autorizada / Stream (HLS, MP4 ou Feed)</label>
                <input
                  type="text"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://servidor-autorizado.com/stream.mp4"
                  className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-[11px]"
                />
              </div>

              {/* Toggles */}
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
                    checked={formHidden}
                    onChange={(e) => setFormHidden(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Ocultar temporariamente</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setShowAddContentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold rounded-xl hover:from-cyan-300 transition-all"
                >
                  Salvar Produção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
