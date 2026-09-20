import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  UploadCloud, 
  ArrowUpRight,
  Eye,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { PortalLink } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';
import { initialPortalLinks } from '../../data/mockData';

interface AdminPortalLinksTabProps {
  portalLinks: PortalLink[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const PRESET_COVERS = [
  { label: 'Satu Data / Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pemerintahan / Birokrasi', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pelayanan Publik & Diskusi', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Keterbukaan Informasi PPID', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Perencanaan & Statistik', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Riset & Sains Terapan', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Teknologi & Infrastruktur', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' }
];

export function AdminPortalLinksTab({ portalLinks, onDataChanged, showToast }: AdminPortalLinksTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortalLink | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [badge, setBadge] = useState('');
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      setCoverImage(res.url);
      showToast(`Cover image berhasil diunggah! (${res.filename})`);
    } catch (err: any) {
      alert(`Gagal mengunggah cover image: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setUrl('');
    setDescription('');
    setCoverImage(PRESET_COVERS[0].url);
    setBadge('Portal Web');
    setCategory('Pemerintahan');
    setOrder(portalLinks.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortalLink) => {
    setEditingItem(item);
    setTitle(item.title);
    setUrl(item.url);
    setDescription(item.description);
    setCoverImage(item.coverImage);
    setBadge(item.badge || 'Portal Web');
    setCategory(item.category || 'Pemerintahan');
    setOrder(item.order || 1);
    setIsActive(item.isActive !== false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      alert('Mohon isi Judul Portal dan URL Website tujuan.');
      return;
    }

    // Format URL jika belum berawalan http/https
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalCover = coverImage.trim() || PRESET_COVERS[0].url;

    if (editingItem) {
      StorageService.updatePortalLink({
        ...editingItem,
        title: title.trim(),
        url: finalUrl,
        description: description.trim(),
        coverImage: finalCover,
        badge: badge.trim(),
        category: category.trim(),
        order: Number(order) || 1,
        isActive
      });
      showToast(`Tautan portal "${title}" berhasil diperbarui!`);
    } else {
      StorageService.addPortalLink({
        title: title.trim(),
        url: finalUrl,
        description: description.trim(),
        coverImage: finalCover,
        badge: badge.trim() || 'Portal Web',
        category: category.trim() || 'Pemerintahan',
        order: Number(order) || portalLinks.length + 1,
        isActive
      });
      showToast(`Tautan portal baru "${title}" berhasil ditambahkan!`);
    }

    closeModal();
    onDataChanged();
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Hapus tautan portal "${itemTitle}"? Tautan ini tidak akan muncul lagi di bawah berita.`)) {
      StorageService.deletePortalLink(id);
      showToast(`Tautan portal "${itemTitle}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const handleToggleStatus = (item: PortalLink) => {
    const updatedStatus = item.isActive === false ? true : false;
    StorageService.updatePortalLink({
      ...item,
      isActive: updatedStatus
    });
    showToast(`Status "${item.title}" diubah menjadi: ${updatedStatus ? 'Aktif (Tampil)' : 'Nonaktif (Disembunyikan)'}`);
    onDataChanged();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan daftar tautan portal website ke set bawaan resmi (6 portal default)?')) {
      StorageService.savePortalLinks(initialPortalLinks);
      showToast('Daftar tautan portal berhasil direset ke pengaturan bawaan!');
      onDataChanged();
    }
  };

  // Filter list
  const filteredLinks = portalLinks.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">
              Pengaturan Tautan Portal Website
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Kelola tautan portal website eksternal dan banner instansi yang ditampilkan tepat di bawah kanal berita pada Beranda dan Halaman Berita. Anda dapat mengunggah cover image, mengatur alamat URL, dan menentukan urutan tampil.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            title="Reset ke set bawaan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
            id="btn-tambah-portal-link"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Portal Web</span>
          </button>
        </div>
      </div>

      {/* Search & Info Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari portal web, judul, atau URL..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#0f3d5c] text-slate-800"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Portal: <span className="font-bold text-slate-800">{portalLinks.length}</span> ({portalLinks.filter(p => p.isActive !== false).length} Aktif)
        </div>
      </div>

      {/* Grid Daftar Portal Links */}
      {filteredLinks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada tautan portal website</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm ? 'Tidak ditemukan portal yang cocok dengan pencarian Anda.' : 'Belum ada portal link yang dibuat. Klik tombol Tambah Portal Web untuk menambahkan.'}
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Portal Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLinks.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-2xs ${
                item.isActive === false ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-[#0f3d5c]/50 hover:shadow-md'
              }`}
            >
              <div>
                {/* Thumbnail Cover Image */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={item.coverImage || PRESET_COVERS[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PRESET_COVERS[0].url;
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Status & Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f3d5c] text-white shadow-xs">
                      {item.badge || item.category || 'Portal'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/20 text-white backdrop-blur-xs">
                      Urutan: #{item.order || 1}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        item.isActive !== false
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                      title="Klik untuk mengubah status aktif/nonaktif"
                    >
                      {item.isActive !== false ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>

                  {/* Target URL */}
                  <div className="absolute bottom-2 left-3 right-3 truncate text-[11px] font-mono text-slate-200 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{item.url}</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description || 'Tidak ada deskripsi'}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  title="Buka Website"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Uji Tautan</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#0f3d5c] hover:bg-slate-100 transition cursor-pointer"
                    title="Edit Tautan Portal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    title="Hapus Tautan Portal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Portal Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <Globe className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base text-slate-800">
                  {editingItem ? 'Edit Tautan Portal Website' : 'Tambah Tautan Portal Website Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {/* Judul Portal */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Portal / Judul Website <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Portal Satu Data Papua Selatan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c] text-slate-800"
                  required
                />
              </div>

              {/* URL Website Tujuan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL Website Tujuan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://data.papuaselatan.go.id"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c] text-slate-800 font-mono"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Pastikan alamat URL lengkap termasuk https://
                </span>
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Keterangan Singkat
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Keterangan singkat fungsi atau layanan yang disediakan portal ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c] text-slate-800"
                />
              </div>

              {/* Cover Image Upload & Input */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">
                  Cover Image (Gambar Sampul Portal) <span className="text-rose-500">*</span>
                </label>

                {/* Preview Box */}
                {coverImage && (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PRESET_COVERS[0].url;
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                      Live Preview Cover
                    </span>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#0f3d5c] bg-teal-50/50 hover:bg-teal-50 text-[#0f3d5c] font-bold cursor-pointer transition">
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploadingImage ? 'Mengunggah ke server...' : 'Unggah File Gambar Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* URL Input alternatif */}
                <div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c] text-slate-700 font-mono text-[11px]"
                  />
                </div>

                {/* Pilihan Cover Preset Cepat */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Atau gunakan pilihan cover instansi bawaan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                          coverImage === preset.url
                            ? 'bg-[#0f3d5c] text-white border-[#0f3d5c]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Baris Kategori, Badge, dan Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Label / Badge
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Satu Data PPS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Pemerintahan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              {/* Status Tampil Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#0f3d5c] rounded-sm focus:ring-[#0f3d5c]"
                />
                <label htmlFor="isActiveToggle" className="font-semibold text-slate-700 cursor-pointer">
                  Tampilkan portal ini di bawah berita (Status Aktif)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  id="btn-simpan-portal-link"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambahkan Portal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
