import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  X, 
  CheckCircle2,
  UploadCloud,
  HardDrive
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';

interface AdminGalleryTabProps {
  gallery: GalleryItem[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const CATEGORIES = [
  'Musrenbang',
  'Kunjungan Wilayah',
  'Riset Daerah',
  'Infrastruktur',
  'Kegiatan Internal'
] as const;

export function AdminGalleryTab({ gallery, onDataChanged, showToast }: AdminGalleryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Musrenbang' | 'Kunjungan Wilayah' | 'Riset Daerah' | 'Infrastruktur' | 'Kegiatan Internal'>('Musrenbang');
  const [location, setLocation] = useState('Salor, Merauke');
  const [date, setDate] = useState('2026-08-20');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80');
  const [caption, setCaption] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      setImageUrl(res.url);
      showToast(`Foto berhasil diunggah ke server Hostinger! (${res.url})`);
    } catch (err: any) {
      alert(`Gagal mengunggah foto ke server: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Musrenbang');
    setLocation('Salor, Merauke');
    setDate(new Date().toISOString().split('T')[0]);
    setImageUrl('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80');
    setCaption('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setLocation(item.location);
    setDate(item.date);
    setImageUrl(item.imageUrl);
    setCaption(item.caption);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Mohon lengkapi judul dokumentasi dan tautan gambar foto.');
      return;
    }

    if (editingItem) {
      StorageService.updateGalleryItem({
        ...editingItem,
        title,
        category,
        location,
        date,
        imageUrl,
        caption: caption || title
      });
      showToast(`Dokumentasi foto "${title}" berhasil diperbarui.`);
    } else {
      StorageService.addGalleryItem({
        title,
        category,
        location,
        date,
        imageUrl,
        caption: caption || title
      });
      showToast(`Dokumentasi foto baru "${title}" berhasil ditambahkan.`);
    }

    onDataChanged();
    closeModal();
  };

  const handleDelete = (id: string, photoTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus foto "${photoTitle}"?`)) {
      StorageService.deleteGalleryItem(id);
      showToast(`Foto "${photoTitle}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const filteredGallery = gallery.filter(item => {
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Galeri & Dokumentasi Visual Kegiatan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola arsip album foto kegiatan kedinasan, kunjungan 4 kabupaten, dan inovasi riset daerah.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Foto Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul dokumentasi atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#0f3d5c]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Kategori:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0f3d5c]"
          >
            <option value="Semua">Semua Kategori ({gallery.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Tidak ditemukan foto dokumentasi dengan filter saat ini.
          </div>
        ) : (
          filteredGallery.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col group transition"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
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
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0f3d5c]/90 text-white backdrop-blur-xs">
                  {item.category}
                </span>
                {item.imageUrl.startsWith('/uploads/') && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1">
                    <HardDrive className="w-2.5 h-2.5" />
                    <span>Hostinger</span>
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0f3d5c]" />
                <span>{editingItem ? 'Edit Dokumentasi Foto' : 'Unggah Dokumentasi Foto Baru'}</span>
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Dokumentasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kunjungan Kerja Kepala Bapperida ke Kawasan Sentra Pertanian Semangga"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Kegiatan (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Distrik Semangga, Kabupaten Merauke"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Foto Dokumentasi Kegiatan *</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <div className="relative group shrink-0">
                          <img 
                            src={imageUrl} 
                            alt="Preview Foto" 
                            className="w-16 h-16 rounded-lg object-cover border border-slate-300 shadow-xs" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-200 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {imageUrl ? 'Foto Dokumentasi Siap Ditampilkan' : 'Belum Ada Foto Terpilih'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Mendukung format JPG, PNG, atau WebP resolusi tinggi.
                        </p>
                        {imageUrl && imageUrl.startsWith('/uploads/') && (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            <span>Tersimpan di server</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <label className="px-3.5 py-2 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                      {isUploadingImage ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{imageUrl ? 'Ganti Foto Dokumentasi' : 'Pilih & Unggah Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Deskripsi Foto</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi kegiatan atau hal menarik pada foto dokumentasi..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-lg font-bold"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Unggah Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
