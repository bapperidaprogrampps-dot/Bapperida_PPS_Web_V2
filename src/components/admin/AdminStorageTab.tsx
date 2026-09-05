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
  HelpCircle, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  Save,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { UploadService, ServerStorageStatus, UploadResult } from '../../services/uploadService';
import { ServerStorageConfig, StorageProvider } from '../../types';

interface AdminStorageTabProps {
  showToast: (msg: string) => void;
}

export function AdminStorageTab({ showToast }: AdminStorageTabProps) {
  const [config, setConfig] = useState<ServerStorageConfig>(UploadService.getStorageConfig());
  const [status, setStatus] = useState<ServerStorageStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live upload test state
  const [testCategory, setTestCategory] = useState<'documents' | 'images' | 'videos'>('documents');
  const [isUploadingTest, setIsUploadingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<UploadResult | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

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

  const handleSaveConfig = () => {
    UploadService.saveStorageConfig(config);
    showToast('Konfigurasi penyimpanan server Hostinger berhasil disimpan.');
    checkStatus();
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
      checkStatus();
    } catch (err: any) {
      showToast(`Gagal mengunggah: ${err.message}`);
    } finally {
      setIsUploadingTest(false);
      // Reset input
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
            <span>Penyimpanan Server & Hostinger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pengunggahan berkas dokumen (RPJPD/Renstra), dokumentasi foto, dan video beranda langsung ke penyimpanan server Hostinger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            id="storage-check-status-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Memeriksa...' : 'Cek Status Server'}</span>
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

      {/* Grid: Server Status & Folder Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Status Koneksi & Health (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#0f3d5c]" />
                <span>Status Penyimpanan Server</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl">
                  <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/uploads/documents</div>
                    <div className="text-[10px] text-slate-500">RPJPD, Renstra, PDF</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/uploads/images</div>
                    <div className="text-[10px] text-slate-500">Galeri, Berita, Foto</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                  <Film className="w-4 h-4 text-amber-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-900 truncate">/uploads/videos</div>
                    <div className="text-[10px] text-slate-500">Video Latar Beranda</div>
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
                Semua berkas yang diunggah melalui panel admin disimpan langsung ke server Hostinger Anda pada direktori <code className="px-1 py-0.5 bg-white rounded border border-sky-300 font-mono">/uploads/</code>. Berkas ini memiliki tautan permanen dan tidak bergantung pada layanan pihak ketiga.
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
                    Hostinger VPS / Cloud (Node.js Express — /api/upload)
                  </option>
                  <option value="hostinger-php">
                    Hostinger Shared Web Hosting (cPanel / PHP Handler — /api-hostinger/upload.php)
                  </option>
                  <option value="custom-url">
                    Custom Domain / Subdomain Upload URL
                  </option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  {config.provider === 'hostinger-server' && 'Menggunakan Node.js backend untuk menerima multipart form data secara otomatis.'}
                  {config.provider === 'hostinger-php' && 'Menggunakan upload.php di folder public_html untuk hosting cPanel/hPanel standar.'}
                  {config.provider === 'custom-url' && 'Tentukan URL endpoint lengkap jika server penyimpanan berada pada subdomain terpisah.'}
                </p>
              </div>

              {config.provider === 'custom-url' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Custom Upload Endpoint URL:
                  </label>
                  <input
                    type="url"
                    value={config.customApiUrl}
                    onChange={(e) => setConfig({ ...config, customApiUrl: e.target.value })}
                    placeholder="https://domain-hostinger.com/api/upload"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0f3d5c] focus:outline-none font-mono"
                  />
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

          {/* Panduan Deployment Hostinger */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Panduan Setup di Hostinger</span>
            </h3>

            <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-300">
              <p>
                <strong>Opsi A: Hostinger VPS / Node.js (Rekomendasi)</strong>
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[10px] text-amber-300 space-y-1 relative group">
                <div>mkdir -p uploads/documents uploads/images uploads/videos</div>
                <div>chmod -R 755 uploads</div>
                <div>npm install && npm run build</div>
                <div>npm run start</div>
                <button
                  onClick={() => handleCopy('mkdir -p uploads/documents uploads/images uploads/videos && chmod -R 755 uploads && npm install && npm run build && npm run start', 'vps')}
                  className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                  title="Salin Perintah"
                >
                  {copiedKey === 'vps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="pt-1">
                <strong>Opsi B: Hostinger Shared Hosting (cPanel / hPanel)</strong>
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Jalankan <code className="text-amber-300 font-mono">npm run build</code> di komputer lokal Anda.</li>
                <li>Unggah seluruh isi folder <code className="text-amber-300 font-mono">dist/</code> ke <code className="text-amber-300 font-mono">public_html/</code> di File Manager Hostinger.</li>
                <li>Pastikan file <code className="text-amber-300 font-mono">.htaccess</code> dan folder <code className="text-amber-300 font-mono">api-hostinger/</code> telah disalin.</li>
                <li>Ubah hak akses folder <code className="text-amber-300 font-mono">uploads/</code> menjadi <code className="text-amber-300 font-mono">755</code> di File Manager.</li>
              </ol>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
