import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Filter, 
  Award, 
  UploadCloud, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Sparkles,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { EmployeeProfile, EmployeePositionCategory } from '../../types';
import { StorageService } from '../../services/storage';
import { UploadService } from '../../services/uploadService';
import { PersonSilhouette } from '../PersonSilhouette';

interface AdminEmployeesTabProps {
  employees: EmployeeProfile[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const POSITION_CATEGORIES: EmployeePositionCategory[] = [
  'Kepala Badan',
  'Sekretaris',
  'Kabid',
  'Kasubag',
  'Kasubid',
  'Staff'
];

export function AdminEmployeesTab({ employees, onDataChanged, showToast }: AdminEmployeesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [positionCategory, setPositionCategory] = useState<EmployeePositionCategory>('Staff');
  const [positionTitle, setPositionTitle] = useState('');
  const [rank, setRank] = useState('');
  const [department, setDepartment] = useState('Sekretariat');
  const [photoUrl, setPhotoUrl] = useState('');
  const [motto, setMotto] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setNip('');
    setPositionCategory('Staff');
    setPositionTitle('');
    setRank('');
    setDepartment('Sekretariat');
    setPhotoUrl('');
    setMotto('');
    setOrder(employees.length + 1);
    setEditingEmployee(null);
    setFormError(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeProfile) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setNip(emp.nip || '');
    setPositionCategory(emp.positionCategory);
    setPositionTitle(emp.positionTitle);
    setRank(emp.rank || '');
    setDepartment(emp.department || '');
    setPhotoUrl(emp.photoUrl || '');
    setMotto(emp.motto || '');
    setOrder(emp.order || 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const res = await UploadService.uploadFileToServer(file, 'images');
      if (res && res.url) {
        setPhotoUrl(res.url);
        showToast('Foto pegawai berhasil diunggah ke penyimpanan server.');
      }
    } catch (err: any) {
      showToast(`Gagal mengunggah foto ke server: ${err?.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Nama lengkap pegawai wajib diisi.');
      return;
    }

    if (!positionTitle.trim()) {
      setFormError('Nama jabatan spesifik wajib diisi.');
      return;
    }

    if (editingEmployee) {
      const updated: EmployeeProfile = {
        ...editingEmployee,
        name: name.trim(),
        nip: nip.trim() || undefined,
        positionCategory,
        positionTitle: positionTitle.trim(),
        rank: rank.trim() || undefined,
        department: department.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        motto: motto.trim() || undefined,
        order: Number(order) || 1
      };

      StorageService.updateEmployee(updated);
      showToast(`Profil pegawai "${updated.name}" berhasil diperbarui.`);
    } else {
      StorageService.addEmployee({
        name: name.trim(),
        nip: nip.trim() || undefined,
        positionCategory,
        positionTitle: positionTitle.trim(),
        rank: rank.trim() || undefined,
        department: department.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        motto: motto.trim() || undefined,
        order: Number(order) || 1
      });
      showToast(`Pegawai baru "${name.trim()}" berhasil ditambahkan ke daftar profil pegawai.`);
    }

    setIsModalOpen(false);
    resetForm();
    onDataChanged();
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    const target = employees.find(e => e.id === deletingId);
    StorageService.deleteEmployee(deletingId);
    showToast(`Data pegawai "${target?.name || ''}" berhasil dihapus.`);
    setDeletingId(null);
    onDataChanged();
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const matchCat = filterCategory === 'Semua' || emp.positionCategory === filterCategory;
    const matchQuery = searchTerm === '' || 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.nip && emp.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      emp.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchQuery;
  }).sort((a, b) => (a.order || 999) - (b.order || 999));

  // Category badge color helper
  const getCategoryBadge = (cat: EmployeePositionCategory) => {
    switch (cat) {
      case 'Kepala Badan':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Sekretaris':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Kabid':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Kasubag':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Kasubid':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Staff':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-[#0f3d5c]" />
            <span>Manajemen Sumber Daya Aparatur &bull; Bapperida PPS</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Editor Profil Pegawai Bapperida
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil pegawai yang diklasifikasikan berdasarkan jabatan: Kepala Badan, Sekretaris, Kasubag, Kasubid, dan Staff.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Profil Pegawai</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {POSITION_CATEGORIES.map(cat => {
          const count = employees.filter(e => e.positionCategory === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat === filterCategory ? 'Semua' : cat)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0f3d5c] text-white border-[#0f3d5c] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  filterCategory === cat ? 'text-amber-300' : 'text-slate-500'
                }`}>
                  {cat}
                </span>
                <span className={`text-base font-black ${
                  filterCategory === cat ? 'text-white' : 'text-slate-900'
                }`}>
                  {count}
                </span>
              </div>
              <p className={`text-[11px] mt-1 truncate ${
                filterCategory === cat ? 'text-slate-200' : 'text-slate-500'
              }`}>
                {cat === 'Staff' ? 'Pegawai Pelaksana' : `Pejabat ${cat}`}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NIP, jabatan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-400 text-xs font-semibold px-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterCategory('Semua')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer whitespace-nowrap ${
              filterCategory === 'Semua'
                ? 'bg-[#0f3d5c] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua ({employees.length})
          </button>
          {POSITION_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-[#0f3d5c] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat} ({employees.filter(e => e.positionCategory === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Employee List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => (
          <div
            key={emp.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
          >
            <div className="space-y-3">
              {/* Top row: category badge & order */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadge(emp.positionCategory)}`}>
                  {emp.positionCategory}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Urutan: #{emp.order || 1}
                </span>
              </div>

              {/* Photo & Identity */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-end justify-center">
                  {emp.photoUrl ? (
                    <img
                      src={emp.photoUrl}
                      alt={emp.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <PersonSilhouette size="sm" className="w-12 h-14 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {emp.name}
                  </h3>
                  <p className="text-xs font-medium text-[#0f3d5c] mt-0.5">
                    {emp.positionTitle}
                  </p>
                  {emp.nip && (
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      NIP. {emp.nip}
                    </p>
                  )}
                </div>
              </div>

              {/* Rank & Department */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                {emp.rank && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pangkat/Gol:</span>
                    <span className="font-semibold text-slate-800">{emp.rank}</span>
                  </div>
                )}
                {emp.department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Kerja:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={emp.department}>
                      {emp.department}
                    </span>
                  </div>
                )}
              </div>

              {/* Motto / Pesan Kerja */}
              {emp.motto && (
                <p className="text-[11px] text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 leading-relaxed">
                  &ldquo;{emp.motto}&rdquo;
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(emp)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(emp.id)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Tidak ada data pegawai yang sesuai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || filterCategory !== 'Semua'
              ? 'Coba ganti kata kunci pencarian atau bersihkan filter kategori jabatan.'
              : 'Belum ada data profil pegawai tersimpan. Silakan klik tombol "Tambah Profil Pegawai".'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f3d5c] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pegawai Pertama</span>
          </button>
        </div>
      )}

      {/* Modal Form Tambah / Edit Pegawai */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-5 animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0f3d5c]/10 text-[#0f3d5c] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingEmployee ? 'Edit Profil Pegawai' : 'Tambah Profil Pegawai Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi rincian data pejabat / staf Bapperida Provinsi Papua Selatan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Nama & NIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ulmi Listianingsih, S.Sos., M.M."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 19740512 199903 2 004"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              {/* Row 2: Klasifikasi Jabatan (Dropdown Utama) & Nama Jabatan Spesifik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Klasifikasi Jabatan *
                  </label>
                  <select
                    value={positionCategory}
                    onChange={(e) => setPositionCategory(e.target.value as EmployeePositionCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-[#0f3d5c]"
                  >
                    <option value="Kepala Badan">Kepala Badan</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Kabid">Kabid (Kepala Bidang)</option>
                    <option value="Kasubag">Kasubag (Kepala Sub Bagian)</option>
                    <option value="Kasubid">Kasubid (Kepala Sub Bidang)</option>
                    <option value="Staff">Staff (Pegawai Pelaksana)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Jabatan Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    placeholder="Contoh: Kasubag Umum & Kepegawaian"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              {/* Row 3: Pangkat/Golongan & Unit Kerja */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pangkat / Golongan Ruang
                  </label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Contoh: Penata Tingkat I (III/d)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit Kerja / Bidang
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Contoh: Bidang Riset & Inovasi Daerah (BRIDA)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              {/* Row 4: Foto Pegawai (Upload Langsung) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Foto Resmi Pegawai
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-xs flex items-end justify-center">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Preview Foto"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <PersonSilhouette size="sm" className="w-14 h-16 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-xs">
                        {isUploadingPhoto ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{photoUrl ? 'Ganti Foto Pegawai' : 'Pilih & Unggah Foto Pegawai'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="hidden"
                        />
                      </label>

                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {photoUrl 
                        ? 'Foto pegawai aktif dan siap ditampilkan pada struktur bagan profil pegawai.'
                        : 'Format JPG, PNG, atau WEBP. Berkas foto akan langsung diunggah dari perangkat Anda.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 5: Motto Kerja & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Motto / Pesan Kerja
                  </label>
                  <input
                    type="text"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="Contoh: Bekerja presisi demi kemajuan Tanah Anim Ha."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{editingEmployee ? 'Simpan Perubahan' : 'Tambahkan Pegawai'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                Hapus Data Pegawai?
              </h3>
              <p className="text-xs text-slate-500">
                Profil pegawai yang dipilih akan dihapus secara permanen dari daftar profil pegawai.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
