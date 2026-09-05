import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ExternalLink, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { AgencySettings } from '../../types';
import { StorageService } from '../../services/storage';
import { defaultAgencySettings } from '../../data/mockData';

interface AdminSettingsTabProps {
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

export function AdminSettingsTab({ onDataChanged, showToast }: AdminSettingsTabProps) {
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
    showToast('Pengaturan instansi, kontak dan tautan layanan berhasil disimpan.');
    onDataChanged();
  };

  const handleResetData = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset SELURUH data portal (dokumen, berita, agenda, pengaduan, sambutan) kembali ke data demo awal?')) {
      StorageService.resetAllToDefault();
      setSettings(defaultAgencySettings);
      showToast('Seluruh data portal berhasil direset ke kondisi awal.');
      onDataChanged();
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backup = {
      agencySettings: StorageService.getAgencySettings(),
      documents: StorageService.getDocuments(),
      articles: StorageService.getArticles(),
      agendas: StorageService.getAgendas(),
      gallery: StorageService.getGallery(),
      complaints: StorageService.getComplaints(),
      infoRequests: StorageService.getInfoRequests(),
      indicators: StorageService.getIndicatorStats(),
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bapperida-pps-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Cadangan data portal (.JSON) berhasil diunduh.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0f3d5c]" />
            <span>Pengaturan Umum Portal, Kontak & Tautan Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur alamat sekretariat kantor, hotline WhatsApp pelayanan, surel resmi, dan integrasi aplikasi eksternal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Download JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Cadangan JSON</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Kontak & Sekretariat */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Identitas Kantor Sekretariat & Layanan Publik</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Kantor Bapperida Provinsi Papua Selatan *
              </label>
              <textarea
                rows={2}
                required
                value={settings.officeAddress}
                onChange={(e) => handleChange('officeAddress', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jam Layanan Operasional *
              </label>
              <input
                type="text"
                required
                value={settings.officeHours}
                onChange={(e) => handleChange('officeHours', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Telepon Kantor
              </label>
              <input
                type="text"
                value={settings.officePhone}
                onChange={(e) => handleChange('officePhone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                WhatsApp Helpdesk / Pengaduan Cepat *
              </label>
              <input
                type="text"
                required
                value={settings.helpdeskWhatsapp || ''}
                onChange={(e) => handleChange('helpdeskWhatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Surel (Email) Resmi *
              </label>
              <input
                type="email"
                required
                value={settings.officeEmail}
                onChange={(e) => handleChange('officeEmail', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>
          </div>
        </div>

        {/* Tautan Aplikasi Eksternal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#0f3d5c]" />
            <span>Integrasi Tautan Portal & Sistem Nasional</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                SIPD RI (Kemendagri) URL
              </label>
              <input
                type="url"
                value={settings.sipdUrl}
                onChange={(e) => handleChange('sipdUrl', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                KRISNA DAK (Kementerian PPN / Bappenas) URL
              </label>
              <input
                type="url"
                value={settings.krisnaUrl}
                onChange={(e) => handleChange('krisnaUrl', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Portal Utama Pemprov Papua Selatan
              </label>
              <input
                type="url"
                value={settings.provincialPortalUrl}
                onChange={(e) => handleChange('provincialPortalUrl', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                BPS Provinsi Papua Selatan URL
              </label>
              <input
                type="url"
                value={settings.bpsPapuaSelatanUrl}
                onChange={(e) => handleChange('bpsPapuaSelatanUrl', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                SP4N-LAPOR! Nasional URL
              </label>
              <input
                type="url"
                value={settings.laporUrl}
                onChange={(e) => handleChange('laporUrl', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Portal</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Database / LocalStorage */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h4>Zona Pemeliharaan & Reset Database</h4>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Tombol ini akan menghapus semua perubahan lokal yang tersimpan di peramban dan mengembalikan seluruh data dokumen, berita, agenda, pengaduan, dan profil pimpinan ke data bawaan awal Bapperida Papua Selatan.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Seluruh Data Portal ke Bawaan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
