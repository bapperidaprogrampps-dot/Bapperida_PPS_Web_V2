import React, { useState } from 'react';
import { EmployeeProfile } from '../types';
import { PersonSilhouette } from './PersonSilhouette';
import { Briefcase, Award, Shield, FileText, Quote } from 'lucide-react';

interface EmployeeZigzagRowProps {
  key?: React.Key;
  employee: EmployeeProfile;
  index: number;
  isLeader?: boolean;
}

/**
 * Komponen Baris Profil Pegawai dengan Desain Zig-Zag Alternating
 * Mengacu pada referensi desain poster EBS (image.png):
 * - Latar belakang canvas gelap/navy mewah
 * - Baris bergantian (Genap: Kartu Putih di Kiri, Detail Poin di Kanan; Ganjil: Detail Poin di Kiri, Kartu Putih di Kanan)
 * - Kartu Putih melengkung (rounded-3xl) dengan Foto tegak, Badge Jabatan, Unit Kerja, Nama Besar Tebal
 * - Jika tidak ada gambar digantikan dengan siluet orang
 * - Daftar poin administrasi berpoin putih bersih di atas latar navy
 */
export const EmployeeZigzagRow: React.FC<EmployeeZigzagRowProps> = ({
  employee,
  index,
  isLeader = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const hasPhoto = Boolean(employee.photoUrl && !imageError);

  // Index genap: kartu putih di kiri (desktop), ganjil: kartu putih di kanan (desktop)
  const isReversed = index % 2 === 1;

  // Elemen Kartu Putih (Foto + Identitas Nama Besar)
  const WhiteCard = (
    <div className={`w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/25 border border-white/40 transition-all duration-300 hover:shadow-amber-500/10 hover:-translate-y-0.5 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 ${
      isReversed ? 'sm:flex-row-reverse sm:text-right' : 'sm:flex-row sm:text-left'
    }`}>
      {/* Bingkai Foto / Siluet */}
      <div className={`relative shrink-0 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 via-slate-150 to-slate-250 border border-slate-200/80 flex items-end justify-center shadow-inner ${
        isLeader ? 'w-36 h-48 sm:w-44 sm:h-56' : 'w-32 h-44 sm:w-36 sm:h-48'
      }`}>
        {hasPhoto ? (
          <img
            src={employee.photoUrl}
            alt={employee.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top filter contrast-[1.02] transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-end pb-2">
            <PersonSilhouette
              size={isLeader ? 'xl' : 'lg'}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            />
            <span className="text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Foto Siluet
            </span>
          </div>
        )}
      </div>

      {/* Konten Teks Dalam Kartu */}
      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 w-full">
        {/* Badge Kategori Jabatan */}
        <div className={`flex items-center ${isReversed ? 'sm:justify-end' : 'sm:justify-start'}`}>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${
            employee.positionCategory === 'Kepala Badan'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : employee.positionCategory === 'Sekretaris'
              ? 'bg-blue-100 text-blue-900 border border-blue-300'
              : employee.positionCategory === 'Kabid'
              ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
              : employee.positionCategory === 'Kasubag'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : employee.positionCategory === 'Kasubid'
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'bg-slate-100 text-slate-800 border border-slate-300'
          }`}>
            {employee.positionCategory}
          </span>
        </div>

        {/* Unit Kerja / Instansi */}
        <p className="text-xs font-semibold text-slate-500 truncate" title={employee.department || 'Bapperida Provinsi Papua Selatan'}>
          {employee.department || 'Bapperida Provinsi Papua Selatan'}
        </p>

        {/* NAMA LENGKAP BESAR TEBAL (Gaya EBS poster) */}
        <h3 className={`font-black text-slate-900 tracking-tight leading-snug ${
          isLeader ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
        }`}>
          {employee.name}
        </h3>

        {/* Nama Jabatan Lengkap */}
        <p className="text-xs sm:text-sm font-bold text-[#0f3d5c] leading-tight pt-0.5">
          {employee.positionTitle}
        </p>
      </div>
    </div>
  );

  // Elemen Poin Peluru di Latar Belakang Navy (Gaya EBS bullet points)
  const BulletPoints = (
    <div className={`w-full flex flex-col justify-center space-y-2.5 px-3 py-2 ${
      isReversed ? 'lg:pl-6' : 'lg:pr-6'
    }`}>
      <div className="space-y-2 text-xs sm:text-sm text-slate-200">
        {/* Poin Jabatan */}
        <div className="flex items-start gap-2.5 leading-relaxed">
          <span className="text-amber-400 font-bold text-base leading-none select-none">·</span>
          <p className="flex-1">
            <span className="text-slate-400 font-medium">Jabatan : </span>
            <span className="text-white font-semibold">{employee.positionTitle}</span>
          </p>
        </div>

        {/* Poin NIP */}
        {employee.nip && (
          <div className="flex items-start gap-2.5 leading-relaxed">
            <span className="text-amber-400 font-bold text-base leading-none select-none">·</span>
            <p className="flex-1">
              <span className="text-slate-400 font-medium">NIP : </span>
              <span className="text-white font-mono font-semibold">{employee.nip}</span>
            </p>
          </div>
        )}

        {/* Poin Pangkat / Golongan */}
        {employee.rank && (
          <div className="flex items-start gap-2.5 leading-relaxed">
            <span className="text-amber-400 font-bold text-base leading-none select-none">·</span>
            <p className="flex-1">
              <span className="text-slate-400 font-medium">Pangkat / Gol. : </span>
              <span className="text-white font-semibold">{employee.rank}</span>
            </p>
          </div>
        )}

        {/* Poin Unit Kerja */}
        <div className="flex items-start gap-2.5 leading-relaxed">
          <span className="text-amber-400 font-bold text-base leading-none select-none">·</span>
          <p className="flex-1">
            <span className="text-slate-400 font-medium">Unit Kerja : </span>
            <span className="text-white font-medium">{employee.department || 'Bapperida Provinsi Papua Selatan'}</span>
          </p>
        </div>

        {/* Poin Motto Kerja */}
        {employee.motto && (
          <div className="flex items-start gap-2.5 leading-relaxed pt-1 border-t border-white/10">
            <span className="text-amber-400 font-bold text-base leading-none select-none">·</span>
            <p className="flex-1 italic text-amber-200/90 text-xs">
              &ldquo;{employee.motto}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full py-5 lg:py-6 border-b border-white/10 last:border-b-0">
      {/* Tata Letak Desktop: Bergantian Zig-Zag (Desktop) / Tersusun Vertikal Rapi (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        {isReversed ? (
          <>
            {/* Pada mode ganjil di desktop: Poin di Kiri (col-5), Kartu Putih di Kanan (col-7) */}
            <div className="order-2 lg:order-1 lg:col-span-5">
              {BulletPoints}
            </div>
            <div className="order-1 lg:order-2 lg:col-span-7">
              {WhiteCard}
            </div>
          </>
        ) : (
          <>
            {/* Pada mode genap di desktop: Kartu Putih di Kiri (col-7), Poin di Kanan (col-5) */}
            <div className="order-1 lg:col-span-7">
              {WhiteCard}
            </div>
            <div className="order-2 lg:col-span-5">
              {BulletPoints}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
