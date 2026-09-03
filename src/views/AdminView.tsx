import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Newspaper, 
  MessageSquare, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Send,
  Lock,
  LogOut,
  Clock
} from 'lucide-react';
import { PlanningDocument, NewsArticle, Complaint, AgendaEvent, DocumentCategory, ComplaintStatus } from '../types';
import { StorageService } from '../services/storage';

interface AdminViewProps {
  documents: PlanningDocument[];
  news: NewsArticle[];
  complaints: Complaint[];
  agendas: AgendaEvent[];
  onDataChanged: () => void;
}

export function AdminView({ documents, news, complaints, agendas, onDataChanged }: AdminViewProps) {
  // Simple simulation auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<'dokumen' | 'berita' | 'pengaduan' | 'agenda'>('pengaduan');

  // New Document state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('RKPD');
  const [docYear, setDocYear] = useState('2026');
  const [docDescription, setDocDescription] = useState('');
  const [docLegalBasis, setDocLegalBasis] = useState('');
  const [docFileSize, setDocFileSize] = useState('8.5 MB');

  // New News state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Pembangunan');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('Humas Bapperida Papua Selatan');

  // Complaint response state
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Sedang Diproses');
  const [officialResponse, setOfficialResponse] = useState('');
  const [responderName, setResponderName] = useState('Tim Teknis Perencanaan Bapperida PPS');

  // New Agenda state
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDate, setAgendaDate] = useState('2026-09-15');
  const [agendaTime, setAgendaTime] = useState('09.00 - 15.00 WIT');
  const [agendaLocation, setAgendaLocation] = useState('Aula Kantor Gubernur Papua Selatan, Salor, Merauke');
  const [agendaOrganizer, setAgendaOrganizer] = useState('Bapperida Provinsi Papua Selatan');
  const [agendaCategory, setAgendaCategory] = useState('Musrenbang');

  // Handlers
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docDescription || !docLegalBasis) return;

    StorageService.addDocument({
      title: docTitle,
      category: docCategory,
      year: docYear,
      regency: 'Provinsi',
      description: docDescription,
      legalBasis: docLegalBasis,
      fileSize: docFileSize,
      fileFormat: 'PDF'
    });

    setDocTitle('');
    setDocDescription('');
    setDocLegalBasis('');
    onDataChanged();
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      StorageService.deleteDocument(id);
      onDataChanged();
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsContent) return;

    StorageService.addArticle({
      title: newsTitle,
      slug: newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: newsCategory as any,
      summary: newsSummary,
      content: newsContent,
      author: newsAuthor,
      publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      tags: [newsCategory, 'Papua Selatan']
    });

    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    onDataChanged();
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel berita ini?')) {
      StorageService.deleteArticle(id);
      onDataChanged();
    }
  };

  const handleUpdateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompId || !officialResponse) return;

    StorageService.updateComplaintStatus(selectedCompId, newStatus, officialResponse, responderName);
    setSelectedCompId(null);
    setOfficialResponse('');
    onDataChanged();
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle) return;

    StorageService.addAgenda({
      title: agendaTitle,
      date: agendaDate,
      time: agendaTime,
      location: agendaLocation,
      organizer: agendaOrganizer,
      description: `Rapat koordinasi teknis ${agendaTitle} bersama stakeholder terkait.`,
      status: 'Akan Datang',
      category: agendaCategory
    });

    setAgendaTitle('');
    onDataChanged();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4" />
            <span>Panel Pengelola Konten (CMS Internal)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Pengelola Portal Bapperida PPS
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Kelola data dokumen perencanaan, rilis berita, tanggapan pengaduan warga, dan kalender kegiatan daerah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-lg text-xs font-mono font-bold">
            ● Mode Administrator Aktif
          </span>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Dokumen Perencanaan</span>
          <div className="text-2xl font-black text-[#0f3d5c] mt-1">{documents.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">File publikasi aktif</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Berita & Rilis</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{news.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Artikel kegiatan</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pengaduan Masuk</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{complaints.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Tiket aspirasi warga</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Agenda Terjadwal</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{agendas.length}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Kegiatan kedinasan</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'pengaduan', label: `Pengaduan Warga (${complaints.length})`, icon: MessageSquare },
          { id: 'dokumen', label: `Dokumen Perencanaan (${documents.length})`, icon: FileText },
          { id: 'berita', label: `Berita & Publikasi (${news.length})`, icon: Newspaper },
          { id: 'agenda', label: `Agenda Kegiatan (${agendas.length})`, icon: Calendar },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#0f3d5c] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PENGADUAN & ASPIRASI */}
      {activeTab === 'pengaduan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Tiket Pengaduan & Tindak Lanjut Respons Resmi
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 font-bold">No. Tiket</th>
                    <th className="p-3 font-bold">Pelapor</th>
                    <th className="p-3 font-bold">Kategori & Kab.</th>
                    <th className="p-3 font-bold">Subjek</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {complaints.map(comp => (
                    <tr key={comp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-[#0f3d5c]">{comp.ticketNo}</td>
                      <td className="p-3 font-semibold text-slate-800">{comp.name}</td>
                      <td className="p-3 text-slate-600">{comp.category} ({comp.regency})</td>
                      <td className="p-3 text-slate-800 max-w-xs truncate">{comp.subject}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          comp.status === 'Selesai' ? 'bg-emerald-100 text-emerald-900' :
                          comp.status === 'Ditindaklanjuti' ? 'bg-purple-100 text-purple-900' :
                          comp.status === 'Sedang Diproses' ? 'bg-blue-100 text-blue-900' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {comp.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedCompId(comp.id);
                            setNewStatus(comp.status);
                            setOfficialResponse(comp.response || '');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#0f3d5c] text-white rounded hover:bg-[#154e74]"
                        >
                          Tanggapi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal / Panel Response Form */}
          {selectedCompId && (
            <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-[#0f3d5c] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">
                  Perbarui Status & Tulis Tanggapan Resmi
                </h4>
                <button
                  onClick={() => setSelectedCompId(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Tutup ✕
                </button>
              </div>

              <form onSubmit={handleUpdateComplaint} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status Penanganan Baru:</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Sedang Diproses">Sedang Diproses</option>
                      <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Pejabat / Unit Penjawab:</label>
                    <input
                      type="text"
                      value={responderName}
                      onChange={e => setResponderName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Uraian Jawaban / Tanggapan Kedinasan:</label>
                  <textarea
                    rows={3}
                    required
                    value={officialResponse}
                    onChange={e => setOfficialResponse(e.target.value)}
                    placeholder="Tuliskan hasil telaah dokumen, alokasi anggaran, atau instruksi tindak lanjut lapangan..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0f3d5c] hover:bg-[#154e74] text-white font-bold rounded-lg text-xs"
                  >
                    Simpan Tanggapan Resmi
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCompId(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DOKUMEN PERENCANAAN */}
      {activeTab === 'dokumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Add Doc (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Unggah Dokumen Perencanaan Baru
            </h3>

            <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama / Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  placeholder="Contoh: RKPD Provinsi Papua Selatan Tahun 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Dokumen *</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="RPJPD">RPJPD (20 Tahun)</option>
                    <option value="RPJMD">RPJMD (5 Tahun)</option>
                    <option value="RKPD">RKPD (Tahunan)</option>
                    <option value="Renstra">Renstra Perangkat Daerah</option>
                    <option value="Renja">Renja Tahunan</option>
                    <option value="KUA-PPAS">KUA-PPAS Anggaran</option>
                    <option value="LKPJ">LKPJ Gubernur</option>
                    <option value="Kajian Riset & Inovasi">Kajian Riset & Inovasi (BRIDA)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Rencana *</label>
                  <input
                    type="text"
                    required
                    value={docYear}
                    onChange={e => setDocYear(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dasar Hukum / Nomor SK Penetapan *</label>
                <input
                  type="text"
                  required
                  value={docLegalBasis}
                  onChange={e => setDocLegalBasis(e.target.value)}
                  placeholder="Contoh: Pergub Papua Selatan No. 12 Tahun 2025"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Dokumen *</label>
                <textarea
                  rows={3}
                  required
                  value={docDescription}
                  onChange={e => setDocDescription(e.target.value)}
                  placeholder="Ringkasan isi berkas..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
              >
                Terbitkan Dokumen ke Repositori
              </button>
            </form>
          </div>

          {/* List Existing Docs (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Dokumen Terdaftar ({documents.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {documents.map(doc => (
                <div key={doc.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">{doc.category}</span>
                      <span className="text-[10px] text-slate-400">Tahun {doc.year}</span>
                    </div>
                    <h5 className="font-bold text-slate-900">{doc.title}</h5>
                    <span className="text-[11px] text-slate-500">{doc.legalBasis}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BERITA & PUBLIKASI */}
      {activeTab === 'berita' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Add News */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Tulis Rilis Berita Baru
            </h3>

            <form onSubmit={handleAddNews} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={e => setNewsTitle(e.target.value)}
                  placeholder="Judul artikel berita kegiatan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Berita</label>
                <select
                  value={newsCategory}
                  onChange={e => setNewsCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Musrenbang">Musrenbang</option>
                  <option value="Riset & Inovasi">Riset & Inovasi</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Berita *</label>
                <textarea
                  rows={2}
                  required
                  value={newsSummary}
                  onChange={e => setNewsSummary(e.target.value)}
                  placeholder="Ringkasan singkat untuk tampilan kartu..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Berita Lengkap *</label>
                <textarea
                  rows={5}
                  required
                  value={newsContent}
                  onChange={e => setNewsContent(e.target.value)}
                  placeholder="Tuliskan berita lengkap..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white font-bold rounded-lg text-xs transition"
              >
                Publikasikan Berita
              </button>
            </form>
          </div>

          {/* List News */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Daftar Berita Aktif ({news.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {news.map(item => (
                <div key={item.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">{item.category}</span>
                    <h5 className="font-bold text-slate-900 mt-1 line-clamp-1">{item.title}</h5>
                    <span className="text-[11px] text-slate-400">{item.publishedAt}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AGENDA */}
      {activeTab === 'agenda' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-slate-900">
            Tambah Agenda Kegiatan Kedinasan Baru
          </h3>
          <form onSubmit={handleAddAgenda} className="space-y-3 text-xs max-w-2xl">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Agenda / Acara *</label>
              <input
                type="text"
                required
                value={agendaTitle}
                onChange={e => setAgendaTitle(e.target.value)}
                placeholder="Contoh: Rapat Sinkronisasi Rencana Kerja Bapperida & Bappeda 4 Kabupaten"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal (YYYY-MM-DD) *</label>
                <input
                  type="date"
                  required
                  value={agendaDate}
                  onChange={e => setAgendaDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan *</label>
                <input
                  type="text"
                  required
                  value={agendaTime}
                  onChange={e => setAgendaTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi / Tempat *</label>
              <input
                type="text"
                required
                value={agendaLocation}
                onChange={e => setAgendaLocation(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white font-bold rounded-lg text-xs transition"
            >
              Simpan Agenda Kegiatan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
