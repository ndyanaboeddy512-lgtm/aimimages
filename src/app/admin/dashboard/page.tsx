'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Star,
  Users,
  Settings,
  Trash2,
  History,
  Lock,
  LogOut,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Search,
  Filter,
  UploadCloud,
  RotateCcw,
  AlertTriangle,
  X,
  ChevronRight,
  RefreshCw,
  FileText,
  Video,
  Check,
  Copy,
  Save,
  ShieldCheck,
  Sparkles,
  Camera,
  AlertCircle,
  Loader2,
  ChevronDown,
  KeyRound
} from 'lucide-react';
import { INITIAL_PROJECTS, SERVICES, TESTIMONIALS, CATEGORIES } from '@/lib/data';

type TabType =
  | 'overview'
  | 'media'
  | 'projects'
  | 'services'
  | 'settings'
  | 'inquiries'
  | 'testimonials'
  | 'trash'
  | 'audit'
  | 'security';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation & User State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Aim Images Director',
    email: 'admin@aimimages.com',
    role: 'SUPERADMIN',
  });
  const [loadingUser, setLoadingUser] = useState(true);

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Overview Stats
  const [stats, setStats] = useState<any>({
    mediaCount: 18,
    projectsCount: INITIAL_PROJECTS.length,
    servicesCount: SERVICES.length,
    pendingInquiriesCount: 2,
    storageSizeFormatted: '48.2 MB',
    recentAudits: [],
  });

  // Media Library State
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState({ category: 'ALL', type: 'ALL', status: 'ALL', search: '' });
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMediaItem, setActiveMediaItem] = useState<any | null>(null);
  const [isMediaEditModalOpen, setIsMediaEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Projects State
  const [projects, setProjects] = useState<any[]>(INITIAL_PROJECTS);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Services State
  const [services, setServices] = useState<any[]>(SERVICES);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([
    {
      id: 'enq-1',
      name: 'Victoria & Alexander Stirling',
      email: 'victoria.stirling@estate.co.uk',
      phone: '+44 7700 900123',
      service: 'Luxury Wedding Cinema & Photography',
      eventDate: '2025-06-14',
      budgetRange: '$10,000 - $25,000',
      message: 'Planning our 3-day wedding celebration at Villa d\'Este, Lake Como. Looking for multi-cam 4K cinema and fine art stills.',
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
      message: 'Spring/Summer Haute Couture collection lookbook in Paris. Studio and outdoor architectural locations.',
      status: 'REVIEWED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);

  // Settings & Revisions State
  const [settings, setSettings] = useState<Record<string, any>>({
    site_logo: '/logo.png',
    brand_name: 'Aim Images HD',
    brand_tagline: 'Where Light Meets Timeless Storytelling',
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
    seo_description: 'Aim Images HD is an internationally recognized visual media studio based in Kabale, Uganda, crafting high-end wedding documentaries and editorial campaigns worldwide.',
  });
  const [changeReason, setChangeReason] = useState('');
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedSettingKey, setSelectedSettingKey] = useState<string>('booking_status');

  // Trash & Recovery State
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [purgeTarget, setPurgeTarget] = useState<any | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // Team & Security State
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'EDITOR' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 1. Initial Authentication Check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        } else {
          // Fallback check local storage
          const localAuth = localStorage.getItem('aim_admin_auth');
          if (!localAuth) {
            router.push('/admin/login');
            return;
          }
          const storedUser = localStorage.getItem('aim_admin_user');
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      } catch {
        // Fallback to local check
        const localAuth = localStorage.getItem('aim_admin_auth');
        if (!localAuth) {
          router.push('/admin/login');
        }
      } finally {
        setLoadingUser(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch Initial Data based on Active Tab
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'media') {
      fetchMedia();
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'services') {
      fetchServices();
    } else if (activeTab === 'inquiries') {
      fetchInquiries();
    } else if (activeTab === 'testimonials') {
      fetchTestimonials();
    } else if (activeTab === 'settings') {
      fetchSettings();
    } else if (activeTab === 'trash') {
      fetchTrash();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    } else if (activeTab === 'security') {
      if (currentUser?.role === 'SUPERADMIN') {
        fetchUsers();
      }
    }
  }, [activeTab, currentUser?.role]);

  // Fetch Handlers
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          mediaCount: data.metrics?.totalMedia ?? data.mediaCount ?? 0,
          projectsCount: data.metrics?.totalProjects ?? data.projectsCount ?? 0,
          servicesCount: data.metrics?.totalServices ?? data.servicesCount ?? 0,
          pendingInquiriesCount: data.metrics?.pendingEnquiries ?? data.pendingInquiriesCount ?? 0,
          storageSizeFormatted: data.metrics?.storageFormatted ?? data.storageSizeFormatted ?? '0.00 MB',
          recentAudits: data.recentAudits || [],
        });
      }
    } catch (err) {
      console.warn('Stats fetch error:', err);
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const params = new URLSearchParams();
      if (mediaFilter.category !== 'ALL') params.append('category', mediaFilter.category);
      if (mediaFilter.type !== 'ALL') params.append('type', mediaFilter.type);
      if (mediaFilter.status !== 'ALL') params.append('status', mediaFilter.status);
      if (mediaFilter.search) params.append('search', mediaFilter.search);

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.items || data.mediaItems || []);
      }
    } catch (err) {
      console.warn('Media fetch error:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      }
    } catch (err) {
      console.warn('Projects fetch error:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
      }
    } catch (err) {
      console.warn('Services fetch error:', err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries) {
          setInquiries(data.inquiries);
        }
      }
    } catch (err) {
      console.warn('Inquiries fetch error:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        if (data.testimonials) {
          setTestimonials(data.testimonials);
        }
      }
    } catch (err) {
      console.warn('Testimonials fetch error:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settingsMap && Object.keys(data.settingsMap).length > 0) {
          setSettings((prev) => ({ ...prev, ...data.settingsMap }));
        }
      }
    } catch (err) {
      console.warn('Settings fetch error:', err);
    }
  };

  const fetchRevisions = async (key: string) => {
    setSelectedSettingKey(key);
    setIsRevisionModalOpen(true);
    try {
      const res = await fetch(`/api/admin/settings/revisions?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        setRevisions(data.revisions || []);
      }
    } catch (err) {
      console.warn('Revisions fetch error:', err);
    }
  };

  const fetchTrash = async () => {
    try {
      const res = await fetch('/api/admin/trash');
      if (res.ok) {
        const data = await res.json();
        setTrashItems(data.trashItems || []);
      }
    } catch (err) {
      console.warn('Trash fetch error:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.warn('Audit logs fetch error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setTeamUsers(data.users || []);
      }
    } catch (err) {
      console.warn('Users fetch error:', err);
    }
  };

  // Media Item Save & Status Toggle
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMediaItem) return;

    try {
      const res = await fetch(`/api/admin/media/${activeMediaItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeMediaItem.title,
          category: activeMediaItem.category,
          tags: typeof activeMediaItem.tags === 'string'
            ? activeMediaItem.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : activeMediaItem.tags,
          altText: activeMediaItem.altText,
          description: activeMediaItem.description,
          location: activeMediaItem.location,
          featured: activeMediaItem.featured,
          status: activeMediaItem.status,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update media item');
      }

      showNotification('Media details updated successfully!');
      setIsMediaEditModalOpen(false);
      fetchMedia();
    } catch (err: any) {
      showNotification(err.message || 'Error updating media', 'error');
    }
  };

  const toggleMediaStatus = async (item: any) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showNotification(`Media item ${newStatus === 'PUBLISHED' ? 'published' : 'set to draft'}.`);
        fetchMedia();
      }
    } catch {
      showNotification('Failed to toggle status', 'error');
    }
  };

  // Project Save & Status Toggle
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingProject.title,
          category: editingProject.category || 'Weddings',
          client: editingProject.client,
          year: editingProject.year ? parseInt(editingProject.year) : new Date().getFullYear(),
          location: editingProject.location,
          coverImage: editingProject.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
          videoUrl: editingProject.videoUrl,
          duration: editingProject.duration,
          isVideo: Boolean(editingProject.isVideo),
          featured: Boolean(editingProject.featured),
          status: editingProject.status || 'PUBLISHED',
          description: editingProject.description,
          deliverables: Array.isArray(editingProject.deliverables)
            ? editingProject.deliverables
            : typeof editingProject.deliverables === 'string'
            ? editingProject.deliverables.split('\n').map((s: string) => s.trim()).filter(Boolean)
            : [],
          gearUsed: Array.isArray(editingProject.gearUsed)
            ? editingProject.gearUsed
            : typeof editingProject.gearUsed === 'string'
            ? editingProject.gearUsed.split('\n').map((s: string) => s.trim()).filter(Boolean)
            : [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save project');
      }

      showNotification(`Project ${isNew ? 'created' : 'updated'} successfully!`);
      setIsProjectModalOpen(false);
      setEditingProject(null);
      fetchProjects();
      fetchStats();
    } catch (err: any) {
      showNotification(err.message || 'Error saving project', 'error');
    }
  };

  const toggleProjectStatus = async (proj: any) => {
    const newStatus = proj.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showNotification(`Project ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}.`);
        fetchProjects();
      }
    } catch {
      showNotification('Failed to toggle status', 'error');
    }
  };

  // Service Save & Status Toggle
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const isNew = !editingService.id;
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingService.title,
          tagline: editingService.tagline,
          startingPrice: editingService.startingPrice,
          timeline: editingService.timeline,
          description: editingService.description,
          icon: editingService.icon || 'Camera',
          status: editingService.status || 'PUBLISHED',
          order: editingService.order !== undefined ? parseInt(editingService.order) : 0,
          deliverables: Array.isArray(editingService.deliverables)
            ? editingService.deliverables
            : typeof editingService.deliverables === 'string'
            ? editingService.deliverables.split('\n').map((s: string) => s.trim()).filter(Boolean)
            : [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }

      showNotification(`Service ${isNew ? 'created' : 'updated'} successfully!`);
      setIsServiceModalOpen(false);
      setEditingService(null);
      fetchServices();
      fetchStats();
    } catch (err: any) {
      showNotification(err.message || 'Error saving service', 'error');
    }
  };

  const toggleServiceStatus = async (srv: any) => {
    const newStatus = srv.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/services/${srv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showNotification(`Service ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}.`);
        fetchServices();
      }
    } catch {
      showNotification('Failed to toggle status', 'error');
    }
  };

  // Testimonial Save & Status Toggle
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    try {
      const isNew = !editingTestimonial.id;
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingTestimonial.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: editingTestimonial.clientName,
          roleOrEvent: editingTestimonial.roleOrEvent,
          comment: editingTestimonial.comment,
          rating: editingTestimonial.rating ? parseInt(editingTestimonial.rating) : 5,
          avatar: editingTestimonial.avatar,
          featured: Boolean(editingTestimonial.featured),
          status: editingTestimonial.status || 'PUBLISHED',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save testimonial');
      }

      showNotification(`Testimonial ${isNew ? 'added' : 'updated'} successfully!`);
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (err: any) {
      showNotification(err.message || 'Error saving testimonial', 'error');
    }
  };

  const toggleTestimonialStatus = async (t: any) => {
    const newStatus = t.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showNotification(`Testimonial ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}.`);
        fetchTestimonials();
      }
    } catch {
      showNotification('Failed to toggle status', 'error');
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('aim_admin_auth');
    localStorage.removeItem('aim_admin_user');
    router.push('/admin/login');
  };

  // Media Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('title', files[0].name.replace(/\.[^/.]+$/, ''));
    formData.append('category', 'Weddings');
    formData.append('status', 'PUBLISHED');

    try {
      setUploadProgress(40);
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(100);
      showNotification('Asset uploaded and catalogued successfully!');
      fetchMedia();
      fetchStats();
    } catch (err: any) {
      showNotification(err.message || 'Upload failed', 'error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    }
  };

  // Media Bulk Actions
  const handleBulkMediaAction = async (action: 'publish' | 'unpublish' | 'soft-delete') => {
    if (selectedMediaIds.length === 0) return;
    if (action === 'soft-delete' && !confirm(`Move ${selectedMediaIds.length} items to Trash?`)) return;

    try {
      const res = await fetch('/api/admin/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedMediaIds }),
      });
      if (res.ok) {
        showNotification(`Bulk ${action} executed successfully.`);
        setSelectedMediaIds([]);
        fetchMedia();
      }
    } catch (err: any) {
      showNotification('Failed to execute bulk action', 'error');
    }
  };

  // Settings Save Handler
  const handleSaveSetting = async (key: string, value: any, label: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value,
          label,
          changeReason: changeReason || `Updated ${label} from dashboard`,
        }),
      });

      if (res.ok) {
        showNotification(`Setting "${label}" updated with revision history!`);
        setChangeReason('');
        fetchSettings();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Failed to save setting', 'error');
      }
    } catch (err: any) {
      showNotification('Error saving setting', 'error');
    }
  };

  // Revision Rollback Handler
  const handleRollbackRevision = async (revisionId: string, version: number) => {
    if (!confirm(`Are you sure you want to restore to version ${version}? This will overwrite current value.`)) return;

    try {
      const res = await fetch('/api/admin/settings/revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisionId }),
      });

      if (res.ok) {
        showNotification(`Setting successfully rolled back to version ${version}!`);
        setIsRevisionModalOpen(false);
        fetchSettings();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Rollback failed', 'error');
      }
    } catch (err) {
      showNotification('Error restoring revision', 'error');
    }
  };

  // Trash Actions: Restore & Permanent Purge
  const handleRestoreTrash = async (entityType: string, id: string) => {
    try {
      const res = await fetch('/api/admin/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, id }),
      });
      if (res.ok) {
        showNotification(`Restored ${entityType} to active collection.`);
        fetchTrash();
        if (entityType === 'Media') fetchMedia();
        if (entityType === 'Project') fetchProjects();
        if (entityType === 'Service') fetchServices();
        if (entityType === 'Testimonial') fetchTestimonials();
      }
    } catch (err) {
      showNotification('Failed to restore item', 'error');
    }
  };

  const handlePermanentPurge = async () => {
    if (!purgeTarget) return;

    try {
      const res = await fetch(`/api/admin/trash?type=${purgeTarget.itemType}&id=${purgeTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showNotification(`${purgeTarget.title || 'Item'} permanently purged from storage & database.`);
        setPurgeTarget(null);
        fetchTrash();
      } else {
        const data = await res.json();
        showNotification(data.error || 'Purge failed (requires Superadmin)', 'error');
      }
    } catch (err) {
      showNotification('Failed to purge item', 'error');
    }
  };

  // Password Change Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess('Studio password updated successfully! Keep this credential secure.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('Password updated successfully!');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      showNotification(`Studio user ${data.user.name} created with role ${data.user.role}!`);
      setNewUserModalOpen(false);
      setNewUserData({ name: '', email: '', password: '', role: 'EDITOR' });
      fetchUsers();
    } catch (err: any) {
      showNotification(err.message || 'Error creating user', 'error');
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950 text-cream-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          <p className="text-xs uppercase tracking-widest text-slate-400">Loading Studio Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-cream-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-obsidian-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/logo-emblem.png"
              alt="Aim Images Emblem"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-cream-50">
                Aim Images CMS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                {currentUser?.role || 'SUPERADMIN'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Kabale Studio • Production Console v2.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-850 border border-white/10 hover:border-gold-500/40 text-xs text-slate-300 hover:text-cream-100 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3 h-3 text-gold-400" />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-cream-100">{currentUser?.name || 'Studio Director'}</p>
              <p className="text-[10px] text-slate-400">{currentUser?.email || 'admin@aimimages.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="End studio session"
              className="p-2 rounded-lg bg-obsidian-850 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-medium animate-fade-in ${
            notification.type === 'error'
              ? 'bg-red-500/20 border-red-500/40 text-red-300'
              : notification.type === 'info'
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-obsidian-900/60 border-r border-white/10 p-3 sm:p-4 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto">
          <div className="flex md:flex-col gap-1 min-w-max md:min-w-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'media'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects / Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Services & Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              {stats.pendingInquiriesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-red-500 text-white font-bold">
                  {stats.pendingInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Testimonials</span>
            </button>

            <div className="my-2 border-t border-white/10 hidden md:block" />

            <button
              onClick={() => setActiveTab('trash')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'trash'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Trash & Recovery</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Permanent Audit Log</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'text-slate-400 hover:text-cream-100 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Users</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 overflow-y-auto">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                      Studio Systems Live
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
                    Aim Images Executive Console
                  </h1>
                  <p className="text-xs text-slate-400">
                    Full control over photography, cinematography, pricing, and Kabale studio availability.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('media')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Asset</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Media Assets</span>
                    <Camera className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-cream-50">{stats.mediaCount || 18}</p>
                  <p className="text-[11px] text-slate-500">Photos & 4K Cinema Reels</p>
                </div>

                <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Portfolio Works</span>
                    <FolderKanban className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-cream-50">{projects.length}</p>
                  <p className="text-[11px] text-slate-500">Across 8 creative categories</p>
                </div>

                <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Client Inquiries</span>
                    <Inbox className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-cream-50">{inquiries.length}</p>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {inquiries.filter((i) => i.status === 'PENDING').length} awaiting response
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Storage Usage</span>
                    <UploadCloud className="w-4 h-4 text-gold-400" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-cream-50">{stats.storageSizeFormatted || '48.2 MB'}</p>
                  <p className="text-[11px] text-slate-500">Optimized S3 / Local fallback</p>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-cream-50">Quick Studio Controls</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-gold-500/30 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-gold-400" />
                        <div>
                          <p className="font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                            Update Availability Status
                          </p>
                          <p className="text-[11px] text-slate-400">Current: {settings.booking_status}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="w-full text-left p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-gold-500/30 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gold-400" />
                        <div>
                          <p className="font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                            Reply to WhatsApp Leads
                          </p>
                          <p className="text-[11px] text-slate-400">WhatsApp: {settings.contact_whatsapp}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('trash')}
                      className="w-full text-left p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-gold-500/30 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-4 h-4 text-gold-400" />
                        <div>
                          <p className="font-semibold text-cream-100 group-hover:text-gold-400 transition-colors">
                            Trash & Recovery Bin
                          </p>
                          <p className="text-[11px] text-slate-400">Safely review deleted items</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-cream-50">Studio Inquiries Awaiting Response</h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-cream-50">{item.name}</p>
                          <p className="text-slate-400">{item.service}</p>
                          <p className="text-[11px] text-gold-400">{item.budgetRange} • {item.eventDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${(item.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-500/30 transition-colors"
                          >
                            <span>WhatsApp Direct</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MEDIA LIBRARY */}
          {/* ========================================================================= */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Upload Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Media Asset Management</h2>
                  <p className="text-xs text-slate-400">
                    Upload, organize, tag, and publish photography stills and 4K cinema assets.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload New File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && uploadProgress !== null && (
                <div className="p-4 rounded-xl bg-obsidian-900 border border-gold-500/30 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gold-400 font-semibold">Processing Asset with Sharp Optimizer...</span>
                    <span className="text-slate-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-obsidian-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Filter & Search Toolbar */}
              <div className="p-4 rounded-xl bg-obsidian-850 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, tags, location..."
                      value={mediaFilter.search}
                      onChange={(e) => setMediaFilter({ ...mediaFilter, search: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
                      className="bg-obsidian-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-cream-50 placeholder-slate-500 focus:outline-none focus:border-gold-500 w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={mediaFilter.category}
                    onChange={(e) => {
                      setMediaFilter({ ...mediaFilter, category: e.target.value });
                    }}
                    className="bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cream-50 focus:outline-none focus:border-gold-500"
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={mediaFilter.type}
                    onChange={(e) => setMediaFilter({ ...mediaFilter, type: e.target.value })}
                    className="bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cream-50 focus:outline-none focus:border-gold-500"
                  >
                    <option value="ALL">All Media Types</option>
                    <option value="PHOTO">Photography Stills</option>
                    <option value="VIDEO">Cinematic Video</option>
                  </select>

                  <button
                    onClick={fetchMedia}
                    className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 hover:border-gold-500/40 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Bulk Actions */}
                {selectedMediaIds.length > 0 && (
                  <div className="flex items-center gap-2 bg-obsidian-900 px-3 py-1.5 rounded-lg border border-gold-500/30">
                    <span className="text-xs font-semibold text-gold-400">{selectedMediaIds.length} Selected</span>
                    <button
                      onClick={() => handleBulkMediaAction('publish')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/30"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => handleBulkMediaAction('unpublish')}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-[11px] font-semibold hover:bg-amber-500/30"
                    >
                      Unpublish
                    </button>
                    <button
                      onClick={() => handleBulkMediaAction('soft-delete')}
                      className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/30"
                    >
                      Move to Trash
                    </button>
                    <button
                      onClick={() => setSelectedMediaIds([])}
                      className="p-1 text-slate-500 hover:text-cream-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Media Grid */}
              {mediaLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
                  <span className="text-xs">Querying media repository...</span>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-obsidian-850 rounded-2xl border border-white/5">
                  <Camera className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-cream-100">No media assets in current filter</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Upload client photos, campaign films, or adjust filters to browse existing media.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs font-semibold hover:bg-gold-500 hover:text-obsidian-950 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload First Asset</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {mediaItems.map((item) => {
                    const isSelected = selectedMediaIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`group relative rounded-2xl overflow-hidden bg-obsidian-850 border transition-all ${
                          isSelected ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-white/10 hover:border-gold-500/40'
                        }`}
                      >
                        {/* Thumbnail View */}
                        <div className="relative aspect-4/3 w-full bg-obsidian-950">
                          {item.url ? (
                            <Image
                              src={item.posterUrl || item.url}
                              alt={item.altText || item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Camera className="w-8 h-8" />
                            </div>
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMediaIds([...selectedMediaIds, item.id]);
                                } else {
                                  setSelectedMediaIds(selectedMediaIds.filter((id) => id !== item.id));
                                }
                              }}
                              className="rounded border-white/20 text-gold-500 focus:ring-0 cursor-pointer"
                            />
                            {item.isVideo && (
                              <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold text-cream-100 flex items-center gap-1">
                                <Video className="w-2.5 h-2.5 text-gold-400" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => toggleMediaStatus(item)}
                              title="Click to toggle Published/Draft"
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                item.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/80 text-white hover:bg-emerald-600'
                                  : 'bg-amber-500/80 text-obsidian-950 hover:bg-amber-600'
                              }`}
                            >
                              {item.status}
                            </button>
                          </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="p-3 space-y-1.5">
                          <p className="font-semibold text-xs text-cream-100 truncate">{item.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{item.category}</span>
                            {item.fileSize && <span>{Math.round(item.fileSize / 1024)} KB</span>}
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                showNotification('Asset URL copied to clipboard!');
                              }}
                              className="text-[11px] text-slate-400 hover:text-cream-100 flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy URL</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setActiveMediaItem(item);
                                  setIsMediaEditModalOpen(true);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-gold-400"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Move "${item.title}" to Trash?`)) {
                                    await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
                                    showNotification('Item moved to Trash');
                                    fetchMedia();
                                  }
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PROJECTS / PORTFOLIO */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Portfolio Case Studies</h2>
                  <p className="text-xs text-slate-400">
                    Publish cinematic feature films, editorial campaigns, and destination wedding albums.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Weddings',
                      client: '',
                      year: new Date().getFullYear(),
                      location: 'Kabale, Uganda',
                      description: '',
                      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
                      videoUrl: '',
                      duration: '',
                      isVideo: false,
                      featured: false,
                      status: 'PUBLISHED',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-obsidian-850 border border-white/10 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-obsidian-900">
                        {proj.coverImage && (
                          <Image
                            src={proj.coverImage}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-500 text-obsidian-950">
                            {proj.category}
                          </span>
                          <button
                            onClick={() => toggleProjectStatus(proj)}
                            title="Click to toggle Published/Draft"
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              proj.status === 'PUBLISHED'
                                ? 'bg-emerald-500/80 text-white hover:bg-emerald-600'
                                : 'bg-amber-500/80 text-obsidian-950 hover:bg-amber-600'
                            }`}
                          >
                            {proj.status || 'PUBLISHED'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-sm text-cream-100">{proj.title}</h4>
                        <p className="text-xs text-slate-400">{proj.client} • {proj.year}</p>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{proj.location}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-obsidian-900 border border-white/10 hover:border-gold-500 text-xs text-cream-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Move project "${proj.title}" to Trash?`)) {
                              await fetch(`/api/admin/projects/${proj.id}`, { method: 'DELETE' });
                              showNotification('Project moved to Trash');
                              fetchProjects();
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SERVICES & PRICING */}
          {/* ========================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Studio Services & Packages</h2>
                  <p className="text-xs text-slate-400">
                    Define production tiers, starting investments, and deliverable schedules.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({
                      title: '',
                      tagline: '',
                      description: '',
                      startingPrice: '$2,500',
                      timeline: '2 - 3 Weeks',
                      deliverables: ['4K Cinematic Film', 'Master Retouched Stills'],
                      order: services.length + 1,
                    });
                    setIsServiceModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleServiceStatus(srv)}
                            title="Click to toggle Published/Draft"
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              srv.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {srv.status || 'PUBLISHED'}
                          </button>
                          <span className="font-serif text-xl font-bold text-gold-400">
                            {srv.startingPrice}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-base font-bold text-cream-50">{srv.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{srv.tagline}</p>

                      <div className="space-y-1 pt-2">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          Core Deliverables:
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {(srv.deliverables || []).slice(0, 3).map((d: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gold-500" />
                              <span className="truncate">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{srv.timeline}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingService(srv);
                            setIsServiceModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-obsidian-900 border border-white/10 hover:border-gold-500 text-xs text-cream-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Move service "${srv.title}" to Trash?`)) {
                              await fetch(`/api/admin/services/${srv.id}`, { method: 'DELETE' });
                              showNotification('Service moved to Trash');
                              fetchServices();
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: WEBSITE SETTINGS & REVISIONS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Website Settings & Revisions</h2>
                  <p className="text-xs text-slate-400">
                    Live editable content with automatic revision snapshots and 1-click historical rollback.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    {settings.booking_status}
                  </span>
                </div>
              </div>

              {/* Change Reason Note */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-gold-400 font-medium">
                  <History className="w-4 h-4 shrink-0" />
                  <span>Audit Reason / Change Note:</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Updated holiday booking status and studio phone"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full sm:w-80 bg-obsidian-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cream-100 placeholder-slate-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand & Availability */}
                <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-cream-50">Brand & Availability</h3>
                    <button
                      onClick={() => fetchRevisions('booking_status')}
                      className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Revisions</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Studio Logo */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          Studio Logo
                        </label>
                        <button
                          onClick={() => fetchRevisions('site_logo')}
                          className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                        >
                          <History className="w-3 h-3" />
                          <span>Revisions</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian-900 border border-white/5 mb-2">
                        <div className="w-20 h-10 relative flex items-center justify-center bg-black/60 rounded-lg p-1 border border-white/10 shrink-0">
                          <Image
                            src={settings.site_logo || '/logo.png'}
                            alt="Studio Logo Preview"
                            width={80}
                            height={40}
                            className="max-h-8 w-auto object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="/logo.png or image URL"
                          value={settings.site_logo || ''}
                          onChange={(e) => setSettings({ ...settings, site_logo: e.target.value })}
                          className="flex-1 bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('site_logo', settings.site_logo || '/logo.png', 'Studio Logo')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Studio Brand Name
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.brand_name || ''}
                          onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('brand_name', settings.brand_name, 'Brand Name')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Studio Availability Badge
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1.5">
                        Displays near main booking CTA on home and header (e.g. &ldquo;Bookings Open&rdquo;).
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.booking_status || ''}
                          onChange={(e) => setSettings({ ...settings, booking_status: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('booking_status', settings.booking_status, 'Booking Status')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Hero Tagline
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.brand_tagline || ''}
                          onChange={(e) => setSettings({ ...settings, brand_tagline: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('brand_tagline', settings.brand_tagline, 'Hero Tagline')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Studio Coordinates & Contact */}
                <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-cream-50">Studio Contact & Coordinates</h3>
                    <button
                      onClick={() => fetchRevisions('studio_address')}
                      className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Revisions</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Studio Physical Address
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.studio_address || ''}
                          onChange={(e) => setSettings({ ...settings, studio_address: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('studio_address', settings.studio_address, 'Studio Address')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Studio WhatsApp Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.contact_whatsapp || ''}
                          onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('contact_whatsapp', settings.contact_whatsapp, 'WhatsApp Number')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Studio Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.contact_email || ''}
                          onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('contact_email', settings.contact_email, 'Contact Email')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Google Maps Location URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.google_maps_url || ''}
                          onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('google_maps_url', settings.google_maps_url, 'Google Maps URL')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links & Profiles */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-cream-50">Social Links & Profiles</h3>
                    <button
                      onClick={() => fetchRevisions('instagram_url')}
                      className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>View Revisions</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        Instagram Profile URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.instagram_url || ''}
                          onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                          placeholder="https://instagram.com/aimimages_hd_photography"
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('instagram_url', settings.instagram_url, 'Instagram URL')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        YouTube Channel URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.youtube_url || ''}
                          onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                          placeholder="https://youtube.com/@AimImagesphotography"
                          className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSaveSetting('youtube_url', settings.youtube_url, 'YouTube URL')}
                          className="px-3 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO & Meta */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-cream-50">Global SEO & Social Discovery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={settings.seo_title || ''}
                        onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                        className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500 mb-2"
                      />
                      <button
                        onClick={() => handleSaveSetting('seo_title', settings.seo_title, 'SEO Title')}
                        className="px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                      >
                        Save Title
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={settings.seo_description || ''}
                        onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                        className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-gold-500 mb-2"
                      />
                      <button
                        onClick={() => handleSaveSetting('seo_description', settings.seo_description, 'SEO Description')}
                        className="px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400"
                      >
                        Save Description
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: INQUIRIES INBOX */}
          {/* ========================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Client Booking Leads</h2>
                  <p className="text-xs text-slate-400">
                    Direct inquiries submitted via the website and WhatsApp channel.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-cream-50">{inq.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'PENDING'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : inq.status === 'REVIEWED'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{inq.email} • {inq.phone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await fetch(`/api/admin/inquiries/${inq.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus }),
                            });
                            setInquiries(inquiries.map((i) => (i.id === inq.id ? { ...i, status: newStatus } : i)));
                            showNotification(`Inquiry status updated to ${newStatus}`);
                          }}
                          className="bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cream-100"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="BOOKED">Booked</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>

                        <a
                          href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${inq.name}, thank you for inquiring with Aim Images HD regarding ${inq.service}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs"
                        >
                          WhatsApp Reply
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Service:</span>
                        <span className="text-cream-100 font-medium">{inq.service}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Date:</span>
                        <span className="text-cream-100 font-medium">{inq.eventDate || 'Flexible'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Budget:</span>
                        <span className="text-gold-400 font-bold">{inq.budgetRange || 'Bespoke'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 text-xs text-slate-300 leading-relaxed">
                      &ldquo;{inq.message}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: TESTIMONIALS */}
          {/* ========================================================================= */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Client Reviews & Testimonials</h2>
                  <p className="text-xs text-slate-400">
                    Curate client praise from high-profile couples, fashion maisons, and global brands.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTestimonial({
                      clientName: '',
                      roleOrEvent: 'Destination Wedding',
                      comment: '',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
                      featured: true,
                    });
                    setIsTestimonialModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gold-400">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {t.featured && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                              Featured
                            </span>
                          )}
                          <button
                            onClick={() => toggleTestimonialStatus(t)}
                            title="Click to toggle Published/Draft"
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              t.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {t.status || 'PUBLISHED'}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        &ldquo;{t.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-xs text-cream-100">{t.clientName}</p>
                        <p className="text-[11px] text-slate-500">{t.roleOrEvent}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTestimonial(t);
                            setIsTestimonialModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-obsidian-900 border border-white/10 hover:border-gold-500 text-xs text-cream-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Move testimonial by "${t.clientName}" to Trash?`)) {
                              await fetch(`/api/admin/testimonials/${t.id}`, { method: 'DELETE' });
                              showNotification('Testimonial moved to Trash');
                              fetchTestimonials();
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: TRASH & RECOVERY */}
          {/* ========================================================================= */}
          {activeTab === 'trash' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Trash & Soft-Delete Recovery</h2>
                  <p className="text-xs text-slate-400">
                    Deleted items stay here safely. Restore with one click, or permanently purge with Superadmin privileges.
                  </p>
                </div>
                <button
                  onClick={fetchTrash}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 hover:border-gold-500 text-xs text-slate-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Trash</span>
                </button>
              </div>

              {trashItems.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-obsidian-850 rounded-2xl border border-white/5">
                  <Trash2 className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-cream-100">Trash bin is clean</p>
                  <p className="text-xs text-slate-500">No deleted photography, projects, or settings.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trashItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-obsidian-850 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                            {item.itemType}
                          </span>
                          <h4 className="font-semibold text-xs text-cream-100">{item.title || item.clientName}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Deleted on {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestoreTrash(item.itemType, item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => setPurgeTarget(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/40 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Purge Permanently</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: PERMANENT AUDIT LOG */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Permanent Audit Log</h2>
                  <p className="text-xs text-slate-400">
                    Immutable chronological record of every studio upload, update, soft-delete, restore, and login event.
                  </p>
                </div>
                <button
                  onClick={fetchAuditLogs}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 hover:border-gold-500 text-xs text-slate-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Log</span>
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-obsidian-850 rounded-2xl border border-white/5">
                  <History className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-cream-100">Audit repository recording events</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-obsidian-850 border border-white/10 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-500">
                        <th className="pb-3 font-semibold">Timestamp</th>
                        <th className="pb-3 font-semibold">Action</th>
                        <th className="pb-3 font-semibold">Entity</th>
                        <th className="pb-3 font-semibold">Item Title</th>
                        <th className="pb-3 font-semibold">Actor</th>
                        <th className="pb-3 text-right font-semibold">Diff Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 text-slate-400 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                log.action === 'CREATE'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : log.action === 'UPDATE'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : log.action === 'SOFT_DELETE'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : log.action === 'PERMANENT_DELETE'
                                  ? 'bg-red-500/20 text-red-400'
                                  : log.action === 'RESTORE'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-gold-500/20 text-gold-400'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-cream-100">{log.entityType}</td>
                          <td className="py-3 max-w-xs truncate">{log.entityTitle || log.entityId}</td>
                          <td className="py-3 text-slate-400">{log.actorEmail || 'System Master'}</td>
                          <td className="py-3 text-right">
                            {(log.beforeValues || log.afterValues) && (
                              <button
                                onClick={() => setSelectedAuditLog(log)}
                                className="text-gold-400 hover:text-gold-300 text-[11px] underline font-medium"
                              >
                                View Diff
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: SECURITY & TEAM MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-cream-50">Studio Security & Team Access</h2>
                  <p className="text-xs text-slate-400">
                    Change access password, enforce role boundaries, and create authorized editor profiles.
                  </p>
                </div>
              </div>

              {/* Password Change Card */}
              <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-5 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-cream-50">Change Studio Password</h3>
                    <p className="text-xs text-slate-400">Update master password for this account session.</p>
                  </div>
                </div>

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                      Current Password (optional for Master Admin)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cream-50 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                      New Studio Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cream-50 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-cream-50 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save New Password</span>
                  </button>
                </form>
              </div>

              {/* Team Members List (SUPERADMIN only) */}
              {currentUser?.role === 'SUPERADMIN' && (
                <div className="p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-cream-50">Team Accounts & Roles</h3>
                      <p className="text-xs text-slate-400">Manage studio editors, photographers, and administrators.</p>
                    </div>

                    <button
                      onClick={() => setNewUserModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Studio User</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {teamUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-cream-100">{user.name}</p>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
                            {user.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              user.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: REVISION HISTORY MODAL */}
      {/* ========================================================================= */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">Historical Revision Log</h3>
                <p className="text-xs text-slate-400">Key: <code className="text-gold-400">{selectedSettingKey}</code></p>
              </div>
              <button onClick={() => setIsRevisionModalOpen(false)} className="p-1 text-slate-400 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {revisions.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">No historical revisions recorded for this setting yet.</p>
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-obsidian-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-400">
                          v{rev.version}
                        </span>
                        <span className="text-slate-400">{new Date(rev.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-cream-100 font-mono text-[11px] bg-obsidian-950 px-2 py-1 rounded">
                        {JSON.stringify(rev.value)}
                      </p>
                      {rev.changeReason && <p className="text-[11px] text-slate-400 italic">Note: {rev.changeReason}</p>}
                    </div>

                    <button
                      onClick={() => handleRollbackRevision(rev.id, rev.version)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore v{rev.version}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PURGE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {purgeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-obsidian-850 border border-red-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-lg font-bold text-red-400">Irreversible Permanent Purge</h3>
              <p className="text-xs text-slate-300">
                Are you completely sure you want to permanently delete:
              </p>
              <p className="text-sm font-bold text-cream-50 bg-obsidian-900 p-2 rounded-lg border border-white/5">
                {purgeTarget.title || purgeTarget.clientName || purgeTarget.id}
              </p>
              <p className="text-[11px] text-red-400/90 leading-relaxed">
                WARNING: This deletes the underlying binary files from storage and permanently purges database rows. This cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setPurgeTarget(null)}
                className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentPurge}
                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: AUDIT DIFF INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-cream-50">Audit Diff Inspector</h3>
              <button onClick={() => setSelectedAuditLog(null)} className="p-1 text-slate-400 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-4 text-slate-400">
                <span>Action: <strong className="text-gold-400">{selectedAuditLog.action}</strong></span>
                <span>Entity: <strong className="text-cream-100">{selectedAuditLog.entityType}</strong></span>
                <span>Actor: <strong className="text-cream-100">{selectedAuditLog.actorEmail || 'Director'}</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Before Snapshot:</span>
                  <pre className="bg-obsidian-950 p-3 rounded-xl border border-white/5 text-[10px] text-slate-400 overflow-x-auto max-h-60">
                    {JSON.stringify(selectedAuditLog.beforeValues, null, 2) || 'null'}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">After Snapshot:</span>
                  <pre className="bg-obsidian-950 p-3 rounded-xl border border-white/5 text-[10px] text-emerald-300 overflow-x-auto max-h-60">
                    {JSON.stringify(selectedAuditLog.afterValues, null, 2) || 'null'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE STUDIO USER (SUPERADMIN) */}
      {/* ========================================================================= */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-cream-50">Add Studio User Account</h3>
              <button onClick={() => setNewUserModalOpen(false)} className="p-1 text-slate-400 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eddy Ndyanabo"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="editor@aimimages.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Role Permission Tier
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100"
                >
                  <option value="EDITOR">EDITOR (Upload media, edit draft projects)</option>
                  <option value="ADMIN">ADMIN (Publish content, change settings)</option>
                  <option value="SUPERADMIN">SUPERADMIN (Full access, purge trash, manage users)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold uppercase tracking-wider text-[11px]"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT MEDIA MODAL */}
      {/* ========================================================================= */}
      {isMediaEditModalOpen && activeMediaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">Edit Media Asset</h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{activeMediaItem.title || 'Untitled Asset'}</p>
              </div>
              <button
                onClick={() => {
                  setIsMediaEditModalOpen(false);
                  setActiveMediaItem(null);
                }}
                className="p-1 text-slate-400 hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Asset Title
                </label>
                <input
                  type="text"
                  required
                  value={activeMediaItem.title || ''}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, title: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Category
                  </label>
                  <select
                    value={activeMediaItem.category || 'Weddings'}
                    onChange={(e) => setActiveMediaItem({ ...activeMediaItem, category: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Status
                  </label>
                  <select
                    value={activeMediaItem.status || 'PUBLISHED'}
                    onChange={(e) => setActiveMediaItem({ ...activeMediaItem, status: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="PUBLISHED">Published (Live on site)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. bride, lake-como, golden-hour"
                  value={Array.isArray(activeMediaItem.tags) ? activeMediaItem.tags.join(', ') : (activeMediaItem.tags || '')}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, tags: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lake Como, Italy"
                  value={activeMediaItem.location || ''}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, location: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="Descriptive text for accessibility"
                  value={activeMediaItem.altText || ''}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, altText: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={activeMediaItem.description || ''}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, description: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mediaFeatured"
                  checked={Boolean(activeMediaItem.featured)}
                  onChange={(e) => setActiveMediaItem({ ...activeMediaItem, featured: e.target.checked })}
                  className="rounded border-white/20 text-gold-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="mediaFeatured" className="text-slate-300 text-xs cursor-pointer">
                  Feature in portfolio highlights
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaEditModalOpen(false);
                    setActiveMediaItem(null);
                  }}
                  className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold uppercase tracking-wider text-[11px]"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CREATE / EDIT PROJECT MODAL */}
      {/* ========================================================================= */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {editingProject.id ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
                </h3>
                <p className="text-xs text-slate-400">Configure case study metadata, media assets, and gear info.</p>
              </div>
              <button
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="p-1 text-slate-400 hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Lake Como Vows"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Category
                  </label>
                  <select
                    value={editingProject.category || 'Weddings'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria & Alexander"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingProject.year || new Date().getFullYear()}
                    onChange={(e) => setEditingProject({ ...editingProject, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lake Como, Italy"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Video URL (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://player.vimeo.com/... or YouTube"
                    value={editingProject.videoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value, isVideo: Boolean(e.target.value) })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Duration (e.g. &ldquo;12 min film&rdquo;)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 min 4K Film"
                    value={editingProject.duration || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Publication Status
                  </label>
                  <select
                    value={editingProject.status || 'PUBLISHED'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="PUBLISHED">Published (Live on site)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Description / Story
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Deliverables (one per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="4K Master Film&#10;Teaser Trailer&#10;Master Retouched Stills"
                    value={Array.isArray(editingProject.deliverables) ? editingProject.deliverables.join('\n') : (editingProject.deliverables || '')}
                    onChange={(e) => setEditingProject({ ...editingProject, deliverables: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Camera / Gear Used (one per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="RED V-Raptor 8K&#10;Cooke Anamorphic /i&#10;DJI Ronin 2"
                    value={Array.isArray(editingProject.gearUsed) ? editingProject.gearUsed.join('\n') : (editingProject.gearUsed || '')}
                    onChange={(e) => setEditingProject({ ...editingProject, gearUsed: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-white/20 text-gold-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isVideo)}
                    onChange={(e) => setEditingProject({ ...editingProject, isVideo: e.target.checked })}
                    className="rounded border-white/20 text-gold-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Mark as Cinema Film</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold uppercase tracking-wider text-[11px]"
                >
                  {editingProject.id ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: CREATE / EDIT SERVICE MODAL */}
      {/* ========================================================================= */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {editingService.id ? 'Edit Service Tier' : 'Add Service Tier'}
                </h3>
                <p className="text-xs text-slate-400">Configure studio deliverables, pricing, and turnaround time.</p>
              </div>
              <button
                onClick={() => {
                  setIsServiceModalOpen(false);
                  setEditingService(null);
                }}
                className="p-1 text-slate-400 hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haute Couture & Editorial Cinema"
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Tagline / Brief Subtitle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mastered for campaign launches, lookbooks, and luxury houses."
                  value={editingService.tagline || ''}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Starting Investment / Price
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $4,500"
                    value={editingService.startingPrice || ''}
                    onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Turnaround Timeline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 - 3 Weeks"
                    value={editingService.timeline || ''}
                    onChange={(e) => setEditingService({ ...editingService, timeline: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Deliverables (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Master 4K Cinema Film&#10;Full Resolution Stills&#10;Social Teasers&#10;Private Online Archive"
                  value={Array.isArray(editingService.deliverables) ? editingService.deliverables.join('\n') : (editingService.deliverables || '')}
                  onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingService.order !== undefined ? editingService.order : 0}
                    onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Status
                  </label>
                  <select
                    value={editingService.status || 'PUBLISHED'}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsServiceModalOpen(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold uppercase tracking-wider text-[11px]"
                >
                  {editingService.id ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: CREATE / EDIT TESTIMONIAL MODAL */}
      {/* ========================================================================= */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {editingTestimonial.id ? 'Edit Client Review' : 'Add Client Review'}
                </h3>
                <p className="text-xs text-slate-400">Curate client endorsements, quotes, and star ratings.</p>
              </div>
              <button
                onClick={() => {
                  setIsTestimonialModalOpen(false);
                  setEditingTestimonial(null);
                }}
                className="p-1 text-slate-400 hover:text-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Client / Couple Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria & Alexander"
                    value={editingTestimonial.clientName || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Role or Event
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Destination Wedding, Lake Como"
                    value={editingTestimonial.roleOrEvent || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, roleOrEvent: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Client Testimonial / Quote
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="&ldquo;Aim Images captured our celebration with extraordinary elegance...&rdquo;"
                  value={editingTestimonial.comment || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Great)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                    Status
                  </label>
                  <select
                    value={editingTestimonial.status || 'PUBLISHED'}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, status: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
                  Avatar Image URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={editingTestimonial.avatar || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="testimonialFeatured"
                  checked={Boolean(editingTestimonial.featured)}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, featured: e.target.checked })}
                  className="rounded border-white/20 text-gold-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="testimonialFeatured" className="text-slate-300 text-xs cursor-pointer">
                  Feature prominently on homepage
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTestimonialModalOpen(false);
                    setEditingTestimonial(null);
                  }}
                  className="px-4 py-2 rounded-full bg-obsidian-900 border border-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold uppercase tracking-wider text-[11px]"
                >
                  {editingTestimonial.id ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
