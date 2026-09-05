import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  BarChart3, 
  Users, 
  Percent, 
  AlertCircle 
} from 'lucide-react';
import { IndicatorStat } from '../../types';
import { StorageService } from '../../services/storage';
import { regionalIndicatorStats } from '../../data/mockData';

interface AdminIndicatorsTabProps {
  onDataChanged: () => void;
  showToast: (msg: string) => void;
}

export function AdminIndicatorsTab({ onDataChanged, showToast }: AdminIndicatorsTabProps) {
  const [indicators, setIndicators] = useState<IndicatorStat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form states
  const [year, setYear] = useState('');
  const [growthRate, setGrowthRate] = useState<number>(5.0);
  const [ipm, setIpm] = useState<number>(62.0);
  const [povertyRate, setPovertyRate] = useState<number>(23.0);
  const [unemploymentRate, setUnemploymentRate] = useState<number>(3.5);

  useEffect(() => {
    setIndicators(StorageService.getIndicatorStats());
  }, []);

  const openAddModal = () => {
    setEditingIndex(null);
    setYear(new Date().getFullYear().toString());
    setGrowthRate(5.2);
    setIpm(62.8);
    setPovertyRate(23.0);
    setUnemploymentRate(3.6);
    setIsModalOpen(true);
  };

  const openEditModal = (item: IndicatorStat, index: number) => {
    setEditingIndex(index);
    setYear(item.year);
    setGrowthRate(item.growthRate);
    setIpm(item.ipm);
    setPovertyRate(item.povertyRate);
    setUnemploymentRate(item.unemploymentRate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim()) {
      alert('Mohon masukkan tahun periode indikator.');
      return;
    }

    const newItem: IndicatorStat = {
      year: year.trim(),
      growthRate: Number(growthRate),
      ipm: Number(ipm),
      povertyRate: Number(povertyRate),
      unemploymentRate: Number(unemploymentRate)
    };

    let updatedList: IndicatorStat[];
    if (editingIndex !== null) {
      updatedList = indicators.map((item, idx) => idx === editingIndex ? newItem : item);
      showToast(`Indikator makro tahun ${year} berhasil diperbarui.`);
    } else {
      updatedList = [...indicators, newItem];
      showToast(`Indikator makro tahun ${year} berhasil ditambahkan.`);
    }

    setIndicators(updatedList);
    StorageService.saveIndicatorStats(updatedList);
    onDataChanged();
    closeModal();
  };

  const handleDelete = (index: number) => {
    const item = indicators[index];
    if (!window.confirm(`Yakin ingin menghapus data indikator makro tahun ${item.year}?`)) {
      return;
    }
    const updated = indicators.filter((_, idx) => idx !== index);
    setIndicators(updated);
    StorageService.saveIndicatorStats(updated);
    onDataChanged();
    showToast(`Data tahun ${item.year} telah dihapus.`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Kembalikan data indikator makro ke rilis resmi BPS awal?')) {
      setIndicators(regionalIndicatorStats);
      StorageService.saveIndicatorStats(regionalIndicatorStats);
      onDataChanged();
      showToast('Data indikator makro dikembalikan ke nilai awal.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Manajemen Satu Data Makro</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Indikator Makro Pembangunan Daerah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data IPM, Pertumbuhan Ekonomi, Kemiskinan, dan Pengangguran yang tampil pada visualisasi grafik dan beranda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
            title="Reset ke data BPS"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset BPS</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tahun / Target</span>
          </button>
        </div>
      </div>

      {/* Indicator Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Daftar Rilis Indikator Makro per Periode ({indicators.length} Tahun)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tahun / Periode</th>
                <th className="py-3 px-4 text-emerald-700">Pertumbuhan Ekonomi (%)</th>
                <th className="py-3 px-4 text-[#0f3d5c]">IPM (Poin)</th>
                <th className="py-3 px-4 text-rose-700">Tingkat Kemiskinan (%)</th>
                <th className="py-3 px-4 text-purple-700">Pengangguran / TPT (%)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {indicators.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{item.year}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    {item.growthRate}%
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0f3d5c]">
                    {item.ipm}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-rose-700">
                    {item.povertyRate}%
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-purple-700">
                    {item.unemploymentRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(item, idx)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                      title="Edit Indikator"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition cursor-pointer"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.length > 0 && (() => {
          const latest = indicators[indicators.length - 1];
          return (
            <>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Pertumbuhan ({latest.year})</span>
                <div className="text-2xl font-black text-emerald-950 mt-1">{latest.growthRate}%</div>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">Target/Realisasi Provinsi</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="text-[11px] font-bold text-[#0f3d5c] uppercase block">IPM Daerah ({latest.year})</span>
                <div className="text-2xl font-black text-[#0f3d5c] mt-1">{latest.ipm}</div>
                <span className="text-[10px] text-slate-600 mt-0.5 block">Kategori Sedang / Meningkat</span>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="text-[11px] font-bold text-rose-800 uppercase block">Kemiskinan ({latest.year})</span>
                <div className="text-2xl font-black text-rose-950 mt-1">{latest.povertyRate}%</div>
                <span className="text-[10px] text-rose-700 mt-0.5 block">Tren Menurun Bertahap</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                <span className="text-[11px] font-bold text-purple-800 uppercase block">TPT Pengangguran ({latest.year})</span>
                <div className="text-2xl font-black text-purple-950 mt-1">{latest.unemploymentRate}%</div>
                <span className="text-[10px] text-purple-700 mt-0.5 block">Capaian Terkendali</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingIndex !== null ? 'Perbarui Indikator Makro' : 'Tambah Periode Indikator Makro'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tahun / Periode Capaian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Contoh: 2026 atau 2026 (Target)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pertumbuhan Ekonomi (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    IPM (Poin)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={ipm}
                    onChange={(e) => setIpm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tingkat Kemiskinan (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={povertyRate}
                    onChange={(e) => setPovertyRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    TPT Pengangguran (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unemploymentRate}
                    onChange={(e) => setUnemploymentRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Indikator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
