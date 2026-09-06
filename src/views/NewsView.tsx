import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Tag, 
  ChevronRight 
} from 'lucide-react';
import { NewsArticle } from '../types';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface NewsViewProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export function NewsView({ articles, onSelectArticle }: NewsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Musrenbang', 'Riset & Inovasi', 'Pembangunan', 'Pemerintahan', 'Pengumuman'];

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchCat = selectedCategory === 'Semua' || art.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = articles[0];

  return (
    <div className="w-full pb-16 space-y-8">
      {/* Header Banner - Full Width Kiri & Kanan Mentok dengan Siluet Rusa di Sebelah Kanan */}
      <PageHeaderBanner
        badgeIcon={<Newspaper className="w-4 h-4" />}
        badgeText="Kanal Berita & Siaran Pers"
        title="Publikasi Berita & Dokumentasi Kegiatan"
        description="Kilas berita seputar perencanaan pembangunan wilayah, perkembangan riset dan inovasi daerah, serta agenda Pemprov Papua Selatan."
      />

      {/* Main Content Area - Boxed */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-8">

      {/* Featured News Hero (if no search and viewing 'Semua') */}
      {!searchQuery && selectedCategory === 'Semua' && featuredArticle && (
        <ScrollReveal variant="fade-up" duration={0.65}>
          <div 
            onClick={() => onSelectArticle(featuredArticle)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#0f3d5c] transition cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden bg-slate-100">
              <img 
                src={featuredArticle.imageUrl} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f3d5c] text-white">
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                    Berita Utama
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0f3d5c] transition leading-snug">
                  {featuredArticle.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {featuredArticle.publishedAt}
                </span>
                <span className="font-bold text-[#0f3d5c] flex items-center gap-1">
                  Baca Liputan Lengkap <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Filter & Search Bar */}
      <ScrollReveal variant="fade-up" duration={0.6} delay={0.05}>
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0f3d5c] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#0f3d5c] text-slate-800"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* News Grid */}
      <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <StaggerItem key={art.id} variant="fade-up">
            <div
              onClick={() => onSelectArticle(art)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0f3d5c] transition cursor-pointer flex flex-col group h-full"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f3d5c]/90 text-white backdrop-blur-xs">
                  {art.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {art.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {art.views}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0f3d5c] line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0f3d5c]">
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
      </div>
    </div>
  );
}
