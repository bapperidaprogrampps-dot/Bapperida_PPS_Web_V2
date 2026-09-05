import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, Calendar, X, Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../types';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <ImageIcon className="w-4 h-4" />
          <span>Dokumentasi Visual</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Galeri Kegiatan & Pembangunan Daerah
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
          Arsip dokumentasi kegiatan rapat koordinasi, musrenbang provinsi, riset lapangan BRIDA, serta peninjauan progres infrastruktur di seluruh wilayah Provinsi Papua Selatan.
        </p>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0f3d5c] transition cursor-pointer group flex flex-col"
          >
            <div className="aspect-4/3 w-full overflow-hidden bg-slate-100 relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
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
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full max-h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
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
