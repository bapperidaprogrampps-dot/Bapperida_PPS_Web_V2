import React from 'react';
import { 
  FileText, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare, 
  FileQuestion, 
  Award, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Film
} from 'lucide-react';
import { 
  PlanningDocument, 
  NewsArticle, 
  Complaint, 
  AgendaEvent, 
  GalleryItem, 
  InformationRequest 
} from '../../types';

interface AdminDashboardTabProps {
  documents: PlanningDocument[];
  news: NewsArticle[];
  complaints: Complaint[];
  agendas: AgendaEvent[];
  gallery: GalleryItem[];
  infoRequests: InformationRequest[];
  onNavigateTab: (tab: any) => void;
}

export function AdminDashboardTab({
  documents,
  news,
  complaints,
  agendas,
  gallery,
  infoRequests,
  onNavigateTab
}: AdminDashboardTabProps) {
  const pendingComplaints = complaints.filter(c => c.status === 'Menunggu Verifikasi' || c.status === 'Sedang Diproses').length;
  const pendingInfoRequests = infoRequests.filter(r => r.status === 'Diterima' || r.status === 'Diproses PPID').length;

  const totalDownloads = documents.reduce((acc, d) => acc + (d.downloadCount || 0), 0);
  const totalNewsViews = news.reduce((acc, n) => acc + (n.views || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f3d5c] via-[#154e74] to-[#0f3d5c] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Pusat Kendali Administrasi & Konten Portal Bapperida PPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Panel Pengelola Portal
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            Kelola seluruh konten, dokumen perencanaan, publikasi berita, jadwal kegiatan, galeri dokumentasi, tanggapan pengaduan warga, serta pengaturan profil instansi Papua Selatan secara terpadu dan real-time.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Dokumen */}
        <div 
          onClick={() => onNavigateTab('dokumen')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{documents.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Dokumen Rencana</div>
          <div className="text-[10px] text-slate-400 mt-1">{totalDownloads} total unduhan</div>
        </div>

        {/* Berita */}
        <div 
          onClick={() => onNavigateTab('berita')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Newspaper className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{news.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Berita & Artikel</div>
          <div className="text-[10px] text-slate-400 mt-1">{totalNewsViews.toLocaleString('id-ID')} tayangan</div>
        </div>

        {/* Agenda */}
        <div 
          onClick={() => onNavigateTab('agenda')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{agendas.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Agenda Kedinasan</div>
          <div className="text-[10px] text-slate-400 mt-1">Musrenbang & Rakor</div>
        </div>

        {/* Galeri */}
        <div 
          onClick={() => onNavigateTab('galeri')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-slate-900">{gallery.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Dokumentasi Foto</div>
          <div className="text-[10px] text-slate-400 mt-1">4 Kabupaten Anim Ha</div>
        </div>

        {/* Pengaduan */}
        <div 
          onClick={() => onNavigateTab('pengaduan')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition relative">
            <MessageSquare className="w-5 h-5" />
            {pendingComplaints > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {pendingComplaints}
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-slate-900">{complaints.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Pengaduan Warga</div>
          <div className="text-[10px] text-amber-600 font-bold mt-1">
            {pendingComplaints} belum selesai
          </div>
        </div>

        {/* Permohonan PPID */}
        <div 
          onClick={() => onNavigateTab('ppid')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3 group-hover:scale-105 transition relative">
            <FileQuestion className="w-5 h-5" />
            {pendingInfoRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {pendingInfoRequests}
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-slate-900">{infoRequests.length}</div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Permohonan PPID</div>
          <div className="text-[10px] text-slate-400 mt-1">Keterbukaan Publik</div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Plus className="w-5 h-5 text-[#0f3d5c]" />
            <h3>Aksi Pintas Pembaruan Konten</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pilih tindakan cepat untuk menambahkan data baru ke portal resmi:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab('dokumen')}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:bg-slate-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Unggah Dokumen Perencanaan Baru</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('berita')}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:bg-slate-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-emerald-600" />
                <span>Tulis Berita / Siaran Pers Baru</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('agenda')}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:bg-slate-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Jadwalkan Agenda Musrenbang / Rakor</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('sambutan')}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:bg-slate-50 transition flex items-center justify-between text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#0f3d5c]" />
                <span>Perbarui Sambutan & Foto Pimpinan</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Pending Tickets & Moderation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3>Aspirasi & Pengaduan Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigateTab('pengaduan')}
              className="text-xs font-bold text-[#0f3d5c] hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                onClick={() => onNavigateTab('pengaduan')}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/80 transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#0f3d5c]">
                    {comp.ticketNo}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    comp.status === 'Selesai' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : comp.status === 'Sedang Diproses'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {comp.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {comp.subject}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{comp.name} ({comp.regency})</span>
                  <span>{comp.createdAt.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Publication Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3>Status Integrasi & Sinkronisasi</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Penyimpanan Lokal (Cache Browser)</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktif & Tersinkron</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Integrasi UU No. 14 Thn 2022</span>
              <span className="font-bold text-slate-800">4 Wilayah Anim Ha</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Format Dokumen Didukung</span>
              <span className="font-bold text-slate-800">PDF, DOCX, XLSX, TXT</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Waktu Layanan Resmi</span>
              <span className="font-bold text-slate-800">08.00 - 16.00 WIT</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => onNavigateTab('video-beranda')}
              className="w-full py-2.5 bg-[#0f3d5c]/10 hover:bg-[#0f3d5c]/20 text-[#0f3d5c] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-amber-600" />
              <span>Kelola & Unggah Video Beranda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('instansi')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Konfigurasi Link Layanan & Kontak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
