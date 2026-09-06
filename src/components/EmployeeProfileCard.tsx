import React, { useState } from 'react';
import { EmployeeProfile } from '../types';
import { PersonSilhouette } from './PersonSilhouette';
import { Briefcase, Award, ShieldCheck, Quote } from 'lucide-react';

interface EmployeeProfileCardProps {
  key?: React.Key;
  employee: EmployeeProfile;
  isLeader?: boolean;
}

/**
 * Komponen Kartu Profil Pegawai
 * Desain disesuaikan dengan contoh foto:
 * - Foto berdiri/setengah badan tegak
 * - Pill badge oranye di bagian bawah foto dengan Nama Lengkap Kapital & Nama Jabatan
 * - Jika tidak ada gambar digantikan dengan siluet orang
 * - Keterangan administrasi (NIP, Pangkat/Gol, Unit Kerja, Motto) di bawah badge
 */
export const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ employee, isLeader = false }) => {
  const [imageError, setImageError] = useState(false);
  const hasPhoto = Boolean(employee.photoUrl && !imageError);

  return (
    <div className={`group flex flex-col items-center transition duration-200 ${isLeader ? 'max-w-md mx-auto w-full' : 'w-full'}`}>
      {/* Outer Card Container */}
      <div className="relative w-full flex flex-col items-center bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-amber-300/60 transition duration-300">
        
        {/* Photo / Silhouette Frame */}
        <div className={`relative w-full flex items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200/90 border border-slate-200/70 ${
          isLeader ? 'h-88 sm:h-96' : 'h-72 sm:h-80'
        }`}>
          {hasPhoto ? (
            <img
              src={employee.photoUrl}
              alt={employee.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top filter contrast-[1.03] transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-end pb-2">
              <PersonSilhouette
                size={isLeader ? 'xl' : 'lg'}
                className="text-slate-400 group-hover:text-slate-500 transition-colors"
              />
              <span className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Foto Belum Tersedia
              </span>
            </div>
          )}
        </div>

        {/* Floating Orange Pill Badge - PERSIS SEPERTI CONTOH GAMBAR */}
        <div className="relative -mt-7 z-10 w-[92%] sm:w-[90%] mx-auto bg-gradient-to-r from-[#ff7a00] to-[#f58220] text-white rounded-2xl px-4 py-3 shadow-lg shadow-orange-500/30 text-center border-2 border-white">
          <h4 className="font-black text-white text-xs sm:text-sm tracking-wide uppercase leading-tight drop-shadow-xs">
            {employee.name}
          </h4>
          <p className="text-white/95 text-[11px] sm:text-xs font-semibold leading-tight mt-1">
            {employee.positionTitle}
          </p>
        </div>

        {/* Administrative Details (NIP, Pangkat, Unit Kerja) */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          {employee.nip && (
            <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
              <span className="text-slate-400 font-medium">NIP</span>
              <span className="font-mono font-semibold text-slate-700">{employee.nip}</span>
            </div>
          )}

          {employee.rank && (
            <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
              <span className="text-slate-400 font-medium">Pangkat / Gol.</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]" title={employee.rank}>
                {employee.rank}
              </span>
            </div>
          )}

          {employee.department && (
            <div className="flex items-start justify-between gap-2 px-1 text-[11px]">
              <span className="text-slate-400 font-medium shrink-0">Unit Kerja</span>
              <span className="font-semibold text-[#0f3d5c] text-right truncate max-w-[180px]" title={employee.department}>
                {employee.department}
              </span>
            </div>
          )}

          {/* Motto / Pesan Kerja */}
          {employee.motto && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5 px-1">
              <Quote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-600 italic leading-relaxed line-clamp-2" title={employee.motto}>
                &ldquo;{employee.motto}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
