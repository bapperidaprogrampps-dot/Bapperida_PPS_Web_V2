import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film,
  Clock,
  MapPin
} from 'lucide-react';
import { ActivePage } from '../types';
import { StorageService } from '../services/storage';
import { VideoStorageService } from '../services/videoStorage';
import { DeerSilhouette } from './DeerSilhouette';

interface HeroBannerProps {
  setActivePage: (page: ActivePage) => void;
}

// Video referensi pemandangan bentang alam udara & sungai tropis (representasi wilayah Anim Ha)
const DEFAULT_REFERENCE_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-winding-river-through-a-forest-42880-large.mp4';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

export function HeroBanner({ setActivePage }: HeroBannerProps) {
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_REFERENCE_VIDEO);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoTitle, setVideoTitle] = useState<string>('Pusat Perumusan Kebijakan & Pengendalian Pembangunan Wilayah Anim Ha');
  const [videoLocation, setVideoLocation] = useState<string>('Salor, Merauke — 4 Kabupaten (Merauke, Boven Digoel, Mappi, Asmat)');
  const [isCustomVideo, setIsCustomVideo] = useState<boolean>(false);
  const [officeHours, setOfficeHours] = useState<string>('Jam 08.00 Pagi s/d 16.00 Sore WIT (Senin – Jumat)');
  const [officeAddress, setOfficeAddress] = useState<string>('Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Papua Selatan 99616');

  const cardVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Load video source and settings
  const loadHeroData = async () => {
    const settings = StorageService.getAgencySettings();
    if (settings.heroVideoTitle) setVideoTitle(settings.heroVideoTitle);
    if (settings.heroVideoLocation) setVideoLocation(settings.heroVideoLocation);
    if (settings.officeAddress) setOfficeAddress(settings.officeAddress);
    if (settings.officeHours) setOfficeHours(settings.officeHours);

    // 1. Cek apakah ada URL video server Hostinger yang valid (bukan blob session)
    const hasValidServerUrl = settings.heroVideoServerUrl && 
      typeof settings.heroVideoServerUrl === 'string' && 
      !settings.heroVideoServerUrl.startsWith('blob:');

    if (hasValidServerUrl) {
      setVideoSrc(settings.heroVideoServerUrl!);
      setIsCustomVideo(true);
      return;
    }

    // 2. Cek apakah ada file video yang tersimpan di IndexedDB browser lokal
    const customBlobUrl = await VideoStorageService.getHeroVideoBlobUrl();
    if (customBlobUrl) {
      setVideoSrc(customBlobUrl);
      setIsCustomVideo(true);
      return;
    }

    // 3. Fallback ke video referensi bawaan
    setVideoSrc(DEFAULT_REFERENCE_VIDEO);
    setIsCustomVideo(false);
  };

  useEffect(() => {
    loadHeroData();

    // Listen for updates from the admin module and central sync
    const handleVideoUpdate = () => {
      loadHeroData();
    };

    window.addEventListener('hero-video-updated', handleVideoUpdate);
    window.addEventListener('bapperida:data-synced', handleVideoUpdate);
    return () => {
      window.removeEventListener('hero-video-updated', handleVideoUpdate);
      window.removeEventListener('bapperida:data-synced', handleVideoUpdate);
    };
  }, []);

  // Pemulihan otomatis jika sumber video bermasalah atau koneksi terputus
  const handleVideoError = async () => {
    console.warn('Gagal memuat tayangan video dari:', videoSrc);
    if (videoSrc !== DEFAULT_REFERENCE_VIDEO) {
      const localBlob = await VideoStorageService.getHeroVideoBlobUrl();
      if (localBlob && localBlob !== videoSrc) {
        setVideoSrc(localBlob);
        setIsCustomVideo(true);
        return;
      }
      setVideoSrc(DEFAULT_REFERENCE_VIDEO);
      setIsCustomVideo(false);
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (cardVideoRef.current) {
      if (isPlaying) {
        cardVideoRef.current.pause();
        bgVideoRef.current?.pause();
      } else {
        cardVideoRef.current.play().catch(() => {});
        bgVideoRef.current?.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    if (cardVideoRef.current) {
      const nextMuted = !isMuted;
      cardVideoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

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
        {/* 1. Cinematic Background Video Layer dengan Animasi Masuk Pertama */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 0.24, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
          aria-hidden="true"
        >
          <video 
            ref={bgVideoRef}
            src={videoSrc}
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
                  className="px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-2 group cursor-pointer"
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

            {/* SISI KANAN: Panel Showcase Video Interaktif (Animasi Masuk Slide & Scale) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/25 bg-slate-950/85 backdrop-blur-md group max-w-lg mx-auto lg:max-w-none">
                
                {/* Status Header Badge Video */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-white pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
                    <Film className="w-3 h-3 text-amber-400 ml-1" />
                    <span>{isCustomVideo ? 'Video Resmi Wilayah Anim Ha' : 'Video Profil Daerah (Referensi)'}</span>
                  </div>

                  <div className="flex items-center gap-1 pointer-events-auto">
                    {/* Audio Mute/Unmute */}
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 transition cursor-pointer"
                      title={isMuted ? "Bunyikan Suara Video" : "Bisukan Suara Video"}
                      id="hero-mute-toggle-btn"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>

                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/20 transition cursor-pointer"
                      title={isPlaying ? "Jeda Video" : "Putar Video"}
                      id="hero-play-toggle-btn"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  </div>
                </div>

                {/* Video Player Display dengan Proporsi Terukur (Aspect 16:9) */}
                <div className="aspect-video w-full relative overflow-hidden bg-slate-950">
                  <video
                    ref={cardVideoRef}
                    src={videoSrc}
                    poster={FALLBACK_POSTER}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onError={handleVideoError}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-700"
                  />

                  {/* Gradient Overlay for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none"></div>

                  {/* Floating Big Play Button if paused */}
                  {!isPlaying && (
                    <div 
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] cursor-pointer z-20"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-400/95 text-slate-950 flex items-center justify-center hover:scale-110 transition">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Caption & Agency Info */}
                <div className="p-4 space-y-1.5 text-white bg-slate-950/90 border-t border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Kompleks Kantor Pemerintahan Terpadu PPS</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      Salor, Merauke
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold leading-snug text-slate-100 line-clamp-1">
                    {videoTitle}
                  </h4>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                    <span className="truncate">{videoLocation}</span>
                    <span className="text-amber-300/90 font-medium shrink-0 ml-2">
                      {isCustomVideo ? 'Video Admin' : 'Ref: Drone Aerial'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
