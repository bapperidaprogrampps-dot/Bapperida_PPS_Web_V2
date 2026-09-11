import React, { useState } from 'react';
import { X, Calendar, User, Eye, Share2, Tag, ArrowLeft } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export function ArticleDetailModal({ article, onClose }: ArticleDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0f3d5c] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content reader */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0f3d5c] text-white">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {article.author}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {article.views} tayangan
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Featured Image */}
          {article.imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : null}

          {/* Excerpt Lead */}
          <p className="text-sm font-semibold text-slate-700 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/40 rounded-r">
            {article.summary}
          </p>

          {/* Main Paragraphs */}
          <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Topik Terkait:</span>
              {article.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
