import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film
} from 'lucide-react';
import { ActivePage } from '../types';
import { StorageService } from '../services/storage';
import { VideoStorageService } from '../services/videoStorage';

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

  const cardVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Load video source and settings
  const loadHeroData = async () => {
    const settings = StorageService.getAgencySettings();
    if (settings.heroVideoTitle) setVideoTitle(settings.heroVideoTitle);
    if (settings.heroVideoLocation) setVideoLocation(settings.heroVideoLocation);

    // Prioritaskan URL berkas di server Hostinger jika ada
    if (settings.heroVideoServerUrl) {
      setVideoSrc(settings.heroVideoServerUrl);
      setIsCustomVideo(true);
    } else {
      const customBlobUrl = await VideoStorageService.getHeroVideoBlobUrl();
      if (customBlobUrl) {
        setVideoSrc(customBlobUrl);
        setIsCustomVideo(true);
      } else {
        setVideoSrc(DEFAULT_REFERENCE_VIDEO);
        setIsCustomVideo(false);
      }
    }
  };

  useEffect(() => {
    loadHeroData();

    // Listen for updates from the admin module
    const handleVideoUpdate = () => {
      loadHeroData();
    };

    window.addEventListener('hero-video-updated', handleVideoUpdate);
    return () => {
      window.removeEventListener('hero-video-updated', handleVideoUpdate);
    };
  }, []);

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
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4"
    >
      {/* Container Card dengan Skala Terukur & Bentuk Framed yang Jelas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#092233] via-[#0f3d5c] to-[#154e74] text-white border border-white/20"
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
            className="w-full h-full object-cover object-center filter blur-xs"
          />
          {/* Gradient overlay agar teks tetap sangat kontras */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#092233]/95 via-[#0f3d5c]/85 to-[#154e74]/80" />
        </motion.div>

        {/* Pattern dots overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px] opacity-10 pointer-events-none z-1"></div>

        {/* Content Container dengan Skala Proporsional & Rapi */}
        <div className="p-6 sm:p-8 lg:p-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* SISI KIRI: Teks & Aksi Utama (Animasi Masuk Bertahap) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5"
            >
              {/* Badge Portal */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-amber-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Resmi Perencanaan, Riset & Inovasi Daerah</span>
              </motion.div>

              {/* Headline Title dengan Skala Kompak */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="space-y-2.5"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  Perencanaan Terpadu, <br className="hidden sm:block" />
                  <span className="text-amber-400">Riset & Inovasi</span> untuk Papua Selatan Maju
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                  Mewujudkan tata kelola perencanaan pembangunan daerah yang transparan, berbasis data, dan adaptif terhadap kearifan lokal di 4 Kabupaten: <strong>Merauke, Boven Digoel, Mappi,</strong> dan <strong>Asmat</strong>.
                </p>
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

              {/* Verified Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-slate-300"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>RPJPD 2025–2045</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Keterbukaan PPID</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>SP4N Terintegrasi</span>
                </div>
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

                {/* Video Player Display dengan Proporsi Terukur (Aspect 16:10) */}
                <div className="aspect-16/10 w-full relative overflow-hidden bg-slate-950">
                  <video
                    ref={cardVideoRef}
                    src={videoSrc}
                    poster={FALLBACK_POSTER}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
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
