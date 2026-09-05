import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Tag 
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminComplaintsTabProps {
  complaints: Complaint[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const STATUS_LIST: ComplaintStatus[] = [
  'Menunggu Verifikasi',
  'Sedang Diproses',
  'Ditindaklanjuti',
  'Selesai'
];

export function AdminComplaintsTab({ complaints, onDataChanged, showToast }: AdminComplaintsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterRegency, setFilterRegency] = useState<string>('Semua');

  // Selected complaint for review/response
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints.length > 0 ? complaints[0] : null
  );

  // Response form state
  const [statusValue, setStatusValue] = useState<ComplaintStatus>('Sedang Diproses');
  const [responseText, setResponseText] = useState('');
  const [responderName, setResponderName] = useState('Tim Penanganan Pengaduan Bapperida Provinsi Papua Selatan');

  const handleSelectComplaint = (comp: Complaint) => {
    setSelectedComplaint(comp);
    setStatusValue(comp.status);
    setResponseText(comp.response || '');
    setResponderName(comp.responderName || 'Tim Penanganan Pengaduan Bapperida Provinsi Papua Selatan');
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    if (!responseText.trim()) {
      alert('Mohon tuliskan tanggapan atau catatan tindak lanjut resmi.');
      return;
    }

    StorageService.updateComplaintStatus(
      selectedComplaint.id,
      statusValue,
      responseText,
      responderName
    );

    showToast(`Tanggapan resmi untuk tiket ${selectedComplaint.ticketNo} berhasil disimpan.`);
    onDataChanged();

    // Update selected local reference
    setSelectedComplaint({
      ...selectedComplaint,
      status: statusValue,
      response: responseText,
      responderName
    });
  };

  const handleDelete = (id: string, ticketNo: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tiket pengaduan ${ticketNo}?`)) {
      StorageService.deleteComplaint(id);
      showToast(`Tiket ${ticketNo} berhasil dihapus.`);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(null);
      }
      onDataChanged();
    }
  };

  const filteredComplaints = complaints.filter(comp => {
    const matchesStatus = filterStatus === 'Semua' || comp.status === filterStatus;
    const matchesRegency = filterRegency === 'Semua' || comp.regency === filterRegency;
    const matchesSearch = comp.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesRegency && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Pengaduan & Aspirasi Warga Anim Ha</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi laporan masyarakat, berikan klarifikasi dinas, dan koordinasikan tindak lanjut lintas bidang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Tiket</div>
            <div className="text-lg font-black text-slate-900">{complaints.length}</div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-right">
            <div className="text-xs text-amber-600 font-medium">Perlu Respon</div>
            <div className="text-lg font-black text-amber-600">
              {complaints.filter(c => c.status !== 'Selesai').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor tiket, nama pelapor, isi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#0f3d5c]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0f3d5c]"
            >
              <option value="Semua">Semua Status</option>
              {STATUS_LIST.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Kabupaten:</span>
            <select
              value={filterRegency}
              onChange={(e) => setFilterRegency(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0f3d5c]"
            >
              <option value="Semua">Semua Wilayah</option>
              <option value="Merauke">Merauke</option>
              <option value="Boven Digoel">Boven Digoel</option>
              <option value="Mappi">Mappi</option>
              <option value="Asmat">Asmat</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Ticket List (Left) & Ticket Response Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Complaint Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Tidak ada tiket pengaduan yang sesuai kriteria.
            </div>
          ) : (
            filteredComplaints.map((comp) => {
              const isSelected = selectedComplaint?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => handleSelectComplaint(comp)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-slate-50 border-[#0f3d5c] ring-2 ring-[#0f3d5c]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0f3d5c] text-[11px]">
                      {comp.ticketNo}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      comp.status === 'Selesai' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'Sedang Diproses'
                        ? 'bg-blue-100 text-blue-800'
                        : comp.status === 'Ditindaklanjuti'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 line-clamp-1">{comp.subject}</h4>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">{comp.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{comp.name} &bull; {comp.regency}</span>
                    <span>{comp.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detail & Response Form */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-xs">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#0f3d5c]">
                      {selectedComplaint.ticketNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedComplaint.subject}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(selectedComplaint.id, selectedComplaint.ticketNo)}
                  className="self-start text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold p-1 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Tiket</span>
                </button>
              </div>

              {/* Citizen Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama Pelapor:</span>
                  <span className="font-bold text-slate-800">{selectedComplaint.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Wilayah Kabupaten:</span>
                  <span className="font-bold text-slate-800">{selectedComplaint.regency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kontak WhatsApp / Telp:</span>
                  <span className="font-mono text-slate-800">{selectedComplaint.phone || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Waktu Laporan:</span>
                  <span className="text-slate-800">{selectedComplaint.createdAt}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Uraian Aspirasi / Pengaduan Masyarakat:
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Official Response Form */}
              <form onSubmit={handleSaveResponse} className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0f3d5c]" />
                  <h4 className="font-bold text-slate-900 text-sm">Formulir Tanggapan Resmi Bapperida</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Update Status Tiket</label>
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value as ComplaintStatus)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:border-[#0f3d5c]"
                    >
                      {STATUS_LIST.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Petugas / Tim Penanggap</label>
                    <input
                      type="text"
                      required
                      value={responderName}
                      onChange={(e) => setResponderName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggapan Resmi / Klarifikasi Kebijakan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan jawaban resmi, status penganggaran dalam RKPD, langkah koordinasi teknis, atau estimasi penyelesaian..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tanggapan ini akan langsung terlihat oleh masyarakat saat mengecek status tiket pengaduan di portal publik.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl font-bold flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim & Simpan Tanggapan Resmi</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Pilih salah satu tiket pengaduan di sebelah kiri untuk melihat detail dan memberikan tanggapan resmi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
