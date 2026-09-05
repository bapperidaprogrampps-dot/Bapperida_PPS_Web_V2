/**
 * videoStorage.ts
 * Layanan penyimpanan video lokal berbasis IndexedDB.
 * Memungkinkan administrator mengunggah video resolusi tinggi (MP4/WebM)
 * tanpa batasan kuota 5MB localStorage, dan tetap tersimpan saat halaman dimuat ulang.
 */

const DB_NAME = 'bapperida_pps_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'hero_videos';
const HERO_VIDEO_KEY = 'active_hero_video';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada browser ini'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export interface VideoMeta {
  name: string;
  sizeFormatted: string;
  type: string;
  updatedAt: string;
}

export const VideoStorageService = {
  /**
   * Simpan file video yang diunggah dari modul admin ke IndexedDB
   */
  async saveHeroVideo(file: File): Promise<VideoMeta> {
    const db = await openDB();
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const updatedAt = new Date().toLocaleString('id-ID');

    const record = {
      id: HERO_VIDEO_KEY,
      blob: file,
      name: file.name,
      sizeFormatted: sizeInMB,
      type: file.type || 'video/mp4',
      updatedAt
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => {
        // Broadcast custom event agar hero banner di beranda langsung update tanpa reload
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hero-video-updated'));
        }
        resolve({
          name: file.name,
          sizeFormatted: sizeInMB,
          type: file.type || 'video/mp4',
          updatedAt
        });
      };

      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Ambil Object URL dari video yang tersimpan di IndexedDB
   * Mengembalikan null jika belum ada video kustom yang diunggah
   */
  async getHeroVideoBlobUrl(): Promise<string | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(HERO_VIDEO_KEY);

        req.onsuccess = () => {
          const result = req.result;
          if (result && result.blob) {
            const url = URL.createObjectURL(result.blob);
            resolve(url);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  /**
   * Ambil informasi metadata video kustom aktif
   */
  async getHeroVideoMeta(): Promise<VideoMeta | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(HERO_VIDEO_KEY);

        req.onsuccess = () => {
          const result = req.result;
          if (result && result.name) {
            resolve({
              name: result.name,
              sizeFormatted: result.sizeFormatted || 'Ukuran tidak diketahui',
              type: result.type || 'video/mp4',
              updatedAt: result.updatedAt || 'Baru saja'
            });
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  /**
   * Hapus video kustom dan kembalikan ke video referensi bawaan
   */
  async deleteHeroVideo(): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(HERO_VIDEO_KEY);

        req.onsuccess = () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('hero-video-updated'));
          }
          resolve();
        };

        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Gagal menghapus video:', err);
    }
  }
};
