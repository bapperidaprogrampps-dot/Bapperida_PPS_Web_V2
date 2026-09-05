import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  FileVideo, 
  Info, 
  Sparkles, 
  Building2, 
  Save, 
  Trash2 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { VideoStorageService, VideoMeta } from '../../services/videoStorage';
import { UploadService } from '../../services/uploadService';
import { AgencySettings } from '../../types';

interface AdminHeroVideoTabProps {
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const DEFAULT_REFERENCE_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-winding-river-through-a-forest-42880-large.mp4';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

export function AdminHeroVideoTab({ onDataChanged, showToast }: AdminHeroVideoTabProps) {
  const [settings, setSettings] = useState<AgencySettings>(StorageService.getAgencySettings());
  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_REFERENCE_VIDEO);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Form inputs for captions
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoLocation, setVideoLocation] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load video & metadata on mount
  useEffect(() => {
    loadCurrentVideo();
  }, []);

  const loadCurrentVideo = async () => {
    const currentSettings = StorageService.getAgencySettings();
    setSettings(currentSettings);
    setVideoTitle(currentSettings.heroVideoTitle || 'Pusat Perumusan Kebijakan & Pengendalian Pembangunan Wilayah Anim Ha');
    setVideoLocation(currentSettings.heroVideoLocation || 'Salor, Merauke — 4 Kabupaten (Merauke, Boven Digoel, Mappi, Asmat)');

    if (currentSettings.heroVideoServerUrl) {
      setVideoSrc(currentSettings.heroVideoServerUrl);
      setVideoMeta({
        name: currentSettings.heroVideoCustomName || 'video-profil-hostinger.mp4',
        sizeFormatted: 'Server Hostinger',
        type: 'video/mp4',
        updatedAt: 'Tersimpan di Server'
      });
      setIsCustom(true);
    } else {
      const customUrl = await VideoStorageService.getHeroVideoBlobUrl();
      const meta = await VideoStorageService.getHeroVideoMeta();

      if (customUrl && meta) {
        setVideoSrc(customUrl);
        setVideoMeta(meta);
        setIsCustom(true);
      } else {
        setVideoSrc(DEFAULT_REFERENCE_VIDEO);
        setVideoMeta(null);
        setIsCustom(false);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Mohon pilih file video yang valid (misal: .mp4, .webm, .mov)');
      return;
    }

    try {
      setIsUploading(true);

      // 1. Unggah berkas ke server Hostinger
      const uploadRes = await UploadService.uploadFileToServer(file, 'videos');

      // 2. Simpan juga salinan di IndexedDB untuk cache lokal cepat
      await VideoStorageService.saveHeroVideo(file);

      setVideoSrc(uploadRes.url);
      setVideoMeta({
        name: uploadRes.filename || file.name,
        sizeFormatted: uploadRes.sizeFormatted,
        type: uploadRes.mimetype || file.type,
        updatedAt: 'Tersimpan di Server Hostinger'
      });
      setIsCustom(true);
      setIsPlaying(true);

      // 3. Simpan URL permanen di server Hostinger ke pengaturan instansi
      const updated = {
        ...settings,
        heroVideoCustomName: uploadRes.filename || file.name,
        heroVideoServerUrl: uploadRes.url
      };
      StorageService.saveAgencySettings(updated);
      setSettings(updated);

      showToast(`Video baru "${file.name}" (${uploadRes.sizeFormatted}) berhasil diunggah ke server Hostinger dan aktif di Beranda.`);
      onDataChanged();
      window.dispatchEvent(new Event('hero-video-updated'));
    } catch (err: any) {
      console.error('Upload video error:', err);
      alert(`Gagal memproses file video: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus video kustom dan mengembalikan ke video referensi bawaan sistem?')) {
      await VideoStorageService.deleteHeroVideo();
      const updated = {
        ...settings,
        heroVideoCustomName: undefined,
        heroVideoServerUrl: undefined
      };
      StorageService.saveAgencySettings(updated);
      setSettings(updated);
      setVideoSrc(DEFAULT_REFERENCE_VIDEO);
      setVideoMeta(null);
      setIsCustom(false);
      showToast('Video dikembalikan ke video referensi awal.');
      onDataChanged();
      window.dispatchEvent(new Event('hero-video-updated'));
    }
  };

  const handleSaveCaptions = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AgencySettings = {
      ...settings,
      heroVideoTitle: videoTitle.trim(),
      heroVideoLocation: videoLocation.trim()
    };
    StorageService.saveAgencySettings(updated);
    setSettings(updated);
    showToast('Takarir teks dan lokasi video beranda berhasil disimpan.');
    onDataChanged();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-[#0f3d5c]" />
            <span>Pengelolaan Video Latar Beranda</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah video resolusi tinggi untuk panel Beranda utama. Pengunjung publik hanya melihat tayangan video tanpa tombol administrasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCustom && (
            <button
              onClick={handleResetToDefault}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Kembalikan ke video referensi"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Video Awal</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-[#0f3d5c] hover:bg-[#185377] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{isUploading ? 'Memproses...' : 'Unggah Video Baru (.mp4)'}</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
        }}
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
      />

      {/* Grid: Left Video Player & Right Upload Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Pratinjau Video Aktif (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Pratinjau Video Aktif</span>
                {isCustom ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Video Kustom Admin
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Video Referensi Bawaan
                  </span>
                )}
              </div>

              {/* Player Quick Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title={isMuted ? "Bunyikan Suara" : "Bisukan Suara"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title={isPlaying ? "Jeda" : "Putar"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-slate-700" /> : <Play className="w-4 h-4 text-amber-600" />}
                </button>
              </div>
            </div>

            {/* Video Frame */}
            <div className="aspect-16/9 w-full rounded-xl overflow-hidden relative bg-slate-950 border border-slate-800">
              <video
                ref={videoRef}
                src={videoSrc}
                poster={DEFAULT_POSTER}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent text-white text-xs pointer-events-none">
                <p className="font-bold text-amber-300 truncate">{videoTitle}</p>
                <p className="text-[11px] text-slate-300 truncate">{videoLocation}</p>
              </div>
            </div>

            {/* Video Metadata Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Sumber Video</div>
                <div className="font-bold text-slate-800 truncate mt-0.5">
                  {isCustom ? videoMeta?.name || 'File Unggahan' : 'Mixkit Drone Aerial'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Ukuran File</div>
                <div className="font-bold text-slate-800 truncate mt-0.5">
                  {isCustom ? videoMeta?.sizeFormatted || 'Tersimpan di DB' : '~4.8 MB (Optimized)'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Format</div>
                <div className="font-bold text-slate-800 truncate mt-0.5">
                  {isCustom ? videoMeta?.type || 'video/mp4' : 'MP4 H.264'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Status</div>
                <div className="font-bold text-emerald-600 truncate mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktif di Publik</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Area Unggah & Pengaturan Takarir (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Drag & Drop Upload Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-6 rounded-2xl border-2 border-dashed transition text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
              dragActive 
                ? 'border-amber-500 bg-amber-50' 
                : 'border-slate-300 hover:border-[#0f3d5c] bg-white hover:bg-slate-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#0f3d5c] flex items-center justify-center border border-amber-200">
              <FileVideo className="w-6 h-6 text-[#0f3d5c]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                Klik atau Tarik File Video ke Sini
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Mendukung format <strong>.MP4</strong>, <strong>.WebM</strong>, atau <strong>.MOV</strong>
              </p>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0f3d5c] text-white text-xs font-bold">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilih Berkas Komputer</span>
            </span>

            <div className="text-[11px] text-slate-400 pt-1">
              File tersimpan secara permanen pada memori browser via IndexedDB
            </div>
          </div>

          {/* Form Takarir Teks Video */}
          <form onSubmit={handleSaveCaptions} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-[#0f3d5c]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Takarir Teks Video Beranda
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Judul Utama Kartu Video</label>
              <textarea
                rows={2}
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none"
                placeholder="Misal: Pusat Perumusan Kebijakan & Pengendalian Pembangunan Wilayah Anim Ha"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Keterangan Lokasi & Wilayah</label>
              <input
                type="text"
                value={videoLocation}
                onChange={(e) => setVideoLocation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none"
                placeholder="Misal: Salor, Merauke — 4 Kabupaten"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f3d5c] hover:bg-[#185377] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Simpan Takarir Video</span>
            </button>
          </form>

          {/* Tips Rekomendasi Format Video */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Petunjuk Video Beranda:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-1 pl-1">
              <li>Gunakan video dengan durasi <strong>15–60 detik</strong> berformat <strong>MP4</strong> agar ringan dan lancar saat diputar berulang (*loop*).</li>
              <li>Pastikan aspek rasio 16:9 atau 4:3 (resolusi 720p atau 1080p disarankan).</li>
              <li>Video otomatis dibisukan (*muted*) saat awal pemutaran untuk mematuhi kebijakan peramban modern.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
