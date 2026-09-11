-- ==============================================================================
-- STRUKTUR & DATA AWAL BASIS DATA MYSQL: PORTAL BAPPERIDA PROVINSI PAPUA SELATAN
-- Kompatibel: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+ (Hostinger VPS / Cloud / cPanel / phpMyAdmin)
-- Karakter Enkoding: utf8mb4 / Kolasi: utf8mb4_unicode_ci
-- ==============================================================================
-- PANDUAN PENGGUNAAN DI HOSTINGER / CPANEL PHPMYADMIN:
-- 1. Buat database di Hostinger hPanel (contoh: u123456789_bapperida).
-- 2. Buka phpMyAdmin, lalu klik nama database tersebut di panel sebelah kiri.
-- 3. Pilih tab "Import" (Impor) atau tab "SQL".
-- 4. Tempel (paste) atau unggah seluruh isi skrip SQL ini, lalu klik tombol "Kirim" / "Go".
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+09:00"; -- WIT (Waktu Indonesia Timur)

-- ------------------------------------------------------------------------------
-- 1. TABEL PENGATURAN KEDINASAN, PROFIL PIMPINAN, & TAUTAN SISTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABEL BERITA, RILIS PERS, & ARTIKEL RESMI KEDINASAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_articles` (
  `id` VARCHAR(100) NOT NULL,
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
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_articles_category` (`category`),
  INDEX `idx_articles_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABEL DOKUMEN PERENCANAAN DAERAH (RPJPD, RPJMD, RKPD, RENJA, KUA-PPAS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_documents` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `year` VARCHAR(10),
  `size` VARCHAR(50),
  `file_url` TEXT,
  `description` TEXT,
  `download_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_docs_category` (`category`),
  INDEX `idx_docs_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABEL STRUKTUR ORGANISASI & PEGAWAI BAPPERIDA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_employees` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(100),
  `division` VARCHAR(100),
  `photo` TEXT,
  `bio` TEXT,
  `phone` VARCHAR(50),
  `email` VARCHAR(100),
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_emp_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABEL INDIKATOR MAKRO PEMBANGUNAN DAERAH (IPM, KEMISKINAN, PERTUMBUHAN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_indicators` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `value` VARCHAR(100) NOT NULL,
  `unit` VARCHAR(50),
  `change_val` VARCHAR(50),
  `is_positive` TINYINT(1) DEFAULT 1,
  `year` VARCHAR(10),
  `description` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL AGENDA & KALENDER KEGIATAN KEDINASAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_agendas` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(50),
  `time` VARCHAR(50),
  `location` VARCHAR(255),
  `category` VARCHAR(100),
  `description` TEXT,
  `status` VARCHAR(50) DEFAULT 'upcoming',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_agendas_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABEL GALERI DOKUMENTASI KEGIATAN & FOTO KEDINASAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_gallery` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `image_url` TEXT,
  `date` VARCHAR(50),
  `description` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABEL ASPIRASI & PENGADUAN MASYARAKAT (LAYANAN PENGADUAN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_complaints` (
  `id` VARCHAR(100) NOT NULL,
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
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_complaints_ticket` (`ticket_number`),
  INDEX `idx_complaints_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABEL PERMOHONAN INFORMASI PUBLIK (PPID DAERAH)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tb_info_requests` (
  `id` VARCHAR(100) NOT NULL,
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
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_info_ticket` (`ticket_number`),
  INDEX `idx_info_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DATA AWAL RESMI (SEED DATA) BAPPERIDA PROVINSI PAPUA SELATAN
-- ==============================================================================

-- 1. PENGATURAN INSTANSI & SAMBUTAN PIMPINAN
INSERT INTO `tb_settings` (`setting_key`, `setting_value`) VALUES
('agency_settings', '{"leaderName":"Ulmi Listianingsih, S.Sos., M.M.","leaderRank":"Pembina Utama Madya (IV/d)","leaderTitle":"Kepala Bapperida Provinsi Papua Selatan","leaderPhoto":"","leaderMotto":"Perencanaan yang presisi dan riset yang terarah adalah kunci kemandirian serta kesejahteraan masyarakat di Tanah Anim Ha.","speechTitle":"Menata Masa Depan Papua Selatan: Sinergi Perencanaan Terpadu, Riset, dan Kearifan Anim Ha","speechOpening":"Tabea, Salam Sejahtera bagi kita sekalian, Syalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.\\n\\nPuji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan penyertaan-Nya, sehingga kita bersama dapat memulai lembaran baru pembangunan di Tanah Anim Ha.","speechBody":"Sebagai Daerah Otonom Baru yang dibentuk berdasarkan Undang-Undang Republik Indonesia Nomor 14 Tahun 2022, Provinsi Papua Selatan memiliki tanggung jawab sejarah untuk meletakkan pondasi pembangunan jangka panjang (RPJPD 2025–2045) yang berakar kuat pada nilai kearifan lokal 4 kabupaten: Kabupaten Merauke, Kabupaten Boven Digoel, Kabupaten Mappi, dan Kabupaten Asmat.\\n\\nPenggabungan fungsi perencanaan pembangunan daerah (Bappeda) dan riset inovasi daerah (BRIDA) dalam satu wadah BAPPERIDA merupakan langkah strategis dan visioner. Setiap perumusan arah kebijakan, penetapan program prioritas, dan penganggaran tidak lagi semata-mata bersifat administratif, melainkan dilandasi secara ilmiah melalui pendekatan evidence-based policy, pemanfaatan Satu Data geospasial yang akurat, serta komitmen kuat dalam perlindungan hak-hak dasar Orang Asli Papua (OAP).","speechClosing":"Melalui portal resmi Bapperida Provinsi Papua Selatan ini, kami membuka ruang seluas-luasnya bagi masyarakat, akademisi, mitra pembangunan, dan generasi muda untuk mengakses dokumen perencanaan resmi, meninjau indikator makro daerah, serta menyampaikan saran dan aspirasi konstruktif demi mewujudkan Papua Selatan yang Maju, Mandiri, Berdaya Saing, dan Sejahtera.","officeAddress":"Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Papua Selatan 99616","officeEmail":"bapperidaprogram.pps@gmail.com","officePhone":"(0971) 321-450 / 0811-482-9900","officeHours":"Jam 08.00 Pagi s/d 16.00 Sore WIT (Senin – Jumat)","musrenbangUrl":"https://musrenbang.papuaselatanprov.go.id","sipdUrl":"https://sipd-ri.kemendagri.go.id","satuDataUrl":"https://satudata.papuaselatanprov.go.id"}')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- 2. INDIKATOR MAKRO PEMBANGUNAN DAERAH
INSERT INTO `tb_indicators` (`id`, `title`, `value`, `unit`, `change_val`, `is_positive`, `year`, `description`) VALUES
('ind-1', 'Indeks Pembangunan Manusia (IPM)', '62.45', 'Poin', '+0.65', 1, '2025', 'Peningkatan IPM didorong perbaikan akses pendidikan dasar, pemerataan layanan kesehatan rujukan di 4 kabupaten, dan penguatan daya beli masyarakat.'),
('ind-2', 'Pertumbuhan Ekonomi (LPE)', '5.12', '%', '+0.27%', 1, '2025', 'Pertumbuhan ditopang oleh sektor pertanian lumbung pangan padi di Merauke, perikanan tangkap, perkebunan berkelanjutan, dan realisasi belanja modal APBD DOB.'),
('ind-3', 'Tingkat Kemiskinan', '23.60', '%', '-1.30%', 1, '2025', 'Penurunan angka kemiskinan melalui program bantuan terpadu berbasis data geospasial, pemberdayaan ekonomi kampung, dan integrasi dana Otsus Papua.'),
('ind-4', 'Tingkat Pengangguran Terbuka (TPT)', '3.65', '%', '-0.33%', 1, '2025', 'Penyerapan tenaga kerja lokal pada program PSN pangan dan infrastruktur kawasan perkantoran terpadu Salor.')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `value` = VALUES(`value`), `unit` = VALUES(`unit`), `change_val` = VALUES(`change_val`), `is_positive` = VALUES(`is_positive`), `year` = VALUES(`year`), `description` = VALUES(`description`);

-- 3. CONTOH DOKUMEN PERENCANAAN UTAMA
INSERT INTO `tb_documents` (`id`, `title`, `category`, `year`, `size`, `file_url`, `description`, `download_count`) VALUES
('doc-1', 'Rancangan Akhir Rencana Pembangunan Jangka Panjang Daerah (RPJPD) Provinsi Papua Selatan 2025–2045', 'RPJPD', '2025', '4.8 MB', '/uploads/documents/RPJPD_Papua_Selatan_2025_2045.pdf', 'Dokumen visi, misi, dan arah kebijakan pembangunan 20 tahun Provinsi Papua Selatan menuju Papua Selatan Emas Mandiri Berdaulat.', 142),
('doc-2', 'Rencana Kerja Pemerintah Daerah (RKPD) Provinsi Papua Selatan Tahun 2025', 'RKPD', '2025', '6.2 MB', '/uploads/documents/RKPD_Papua_Selatan_2025.pdf', 'Dokumen rencana kerja tahunan memuat prioritas pembangunan, pagu indikatif program OPD, dan target kinerja makro daerah.', 215),
('doc-3', 'Rencana Strategis (Renstra) Bapperida Provinsi Papua Selatan Periode 2024–2026', 'Renstra', '2024', '3.1 MB', '/uploads/documents/Renstra_Bapperida_2024_2026.pdf', 'Arah strategis pelaksanaan tugas perencanaan, riset, inovasi, pemantauan, dan evaluasi pembangunan daerah Provinsi Papua Selatan.', 98)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `category` = VALUES(`category`), `year` = VALUES(`year`), `size` = VALUES(`size`), `description` = VALUES(`description`);

-- 4. CONTOH BERITA RESMI KEDINASAN
INSERT INTO `tb_articles` (`id`, `title`, `category`, `excerpt`, `content`, `image`, `date`, `author`, `read_time`, `is_featured`) VALUES
('art-1', 'Bapperida Papua Selatan Gelar Konsultasi Publik Rancangan RPJPD 2025–2045 Bersama Empat Kabupaten', 'Perencanaan', 'Forum konsultasi publik dihadiri perwakilan Kabupaten Merauke, Boven Digoel, Mappi, dan Asmat guna menyelaraskan visi jangka panjang Papua Selatan.', '<p>Merauke, Bapperida Provinsi Papua Selatan menggelar Forum Konsultasi Publik Rancangan Rencana Pembangunan Jangka Panjang Daerah (RPJPD) Tahun 2025–2045 bertempat di Kompleks Pusat Pemerintahan Salor. Forum ini menjadi tonggak sejarah perencanaan daerah dalam merumuskan arah transformasi sosial, ekonomi, dan tata kelola pemerintahan selama dua dekade ke depan.</p><p>Kepala Bapperida Provinsi Papua Selatan menekankan pentingnya sinergi antara potensi lokal di Merauke, Boven Digoel, Mappi, dan Asmat agar pembangunan tidak hanya berorientasi pertumbuhan ekonomi semata, melainkan menjunjung tinggi kelestarian lingkungan gambut dan kemaslahatan Orang Asli Papua (OAP).</p>', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', '15 Agustus 2025', 'Humas Bapperida', '4 min', 1),
('art-2', 'Integrasi Satu Data Indonesia: Bapperida Bangun Portal Spasial Terpadu Papua Selatan', 'Riset & Inovasi', 'Pemanfaatan data geospasial presisi untuk memastikan ketepatan sasaran alokasi program pengentasan kemiskinan dan ketahanan pangan nasional.', '<p>Sebagai langkah mewujudkan kebijakan berbasis bukti (evidence-based policy), Bapperida Provinsi Papua Selatan melalui Bidang Penelitian dan Pengembangan Riset Daerah menginisiasi integrasi Satu Data Daerah. Melalui sistem ini, seluruh data sektoral dari OPD teknis dan 4 kabupaten mitra dapat dipetakan secara spasial demi perencanaan yang akurat dan transparan.</p>', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', '28 Agustus 2025', 'Tim Data Bapperida', '3 min', 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `category` = VALUES(`category`), `excerpt` = VALUES(`excerpt`), `content` = VALUES(`content`), `is_featured` = VALUES(`is_featured`);

-- 5. CONTOH AGENDA KEDINASAN
INSERT INTO `tb_agendas` (`id`, `title`, `date`, `time`, `location`, `category`, `description`, `status`) VALUES
('agn-1', 'Rapat Koordinasi Evaluasi Realisasi RKPD Triwulan III se-Papua Selatan', '22 September 2025', '09.00 - 15.00 WIT', 'Aula Rapat Utama Bapperida, Salor - Merauke', 'Evaluasi', 'Evaluasi capaian indikator makro dan penyerapan anggaran belanja program prioritas bersama Bappeda 4 Kabupaten.', 'upcoming'),
('agn-2', 'Sosialisasi Penyusunan Rencana Kerja (Renja) OPD Tahun Anggaran 2026', '05 Oktober 2025', '08.30 - 14.00 WIT', 'Grand Merauke Hotel & Virtual Zoom', 'Bimtek', 'Bimbingan teknis penginputan indikator sasaran dan program sub kegiatan ke dalam aplikasi SIPD-RI.', 'upcoming')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `date` = VALUES(`date`), `location` = VALUES(`location`), `status` = VALUES(`status`);

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- SELESAI. BASIS DATA TELAH SIAP DIGUNAKAN DI HOSTINGER / CPANEL MYSQL!
-- ==============================================================================
