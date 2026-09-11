/**
 * server/initialData.ts
 * Standalone initial data for server-side persistence initialization.
 * Zero relative external imports to ensure 100% compatibility with direct Node/TS execution.
 */

export const initialArticles: any[] = [];
export const initialDocuments: any[] = [];
export const initialEmployees: any[] = [];
export const initialComplaints: any[] = [];
export const initialAgendas: any[] = [];
export const initialGallery: any[] = [];

export const regionalIndicatorStats = [
  { year: '2022', growthRate: 3.42, ipm: 60.10, povertyRate: 27.20, unemploymentRate: 4.82 },
  { year: '2023', growthRate: 4.18, ipm: 60.95, povertyRate: 26.15, unemploymentRate: 4.35 },
  { year: '2024', growthRate: 4.85, ipm: 61.80, povertyRate: 24.90, unemploymentRate: 3.98 },
  { year: '2025', growthRate: 5.12, ipm: 62.45, povertyRate: 23.60, unemploymentRate: 3.65 },
  { year: '2026 (Target)', growthRate: 5.60, ipm: 63.50, povertyRate: 21.80, unemploymentRate: 3.20 }
];

export const defaultAgencySettings = {
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
