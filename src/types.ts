export type ActivePage = 
  | 'beranda'
  | 'profil'
  | 'dokumen'
  | 'berita'
  | 'layanan'
  | 'pengaduan'
  | 'agenda'
  | 'galeri'
  | 'data-statistik'
  | 'kontak'
  | 'admin';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Pembangunan' | 'Riset & Inovasi' | 'Musrenbang' | 'Pemerintahan' | 'Pengumuman';
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  views: number;
  status: 'published' | 'draft';
  tags: string[];
}

export interface PortalLink {
  id: string;
  title: string;
  url: string;
  description: string;
  coverImage: string;
  badge?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export type DocumentCategory = 
  | 'RPJPD' 
  | 'RPJMD' 
  | 'RKPD' 
  | 'Renstra' 
  | 'Renja' 
  | 'KUA-PPAS' 
  | 'LKPJ' 
  | 'Kajian Riset & Inovasi';

export interface PlanningDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  year: string;
  regency?: 'Provinsi' | 'Merauke' | 'Boven Digoel' | 'Mappi' | 'Asmat';
  legalBasis: string; // e.g., Pergub No. 12 Tahun 2024
  fileSize: string;
  fileFormat: string;
  downloadCount: number;
  uploadDate: string;
  description: string;
  fileUrl?: string; // URL berkas di server Hostinger (misal /uploads/documents/rpjpd.pdf)
  coverImage?: string; // URL cover buku untuk tampilan perpustakaan
  storageProvider?: 'hostinger-server' | 'hostinger-php' | 'external' | 'local';
}

export type ComplaintStatus = 'Menunggu Verifikasi' | 'Sedang Diproses' | 'Ditindaklanjuti' | 'Selesai';

export interface Complaint {
  id: string;
  ticketNo: string;
  name: string;
  nik?: string;
  email: string;
  phone: string;
  category: 'Perencanaan Wilayah' | 'Infrastruktur' | 'Pelayanan Publik' | 'Transparansi & Anggaran' | 'Riset & Inovasi' | 'Lainnya';
  regency: 'Merauke' | 'Boven Digoel' | 'Mappi' | 'Asmat';
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  response?: string;
  responderName?: string;
  attachments?: string[];
}

export interface InformationRequest {
  id: string;
  requestNo: string;
  applicantName: string;
  email: string;
  phone: string;
  institution: string;
  purpose: string;
  informationDetails: string;
  format: 'Salinan Digital (PDF)' | 'Hardcopy' | 'Kunjungan Langsung';
  status: 'Diterima' | 'Diproses PPID' | 'Tersedia' | 'Ditolak';
  createdAt: string;
  responseNote?: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  organizer: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  category: 'Musrenbang' | 'Rakor' | 'Bimtek' | 'Seminar & Riset' | 'Pemerintahan';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Musrenbang' | 'Kunjungan Wilayah' | 'Riset Daerah' | 'Infrastruktur' | 'Kegiatan Internal';
  location: string;
  date: string;
  imageUrl: string;
  caption: string;
}

export interface IndicatorStat {
  year: string;
  growthRate: number; // Pertumbuhan Ekonomi (%)
  ipm: number; // Indeks Pembangunan Manusia
  povertyRate: number; // Tingkat Kemiskinan (%)
  unemploymentRate: number; // Pengangguran Terbuka (%)
}

export interface RegencyStat {
  name: string;
  capital: string;
  areaKm2: number;
  population: number;
  districtsCount: number;
  villagesCount: number;
  ipm: number;
  primaryPotential: string;
}

export interface AgencySettings {
  leaderName: string;
  leaderTitle: string;
  leaderRank: string;
  leaderPhoto: string;
  leaderMotto: string;
  speechTitle: string;
  speechOpening: string;
  speechBody: string;
  speechClosing: string;
  officeAddress: string;
  officeEmail: string;
  officePhone: string;
  officeHours: string;
  musrenbangUrl: string;
  sipdUrl: string;
  satuDataUrl: string;
  helpdeskWhatsapp?: string;
  krisnaUrl?: string;
  provincialPortalUrl?: string;
  bpsPapuaSelatanUrl?: string;
  laporUrl?: string;
  heroVideoTitle?: string;
  heroVideoSubtitle?: string;
  heroVideoLocation?: string;
  heroVideoCustomName?: string;
  heroVideoServerUrl?: string; // URL video di penyimpanan Hostinger (misal: /uploads/videos/hero-anim-ha.mp4)
  // Highlight Berita Beranda
  heroHighlightBadge?: string; // misal: 'Highlight Berita', 'Sorotan Utama Daerah'
  heroHighlightInterval?: number; // detik rotasi (misal: 6)
  heroHighlightArticleIds?: string[]; // ID artikel berita yang disematkan di hero
  heroHighlightMode?: 'auto' | 'manual'; // mode otomatis terbaru atau manual pinned
}

export type StorageProvider = 'hostinger-server' | 'hostinger-php' | 'custom-url' | 'browser-offline';

export interface ServerStorageConfig {
  provider: StorageProvider;
  customApiUrl: string; // misal: '/api/upload' atau 'https://domain.com/api-hostinger/upload.php'
  uploadBasePath: string; // default '/uploads'
  maxFileSizeMB: number; // default 120
  autoFallbackToIndexedDb: boolean;
}

export interface AdminCredentials {
  email: string;
  username: string;
  passwordHash: string;
  name: string;
  role: string;
  lastPasswordChangedAt?: string;
  isPasswordChanged?: boolean;
  singleAdminOnly?: boolean;
}

export type EmployeePositionCategory = 'Kepala Badan' | 'Sekretaris' | 'Kabid' | 'Kasubag' | 'Kasubid' | 'Staff';

export interface EmployeeProfile {
  id: string;
  name: string;
  nip?: string;
  positionCategory: EmployeePositionCategory;
  positionTitle: string;
  rank?: string;
  department?: string;
  photoUrl?: string;
  motto?: string;
  order?: number;
}
