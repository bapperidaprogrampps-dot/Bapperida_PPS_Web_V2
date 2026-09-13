import React, { useState } from 'react';
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  Filter, 
  Globe, 
  FileEdit,
  Tag,
  UploadCloud,
  HardDrive
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';

interface AdminNewsTabProps {
  news: NewsArticle[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const CATEGORIES = [
  'Pembangunan',
  'Riset & Inovasi',
  'Musrenbang',
  'Pemerintahan',
  'Pengumuman'
];

export function AdminNewsTab({ news, onDataChanged, showToast }: AdminNewsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Pembangunan' | 'Riset & Inovasi' | 'Musrenbang' | 'Pemerintahan' | 'Pengumuman'>('Pembangunan');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Humas Bapperida Papua Selatan');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsInput, setTagsInput] = useState('Pembangunan, Papua Selatan, Anim Ha');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      setImageUrl(res.url);
      showToast(`Gambar artikel berhasil diunggah ke server Hostinger! (${res.url})`);
    } catch (err: any) {
      alert(`Gagal mengunggah gambar ke server: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const openAddModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Pembangunan');
    setSummary('');
    setContent('');
    setAuthor('Humas Bapperida Papua Selatan');
    setImageUrl('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80');
    setStatus('published');
    setTagsInput('Pembangunan, Papua Selatan, Anim Ha');
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setCategory(article.category);
    setSummary(article.summary);
    setContent(article.content);
    setAuthor(article.author);
    setImageUrl(article.imageUrl);
    setStatus(article.status || 'published');
    setTagsInput((article.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      alert('Mohon lengkapi judul berita, ringkasan, dan isi konten berita.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingArticle) {
      StorageService.updateArticle({
        ...editingArticle,
        title,
        category,
        summary,
        content,
        author,
        imageUrl,
        status,
        tags
      });
      showToast(`Artikel "${title}" berhasil diperbarui.`);
    } else {
      const now = new Date();
      const publishedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      StorageService.addArticle({
        title,
        slug,
        category,
        summary,
        content,
        author,
        publishedAt,
        imageUrl,
        status,
        tags
      });
      showToast(`Berita baru "${title}" berhasil dirilis.`);
    }

    onDataChanged();
    closeModal();
  };

  const handleDelete = (id: string, artTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel "${artTitle}"?`)) {
      StorageService.deleteArticle(id);
      showToast(`Artikel "${artTitle}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const filteredNews = news.filter(art => {
    const matchesCategory = filterCategory === 'Semua' || art.category === filterCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Berita & Publikasi Resmi Bapperida</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan siaran pers, liputan kegiatan Musrenbang, pengumuman, dan artikel riset daerah.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Berita Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul berita atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#0f3d5c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium shrink-0">Kategori:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0f3d5c]"
          >
            <option value="Semua">Semua Kategori ({news.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Artikel Berita</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Tanggal Terbit</th>
                <th className="py-3.5 px-4 text-center">Tayangan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan artikel dengan pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredNews.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        {art.imageUrl ? (
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-14 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                            <Newspaper className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Penulis: {art.author}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{art.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0f3d5c]/10 text-[#0f3d5c] border border-[#0f3d5c]/20">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {art.status === 'published' ? <Globe className="w-3 h-3 text-emerald-600" /> : <FileEdit className="w-3 h-3" />}
                        <span>{art.status === 'published' ? 'Terbit' : 'Draf'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-medium text-slate-600">
                      {art.publishedAt}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{art.views || 0}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Berita"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#0f3d5c]" />
                <span>{editingArticle ? 'Edit Artikel Berita' : 'Buat Artikel Berita Baru'}</span>
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
                <label className="block font-bold text-slate-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bapperida Papua Selatan Matangkan Peta Jalan Hilirisasi Komoditas Sagu dan Perikanan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Penulis / Sumber *</label>
                  <input
                    type="text"
                    required
                    placeholder="Humas Bapperida Papua Selatan"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    <option value="published">Langsung Terbit (Published)</option>
                    <option value="draft">Simpan Draf (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Foto Sampul / Gambar Berita *</label>
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
                          {imageUrl ? 'Foto Sampul Siap Ditampilkan' : 'Belum Ada Foto Terpilih'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Format JPG, PNG, atau WebP. Unggah langsung dari perangkat Anda.
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
                      <span>{imageUrl ? 'Ganti Foto Berita' : 'Pilih & Unggah Foto'}</span>
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
                <label className="block font-bold text-slate-700 mb-1">Tags / Kata Kunci (Pisahkan dengan koma)</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Musrenbang, RPJPD 2025-2045, Merauke, BRIDA"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Berita (Lead Paragraph) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan singkat 1-2 kalimat untuk preview di kartu berita..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Lengkap Konten Berita *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan berita lengkap, kutipan narasumber, kronologi acara, dan hasil kesepakatan..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  {editingArticle ? 'Simpan Perubahan' : 'Rilis Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
