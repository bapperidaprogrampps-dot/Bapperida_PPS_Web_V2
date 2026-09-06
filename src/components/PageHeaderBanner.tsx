import React from 'react';
import { DeerSilhouette } from './DeerSilhouette';

interface PageHeaderBannerProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  id?: string;
}

/**
 * Header Banner Halaman - Full-Width Edge-to-Edge (Kiri & Kanan Mentok)
 * Dilengkapi dengan siluet hewan rusa (Rusa Merauke / Papua Selatan) di sebelah kanan.
 */
export function PageHeaderBanner({
  badgeText,
  badgeIcon,
  title,
  description,
  children,
  id
}: PageHeaderBannerProps) {
  return (
    <div 
      id={id}
      className="w-full bg-gradient-to-r from-[#092233] via-[#0f3d5c] to-[#154e74] text-white border-b border-white/10 relative overflow-hidden"
    >
      {/* Siluet Hewan Rusa (Rusa Merauke) di Sebelah Kanan */}
      <div 
        className="absolute right-0 sm:right-6 md:right-14 lg:right-24 bottom-0 pointer-events-none select-none z-0 opacity-20 sm:opacity-25 transform translate-y-2 hover:opacity-35 transition duration-500"
        aria-hidden="true"
      >
        <DeerSilhouette className="w-44 h-44 sm:w-60 sm:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 text-amber-300" />
      </div>

      {/* Pattern overlay tipis */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0"></div>

      {/* Konten Utama Banner Terpusat & Rapi */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 sm:py-9 lg:py-10 relative z-10">
        <div className="max-w-4xl">
          {badgeText && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1.5">
              {badgeIcon}
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-5">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
