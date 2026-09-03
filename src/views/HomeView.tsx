import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  BarChart3, 
  Microscope, 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { ActivePage, NewsArticle, PlanningDocument, AgendaEvent } from '../types';
import { PapuaSelatanLogo, BapperidaLogo } from '../components/Logos';

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  articles: NewsArticle[];
  documents: PlanningDocument[];
  agendas: AgendaEvent[];
  onSelectDocument: (doc: PlanningDocument) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export function HomeView({
  setActivePage,
  articles,
  documents,
  agendas,
  onSelectDocument,
  onSelectArticle
}: HomeViewProps) {
  const latestArticles = articles.slice(0, 3);
  const upcomingAgendas = agendas.slice(0, 3);
  const highlightedDocs = documents.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2f47] via-[#0f3d5c] to-[#185377] text-white">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Resmi Perencanaan, Riset & Inovasi Daerah</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Perencanaan Terpadu, <br className="hidden sm:block" />
                  <span className="text-amber-400">Riset & Inovasi</span> untuk Papua Selatan Maju
                </h1>
                <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                  Mewujudkan tata kelola perencanaan pembangunan daerah yang transparan, berbasis data, dan adaptif terhadap kearifan lokal di 4 Kabupaten: <strong>Merauke, Boven Digoel, Mappi,</strong> dan <strong>Asmat</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActivePage('dokumen')}
                  className="px-5 py-3 rounded-lg font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-2 group"
                  id="hero-cta-dokumen"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Akses Dokumen Perencanaan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setActivePage('pengaduan')}
                  className="px-5 py-3 rounded-lg font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs transition flex items-center gap-2"
                  id="hero-cta-pengaduan"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Sampaikan Pengaduan</span>
                </button>
              </div>

              {/* Verified Badges */}
              <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>RPJPD 2025–2045</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Keterbukaan PPID</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SP4N Terintegrasi</span>
                </div>
              </div>
            </div>

            {/* Right Card: Building Image & Agency Info */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900/60 backdrop-blur-md group">
                <div className="aspect-4/3 w-full relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80"
                    alt="Pusat Pemerintahan Provinsi Papua Selatan"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-5 space-y-2 text-white">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>Kompleks Kantor Pemerintahan Provinsi Papua Selatan</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold leading-snug">
                    Pusat Perumusan Kebijakan & Pengendalian Pembangunan Wilayah Anim Ha
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Berlokasi di Salor, Merauke — mengoordinasikan keselarasan dokumen RPJPD, RKPD, serta inovasi daerah bersama 4 Kabupaten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Indicators Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="flex items-center gap-3 pt-2 lg:pt-0">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Cakupan Wilayah</div>
              <div className="text-lg font-bold text-slate-900">4 Kabupaten</div>
              <div className="text-[11px] text-slate-400">Merauke, Boven Digoel, Mappi, Asmat</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
            <div className="p-3 bg-blue-50 rounded-lg text-[#0f3d5c]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Dokumen Perencanaan</div>
              <div className="text-lg font-bold text-slate-900">48+ Dokumen</div>
              <div className="text-[11px] text-emerald-600 font-medium">Tersedia Publik (PDF)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Pertumbuhan Ekonomi</div>
              <div className="text-lg font-bold text-slate-900">5.12% YoY</div>
              <div className="text-[11px] text-emerald-600 font-medium">Kuartal Terakhir 2025/2026</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Indeks Pembangunan (IPM)</div>
              <div className="text-lg font-bold text-slate-900">62.45</div>
              <div className="text-[11px] text-indigo-600 font-medium">Kategori Sedang / Meningkat</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Akses Layanan Cepat (Quick Services Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
            Layanan Digital Bapperida
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Akses Cepat Kanal Pelayanan Publik & Informasi
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Pusat akses dokumen resmi, permohonan informasi PPID, pelaporan aspirasi, dan data statistik makro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Dokumen Perencanaan */}
          <div 
            onClick={() => setActivePage('dokumen')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0f3d5c] flex items-center justify-center mb-4 group-hover:bg-[#0f3d5c] group-hover:text-white transition">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Dokumen Perencanaan Daerah
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unduh salinan resmi RPJPD 2025–2045, RKPD tahunan, Renstra, Renja, dan KUA-PPAS Provinsi Papua Selatan.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Buka Repositori Dokumen</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Layanan PPID */}
          <div 
            onClick={() => setActivePage('layanan')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Layanan Informasi Publik (PPID)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Ajukan permohonan informasi publik secara online, unduh formulir PPID, dan pelajari alur layanan resmi.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Ajukan Permohonan PPID</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Pengaduan & Lacak Tiket */}
          <div 
            onClick={() => setActivePage('pengaduan')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Pengaduan & Lacak Tiket
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sampaikan aspirasi infrastruktur dan perencanaan daerah, serta pantau status penanganan tiket secara real-time.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Formulir & Tracking Tiket</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: BRIDA (Riset & Inovasi Daerah) */}
          <div 
            onClick={() => setActivePage('berita')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Riset & Inovasi Daerah (BRIDA)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Hasil kajian ilmiah komoditas sagu, logistik rawa, ketahanan pangan, dan kolaborasi bersama BRIN serta perguruan tinggi.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Eksplorasi Riset Unggulan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5: Data & Statistik */}
          <div 
            onClick={() => setActivePage('data-statistik')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Data & Indikator Makro Daerah
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Visualisasi tren angka kemiskinan, IPM, laju inflasi, dan perbandingan potensi 4 Kabupaten Papua Selatan.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Lihat Grafik & Statistik</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6: Agenda & Musrenbang */}
          <div 
            onClick={() => setActivePage('agenda')}
            className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
              Agenda & Kegiatan Bapperida
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Jadwal pelaksanaan Musrenbang, rapat koordinasi perencanaan kewilayahan, dan bimbingan teknis OPD se-Papua Selatan.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
              <span>Cek Jadwal Agenda</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Highlight Dokumen Perencanaan Terkini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#0f3d5c] uppercase tracking-wider block">
                Publikasi Resmi
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Dokumen Perencanaan Pembangunan Prioritas
              </h3>
            </div>
            <button
              onClick={() => setActivePage('dokumen')}
              className="text-xs font-bold text-[#0f3d5c] hover:underline flex items-center gap-1"
            >
              Semua Dokumen ({documents.length}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlightedDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Tahun {doc.year}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 hover:text-[#0f3d5c] line-clamp-2">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Ukuran: {doc.fileSize}</span>
                  <span className="font-bold text-[#0f3d5c]">Lihat & Unduh PDF →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Berita Terkini & Agenda Berdampingan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Berita (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Informasi & Kabar Daerah
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Berita & Siaran Pers Bapperida
                </h3>
              </div>
              <button
                onClick={() => setActivePage('berita')}
                className="text-xs font-bold text-[#0f3d5c] hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {latestArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col group"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span className="font-semibold text-amber-700">{art.category}</span>
                        <span>{art.publishedAt}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0f3d5c] line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                        {art.summary}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-[#0f3d5c] flex items-center justify-between">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Mendatang (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Kalender Kerja
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Agenda Mendatang
                </h3>
              </div>
              <button
                onClick={() => setActivePage('agenda')}
                className="text-xs font-bold text-[#0f3d5c] hover:underline"
              >
                Lengkap →
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAgendas.map((ag) => {
                const [year, month, day] = ag.date.split('-');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
                const monthLabel = monthNames[parseInt(month, 10) - 1] || 'Bln';

                return (
                  <div
                    key={ag.id}
                    onClick={() => setActivePage('agenda')}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] hover:shadow-xs transition cursor-pointer flex gap-3.5 items-start"
                  >
                    <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-lg font-black text-[#0f3d5c] leading-none">{day}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{monthLabel} {year}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-blue-50 text-[#0f3d5c] mb-1">
                        {ag.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {ag.title}
                      </h5>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ag.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Wilayah Kerja 4 Kabupaten Anim Ha */}
      <section className="bg-slate-100 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Integrasi Spasial Anim Ha
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Karakteristik & Potensi 4 Wilayah Kabupaten
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Sinergi dokumen perencanaan pembangunan antara Pemerintah Provinsi Papua Selatan bersama Pemerintah Kabupaten.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                Kabupaten Merauke
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Ibukota & Sentra Pangan</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Pusat administrasi provinsi di Salor, lumbung beras nasional, pelabuhan ekspor perikanan, serta bandara internasional Mopah.
              </p>
              <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                Luas: <strong>46.792 km²</strong> • IPM: <strong>71.20</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                Kabupaten Boven Digoel
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Perbatasan & Perkebunan</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Ibukota Tanah Merah, sentra kelapa sawit dan komoditas kehutanan berkelanjutan, serta simpul lintas batas RI-PNG.
              </p>
              <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                Luas: <strong>27.108 km²</strong> • IPM: <strong>62.40</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                Kabupaten Mappi
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Rawa Sagu & Logistik Sungai</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Ibukota Kepi, potensi jutaan hektar hutan sagu alam, perikanan air tawar endemik, dan koridor transportasi air pedalaman.
              </p>
              <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                Luas: <strong>28.518 km²</strong> • IPM: <strong>59.80</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                Kabupaten Asmat
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-2">Budaya Ukir Dunia & Maritim</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Ibukota Agats, kota papan di atas rawa, seni ukir kayu legendaris warisan UNESCO, perikanan udang, dan konservasi mangrove.
              </p>
              <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                Luas: <strong>31.983 km²</strong> • IPM: <strong>52.10</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
