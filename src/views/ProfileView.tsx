import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  Award, 
  Users, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert,
  Compass,
  Lightbulb,
  Briefcase,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { EmployeePositionCategory, EmployeeProfile } from '../types';
import { EmployeeZigzagRow } from '../components/EmployeeZigzagRow';

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah' | 'tupoksi' | 'struktur' | 'pegawai' | 'pimpinan'>('visi-misi');
  const [employeeCategory, setEmployeeCategory] = useState<string>('Semua');
  const [employeeSearch, setEmployeeSearch] = useState<string>('');

  const [agencySettings, setAgencySettings] = useState(() => StorageService.getAgencySettings());
  const [employees, setEmployees] = useState(() => StorageService.getEmployees());

  useEffect(() => {
    const handleSync = () => {
      setAgencySettings(StorageService.getAgencySettings());
      setEmployees(StorageService.getEmployees());
    };
    window.addEventListener('bapperida:data-synced', handleSync);
    return () => window.removeEventListener('bapperida:data-synced', handleSync);
  }, []);

  const POSITION_CATEGORIES: EmployeePositionCategory[] = [
    'Kepala Badan',
    'Sekretaris',
    'Kasubag',
    'Kasubid',
    'Staff'
  ];

  const HIERARCHY_SECTIONS: {
    category: EmployeePositionCategory;
    title: string;
    gridCols: string;
    isLeader?: boolean;
  }[] = [
    {
      category: 'Kepala Badan',
      title: 'Kepala Badan',
      gridCols: 'grid-cols-1 max-w-sm mx-auto',
      isLeader: true
    },
    {
      category: 'Sekretaris',
      title: 'Sekretaris Badan',
      gridCols: 'grid-cols-1 max-w-sm mx-auto',
      isLeader: false
    },
    {
      category: 'Kasubag',
      title: 'Kepala Sub Bagian (Kasubag)',
      gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto',
      isLeader: false
    },
    {
      category: 'Kasubid',
      title: 'Kepala Sub Bidang (Kasubid)',
      gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto',
      isLeader: false
    },
    {
      category: 'Staff',
      title: 'Staff / Aparatur Pelaksana',
      gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      isLeader: false
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchCat = employeeCategory === 'Semua' || emp.positionCategory === employeeCategory;
    const matchSearch = !employeeSearch || 
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      (emp.nip && emp.nip.toLowerCase().includes(employeeSearch.toLowerCase())) ||
      emp.positionTitle.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      (emp.department && emp.department.toLowerCase().includes(employeeSearch.toLowerCase()));
    return matchCat && matchSearch;
  }).sort((a, b) => (a.order || 999) - (b.order || 999));

  return (
    <div className="w-full pb-16 space-y-8">
      {/* Header Banner - Full Width Kiri & Kanan Mentok dengan Siluet Rusa di Sebelah Kanan */}
      <PageHeaderBanner
        badgeText="Tentang Instansi"
        title="Profil Bapperida Provinsi Papua Selatan"
        description="Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah (Bapperida) Provinsi Papua Selatan merupakan unsur penunjang urusan pemerintahan bidang perencanaan dan kelitbangan yang menjadi kewenangan daerah provinsi baru di kawasan Anim Ha."
      >
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'visi-misi', label: 'Visi & Misi' },
            { id: 'sejarah', label: 'Sejarah & Dasar Hukum' },
            { id: 'tupoksi', label: 'Tugas Pokok & Fungsi' },
            { id: 'struktur', label: 'Struktur Organisasi' },
            { id: 'pegawai', label: 'Profil Pegawai' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageHeaderBanner>

      {/* Main Content Area - Boxed */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-8">

      {/* Tab 1: Visi & Misi */}
      {activeTab === 'visi-misi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal variant="fade-right" duration={0.65}>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5 text-[#0f3d5c] font-bold text-lg mb-3">
                  <Target className="w-5 h-5 text-amber-500" />
                  <h2>Visi Pembangunan Papua Selatan 2025–2045</h2>
                </div>
                <blockquote className="p-4 bg-amber-50/60 border-l-4 border-amber-500 text-sm font-semibold text-slate-800 rounded-r-lg leading-relaxed italic">
                  &ldquo;Papua Selatan Maju, Mandiri, Berkeadilan, dan Berkelanjutan Berbasis Sentra Agromaritim dan Kearifan Lokal Anim Ha Menuju Indonesia Emas 2045&rdquo;
                </blockquote>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  Visi ini menjadi kompas perencanaan pembangunan daerah selama dua dekade ke depan, mengintegrasikan empat kabupaten (Merauke, Boven Digoel, Mappi, Asmat) sebagai satu kesatuan ekosistem ekonomi, sosial, dan budaya.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={0.65} delay={0.1}>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5 text-[#0f3d5c] font-bold text-lg mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3>Nilai-Nilai Kerja Bapperida (PPS-HEBAT)</h3>
                </div>
                <StaggerContainer staggerDelay={0.07} className="grid grid-cols-2 gap-3 text-xs">
                  <StaggerItem variant="zoom-in">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                      <span className="font-bold text-[#0f3d5c] block">P - Profesional</span>
                      <span className="text-slate-600">Bekerja berdasarkan standar kompetensi dan kode etik ASN.</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem variant="zoom-in">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                      <span className="font-bold text-[#0f3d5c] block">P - Presisi Data</span>
                      <span className="text-slate-600">Perencanaan berbasis geospasial dan riset ilmiah valid.</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem variant="zoom-in">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                      <span className="font-bold text-[#0f3d5c] block">S - Sinergis</span>
                      <span className="text-slate-600">Kolaboratif bersama 4 kabupaten, kementerian, dan adat.</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem variant="zoom-in">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                      <span className="font-bold text-[#0f3d5c] block">I - Inovatif</span>
                      <span className="text-slate-600">Terbuka pada pembaruan teknologi dan hilirisasi riset BRIDA.</span>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade-left" duration={0.65} className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 h-full">
              <div className="flex items-center gap-2.5 text-[#0f3d5c] font-bold text-lg mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <h2>Misi Strategis Bapperida</h2>
              </div>
              <StaggerContainer staggerDelay={0.08} className="space-y-4 text-xs sm:text-sm text-slate-700">
                {[
                  {
                    num: '01',
                    title: 'Mewujudkan Kualitas Sumber Daya Manusia Unggul dan Perlindungan OAP',
                    desc: 'Meningkatkan derajat pendidikan, kesehatan, penurunan stunting, dan penguatan hak-hak adat Orang Asli Papua (OAP) dalam pembangunan.'
                  },
                  {
                    num: '02',
                    title: 'Akselerasi Pertumbuhan Ekonomi Inklusif & Ketahanan Pangan Nasional',
                    desc: 'Mengembangkan klaster pertanian padi Merauke, industri perkebunan Boven Digoel, komoditas sagu Mappi, serta perikanan Asmat secara berkelanjutan.'
                  },
                  {
                    num: '03',
                    title: 'Pemerataan Konektivitas Multi-Moda & Infrastruktur Kewilayahan',
                    desc: 'Memadukan transportasi darat Trans-Papua dengan angkutan sungai dan laut perintis untuk menekan disparitas harga antar-wilayah pedalaman.'
                  },
                  {
                    num: '04',
                    title: 'Tata Kelola Lingkungan Hidup, Ekosistem Gambut, dan Mitigasi Bencana',
                    desc: 'Menjaga kelestarian bentang lahan rawa dan hutan Papua Selatan serta mendorong transisi energi hijau terbarukan.'
                  },
                  {
                    num: '05',
                    title: 'Penguatan Riset, Inovasi Daerah (BRIDA) & Transformasi Digital',
                    desc: 'Mewujudkan perencanaan berbasis bukti (evidence-based policy), satu data geospasial, dan ekosistem riset terapan bersama BRIN dan universitas.'
                  }
                ].map(item => (
                  <StaggerItem key={item.num} variant="fade-left">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition">
                      <span className="px-2 py-1 rounded bg-[#0f3d5c] text-white font-mono font-bold text-xs shrink-0">
                        {item.num}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Tab 2: Sejarah & Dasar Hukum */}
      {activeTab === 'sejarah' && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div className="max-w-4xl space-y-4">
              <h3 className="text-xl font-bold text-[#0f3d5c]">
                Latar Belakang Pembentukan & Payung Regulasi
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Provinsi Papua Selatan resmi terbentuk berdasarkan <strong>Undang-Undang Republik Indonesia Nomor 14 Tahun 2022</strong> tentang Pembentukan Provinsi Papua Selatan. Sebagai Daerah Otonom Baru (DOB) hasil pemekaran dari Provinsi Papua induk, Provinsi Papua Selatan membawahi 4 (empat) kabupaten: Kabupaten Merauke, Kabupaten Boven Digoel, Kabupaten Mappi, dan Kabupaten Asmat, dengan ibukota provinsi di Salor, Merauke.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Guna menyelenggarakan fungsi perencanaan dan penelitian pengembangan di daerah otonom baru ini, dibentuklah Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah (Bapperida) Provinsi Papua Selatan yang menggabungkan fungsi Badan Perencanaan Pembangunan Daerah (Bappeda) dan Badan Riset dan Inovasi Daerah (BRIDA) dalam satu payung kelembagaan terpadu sesuai ketentuan Permendagri dan Peraturan BRIN.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Dasar Hukum Penyelenggaraan:</h4>
              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                    <span className="font-bold text-[#0f3d5c]">1. UU No. 14 Tahun 2022</span>
                    <p className="text-slate-600 mt-0.5">Pembentukan Provinsi Papua Selatan di Wilayah Adat Anim Ha.</p>
                  </div>
                </StaggerItem>
                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                    <span className="font-bold text-[#0f3d5c]">2. UU No. 23 Tahun 2014</span>
                    <p className="text-slate-600 mt-0.5">Pemerintahan Daerah & Penyelenggaraan Urusan Konkuren Perencanaan.</p>
                  </div>
                </StaggerItem>
                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                    <span className="font-bold text-[#0f3d5c]">3. Permendagri No. 86 Tahun 2017</span>
                    <p className="text-slate-600 mt-0.5">Tata Cara Perencanaan, Pengendalian, dan Evaluasi Dokumen Rencana Daerah.</p>
                  </div>
                </StaggerItem>
                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 h-full">
                    <span className="font-bold text-[#0f3d5c]">4. Peraturan BRIN No. 5 Tahun 2023</span>
                    <p className="text-slate-600 mt-0.5">Tata Kerja dan Integrasi Badan Riset dan Inovasi Daerah (BRIDA) di Lingkungan Pemda.</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Tab 3: Tupoksi */}
      {activeTab === 'tupoksi' && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#0f3d5c]">
                Tugas Pokok & Fungsi (Tupoksi) Bapperida PPS
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Sesuai Peraturan Gubernur Papua Selatan tentang Kedudukan, Susunan Organisasi, Tugas dan Fungsi Bapperida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal variant="fade-right" duration={0.6}>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 h-full">
                  <div className="flex items-center gap-2 font-bold text-[#0f3d5c] text-sm">
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    <h4>Tugas Pokok</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Membantu Gubernur dalam melaksanakan fungsi penunjang urusan pemerintahan yang menjadi kewenangan daerah di bidang perencanaan pembangunan daerah, pengendalian dan evaluasi, serta penelitian, pengembangan, pengkajian, dan penerapan inovasi daerah di Provinsi Papua Selatan.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-left" duration={0.6}>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 h-full">
                  <div className="flex items-center gap-2 font-bold text-[#0f3d5c] text-sm">
                    <Compass className="w-4 h-4 text-amber-500" />
                    <h4>Fungsi Utama</h4>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                    <li>Penyusunan kebijakan teknis perencanaan makro (RPJPD, RPJMD, RKPD).</li>
                    <li>Koordinasi dan sinkronisasi perencanaan pembangunan lintas 4 kabupaten.</li>
                    <li>Pengendalian, pemantauan, dan evaluasi realisasi rencana pembangunan.</li>
                    <li>Pengelolaan dan hilirisasi riset, inovasi, dan kekayaan intelektual daerah.</li>
                    <li>Penyelenggaraan simpul jaringan geospasial dan Satu Data Papua Selatan.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Tab 4: Struktur Organisasi */}
      {activeTab === 'struktur' && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-[#0f3d5c]">
                Bagan Struktur Organisasi Bapperida Papua Selatan
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Hierarki struktural Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah
              </p>
            </div>

            {/* Interactive Visual Hierarchy Tree */}
            <div className="max-w-4xl mx-auto py-6 space-y-4 text-xs font-semibold">
              {/* Level 1: Kepala Badan */}
              <ScrollReveal variant="zoom-in" duration={0.6} className="flex justify-center">
                <div className="bg-[#0f3d5c] text-white p-4 rounded-xl text-center w-72 border-2 border-amber-400">
                  <span className="text-[10px] text-amber-300 uppercase block font-mono">Pimpinan Tinggi Pratama</span>
                  <span className="text-sm font-bold block">KEPALA BAPPERIDA</span>
                  <span className="text-[11px] text-slate-300 font-normal">Provinsi Papua Selatan</span>
                </div>
              </ScrollReveal>

              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Level 2: Sekretariat */}
              <ScrollReveal variant="zoom-in" duration={0.6} delay={0.1} className="flex justify-center">
                <div className="bg-slate-800 text-white p-3 rounded-lg text-center w-64 border border-slate-700">
                  <span className="text-xs font-bold block">SEKRETARIAT BADAN</span>
                  <div className="mt-2 pt-2 border-t border-slate-600 flex justify-between text-[10px] text-slate-300 font-normal">
                    <span>Subbag Perencanaan & Keu</span>
                    <span>•</span>
                    <span>Subbag Umum & Kepeg</span>
                  </div>
                </div>
              </ScrollReveal>

              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>

              {/* Level 3: 5 Bidang Teknis */}
              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center h-full">
                    <span className="text-[10px] text-blue-700 uppercase block">Bidang I</span>
                    <span className="font-bold text-slate-900 text-[11px] block mt-1 leading-snug">
                      Perencanaan, Pengendalian & Evaluasi (PPEP)
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center h-full">
                    <span className="text-[10px] text-amber-700 uppercase block">Bidang II</span>
                    <span className="font-bold text-slate-900 text-[11px] block mt-1 leading-snug">
                      Pemerintahan & Pembangunan Manusia (PPM)
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center h-full">
                    <span className="text-[10px] text-emerald-700 uppercase block">Bidang III</span>
                    <span className="font-bold text-slate-900 text-[11px] block mt-1 leading-snug">
                      Perekonomian & Sumber Daya Alam (PSDA)
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-center h-full">
                    <span className="text-[10px] text-teal-700 uppercase block">Bidang IV</span>
                    <span className="font-bold text-slate-900 text-[11px] block mt-1 leading-snug">
                      Infrastruktur & Kewilayahan (Infrakewil)
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem variant="zoom-in">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center h-full">
                    <span className="text-[10px] text-purple-700 uppercase block">Bidang V</span>
                    <span className="font-bold text-slate-900 text-[11px] block mt-1 leading-snug">
                      Riset & Inovasi Daerah (BRIDA)
                    </span>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Tab 5: Profil Pegawai */}
      {(activeTab === 'pegawai' || activeTab === 'pimpinan') && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#092237] via-[#0d2e48] to-[#071926] text-white p-6 sm:p-10 lg:p-12 border border-slate-700/50 shadow-2xl space-y-10">
            {/* Background pattern decoration */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Main Headline Badge (Persis Poster EBS: | 과목별 강사 안내 |) */}
            <div className="relative z-10 text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-base sm:text-xl font-black tracking-widest">
                  | DAFTAR PEGAWAI BERDASARKAN JABATAN |
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
                Struktur hierarki aparatur sipil negara Bapperida Provinsi Papua Selatan dari Kepala Badan hingga Pegawai Pelaksana.
              </p>

              {/* Search Bar with Glassmorphism */}
              <div className="relative w-full max-w-md mx-auto pt-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Cari nama, NIP, jabatan..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-2xl text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="relative z-10 flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
              <button
                type="button"
                onClick={() => setEmployeeCategory('Semua')}
                className={`px-4 py-2 rounded-xl font-black text-xs transition cursor-pointer whitespace-nowrap shadow-xs ${
                  employeeCategory === 'Semua'
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/25'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                Semua ({employees.length})
              </button>
              {POSITION_CATEGORIES.map(cat => {
                const count = employees.filter(e => e.positionCategory === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEmployeeCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap ${
                      employeeCategory === cat
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/25'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Alternating Zig-Zag Rows by Hierarchy */}
            <div className="relative z-10 space-y-12">
              {(() => {
                let globalCounter = 0;

                return HIERARCHY_SECTIONS.map(section => {
                  if (employeeCategory !== 'Semua' && employeeCategory !== section.category) {
                    return null;
                  }

                  const sectionEmployees = filteredEmployees.filter(
                    emp => emp.positionCategory === section.category
                  );

                  if (sectionEmployees.length === 0 && employeeSearch) {
                    return null;
                  }

                  return (
                    <div key={section.category} className="space-y-4">
                      {/* Section Title Divider (Gaya EBS | KEPALA BADAN |) */}
                      <div className="flex items-center justify-center gap-4 py-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-white/25 flex-1 max-w-[120px] sm:max-w-xs"></div>
                        <span className="text-amber-300 font-mono text-xs sm:text-sm tracking-widest uppercase font-black px-4 py-1.5 rounded-full bg-white/10 border border-amber-300/30 shadow-xs">
                          | {section.title.toUpperCase()} |
                        </span>
                        <div className="h-px bg-gradient-to-l from-transparent via-white/25 to-white/25 flex-1 max-w-[120px] sm:max-w-xs"></div>
                      </div>

                      {/* Alternating Zig-Zag Items */}
                      {sectionEmployees.length > 0 ? (
                        <div className="space-y-4">
                          {sectionEmployees.map(emp => {
                            const rowIndex = globalCounter++;
                            return (
                              <EmployeeZigzagRow
                                key={emp.id}
                                employee={emp}
                                index={rowIndex}
                                isLeader={section.isLeader}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/15">
                          <p className="text-xs text-slate-400">
                            Belum ada pegawai terdaftar pada klasifikasi {section.title}.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Empty State */}
            {filteredEmployees.length === 0 && (
              <div className="relative z-10 p-12 text-center bg-white/5 rounded-3xl border border-white/15 space-y-4">
                <Users className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Tidak ada pegawai ditemukan</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Tidak ada data pegawai yang sesuai dengan kata kunci &ldquo;{employeeSearch}&rdquo;. Silakan periksa kembali ejaan pencarian.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmployeeSearch('');
                    setEmployeeCategory('Semua');
                  }}
                  className="px-5 py-2.5 bg-amber-400 text-slate-950 text-xs font-black rounded-xl hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
                >
                  Reset Pencarian & Filter
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}
      </div>
    </div>
  );
}
