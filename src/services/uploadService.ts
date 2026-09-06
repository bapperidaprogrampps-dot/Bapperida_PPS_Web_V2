/**
 * uploadService.ts
 * Layanan Pengunggahan Berkas ke Penyimpanan Server Hostinger
 * 
 * Mendukung:
 * 1. Node.js / Express Server API (/api/upload) untuk Hostinger VPS / Cloud.
 * 2. PHP Upload Handler (/api-hostinger/upload.php) untuk Hostinger Shared Hosting (cPanel).
 * 3. Custom Server Endpoint URL jika hosting menggunakan subdomain/domain terpisah.
 * 4. Fallback otomatis ke IndexedDB/Local jika koneksi server sedang offline.
 */

import { ServerStorageConfig, StorageProvider } from '../types';
import { VideoStorageService } from './videoStorage';

const STORAGE_CONFIG_KEY = 'bapperida_storage_config_v1';

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  originalName: string;
  category: 'documents' | 'images' | 'videos' | 'general';
  size: number;
  sizeFormatted: string;
  mimetype: string;
  storage: 'hostinger-server' | 'hostinger-php' | 'custom-server' | 'indexeddb-fallback';
  uploadedAt: string;
  message?: string;
  error?: string;
}

export interface ServerStorageStatus {
  online: boolean;
  provider: string;
  totalFiles?: number;
  totalStorageUsed?: string;
  maxFileSize?: string;
  uploadBasePath?: string;
  categories?: Record<string, { count: number; totalSize: number; totalSizeFormatted: string }>;
  error?: string;
}

const DEFAULT_CONFIG: ServerStorageConfig = {
  provider: 'hostinger-server',
  customApiUrl: '/api/upload',
  uploadBasePath: '/uploads',
  maxFileSizeMB: 120,
  autoFallbackToIndexedDb: true
};

export const UploadService = {
  /**
   * Mengambil konfigurasi penyimpanan saat ini
   */
  getStorageConfig(): ServerStorageConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Gagal membaca storage config:', e);
    }
    return DEFAULT_CONFIG;
  },

  /**
   * Menyimpan konfigurasi penyimpanan server Hostinger
   */
  saveStorageConfig(config: Partial<ServerStorageConfig>): ServerStorageConfig {
    const current = this.getStorageConfig();
    const updated: ServerStorageConfig = { ...current, ...config };
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Gagal menyimpan storage config:', e);
    }
    return updated;
  },

  /**
   * Cek koneksi dan status penyimpanan server Hostinger
   */
  async checkServerStorageStatus(): Promise<ServerStorageStatus> {
    const config = this.getStorageConfig();

    // Jika menggunakan PHP handler
    if (config.provider === 'hostinger-php') {
      try {
        const res = await fetch('/api-hostinger/upload.php', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          return {
            online: true,
            provider: 'Hostinger Shared Hosting (PHP Storage)',
            maxFileSize: data.maxUploadSize || '128M',
            uploadBasePath: '/uploads'
          };
        }
      } catch (e: any) {
        return {
          online: false,
          provider: 'Hostinger Shared Hosting (PHP)',
          error: e.message || 'Tidak dapat terhubung ke endpoint PHP Hostinger'
        };
      }
    }

    // Default: Node.js Express server
    try {
      const targetUrl = config.provider === 'custom-url' && config.customApiUrl 
        ? config.customApiUrl.replace(/\/upload$/, '/storage/info')
        : '/api/storage/info';

      const res = await fetch(targetUrl);
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          provider: data.provider || 'Hostinger Server Storage (Local Disk)',
          totalFiles: data.totalFiles,
          totalStorageUsed: data.totalStorageUsed,
          maxFileSize: data.maxFileSize,
          uploadBasePath: data.uploadBasePath || '/uploads',
          categories: data.categories
        };
      } else {
        return {
          online: false,
          provider: 'Hostinger Server',
          error: `Server merespons status ${res.status}: ${res.statusText}`
        };
      }
    } catch (e: any) {
      return {
        online: false,
        provider: 'Hostinger Server Storage',
        error: e.message || 'Koneksi ke backend server belum aktif'
      };
    }
  },

  /**
   * Format ukuran file
   */
  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  /**
   * Mengunggah berkas ke server Hostinger
   * @param file File objek dari input browser
   * @param category Kategori folder server ('documents' | 'images' | 'videos' | 'general')
   */
  async uploadFileToServer(
    file: File, 
    category: 'documents' | 'images' | 'videos' | 'general' = 'general'
  ): Promise<UploadResult> {
    const config = this.getStorageConfig();
    const sizeFormatted = this.formatBytes(file.size);

    // Cek batas ukuran berkas
    const maxBytes = config.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`Ukuran berkas (${sizeFormatted}) melebihi batas maksimal konfigurasi (${config.maxFileSizeMB} MB)`);
    }

    // Tentukan target upload endpoint
    let uploadEndpoint = '/api/upload';
    if (config.provider === 'hostinger-php') {
      uploadEndpoint = '/api-hostinger/upload.php';
    } else if (config.provider === 'custom-url' && config.customApiUrl) {
      uploadEndpoint = config.customApiUrl;
    }

    // Buat FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    // Coba kirimkan ke endpoint server
    let lastError: any = null;

    // 1. Coba endpoint utama sesuai konfigurasi
    try {
      const result = await this.tryUploadEndpoint(uploadEndpoint, formData, file, category, config.provider);
      return result;
    } catch (err: any) {
      lastError = err;
      console.warn(`Percobaan upload ke ${uploadEndpoint} gagal:`, err.message);
    }

    // 2. Jika gagal dan menggunakan endpoint Node.js (/api/upload), coba otomatis ke PHP handler (/api-hostinger/upload.php) untuk Hostinger Shared Hosting
    if (uploadEndpoint === '/api/upload') {
      try {
        console.info('Mencoba endpoint alternatif Hostinger PHP (/api-hostinger/upload.php)...');
        const phpResult = await this.tryUploadEndpoint('/api-hostinger/upload.php', formData, file, category, 'hostinger-php');
        // Jika sukses lewat PHP, otomatis simpan konfigurasi ke hostinger-php
        this.saveStorageConfig({ provider: 'hostinger-php' });
        return phpResult;
      } catch (phpErr: any) {
        lastError = phpErr;
        console.warn('Percobaan endpoint PHP juga gagal:', phpErr.message);
      }
    }

    // 3. Jika kedua backend server belum aktif atau gagal izin folder, gunakan fallback offline (IndexedDB / Base64 Data URL)
    if (config.autoFallbackToIndexedDb) {
      console.info('Mengaktifkan fallback penyimpanan lokal (DataURL) agar pengguna tetap bisa mengunggah foto...');
      return this.handleOfflineFallback(file, category);
    }

    throw lastError || new Error('Gagal mengunggah berkas ke server Hostinger');
  },

  /**
   * Helper untuk mencoba request upload ke endpoint tertentu
   */
  async tryUploadEndpoint(
    endpoint: string,
    formData: FormData,
    file: File,
    category: 'documents' | 'images' | 'videos' | 'general',
    providerName: string
  ): Promise<UploadResult> {
    const sizeFormatted = this.formatBytes(file.size);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.url) {
        return {
          success: true,
          url: data.url,
          filename: data.filename || file.name,
          originalName: data.originalName || file.name,
          category,
          size: file.size,
          sizeFormatted: data.sizeFormatted || sizeFormatted,
          mimetype: data.mimetype || file.type,
          storage: providerName === 'hostinger-php' ? 'hostinger-php' : 'hostinger-server',
          uploadedAt: data.uploadedAt || new Date().toISOString(),
          message: data.message || `Berkas berhasil disimpan di server Hostinger (${data.url})`
        };
      } else {
        throw new Error(data.error || 'Server tidak mengembalikan URL berkas');
      }
    } else {
      let errMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData.error) errMessage = errData.error;
      } catch {
        // ignore
      }
      throw new Error(errMessage);
    }
  },

  /**
   * Fallback aman saat server backend belum online di sesi preview
   */
  async handleOfflineFallback(
    file: File,
    category: 'documents' | 'images' | 'videos' | 'general'
  ): Promise<UploadResult> {
    const sizeFormatted = this.formatBytes(file.size);

    if (category === 'videos' || file.type.startsWith('video/')) {
      // Simpan di IndexedDB
      await VideoStorageService.saveHeroVideo(file);
      const blobUrl = await VideoStorageService.getHeroVideoBlobUrl();
      return {
        success: true,
        url: blobUrl || URL.createObjectURL(file),
        filename: file.name,
        originalName: file.name,
        category: 'videos',
        size: file.size,
        sizeFormatted,
        mimetype: file.type || 'video/mp4',
        storage: 'indexeddb-fallback',
        uploadedAt: new Date().toISOString(),
        message: 'Disimpan di cache lokal IndexedDB (Server Hostinger sedang offline saat ini)'
      };
    }

    // Untuk gambar dan dokumen: Buat Data URL / Blob URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        resolve({
          success: true,
          url: resultUrl,
          filename: file.name,
          originalName: file.name,
          category,
          size: file.size,
          sizeFormatted,
          mimetype: file.type,
          storage: 'indexeddb-fallback',
          uploadedAt: new Date().toISOString(),
          message: 'Disimpan di media cache lokal (Server Hostinger offline)'
        });
      };
      reader.onerror = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve({
          success: true,
          url: objectUrl,
          filename: file.name,
          originalName: file.name,
          category,
          size: file.size,
          sizeFormatted,
          mimetype: file.type,
          storage: 'indexeddb-fallback',
          uploadedAt: new Date().toISOString(),
          message: 'Disimpan via Blob Object (Server Hostinger offline)'
        });
      };
      reader.readAsDataURL(file);
    });
  }
};
