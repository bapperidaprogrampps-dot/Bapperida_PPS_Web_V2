import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Database, 
  Award, 
  Share2, 
  Eye,
  Building2,
  Lock
} from 'lucide-react';
import { PlanningDocument } from '../types';
import { PapuaSelatanLogo, BapperidaLogo } from './Logos';

interface DocumentPreviewModalProps {
  document: PlanningDocument | null;
  onClose: () => void;
  onDownload: (doc: PlanningDocument) => void;
}

export function DocumentPreviewModal({ document, onClose, onDownload }: DocumentPreviewModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!document) return null;

  const handleDownloadAction = () => {
    onDownload(document);
    setDownloadSuccess(true);
    
    // Generate simulated downloadable file
    const docContent = `PEMERINTAH PROVINSI PAPUA SELATAN
BADAN PERENCANAAN PEMBANGUNAN DAERAH, RISET DAN INOVASI DAERAH (BAPPERIDA)
Kompleks Pusat Pemerintahan Terpadu Salor, Merauke, Provinsi Papua Selatan
Email: bapperidaprogram.pps@gmail.com
========================================================================

DOKUMEN RESMI PERENCANAAN DAERAH:
Judul        : ${document.title}
Kategori     : ${document.category}
Tahun Berlaku: ${document.year}
Dasar Hukum  : ${document.legalBasis}
Wilayah      : Provinsi Papua Selatan (Merauke, Boven Digoel, Mappi, Asmat)
Tanggal Rilis: ${document.uploadDate}
Ukuran File  : ${document.fileSize}
Format       : ${document.fileFormat}

RINGKASAN EKSEKUTIF / ABSTRAK DOKUMEN:
${document.description}

POKOK-POKOK PRIORITAS PEMBANGUNAN WILAYAH ANIM HA:
1. Peningkatan Kualitas Sumber Daya Manusia dan Perlindungan Orang Asli Papua (OAP).
2. Percepatan Konektivitas Multi-Moda (Darat, Sungai, Udara) di 4 Kabupaten.
3. Pengembangan Kawasan Sentra Produksi Pangan dan Agromaritim Berkelanjutan.
4. Penguatan Tata Kelola Pemerintahan, Penurunan Kemiskinan Ekstrem, dan Stunting.
5. Pemanfaatan Riset & Inovasi Daerah (BRIDA) Berbasis Kearifan Lokal Sagu dan Gambut.

Salinan ini diunduh secara sah melalui Portal Resmi Bapperida Provinsi Papua Selatan.
Waktu Unduh: ${new Date().toLocaleString('id-ID')}
Status Keabsahan: Diterbitkan oleh Tim Pokja Perencanaan Makro Bapperida Papua Selatan.
`;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.category}_PPS_${document.year}_${document.id}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with Governmental Crest */}
        <div className="bg-[#0f3d5c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PapuaSelatanLogo className="h-8 w-auto" />
            <div>
              <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest block">
                Pratinjau Dokumen Resmi
              </span>
              <h4 className="text-sm font-bold leading-tight">
                Bapperida Provinsi Papua Selatan
              </h4>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Badge & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {document.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                Tahun {document.year}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Dokumen Terverifikasi Sah
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {document.title}
            </h3>
          </div>

          {/* Legal Basis Callout */}
          <div className="p-3.5 bg-slate-50 border-l-4 border-[#0f3d5c] rounded-r-lg">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Dasar Hukum & Penetapan:
            </span>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              {document.legalBasis}
            </p>
          </div>

          {/* Abstract / Summary */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Ringkasan Isi & Ruang Lingkup
            </h5>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200">
              {document.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Format File</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-red-600" /> {document.fileFormat}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Ukuran Berkas</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-slate-600" /> {document.fileSize}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Tanggal Rilis</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-600" /> {document.uploadDate}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Total Diunduh</span>
              <span className="font-bold text-[#0f3d5c] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#0f3d5c]" /> {document.downloadCount.toLocaleString('id-ID')} kali
              </span>
            </div>
          </div>

          {/* Verified Guarantee banner */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
            <Award className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">Keterbukaan Informasi Publik (UU No. 14 Tahun 2008)</p>
              <p className="text-emerald-700 text-[11px]">
                Dokumen ini merupakan arsip terbuka yang dapat diunduh bebas oleh masyarakat, akademisi, dan stakeholder pembangunan.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Tautan Disalin!' : 'Bagikan Tautan'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              Tutup
            </button>
            <button
              onClick={handleDownloadAction}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] rounded-lg shadow-sm transition"
              id="modal-download-btn"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Mengunduh Berkas...' : `Unduh Dokumen (${document.fileSize})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
