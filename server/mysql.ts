/**
 * server/mysql.ts
 * Integrasi Basis Data MySQL / MariaDB Terpusat
 * Portal Bapperida Provinsi Papua Selatan
 * 
 * Mendukung Hostinger VPS, Cloud, dan cPanel MySQL.
 * Menggunakan pola Lazy Initialization agar server tetap berjalan lancar
 * meskipun database MySQL sedang offline atau sedang dalam proses konfigurasi.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

let pool: mysql.Pool | null = null;
let isInitialized = false;

/**
 * Mengambil konfigurasi MySQL dari environment variable
 */
export function getMysqlConfig(): MysqlConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bapperida_db',
  };
}

/**
 * Mendapatkan koneksi MySQL Pool secara lazy (hanya dibuat saat dibutuhkan)
 */
export async function getMysqlPool(): Promise<mysql.Pool | null> {
  const config = getMysqlConfig();

  // Jika belum ada pool, inisialisasi pool baru
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000,
      });

      // Tes koneksi
      const conn = await pool.getConnection();
      conn.release();
    } catch (err: any) {
      console.warn('⚠️ Koneksi MySQL belum aktif:', err.message);
      pool = null;
      return null;
    }
  }

  // Jika pool sudah ada dan belum membuat tabel, buat tabel otomatis
  if (pool && !isInitialized) {
    try {
      await initTables(pool);
      isInitialized = true;
    } catch (e: any) {
      console.warn('⚠️ Gagal membuat skema tabel MySQL:', e.message);
    }
  }

  return pool;
}

/**
 * Inisialisasi struktur tabel di database MySQL jika belum ada
 */
export async function initTables(p: mysql.Pool): Promise<void> {
  const tables = [
    `CREATE TABLE IF NOT EXISTS tb_settings (
      setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
      setting_value LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_articles (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      excerpt TEXT,
      content LONGTEXT,
      image TEXT,
      date VARCHAR(50),
      author VARCHAR(100),
      read_time VARCHAR(50),
      is_featured TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_documents (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      year VARCHAR(10),
      size VARCHAR(50),
      file_url TEXT,
      description TEXT,
      download_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_employees (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      nip VARCHAR(100),
      division VARCHAR(100),
      photo TEXT,
      bio TEXT,
      phone VARCHAR(50),
      email VARCHAR(100),
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_indicators (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      value VARCHAR(100) NOT NULL,
      unit VARCHAR(50),
      change_val VARCHAR(50),
      is_positive TINYINT(1) DEFAULT 1,
      year VARCHAR(10),
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_agendas (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(50),
      time VARCHAR(50),
      location VARCHAR(255),
      category VARCHAR(100),
      description TEXT,
      status VARCHAR(50) DEFAULT 'upcoming',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_gallery (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      image_url TEXT,
      date VARCHAR(50),
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_complaints (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      ticket_number VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(50),
      category VARCHAR(100),
      subject VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      response TEXT,
      created_at VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS tb_info_requests (
      id VARCHAR(100) NOT NULL PRIMARY KEY,
      ticket_number VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      nik VARCHAR(50),
      email VARCHAR(100),
      phone VARCHAR(50),
      address TEXT,
      job VARCHAR(100),
      info_needed TEXT,
      reason TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  ];

  for (const sql of tables) {
    await p.query(sql);
  }
}

/**
 * Tes status koneksi MySQL & hitung jumlah entri per tabel
 */
export async function testMysqlConnection(): Promise<{
  connected: boolean;
  config: Partial<MysqlConfig>;
  version?: string;
  tables?: Array<{ name: string; key: string; rows: number }>;
  error?: string;
}> {
  const cfg = getMysqlConfig();
  const safeConfig = {
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    database: cfg.database
  };

  try {
    const p = await getMysqlPool();
    if (!p) {
      return {
        connected: false,
        config: safeConfig,
        error: 'Tidak dapat membuat koneksi ke MySQL. Pastikan service MySQL/MariaDB berjalan di Hostinger dan parameter DB_* di .env telah diisi.'
      };
    }

    const [verRows]: any = await p.query('SELECT VERSION() AS version');
    const version = verRows[0]?.version || 'MySQL';

    const tableMapping = [
      { name: 'tb_settings', key: 'settings' },
      { name: 'tb_articles', key: 'articles' },
      { name: 'tb_documents', key: 'documents' },
      { name: 'tb_employees', key: 'employees' },
      { name: 'tb_indicators', key: 'indicators' },
      { name: 'tb_agendas', key: 'agendas' },
      { name: 'tb_gallery', key: 'gallery' },
      { name: 'tb_complaints', key: 'complaints' },
      { name: 'tb_info_requests', key: 'info_requests' },
    ];

    const tablesStats = [];
    for (const item of tableMapping) {
      try {
        const [countRows]: any = await p.query(`SELECT COUNT(*) as count FROM ${item.name}`);
        tablesStats.push({
          name: item.name,
          key: item.key,
          rows: countRows[0]?.count || 0
        });
      } catch {
        tablesStats.push({
          name: item.name,
          key: item.key,
          rows: 0
        });
      }
    }

    return {
      connected: true,
      config: safeConfig,
      version,
      tables: tablesStats
    };
  } catch (err: any) {
    return {
      connected: false,
      config: safeConfig,
      error: err.message || 'Error saat mengakses MySQL'
    };
  }
}

/**
 * Menyimpan modul data ke tabel MySQL
 */
export async function saveModuleToMysql(key: string, data: any): Promise<boolean> {
  const p = await getMysqlPool();
  if (!p) return false;

  try {
    if (key === 'settings') {
      // Tabel key-value tb_settings
      const jsonStr = JSON.stringify(data);
      await p.query(
        `INSERT INTO tb_settings (setting_key, setting_value) 
         VALUES ('agency_settings', ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [jsonStr, jsonStr]
      );
      return true;
    }

    if (key === 'articles' && Array.isArray(data)) {
      // Refresh tb_articles
      await p.query('DELETE FROM tb_articles');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_articles (id, title, category, excerpt, content, image, date, author, read_time, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.title || '',
            item.category || 'Berita',
            item.excerpt || '',
            item.content || '',
            item.image || '',
            item.date || '',
            item.author || 'Bapperida PPS',
            item.readTime || '3 min',
            item.isFeatured ? 1 : 0
          ]
        );
      }
      return true;
    }

    if (key === 'documents' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_documents');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_documents (id, title, category, year, size, file_url, description, download_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.title || '',
            item.category || 'RPJPD',
            item.year || '2025',
            item.size || '1.0 MB',
            item.fileUrl || '',
            item.description || '',
            item.downloadCount || 0
          ]
        );
      }
      return true;
    }

    if (key === 'employees' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_employees');
      let order = 1;
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_employees (id, name, position, nip, division, photo, bio, phone, email, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.name || '',
            item.position || '',
            item.nip || '',
            item.division || '',
            item.photo || '',
            item.bio || '',
            item.phone || '',
            item.email || '',
            order++
          ]
        );
      }
      return true;
    }

    if (key === 'indicators' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_indicators');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_indicators (id, title, value, unit, change_val, is_positive, year, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.title || '',
            item.value || '',
            item.unit || '',
            item.change || '',
            item.isPositive ? 1 : 0,
            item.year || '2024',
            item.description || ''
          ]
        );
      }
      return true;
    }

    if (key === 'agendas' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_agendas');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_agendas (id, title, date, time, location, category, description, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.title || '',
            item.date || '',
            item.time || '',
            item.location || '',
            item.category || '',
            item.description || '',
            item.status || 'upcoming'
          ]
        );
      }
      return true;
    }

    if (key === 'gallery' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_gallery');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_gallery (id, title, category, image_url, date, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.title || '',
            item.category || '',
            item.imageUrl || '',
            item.date || '',
            item.description || ''
          ]
        );
      }
      return true;
    }

    if (key === 'complaints' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_complaints');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_complaints (id, ticket_number, name, email, phone, category, subject, message, status, response, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.ticketNumber || '',
            item.name || '',
            item.email || '',
            item.phone || '',
            item.category || '',
            item.subject || '',
            item.message || '',
            item.status || 'pending',
            item.response || '',
            item.createdAt || ''
          ]
        );
      }
      return true;
    }

    if (key === 'info_requests' && Array.isArray(data)) {
      await p.query('DELETE FROM tb_info_requests');
      for (const item of data) {
        await p.query(
          `INSERT INTO tb_info_requests (id, ticket_number, name, nik, email, phone, address, job, info_needed, reason, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id || String(Date.now()),
            item.ticketNumber || '',
            item.name || '',
            item.nik || '',
            item.email || '',
            item.phone || '',
            item.address || '',
            item.job || '',
            item.infoNeeded || '',
            item.reason || '',
            item.status || 'pending',
            item.createdAt || ''
          ]
        );
      }
      return true;
    }

    return false;
  } catch (err: any) {
    console.error(`Gagal menyimpan key ${key} ke MySQL:`, err);
    return false;
  }
}

/**
 * Mengambil data modul dari MySQL
 */
export async function getModuleFromMysql(key: string): Promise<any | null> {
  const p = await getMysqlPool();
  if (!p) return null;

  try {
    if (key === 'settings') {
      const [rows]: any = await p.query('SELECT setting_value FROM tb_settings WHERE setting_key = "agency_settings"');
      if (rows.length > 0 && rows[0].setting_value) {
        return JSON.parse(rows[0].setting_value);
      }
      return null;
    }

    if (key === 'articles') {
      const [rows]: any = await p.query('SELECT * FROM tb_articles ORDER BY created_at DESC');
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        excerpt: r.excerpt,
        content: r.content,
        image: r.image,
        date: r.date,
        author: r.author,
        readTime: r.read_time,
        isFeatured: Boolean(r.is_featured)
      }));
    }

    if (key === 'documents') {
      const [rows]: any = await p.query('SELECT * FROM tb_documents ORDER BY created_at DESC');
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        year: r.year,
        size: r.size,
        fileUrl: r.file_url,
        description: r.description,
        downloadCount: r.download_count
      }));
    }

    if (key === 'employees') {
      const [rows]: any = await p.query('SELECT * FROM tb_employees ORDER BY sort_order ASC');
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        position: r.position,
        nip: r.nip,
        division: r.division,
        photo: r.photo,
        bio: r.bio,
        phone: r.phone,
        email: r.email
      }));
    }

    if (key === 'indicators') {
      const [rows]: any = await p.query('SELECT * FROM tb_indicators');
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        value: r.value,
        unit: r.unit,
        change: r.change_val,
        isPositive: Boolean(r.is_positive),
        year: r.year,
        description: r.description
      }));
    }

    if (key === 'agendas') {
      const [rows]: any = await p.query('SELECT * FROM tb_agendas ORDER BY date ASC');
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        time: r.time,
        location: r.location,
        category: r.category,
        description: r.description,
        status: r.status
      }));
    }

    if (key === 'gallery') {
      const [rows]: any = await p.query('SELECT * FROM tb_gallery ORDER BY id DESC');
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        imageUrl: r.image_url,
        date: r.date,
        description: r.description
      }));
    }

    if (key === 'complaints') {
      const [rows]: any = await p.query('SELECT * FROM tb_complaints ORDER BY id DESC');
      return rows.map((r: any) => ({
        id: r.id,
        ticketNumber: r.ticket_number,
        name: r.name,
        email: r.email,
        phone: r.phone,
        category: r.category,
        subject: r.subject,
        message: r.message,
        status: r.status,
        response: r.response,
        createdAt: r.created_at
      }));
    }

    if (key === 'info_requests') {
      const [rows]: any = await p.query('SELECT * FROM tb_info_requests ORDER BY id DESC');
      return rows.map((r: any) => ({
        id: r.id,
        ticketNumber: r.ticket_number,
        name: r.name,
        nik: r.nik,
        email: r.email,
        phone: r.phone,
        address: r.address,
        job: r.job,
        infoNeeded: r.info_needed,
        reason: r.reason,
        status: r.status,
        createdAt: r.created_at
      }));
    }

    return null;
  } catch (err: any) {
    console.error(`Gagal membaca key ${key} dari MySQL:`, err);
    return null;
  }
}

/**
 * Migrasi seluruh data dari file JSON uploads/data/ ke database MySQL
 */
export async function migrateAllJsonToMysql(dataBaseDir: string): Promise<{
  success: boolean;
  migratedModules: string[];
  error?: string;
}> {
  const p = await getMysqlPool();
  if (!p) {
    return {
      success: false,
      migratedModules: [],
      error: 'Tidak dapat terhubung ke MySQL. Cek konfigurasi DB_* di server.'
    };
  }

  const keys = ['settings', 'articles', 'documents', 'employees', 'indicators', 'agendas', 'gallery', 'complaints', 'info_requests'];
  const migrated: string[] = [];

  for (const key of keys) {
    const filePath = path.join(dataBaseDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        const ok = await saveModuleToMysql(key, parsed);
        if (ok) migrated.push(key);
      } catch (err) {
        console.error(`Gagal memigrasikan ${key}:`, err);
      }
    }
  }

  return {
    success: true,
    migratedModules: migrated
  };
}
