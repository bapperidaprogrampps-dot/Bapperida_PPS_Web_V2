import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  Save, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  Pin, 
  PinOff, 
  Eye, 
  Tag, 
  Calendar, 
  Building2, 
  ArrowRight, 
  RotateCcw,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NewsArticle, AgencySettings } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminHeroHighlightTabProps {
  news: NewsArticle[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
  onNavigateTab?: (tabId: any) => void;
}

const DEFAULT_HIGHLIGHT_FALLBACKS: NewsArticle[] = [
  {
    id: 'hl-1',
    title: 'Portal Satu Data & Perencanaan Terpadu Papua Selatan Resmi Siap Melayani 4 Kabupaten',
    slug: 'portal-satu-data-perencanaan-terpadu-papua-selatan',
    category: 'Pemerintahan',
    summary: 'Bapperida Provinsi Papua Selatan mengintegrasikan seluruh dokumen perencanaan daerah, riset inovasi, dan layanan aspirasi masyarakat Anim Ha.',
    content: 'Pemerintah Provinsi Papua Selatan melalui Badan Perencanaan Pembangunan...',
    author: 'Humas Bapperida PPS',
    publishedAt: '10 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    views: 342,
    status: 'published',
    tags: ['Bapperida', 'Papua Selatan']
  },
  {
    id: 'hl-2',
    title: 'Akselerasi Penyusunan Dokumen RPJPD & RPJMD Kawasan Sentra Pertanian dan Gambut Anim Ha',
    slug: 'akselerasi-penyusunan-dokumen-rpjpd-rpjmd',
    category: 'Pembangunan',
    summary: 'Prioritas pembangunan diarahkan pada peningkatan konektivitas Merauke, Boven Digoel, Mappi, dan Asmat serta ketahanan pangan lokal.',
    content: 'Penyusunan Rencana Pembangunan Daerah...',
    author: 'Bidang Perencanaan Makro',
    publishedAt: '08 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    views: 285,
    status: 'published',
    tags: ['RPJPD', 'Pertanian']
  },
  {
    id: 'hl-3',
    title: 'Pengembangan Inovasi Hilirisasi Sagu Mappi dan Ekosistem Riset Terapan BRIDA Papua Selatan',
    slug: 'pengembangan-inovasi-hilirisasi-sagu-mappi',
    category: 'Riset & Inovasi',
    summary: 'Kerja sama riset aplikatif untuk meningkatkan nilai tambah komoditas unggulan daerah dan perlindungan kearifan lokal masyarakat adat.',
    content: 'Bidang Riset dan Inovasi Daerah...',
    author: 'Bidang Riset & Inovasi',
    publishedAt: '05 September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    views: 219,
    status: 'published',
    tags: ['BRIDA', 'Riset']
  }
];

export function AdminHeroHighlightTab({ 
  news, 
  onDataChanged, 
  showToast,
  onNavigateTab 
}: AdminHeroHighlightTabProps) {
  const [settings, setSettings] = useState<AgencySettings>(() => StorageService.getAgencySettings());
  const [badgeText, setBadgeText] = useState<string>(settings.heroHighlightBadge || 'Highlight Berita');
  const [intervalSeconds, setIntervalSeconds] = useState<number>(settings.heroHighlightInterval || 6);
  const [mode, setMode] = useState<'auto' | 'manual'>(settings.heroHighlightMode || 'auto');
  const [selectedIds, setSelectedIds] = useState<string[]>(settings.heroHighlightArticleIds || []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  // Sync settings when storage updates
  useEffect(() => {
    const handleSync = () => {
      const s = StorageService.getAgencySettings();
      setSettings(s);
      if (s.heroHighlightBadge) setBadgeText(s.heroHighlightBadge);
      if (s.heroHighlightInterval) setIntervalSeconds(s.heroHighlightInterval);
      if (s.heroHighlightMode) setMode(s.heroHighlightMode);
      if (s.heroHighlightArticleIds) setSelectedIds(s.heroHighlightArticleIds);
    };

    window.addEventListener('bapperida:data-synced', handleSync);
    return () => window.removeEventListener('bapperida:data-synced', handleSync);
  }, []);

  const publishedNews = news.filter(n => n.status === 'published' || !n.status);

  // Filtered news for the selection list
  const filteredNews = publishedNews.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which articles will be previewed and featured on homepage
  let activeHighlightArticles: NewsArticle[] = [];
  if (mode === 'manual' && selectedIds.length > 0) {
    // Order according to selectedIds
    selectedIds.forEach(id => {
      const found = publishedNews.find(n => n.id === id);
      if (found) activeHighlightArticles.push(found);
    });
    // If some selected IDs couldn't be found, add published news fallback
    if (activeHighlightArticles.length === 0) {
      activeHighlightArticles = publishedNews.slice(0, 5);
    }
  } else {
    // Auto mode: take the latest 5 published news
    activeHighlightArticles = publishedNews.slice(0, 5);
  }

  // If still empty (no news published yet), use official fallback news
  const previewArticles = activeHighlightArticles.length > 0 
    ? activeHighlightArticles 
    : DEFAULT_HIGHLIGHT_FALLBACKS;

  // Toggle selection
  const handleTogglePin = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length >= 6) {
        showToast('Maksimal 6 artikel sorotan yang dapat disematkan sekaligus.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
    setMode('manual');
  };

  // Move priority up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...selectedIds];
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
    setSelectedIds(newArr);
  };

  // Move priority down
  const handleMoveDown = (index: number) => {
    if (index === selectedIds.length - 1) return;
    const newArr = [...selectedIds];
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
    setSelectedIds(newArr);
  };

  // Save changes
  const handleSave = () => {
    setIsSaving(true);
    try {
      const current = StorageService.getAgencySettings();
      StorageService.saveAgencySettings({
        ...current,
        heroHighlightBadge: badgeText.trim() || 'Highlight Berita',
        heroHighlightInterval: intervalSeconds,
        heroHighlightMode: mode,
        heroHighlightArticleIds: selectedIds
      });

      window.dispatchEvent(new CustomEvent('hero-highlight-updated'));
      window.dispatchEvent(new CustomEvent('bapperida:data-synced'));
      onDataChanged();
      showToast('Pengaturan Highlight Berita Beranda berhasil disimpan!');
    } catch (err) {
      showToast('Gagal menyimpan pengaturan highlight berita.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to auto defaults
  const handleResetToAuto = () => {
    setMode('auto');
    setSelectedIds([]);
    setBadgeText('Highlight Berita');
    setIntervalSeconds(6);
    showToast('Mode dikembalikan ke otomatis (menampilkan 5 berita terbaru).');
  };

  const currentPreviewArticle = previewArticles[previewIndex] || previewArticles[0];

  return (
    <div className="space-y-8" id="admin-hero-highlight-section">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-[#092233] via-[#0f3d5c] to-[#154e74] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hero Showcase Beranda</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pengaturan Highlight Berita Beranda
            </h2>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              Konfigurasi artikel sorotan utama dan visual carousel yang tampil di sisi kanan banner utama beranda portal Bapperida Provinsi Papua Selatan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              id="btn-save-hero-highlight"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Settings & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SISI KIRI: Konfigurasi & Pemilihan Berita (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Preferensi Tampilan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-[#0f3d5c]" />
              <h3 className="font-bold text-slate-900 text-base">
                Preferensi & Rotasi Carousel
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teks Label Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Label / Judul Badge Sorotan
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Misal: Highlight Berita"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f3d5c]/20 focus:border-[#0f3d5c] transition"
                />
                <span className="text-[11px] text-slate-500">
                  Teks yang muncul di sudut kiri atas kartu hero.
                </span>
              </div>

              {/* Durasi Rotasi Otomatis */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Durasi Rotasi Otomatis
                </label>
                <select
                  value={intervalSeconds}
                  onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f3d5c]/20 focus:border-[#0f3d5c] transition"
                >
                  <option value={4}>4 Detik (Cepat)</option>
                  <option value={6}>6 Detik (Rekomendasi)</option>
                  <option value={8}>8 Detik (Sedang)</option>
                  <option value={10}>10 Detik (Santai)</option>
                  <option value={0}>Nonaktifkan Rotasi Otomatis</option>
                </select>
                <span className="text-[11px] text-slate-500">
                  Carousel otomatis terjeda saat pengunjung mengarahkan mouse.
                </span>
              </div>
            </div>

            {/* Pilihan Mode Sorotan */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700">
                Mode Penentuan Berita Sorotan
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setMode('auto')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    mode === 'auto' 
                      ? 'border-[#0f3d5c] bg-[#0f3d5c]/5' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      mode === 'auto' ? 'border-[#0f3d5c]' : 'border-slate-400'
                    }`}>
                      {mode === 'auto' && <div className="w-2 h-2 rounded-full bg-[#0f3d5c]"></div>}
                    </div>
                    <span className="text-xs font-bold text-slate-900">Otomatis (Terbaru)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Sistem secara otomatis menampilkan 5 berita terbaru yang berstatus Diterbitkan (Published).
                  </p>
                </div>

                <div 
                  onClick={() => setMode('manual')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    mode === 'manual' 
                      ? 'border-[#0f3d5c] bg-[#0f3d5c]/5' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      mode === 'manual' ? 'border-[#0f3d5c]' : 'border-slate-400'
                    }`}>
                      {mode === 'manual' && <div className="w-2 h-2 rounded-full bg-[#0f3d5c]"></div>}
                    </div>
                    <span className="text-xs font-bold text-slate-900">Manual (Pilihan Khusus)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Pilih dan sematkan berita tertentu secara manual sesuai urutan prioritas yang Anda inginkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Urutan Berita yang Disematkan (Khusus Mode Manual) */}
          {mode === 'manual' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Daftar Urutan Highlight Tersemat ({selectedIds.length}/6)
                  </h3>
                </div>
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Kosongkan Semua
                  </button>
                )}
              </div>

              {selectedIds.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50 space-y-2">
                  <Pin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    Belum ada artikel yang disematkan secara manual.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Pilih artikel dari daftar di bawah ini untuk menjadikannya sorotan utama beranda.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedIds.map((id, index) => {
                    const article = publishedNews.find(n => n.id === id);
                    if (!article) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-[#0f3d5c] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <img
                            src={article.imageUrl || DEFAULT_HIGHLIGHT_FALLBACKS[0].imageUrl}
                            alt=""
                            className="w-12 h-9 object-cover rounded-md shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="text-[#0f3d5c] font-semibold">{article.category}</span>
                              <span>•</span>
                              <span>{article.publishedAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Pindah ke Atas"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === selectedIds.length - 1}
                            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Pindah ke Bawah"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePin(id)}
                            className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer ml-1"
                            title="Hapus dari Sorotan"
                          >
                            <PinOff className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Card 3: Daftar Berita yang Diterbitkan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Koleksi Berita Bapperida ({publishedNews.length} Diterbitkan)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih berita untuk disematkan atau pratinjau langsung di kartu hero.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f3d5c]/20"
                />
              </div>
            </div>

            {/* List Berita */}
            {filteredNews.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50 space-y-3">
                <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">
                    {publishedNews.length === 0 
                      ? 'Belum ada artikel berita yang dipublikasikan' 
                      : 'Tidak ada berita yang cocok dengan pencarian'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    {publishedNews.length === 0
                      ? 'Hero banner saat ini menggunakan 3 artikel resmi default Bapperida Papua Selatan sebagai penampil sorotan.'
                      : 'Coba ubah kata kunci pencarian Anda.'}
                  </p>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('berita')}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0f3d5c] hover:bg-[#092233] text-white transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>Buka Tab Kelola Berita</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredNews.map((item) => {
                  const isPinned = selectedIds.includes(item.id);
                  const pinOrder = selectedIds.indexOf(item.id) + 1;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isPinned 
                          ? 'border-amber-400 bg-amber-50/50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.imageUrl || DEFAULT_HIGHLIGHT_FALLBACKS[0].imageUrl}
                          alt=""
                          className="w-14 h-11 object-cover rounded-lg shrink-0 border border-slate-200 mt-0.5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                              {item.category}
                            </span>
                            {isPinned && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1">
                                <Pin className="w-2.5 h-2.5" />
                                <span>Urutan #{pinOrder}</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500">
                            <span className="truncate">{item.author}</span>
                            <span>•</span>
                            <span>{item.publishedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isPinned
                              ? 'bg-rose-500 hover:bg-rose-600 text-white'
                              : 'bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-700'
                          }`}
                        >
                          {isPinned ? (
                            <>
                              <PinOff className="w-3 h-3" />
                              <span>Batal</span>
                            </>
                          ) : (
                            <>
                              <Pin className="w-3 h-3" />
                              <span>Sematkan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* SISI KANAN: Live Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0f3d5c]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Pratinjau Langsung (Hero Section)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Tampilan di Beranda
              </span>
            </div>

            {/* Kartu Pratinjau Hero Highlight Identik dengan di Beranda */}
            <div className="bg-[#092233] p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="text-[11px] text-amber-300/80 font-mono flex items-center justify-between">
                <span>Mode: {mode === 'manual' ? 'Pilihan Manual' : 'Otomatis Terbaru'}</span>
                <span>Rotasi: {intervalSeconds > 0 ? `${intervalSeconds}s` : 'Manual'}</span>
              </div>

              {/* The Hero Card Replica */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-950 shadow-2xl">
                
                {/* Header Showcase */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-white/15 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Newspaper className="w-3.5 h-3.5 text-amber-400" />
                      <span>{badgeText || 'Highlight Berita'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md font-bold">
                      <span className="text-amber-400">{previewIndex + 1}</span> / {previewArticles.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewIndex(prev => prev === 0 ? previewArticles.length - 1 : prev - 1)}
                        className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        title="Sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewIndex(prev => (prev + 1) % previewArticles.length)}
                        className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        title="Selanjutnya"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Image with Category & Date */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={currentPreviewArticle.imageUrl || DEFAULT_HIGHLIGHT_FALLBACKS[0].imageUrl}
                    alt={currentPreviewArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Category */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-950" />
                      <span>{currentPreviewArticle.category}</span>
                    </span>
                  </div>

                  {/* Date */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/75 backdrop-blur-md text-slate-200 border border-white/15 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{currentPreviewArticle.publishedAt}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2 text-white bg-slate-950/95 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentPreviewArticle.author}</span>
                    </div>
                    {currentPreviewArticle.views !== undefined && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-medium">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{currentPreviewArticle.views} dibaca</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold leading-snug text-slate-100 line-clamp-2">
                    {currentPreviewArticle.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {currentPreviewArticle.summary}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    {/* Dots */}
                    <div className="flex items-center gap-1">
                      {previewArticles.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === previewIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/20'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-md">
                      <span>Baca Berita</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {mode === 'manual' && selectedIds.length > 0
                    ? `Menampilkan ${selectedIds.length} artikel pilihan manual di carousel beranda.`
                    : `Menampilkan ${Math.min(publishedNews.length || 3, 5)} artikel berita secara otomatis di carousel beranda.`}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetToAuto}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan ke Otomatis</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
