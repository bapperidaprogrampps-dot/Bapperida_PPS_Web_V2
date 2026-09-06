import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  X, 
  Filter, 
  AlertCircle,
  UploadCloud,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { PlanningDocument, DocumentCategory } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';

interface AdminDocumentsTabProps {
  documents: PlanningDocument[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const CATEGORIES: DocumentCategory[] = [
  'RPJPD',
  'RPJMD',
  'RKPD',
  'Renstra',
  'Renja',
  'KUA-PPAS',
  'LKPJ',
  'Kajian Riset & Inovasi'
];

export function AdminDocumentsTab({ documents, onDataChanged, showToast }: AdminDocumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<PlanningDocument | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('RKPD');
  const [year, setYear] = useState('2026');
  const [regency, setRegency] = useState<'Provinsi' | 'Merauke' | 'Boven Digoel' | 'Mappi' | 'Asmat'>('Provinsi');
  const [legalBasis, setLegalBasis] = useState('');
  const [fileSize, setFileSize] = useState('8.5 MB');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [description, setDescription] = useState('');

  // Hostinger upload states
  const [fileUrl, setFileUrl] = useState('');
  const [storageProvider, setStorageProvider] = useState<'hostinger-server' | 'hostinger-php' | 'external' | 'local'>('hostinger-server');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [coverImage, setCoverImage] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const openAddModal = () => {
    setEditingDoc(null);
    setTitle('');
    setCategory('RKPD');
    setYear('2026');
    setRegency('Provinsi');
    setLegalBasis('Peraturan Gubernur Papua Selatan No. 12 Tahun 2025');
    setFileSize('12.4 MB');
    setFileFormat('PDF');
    setDescription('');
    setFileUrl('');
    setCoverImage('');
    setStorageProvider('hostinger-server');
    setUploadedFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (doc: PlanningDocument) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setCategory(doc.category);
    setYear(doc.year);
    setRegency(doc.regency || 'Provinsi');
    setLegalBasis(doc.legalBasis);
    setFileSize(doc.fileSize);
    setFileFormat(doc.fileFormat || 'PDF');
    setDescription(doc.description);
    setFileUrl(doc.fileUrl || '');
    setCoverImage(doc.coverImage || '');
    setStorageProvider(doc.storageProvider || 'hostinger-server');
    setUploadedFileName(doc.fileUrl ? doc.fileUrl.split('/').pop() || '' : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await UploadService.uploadFileToServer(file, 'documents');
      setFileUrl(res.url);
      setFileSize(res.sizeFormatted);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileFormat(ext);
      setUploadedFileName(file.name);
      setStorageProvider(res.storage === 'hostinger-php' ? 'hostinger-php' : 'hostinger-server');
      showToast(`Berkas "${file.name}" berhasil diunggah ke server Hostinger!`);
    } catch (err: any) {
      alert(`Gagal mengunggah berkas ke server: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      setCoverImage(res.url);
      showToast(`Cover berhasil diunggah! (${res.url})`);
    } catch (err: any) {
      alert(`Gagal mengunggah cover: ${err.message}`);
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !legalBasis.trim()) {
      alert('Mohon lengkapi judul, dasar hukum, dan deskripsi ringkas dokumen.');
      return;
    }

    if (editingDoc) {
      // Update
      StorageService.updateDocument({
        ...editingDoc,
        title,
        category,
        year,
        regency,
        legalBasis,
        fileSize,
        fileFormat,
        description,
        fileUrl: fileUrl || editingDoc.fileUrl,
        coverImage: coverImage || editingDoc.coverImage,
        storageProvider
      });
      showToast(`Dokumen "${title}" berhasil diperbarui.`);
    } else {
      // Add
      StorageService.addDocument({
        title,
        category,
        year,
        regency,
        legalBasis,
        fileSize,
        fileFormat,
        description,
        fileUrl: fileUrl || undefined,
        coverImage: coverImage || undefined,
        storageProvider
      });
      showToast(`Dokumen baru "${title}" berhasil ditambahkan.`);
    }

    onDataChanged();
    closeModal();
  };

  const handleDelete = (id: string, docTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${docTitle}"?`)) {
      StorageService.deleteDocument(id);
      showToast(`Dokumen "${docTitle}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = filterCategory === 'Semua' || doc.category === filterCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.year.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Dokumen Perencanaan Pembangunan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambah dokumen baru, perbarui data berkas, nomor regulasi, dan atur ketersediaan publik.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul atau tahun dokumen..."
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
            <option value="Semua">Semua Kategori ({documents.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Judul Dokumen & Dasar Hukum</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-center">Tahun</th>
                <th className="py-3.5 px-4 text-center">Cakupan</th>
                <th className="py-3.5 px-4 text-center">Ukuran / Format</th>
                <th className="py-3.5 px-4 text-center">Unduhan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan dokumen dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{doc.title}</div>
                      <div className="text-[11px] text-amber-700 font-medium mt-0.5">{doc.legalBasis}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{doc.description}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0f3d5c]/10 text-[#0f3d5c] border border-[#0f3d5c]/20">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold text-slate-800">
                      {doc.year}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {doc.regency || 'Provinsi'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="text-slate-500 font-mono text-[11px]">
                        {doc.fileSize} ({doc.fileFormat || 'PDF'})
                      </div>
                      {doc.fileUrl ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 hover:underline"
                          title={`Tersimpan di Hostinger: ${doc.fileUrl}`}
                        >
                          <HardDrive className="w-2.5 h-2.5" />
                          <span>Hostinger</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 block mt-0.5">Arsip Teks</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold">
                        <Download className="w-3 h-3 text-slate-400" />
                        <span>{doc.downloadCount || 0}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(doc)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Dokumen"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Dokumen"
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
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0f3d5c]" />
                <span>{editingDoc ? 'Edit Dokumen Perencanaan' : 'Unggah Dokumen Perencanaan Baru'}</span>
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
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Dokumen Perencanaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rencana Kerja Pemerintah Daerah (RKPD) Provinsi Papua Selatan Tahun 2026"
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
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Rencana *</label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cakupan Wilayah</label>
                  <select
                    value={regency}
                    onChange={(e) => setRegency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    <option value="Provinsi">Provinsi Papua Selatan</option>
                    <option value="Merauke">Kabupaten Merauke</option>
                    <option value="Boven Digoel">Kabupaten Boven Digoel</option>
                    <option value="Mappi">Kabupaten Mappi</option>
                    <option value="Asmat">Kabupaten Asmat</option>
                  </select>
                </div>
              </div>

              {/* Hostinger Server File Upload */}
              <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-[#0f3d5c]" />
                      <span>Unggah Berkas Fisik ke Server Hostinger (PDF / DOCX / ZIP)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Berkas akan disimpan langsung di folder <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200">/uploads/documents/</code> server Hostinger.
                    </span>
                  </div>

                  <label className="px-3.5 py-1.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto">
                    <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploading ? 'Mengunggah...' : 'Pilih Berkas Server'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {fileUrl ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 text-xs text-emerald-900">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold">{uploadedFileName || 'Berkas Dokumen'}</span>
                        <span className="text-[10px] text-emerald-700 font-mono ml-2">({fileUrl})</span>
                      </div>
                    </div>
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#0f3d5c] hover:underline font-bold shrink-0 flex items-center gap-1 text-[11px]"
                    >
                      <span>Buka File</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    Belum ada berkas fisik yang diunggah. Warga akan mengunduh ikhtisar resmi jika berkas belum diunggah.
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Unggah Cover Dokumen (Tampilan Perpustakaan)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Mendukung format JPG/PNG. Digunakan sebagai cover buku di halaman Repositori.
                    </span>
                  </div>

                  <label className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto">
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{isUploadingCover ? 'Mengunggah...' : 'Pilih Gambar Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="text"
                    placeholder="Atau masukkan URL gambar cover secara manual..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Dasar Hukum Penetapan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Peraturan Gubernur Papua Selatan No. 12 Tahun 2025"
                    value={legalBasis}
                    onChange={(e) => setLegalBasis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ukuran & Format File</label>
                  <input
                    type="text"
                    placeholder="12.5 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi / Ringkasan Eksekutif Dokumen *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan ringkasan arah kebijakan, sasaran makro pembangunan, atau pokok-pokok prioritas dalam dokumen ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {editingDoc ? 'Simpan Perubahan Dokumen' : 'Publikasikan Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
