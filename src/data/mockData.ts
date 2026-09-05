import { NewsArticle, PlanningDocument, Complaint, AgendaEvent, GalleryItem, IndicatorStat, RegencyStat } from '../types';

export const initialArticles: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Bapperida Papua Selatan Gelar Musrenbang RPJPD 2025–2045: Menyongsong Indonesia Emas di Ufuk Timur',
    slug: 'musrenbang-rpjpd-papua-selatan-2025-2045',
    category: 'Musrenbang',
    summary: 'Pemerintah Provinsi Papua Selatan melalui Bapperida menyelenggarakan Musrenbang penyusunan RPJPD 2025-2045 untuk memantapkan peta jalan pembangunan jangka panjang di 4 kabupaten cakupan.',
    content: `MERAUKE — Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah (Bapperida) Provinsi Papua Selatan secara resmi menggelar Musyawarah Perencanaan Pembangunan (Musrenbang) Rencana Pembangunan Jangka Panjang Daerah (RPJPD) Tahun 2025–2045 bertempat di Ballroom Swiss-Belhotel Merauke.

Kegiatan ini dihadiri langsung oleh Penjabat Gubernur Papua Selatan, pimpinan MRP Papua Selatan, jajaran DPRP Papua Selatan, bupati dan kepala Bappeda dari empat kabupaten (Merauke, Boven Digoel, Mappi, dan Asmat), serta akademisi dan tokoh adat Anim Ha.

Kepala Bapperida Provinsi Papua Selatan menegaskan bahwa momentum RPJPD 2025–2045 adalah fondasi fundamental provinsi baru ini untuk meletakkan arah kebijakan yang kokoh, berkeadilan sosial, dan berbasis pada kearifan lokal masyarakat adat Papua Selatan.

"Sebagai Daerah Otonom Baru (DOB), kita memiliki keleluasaan merancang masa depan Papua Selatan dengan pendekatan spasial terpadu: lumbung pangan dan energi hijau di Merauke, industri perkebunan dan kehutanan berkelanjutan di Boven Digoel, pengembangan perikanan air tawar dan komoditas karet di Mappi, serta konservasi rawa gambut dan kebudayaan maritim di Asmat," tegas Kepala Bapperida.

Musrenbang ini menghasilkan kesepakatan 6 isu strategis pembangunan, termasuk percepatan konektivitas antarkabupaten, pengentasan kemiskinan ekstrem, penurunan angka stunting, dan penguatan riset inovasi komoditas unggulan lokal.`,
    author: 'Bidang Perencanaan Makro & Humas Bapperida',
    publishedAt: '2026-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    views: 1240,
    status: 'published',
    tags: ['Musrenbang', 'RPJPD 2025-2045', 'Merauke', 'Pembangunan Daerah']
  },
  {
    id: 'art-2',
    title: 'Rakor Penguatan Riset & Inovasi Daerah (BRIDA) Bersama 4 Kabupaten di Wilayah Anim Ha',
    slug: 'rakor-riset-inovasi-daerah-brida-anim-ha',
    category: 'Riset & Inovasi',
    summary: 'Penguatan kelembagaan Badan Riset dan Inovasi Daerah (BRIDA) di lingkungan Bapperida Papua Selatan guna melahirkan kajian aplikatif berbasis potensi pangan sagu, kelapa sawit, dan perikanan.',
    content: `SALOR — Bertempat di Ruang Rapat Utama Kantor Bapperida Provinsi Papua Selatan, Kompleks Pemerintahan Terpadu Salor, Merauke, dilaksanakan Rapat Koordinasi Bidang Riset dan Inovasi Daerah (BRIDA).

Fokus utama rakor ini adalah sinergi program riset aplikatif bersama Badan Riset dan Inovasi Nasional (BRIN) serta perguruan tinggi di Papua Selatan (Universitas Musamus Merauke dan STIKOM). Riset diprioritaskan pada komoditas pangan lokal seperti pemuliaan varietas sagu, teknologi pascapanen gabah Merauke, serta pelestarian ekosistem rawa di Mappi dan Asmat.

Kepala Bidang Riset dan Inovasi Daerah menyampaikan bahwa setiap kebijakan perencanaan dan alokasi fiskal daerah ke depan wajib diperkuat kajian kelayakan ilmiah berbasis bukti (evidence-based policy).`,
    author: 'Bidang Riset & Inovasi Daerah (BRIDA)',
    publishedAt: '2026-08-22',
    imageUrl: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1000&q=80',
    views: 875,
    status: 'published',
    tags: ['BRIDA', 'Riset Daerah', 'BRIN', 'Sagu Papua']
  },
  {
    id: 'art-3',
    title: 'Sinkronisasi RKPD 2025: Akselerasi Pembangunan Infrastruktur Konektivitas Merauke–Boven Digoel–Mappi–Asmat',
    slug: 'sinkronisasi-rkpd-2025-infrastruktur-konektivitas',
    category: 'Pembangunan',
    summary: 'Bapperida Papua Selatan mematangkan sinkronisasi program prioritas konektivitas jalan darat dan jalur logistik sungai antar-kabupaten guna menekan disparitas harga barang.',
    content: `MERAUKE — Konektivitas antar-wilayah tetap menjadi fokus paling mendesak dalam dokumen RKPD Provinsi Papua Selatan. Mengingat karakteristik geografis Papua Selatan yang terdiri atas daratan luas di Merauke dan Boven Digoel serta hamparan rawa pasang surut di Mappi dan Asmat, strategi transportasi multi-moda menjadi kunci utama.

Kepala Bidang Infrastruktur dan Kewilayahan Bapperida menjelaskan rencana integrasi pelabuhan sungai di Kepi (Mappi) dan Agats (Asmat) dengan simpul transportasi darat Trans-Papua dari Merauke menuju Tanah Merah (Boven Digoel).

"Dengan konektivitas yang semakin terhubung, biaya logistik bahan pokok dan semen di pedalaman Mappi dan Asmat dapat ditekan hingga 35%. Ini adalah target nyata dari dokumen perencanaan yang kita susun bersama," ujarnya.`,
    author: 'Bidang Infrastruktur & Kewilayahan',
    publishedAt: '2026-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80',
    views: 1420,
    status: 'published',
    tags: ['Konektivitas', 'Infrastruktur', 'Trans Papua', 'RKPD 2025']
  },
  {
    id: 'art-4',
    title: 'Bapperida Tinjau Kawasan Sentra Pangan & Pengendalian Tata Ruang Wilayah Wanam',
    slug: 'tinjau-sentra-pangan-tata-ruang-wanam',
    category: 'Pembangunan',
    summary: 'Tim perencana Bapperida melakukan peninjauan teknis ke kawasan Wanam untuk memastikan kesesuaian tata ruang (RTRW) dan perlindungan hak ulayat masyarakat adat.',
    content: `ILWAYAB — Menindaklanjuti program strategis nasional lumbung pangan dan pengembangan sentra pertanian modern di Papua Selatan, Tim Teknis Bapperida Provinsi Papua Selatan bersama Dinas PUPR dan Kementerian Pertanian melakukan pemantauan lapangan ke Distrik Ilwayab, Wanam.

Kunjungan ini berfokus pada sinkronisasi Perda RTRW Provinsi Papua Selatan dengan pemanfaatan ruang produksi, penyediaan fasilitas sosial ekonomi bagi masyarakat pemilik hak ulayat, serta studi dampak hidrologi rawa gambut.`,
    author: 'Tim Teknis Tata Ruang Bapperida',
    publishedAt: '2026-08-04',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    views: 990,
    status: 'published',
    tags: ['Wanam', 'Food Estate', 'Tata Ruang', 'RTRW']
  },
  {
    id: 'art-5',
    title: 'Integrasi SIPD-RI Berbasis Geospasial untuk Perencanaan Pembangunan yang Akuntabel',
    slug: 'integrasi-sipd-ri-geospasial-papua-selatan',
    category: 'Pemerintahan',
    summary: 'Peningkatan kapasitas aparatur perencana dalam penerapan modul e-Planning SIPD-RI dan pemetaan simpul jaringan informasi geospasial daerah (JIGD).',
    content: `MERAUKE — Bapperida Provinsi Papua Selatan menyelenggarakan Bimbingan Teknis Pengelolaan Sistem Informasi Pemerintahan Daerah Republik Indonesia (SIPD-RI) modul e-Planning dan integrasi peta tematik geospasial bagi seluruh Organisasi Perangkat Daerah (OPD) se-Provinsi Papua Selatan.

Melalui integrasi ini, setiap usulan proyek fisik dan program pemberdayaan masyarakat adat langsung memiliki koordinat geospasial valid, sehingga mencegah duplikasi penganggaran serta memudahkan pemantauan progres fisik di lapangan.`,
    author: 'Sekretariat Bapperida PPS',
    publishedAt: '2026-07-28',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    views: 640,
    status: 'published',
    tags: ['SIPD-RI', 'Geospasial', 'E-Planning', 'Akuntabilitas']
  },
  {
    id: 'art-6',
    title: 'Pengumuman Konsultasi Publik Rancangan Awal RKPD Provinsi Papua Selatan Tahun 2026',
    slug: 'pengumuman-konsultasi-publik-ranwal-rkpd-2026',
    category: 'Pengumuman',
    summary: 'Mengundang seluruh elemen masyarakat, akademisi, tokoh agama, dan organisasi kemasyarakatan untuk memberikan masukan tertulis terhadap dokumen Ranwal RKPD 2026.',
    content: `SALOR — Dalam rangka memenuhi amanat Permendagri No. 86 Tahun 2017 tentang Tata Cara Perencanaan, Pengendalian, dan Evaluasi Pembangunan Daerah, Bapperida Provinsi Papua Selatan membuka kanal partisipasi publik secara online dan offline.

Masyarakat dipersilakan mengunduh draft Rancangan Awal RKPD Tahun 2026 melalui portal ini dan menyampaikan aspirasi atau pokok pikiran melalui menu Pengaduan & Aspirasi atau email resmi bapperidaprogram.pps@gmail.com sampai tanggal 30 September 2026.`,
    author: 'Sekretariat & Pokja RKPD 2026',
    publishedAt: '2026-07-19',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
    views: 1890,
    status: 'published',
    tags: ['Pengumuman', 'RKPD 2026', 'Konsultasi Publik', 'Aspirasi']
  }
];

export const initialDocuments: PlanningDocument[] = [
  {
    id: 'doc-1',
    title: 'Rencana Pembangunan Jangka Panjang Daerah (RPJPD) Provinsi Papua Selatan Tahun 2025–2045',
    category: 'RPJPD',
    year: '2025',
    regency: 'Provinsi',
    legalBasis: 'Peraturan Daerah Provinsi Papua Selatan No. 3 Tahun 2024',
    fileSize: '24.8 MB',
    fileFormat: 'PDF',
    downloadCount: 3412,
    uploadDate: '2025-12-10',
    description: 'Dokumen induk visi, misi, dan arah kebijakan pembangunan Provinsi Papua Selatan selama 20 tahun ke depan menuju Papua Selatan Maju, Berdaya Saing, dan Berkelanjutan.'
  },
  {
    id: 'doc-2',
    title: 'Rencana Kerja Pemerintah Daerah (RKPD) Provinsi Papua Selatan Tahun 2025',
    category: 'RKPD',
    year: '2025',
    regency: 'Provinsi',
    legalBasis: 'Peraturan Gubernur Papua Selatan No. 18 Tahun 2024',
    fileSize: '19.4 MB',
    fileFormat: 'PDF',
    downloadCount: 4210,
    uploadDate: '2024-07-20',
    description: 'Rencana kerja tahunan pemerintah daerah yang memuat kerangka ekonomi makro, prioritas pembangunan daerah, serta rencana kerja dan pendanaan tahun 2025.'
  },
  {
    id: 'doc-3',
    title: 'Rencana Strategis (Renstra) Bapperida Provinsi Papua Selatan Tahun 2024–2026',
    category: 'Renstra',
    year: '2024',
    regency: 'Provinsi',
    legalBasis: 'Keputusan Kepala Bapperida Papua Selatan No. 04/BAP/PPS/2024',
    fileSize: '9.2 MB',
    fileFormat: 'PDF',
    downloadCount: 1650,
    uploadDate: '2024-03-15',
    description: 'Pedoman pelaksanaan tugas pokok dan fungsi Bapperida PPS dalam mengkoordinasikan perencanaan pembangunan, riset, dan inovasi daerah selama masa transisi DOB.'
  },
  {
    id: 'doc-4',
    title: 'Rencana Kerja (Renja) Bapperida Provinsi Papua Selatan Tahun 2025',
    category: 'Renja',
    year: '2025',
    regency: 'Provinsi',
    legalBasis: 'Keputusan Kepala Badan No. 12 Tahun 2024',
    fileSize: '6.5 MB',
    fileFormat: 'PDF',
    downloadCount: 1120,
    uploadDate: '2024-11-05',
    description: 'Penjabaran program, kegiatan, indikator kinerja, dan pagu indikatif belanja operasional dan program Bapperida untuk tahun anggaran 2025.'
  },
  {
    id: 'doc-5',
    title: 'Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara (KUA-PPAS) TA 2025',
    category: 'KUA-PPAS',
    year: '2025',
    regency: 'Provinsi',
    legalBasis: 'Nota Kesepakatan Pemerintah Provinsi Papua Selatan & DPRP Papua Selatan No. 08/MoU/2024',
    fileSize: '11.8 MB',
    fileFormat: 'PDF',
    downloadCount: 2280,
    uploadDate: '2024-11-28',
    description: 'Dokumen acuan penyusunan RAPBD 2025 memuat target pendapatan, belanja, dan pembiayaan daerah Provinsi Papua Selatan.'
  },
  {
    id: 'doc-6',
    title: 'Kajian Riset Kelayakan Koridor Transportasi Logistik Merauke – Boven Digoel – Mappi – Asmat',
    category: 'Kajian Riset & Inovasi',
    year: '2024',
    regency: 'Provinsi',
    legalBasis: 'Laporan Akhir Kerjasama BRIDA PPS & Tim Ahli Transportasi Unmus',
    fileSize: '14.1 MB',
    fileFormat: 'PDF',
    downloadCount: 980,
    uploadDate: '2024-10-14',
    description: 'Kajian komprehensif efisiensi logistik perintis dan sungai di kawasan rawa pasang surut Mappi dan Asmat terhubung dengan jaringan jalan darat Trans-Papua.'
  },
  {
    id: 'doc-7',
    title: 'Laporan Keterangan Pertanggungjawaban (LKPJ) Gubernur Papua Selatan Akhir Tahun Anggaran 2024',
    category: 'LKPJ',
    year: '2024',
    regency: 'Provinsi',
    legalBasis: 'Buku Laporan Kinerja Eksekutif Kepada DPRP Papua Selatan',
    fileSize: '28.6 MB',
    fileFormat: 'PDF',
    downloadCount: 1840,
    uploadDate: '2025-03-30',
    description: 'Capaian realisasi program dan kinerja penyelenggaraan urusan desentralisasi dan tugas pembantuan Pemprov Papua Selatan tahun 2024.'
  },
  {
    id: 'doc-8',
    title: 'Rancangan Awal Rencana Kerja Pemerintah Daerah (Ranwal RKPD) Tahun 2026',
    category: 'RKPD',
    year: '2026',
    regency: 'Provinsi',
    legalBasis: 'Draft Dokumen Konsultasi Publik Bapperida PPS',
    fileSize: '16.7 MB',
    fileFormat: 'PDF',
    downloadCount: 890,
    uploadDate: '2026-07-15',
    description: 'Bahan musyawarah dan konsultasi publik penyusunan RKPD Provinsi Papua Selatan tahun 2026 bertema "Penguatan Ketahanan Sosial Ekonomi dan Kemandirian Pangan Berbasis Komoditas Lokal".'
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'comp-1',
    ticketNo: 'BAP-PPS-202608-019',
    name: 'Markus Kaize',
    email: 'm.kaize@gmail.com',
    phone: '081248991234',
    category: 'Infrastruktur',
    regency: 'Merauke',
    subject: 'Usulan Perbaikan Akses Jembatan Penghubung Distrik Semangga - Tanah Miring',
    description: 'Mohon agar jembatan kayu penghubung antara kampung di Semangga Jaya dan Tanah Miring diprioritaskan dalam program RKPD 2026 karena merupakan jalur vital pengangkutan hasil panen padi petani.',
    status: 'Selesai',
    createdAt: '2026-08-10 09:24',
    updatedAt: '2026-08-14 14:15',
    response: 'Terima kasih atas aspirasi Saudara. Usulan peningkatan jembatan beton Semangga-Tanah Miring telah dimasukkan ke dalam Matriks Prioritas Pembangunan Infrastruktur Kewilayahan pada Ranwal RKPD TA 2026 melalui koordinasi teknis bersama Dinas PUPR Provinsi Papua Selatan.',
    responderName: 'Tim Verifikasi Perencanaan Bapperida PPS'
  },
  {
    id: 'comp-2',
    ticketNo: 'BAP-PPS-202608-033',
    name: 'Maria Magdalena Gebze',
    email: 'maria.gebze@merauke.ac.id',
    phone: '082198004512',
    category: 'Riset & Inovasi',
    regency: 'Boven Digoel',
    subject: 'Permohonan Kerjasama Riset Pengolahan Minyak Atsiri Gaharu Lokal Boven Digoel',
    description: 'Kami dari kelompok peneliti muda mengajukan proposal kajian rantai nilai komoditas gaharu dan damar di wilayah Mandobo Boven Digoel agar bisa didampingi oleh bidang Riset dan Inovasi Daerah (BRIDA) Bapperida PPS.',
    status: 'Ditindaklanjuti',
    createdAt: '2026-08-20 11:40',
    updatedAt: '2026-08-25 10:30',
    response: 'Proposal telah ditelaah oleh Bidang Riset dan Inovasi Daerah (BRIDA). Tim peneliti dijadwalkan untuk audiensi teknis di Ruang Pertemuan Bapperida Salor pada tanggal 15 September 2026.',
    responderName: 'Bidang Riset & Inovasi Daerah (BRIDA)'
  },
  {
    id: 'comp-3',
    ticketNo: 'BAP-PPS-202609-002',
    name: 'Barnabas Awyu',
    email: 'barnabas.awyu@gmail.com',
    phone: '081344129988',
    category: 'Perencanaan Wilayah',
    regency: 'Mappi',
    subject: 'Permintaan Informasi Alokasi Bantuan Dermaga Sungai di Distrik Obaa',
    description: 'Menanyakan apakah pembangunan dermaga apung rakyat di Distrik Obaa Kabupaten Mappi terakomodir dalam alokasi APBD Provinsi Papua Selatan tahun 2025/2026.',
    status: 'Sedang Diproses',
    createdAt: '2026-09-01 14:02',
    updatedAt: '2026-09-02 08:30',
    response: 'Pengaduan telah didisposisikan kepada Bidang Infrastruktur & Kewilayahan untuk pengecekan DPA Perhubungan TA 2025 dan usulan RKPD 2026.',
    responderName: 'Sekretariat Bapperida PPS'
  }
];

export const initialAgendas: AgendaEvent[] = [
  {
    id: 'ag-1',
    title: 'Rapat Koordinasi Evaluasi Realisasi RKPD Triwulan III Tahun 2026 se-Papua Selatan',
    description: 'Evaluasi capaian indikator kinerja utama, realisasi fisik dan serapan keuangan APBD 2026 bersama 4 Bappeda Kabupaten.',
    date: '2026-09-15',
    time: '09:00 - 15:30 WIT',
    location: 'Aula Bapperida Lantai 2, Kompleks Pusat Pemerintahan Salor, Merauke',
    organizer: 'Bidang Pengendalian & Evaluasi Pembangunan Bapperida PPS',
    status: 'Akan Datang',
    category: 'Rakor'
  },
  {
    id: 'ag-2',
    title: 'Lokakarya Penataan Kawasan Konservasi Hayati dan Ekosistem Gambut Asmat-Mappi',
    description: 'Kolaborasi riset aksi Bapperida-BRIDA bersama BRIN, KLHK, dan mitra konservasi internasional dalam perlindungan bentang lahan rawa Papua Selatan.',
    date: '2026-09-22',
    time: '08:30 - 16:00 WIT',
    location: 'Ballroom Hotel Halogen Merauke & Daring (Hybrid)',
    organizer: 'Bidang Riset & Inovasi Daerah Bapperida',
    status: 'Akan Datang',
    category: 'Seminar & Riset'
  },
  {
    id: 'ag-3',
    title: 'Sosialisasi & Pendampingan Penyusunan Renja OPD Tahun 2026 via Aplikasi SIPD-RI',
    description: 'Pendampingan teknis input sub-kegiatan dan indikator Renja bagi kasubag perencana seluruh dinas dan badan Pemprov Papua Selatan.',
    date: '2026-09-28',
    time: '09:00 - 16:00 WIT',
    location: 'Laboratorium Komputer Bapperida PPS, Salor',
    organizer: 'Sekretariat Bapperida PPS',
    status: 'Akan Datang',
    category: 'Bimtek'
  },
  {
    id: 'ag-4',
    title: 'Musyawarah Perencanaan Pembangunan (Musrenbang) Tematik Perempuan, Anak & Adat Anim Ha',
    description: 'Menjaring aspirasi khusus mama-mama Papua, perlindungan anak, dan ketahanan sosial adat dalam dokumen perencanaan tahunan.',
    date: '2026-08-18',
    time: '08:00 - 14:00 WIT',
    location: 'Gedung Negara Merauke, Papua Selatan',
    organizer: 'Bidang Pemerintahan & Pembangunan Manusia Bapperida',
    status: 'Selesai',
    category: 'Musrenbang'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Gedung Pusat Pemerintahan Provinsi Papua Selatan di Salor',
    category: 'Infrastruktur',
    location: 'Salor, Kab. Merauke',
    date: '2026-08-10',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Kompleks kantor gubernur dan pusat instansi kedinasan Pemprov Papua Selatan termasuk kantor Bapperida.'
  },
  {
    id: 'gal-2',
    title: 'Sidang Pleno Musrenbang RPJPD Papua Selatan 2025–2045',
    category: 'Musrenbang',
    location: 'Merauke',
    date: '2026-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pertemuan pleno perumusan visi masa depan Papua Selatan bersama para pemangku kepentingan 4 kabupaten.'
  },
  {
    id: 'gal-3',
    title: 'Riset Pemetaan Potensi Sagu dan Hutan Rawa di Kabupaten Mappi',
    category: 'Riset Daerah',
    location: 'Kepi, Kab. Mappi',
    date: '2026-07-22',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    caption: 'Tim peneliti BRIDA Bapperida saat pengambilan sampel vegetasi sagu dan wawancara dengan tokoh adat setempat.'
  },
  {
    id: 'gal-4',
    title: 'Kunjungan Lapangan Peninjauan Tata Ruang Pesisir Pantai Lampu Satu',
    category: 'Kunjungan Wilayah',
    location: 'Pantai Lampu Satu, Merauke',
    date: '2026-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Peninjauan rencana penataan kawasan wisata terpadu dan mitigasi abrasi pantai selatan Merauke.'
  },
  {
    id: 'gal-5',
    title: 'Pemberdayaan Perajin Ukir Kayu Tradisional Asmat dalam Ekonomi Kreatif',
    category: 'Kegiatan Internal',
    location: 'Agats, Kab. Asmat',
    date: '2026-05-20',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
    caption: 'Sinergi Bapperida dengan pengukir Asmat dalam rangka riset hilirisasi produk kriya bernilai ekspor.'
  },
  {
    id: 'gal-6',
    title: 'Rakor Sinkronisasi Pembangunan Jalan Strategis Tanah Merah Boven Digoel',
    category: 'Kunjungan Wilayah',
    location: 'Tanah Merah, Boven Digoel',
    date: '2026-04-12',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
    caption: 'Rakor lapangan percepatan ruas jalan provinsi dan jalur logistik perbatasan RI-Papua Nugini.'
  }
];

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
  leaderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  leaderMotto: 'Perencanaan yang presisi dan riset yang terarah adalah kunci kemandirian serta kesejahteraan masyarakat di Tanah Anim Ha.',
  speechTitle: 'Menata Masa Depan Papua Selatan: Sinergi Perencanaan Terpadu, Riset, dan Kearifan Anim Ha',
  speechOpening: 'Tabea, Salam Sejahtera bagi kita sekalian, Syalom, Om Swastyastu, Namo Buddhaya, Salam Kebajikan.\n\nPuji dan syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan penyertaan-Nya, sehingga kita bersama dapat memulai lembaran baru pembangunan di Tanah Anim Ha.',
  speechBody: 'Sebagai Daerah Otonom Baru yang dibentuk berdasarkan Undang-Undang Republik Indonesia Nomor 14 Tahun 2022, Provinsi Papua Selatan memiliki tanggung jawab sejarah untuk meletakkan pondasi pembangunan jangka panjang (RPJPD 2025–2045) yang berakar kuat pada nilai kearifan lokal 4 kabupaten: Kabupaten Merauke, Kabupaten Boven Digoel, Kabupaten Mappi, dan Kabupaten Asmat.\n\nPenggabungan fungsi perencanaan pembangunan daerah (Bappeda) dan riset inovasi daerah (BRIDA) dalam satu wadah BAPPERIDA merupakan langkah strategis dan visioner. Setiap perumusan arah kebijakan, penetapan program prioritas, dan penganggaran tidak lagi semata-mata bersifat administratif, melainkan dilandasi secara ilmiah melalui pendekatan evidence-based policy, pemanfaatan Satu Data geospasial yang akurat, serta komitmen kuat dalam perlindungan hak-hak dasar Orang Asli Papua (OAP).',
  speechClosing: 'Melalui portal resmi Bapperida Provinsi Papua Selatan ini, kami membuka ruang seluas-luasnya bagi masyarakat, akademisi, mitra pembangunan, dan generasi muda untuk mengakses dokumen perencanaan resmi, meninjau indikator makro daerah, serta menyampaikan saran dan aspirasi konstruktif demi mewujudkan Papua Selatan yang Maju, Mandiri, Berdaya Saing, dan Sejahtera.',
  officeAddress: 'Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Papua Selatan 99616',
  officeEmail: 'bapperidaprogram.pps@gmail.com',
  officePhone: '(0971) 321-450 / 0811-482-9900',
  officeHours: 'Senin – Jumat: 08.00 – 16.00 WIT',
  musrenbangUrl: 'https://musrenbang.papuaselatanprov.go.id',
  sipdUrl: 'https://sipd-ri.kemendagri.go.id',
  satuDataUrl: 'https://satudata.papuaselatanprov.go.id'
};
