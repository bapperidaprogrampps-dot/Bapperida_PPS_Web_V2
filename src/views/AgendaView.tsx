import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Tag, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AgendaEvent } from '../types';

interface AgendaViewProps {
  agendas: AgendaEvent[];
}

export function AgendaView({ agendas }: AgendaViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  const filtered = agendas.filter(ag => {
    if (filterStatus === 'Semua') return true;
    return ag.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <Calendar className="w-4 h-4" />
          <span>Kalender Kegiatan Kedinasan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Agenda & Jadwal Kegiatan Bapperida
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
          Informasi jadwal musyawarah perencanaan pembangunan, rapat koordinasi kewilayahan, lokakarya riset daerah, dan kegiatan kemitraan bersama 4 Kabupaten.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
        <span className="text-slate-500 font-semibold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {['Semua', 'Akan Datang', 'Sedang Berlangsung', 'Selesai'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              filterStatus === st
                ? 'bg-[#0f3d5c] text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Agenda Grid/List */}
      <div className="space-y-4">
        {filtered.map((ag) => {
          const [year, month, day] = ag.date.split('-');
          const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          const monthLabel = monthNames[parseInt(month, 10) - 1] || 'Bulan';

          return (
            <div
              key={ag.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xs transition flex flex-col sm:flex-row gap-5 items-start"
            >
              {/* Date Box */}
              <div className="w-full sm:w-28 py-3 bg-slate-50 border border-slate-200 rounded-xl flex sm:flex-col items-center justify-center gap-2 sm:gap-0 shrink-0 text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#0f3d5c] leading-none">{day}</span>
                <span className="text-xs font-bold text-slate-600 uppercase mt-1">{monthLabel}</span>
                <span className="text-[11px] font-mono text-slate-400">{year}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0f3d5c]">
                    {ag.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    ag.status === 'Akan Datang' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : ag.status === 'Sedang Berlangsung'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ag.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {ag.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ag.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{ag.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{ag.location}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-[#0f3d5c] shrink-0" />
                    <span>Penyelenggara: <strong>{ag.organizer}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
