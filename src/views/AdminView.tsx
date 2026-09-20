import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare, 
  FileQuestion, 
  Award, 
  TrendingUp, 
  Sliders, 
  Film,
  LogOut, 
  CheckCircle2, 
  ChevronRight, 
  Bell, 
  Sparkles, 
  ExternalLink,
  KeyRound,
  ShieldCheck,
  X,
  Users,
  Globe
} from 'lucide-react';
import { 
  PlanningDocument, 
  NewsArticle, 
  Complaint, 
  AgendaEvent, 
  GalleryItem, 
  InformationRequest,
  EmployeeProfile,
  PortalLink
} from '../types';
import { StorageService } from '../services/storage';

// Modular Admin Tabs
import { AdminDashboardTab } from '../components/admin/AdminDashboardTab';
import { AdminDocumentsTab } from '../components/admin/AdminDocumentsTab';
import { AdminNewsTab } from '../components/admin/AdminNewsTab';
import { AdminAgendaTab } from '../components/admin/AdminAgendaTab';
import { AdminGalleryTab } from '../components/admin/AdminGalleryTab';
import { AdminComplaintsTab } from '../components/admin/AdminComplaintsTab';
import { AdminPpidTab } from '../components/admin/AdminPpidTab';
import { AdminLeaderSpeechTab } from '../components/admin/AdminLeaderSpeechTab';
import { AdminEmployeesTab } from '../components/admin/AdminEmployeesTab';
import { AdminIndicatorsTab } from '../components/admin/AdminIndicatorsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminHeroVideoTab } from '../components/admin/AdminHeroVideoTab';
import { AdminHeroHighlightTab } from '../components/admin/AdminHeroHighlightTab';
import { AdminSecurityTab } from '../components/admin/AdminSecurityTab';
import { AdminPortalLinksTab } from '../components/admin/AdminPortalLinksTab';

export type AdminTabId = 
  | 'dashboard' 
  | 'dokumen' 
  | 'berita' 
  | 'agenda' 
  | 'galeri' 
  | 'pengaduan' 
  | 'ppid' 
  | 'pegawai'
  | 'portal-links'
  | 'sambutan' 
  | 'indikator' 
  | 'highlight-beranda'
  | 'video-beranda'
  | 'keamanan'
  | 'instansi';

interface AdminViewProps {
  documents: PlanningDocument[];
  news: NewsArticle[];
  complaints: Complaint[];
  agendas: AgendaEvent[];
  gallery?: GalleryItem[];
  onDataChanged: () => void;
  onLogout?: () => void;
}

export function AdminView({ 
  documents, 
  news, 
  complaints, 
  agendas, 
  gallery = [], 
  onDataChanged,
  onLogout 
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTabId>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local state for PPID info requests
  const [infoRequests, setInfoRequests] = useState<InformationRequest[]>([]);
  // Local state for Employees (Profil Pegawai)
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  // Local state for Portal Links
  const [portalLinks, setPortalLinks] = useState<PortalLink[]>([]);

  // Current admin credentials
  const currentAdmin = StorageService.getCurrentAdminUser();

  // Load PPID requests & Employees & Portal Links
  useEffect(() => {
    setInfoRequests(StorageService.getInfoRequests());
    setEmployees(StorageService.getEmployees());
    setPortalLinks(StorageService.getPortalLinks());
  }, [complaints, documents]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDataChangedWithReload = () => {
    setInfoRequests(StorageService.getInfoRequests());
    setEmployees(StorageService.getEmployees());
    setPortalLinks(StorageService.getPortalLinks());
    onDataChanged();
  };

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    StorageService.logout();
    if (onLogout) {
      onLogout();
    }
  };

  // Tab definitions
  const NAV_ITEMS = [
    {
      group: 'Utama & Ikhtisar',
      items: [
        { id: 'dashboard', label: 'Ringkasan Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Publikasi & Perencanaan',
      items: [
        { id: 'dokumen', label: 'Dokumen Perencanaan', icon: FileText, badge: documents.length },
        { id: 'berita', label: 'Berita & Artikel', icon: Newspaper, badge: news.length },
        { id: 'portal-links', label: 'Tautan Portal Website', icon: Globe, badge: portalLinks.length },
        { id: 'agenda', label: 'Agenda & Musrenbang', icon: Calendar, badge: agendas.length },
        { id: 'galeri', label: 'Galeri & Dokumentasi', icon: ImageIcon, badge: gallery.length },
      ]
    },
    {
      group: 'Layanan Aspirasi & KIP',
      items: [
        { 
          id: 'pengaduan', 
          label: 'Pengaduan Warga', 
          icon: MessageSquare, 
          badge: complaints.filter(c => c.status !== 'Selesai').length,
          badgeColor: 'bg-rose-500 text-white'
        },
        { 
          id: 'ppid', 
          label: 'Permohonan PPID', 
          icon: FileQuestion, 
          badge: infoRequests.filter(r => r.status !== 'Tersedia' && r.status !== 'Ditolak').length,
          badgeColor: 'bg-amber-500 text-slate-950'
        },
      ]
    },
    {
      group: 'Konfigurasi Konten & Wilayah',
      items: [
        { id: 'pegawai', label: 'Profil Pegawai', icon: Users, badge: employees.length },
        { id: 'highlight-beranda', label: 'Highlight Berita Beranda', icon: Sparkles, badge: 'Hero' },
        { id: 'sambutan', label: 'Foto & Sambutan Pimpinan', icon: Award, badge: 'Edit Foto' },
        { id: 'indikator', label: 'Indikator Makro Pembangunan', icon: TrendingUp, badge: null },
        { id: 'instansi', label: 'Pengaturan Umum & Kontak', icon: Sliders, badge: null },
      ]
    },
    {
      group: 'Keamanan & Kredensial',
      items: [
        { id: 'keamanan', label: 'Keamanan & Hanya 1 Admin', icon: KeyRound, badge: '1 Admin' },
      ]
    }
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-xl border border-slate-700 flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Panel Main Header */}
      <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#0f3d5c]/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Administration CMS &bull; Bapperida PPS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pusat Pengelolaan Konten Terpadu Portal Resmi
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Kelola dan mutakhirkan seluruh fitur situs: dokumen RPJPD/RKPD, rilis siaran pers, foto galeri, jadwal musrenbang, respon pengaduan, sambutan pimpinan, indikator statistik makro, dan kontak pelayanan.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:self-center">
          <div className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="truncate max-w-[170px] sm:max-w-none">{currentAdmin.email}</span>
            <span className="text-[10px] font-sans font-black uppercase px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">1 Admin</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('keamanan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'keamanan'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Buka menu ganti kata sandi"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Ganti Sandi</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Keluar dari sesi administrator"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout with Responsive Sidebar Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Menu (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-6">
          {NAV_ITEMS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTabId)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'bg-[#0f3d5c] text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-900'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== null && item.badge > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : (item as any).badgeColor || 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Info Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Penyimpanan Lokal Aktif</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Setiap pembaruan yang disimpan akan langsung tampak secara instan pada halaman publik pengunjung tanpa perlu build ulang.
            </p>
          </div>

          {/* Quick Logout Button in Sidebar */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Keluar dari Panel Admin</span>
          </button>
        </aside>

        {/* Right Tab Content Workspace (9 cols) */}
        <main className="lg:col-span-9 min-h-[600px]">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              documents={documents}
              news={news}
              complaints={complaints}
              agendas={agendas}
              gallery={gallery}
              infoRequests={infoRequests}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'dokumen' && (
            <AdminDocumentsTab
              documents={documents}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'berita' && (
            <AdminNewsTab
              news={news}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'portal-links' && (
            <AdminPortalLinksTab
              portalLinks={portalLinks}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'agenda' && (
            <AdminAgendaTab
              agendas={agendas}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'galeri' && (
            <AdminGalleryTab
              gallery={gallery}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'pengaduan' && (
            <AdminComplaintsTab
              complaints={complaints}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'ppid' && (
            <AdminPpidTab
              infoRequests={infoRequests}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {(activeTab === 'highlight-beranda' || activeTab === 'video-beranda') && (
            <AdminHeroHighlightTab
              news={news}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'sambutan' && (
            <AdminLeaderSpeechTab
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'pegawai' && (
            <AdminEmployeesTab
              employees={employees}
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'indikator' && (
            <AdminIndicatorsTab
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'instansi' && (
            <AdminSettingsTab
              onDataChanged={handleDataChangedWithReload}
              showToast={showToast}
            />
          )}

          {activeTab === 'keamanan' && (
            <AdminSecurityTab
              showToast={showToast}
              onDataChanged={handleDataChangedWithReload}
            />
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Keluar dari Sesi Administrator?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sesi autentikasi Anda akan diakhiri dan akun administrator akan logout secara aman. Anda dapat masuk kembali kapan saja dengan kata sandi Anda.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="text-slate-500">Akun terhubung:</span>
              <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]">
                {currentAdmin.email}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                id="btn-confirm-logout-admin"
              >
                <LogOut className="w-4 h-4" />
                <span>Ya, Keluar Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
