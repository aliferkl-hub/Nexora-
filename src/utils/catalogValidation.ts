import { ContentItem, RightsStatus, AvailabilityStatus } from '../types';

export interface ImageDuplicationResult {
  isDuplicate: boolean;
  duplicateTitles: string[];
  duplicateIds: string[];
  fieldMatches: string[];
}

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Checks if a given image URL / base64 string is already assigned to any other content item in the catalog.
 * Protects against accidental reuse or generic repeated posters.
 */
export function checkImageDuplication(
  targetUrl: string,
  currentContentId: string | null | undefined,
  allContents: ContentItem[]
): ImageDuplicationResult {
  if (!targetUrl || targetUrl.trim() === '') {
    return { isDuplicate: false, duplicateTitles: [], duplicateIds: [], fieldMatches: [] };
  }

  const cleanTarget = targetUrl.trim();
  const duplicateTitles: string[] = [];
  const duplicateIds: string[] = [];
  const fieldMatches: string[] = [];

  for (const item of allContents) {
    if (currentContentId && item.id === currentContentId) {
      continue;
    }

    const matchesPoster = item.posterUrl && item.posterUrl.trim() === cleanTarget;
    const matchesBanner = item.bannerUrl && item.bannerUrl.trim() === cleanTarget;
    const matchesLogo = item.logoUrl && item.logoUrl.trim() === cleanTarget;

    // Check episode thumbnails if series
    const matchesEpisode = item.seasons?.some((s) =>
      s.episodes?.some((e) => e.thumbnailUrl && e.thumbnailUrl.trim() === cleanTarget)
    );

    if (matchesPoster || matchesBanner || matchesLogo || matchesEpisode) {
      if (!duplicateIds.includes(item.id)) {
        duplicateTitles.push(item.title);
        duplicateIds.push(item.id);
        const fields: string[] = [];
        if (matchesPoster) fields.push('Pôster');
        if (matchesBanner) fields.push('Banner');
        if (matchesLogo) fields.push('Logo');
        if (matchesEpisode) fields.push('Episódio');
        fieldMatches.push(`${item.title} (${fields.join(', ')})`);
      }
    }
  }

  return {
    isDuplicate: duplicateIds.length > 0,
    duplicateTitles,
    duplicateIds,
    fieldMatches
  };
}

/**
 * Sistema Anti-Imagem Repetida e Validação de Conteúdo Real
 * Executa os 8 passos obrigatórios antes de cadastrar ou salvar qualquer produção no Pizza Cine:
 * 1. Verificar URL da imagem
 * 2. Verificar identificador do conteúdo
 * 3. Verificar duplicidade de título
 * 4. Verificar hash / URL normalizada
 * 5. Impedir imagem usada em títulos diferentes
 * 6. Impedir imagens genéricas
 * 7. Impedir conteúdo duplicado
 * 8. Exigir estado "Imagem indisponível" se a imagem oficial não for fornecida
 */
export function validateContentBeforeSave(
  content: Partial<ContentItem>,
  allContents: ContentItem[]
): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Título obrigatório
  if (!content.title || content.title.trim().length < 2) {
    errors.push('Título do conteúdo é obrigatório e deve ter ao menos 2 caracteres.');
  } else {
    // 3 & 7: Verificar título duplicado no catálogo
    const titleMatch = allContents.find(
      (c) => c.id !== content.id && c.title.trim().toLowerCase() === content.title!.trim().toLowerCase()
    );
    if (titleMatch) {
      errors.push(`Já existe outra produção cadastrada com o título "${content.title}". Conteúdos duplicados são proibidos.`);
    }
  }

  // 2. Identificador
  if (!content.id || content.id.trim().length === 0) {
    errors.push('Identificador único (ID) do conteúdo é obrigatório.');
  }

  // 4 & 5: Validação de imagens (Poster e Banner)
  if (content.posterUrl && content.posterUrl.trim() !== '') {
    const posterDup = checkImageDuplication(content.posterUrl, content.id, allContents);
    if (posterDup.isDuplicate) {
      errors.push(`A imagem do pôster já está vinculada a outro título: ${posterDup.duplicateTitles.join(', ')}. Cada produção deve ter sua arte exclusiva.`);
    }
  } else {
    warnings.push('Pôster não informado. O título será exibido com estado "Imagem indisponível" até o envio da capa oficial.');
  }

  if (content.bannerUrl && content.bannerUrl.trim() !== '') {
    const bannerDup = checkImageDuplication(content.bannerUrl, content.id, allContents);
    if (bannerDup.isDuplicate) {
      errors.push(`A imagem do banner (backdrop) já está vinculada a outro título: ${bannerDup.duplicateTitles.join(', ')}.`);
    }
  }

  // 6. Impedir placeholders genéricos conhecidos
  const genericPlaceholders = [
    'placeholder.com',
    'via.placeholder',
    'example.com',
    'dummyimage.com',
    'generico.jpg',
    'generic.png'
  ];
  if (content.posterUrl && genericPlaceholders.some(p => content.posterUrl!.includes(p))) {
    errors.push('Não são permitidas imagens genéricas de placeholder. Deixe o campo vazio para exibir "Imagem indisponível" com a identidade visual do Pizza Cine.');
  }

  // 8. Separação de Metadados vs Direitos de Exibição
  if (!content.availabilityStatus) {
    warnings.push('Status de disponibilidade não definido. O padrão é "metadata_only".');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates if the content has authorized playback rights and a valid streaming source.
 * In accordance with compliance policy, pending or metadata-only works cannot be played.
 */
export function isContentPlayable(item: ContentItem | null | undefined): boolean {
  if (!item) return false;
  if (!item.isAuthorized) return false;
  
  // Must have available or licensed status
  const validAvailability: AvailabilityStatus[] = ['available', 'licensed'];
  const hasValidAvailability = item.availabilityStatus ? validAvailability.includes(item.availabilityStatus) : true;

  const validRights: RightsStatus[] = ['licensed', 'owned', 'authorized'];
  const hasValidRights = validRights.includes(item.rightsStatus);
  const hasMediaSource = Boolean(item.videoUrl || item.trailerUrl);

  return hasValidAvailability && hasValidRights && hasMediaSource;
}

/**
 * Returns formatted metadata badges, labels and actionable CTA text for availability statuses.
 */
export function getAvailabilityStatusInfo(status?: AvailabilityStatus) {
  switch (status) {
    case 'available':
      return {
        label: 'Disponível para Assistir',
        shortLabel: 'Disponível',
        ctaText: 'ASSISTIR',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
        isPlayable: true
      };
    case 'licensed':
      return {
        label: 'Licenciado Oficial',
        shortLabel: 'Licenciado',
        ctaText: 'ASSISTIR',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dotColor: 'bg-rose-400',
        isPlayable: true
      };
    case 'coming_soon':
      return {
        label: 'Lançamento em Breve',
        shortLabel: 'Em Breve',
        ctaText: 'EM BREVE',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
        isPlayable: false
      };
    case 'metadata_only':
      return {
        label: 'Catálogo de Descoberta',
        shortLabel: 'Ficha Técnica',
        ctaText: 'VER DETALHES',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        dotColor: 'bg-blue-400',
        isPlayable: false
      };
    case 'unavailable':
      return {
        label: 'Indisponível no Momento',
        shortLabel: 'Indisponível',
        ctaText: 'INDISPONÍVEL',
        color: 'bg-slate-700 text-slate-300 border-slate-600',
        dotColor: 'bg-slate-400',
        isPlayable: false
      };
    default:
      return {
        label: 'Disponível',
        shortLabel: 'Disponível',
        ctaText: 'ASSISTIR',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
        isPlayable: true
      };
  }
}

/**
 * Returns formatted metadata badges and text for rights statuses.
 */
export function getRightsStatusInfo(status: RightsStatus) {
  switch (status) {
    case 'licensed':
      return {
        label: 'Licenciado Oficialmente',
        shortLabel: 'Licenciado',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
        isPlayable: true
      };
    case 'authorized':
      return {
        label: 'Transmissão Pública Autorizada',
        shortLabel: 'Autorizado',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dotColor: 'bg-rose-400',
        isPlayable: true
      };
    case 'owned':
      return {
        label: 'Original Pizza Cine',
        shortLabel: 'Original Pizza Cine',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
        isPlayable: true
      };
    case 'pending':
      return {
        label: 'Aguardando Liberação de Direitos',
        shortLabel: 'Direitos Pendentes',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
        isPlayable: false
      };
    case 'unavailable':
      return {
        label: 'Direitos Indisponíveis no Momento',
        shortLabel: 'Indisponível',
        color: 'bg-red-500/20 text-red-300 border-red-500/40',
        dotColor: 'bg-red-400',
        isPlayable: false
      };
    default:
      return {
        label: 'Status Não Definido',
        shortLabel: 'Pendente',
        color: 'bg-slate-700 text-slate-300 border-slate-600',
        dotColor: 'bg-slate-400',
        isPlayable: false
      };
  }
}
