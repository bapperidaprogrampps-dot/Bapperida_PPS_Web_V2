import React, { useState, useMemo } from 'react';
import { Search, X, FileText, Newspaper, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { ActivePage, PlanningDocument, NewsArticle, AgendaEvent } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: PlanningDocument[];
  articles: NewsArticle[];
  agendas: AgendaEvent[];
  onSelectDocument: (doc: PlanningDocument) => void;
  onSelectArticle: (article: NewsArticle) => void;
  setActivePage: (page: ActivePage) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  documents,
  articles,
  agendas,
  onSelectDocument,
  onSelectArticle,
  setActivePage
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  const filteredDocs = useMemo(() => {
    if (!query.trim()) return documents.slice(0, 3);
    const q = query.toLowerCase();
    return documents.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.category.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, documents]);

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return articles.slice(0, 3);
    const q = query.toLowerCase();
    return articles.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.category.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query, articles]);

  const filteredAgendas = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return agendas.filter(ag => 
      ag.title.toLowerCase().includes(q) || 
      ag.location.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query, agendas]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci (contoh: RPJPD, RKPD 2025, Riset Sagu, Musrenbang, Pengaduan)..."
            className="w-full bg-transparent border-none text-sm focus:outline-hidden text-slate-800 placeholder-slate-400 font-medium"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              Bersihkan
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Pencarian Populer:</span>
            {['RPJPD 2025-2045', 'RKPD 2025', 'BRIDA', 'Lacak Tiket', 'SIPD'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Section: Dokumen Perencanaan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f3d5c] flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Dokumen Perencanaan ({filteredDocs.length})
              </span>
              <button
                onClick={() => {
                  setActivePage('dokumen');
                  onClose();
                }}
                className="text-xs text-[#0f3d5c] hover:underline font-medium flex items-center gap-0.5"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              {filteredDocs.length > 0 ? (
                filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="p-3 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {doc.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Tahun {doc.year}</span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-800 group-hover:text-[#0f3d5c] transition line-clamp-1">
                        {doc.title}
                      </h5>
                    </div>
                    <span className="text-xs text-[#0f3d5c] font-semibold shrink-0 group-hover:translate-x-0.5 transition">
                      Pratinjau →
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-1">Tidak ada dokumen yang cocok dengan kata kunci.</p>
              )}
            </div>
          </div>

          {/* Section: Berita & Publikasi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f3d5c] flex items-center gap-1.5">
                <Newspaper className="w-4 h-4" /> Berita & Siaran Pers ({filteredArticles.length})
              </span>
              <button
                onClick={() => {
                  setActivePage('berita');
                  onClose();
                }}
                className="text-xs text-[#0f3d5c] hover:underline font-medium flex items-center gap-0.5"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-3 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500">{art.category} • {art.publishedAt}</span>
                      <h5 className="text-sm font-semibold text-slate-800 group-hover:text-[#0f3d5c] transition line-clamp-1">
                        {art.title}
                      </h5>
                    </div>
                    <span className="text-xs text-[#0f3d5c] font-semibold shrink-0 group-hover:translate-x-0.5 transition">
                      Baca →
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-1">Tidak ada berita yang cocok dengan kata kunci.</p>
              )}
            </div>
          </div>

          {/* Section: Agenda (if matching) */}
          {filteredAgendas.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f3d5c] flex items-center gap-1.5 mb-2">
                <Calendar className="w-4 h-4" /> Agenda Kegiatan
              </span>
              <div className="space-y-1.5">
                {filteredAgendas.map(ag => (
                  <div
                    key={ag.id}
                    onClick={() => {
                      setActivePage('agenda');
                      onClose();
                    }}
                    className="p-3 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer"
                  >
                    <div className="text-xs text-amber-700 font-semibold">{ag.date} • {ag.location}</div>
                    <div className="text-sm font-semibold text-slate-800">{ag.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action to Pengaduan */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Ingin menyampaikan aspirasi atau lacak nomor tiket pengaduan?</span>
            </div>
            <button
              onClick={() => {
                setActivePage('pengaduan');
                onClose();
              }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded transition shrink-0"
            >
              Buka Layanan
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
          Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px]">ESC</kbd> untuk menutup
        </div>
      </div>
    </div>
  );
}
