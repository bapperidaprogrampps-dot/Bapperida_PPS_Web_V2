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
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

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
    <div className="w-full pb-16 space-y-8">
      {/* Header Banner - Full Width Kiri & Kanan Mentok dengan Siluet Rusa di Sebelah Kanan */}
      <PageHeaderBanner
        badgeIcon={<FileText className="w-4 h-4" />}
        badgeText="Repositori Dokumen Resmi"
        title="Dokumen Perencanaan Pembangunan Daerah"
        description="Kanal transparansi publikasi berkas perencanaan Provinsi Papua Selatan sesuai amanat UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan Permendagri No. 86 Tahun 2017."
      />

      {/* Main Content Area - Boxed */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-8">

      {/* Filter & Search Bar */}
      <ScrollReveal variant="fade-up" duration={0.6} delay={0.05}>
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
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
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden cursor-pointer"
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
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
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
      </ScrollReveal>

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
            className="text-[#0f3d5c] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filter
          </button>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length > 0 ? (
          <div className="bg-slate-100/50 p-6 md:p-8 rounded-2xl border border-slate-200">
            <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {filteredDocs.map((doc) => (
                <StaggerItem key={doc.id} variant="zoom-in">
                  <div className="group flex flex-col h-full cursor-pointer relative" onClick={() => onSelectDocument(doc)}>
                    {/* Book Cover */}
                    <div className="relative aspect-[3/4] w-full rounded-r-md rounded-l-sm shadow-[4px_0_10px_rgba(0,0,0,0.15),_inset_4px_0_0_rgba(255,255,255,0.3)] bg-[#0f3d5c] overflow-hidden mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[8px_10px_20px_rgba(0,0,0,0.2)] border border-slate-800/20 mx-auto max-w-[200px]">
                      {/* Spine Effect */}
                      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/40 via-white/20 to-transparent z-10 pointer-events-none"></div>
                      {/* Book Binding Line */}
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/20 z-10 pointer-events-none"></div>
                      
                      {doc.coverImage ? (
                        <img src={doc.coverImage} alt={doc.title} className="w-full h-full object-cover relative z-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between p-3.5 pt-8 bg-gradient-to-br from-[#185377] to-[#0f3d5c] text-white relative z-0 text-center">
                          <div className="space-y-1.5">
                            <span className="inline-block px-2 py-0.5 border border-amber-400/50 text-amber-400 text-[8px] font-bold tracking-widest uppercase rounded">
                              {doc.category}
                            </span>
                            <h3 className="text-[13px] font-bold leading-snug line-clamp-4 mt-2">
                              {doc.title}
                            </h3>
                          </div>
                          <div className="mt-auto pt-3 border-t border-white/20 flex flex-col items-center gap-1 opacity-80">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                              <FileText className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[9px] uppercase tracking-wider font-semibold">Tahun {doc.year}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onSelectDocument(doc); }}
                          className="px-4 py-2 bg-white text-[#0f3d5c] text-[11px] font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDownloadDocument(doc); }}
                          className="px-4 py-2 bg-amber-500 text-white text-[11px] font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-amber-600 flex items-center gap-1.5"
                          id={`btn-unduh-${doc.id}`}
                        >
                          <Download className="w-3.5 h-3.5" /> Unduh
                        </button>
                      </div>
                    </div>
                    
                    {/* Book Meta / Shelf Label */}
                    <div className="text-center px-1">
                      <h4 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0f3d5c] transition-colors">
                        {doc.title}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-500 mt-1.5">
                        <span className="px-1.5 py-0.5 bg-slate-200/60 rounded font-semibold">{doc.category}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
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
    </div>
  );
}
