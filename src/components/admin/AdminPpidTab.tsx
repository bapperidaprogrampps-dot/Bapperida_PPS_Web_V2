import React, { useState } from 'react';
import { 
  FileQuestion, 
  Search, 
  CheckCircle2, 
  X, 
  Clock, 
  Trash2, 
  Send, 
  Building, 
  User, 
  Mail, 
  Phone 
} from 'lucide-react';
import { InformationRequest } from '../../types';
import { StorageService } from '../../services/storage';

interface AdminPpidTabProps {
  infoRequests: InformationRequest[];
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

const STATUS_LIST = ['Diterima', 'Diproses PPID', 'Tersedia', 'Ditolak'] as const;

export function AdminPpidTab({ infoRequests, onDataChanged, showToast }: AdminPpidTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Selected request
  const [selectedReq, setSelectedReq] = useState<InformationRequest | null>(
    infoRequests.length > 0 ? infoRequests[0] : null
  );

  // Status & Note state
  const [statusVal, setStatusVal] = useState<InformationRequest['status']>('Diproses PPID');
  const [noteVal, setNoteVal] = useState('');

  const handleSelectReq = (req: InformationRequest) => {
    setSelectedReq(req);
    setStatusVal(req.status);
    setNoteVal(req.responseNote || '');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    StorageService.updateInfoRequestStatus(selectedReq.id, statusVal, noteVal);
    showToast(`Status permohonan informasi ${selectedReq.requestNo} berhasil diupdate.`);
    onDataChanged();

    setSelectedReq({
      ...selectedReq,
      status: statusVal,
      responseNote: noteVal
    });
  };

  const handleDelete = (id: string, reqNo: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus permohonan ${reqNo}?`)) {
      StorageService.deleteInfoRequest(id);
      showToast(`Permohonan ${reqNo} berhasil dihapus.`);
      if (selectedReq?.id === id) {
        setSelectedReq(null);
      }
      onDataChanged();
    }
  };

  const filteredReqs = infoRequests.filter(req => {
    const matchesStatus = filterStatus === 'Semua' || req.status === filterStatus;
    const matchesSearch = req.requestNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.informationDetails.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-[#0f3d5c]" />
            <span>Manajemen Permohonan Informasi Publik (PPID)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola permohonan data dan dokumen perencanaan sesuai amanat UU No. 14 Tahun 2008 tentang KIP.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total Permohonan</div>
          <div className="text-lg font-black text-slate-900">{infoRequests.length}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor register, nama, institusi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-[#0f3d5c]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0f3d5c]"
          >
            <option value="Semua">Semua Status ({infoRequests.length})</option>
            {STATUS_LIST.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredReqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Belum ada permohonan informasi publik masuk.
            </div>
          ) : (
            filteredReqs.map((req) => {
              const isSelected = selectedReq?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectReq(req)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-slate-50 border-[#0f3d5c] ring-2 ring-[#0f3d5c]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0f3d5c] text-[11px]">
                      {req.requestNo}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'Tersedia'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'Ditolak'
                        ? 'bg-rose-100 text-rose-800'
                        : req.status === 'Diproses PPID'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900">{req.applicantName}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{req.informationDetails}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{req.institution || 'Perorangan'}</span>
                    <span>{req.createdAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Details & Action */}
        <div className="lg:col-span-7">
          {selectedReq ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="font-mono font-bold text-sm text-[#0f3d5c]">
                    {selectedReq.requestNo}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tanggal Registrasi: {selectedReq.createdAt}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedReq.id, selectedReq.requestNo)}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold p-1 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Permohonan</span>
                </button>
              </div>

              {/* Pemohon Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama Pemohon:</span>
                  <span className="font-bold text-slate-800">{selectedReq.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Institusi / Afiliasi:</span>
                  <span className="font-bold text-slate-800">{selectedReq.institution || 'Individu'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Format Berkas:</span>
                  <span className="font-bold text-slate-800">{selectedReq.format}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email:</span>
                  <span className="font-mono text-slate-800">{selectedReq.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor Kontak:</span>
                  <span className="font-mono text-slate-800">{selectedReq.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tujuan Penggunaan:</span>
                  <span className="text-slate-800">{selectedReq.purpose}</span>
                </div>
              </div>

              {/* Rincian Informasi */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rincian Informasi / Dokumen yang Dimohonkan:
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedReq.informationDetails}
                </div>
              </div>

              {/* Action Update Form */}
              <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">Respon Petugas PPID Bapperida</h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perbarui Status Permohonan</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:border-[#0f3d5c]"
                  >
                    {STATUS_LIST.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catatan Tanggapan / Ketersediaan Dokumen
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan nomor surat balasan PPID, tautan unduh dokumen, atau alasan bila informasi dikecualikan..."
                    value={noteVal}
                    onChange={(e) => setNoteVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl font-bold flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Simpan Perubahan PPID</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Pilih permohonan informasi di sebelah kiri untuk melihat rincian dan memperbarui statusnya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
