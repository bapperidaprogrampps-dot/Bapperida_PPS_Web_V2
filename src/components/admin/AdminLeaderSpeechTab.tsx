import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  Save, 
  Image as ImageIcon, 
  CheckCircle2, 
  Quote, 
  RefreshCw 
} from 'lucide-react';
import { AgencySettings } from '../../types';
import { StorageService } from '../../services/storage';
import { defaultAgencySettings } from '../../data/mockData';

interface AdminLeaderSpeechTabProps {
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

export function AdminLeaderSpeechTab({ onDataChanged, showToast }: AdminLeaderSpeechTabProps) {
  const [settings, setSettings] = useState<AgencySettings>(defaultAgencySettings);

  useEffect(() => {
    setSettings(StorageService.getAgencySettings());
  }, []);

  const handleChange = (field: keyof AgencySettings, val: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveAgencySettings(settings);
    showToast('Profil Pimpinan dan Naskah Kata Sambutan berhasil disimpan & diperbarui di Beranda serta Profil.');
    onDataChanged();
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan naskah sambutan dan profil pimpinan ke teks standar awal?')) {
      setSettings(defaultAgencySettings);
      StorageService.saveAgencySettings(defaultAgencySettings);
      showToast('Sambutan dikembalikan ke pengaturan standar.');
      onDataChanged();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0f3d5c]" />
            <span>Pengaturan Profil Pimpinan & Naskah Kata Sambutan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui identitas Kepala Badan, foto profil resmi kedinasan, motto kepemimpinan, dan naskah sambutan Beranda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Pimpinan & Foto */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Identitas & Foto Resmi Kepala Badan</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Foto Preview */}
            <div className="lg:col-span-4 flex flex-col items-center space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-36 h-48 rounded-xl overflow-hidden border-2 border-white bg-slate-200 relative">
                <img
                  src={settings.leaderPhoto}
                  alt={settings.leaderName}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900 text-xs">{settings.leaderName}</div>
                <div className="text-[10px] text-amber-700 font-semibold">{settings.leaderRank}</div>
                <div className="text-[10px] text-slate-500">{settings.leaderTitle}</div>
              </div>
            </div>

            {/* Input Identitas */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    URL Foto Profil Pimpinan *
                  </label>
                  <input
                    type="url"
                    required
                    value={settings.leaderPhoto}
                    onChange={(e) => handleChange('leaderPhoto', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Motto / Visi Kepemimpinan *
                </label>
                <textarea
                  rows={2}
                  required
                  value={settings.leaderMotto}
                  onChange={(e) => handleChange('leaderMotto', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Naskah Sambutan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Quote className="w-4 h-4 text-[#0f3d5c]" />
            <span>Naskah Lengkap Kata Sambutan Kepala Badan</span>
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Judul Utama Sambutan *
            </label>
            <input
              type="text"
              required
              value={settings.speechTitle}
              onChange={(e) => handleChange('speechTitle', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:border-[#0f3d5c]"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Isi Pokok Sambutan (Visi DOB, RPJPD 2025-2045, Riset & Inovasi BRIDA) *
            </label>
            <textarea
              rows={6}
              required
              value={settings.speechBody}
              onChange={(e) => handleChange('speechBody', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Paragraf Penutup & Harapan Kemitraan *
            </label>
            <textarea
              rows={3}
              required
              value={settings.speechClosing}
              onChange={(e) => handleChange('speechClosing', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Sambutan & Profil Pimpinan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
