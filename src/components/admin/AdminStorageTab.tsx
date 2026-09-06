import React, { useState, useEffect } from 'react';
import { 
  Server, 
  HardDrive, 
  FolderTree, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Terminal, 
  Save, 
  Check, 
  Copy, 
  Info,
  Download,
  Upload,
  ArrowUpDown,
  Globe2,
  Database,
  Layers,
  Wrench,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { UploadService, ServerStorageStatus, UploadResult } from '../../services/uploadService';
import { CentralSyncService, SyncStatus } from '../../services/centralSyncService';
import { ServerStorageConfig, StorageProvider } from '../../types';

interface AdminStorageTabProps {
  showToast: (msg: string) => void;
}

interface VpsFileInfo {
  key: string;
  filename: string;
  exists: boolean;
  size: number;
  sizeFormatted: string;
  recordCount: number;
  updatedAt: string | null;
}

interface VpsDiagData {
  success: boolean;
  server: string;
  port: number;
  status: string;
  nodeVersion: string;
  uploadsDir: string;
  dataDir: string;
  allReady: boolean;
  readyCount: number;
  totalCount: number;
  files: VpsFileInfo[];
}

const MODULE_DESCRIPTIONS: Record<string, string> = {
  settings: 'Pengaturan Instansi, Sambutan Pimpinan & Video Hero',
  articles: 'Berita & Rilis Resmi Bapperida',
  documents: 'Dokumen Perencanaan RPJPD, Renstra, RKPD',
  employees: 'Struktur Organisasi & Profil Pegawai',
  indicators: 'Indikator Makro Pembangunan Papua Selatan',
  agendas: 'Kalender & Agenda Kegiatan Kedinasan',
  gallery: 'Galeri Foto & Dokumentasi Lapangan',
  complaints: 'Aspirasi & Pengaduan Masyarakat',
  info_requests: 'Permohonan Informasi Publik PPID',
};

export function AdminStorageTab({ showToast }: AdminStorageTabProps) {
  const [config, setConfig] = useState<ServerStorageConfig>(UploadService.getStorageConfig());
  const [status, setStatus] = useState<ServerStorageStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Central sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(CentralSyncService.getStatus());
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const backupInputRef = React.useRef<HTMLInputElement | null>(null);

  // VPS JSON diagnostics state
  const [vpsDiag, setVpsDiag] = useState<VpsDiagData | null>(null);
  const [vpsError, setVpsError] = useState<string | null>(null);
  const [isCheckingVps, setIsCheckingVps] = useState<boolean>(false);
  const [isSeedingVps, setIsSeedingVps] = useState<boolean>(false);

  // Live upload test state
  const [testCategory, setTestCategory] = useState<'documents' | 'images' | 'videos'>('documents');
  const [isUploadingTest, setIsUploadingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<UploadResult | null>(null);

  useEffect(() => {
    checkAllStatuses();
    const unsub = CentralSyncService.subscribe((s) => setSyncStatus(s));
    return () => unsub();
  }, []);

  const checkAllStatuses = async () => {
    await Promise.all([checkStatus(), checkVpsStatus()]);
  };

  const handlePushAll = async () => {
    setIsPushing(true);
    try {
      const res = await CentralSyncService.pushAllToServer();
      showToast(res.message);
      await checkVpsStatus();
    } catch (e: any) {
      showToast(`Gagal: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const handlePullAll = async () => {
    setIsPulling(true);
    try {
      const res = await CentralSyncService.pullAllFromServer();
      showToast(res.message);
      await checkVpsStatus();
    } catch (e: any) {
      showToast(`Gagal: ${e.message}`);
    } finally {
      setIsPulling(false);
    }
  };

  const handleExportBackup = () => {
    CentralSyncService.exportBackupJson();
    showToast('File cadangan (.JSON) berhasil diunduh ke komputer Anda.');
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await CentralSyncService.importBackupJson(file);
      showToast(res.message);
      await checkVpsStatus();
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const result = await UploadService.checkServerStorageStatus();
      setStatus(result);
    } catch (e: any) {
      setStatus({
        online: false,
        provider: 'Hostinger Server Storage',
        error: e.message || 'Gagal memverifikasi status backend server'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const checkVpsStatus = async () => {
    setIsCheckingVps(true);
    setVpsError(null);
    try {
      const result = await CentralSyncService.checkVpsStatus();
      if (result.success && result.data) {
        setVpsDiag(result.data);
      } else {
        setVpsError(result.error || 'Gagal menghubungi status VPS');
      }
    } catch (err: any) {
      setVpsError(err.message || 'Error saat memeriksa status VPS');
    } finally {
      setIsCheckingVps(false);
    }
  };

  const handleSeedVps = async () => {
    setIsSeedingVps(true);
    try {
      const result = await CentralSyncService.seedVpsData(true);
      if (result.success) {
        showToast(result.message);
        await checkVpsStatus();
      } else {
        showToast(`Gagal: ${result.message}`);
      }
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`);
    } finally {
      setIsSeedingVps(false);
    }
  };

  const handleSaveConfig = () => {
    UploadService.saveStorageConfig(config);
    showToast('Konfigurasi penyimpanan server Hostinger berhasil disimpan.');
    checkAllStatuses();
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
    showToast('Perintah disalin ke clipboard.');
  };

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingTest(true);
      setTestResult(null);
      const res = await UploadService.uploadFileToServer(file, testCategory);
      setTestResult(res);
      showToast(`Uji coba unggah berhasil! Berkas disimpan di: ${res.url}`);
      checkAllStatuses();
    } catch (err: any) {
      showToast(`Gagal mengunggah: ${err.message}`);
    } finally {
      setIsUploadingTest(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-[#0f3d5c]" />
            <span>Penyimpanan Server & Hostinger VPS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola sinkronisasi berkas data JSON terpusat serta berkas dokumen, foto, dan video langsung di server Hostinger/VPS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkAllStatuses}
            disabled={isChecking || isCheckingVps}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            id="storage-check-status-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(isChecking || isCheckingVps) ? 'animate-spin' : ''}`} />
            <span>{(isChecking || isCheckingVps) ? 'Memeriksa...' : 'Cek Status Server & JSON'}</span>
          </button>

          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-[#0f3d5c] hover:bg-[#185377] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            id="storage-save-config-btn"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* KARTU UTAMA: SINKRONISASI TERPUSAT MULTI-BROWSER         */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0b2b40] to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg relative overflow-hidden">
        {/* Hidden Backup File Input */}
        <input
          type="file"
          ref={backupInputRef}
          onChange={handleImportBackup}
          accept=".json,application/json"
          className="hidden"
        />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Sinkronisasi Terpusat Server Hostinger & VPS</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Aktif
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Menyimpan pengaturan pimpinan, foto, berita, dan pegawai langsung di server Hostinger/VPS. Data selalu sinkron di semua browser (Chrome, Firefox, HP) dan domain Hostinger.
                </p>
              </div>
            </div>

            {/* Sync status indicator */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${syncStatus.state === 'synced' ? 'bg-emerald-400 animate-pulse' : syncStatus.state === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`}></span>
              <span className="text-slate-200 font-medium">
                {syncStatus.message}
              </span>
              {syncStatus.lastSyncedAt && (
                <span className="text-slate-400 text-[11px] ml-1">
                  ({syncStatus.lastSyncedAt})
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handlePushAll}
              disabled={isPushing || isPulling}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Upload className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
              <span>{isPushing ? 'Mengunggah ke Server...' : 'Unggah Data ke Server'}</span>
            </button>

            <button
              type="button"
              onClick={handlePullAll}
              disabled={isPushing || isPulling}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <ArrowUpDown className={`w-4 h-4 ${isPulling ? 'animate-spin' : ''}`} />
              <span>{isPulling ? 'Menarik dari Server...' : 'Tarik Data dari Server'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Unduh Cadangan (.JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => backupInputRef.current?.click()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Pulihkan dari File (.JSON)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
            <span>
              💡 <strong>Info Hostinger:</strong> Setiap kali Anda menekan <em>&quot;Simpan Perubahan&quot;</em> di menu foto pimpinan atau berita, sistem otomatis mengirim data terbaru ke server Hostinger.
            </span>
            <span className="font-mono text-[10px] bg-slate-800/60 px-2 py-0.5 rounded text-amber-300">
              Lokasi File Server: /uploads/data/*.json
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PANEL DIAGNOSTIK STATUS BERKAS DATA JSON VPS             */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0f3d5c]" />
              <span>Status &amp; Verifikasi Berkas Data JSON VPS</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh file basis data JSON yang tersimpan di direktori server <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-bold">uploads/data/</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSeedVps}
              disabled={isSeedingVps}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Wrench className={`w-3.5 h-3.5 text-amber-600 ${isSeedingVps ? 'animate-spin' : ''}`} />
              <span>{isSeedingVps ? 'Menginisialisasi...' : 'Inisialisasi / Perbaiki Seluruh JSON'}</span>
            </button>

            <button
              type="button"
              onClick={checkVpsStatus}
              disabled={isCheckingVps}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingVps ? 'animate-spin' : ''}`} />
              <span>Periksa Ulang</span>
            </button>
          </div>
        </div>

        {/* VPS Diagnostic Status Banner */}
        {vpsDiag && (
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900">Backend Node.js VPS Terhubung:</span>{' '}
                <span className="text-emerald-800">{vpsDiag.server} (Node {vpsDiag.nodeVersion})</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-emerald-800 font-mono">
              <span>Port: <strong>{vpsDiag.port}</strong></span>
              <span>Siap: <strong>{vpsDiag.readyCount}/{vpsDiag.totalCount} Modul</strong></span>
              <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-900 font-sans font-bold">Semua File Terverifikasi</span>
            </div>
          </div>
        )}

        {vpsError && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-900">Catatan Sambungan VPS / JSON:</div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {vpsError}
              </p>
              <div className="pt-1">
                <button
                  onClick={handleSeedVps}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Klik untuk Inisialisasi Berkas JSON Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table of 9 JSON files */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3.5 py-2.5">Modul Data</th>
                <th className="px-3.5 py-2.5">Nama File JSON</th>
                <th className="px-3.5 py-2.5">Ukuran File</th>
                <th className="px-3.5 py-2.5">Jumlah Record</th>
                <th className="px-3.5 py-2.5">Status di Server VPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {vpsDiag?.files && vpsDiag.files.length > 0 ? (
                vpsDiag.files.map((file) => (
                  <tr key={file.key} className="hover:bg-slate-50/80 transition">
                    <td className="px-3.5 py-2.5">
                      <div className="font-bold text-slate-800 capitalize">{file.key}</div>
                      <div className="text-[10px] text-slate-500">{MODULE_DESCRIPTIONS[file.key] || 'Data modul'}</div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-700 text-[11px]">
                      {file.filename}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-mono">
                      {file.sizeFormatted || `${file.size} B`}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700 font-semibold">
                      {file.recordCount > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {file.recordCount} entri
                        </span>
                      ) : (
                        <span className="text-slate-400">0 entri</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      {file.exists ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Tersimpan &amp; Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <XCircle className="w-3 h-3 text-amber-600" />
                          <span>Belum Ada</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                Object.entries(MODULE_DESCRIPTIONS).map(([key, desc]) => (
                  <tr key={key} className="hover:bg-slate-50/80 transition">
                    <td className="px-3.5 py-2.5">
                      <div className="font-bold text-slate-800 capitalize">{key}</div>
                      <div className="text-[10px] text-slate-500">{desc}</div>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-700 text-[11px]">
                      {key}.json
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-400 font-mono">-</td>
                    <td className="px-3.5 py-2.5 text-slate-400">-</td>
                    <td className="px-3.5 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                        <span>Menunggu Pengecekan</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Server Status & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Status Koneksi & Uji Coba (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#0f3d5c]" />
                <span>Status Penyimpanan Berkas &amp; Folder</span>
              </h3>
              
              {status?.online ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Server Hostinger Terhubung
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Mode Cadangan Aktif
                </span>
              )}
            </div>

            {/* Metric boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Penyedia Aktif</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                  {status?.provider || 'Hostinger Server'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Batas Maksimal File</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {config.maxFileSizeMB} MB per File
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-500">Folder Publik</div>
                <div className="text-xs font-mono font-bold text-amber-700 mt-0.5 truncate">
                  {status?.uploadBasePath || '/uploads'}
                </div>
              </div>
            </div>

            {/* Directory Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">
                Struktur Direktori Unggahan Server Hostinger:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/documents</div>
                    <div className="text-[10px] text-slate-500">RPJPD, Renstra, PDF</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/images</div>
                    <div className="text-[10px] text-slate-500">Galeri, Berita, Foto</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                  <Film className="w-4 h-4 text-amber-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/videos</div>
                    <div className="text-[10px] text-slate-500">Video Latar Beranda</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-purple-50/70 border border-purple-200/70 rounded-xl">
                  <Database className="w-4 h-4 text-purple-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/data</div>
                    <div className="text-[10px] text-slate-500">9 Berkas JSON Basis Data</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#0f3d5c]" />
                <span>Penyimpanan Berkas Mandiri (Self-Hosted Source)</span>
              </div>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Semua berkas yang diunggah melalui panel admin disimpan langsung ke server Hostinger/VPS Anda pada direktori <code className="px-1 py-0.5 bg-white rounded border border-sky-300 font-mono">/uploads/</code>. Berkas ini memiliki tautan permanen dan tidak bergantung pada layanan pihak ketiga.
              </p>
            </div>
          </div>

          {/* Uji Coba Unggah Langsung */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#0f3d5c]" />
              <span>Uji Coba Unggah Langsung ke Server Hostinger</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih kategori dan unggah satu berkas untuk menguji respon API server Hostinger secara nyata.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['documents', 'images', 'videos'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTestCategory(cat)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                      testCategory === cat
                        ? 'bg-white text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label className="px-4 py-2 bg-[#0f3d5c] hover:bg-[#185377] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer">
                <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUploadingTest ? 'Mengunggah...' : 'Pilih File Pengujian'}</span>
                <input
                  type="file"
                  onChange={handleTestUpload}
                  disabled={isUploadingTest}
                  className="hidden"
                />
              </label>
            </div>

            {/* Test Result Display */}
            {testResult && (
              <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Upload Berhasil ({testResult.storage})
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">{testResult.sizeFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-700 break-all">
                  <strong>URL Server:</strong>{' '}
                  <a 
                    href={testResult.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#0f3d5c] underline font-mono hover:text-amber-600"
                  >
                    {testResult.url}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Konfigurasi & Panduan Hostinger (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Form Konfigurasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#0f3d5c]" />
              <span>Opsi Target Server Hostinger</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arsitektur Lingkungan Hostinger:
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig({ ...config, provider: e.target.value as StorageProvider })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none"
                >
                  <option value="hostinger-server">
                    Hostinger VPS / Cloud (Node.js Express — Port 3000)
                  </option>
                  <option value="custom-url">
                    Custom Domain / IP VPS Subdomain Endpoint
                  </option>
                  <option value="hostinger-php">
                    Hostinger Shared Web Hosting (cPanel / PHP Handler)
                  </option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  {config.provider === 'hostinger-server' && 'Menggunakan Node.js backend Express untuk mengelola API upload dan penyimpanan JSON /uploads/data/.'}
                  {config.provider === 'custom-url' && 'Gunakan opsi ini jika aplikasi frontend diakses di domain terpisah atau IP VPS khusus (misal: http://103.xxx:3000/api/upload).'}
                  {config.provider === 'hostinger-php' && 'Menggunakan skrip PHP di folder public_html/api-hostinger/ untuk paket shared web hosting standar.'}
                </p>
              </div>

              {config.provider === 'custom-url' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    URL Endpoint Backend VPS:
                  </label>
                  <input
                    type="url"
                    value={config.customApiUrl}
                    onChange={(e) => setConfig({ ...config, customApiUrl: e.target.value })}
                    placeholder="http://IP_VPS_ANDA:3000/api/upload atau https://domain.com/api/upload"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-600">
                    Sistem otomatis menghubungkan endpoint sinkronisasi JSON ke <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">/api/sync/all</code> dan <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">/api/vps/status</code> pada server tersebut.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batas Maksimal File (MB):
                </label>
                <input
                  type="number"
                  value={config.maxFileSizeMB}
                  onChange={(e) => setConfig({ ...config, maxFileSizeMB: Number(e.target.value) || 120 })}
                  min={5}
                  max={500}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Default 120 MB untuk mendukung video profil beranda beresolusi tinggi dan dokumen PDF tebal.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoFallbackToIndexedDb}
                    onChange={(e) => setConfig({ ...config, autoFallbackToIndexedDb: e.target.checked })}
                    className="rounded text-[#0f3d5c] focus:ring-[#0f3d5c]"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Aktifkan cache lokal otomatis jika server sedang offline
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Panduan Deployment Hostinger & VPS */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Panduan Setup di VPS Hostinger</span>
            </h3>

            <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-300">
              <p>
                <strong>1. Perintah Menyiapkan Folder di VPS:</strong>
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[10px] text-amber-300 space-y-1 relative group">
                <div>mkdir -p uploads/documents uploads/images uploads/videos uploads/data</div>
                <div>chmod -R 755 uploads</div>
                <div>npm install && npm run build</div>
                <button
                  onClick={() => handleCopy('mkdir -p uploads/documents uploads/images uploads/videos uploads/data && chmod -R 755 uploads && npm install && npm run build', 'vps_folder')}
                  className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                  title="Salin Perintah"
                >
                  {copiedKey === 'vps_folder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="pt-1">
                <strong>2. Menjalankan Server VPS Terus-Menerus (PM2):</strong>
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[10px] text-emerald-300 space-y-1 relative group">
                <div>npm install -g pm2</div>
                <div>pm2 start dist/server.cjs --name bapperida-portal</div>
                <div>pm2 save && pm2 startup</div>
                <button
                  onClick={() => handleCopy('npm install -g pm2 && pm2 start dist/server.cjs --name bapperida-portal && pm2 save && pm2 startup', 'vps_pm2')}
                  className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                  title="Salin Perintah"
                >
                  {copiedKey === 'vps_pm2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-[10px] space-y-1 text-slate-300">
                <div className="font-bold text-amber-300">💡 Tips Port VPS:</div>
                <p>
                  Server otomatis berjalan di port 3000. Anda bisa menghubungkan domain Anda lewat Nginx reverse proxy ke <code className="text-white font-mono">http://127.0.0.1:3000</code>.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

