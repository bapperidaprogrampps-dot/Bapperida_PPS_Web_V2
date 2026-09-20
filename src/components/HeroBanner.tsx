import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Clock, 
  MapPin,
  Newspaper,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  Tag,
  MoveHorizontal
} from 'lucide-react';
import { ActivePage, NewsArticle, AgencySettings } from '../types';
import { StorageService } from '../services/storage';
import { VideoStorageService } from '../services/videoStorage';
import { DeerSilhouette } from './DeerSilhouette';

export interface HeroBannerProps {
  setActivePage: (page: ActivePage) => void;
  articles?: NewsArticle[];
  onSelectArticle?: (article: NewsArticle) => void;
}

// Fallback image dan video referensi latar belakang
const DEFAULT_REFERENCE_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-winding-river-through-a-forest-42880-large.mp4';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

// Default artikel sorotan resmi Bapperida jika data artikel masih kosong
const DEFAULT_HIGHLIGHT_ARTICLES: NewsArticle[] = [
  {
    id: 'hl-1',
    title: 'Portal Satu Data & Perencanaan Terpadu Papua Selatan Resmi Siap Melayani 4 Kabupaten',
    slug: 'portal-satu-data-perencanaan-terpadu-papua-selatan',
    category: 'Pemerintahan',
    summary: 'Bapperida Provinsi Papua Selatan mengintegrasikan seluruh dokumen perencanaan daerah, riset inovasi, dan layanan aspirasi masyarakat Anim Ha.',
    content: 'Pemerintah Provinsi Papua Selatan melalui Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida) meluncurkan portal resmi satu data perencanaan terpadu...',
    author: 'Humas Bapperida PPS',
    publishedAt: '10 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    views: 342,
    status: 'published',
    tags: ['Bapperida', 'Papua Selatan', 'Anim Ha', 'Perencanaan']
  },
  {
    id: 'hl-2',
    title: 'Akselerasi Penyusunan Dokumen RPJPD & RPJMD Kawasan Sentra Pertanian dan Gambut Anim Ha',
    slug: 'akselerasi-penyusunan-dokumen-rpjpd-rpjmd',
    category: 'Pembangunan',
    summary: 'Prioritas pembangunan diarahkan pada peningkatan konektivitas Merauke, Boven Digoel, Mappi, dan Asmat serta ketahanan pangan lokal.',
    content: 'Penyusunan Rencana Pembangunan Daerah memprioritaskan swasembada pangan terpadu dan hilirisasi potensi lokal Orang Asli Papua...',
    author: 'Bidang Perencanaan Makro',
    publishedAt: '08 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    views: 285,
    status: 'published',
    tags: ['RPJPD', 'Pertanian', 'Merauke', 'Pembangunan']
  },
  {
    id: 'hl-3',
    title: 'Pengembangan Inovasi Hilirisasi Sagu Mappi dan Ekosistem Riset Terapan BRIDA Papua Selatan',
    slug: 'pengembangan-inovasi-hilirisasi-sagu-mappi',
    category: 'Riset & Inovasi',
    summary: 'Kerja sama riset aplikatif untuk meningkatkan nilai tambah komoditas unggulan daerah dan perlindungan kearifan lokal masyarakat adat.',
    content: 'Bidang Riset dan Inovasi Daerah memfasilitasi riset aplikatif peningkatan nilai tambah komoditas lokal dan perlindungan ekosistem...',
    author: 'Bidang Riset & Inovasi',
    publishedAt: '05 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    views: 219,
    status: 'published',
    tags: ['BRIDA', 'Riset', 'Sagu Mappi', 'Inovasi']
  }
];

export function HeroBanner({ setActivePage, articles = [], onSelectArticle }: HeroBannerProps) {
  const [agencySettings, setAgencySettings] = useState<AgencySettings>(() => StorageService.getAgencySettings());
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_REFERENCE_VIDEO);
  const [officeHours, setOfficeHours] = useState<string>('Jam 08.00 Pagi s/d 16.00 Sore WIT (Senin – Jumat)');
  const [officeAddress, setOfficeAddress] = useState<string>('Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Papua Selatan 99616');

  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Filter artikel yang telah diterbitkan (published)
  const publishedArticles = (articles || []).filter(a => a.status === 'published' || !a.status);

  // Ambil artikel highlight berdasarkan mode otomatis atau manual dari panel admin
  let dynamicArticles: NewsArticle[] = [];
  if (agencySettings.heroHighlightMode === 'manual' && agencySettings.heroHighlightArticleIds && agencySettings.heroHighlightArticleIds.length > 0) {
    agencySettings.heroHighlightArticleIds.forEach(id => {
      const found = publishedArticles.find(n => n.id === id);
      if (found) dynamicArticles.push(found);
    });
    if (dynamicArticles.length === 0) {
      dynamicArticles = publishedArticles.slice(0, 5);
    }
  } else {
    dynamicArticles = publishedArticles.slice(0, 5);
  }

  const highlightList: NewsArticle[] = dynamicArticles.length > 0 
    ? dynamicArticles 
    : DEFAULT_HIGHLIGHT_ARTICLES;

  const badgeText = agencySettings.heroHighlightBadge || 'Highlight Berita';
  const rotationSeconds = agencySettings.heroHighlightInterval !== undefined ? agencySettings.heroHighlightInterval : 6;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  // Pastikan currentIndex selalu valid jika panjang list berubah
  useEffect(() => {
    if (currentIndex >= highlightList.length) {
      setCurrentIndex(0);
    }
  }, [highlightList.length, currentIndex]);

  // Rotasi otomatis sorotan berita sesuai durasi yang diatur di panel admin
  useEffect(() => {
    if (isPaused || highlightList.length <= 1 || rotationSeconds <= 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % highlightList.length);
    }, rotationSeconds * 1000);
    return () => clearInterval(interval);
  }, [isPaused, highlightList.length, rotationSeconds]);

  // Navigasi prev & next
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? highlightList.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % highlightList.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Navigasi ke detail berita (aman dari drag event)
  const handleArticleClick = (article: NewsArticle) => {
    if (isDraggingRef.current) return;
    if (onSelectArticle) {
      onSelectArticle(article);
    } else {
      setActivePage('berita');
    }
  };

  // Load video latar belakang dan informasi instansi
  const loadHeroData = async () => {
    const settings = StorageService.getAgencySettings();
    setAgencySettings(settings);
    if (settings.officeAddress) setOfficeAddress(settings.officeAddress);
    if (settings.officeHours) setOfficeHours(settings.officeHours);

    const hasValidServerUrl = settings.heroVideoServerUrl && 
      typeof settings.heroVideoServerUrl === 'string' && 
      !settings.heroVideoServerUrl.startsWith('blob:');

    if (hasValidServerUrl) {
      setVideoSrc(settings.heroVideoServerUrl!);
      return;
    }

    const customBlobUrl = await VideoStorageService.getHeroVideoBlobUrl();
    if (customBlobUrl) {
      setVideoSrc(customBlobUrl);
      return;
    }

    setVideoSrc(DEFAULT_REFERENCE_VIDEO);
  };

  useEffect(() => {
    loadHeroData();

    const handleVideoUpdate = () => {
      loadHeroData();
    };

    window.addEventListener('hero-video-updated', handleVideoUpdate);
    window.addEventListener('hero-highlight-updated', handleVideoUpdate);
    window.addEventListener('bapperida:data-synced', handleVideoUpdate);
    return () => {
      window.removeEventListener('hero-video-updated', handleVideoUpdate);
      window.removeEventListener('hero-highlight-updated', handleVideoUpdate);
      window.removeEventListener('bapperida:data-synced', handleVideoUpdate);
    };
  }, []);

  const handleVideoError = async () => {
    if (videoSrc !== DEFAULT_REFERENCE_VIDEO) {
      const localBlob = await VideoStorageService.getHeroVideoBlobUrl();
      if (localBlob && localBlob !== videoSrc) {
        setVideoSrc(localBlob);
        return;
      }
      setVideoSrc(DEFAULT_REFERENCE_VIDEO);
    }
  };

  const currentArticle = highlightList[currentIndex] || highlightList[0];

  return (
    <section 
      id="hero-main-section"
      className="w-full"
    >
      {/* Hero Banner Memanjang Kiri dan Kanan Penuh (Full-Width Edge-to-Edge) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative overflow-hidden bg-gradient-to-br from-[#092233] via-[#0f3d5c] to-[#154e74] text-white border-b border-white/10 xl:min-h-[540px] 2xl:min-h-[600px] flex flex-col justify-center"
      >
        {/* 1. Cinematic Background Layer dengan Animasi Masuk */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
          aria-hidden="true"
        >
          <video 
            ref={bgVideoRef}
            src={videoSrc || DEFAULT_REFERENCE_VIDEO}
            poster={FALLBACK_POSTER}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
            className="w-full h-full object-cover object-center filter blur-xs"
          />
          {/* Gradient overlay agar teks tetap sangat kontras */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#092233]/95 via-[#0f3d5c]/85 to-[#154e74]/80" />
        </motion.div>

        {/* Pattern dots overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px] opacity-10 pointer-events-none z-1"></div>

        {/* Siluet Hewan Rusa (Rusa Merauke) di Sebelah Kanan Hero */}
        <div 
          className="absolute right-0 sm:right-6 md:right-12 lg:right-20 bottom-0 pointer-events-none z-2 select-none opacity-20 sm:opacity-25 transform translate-y-3"
          aria-hidden="true"
        >
          <DeerSilhouette className="w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 xl:w-[440px] xl:h-[440px] text-amber-300" />
        </div>

        {/* Content Container dengan Skala Proporsional & Rapi (Widescreen Centered) */}
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-14 lg:py-16 pb-16 sm:pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* SISI KIRI: Teks & Aksi Utama (Animasi Masuk Bertahap) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5"
            >
              {/* Badge Portal / Highlight */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="inline-flex items-center text-xs sm:text-sm font-semibold text-amber-300 tracking-wide"
                id="hero-highlight-badge"
              >
                <span>Selamat Datang di Portal Resmi</span>
              </motion.div>

              {/* Headline Title dengan Skala Kompak */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="space-y-2.5"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight" id="hero-main-title">
                  Badan Perencanaan Pembangunan, <br className="hidden sm:block" />
                  Riset Dan Inovasi Daerah <br className="hidden sm:block" />
                  <span className="text-amber-400">Provinsi Papua Selatan</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                  Mewujudkan tata kelola perencanaan pembangunan daerah yang transparan, terpadu, berbasis riset dan inovasi di 4 Kabupaten: <strong>Merauke, Boven Digoel, Mappi,</strong> dan <strong>Asmat</strong>.
                </p>
              </motion.div>

              {/* Informasi Waktu Pelayanan & Alamat Kantor */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="bg-slate-900/60 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-3.5 space-y-2 max-w-xl shadow-inner text-xs sm:text-sm"
                id="hero-service-hours-address"
              >
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-semibold text-amber-300">Waktu Pelayanan: </span>
                    <span className="text-slate-200">{officeHours}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-white/10">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-semibold text-amber-300">Alamat Kantor: </span>
                    <span className="text-slate-200">{officeAddress}</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-2.5 pt-1"
              >
                <button
                  onClick={() => setActivePage('dokumen')}
                  className="px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-2 group cursor-pointer shadow-sm"
                  id="hero-cta-dokumen"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Akses Dokumen Perencanaan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setActivePage('pengaduan')}
                  className="px-4 sm:px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
                  id="hero-cta-pengaduan"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Sampaikan Pengaduan</span>
                </button>
              </motion.div>
            </motion.div>

            {/* SISI KANAN: Panel Showcase Highlight Berita (Menggantikan Video Sesuai Permintaan) */}
            {/* Kolom Kanan: Showcase Highlight Berita (Tanpa Boundaries, Foto Dominan, Bersih & Geser Kesamping) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <div 
                id="hero-highlight-berita-showcase"
                className="relative w-full max-w-lg mx-auto lg:max-w-none group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentArticle.id || currentIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: dir > 0 ? 100 : -100,
                        opacity: 0,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          x: { type: 'spring', stiffness: 320, damping: 28 },
                          opacity: { duration: 0.2 }
                        },
                      },
                      exit: (dir: number) => ({
                        x: dir > 0 ? -100 : 100,
                        opacity: 0,
                        transition: {
                          x: { type: 'spring', stiffness: 320, damping: 28 },
                          opacity: { duration: 0.16 }
                        },
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                    }}
                    onDragEnd={(_e, { offset, velocity }) => {
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 80);
                      const swipeThreshold = 35;
                      if (offset.x < -swipeThreshold || velocity.x < -180) {
                        handleNext();
                      } else if (offset.x > swipeThreshold || velocity.x > 180) {
                        handlePrev();
                      }
                    }}
                    className="cursor-grab active:cursor-grabbing touch-pan-y"
                  >
                    {/* 1. Foto Berita Sangat Dominan (Tanpa Boundary Box / Frameless) */}
                    <div 
                      onClick={() => handleArticleClick(currentArticle)}
                      className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-slate-900 group/card cursor-pointer"
                    >
                      <img
                        src={currentArticle.imageUrl || FALLBACK_POSTER}
                        alt={currentArticle.title}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 pointer-events-none"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = FALLBACK_POSTER;
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {/* Vignette halus di bagian bawah foto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                      {/* Indikator Titik Geser & Panah Minimalis di Pojok Bawah Foto */}
                      <div 
                        className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          {highlightList.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleDotClick(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                idx === currentIndex 
                                  ? 'w-5 bg-amber-400' 
                                  : 'w-1.5 bg-white/40 hover:bg-white/70'
                              }`}
                              title={`Berita ${idx + 1}`}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <div className="h-3 w-px bg-white/20 ml-1" />

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
                            title="Sebelumnya"
                            aria-label="Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
                            title="Selanjutnya"
                            aria-label="Selanjutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. Judul dan Sedikit Keterangan (Hanya Teks Bersih) */}
                    <div 
                      onClick={() => handleArticleClick(currentArticle)}
                      className="mt-3.5 space-y-1.5 px-0.5 cursor-pointer group/text"
                    >
                      <h3 
                        className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug line-clamp-2 group-hover/text:text-amber-300 transition"
                        title={currentArticle.title}
                      >
                        {currentArticle.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {currentArticle.summary}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
