import { NewsArticle, PlanningDocument, Complaint, AgendaEvent, GalleryItem, IndicatorStat, RegencyStat, EmployeeProfile, PortalLink } from '../types';

export const initialArticles: NewsArticle[] = [];

export const initialDocuments: PlanningDocument[] = [];

export const initialComplaints: Complaint[] = [];

export const initialAgendas: AgendaEvent[] = [];

export const initialGallery: GalleryItem[] = [];

export const regionalIndicatorStats: IndicatorStat[] = [
  { year: '2022', growthRate: 3.42, ipm: 60.10, povertyRate: 27.20, unemploymentRate: 4.82 },
  { year: '2023', growthRate: 4.18, ipm: 60.95, povertyRate: 26.15, unemploymentRate: 4.35 },
  { year: '2024', growthRate: 4.85, ipm: 61.80, povertyRate: 24.90, unemploymentRate: 3.98 },
  { year: '2025', growthRate: 5.12, ipm: 62.45, povertyRate: 23.60, unemploymentRate: 3.65 },
  { year: '2026 (Target)', growthRate: 5.60, ipm: 63.50, povertyRate: 21.80, unemploymentRate: 3.20 }
];

export const regenciesData: RegencyStat[] = [
  {
    name: 'Kabupaten Merauke',
    capital: 'Merauke',
    areaKm2: 46792,
    population: 234500,
    districtsCount: 20,
    villagesCount: 190,
    ipm: 71.20,
    primaryPotential: 'Lumbung Pangan Padi Nasional, Peternakan Sapi, Kelautan & Perikanan, Pusat Jasa dan Logistik Ekspor'
  },
  {
    name: 'Kabupaten Boven Digoel',
    capital: 'Tanah Merah',
    areaKm2: 27108,
    population: 65800,
    districtsCount: 20,
    villagesCount: 112,
    ipm: 62.40,
    primaryPotential: 'Perkebunan Kelapa Sawit Berkelanjutan, Hasil Hutan Bukan Kayu (Gaharu, Damar), Perdagangan Lintas Batas RI-PNG'
  },
  {
    name: 'Kabupaten Mappi',
    capital: 'Kepi',
    areaKm2: 28518,
    population: 110200,
    districtsCount: 15,
    villagesCount: 164,
    ipm: 59.80,
    primaryPotential: 'Kawasan Sentra Sagu Alami, Perikanan Rawa & Sungai (Ikan Gabus/Arwana), Perkebunan Karet Rakyat'
  },
  {
    name: 'Kabupaten Asmat',
    capital: 'Agats',
    areaKm2: 31983,
    population: 112400,
    districtsCount: 23,
    villagesCount: 221,
    ipm: 52.10,
    primaryPotential: 'Kriya & Ukiran Kayu Warisan Dunia UNESCO, Ekowisata Budaya Rawa Gambut, Perikanan Kepiting & Udang'
  }
];

export const defaultAgencySettings: import('../types').AgencySettings = {
  leaderName: 'Ulmi Listianingsih, S.Sos., M.M.',
  leaderRank: 'Pembina Utama Madya (IV/d)',
  leaderTitle: 'Kepala Bapperida Provinsi Papua Selatan',
  leaderPhoto: '',
  leaderMotto: 'Perencanaan yang presisi dan riset yang terarah adalah kunci kemandirian serta kesejahteraan masyarakat di Tanah Anim Ha.',
  speechTitle: 'Menata Masa Depan Papua Selatan: Sinergi Perencanaan Terpadu, Riset, dan Kearifan Anim Ha',
  speechOpening: 'Tabea, Salam Sejahtera bagi kita sekalian, Syalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.\n\nPuji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan penyertaan-Nya, sehingga kita bersama dapat memulai lembaran baru pembangunan di Tanah Anim Ha.',
  speechBody: 'Sebagai Daerah Otonom Baru yang dibentuk berdasarkan Undang-Undang Republik Indonesia Nomor 14 Tahun 2022, Provinsi Papua Selatan memiliki tanggung jawab sejarah untuk meletakkan pondasi pembangunan jangka panjang (RPJPD 2025–2045) yang berakar kuat pada nilai kearifan lokal 4 kabupaten: Kabupaten Merauke, Kabupaten Boven Digoel, Kabupaten Mappi, dan Kabupaten Asmat.\n\nPenggabungan fungsi perencanaan pembangunan daerah (Bappeda) dan riset inovasi daerah (BRIDA) dalam satu wadah BAPPERIDA merupakan langkah strategis dan visioner. Setiap perumusan arah kebijakan, penetapan program prioritas, dan penganggaran tidak lagi semata-mata bersifat administratif, melainkan dilandasi secara ilmiah melalui pendekatan evidence-based policy, pemanfaatan Satu Data geospasial yang akurat, serta komitmen kuat dalam perlindungan hak-hak dasar Orang Asli Papua (OAP).',
  speechClosing: 'Melalui portal resmi Bapperida Provinsi Papua Selatan ini, kami membuka ruang seluas-luasnya bagi masyarakat, akademisi, mitra pembangunan, dan generasi muda untuk mengakses dokumen perencanaan resmi, meninjau indikator makro daerah, serta menyampaikan saran dan aspirasi konstruktif demi mewujudkan Papua Selatan yang Maju, Mandiri, Berdaya Saing, dan Sejahtera.',
  officeAddress: 'Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Papua Selatan 99616',
  officeEmail: 'bapperidaprogram.pps@gmail.com',
  officePhone: '(0971) 321-450 / 0811-482-9900',
  officeHours: 'Jam 08.00 Pagi s/d 16.00 Sore WIT (Senin – Jumat)',
  musrenbangUrl: 'https://musrenbang.papuaselatanprov.go.id',
  sipdUrl: 'https://sipd-ri.kemendagri.go.id',
  satuDataUrl: 'https://satudata.papuaselatanprov.go.id'
};

export const initialEmployees: EmployeeProfile[] = [];

export const initialPortalLinks: PortalLink[] = [
  {
    id: 'portal-1',
    title: 'Portal Satu Data Papua Selatan',
    url: 'https://data.papuaselatan.go.id',
    description: 'Integrasi data spasial, statistik sektoral, dan indikator pembangunan terpadu Provinsi Papua Selatan.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: 'Satu Data',
    badge: 'Satu Data PPS',
    order: 1,
    isActive: true
  },
  {
    id: 'portal-2',
    title: 'SIPD RI Kemendagri',
    url: 'https://sipd-ri.kemendagri.go.id',
    description: 'Sistem Informasi Pemerintahan Daerah untuk perencanaan pembangunan daerah dan tata kelola keuangan.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    category: 'Pemerintahan',
    badge: 'Kemendagri',
    order: 2,
    isActive: true
  },
  {
    id: 'portal-3',
    title: 'SP4N LAPOR!',
    url: 'https://www.lapor.go.id',
    description: 'Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional untuk menampung aspirasi masyarakat luas.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    category: 'Pengaduan Publik',
    badge: 'KemenPANRB',
    order: 3,
    isActive: true
  },
  {
    id: 'portal-4',
    title: 'Portal PPID Utama Papua Selatan',
    url: 'https://ppid.papuaselatan.go.id',
    description: 'Layanan permohonan informasi publik dan transparansi dokumen berkala resmi Pemprov Papua Selatan.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    category: 'Keterbukaan Informasi',
    badge: 'PPID Utama',
    order: 4,
    isActive: true
  },
  {
    id: 'portal-5',
    title: 'KRISNA Bappenas RI',
    url: 'https://krisna.systems',
    description: 'Kolaborasi Perencanaan dan Informasi Kinerja Anggaran pembangunan nasional dan penelaahan DAK.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'Perencanaan',
    badge: 'Bappenas',
    order: 5,
    isActive: true
  },
  {
    id: 'portal-6',
    title: 'BRIN - Riset & Inovasi Nasional',
    url: 'https://brin.go.id',
    description: 'Pusat integrasi ekosistem riset, sains terapan, dan hilirisasi potensi lokal komoditas unggulan.',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    category: 'Riset & Sains',
    badge: 'BRIN & BRIDA',
    order: 6,
    isActive: true
  }
];
