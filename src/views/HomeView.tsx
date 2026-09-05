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
  Sparkles,
  Quote,
  Award
} from 'lucide-react';
import { ActivePage, NewsArticle, PlanningDocument, AgendaEvent } from '../types';
import { PapuaSelatanLogo, BapperidaLogo } from '../components/Logos';
import { StorageService } from '../services/storage';
import { HeroBanner } from '../components/HeroBanner';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

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

  // Dynamic CMS settings from StorageService
  const settings = StorageService.getAgencySettings();
  const indicatorStats = StorageService.getIndicatorStats();

  return (
    <div className="space-y-12 relative overflow-hidden">
      {/* 1. Hero Banner dengan Video & Animasi Masuk Pertama */}
      <HeroBanner setActivePage={setActivePage} />

      {/* 2. Key Indicators Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <ScrollReveal variant="fade-up" duration={0.7} distance={20}>
          <StaggerContainer staggerDelay={0.08} className="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <StaggerItem variant="zoom-in" className="flex items-center gap-3 pt-2 lg:pt-0">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Cakupan Wilayah</div>
                <div className="text-lg font-bold text-slate-900">4 Kabupaten</div>
                <div className="text-[11px] text-slate-400">Merauke, Boven Digoel, Mappi, Asmat</div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in" className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
              <div className="p-3 bg-blue-50 rounded-lg text-[#0f3d5c]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Dokumen Perencanaan</div>
                <div className="text-lg font-bold text-slate-900">{documents.length}+ Dokumen</div>
                <div className="text-[11px] text-emerald-600 font-medium">Tersedia Publik (PDF)</div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in" className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Pertumbuhan Ekonomi</div>
                <div className="text-lg font-bold text-slate-900">
                  {indicatorStats.length > 0 ? `${indicatorStats[indicatorStats.length - 1].growthRate}% YoY` : '5.12% YoY'}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  Periode {indicatorStats.length > 0 ? indicatorStats[indicatorStats.length - 1].year : '2025/2026'}
                </div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in" className="flex items-center gap-3 pt-4 lg:pt-0 lg:pl-6">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Indeks Pembangunan (IPM)</div>
                <div className="text-lg font-bold text-slate-900">
                  {indicatorStats.length > 0 ? indicatorStats[indicatorStats.length - 1].ipm : '62.45'}
                </div>
                <div className="text-[11px] text-indigo-600 font-medium">
                  Periode {indicatorStats.length > 0 ? indicatorStats[indicatorStats.length - 1].year : '2025/2026'}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </ScrollReveal>
      </section>

      {/* 2. Kata Sambutan Kepala Badan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10" id="sambutan-kepala-badan">
        <ScrollReveal variant="fade-up" duration={0.75} distance={30}>
          <div className="bg-gradient-to-br from-white via-slate-50/80 to-amber-50/30 rounded-2xl border border-slate-200 overflow-hidden">
            {/* Top Decorative Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0f3d5c] via-amber-500 to-[#185377]"></div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Foto Profil & Identitas Pimpinan (Slide-in dari kiri) */}
                <ScrollReveal variant="fade-right" duration={0.8} delay={0.1} className="lg:col-span-4 flex flex-col items-center">
                  <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
                    {/* Outer Accent Border */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 via-[#0f3d5c] to-amber-500 rounded-2xl opacity-60 group-hover:opacity-90 transition duration-500"></div>
                    
                    <div className="relative rounded-xl overflow-hidden bg-white border-2 border-white">
                      <img
                        src={settings.leaderPhoto}
                        alt={`Foto Profil ${settings.leaderName}`}
                        className="w-full aspect-[3/4] object-cover object-top filter contrast-[1.02] brightness-[1.01]"
                        referrerPolicy="no-referrer"
                      />

                      {/* Badge Overlay at Top */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0f3d5c]/90 text-amber-300 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>Pimpinan Tinggi Pratama</span>
                        </span>
                      </div>

                      {/* Gradient Overlay at Bottom with Name & Title */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b283d] via-[#0b283d]/90 to-transparent pt-10 pb-4 px-4 text-white text-center">
                        <h3 className="font-bold text-base sm:text-lg leading-tight text-white">
                          {settings.leaderName}
                        </h3>
                        <p className="text-[11px] text-amber-300 font-semibold mt-1">
                          {settings.leaderTitle}
                        </p>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {settings.leaderRank}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-badge: Kutipan Visi Singkat */}
                  <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-200 text-center w-full max-w-[280px] sm:max-w-[320px]">
                    <div className="flex items-center justify-center gap-1.5 text-amber-600 text-xs font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Motto Kepemimpinan</span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic leading-relaxed">
                      &ldquo;{settings.leaderMotto}&rdquo;
                    </p>
                  </div>
                </ScrollReveal>

                {/* Right Column: Isi Kata Sambutan Lengkap (Slide-in dari kanan) */}
                <ScrollReveal variant="fade-left" duration={0.8} delay={0.2} className="lg:col-span-8 space-y-5">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f3d5c]/10 text-[#0f3d5c] border border-[#0f3d5c]/20 text-xs font-bold">
                      <Quote className="w-3.5 h-3.5 text-amber-600" />
                      <span>Kata Sambutan Kepala Badan</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3d5c] tracking-tight leading-snug">
                      {settings.speechTitle}
                    </h2>
                    <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    <p className="font-semibold text-slate-900 text-sm">
                      {settings.speechOpening}
                    </p>
                    
                    <p>
                      {settings.speechBody}
                    </p>

                    <p>
                      {settings.speechClosing}
                    </p>
                  </div>

                  {/* 3 Value Pillars */}
                  <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <StaggerItem variant="fade-up" className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0f3d5c] mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RPJPD 2025–2045</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Pondasi transformasi ekonomi hijau, lumbung pangan nasional, dan SDM unggul.
                      </p>
                    </StaggerItem>

                    <StaggerItem variant="fade-up" className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0f3d5c] mb-1">
                        <Microscope className="w-3.5 h-3.5 text-blue-600" />
                        <span>Riset & Inovasi (BRIDA)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Hilirisasi komoditas sagu, pertanian pangan, dan inovasi berbasis ekosistem lokal.
                      </p>
                    </StaggerItem>

                    <StaggerItem variant="fade-up" className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0f3d5c] mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Keterbukaan Publik</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Transparansi dokumen publik PPID dan keterlibatan aspirasi warga secara real-time.
                      </p>
                    </StaggerItem>
                  </StaggerContainer>

                  {/* Bottom Signature Info & Buttons */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">
                        Salor, Merauke — Papua Selatan
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Bapperida Provinsi Papua Selatan
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() => setActivePage('profil')}
                        className="px-3.5 py-2 text-xs font-bold text-[#0f3d5c] hover:text-white bg-white hover:bg-[#0f3d5c] border border-slate-300 hover:border-[#0f3d5c] rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        id="sambutan-profil-btn"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Profil Lengkap Lembaga</span>
                      </button>
                      <button
                        onClick={() => setActivePage('dokumen')}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        id="sambutan-dokumen-btn"
                      >
                        <span>Arah Kebijakan RPJPD</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Akses Layanan Cepat (Quick Services Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal variant="fade-up" duration={0.65}>
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
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Dokumen Perencanaan */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('dokumen')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0f3d5c] flex items-center justify-center mb-4 group-hover:bg-[#0f3d5c] group-hover:text-white transition">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Dokumen Perencanaan Daerah
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Unduh salinan resmi RPJPD 2025–2045, RKPD tahunan, Renstra, Renja, dan KUA-PPAS Provinsi Papua Selatan.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Buka Repositori Dokumen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>

          {/* Card 2: Layanan PPID */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('layanan')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Layanan Informasi Publik (PPID)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ajukan permohonan informasi publik secara online, unduh formulir PPID, dan pelajari alur layanan resmi.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Ajukan Permohonan PPID</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>

          {/* Card 3: Pengaduan & Lacak Tiket */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('pengaduan')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Pengaduan & Lacak Tiket
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Sampaikan aspirasi infrastruktur dan perencanaan daerah, serta pantau status penanganan tiket secara real-time.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Formulir & Tracking Tiket</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>

          {/* Card 4: BRIDA (Riset & Inovasi Daerah) */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('berita')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Riset & Inovasi Daerah (BRIDA)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Hasil kajian ilmiah komoditas sagu, logistik rawa, ketahanan pangan, dan kolaborasi bersama BRIN serta perguruan tinggi.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Eksplorasi Riset Unggulan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>

          {/* Card 5: Data & Statistik */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('data-statistik')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Data & Indikator Makro Daerah
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Visualisasi tren angka kemiskinan, IPM, laju inflasi, dan perbandingan potensi 4 Kabupaten Papua Selatan.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Lihat Grafik & Statistik</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>

          {/* Card 6: Agenda & Musrenbang */}
          <StaggerItem variant="zoom-in">
            <div 
              onClick={() => setActivePage('agenda')}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0f3d5c] transition">
                  Agenda & Kegiatan Bapperida
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Jadwal pelaksanaan Musrenbang, rapat koordinasi perencanaan kewilayahan, dan bimbingan teknis OPD se-Papua Selatan.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0f3d5c]">
                <span>Cek Jadwal Agenda</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 4. Highlight Dokumen Perencanaan Terkini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal variant="fade-up" duration={0.7}>
          <div className="bg-slate-50/90 backdrop-blur-xs border border-slate-200 rounded-2xl p-6 sm:p-8">
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
                className="text-xs font-bold text-[#0f3d5c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Semua Dokumen ({documents.length}) <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlightedDocs.map((doc) => (
                <StaggerItem key={doc.id} variant="fade-up">
                  <div
                    onClick={() => onSelectDocument(doc)}
                    className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer flex flex-col justify-between h-full"
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Berita Terkini & Agenda Berdampingan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Berita (8 Cols) - Slide from Left */}
          <ScrollReveal variant="fade-right" duration={0.75} className="lg:col-span-8 space-y-6">
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
                className="text-xs font-bold text-[#0f3d5c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <StaggerContainer staggerDelay={0.09} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {latestArticles.map((art) => (
                <StaggerItem key={art.id} variant="fade-up">
                  <div
                    onClick={() => onSelectArticle(art)}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0f3d5c] transition cursor-pointer flex flex-col group h-full"
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>

          {/* Agenda Mendatang (4 Cols) - Slide from Right */}
          <ScrollReveal variant="fade-left" duration={0.75} className="lg:col-span-4 space-y-4">
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
                className="text-xs font-bold text-[#0f3d5c] hover:underline cursor-pointer"
              >
                Lengkap →
              </button>
            </div>

            <StaggerContainer staggerDelay={0.08} className="space-y-3">
              {upcomingAgendas.map((ag) => {
                const [year, month, day] = ag.date.split('-');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
                const monthLabel = monthNames[parseInt(month, 10) - 1] || 'Bln';

                return (
                  <StaggerItem key={ag.id} variant="fade-left">
                    <div
                      onClick={() => setActivePage('agenda')}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#0f3d5c] transition cursor-pointer flex gap-3.5 items-start"
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
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Wilayah Kerja 4 Kabupaten Anim Ha */}
      <section className="bg-slate-100/80 backdrop-blur-xs py-12 border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal variant="fade-up" duration={0.65}>
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
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.09} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem variant="zoom-in">
              <div className="bg-white p-5 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Kabupaten Merauke
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">Ibukota & Sentra Pangan</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Pusat administrasi provinsi di Salor, lumbung beras nasional, pelabuhan ekspor perikanan, serta bandara internasional Mopah.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                  Luas: <strong>46.792 km²</strong> • IPM: <strong>71.20</strong>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in">
              <div className="bg-white p-5 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    Kabupaten Boven Digoel
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">Perbatasan & Perkebunan</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Ibukota Tanah Merah, sentra kelapa sawit dan komoditas kehutanan berkelanjutan, serta simpul lintas batas RI-PNG.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                  Luas: <strong>27.108 km²</strong> • IPM: <strong>62.40</strong>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in">
              <div className="bg-white p-5 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                    Kabupaten Mappi
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">Rawa Sagu & Logistik Sungai</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Ibukota Kepi, potensi jutaan hektar hutan sagu alam, perikanan air tawar endemik, dan koridor transportasi air pedalaman.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                  Luas: <strong>28.518 km²</strong> • IPM: <strong>59.80</strong>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem variant="zoom-in">
              <div className="bg-white p-5 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                    Kabupaten Asmat
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">Budaya Ukir Dunia & Maritim</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Ibukota Agats, kota papan di atas rawa, seni ukir kayu legendaris warisan UNESCO, perikanan udang, dan konservasi mangrove.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 border-t pt-2">
                  Luas: <strong>31.983 km²</strong> • IPM: <strong>52.10</strong>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
