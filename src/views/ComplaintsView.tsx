import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  User,
  MapPin,
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';
import { StorageService } from '../services/storage';
import { ScrollReveal } from '../components/ScrollAnimations';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface ComplaintsViewProps {
  complaints: Complaint[];
  onComplaintCreated: (newComp: Complaint) => void;
}

export function ComplaintsView({ complaints, onComplaintCreated }: ComplaintsViewProps) {
  const [activeTab, setActiveTab] = useState<'lacak' | 'buat'>('buat');
  
  // Track state
  const [searchTicket, setSearchTicket] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null | 'not_found'>(null);

  // Form state
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<Complaint['category']>('Infrastruktur');
  const [regency, setRegency] = useState<Complaint['regency']>('Merauke');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  
  // Success state
  const [createdTicket, setCreatedTicket] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTicket.trim()) return;

    const found = StorageService.findComplaintByTicket(searchTicket);
    if (found) {
      setSearchedComplaint(found);
    } else {
      setSearchedComplaint('not_found');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !subject || !description) return;

    const newComp = StorageService.createComplaint({
      name,
      nik: nik || undefined,
      email,
      phone,
      category,
      regency,
      subject,
      description
    });

    onComplaintCreated(newComp);
    setCreatedTicket(newComp);
    setName('');
    setNik('');
    setEmail('');
    setPhone('');
    setSubject('');
    setDescription('');
  };

  const handleCopyTicket = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">Menunggu Verifikasi</span>;
      case 'Sedang Diproses':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">Sedang Diproses</span>;
      case 'Ditindaklanjuti':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">Ditindaklanjuti</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Selesai</span>;
    }
  };

  const getStepActiveIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Menunggu Verifikasi': return 1;
      case 'Sedang Diproses': return 2;
      case 'Ditindaklanjuti': return 3;
      case 'Selesai': return 4;
    }
  };

  return (
    <div className="w-full pb-16 space-y-8">
      {/* Header Banner - Full Width Kiri & Kanan Mentok dengan Siluet Rusa di Sebelah Kanan */}
      <PageHeaderBanner
        badgeIcon={<ShieldCheck className="w-4 h-4" />}
        badgeText="Kanal Aspirasi & Pengaduan Masyarakat"
        title="Layanan Pengaduan & Aspirasi Bapperida"
        description="Salurkan pengaduan, masukan perencanaan infrastruktur, serta aspirasi pembangunan wilayah Anim Ha secara langsung dan terpantau dengan nomor tiket transparan."
      >
        {/* Tab switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('buat')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'buat'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Sampaikan Pengaduan Baru
          </button>
          <button
            onClick={() => setActiveTab('lacak')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'lacak'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak Status Tiket Pengaduan</span>
          </button>
        </div>
      </PageHeaderBanner>

      {/* Main Content Area - Boxed */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-8">

      {/* Mode 1: Buat Pengaduan */}
      {activeTab === 'buat' && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            {createdTicket && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Pengaduan Anda Berhasil Terkirim!
                  </span>
                  <button 
                    onClick={() => handleCopyTicket(createdTicket.ticketNo)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white border border-emerald-300 rounded text-emerald-800 hover:bg-emerald-100"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Tersalin!' : 'Salin Nomor'}</span>
                  </button>
                </div>
                <p className="text-xs leading-relaxed">
                  Pengaduan Anda telah masuk ke sistem Bapperida Provinsi Papua Selatan dengan nomor tiket resmi:
                </p>
                <div className="p-3 bg-white rounded-lg border border-emerald-300 font-mono font-black text-base text-[#0f3d5c]">
                  {createdTicket.ticketNo}
                </div>
                <p className="text-[11px] text-emerald-800">
                  Gunakan nomor tiket ini pada tab <strong>"Lacak Status Tiket"</strong> untuk memantau proses tindak lanjut tim perencana kami.
                </p>
                <button
                  onClick={() => {
                    setSearchTicket(createdTicket.ticketNo);
                    setActiveTab('lacak');
                    setSearchedComplaint(createdTicket);
                  }}
                  className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1"
                >
                  Lacak Tiket Ini Sekarang →
                </button>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Formulir Aspirasi & Pengaduan
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Pengaduan akan diverifikasi oleh sekretariat dan diteruskan ke bidang teknis Bapperida terkait.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pelapor *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama sesuai identitas KTP"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={e => setNik(e.target.value)}
                    placeholder="16 digit (opsional/rahasia)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="081248xxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Pengaduan *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-hidden"
                  >
                    <option value="Infrastruktur">Infrastruktur (Jalan, Jembatan, Pelabuhan)</option>
                    <option value="Perencanaan Wilayah">Perencanaan Wilayah & Tata Ruang</option>
                    <option value="Pelayanan Publik">Pelayanan Publik & Penyelenggaraan Pemda</option>
                    <option value="Transparansi & Anggaran">Transparansi Dokumen & Anggaran</option>
                    <option value="Riset & Inovasi">Riset & Inovasi Daerah (BRIDA)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kabupaten Terkait *
                  </label>
                  <select
                    value={regency}
                    onChange={e => setRegency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-hidden"
                  >
                    <option value="Merauke">Kabupaten Merauke</option>
                    <option value="Boven Digoel">Kabupaten Boven Digoel</option>
                    <option value="Mappi">Kabupaten Mappi</option>
                    <option value="Asmat">Kabupaten Asmat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjek / Judul Pengaduan *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Ringkasan pokok pengaduan atau usulan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Lengkap Pengaduan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Jelaskan secara kronologis, sebutkan nama distrik/kampung, permasalahan yang dihadapi, serta harapan tindak lanjut..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] transition flex items-center gap-2 cursor-pointer"
                  id="submit-complaint-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Pengaduan</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                Petunjuk Pelaporan
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>Sampaikan informasi yang valid dan dapat dipertanggungjawabkan.</li>
                <li>Identitas pelapor dijamin kerahasiaannya sesuai ketentuan perlindungan saksi/pelapor.</li>
                <li>Setiap pengaduan akan mendapatkan Nomor Tiket unik untuk dipantau secara mandiri.</li>
                <li>Bapperida PPS berkomitmen menindaklanjuti setiap aspirasi dalam waktu 3 hingga 5 hari kerja.</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-3">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Sudah Pernah Melapor?
              </span>
              <p className="text-xs text-blue-800 leading-relaxed">
                Punya nomor tiket seperti <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">BAP-PPS-202608-019</code>? Cek status tindak lanjutnya sekarang.
              </p>
              <button
                onClick={() => {
                  setSearchTicket('BAP-PPS-202608-019');
                  setActiveTab('lacak');
                  const found = StorageService.findComplaintByTicket('BAP-PPS-202608-019');
                  if (found) setSearchedComplaint(found);
                }}
                className="text-xs font-bold text-[#0f3d5c] hover:underline flex items-center gap-1"
              >
                Coba Contoh Tiket #019 →
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
      )}

      {/* Mode 2: Lacak Status Tiket */}
      {activeTab === 'lacak' && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="space-y-6">
            {/* Tracking Search Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Lacak Progres Tiket Pengaduan
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan nomor tiket yang Anda peroleh saat mengirim pengaduan.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={searchTicket}
                  onChange={e => setSearchTicket(e.target.value)}
                  placeholder="Contoh: BAP-PPS-202608-019"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-[#0f3d5c] font-mono uppercase font-semibold text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white text-xs font-bold rounded-lg transition"
                id="btn-cari-tiket"
              >
                Cek Status
              </button>
            </form>

            {/* Quick list of sample tickets for easy testing */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Sampel Tiket Siap Uji:</span>
              {['BAP-PPS-202608-019', 'BAP-PPS-202608-033', 'BAP-PPS-202609-002'].map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSearchTicket(code);
                    const found = StorageService.findComplaintByTicket(code);
                    if (found) setSearchedComplaint(found);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono border"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Output */}
          {searchedComplaint === 'not_found' && (
            <div className="bg-white p-8 rounded-2xl border border-red-200 max-w-3xl mx-auto text-center space-y-2 text-red-900">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h4 className="font-bold text-sm">Nomor Tiket Tidak Ditemukan</h4>
              <p className="text-xs text-slate-600">
                Pastikan nomor tiket yang Anda masukkan sesuai format (contoh: <code>BAP-PPS-202608-019</code>).
              </p>
            </div>
          )}

          {typeof searchedComplaint === 'object' && searchedComplaint && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 max-w-3xl mx-auto space-y-6 animate-in fade-in">
              {/* Header result */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-base text-[#0f3d5c]">
                      {searchedComplaint.ticketNo}
                    </span>
                    {getStatusBadge(searchedComplaint.status)}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {searchedComplaint.subject}
                  </h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Diajukan: {searchedComplaint.createdAt}</span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                  Tahapan Penanganan
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { label: 'Verifikasi', step: 1 },
                    { label: 'Diproses', step: 2 },
                    { label: 'Ditindaklanjuti', step: 3 },
                    { label: 'Selesai', step: 4 },
                  ].map(s => {
                    const currentStep = getStepActiveIndex(searchedComplaint.status);
                    const isDone = currentStep >= s.step;
                    const isCurrent = currentStep === s.step;

                    return (
                      <div key={s.step} className="space-y-1">
                        <div className={`h-2 rounded-full ${
                          isDone ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}></div>
                        <span className={`text-[11px] font-semibold ${
                          isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detail information */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Pelapor</span>
                    <span className="font-semibold text-slate-800">{searchedComplaint.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kategori</span>
                    <span className="font-semibold text-slate-800">{searchedComplaint.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kabupaten</span>
                    <span className="font-semibold text-slate-800">{searchedComplaint.regency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pembaruan</span>
                    <span className="font-semibold text-slate-800">{searchedComplaint.updatedAt}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-slate-700 block mb-1">Rincian Pengaduan / Aspirasi:</span>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{searchedComplaint.description}"
                  </p>
                </div>
              </div>

              {/* Official Response */}
              {searchedComplaint.response ? (
                <div className="p-5 bg-blue-50 border-l-4 border-[#0f3d5c] rounded-r-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#0f3d5c] font-bold">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Tanggapan Resmi Bapperida Provinsi Papua Selatan:
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Oleh: {searchedComplaint.responderName || 'Tim Teknis'}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {searchedComplaint.response}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pengaduan sedang dalam telaah tim perencanaan. Tanggapan resmi akan segera diperbarui.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>
      )}
      </div>
    </div>
  );
}
