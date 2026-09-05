import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Compass, 
  Building2, 
  Award, 
  Percent, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { regenciesData } from '../data/mockData';
import { StorageService } from '../services/storage';
import { IndicatorStat } from '../types';

export function StatisticsView() {
  const [selectedMetric, setSelectedMetric] = useState<'ipm' | 'growth' | 'poverty' | 'unemployment'>('ipm');
  const [indicatorStats, setIndicatorStats] = useState<IndicatorStat[]>([]);

  useEffect(() => {
    setIndicatorStats(StorageService.getIndicatorStats());
  }, []);

  const metricConfigs = {
    ipm: {
      label: 'Indeks Pembangunan Manusia (IPM)',
      desc: 'Mencerminkan capaian standar hidup layak, derajat kesehatan (usia harapan hidup), dan pendidikan.',
      unit: 'Poin',
      color: '#0f3d5c',
      data: indicatorStats.map(s => ({ year: s.year, val: s.ipm }))
    },
    growth: {
      label: 'Laju Pertumbuhan Ekonomi',
      desc: 'Pertumbuhan Produk Domestik Regional Bruto (PDRB) atas dasar harga konstan per tahun.',
      unit: '%',
      color: '#10B981',
      data: indicatorStats.map(s => ({ year: s.year, val: s.growthRate }))
    },
    poverty: {
      label: 'Tingkat Kemiskinan',
      desc: 'Persentase penduduk dengan pengeluaran per kapita per bulan di bawah Garis Kemiskinan.',
      unit: '%',
      color: '#EF4444',
      data: indicatorStats.map(s => ({ year: s.year, val: s.povertyRate }))
    },
    unemployment: {
      label: 'Tingkat Pengangguran Terbuka (TPT)',
      desc: 'Persentase jumlah penganggur terhadap jumlah total angkatan kerja di Papua Selatan.',
      unit: '%',
      color: '#8B5CF6',
      data: indicatorStats.map(s => ({ year: s.year, val: s.unemploymentRate }))
    }
  };

  const currentConfig = metricConfigs[selectedMetric];
  const maxVal = Math.max(...currentConfig.data.map(d => d.val)) * 1.15;
  const minVal = Math.min(...currentConfig.data.map(d => d.val)) * 0.85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Satu Data Papua Selatan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Data & Statistik Indikator Pembangunan Daerah
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
          Statistik makro ekonomi, capaian Indeks Pembangunan Manusia (IPM), profil kemiskinan, dan data komparasi empat kabupaten di Provinsi Papua Selatan.
        </p>
      </div>

      {/* Metric Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'ipm', label: 'Indeks Pembangunan (IPM)', value: '62.45', sub: '+0.65 poin YoY', color: 'text-[#0f3d5c]', bg: 'bg-blue-50' },
          { key: 'growth', label: 'Pertumbuhan Ekonomi', value: '5.12%', sub: '+0.27% tren naik', color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { key: 'poverty', label: 'Tingkat Kemiskinan', value: '23.60%', sub: '-1.30% tren turun', color: 'text-rose-700', bg: 'bg-rose-50' },
          { key: 'unemployment', label: 'Tingkat Pengangguran', value: '3.65%', sub: '-0.33% membaik', color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(item => (
          <div
            key={item.key}
            onClick={() => setSelectedMetric(item.key as any)}
            className={`p-5 rounded-xl border transition cursor-pointer ${
              selectedMetric === item.key
                ? 'bg-white border-2 border-[#0f3d5c]'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs text-slate-500 font-medium block">{item.label}</span>
            <div className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Tren Historis: {currentConfig.label}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentConfig.desc}
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg self-start sm:self-auto">
            Satuan: {currentConfig.unit}
          </span>
        </div>

        {/* Visual Responsive Bar & Trend Chart (SVG) */}
        <div className="h-64 sm:h-72 w-full pt-4">
          <div className="h-full flex items-end justify-between gap-2 sm:gap-6 px-4 pb-6 border-b border-slate-200">
            {currentConfig.data.map((item, i) => {
              const heightPct = Math.max(15, Math.min(100, ((item.val - minVal) / (maxVal - minVal)) * 100));

              return (
                <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip value */}
                  <span className="text-xs font-bold text-slate-900 mb-1.5 opacity-90 group-hover:scale-110 transition">
                    {item.val} {currentConfig.unit}
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[50px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-[85%]">
                    <div
                      style={{ height: `${heightPct}%`, backgroundColor: currentConfig.color }}
                      className="w-full rounded-t-lg transition-all duration-700 group-hover:opacity-90"
                    ></div>
                  </div>

                  {/* Year Label */}
                  <span className="text-[11px] font-semibold text-slate-600 mt-2 text-center">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-slate-400 text-center italic">
          Sumber Data: Bapperida Provinsi Papua Selatan & BPS Provinsi Papua Selatan (Diolah, 2026)
        </div>
      </div>

      {/* Profil Statistik Komparasi 4 Kabupaten */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
            Data Spasial 4 Kabupaten
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Profil Kewilayahan & Indikator Komparatif
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Perbandingan luas wilayah, populasi, pembagian distrik/kampung, capaian IPM, dan keunggulan strategis daerah.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#0f3d5c] text-white">
                <th className="p-3.5 rounded-l-lg font-bold">Kabupaten</th>
                <th className="p-3.5 font-bold">Ibukota</th>
                <th className="p-3.5 font-bold">Luas Wilayah</th>
                <th className="p-3.5 font-bold">Penduduk</th>
                <th className="p-3.5 font-bold">Distrik / Kampung</th>
                <th className="p-3.5 font-bold">IPM</th>
                <th className="p-3.5 rounded-r-lg font-bold">Potensi Unggulan Rencana Daerah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {regenciesData.map((reg, idx) => (
                <tr key={reg.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3.5 font-bold text-slate-900">{reg.name}</td>
                  <td className="p-3.5 text-slate-700 font-medium">{reg.capital}</td>
                  <td className="p-3.5 text-slate-700">{reg.areaKm2.toLocaleString('id-ID')} km²</td>
                  <td className="p-3.5 text-slate-700">{reg.population.toLocaleString('id-ID')} jiwa</td>
                  <td className="p-3.5 text-slate-700">{reg.districtsCount} Distrik / {reg.villagesCount} Kampung</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900">
                      {reg.ipm.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs">{reg.primaryPotential}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
