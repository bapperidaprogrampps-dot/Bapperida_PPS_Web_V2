/**
 * centralSyncService.ts
 * Layanan Sinkronisasi Terpusat ke Server Hostinger
 * 
 * Memastikan data (pengaturan pimpinan, berita, pegawai, dokumen, dll.)
 * tersimpan terpusat di server Hostinger (Node.js API atau PHP Handler),
 * sehingga selalu terupdate di semua browser (Chrome, Firefox, Safari, Edge, HP)
 * dan tidak hilang saat membuka dari domain sementara ataupun domain resmi.
 */

import { UploadService } from './uploadService';
import { 
  initialArticles, 
  initialDocuments, 
  initialEmployees, 
  defaultAgencySettings, 
  regionalIndicatorStats, 
  initialAgendas, 
  initialGallery, 
  initialComplaints 
} from '../data/mockData';

export const SYNC_KEYS = {
  SETTINGS: 'settings',
  ARTICLES: 'articles',
  DOCUMENTS: 'documents',
  EMPLOYEES: 'employees',
  INDICATORS: 'indicators',
  AGENDAS: 'agendas',
  GALLERY: 'gallery',
  COMPLAINTS: 'complaints',
  INFO_REQUESTS: 'info_requests',
} as const;

export const LOCAL_STORAGE_MAP: Record<string, string> = {
  settings: 'bapperida_pps_settings_v1',
  articles: 'bapperida_pps_articles_v1',
  documents: 'bapperida_pps_documents_v1',
  employees: 'bapperida_pps_employees_v1',
  indicators: 'bapperida_pps_indicators_v1',
  agendas: 'bapperida_pps_agendas_v1',
  gallery: 'bapperida_pps_gallery_v1',
  complaints: 'bapperida_pps_complaints_v1',
  info_requests: 'bapperida_pps_info_requests_v1',
};

const DEFAULTS_MAP: Record<string, any> = {
  articles: initialArticles,
  documents: initialDocuments,
  employees: initialEmployees,
  settings: defaultAgencySettings,
  indicators: regionalIndicatorStats,
  agendas: initialAgendas,
  gallery: initialGallery,
  complaints: initialComplaints,
  info_requests: []
};

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
  serverType: 'hostinger-node' | 'hostinger-php' | 'offline';
  message: string;
}

type SyncListener = (status: SyncStatus) => void;

class CentralSyncServiceManager {
  private status: SyncStatus = {
    state: 'idle',
    lastSyncedAt: null,
    serverType: 'hostinger-node',
    message: 'Menghubungkan ke server Hostinger...'
  };

  private listeners: Set<SyncListener> = new Set();
  private hasInitialized = false;

  constructor() {
    // Restore last sync time from local storage if available
    try {
      const savedTime = localStorage.getItem('bapperida_last_server_sync');
      if (savedTime) {
        this.status.lastSyncedAt = savedTime;
      }
    } catch {
      // ignore
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.status);
      } catch (e) {
        console.error('Error notifying sync listener:', e);
      }
    });
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  /**
   * Mengambil origin / URL dasar endpoint jika menggunakan custom server VPS
   */
  public getApiBaseUrl(): string {
    if (typeof window === 'undefined') return '';
    try {
      const config = UploadService.getStorageConfig();
      if (config.provider === 'custom-url' && config.customApiUrl) {
        return config.customApiUrl.replace(/\/api\/upload\/?$/, '').replace(/\/+$/, '');
      }
    } catch {
      // ignore
    }
    return '';
  }

  /**
   * Mengirim request dengan fallback otomatis dari Node.js API ke PHP API
   */
  private async fetchWithFallback(nodeUrl: string, phpUrl: string, options: RequestInit = {}): Promise<any> {
    const baseUrl = this.getApiBaseUrl();
    const fullNodeUrl = nodeUrl.startsWith('http') ? nodeUrl : `${baseUrl}${nodeUrl}`;
    const fullPhpUrl = phpUrl.startsWith('http') ? phpUrl : `${baseUrl}${phpUrl}`;

    try {
      // 1. Coba endpoint Node.js Express lebih dulu (standar VPS / container)
      const res = await fetch(fullNodeUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      if (res.ok) {
        const text = await res.text();
        // Cegah JSON error jika endpoint salah merespons file HTML/PHP
        if (text.trim().startsWith('<')) {
          throw new Error('Endpoint Node mengembalikan respons HTML/XML alih-alih JSON.');
        }
        const json = JSON.parse(text);
        this.status.serverType = 'hostinger-node';
        return json;
      }
    } catch (nodeErr) {
      console.warn(`Endpoint Node (${fullNodeUrl}) belum merespon, mencoba endpoint PHP (${fullPhpUrl})...`);
    }

    // 2. Fallback ke endpoint Hostinger PHP
    try {
      const resPhp = await fetch(fullPhpUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      if (resPhp.ok) {
        const text = await resPhp.text();
        // Cegah JSON parse error jika file php dikembalikan mentah sebagai plain text
        if (text.trim().startsWith('<?php')) {
          throw new Error('Server web belum memproses skrip PHP (mengembalikan kode mentah). Jika menggunakan VPS, pastikan backend Node.js aktif di port 3000.');
        }
        const json = JSON.parse(text);
        this.status.serverType = 'hostinger-php';
        return json;
      }
      throw new Error(`HTTP ${resPhp.status} saat mengakses endpoint PHP`);
    } catch (phpErr: any) {
      this.status.serverType = 'offline';
      throw phpErr;
    }
  }

  /**
   * Cek kesehatan dan status 9 berkas JSON di VPS (/api/vps/status)
   */
  public async checkVpsStatus(): Promise<{ success: boolean; data?: any; error?: string }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/vps/status`);
      if (res.ok) {
        const text = await res.text();
        if (text.trim().startsWith('<?php') || text.trim().startsWith('<')) {
          return { 
            success: false, 
            error: 'Server mengembalikan skrip PHP/HTML mentah. Pastikan Node.js Express aktif di VPS pada port 3000.' 
          };
        }
        const data = JSON.parse(text);
        return { success: true, data };
      }
      return { success: false, error: `Server VPS merespons HTTP ${res.status}: ${res.statusText}` };
    } catch (e: any) {
      return { success: false, error: e.message || 'Tidak dapat terhubung ke endpoint VPS' };
    }
  }

  /**
   * Inisialisasi atau perbaiki seluruh berkas JSON di VPS (/api/vps/seed)
   */
  public async seedVpsData(force = false): Promise<{ success: boolean; message: string }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/vps/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force })
      });
      if (res.ok) {
        const data = await res.json();
        // Tarik kembali data terbaru ke browser lokal
        await this.pullAllFromServer();
        return { 
          success: true, 
          message: data.message || 'Seluruh berkas JSON di VPS berhasil diinisialisasi!' 
        };
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      return { success: false, message: e.message || 'Gagal inisialisasi JSON di VPS' };
    }
  }

  /**
   * Menarik seluruh data terbaru dari server Hostinger ke browser
   */
  public async pullAllFromServer(): Promise<{ success: boolean; updatedCount: number; message: string }> {
    this.status.state = 'syncing';
    this.status.message = 'Menyinkronkan data dengan server Hostinger...';
    this.notify();

    try {
      const result = await this.fetchWithFallback(
        '/api/sync/all',
        '/api-hostinger/data.php?all=true',
        { method: 'GET' }
      );

      if (result && result.success && result.data) {
        const serverData = result.data;
        const keys = Object.keys(serverData);

        if (keys.length > 0) {
          let count = 0;
          keys.forEach((key) => {
            const localKey = LOCAL_STORAGE_MAP[key];
            if (localKey && serverData[key]) {
              try {
                let itemData = serverData[key];
                // Sanitize: Jangan timpa pengaturan dengan blob URL sesi lama yang sudah mati
                if (key === 'settings' && itemData?.heroVideoServerUrl && typeof itemData.heroVideoServerUrl === 'string' && itemData.heroVideoServerUrl.startsWith('blob:')) {
                  delete itemData.heroVideoServerUrl;
                }
                localStorage.setItem(localKey, JSON.stringify(itemData));
                count++;
              } catch (e) {
                console.error(`Gagal menyimpan key ${key} ke local storage:`, e);
              }
            }
          });

          const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          this.status.state = 'synced';
          this.status.lastSyncedAt = now;
          this.status.message = `Data terhubung ke server (${count} modul terupdate)`;
          localStorage.setItem('bapperida_last_server_sync', now);
          this.notify();

          // Beritahu komponen React bahwa data terupdate
          window.dispatchEvent(new CustomEvent('bapperida:data-synced', { detail: serverData }));

          return {
            success: true,
            updatedCount: count,
            message: `Berhasil menyinkronkan ${count} modul data dari server Hostinger.`
          };
        } else {
          // Server masih kosong, lakukan inisialisasi awal (push local data to server)
          console.info('Server Hostinger masih kosong, melakukan seeding awal dari data lokal...');
          await this.pushAllToServer();
          this.status.state = 'synced';
          this.status.message = 'Data awal berhasil diinisialisasi ke server Hostinger';
          this.notify();
          return {
            success: true,
            updatedCount: 0,
            message: 'Data awal berhasil disimpan ke server Hostinger.'
          };
        }
      }

      throw new Error(result?.error || 'Format data server tidak dikenali');
    } catch (error: any) {
      console.warn('Sinkronisasi otomatis dari server belum dapat terhubung:', error.message);
      this.status.state = 'error';
      this.status.message = 'Menggunakan cache lokal (server offline atau belum terpasang)';
      this.notify();
      return {
        success: false,
        updatedCount: 0,
        message: error.message || 'Gagal menyinkronkan data dari server.'
      };
    }
  }

  /**
   * Menyimpan 1 modul data tertentu langsung ke server Hostinger
   */
  public async syncKeyToServer(key: string, data: any): Promise<boolean> {
    try {
      let payload = data;
      if (key === 'settings' && payload?.heroVideoServerUrl && typeof payload.heroVideoServerUrl === 'string' && payload.heroVideoServerUrl.startsWith('blob:')) {
        payload = { ...payload };
        delete payload.heroVideoServerUrl;
      }

      await this.fetchWithFallback(
        `/api/data/${key}`,
        `/api-hostinger/data.php?key=${key}`,
        {
          method: 'POST',
          body: JSON.stringify({ key, data: payload })
        }
      );

      const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      this.status.state = 'synced';
      this.status.lastSyncedAt = now;
      this.status.message = `Data ${key} tersimpan di server (${now})`;
      localStorage.setItem('bapperida_last_server_sync', now);
      this.notify();
      return true;
    } catch (e: any) {
      console.warn(`Gagal menyimpan ${key} ke server terpusat:`, e.message);
      this.status.state = 'error';
      this.status.message = `Gagal menyimpan ke server: ${e.message}`;
      this.notify();
      return false;
    }
  }

  /**
   * Mengirimkan SEMUA data lokal saat ini ke server Hostinger
   */
  public async pushAllToServer(): Promise<{ success: boolean; message: string }> {
    this.status.state = 'syncing';
    this.status.message = 'Mengunggah seluruh data ke server Hostinger...';
    this.notify();

    try {
      const allData: Record<string, any> = {};

      Object.entries(LOCAL_STORAGE_MAP).forEach(([key, localKey]) => {
        try {
          const raw = localStorage.getItem(localKey);
          if (raw) {
            let parsed = JSON.parse(raw);
            if (key === 'settings' && parsed?.heroVideoServerUrl && typeof parsed.heroVideoServerUrl === 'string' && parsed.heroVideoServerUrl.startsWith('blob:')) {
              delete parsed.heroVideoServerUrl;
            }
            allData[key] = parsed;
          } else if (DEFAULTS_MAP[key]) {
            // Gunakan fallback data bawaan jika localStorage belum terisi
            allData[key] = DEFAULTS_MAP[key];
          }
        } catch {
          if (DEFAULTS_MAP[key]) {
            allData[key] = DEFAULTS_MAP[key];
          }
        }
      });

      const result = await this.fetchWithFallback(
        '/api/sync/all',
        '/api-hostinger/data.php',
        {
          method: 'POST',
          body: JSON.stringify({ all: allData, data: allData })
        }
      );

      if (result && result.success) {
        const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        this.status.state = 'synced';
        this.status.lastSyncedAt = now;
        this.status.message = `Semua modul berhasil tersimpan ke server Hostinger (${now})`;
        localStorage.setItem('bapperida_last_server_sync', now);
        this.notify();
        return {
          success: true,
          message: 'Seluruh data dan pengaturan pimpinan berhasil disimpan terpusat di server Hostinger!'
        };
      }

      throw new Error(result?.error || 'Gagal menyimpan data ke server');
    } catch (error: any) {
      this.status.state = 'error';
      this.status.message = `Gagal mengunggah ke server: ${error.message}`;
      this.notify();
      return {
        success: false,
        message: error.message || 'Gagal mengunggah data ke server.'
      };
    }
  }

  /**
   * Inisialisasi otomatis pada awal pembukaan aplikasi
   */
  public async init(): Promise<void> {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    // Lakukan penarikan data dari server di background
    setTimeout(() => {
      this.pullAllFromServer().catch((e) => {
        console.warn('Initial background sync error:', e);
      });
    }, 100);
  }

  /**
   * Ekspor seluruh data cadangan ke file JSON (Backup Offline)
   */
  public exportBackupJson(): void {
    const backup: Record<string, any> = {
      meta: {
        app: 'Bapperida Provinsi Papua Selatan Portal',
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      },
      data: {}
    };

    Object.entries(LOCAL_STORAGE_MAP).forEach(([key, localKey]) => {
      try {
        const raw = localStorage.getItem(localKey);
        if (raw) {
          backup.data[key] = JSON.parse(raw);
        }
      } catch {
        // ignore
      }
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `backup-bapperida-papua-selatan-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Pulihkan data dari file JSON cadangan
   */
  public async importBackupJson(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const dataToRestore = parsed.data || parsed;
      if (!dataToRestore || typeof dataToRestore !== 'object') {
        throw new Error('Format file cadangan JSON tidak sesuai.');
      }

      let restoredCount = 0;
      Object.entries(dataToRestore).forEach(([key, val]) => {
        const localKey = LOCAL_STORAGE_MAP[key];
        if (localKey && val) {
          try {
            localStorage.setItem(localKey, JSON.stringify(val));
            restoredCount++;
          } catch {
            // ignore
          }
        }
      });

      // Sinkronkan hasil pemulihan ke server Hostinger
      await this.pushAllToServer();

      // Trigger update event
      window.dispatchEvent(new CustomEvent('bapperida:data-synced', { detail: dataToRestore }));

      return {
        success: true,
        message: `Berhasil memulihkan ${restoredCount} modul data dan menyinkronkannya ke server!`
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Gagal membaca file cadangan.'
      };
    }
  }

  /**
   * Cek status koneksi dan tabel MySQL di server Hostinger
   */
  public async checkMysqlStatus(): Promise<{
    success: boolean;
    connected: boolean;
    config?: { host: string; port: number; user: string; database: string };
    version?: string;
    tables?: Array<{ name: string; key?: string; rows: number; uninitialized?: boolean }>;
    error?: string;
  }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/mysql/status`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      const phpRes = await fetch(`${baseUrl}/api-hostinger/mysql.php?action=status`);
      if (phpRes.ok) {
        const phpData = await phpRes.json();
        return phpData;
      }
      return {
        success: false,
        connected: false,
        error: `Server merespons status HTTP ${res.status}`
      };
    } catch (e: any) {
      return {
        success: false,
        connected: false,
        error: e.message || 'Tidak dapat terhubung ke endpoint MySQL server'
      };
    }
  }

  /**
   * Migrasi seluruh data dari cache / file ke database MySQL
   */
  public async migrateToMysql(): Promise<{ success: boolean; message: string; migratedModules?: string[] }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      // Pastikan data lokal di-push lebih dulu
      await this.pushAllToServer();

      const res = await fetch(`${baseUrl}/api/mysql/migrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: data.success,
          message: data.success 
            ? `Berhasil memigrasikan ${data.migratedModules?.length || 0} modul ke tabel-tabel MySQL!`
            : data.error || 'Migrasi gagal',
          migratedModules: data.migratedModules
        };
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Gagal memicu migrasi MySQL'
      };
    }
  }

  /**
   * Reset seluruh konfigurasi database MySQL ke status bersih/kosong
   */
  public async resetMysqlConfig(): Promise<{ success: boolean; message: string }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/mysql/reset`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, message: `Server merespons HTTP ${res.status}` };
    } catch (e: any) {
      return { success: false, message: e.message || 'Gagal menghubungi server untuk reset database' };
    }
  }

  /**
   * Simpan konfigurasi database MySQL baru
   */
  public async updateMysqlConfig(cfg: { host?: string; port?: number; user?: string; password?: string; database?: string }): Promise<{ success: boolean; message: string; status?: any }> {
    const baseUrl = this.getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/mysql/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg)
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, message: `Server merespons HTTP ${res.status}` };
    } catch (e: any) {
      return { success: false, message: e.message || 'Gagal mengirim konfigurasi database ke server' };
    }
  }
}

export const CentralSyncService = new CentralSyncServiceManager();
