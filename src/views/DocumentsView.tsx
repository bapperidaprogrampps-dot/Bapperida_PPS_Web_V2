import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  Database, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { PlanningDocument, DocumentCategory } from '../types';

interface DocumentsViewProps {
  documents: PlanningDocument[];
  onSelectDocument: (doc: PlanningDocument) => void;
  onDownloadDocument: (doc: PlanningDocument) => void;
}

export function DocumentsView({ documents, onSelectDocument, onDownloadDocument }: DocumentsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: string[] = [
    'Semua',
    'RPJPD',
    'RPJMD',
    'RKPD',
    'Renstra',
    'Renja',
    'KUA-PPAS',
    'LKPJ',
    'Kajian Riset & Inovasi'
  ];

  const years: string[] = ['Semua', '2026', '2025', '2024', '2023'];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
      const matchYear = selectedYear === 'Semua' || doc.year === selectedYear;
      const matchSearch = !searchQuery.trim() || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.legalBasis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchYear && matchSearch;
    });
  }, [documents, selectedCategory, selectedYear, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <FileText className="w-4 h-4" />
          <span>Repositori Dokumen Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dokumen Perencanaan Pembangunan Daerah
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
          Kanal transparansi publikasi berkas perencanaan Provinsi Papua Selatan sesuai amanat UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan Permendagri No. 86 Tahun 2017.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama dokumen, nomor Perda/Pergub, kata kunci..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#0f3d5c] focus:bg-white text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              {years.map(y => (
                <option key={y} value={y}>{y === 'Semua' ? 'Semua Tahun' : `Tahun ${y}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#0f3d5c] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Menampilkan <strong>{filteredDocs.length}</strong> dokumen perencanaan</span>
        {(selectedCategory !== 'Semua' || selectedYear !== 'Semua' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setSelectedYear('Semua');
              setSearchQuery('');
            }}
            className="text-[#0f3d5c] font-semibold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filter
          </button>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Info */}
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    {doc.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    Tahun {doc.year}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Diunggah: {doc.uploadDate}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectDocument(doc)}
                  className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0f3d5c] cursor-pointer transition leading-snug"
                >
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="font-mono text-slate-700 font-medium">SK: {doc.legalBasis}</span>
                  <span>•</span>
                  <span>Ukuran: {doc.fileSize} ({doc.fileFormat})</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">{doc.downloadCount.toLocaleString('id-ID')} kali unduh</span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => onSelectDocument(doc)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>

                <button
                  onClick={() => onDownloadDocument(doc)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] rounded-lg shadow-xs transition flex items-center gap-1.5"
                  id={`btn-unduh-${doc.id}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Tidak ditemukan dokumen</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ada dokumen yang cocok dengan filter atau kata kunci pencarian Anda. Silakan coba atur ulang filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
