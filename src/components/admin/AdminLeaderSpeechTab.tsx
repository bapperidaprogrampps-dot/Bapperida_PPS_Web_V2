import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Sparkles, 
  Save, 
  Image as ImageIcon, 
  CheckCircle2, 
  Quote, 
  RefreshCw,
  Upload,
  Camera,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  Eye,
  Check,
  Users
} from 'lucide-react';
import { AgencySettings } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';
import { defaultAgencySettings } from '../../data/mockData';

interface AdminLeaderSpeechTabProps {
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

export function AdminLeaderSpeechTab({ onDataChanged, showToast }: AdminLeaderSpeechTabProps) {
  const [settings, setSettings] = useState<AgencySettings>(defaultAgencySettings);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(StorageService.getAgencySettings());
  }, []);

  const handleChange = (field: keyof AgencySettings, val: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handlePhotoFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      if (res && res.url) {
        const updated = {
          ...settings,
          leaderPhoto: res.url
        };
        setSettings(updated);
        // Otomatis simpan ke storage
        StorageService.saveAgencySettings(updated);
        showToast('Foto resmi Kepala Badan berhasil diunggah & disimpan!');
        onDataChanged();
      }
    } catch (err: any) {
      console.error('Gagal mengunggah foto pimpinan:', err);
      showToast(`Gagal mengunggah foto: ${err?.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoFileUpload(file);
    }
  };

  const handleResetPhotoOnly = () => {
    if (confirm('Kembalikan foto pimpinan ke foto resmi standar Bapperida?')) {
      const updated = {
        ...settings,
        leaderPhoto: defaultAgencySettings.leaderPhoto
      };
      setSettings(updated);
      StorageService.saveAgencySettings(updated);
      showToast('Foto resmi Kepala Badan berhasil dikembalikan ke foto standar.');
      onDataChanged();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveAgencySettings(settings);
    showToast('Profil Pimpinan & Naskah Kata Sambutan berhasil disimpan!');
    onDataChanged();
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan seluruh naskah sambutan dan profil pimpinan ke teks standar awal?')) {
      setSettings(defaultAgencySettings);
      StorageService.saveAgencySettings(defaultAgencySettings);
      showToast('Naskah sambutan dan data pimpinan dikembalikan ke pengaturan standar.');
      onDataChanged();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0f3d5c]" />
            <span>Foto & Sambutan Kepala Badan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola foto resmi kedinasan, identitas pimpinan, serta naskah sambutan di Beranda dan Profil Lembaga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ======================================================== */}
        {/* 1. BAGIAN UTAMA: EDIT & UNGGAH FOTO KEPALA BADAN       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="bg-gradient-to-r from-[#0f3d5c]/5 via-amber-500/5 to-transparent p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Edit & Unggah Foto Resmi Pimpinan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Foto ini tampil di halaman Beranda (Kata Sambutan) dan Halaman Profil Organisasi.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold self-start sm:self-auto">
              <Check className="w-3 h-3" />
              <span>Terkoneksi ke Server Hostinger</span>
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Box Pratinjau Foto */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative group w-44 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-sm flex items-center justify-center">
                  {settings.leaderPhoto ? (
                    <img
                      src={settings.leaderPhoto}
                      alt={settings.leaderName}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400 bg-slate-50">
                      <Users className="w-12 h-12 text-[#0f3d5c]/30 mb-2" />
                      <span className="text-xs font-bold text-slate-700">Foto Pimpinan</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Belum diunggah</span>
                    </div>
                  )}

                  {/* Loading Overlay saat upload */}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 text-center">
                      <Loader2 className="w-7 h-7 animate-spin text-amber-400 mb-2" />
                      <span className="text-xs font-bold">Mengunggah foto...</span>
                      <span className="text-[10px] text-slate-300 mt-0.5">Menyimpan ke server</span>
                    </div>
                  )}

                  {/* Hover Edit Overlay */}
                  {!isUploadingPhoto && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2 text-center"
                    >
                      <Camera className="w-6 h-6 text-amber-300 mb-1" />
                      <span className="text-xs font-bold">Ganti Foto</span>
                      <span className="text-[10px] text-slate-300">Klik untuk memilih file</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold">
                      3:4 Portrait
                    </span>
                  </div>
                </div>

                <div className="text-center mt-2.5">
                  <p className="text-xs font-bold text-slate-800">{settings.leaderName || 'Kepala Bapperida'}</p>
                  <p className="text-[11px] text-slate-500">{settings.leaderRank}</p>
                </div>
              </div>

              {/* Box Kontrol Upload Foto */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Pilihan Metode: Upload File atau Link URL */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('upload')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      photoInputMode === 'upload'
                        ? 'bg-[#0f3d5c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoInputMode('url')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      photoInputMode === 'url'
                        ? 'bg-[#0f3d5c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Tautan URL Gambar</span>
                  </button>
                </div>

                {photoInputMode === 'upload' ? (
                  /* Area Drag & Drop & Upload Tombol */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-6 border-2 border-dashed rounded-xl transition flex flex-col items-center justify-center text-center space-y-3 ${
                      isDragging 
                        ? 'border-[#0f3d5c] bg-[#0f3d5c]/5' 
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Pilih foto profil Kepala Badan dari komputer atau ponsel Anda
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mendukung format JPG, JPEG, PNG, dan WebP (Rasio pas 3:4)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="px-4 py-2 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sedang Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 text-amber-300" />
                            <span>Pilih & Unggah Foto Baru</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResetPhotoOnly}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Kembalikan Foto Standar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Area Input URL Langsung */
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">
                      Masukkan URL / Tautan Langsung Foto Pimpinan:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={settings.leaderPhoto}
                        onChange={(e) => handleChange('leaderPhoto', e.target.value)}
                        placeholder="https://... atau /uploads/images/foto.jpg"
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                      />
                      <button
                        type="button"
                        onClick={handleResetPhotoOnly}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition"
                      >
                        Foto Standar
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Foto otomatis diperbarui pada pratinjau di sebelah kiri.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Setelah mengunggah foto, jangan lupa menekan tombol <strong>Simpan Perubahan</strong> di bawah agar seluruh data pimpinan tersimpan permanen.
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. IDENTITAS RESMI KEPALA BADAN                          */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Identitas Resmi Kepala Badan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar Pimpinan *
              </label>
              <input
                type="text"
                required
                value={settings.leaderName}
                onChange={(e) => handleChange('leaderName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pangkat / Golongan Ruang *
              </label>
              <input
                type="text"
                required
                value={settings.leaderRank}
                onChange={(e) => handleChange('leaderRank', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jabatan Resmi Kedinasan *
              </label>
              <input
                type="text"
                required
                value={settings.leaderTitle}
                onChange={(e) => handleChange('leaderTitle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Motto / Visi Kepemimpinan *
              </label>
              <input
                type="text"
                required
                value={settings.leaderMotto}
                onChange={(e) => handleChange('leaderMotto', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. NASKAH KATA SAMBUTAN (SEDERHANA & TERSUSUN RAPI)      */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#0f3d5c]" />
              <span>Naskah Kata Sambutan Kepala Badan</span>
            </h3>
            <span className="text-[11px] text-slate-400">Teks ini tampil rapi di Beranda</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul Utama Sambutan *
            </label>
            <input
              type="text"
              required
              value={settings.speechTitle}
              onChange={(e) => handleChange('speechTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:border-[#0f3d5c]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Paragraf Pembuka & Salam Resmi *
            </label>
            <textarea
              rows={3}
              required
              value={settings.speechOpening}
              onChange={(e) => handleChange('speechOpening', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Isi Pokok Sambutan *
            </label>
            <textarea
              rows={5}
              required
              value={settings.speechBody}
              onChange={(e) => handleChange('speechBody', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Paragraf Penutup & Harapan *
            </label>
            <textarea
              rows={3}
              required
              value={settings.speechClosing}
              onChange={(e) => handleChange('speechClosing', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c] leading-relaxed"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* TOMBOL SIMPAN UTAMA                                      */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">
            Pastikan perubahan foto dan naskah sudah sesuai sebelum disimpan.
          </p>

          <button
            type="submit"
            className="px-6 py-3 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Sambutan & Foto Pimpinan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
