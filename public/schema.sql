-- =============================================================
-- BASIS DATA MYSQL: PORTAL BAPPERIDA PROVINSI PAPUA SELATAN
-- Hostinger VPS / Cloud / cPanel MySQL & phpMyAdmin Ready
-- Karakter: utf8mb4 / utf8mb4_unicode_ci
-- =============================================================
-- CATATAN PENTING HOSTINGER:
-- Di phpMyAdmin Hostinger, nama database dibuat melalui hPanel (contoh: u898537914_bapperida).
-- Anda TIDAK PERLU menjalankan perintah "CREATE DATABASE" atau "USE".
-- Cukup klik nama database Anda di panel kiri phpMyAdmin, lalu impor/jalankan skrip tabel di bawah:
-- =============================================================

-- 1. TABEL PENGATURAN INSTANSI, SAMBUTAN PIMPINAN & VIDEO HERO
CREATE TABLE IF NOT EXISTS `tb_settings` (
  `setting_key` VARCHAR(100) NOT NULL PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL BERITA & RILIS RESMI
CREATE TABLE IF NOT EXISTS `tb_articles` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `excerpt` TEXT,
  `content` LONGTEXT,
  `image` TEXT,
  `date` VARCHAR(50),
  `author` VARCHAR(100),
  `read_time` VARCHAR(50),
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL DOKUMEN PERENCANAAN DAERAH (RPJPD, RENSTRA, RKPD)
CREATE TABLE IF NOT EXISTS `tb_documents` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` VARCHAR(10),
  `size` VARCHAR(50),
  `file_url` TEXT,
  `description` TEXT,
  `download_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL STRUKTUR PEGAWAI & PROFIL PIMPINAN
CREATE TABLE IF NOT EXISTS `tb_employees` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(100),
  `division` VARCHAR(100),
  `photo` TEXT,
  `bio` TEXT,
  `phone` VARCHAR(50),
  `email` VARCHAR(100),
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL INDIKATOR MAKRO PEMBANGUNAN DAERAH
CREATE TABLE IF NOT EXISTS `tb_indicators` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `value` VARCHAR(100) NOT NULL,
  `unit` VARCHAR(50),
  `change_val` VARCHAR(50),
  `is_positive` TINYINT(1) DEFAULT 1,
  `year` VARCHAR(10),
  `description` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL AGENDA & KALENDER KEGIATAN KEDINASAN
CREATE TABLE IF NOT EXISTS `tb_agendas` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50),
  `time` VARCHAR(50),
  `location` VARCHAR(255),
  `category` VARCHAR(100),
  `description` TEXT,
  `status` VARCHAR(50) DEFAULT 'upcoming',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABEL GALERI FOTO & DOKUMENTASI LAPANGAN
CREATE TABLE IF NOT EXISTS `tb_gallery` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `image_url` TEXT,
  `date` VARCHAR(50),
  `description` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABEL ASPIRASI & PENGADUAN MASYARAKAT
CREATE TABLE IF NOT EXISTS `tb_complaints` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `ticket_number` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100),
  `phone` VARCHAR(50),
  `category` VARCHAR(100),
  `subject` VARCHAR(255),
  `message` TEXT,
  `status` VARCHAR(50) DEFAULT 'pending',
  `response` TEXT,
  `created_at` VARCHAR(100),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABEL PERMOHONAN INFORMASI PUBLIK PPID
CREATE TABLE IF NOT EXISTS `tb_info_requests` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `ticket_number` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `nik` VARCHAR(50),
  `email` VARCHAR(100),
  `phone` VARCHAR(50),
  `address` TEXT,
  `job` VARCHAR(100),
  `info_needed` TEXT,
  `reason` TEXT,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` VARCHAR(100),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
