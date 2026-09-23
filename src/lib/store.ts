import { INITIAL_PROJECTS, SERVICES, TESTIMONIALS, normalizeSettings } from './data';

export interface StoreMediaItem {
  id: string;
  url: string;
  posterUrl?: string | null;
  storageKey?: string | null;
  storageBucket?: string | null;
  storageProvider: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  isVideo: boolean;
  title: string;
  description?: string | null;
  category: string;
  tags: string[];
  projectId?: string | null;
  altText?: string | null;
  location?: string | null;
  featured: boolean;
  status: string;
  order: number;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  uploadedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  client?: string;
  year: number;
  location: string;
  coverImage: string;
  videoUrl?: string;
  duration?: string;
  isVideo: boolean;
  featured: boolean;
  status: string;
  order: number;
  gallery: string[];
  deliverables: string[];
  gearUsed: string[];
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreService {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  startingPrice: string;
  deliverables: string[];
  timeline: string;
  order: number;
  status: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreTestimonial {
  id: string;
  clientName: string;
  roleOrEvent: string;
  comment: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  order: number;
  status: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  beforeValues?: any;
  afterValues?: any;
  metadata?: any;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  createdAt: string;
}

export interface StoreRevision {
  id: string;
  settingId?: string;
  settingKey: string;
  value: any;
  version: number;
  changeReason?: string | null;
  createdById?: string | null;
  createdAt: string;
}

interface AimStore {
  settings: Record<string, any>;
  media: StoreMediaItem[];
  projects: StoreProject[];
  services: StoreService[];
  testimonials: StoreTestimonial[];
  inquiries: any[];
  auditLogs: StoreAuditLog[];
  settingRevisions: Record<string, StoreRevision[]>;
}

const DEFAULT_SETTINGS: Record<string, any> = {
  site_logo: '/logo.png',
  brand_name: 'Aim Images HD',
  brand_tagline: 'Where Light Meets Timeless Storytelling',
  hero_headline: 'Where Light Meets Timeless Storytelling',
  hero_subheadline:
    'Aim Images HD crafts breathtaking wedding documentaries, high-fashion editorial campaigns, and cinematic commercial films across the globe.',
  booking_status: 'Bookings Open',
  contact_phone: '+256 764 709 563',
  contact_whatsapp: '+256 764 709 563',
  contact_email: 'aimugimages@gmail.com',
  studio_address: 'Rugarama Road, Kabale, Uganda',
  google_maps_url: 'https://maps.google.com/?q=Rugarama+Road,+Kabale,+Uganda',
  instagram_url: 'https://instagram.com/aimimages_hd_photography',
  youtube_url: 'https://youtube.com/@AimImagesphotography',
  vimeo_url: 'https://vimeo.com/aimimages',
  seo_title: 'Aim Images HD | Luxury Wedding Cinema & Haute Couture Photography',
  seo_description:
    'Aim Images HD is an internationally recognized visual media studio based in Kabale, Uganda, crafting high-end wedding documentaries and editorial campaigns worldwide.',
};

const INITIAL_MEDIA_ITEMS: StoreMediaItem[] = [
  {
    id: 'media-1',
    title: 'Aura & Silk Haute Couture Lookbook',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    storageKey: 'defaults/aura-silk.jpg',
    storageProvider: 'LOCAL',
    filename: 'aura-silk.jpg',
    originalName: 'aura-silk.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 450,
    isVideo: false,
    featured: true,
    status: 'PUBLISHED',
    order: 1,
    location: 'Paris, France',
    altText: 'Haute couture editorial fashion model in sculptural silk gown',
    tags: ['fashion', 'paris', 'editorial', 'haute-couture'],
    description: 'Mastered lookbook campaign captured for Maison Éthérée Paris.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'media-2',
    title: 'The Riviera Vows: Elena & Marc Master Still',
    category: 'Weddings',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    storageKey: 'defaults/riviera-vows.jpg',
    storageProvider: 'LOCAL',
    filename: 'riviera-vows.jpg',
    originalName: 'riviera-vows.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 520,
    isVideo: false,
    featured: true,
    status: 'PUBLISHED',
    order: 2,
    location: 'Amalfi Coast, Italy',
    altText: 'Bride and groom walking along coastal terrace during golden hour',
    tags: ['wedding', 'amalfi', 'italy', 'destination-wedding'],
    description: 'Golden hour master portrait overlooking the Mediterranean sea.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'media-3',
    title: 'Kigezi Highlands Lake Bunyonyi Aerial',
    category: 'Documentary',
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop',
    storageKey: 'defaults/bunyonyi.jpg',
    storageProvider: 'LOCAL',
    filename: 'bunyonyi.jpg',
    originalName: 'bunyonyi.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024 * 610,
    isVideo: false,
    featured: true,
    status: 'PUBLISHED',
    order: 3,
    location: 'Kabale, Uganda',
    altText: 'Misty islands across Lake Bunyonyi at dawn',
    tags: ['documentary', 'uganda', 'kabale', 'bunyonyi', 'landscape'],
    description: 'High-altitude landscape documentary capturing the mystical morning mists of southwestern Uganda.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'media-4',
    title: 'Chronos Horlogerie Commercial 4K Reel',
    category: 'Commercial',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    storageKey: 'defaults/chronos-reel.mp4',
    storageProvider: 'LOCAL',
    filename: 'chronos-reel.mp4',
    originalName: 'chronos-reel.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 1024 * 1024 * 12,
    isVideo: true,
    duration: 90,
    featured: true,
    status: 'PUBLISHED',
    order: 4,
    location: 'Geneva, Switzerland',
    altText: 'Close up of luxury watch movement assembly in Geneva studio',
    tags: ['commercial', 'cinema', 'video', 'luxury', 'watch'],
    description: 'Global 4K TV commercial spot showcasing artisanal watchmaking.',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __aim_store: AimStore | undefined;
}

function getStore(): AimStore {
  if (!globalThis.__aim_store) {
    const initialProjects: StoreProject[] = INITIAL_PROJECTS.map((p, idx) => ({
      ...p,
      status: 'PUBLISHED',
      order: idx + 1,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const initialServices: StoreService[] = SERVICES.map((s, idx) => ({
      ...s,
      status: 'PUBLISHED',
      order: s.order || idx + 1,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const initialTestimonials: StoreTestimonial[] = TESTIMONIALS.map((t, idx) => ({
      ...t,
      status: 'PUBLISHED',
      order: idx + 1,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const initialRevisions: Record<string, StoreRevision[]> = {
      booking_status: [
        {
          id: 'rev-init-1',
          settingKey: 'booking_status',
          value: 'Bookings Open',
          version: 1,
          changeReason: 'Initial Studio Setup',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const initialAudit: StoreAuditLog = {
      id: 'audit-init-1',
      action: 'CREATE',
      entityType: 'SiteSetting',
      entityTitle: 'Studio Platform Initialized',
      userId: null,
      userName: 'Aim Images Director',
      userEmail: 'admin@aimimages.com',
      userRole: 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    };

    globalThis.__aim_store = {
      settings: { ...DEFAULT_SETTINGS },
      media: [...INITIAL_MEDIA_ITEMS],
      projects: initialProjects,
      services: initialServices,
      testimonials: initialTestimonials,
      inquiries: [
        {
          id: 'enq-1',
          name: 'Victoria & Alexander Stirling',
          email: 'victoria.stirling@estate.co.uk',
          phone: '+44 7700 900123',
          service: 'Luxury Wedding Cinema & Photography',
          eventDate: '2025-06-14',
          budgetRange: '$10,000 - $25,000',
          message:
            'Planning our 3-day wedding celebration at Villa d\'Este, Lake Como. Looking for multi-cam 4K cinema and fine art stills.',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'enq-2',
          name: 'Julian Moreau',
          email: 'j.moreau@vogue-edition.fr',
          phone: '+33 6 12 34 56 78',
          service: 'High Fashion & Editorial Campaigns',
          eventDate: '2025-04-20',
          budgetRange: '$5,000 - $10,000',
          message:
            'Spring/Summer Haute Couture collection lookbook in Paris. Studio and outdoor architectural locations.',
          status: 'REVIEWED',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      auditLogs: [initialAudit],
      settingRevisions: initialRevisions,
    };
  }
  return globalThis.__aim_store;
}

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export function getStoreSettings(): Record<string, any> {
  const store = getStore();
  return normalizeSettings(store.settings, DEFAULT_SETTINGS);
}

export function setStoreSetting(key: string, value: any, label?: string, reason?: string, actor?: any) {
  const store = getStore();
  const before = store.settings[key];
  store.settings[key] = value;

  // Add revision
  if (!store.settingRevisions[key]) {
    store.settingRevisions[key] = [];
  }
  const version = store.settingRevisions[key].length + 1;
  const rev: StoreRevision = {
    id: `rev-${Date.now()}-${version}`,
    settingKey: key,
    value,
    version,
    changeReason: reason || `Updated ${label || key} from dashboard`,
    createdById: actor?.id !== 'superadmin-fallback' ? actor?.id : null,
    createdAt: new Date().toISOString(),
  };
  store.settingRevisions[key].unshift(rev);

  // Add audit log
  store.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    action: 'SETTINGS_CHANGE',
    entityType: 'SiteSetting',
    entityTitle: label || key,
    beforeValues: before,
    afterValues: value,
    userId: actor?.id !== 'superadmin-fallback' ? actor?.id : null,
    userName: actor?.name || 'Aim Images Director',
    userEmail: actor?.email || 'admin@aimimages.com',
    userRole: actor?.role || 'SUPERADMIN',
    createdAt: new Date().toISOString(),
  });

  return { key, value, label };
}

export function getStoreRevisions(key: string): StoreRevision[] {
  const store = getStore();
  return store.settingRevisions[key] || [];
}

export function rollbackStoreRevision(key: string, version: number) {
  const store = getStore();
  const revs = store.settingRevisions[key] || [];
  const target = revs.find((r) => r.version === version);
  if (target) {
    store.settings[key] = target.value;
    return target;
  }
  return null;
}

// -------------------------------------------------------------
// MEDIA
// -------------------------------------------------------------
export function getStoreMedia(filters?: { search?: string; category?: string; type?: string; status?: string }) {
  const store = getStore();
  let items = store.media.filter((m) => !m.isDeleted);

  if (filters?.category && filters.category !== 'ALL') {
    items = items.filter((m) => m.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.type && filters.type !== 'all') {
    const isVideo = filters.type === 'video';
    items = items.filter((m) => m.isVideo === isVideo);
  }

  if (filters?.status && filters.status !== 'ALL') {
    items = items.filter((m) => m.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return items;
}

export function addStoreMedia(item: Omit<StoreMediaItem, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): StoreMediaItem {
  const store = getStore();
  const newItem: StoreMediaItem = {
    ...item,
    id: `media-${Date.now()}`,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.media.unshift(newItem);
  return newItem;
}

export function updateStoreMedia(id: string, updates: Partial<StoreMediaItem>): StoreMediaItem | null {
  const store = getStore();
  const idx = store.media.findIndex((m) => m.id === id);
  if (idx !== -1) {
    store.media[idx] = { ...store.media[idx], ...updates, updatedAt: new Date().toISOString() };
    return store.media[idx];
  }
  return null;
}

export function softDeleteStoreMedia(id: string, actor?: any): boolean {
  const store = getStore();
  const item = store.media.find((m) => m.id === id);
  if (item) {
    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();
    item.deletedBy = actor?.email || 'admin@aimimages.com';

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SOFT_DELETE',
      entityType: 'MediaItem',
      entityId: id,
      entityTitle: item.title,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// PROJECTS
// -------------------------------------------------------------
export function getStoreProjects(filters?: { category?: string; status?: string; search?: string }) {
  const store = getStore();
  let items = store.projects.filter((p) => !p.isDeleted);

  if (filters?.category && filters.category !== 'ALL') {
    items = items.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters?.status && filters.status !== 'ALL') {
    items = items.filter((p) => p.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }
  return items;
}

export function addStoreProject(data: Partial<StoreProject>): StoreProject {
  const store = getStore();
  const newProj: StoreProject = {
    id: `proj-${Date.now()}`,
    title: data.title || 'Untitled Project',
    slug: (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category || 'Weddings',
    description: data.description || '',
    client: data.client || '',
    year: data.year || new Date().getFullYear(),
    location: data.location || 'Kabale, Uganda',
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
    videoUrl: data.videoUrl || '',
    duration: data.duration || '',
    isVideo: Boolean(data.isVideo),
    featured: Boolean(data.featured),
    status: data.status || 'PUBLISHED',
    order: store.projects.length + 1,
    gallery: data.gallery || [data.coverImage || ''],
    deliverables: data.deliverables || [],
    gearUsed: data.gearUsed || [],
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.projects.unshift(newProj);
  return newProj;
}

export function updateStoreProject(id: string, updates: Partial<StoreProject>): StoreProject | null {
  const store = getStore();
  const idx = store.projects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    store.projects[idx] = { ...store.projects[idx], ...updates, updatedAt: new Date().toISOString() };
    return store.projects[idx];
  }
  return null;
}

export function softDeleteStoreProject(id: string, actor?: any): boolean {
  const store = getStore();
  const item = store.projects.find((p) => p.id === id);
  if (item) {
    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();
    item.deletedBy = actor?.email || 'admin@aimimages.com';

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SOFT_DELETE',
      entityType: 'Project',
      entityId: id,
      entityTitle: item.title,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------
export function getStoreServices() {
  const store = getStore();
  return store.services.filter((s) => !s.isDeleted);
}

export function addStoreService(data: Partial<StoreService>): StoreService {
  const store = getStore();
  const newService: StoreService = {
    id: `srv-${Date.now()}`,
    title: data.title || 'Untitled Service',
    slug: (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    tagline: data.tagline || '',
    description: data.description || '',
    icon: data.icon || 'Camera',
    startingPrice: data.startingPrice || '$2,500',
    deliverables: data.deliverables || [],
    timeline: data.timeline || '2 - 3 Weeks',
    order: data.order !== undefined ? data.order : store.services.length + 1,
    status: data.status || 'PUBLISHED',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.services.push(newService);
  return newService;
}

export function updateStoreService(id: string, updates: Partial<StoreService>): StoreService | null {
  const store = getStore();
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx !== -1) {
    store.services[idx] = { ...store.services[idx], ...updates, updatedAt: new Date().toISOString() };
    return store.services[idx];
  }
  return null;
}

export function softDeleteStoreService(id: string, actor?: any): boolean {
  const store = getStore();
  const item = store.services.find((s) => s.id === id);
  if (item) {
    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();
    item.deletedBy = actor?.email || 'admin@aimimages.com';

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SOFT_DELETE',
      entityType: 'Service',
      entityId: id,
      entityTitle: item.title,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// TESTIMONIALS
// -------------------------------------------------------------
export function getStoreTestimonials() {
  const store = getStore();
  return store.testimonials.filter((t) => !t.isDeleted);
}

export function addStoreTestimonial(data: Partial<StoreTestimonial>): StoreTestimonial {
  const store = getStore();
  const newT: StoreTestimonial = {
    id: `test-${Date.now()}`,
    clientName: data.clientName || 'Anonymous Client',
    roleOrEvent: data.roleOrEvent || 'Wedding Commission',
    comment: data.comment || '',
    rating: data.rating || 5,
    avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    featured: Boolean(data.featured),
    order: store.testimonials.length + 1,
    status: data.status || 'PUBLISHED',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.testimonials.unshift(newT);
  return newT;
}

export function updateStoreTestimonial(id: string, updates: Partial<StoreTestimonial>): StoreTestimonial | null {
  const store = getStore();
  const idx = store.testimonials.findIndex((t) => t.id === id);
  if (idx !== -1) {
    store.testimonials[idx] = { ...store.testimonials[idx], ...updates, updatedAt: new Date().toISOString() };
    return store.testimonials[idx];
  }
  return null;
}

export function softDeleteStoreTestimonial(id: string, actor?: any): boolean {
  const store = getStore();
  const item = store.testimonials.find((t) => t.id === id);
  if (item) {
    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();
    item.deletedBy = actor?.email || 'admin@aimimages.com';

    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'SOFT_DELETE',
      entityType: 'Testimonial',
      entityId: id,
      entityTitle: item.clientName,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// TRASH & RECOVERY
// -------------------------------------------------------------
export function getStoreTrash() {
  const store = getStore();
  const deletedMedia = store.media.filter((m) => m.isDeleted).map((m) => ({ ...m, itemType: 'Media' as const }));
  const deletedProjects = store.projects.filter((p) => p.isDeleted).map((p) => ({ ...p, itemType: 'Project' as const }));
  const deletedServices = store.services.filter((s) => s.isDeleted).map((s) => ({ ...s, itemType: 'Service' as const }));
  const deletedTestimonials = store.testimonials
    .filter((t) => t.isDeleted)
    .map((t) => ({ ...t, title: t.clientName, itemType: 'Testimonial' as const }));

  return [...deletedMedia, ...deletedProjects, ...deletedServices, ...deletedTestimonials].sort((a, b) => {
    const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
    const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
    return dateB - dateA;
  });
}

export function restoreStoreItem(entityType: string, id: string, actor?: any) {
  const store = getStore();
  let title = '';

  if (entityType === 'Media' || entityType === 'MediaItem') {
    const m = store.media.find((item) => item.id === id);
    if (m) {
      m.isDeleted = false;
      m.deletedAt = null;
      m.deletedBy = null;
      m.status = 'PUBLISHED';
      title = m.title;
    }
  } else if (entityType === 'Project') {
    const p = store.projects.find((item) => item.id === id);
    if (p) {
      p.isDeleted = false;
      p.deletedAt = null;
      p.deletedBy = null;
      p.status = 'PUBLISHED';
      title = p.title;
    }
  } else if (entityType === 'Service') {
    const s = store.services.find((item) => item.id === id);
    if (s) {
      s.isDeleted = false;
      s.deletedAt = null;
      s.deletedBy = null;
      s.status = 'PUBLISHED';
      title = s.title;
    }
  } else if (entityType === 'Testimonial') {
    const t = store.testimonials.find((item) => item.id === id);
    if (t) {
      t.isDeleted = false;
      t.deletedAt = null;
      t.deletedBy = null;
      t.status = 'PUBLISHED';
      title = t.clientName;
    }
  }

  if (title) {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'RESTORE',
      entityType,
      entityId: id,
      entityTitle: title,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

export function purgeStoreItem(entityType: string, id: string, actor?: any) {
  const store = getStore();
  let title = '';

  if (entityType === 'Media' || entityType === 'MediaItem') {
    const idx = store.media.findIndex((item) => item.id === id);
    if (idx !== -1) {
      title = store.media[idx].title;
      store.media.splice(idx, 1);
    }
  } else if (entityType === 'Project') {
    const idx = store.projects.findIndex((item) => item.id === id);
    if (idx !== -1) {
      title = store.projects[idx].title;
      store.projects.splice(idx, 1);
    }
  } else if (entityType === 'Service') {
    const idx = store.services.findIndex((item) => item.id === id);
    if (idx !== -1) {
      title = store.services[idx].title;
      store.services.splice(idx, 1);
    }
  } else if (entityType === 'Testimonial') {
    const idx = store.testimonials.findIndex((item) => item.id === id);
    if (idx !== -1) {
      title = store.testimonials[idx].clientName;
      store.testimonials.splice(idx, 1);
    }
  }

  if (title) {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: 'PERMANENT_DELETE',
      entityType,
      entityId: id,
      entityTitle: title,
      userName: actor?.name || 'Aim Images Director',
      userEmail: actor?.email || 'admin@aimimages.com',
      userRole: actor?.role || 'SUPERADMIN',
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// AUDIT LOGS
// -------------------------------------------------------------
export function getStoreAuditLogs() {
  const store = getStore();
  return store.auditLogs;
}

export function addStoreAuditLog(entry: Omit<StoreAuditLog, 'id' | 'createdAt'>) {
  const store = getStore();
  const log: StoreAuditLog = {
    ...entry,
    id: `audit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.auditLogs.unshift(log);
  return log;
}
