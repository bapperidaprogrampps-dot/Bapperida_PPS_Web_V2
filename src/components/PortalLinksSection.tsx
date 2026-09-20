import React from 'react';
import { Globe, ExternalLink, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { PortalLink } from '../types';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollAnimations';

interface PortalLinksSectionProps {
  portalLinks: PortalLink[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const FALLBACK_PORTAL_COVER = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';

export function PortalLinksSection({
  portalLinks,
  className = '',
  title = 'Tautan Portal & Website Terkait',
  subtitle = 'Akses langsung menuju aplikasi perencanaan, portal satu data, dan kanal pelayanan publik mitra strategis Pemerintah Provinsi Papua Selatan.'
}: PortalLinksSectionProps) {
  // Hanya tampilkan portal yang berstatus aktif (default true)
  const activeLinks = portalLinks
    .filter(link => link.isActive !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <section 
      id="portal-website-terkait-section" 
      className={`w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10 ${className}`}
    >
      <ScrollReveal variant="fade-up" duration={0.65}>
        <div className="bg-gradient-to-b from-slate-50/90 to-white/95 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200/70">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest border border-teal-200/50 mb-2.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>Portal Layanan Eksternal</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0f3d5c] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/70 shadow-2xs shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sistem & Website Terverifikasi</span>
            </div>
          </div>

          {/* Grid Portal Website Link Cards */}
          <StaggerContainer 
            staggerDelay={0.06} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 lg:gap-6"
          >
            {activeLinks.map((item) => (
              <StaggerItem key={item.id} variant="fade-up">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#0f3d5c]/40 hover:shadow-xl hover:shadow-[#0f3d5c]/8 hover:-translate-y-1 transition-all duration-300 relative focus:outline-hidden focus:ring-2 focus:ring-[#0f3d5c]"
                  title={`Kunjungi ${item.title}`}
                >
                  {/* Cover Image Dominan */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.coverImage || FALLBACK_PORTAL_COVER}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_PORTAL_COVER;
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badge Kategori / Label */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#0f3d5c]/90 text-white backdrop-blur-xs shadow-xs border border-white/10">
                        {item.badge || item.category || 'Portal Web'}
                      </span>
                    </div>

                    {/* Floating External Icon on Cover */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4 text-amber-300" />
                    </div>

                    {/* Quick URL strip at bottom of cover */}
                    <div className="absolute bottom-2.5 left-3 right-3 truncate text-[11px] font-mono text-slate-300/90 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{item.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0f3d5c] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0f3d5c]">
                      <span className="flex items-center gap-1 text-slate-700 group-hover:text-[#0f3d5c] transition-colors">
                        Buka Website
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-600 group-hover:text-amber-700 transition-colors">
                        <span>Menuju Portal</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Accent bottom border on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-[#0f3d5c] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </section>
  );
}
