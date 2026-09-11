import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, Calendar, X, Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../types';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

interface GalleryViewProps {
  gallery: GalleryItem[];
}

export function GalleryView({ gallery }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Musrenbang', 'Kunjungan Wilayah', 'Riset Daerah', 'Infrastruktur', 'Kegiatan Internal'];

  const filtered = gallery.filter(item => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full pb-16 space-y-8">
      {/* Header Banner - Full Width Kiri & Kanan Mentok dengan Siluet Rusa di Sebelah Kanan */}
      <PageHeaderBanner
        badgeIcon={<ImageIcon className="w-4 h-4" />}
        badgeText="Dokumentasi Visual"
        title="Galeri Kegiatan & Pembangunan Daerah"
        description="Arsip dokumentasi kegiatan rapat koordinasi, musrenbang provinsi, riset lapangan BRIDA, serta peninjauan progres infrastruktur di seluruh wilayah Provinsi Papua Selatan."
      />

      {/* Main Content Area - Boxed */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-8">

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-500 font-semibold mr-1 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Kategori:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#0f3d5c] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0f3d5c] transition cursor-pointer group flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="w-10 h-10 opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/90 text-slate-900 border border-slate-200">
                    <Eye className="w-5 h-5" />
                  </span>
                </div>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f3d5c]/85 text-white backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0f3d5c] line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Belum Ada Dokumentasi Foto</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Belum ada dokumentasi visual atau kegiatan lapangan yang dipublikasikan. Dokumentasi resmi dapat diunggah melalui Portal Admin.
          </p>
        </div>
      )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-[#0f3d5c]">{activePhoto.category}</span>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto">
              {activePhoto.imageUrl ? (
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full max-h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-lg text-slate-900 leading-snug">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activePhoto.caption}
                </p>
                <div className="pt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-4 h-4 text-amber-500" /> Lokasi: {activePhoto.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Tanggal: {activePhoto.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
