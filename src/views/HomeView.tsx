import React, { useState, useEffect } from 'react';
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
  CheckCircle2, 
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
  const [settings, setSettings] = useState(() => StorageService.getAgencySettings());

  useEffect(() => {
    const handleSync = () => {
      setSettings(StorageService.getAgencySettings());
    };
    window.addEventListener('bapperida:data-synced', handleSync);
    return () => window.removeEventListener('bapperida:data-synced', handleSync);
  }, []);

  return (
    <div className="space-y-16 pb-16 relative overflow-hidden bg-slate-50/30">
      {/* Subtle Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[15%] -left-[10%] w-[40%] h-[500px] rounded-full bg-amber-500/5 blur-[120px]"></div>
        <div className="absolute top-[45%] -right-[5%] w-[35%] h-[600px] rounded-full bg-[#0f3d5c]/5 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[400px] rounded-full bg-teal-500/5 blur-[120px]"></div>
      </div>

      {/* 1. Hero Banner dengan Video & Animasi Masuk Pertama */}
      <HeroBanner setActivePage={setActivePage} />

      {/* 2. Kata Sambutan Kepala Badan */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10" id="sambutan-kepala-badan">
        <ScrollReveal variant="fade-up" duration={0.6} distance={20}>
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Foto Profil & Identitas Pimpinan */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div className="w-full max-w-[260px] sm:max-w-[290px] flex flex-col items-center">
                    {/* Clean Frame Foto */}
                    <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative">
                      <img
                        src={settings.leaderPhoto}
                        alt={`Foto Profil ${settings.leaderName}`}
                        className="w-full aspect-[3/4] object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Identitas Pimpinan di Bawah Foto (Jelas & Rapi) */}
                    <div className="text-center mt-3.5 w-full space-y-1">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {settings.leaderName}
                      </h3>
                      <p className="text-xs font-semibold text-amber-600">
                        {settings.leaderTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {settings.leaderRank}
                      </p>
                      {settings.leaderMotto && (
                        <p className="text-xs italic text-slate-600 mt-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed">
                          &ldquo;{settings.leaderMotto}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Tampilan Tulisan Sambutan (Sederhana, Bersih & Nyaman Dibaca) */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Header Sambutan */}
                  <div className="border-b border-slate-100 pb-3 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Kata Sambutan Kepala Badan
                    </span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0f3d5c] tracking-tight leading-snug">
                      {settings.speechTitle}
                    </h2>
                  </div>

                  {/* Isi Teks Sambutan yang Sederhana & Nyaman */}
                  <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">
                      {settings.speechOpening}
                    </p>
                    
                    <p className="whitespace-pre-line text-slate-600 text-sm sm:text-base leading-relaxed">
                      {settings.speechBody}
                    </p>

                    <p className="text-slate-800 text-sm sm:text-base font-medium">
                      {settings.speechClosing}
                    </p>
                  </div>

                  {/* Bagian Penandatangan & Aksi Cepat */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Bapperida Provinsi Papua Selatan
                      </span>
                      <span className="text-xs text-slate-500">
                        Salor, Merauke — Papua Selatan
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setActivePage('profil')}
                        className="px-4 py-2 text-xs font-semibold text-[#0f3d5c] hover:bg-slate-50 border border-slate-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        id="sambutan-profil-btn"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Profil Lengkap</span>
                      </button>
                      <button
                        onClick={() => setActivePage('dokumen')}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0f3d5c] hover:bg-[#154e74] rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        id="sambutan-dokumen-btn"
                      >
                        <span>Dokumen Perencanaan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Akses Layanan Cepat (Quick Services Cards) */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 lg:p-12 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <ScrollReveal variant="fade-up" duration={0.65}>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest border border-amber-200/50 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Layanan Digital
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3d5c] tracking-tight">
                Kanal Pelayanan Publik & Informasi
              </h2>
              <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">
                Pusat akses dokumen resmi, permohonan informasi PPID, pelaporan aspirasi, dan data statistik makro.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Card 1: Dokumen Perencanaan */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('dokumen')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100/50">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Dokumen Perencanaan Daerah
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Unduh salinan resmi RPJPD 2025–2045, RKPD tahunan, Renstra, Renja, dan KUA-PPAS Provinsi Papua Selatan.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Buka Repositori</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>

            {/* Card 2: Layanan PPID */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('layanan')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-amber-100/50">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Layanan Informasi Publik (PPID)
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Ajukan permohonan informasi publik secara online, unduh formulir PPID, dan pelajari alur layanan resmi.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Ajukan Permohonan</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>

            {/* Card 3: Pengaduan & Lacak Tiket */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('pengaduan')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-100/50">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Pengaduan & Lacak Tiket
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Sampaikan aspirasi infrastruktur dan perencanaan daerah, serta pantau status penanganan tiket secara real-time.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Formulir Tiket</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>

            {/* Card 4: BRIDA (Riset & Inovasi Daerah) */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('berita')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-purple-100/50">
                    <Microscope className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Riset & Inovasi (BRIDA)
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Hasil kajian ilmiah komoditas sagu, logistik rawa, ketahanan pangan, dan kolaborasi bersama BRIN serta PT.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Eksplorasi Riset</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>

            {/* Card 5: Data & Statistik */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('data-statistik')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-teal-100/50">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Data & Indikator Makro
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Visualisasi tren angka kemiskinan, IPM, laju inflasi, dan perbandingan potensi 4 Kabupaten Papua Selatan.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Lihat Statistik</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>

            {/* Card 6: Agenda & Musrenbang */}
            <StaggerItem variant="zoom-in">
              <div 
                onClick={() => setActivePage('agenda')}
                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0f3d5c]/5 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-100/50">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[17px] text-slate-800 group-hover:text-[#0f3d5c] transition-colors">
                    Agenda & Musrenbang
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-2.5 leading-relaxed">
                    Jadwal pelaksanaan Musrenbang, rapat koordinasi perencanaan kewilayahan, dan bimbingan teknis OPD.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between relative z-10">
                  <span className="text-[13px] font-bold text-[#0f3d5c]">Cek Jadwal</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0f3d5c] group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-[#0f3d5c] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Highlight Dokumen Perencanaan Terkini */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
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
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
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
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
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
