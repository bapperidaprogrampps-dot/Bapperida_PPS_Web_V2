import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Clock, 
  MapPin, 
  X, 
  CheckCircle2, 
  Building 
} from 'lucide-react';
import { AgendaEvent } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminAgendaTabProps {
  agendas: AgendaEvent[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const CATEGORIES = ['Musrenbang', 'Rakor', 'Bimtek', 'Seminar & Riset', 'Pemerintahan'] as const;

export function AdminAgendaTab({ agendas, onDataChanged, showToast }: AdminAgendaTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaEvent | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('09.00 - 15.00 WIT');
  const [location, setLocation] = useState('Aula Kantor Gubernur Papua Selatan, Salor, Merauke');
  const [organizer, setOrganizer] = useState('Bapperida Provinsi Papua Selatan');
  const [category, setCategory] = useState<'Musrenbang' | 'Rakor' | 'Bimtek' | 'Seminar & Riset' | 'Pemerintahan'>('Musrenbang');
  const [status, setStatus] = useState<'Akan Datang' | 'Sedang Berlangsung' | 'Selesai'>('Akan Datang');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingAgenda(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09.00 - 15.00 WIT');
    setLocation('Aula Bapperida Provinsi Papua Selatan, Salor, Merauke');
    setOrganizer('Bapperida Provinsi Papua Selatan');
    setCategory('Musrenbang');
    setStatus('Akan Datang');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (ag: AgendaEvent) => {
    setEditingAgenda(ag);
    setTitle(ag.title);
    setDate(ag.date);
    setTime(ag.time);
    setLocation(ag.location);
    setOrganizer(ag.organizer);
    setCategory(ag.category);
    setStatus(ag.status);
    setDescription(ag.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAgenda(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) {
      alert('Mohon lengkapi judul kegiatan, tanggal, dan lokasi acara.');
      return;
    }

    if (editingAgenda) {
      StorageService.updateAgenda({
        ...editingAgenda,
        title,
        date,
        time,
        location,
        organizer,
        category,
        status,
        description: description || `Kegiatan ${title} yang diselenggarakan oleh ${organizer}.`
      });
      showToast(`Agenda "${title}" berhasil diperbarui.`);
    } else {
      StorageService.addAgenda({
        title,
        date,
        time,
        location,
        organizer,
        category,
        status,
        description: description || `Kegiatan ${title} yang diselenggarakan oleh ${organizer}.`
      });
      showToast(`Agenda baru "${title}" berhasil ditambahkan.`);
    }

    onDataChanged();
    closeModal();
  };

  const handleDelete = (id: string, agTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus agenda "${agTitle}"?`)) {
      StorageService.deleteAgenda(id);
      showToast(`Agenda "${agTitle}" berhasil dihapus.`);
      onDataChanged();
    }
  };

  const filteredAgendas = agendas.filter(ag => {
    const matchesCategory = filterCategory === 'Semua' || ag.category === filterCategory;
    const matchesSearch = ag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Agenda & Jadwal Kegiatan Kedinasan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwalkan rapat koordinasi, musrenbang provinsi, bimtek OPD, dan seminar kajian riset daerah.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari agenda atau lokasi..."
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
            <option value="Semua">Semua Kategori ({agendas.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Agendas List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Nama Kegiatan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Waktu & Tanggal</th>
                <th className="py-3.5 px-4">Lokasi & Penyelenggara</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAgendas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ditemukan agenda dengan pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredAgendas.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900">{ag.title}</div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{ag.description}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0f3d5c]/10 text-[#0f3d5c] border border-[#0f3d5c]/20">
                        {ag.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{ag.date}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{ag.time}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-800 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{ag.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ag.organizer}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ag.status === 'Akan Datang' 
                          ? 'bg-blue-100 text-blue-800' 
                          : ag.status === 'Sedang Berlangsung'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ag.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(ag)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Agenda"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ag.id, ag.title)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Agenda"
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
                <Calendar className="w-5 h-5 text-[#0f3d5c]" />
                <span>{editingAgenda ? 'Edit Jadwal Agenda' : 'Tambah Jadwal Agenda Baru'}</span>
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
                <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Musrenbang RKPD Provinsi Papua Selatan Tahun 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Kegiatan *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Status Penyelenggaraan</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pelaksanaan *</label>
                  <input
                    type="text"
                    required
                    placeholder="09.00 - 15.00 WIT"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Tempat Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Aula Kantor Gubernur Papua Selatan, Salor, Merauke"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penyelenggara / Penanggung Jawab *</label>
                <input
                  type="text"
                  required
                  placeholder="Bapperida Provinsi Papua Selatan"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi / Catatan Acara</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan tambahan mengenai agenda rapat, peserta yang diundang, atau instruksi pakaian dinas..."
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
                  {editingAgenda ? 'Simpan Perubahan' : 'Jadwalkan Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
