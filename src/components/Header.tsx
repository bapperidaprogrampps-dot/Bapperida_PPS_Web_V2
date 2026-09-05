import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePage } from '../types';
import { GovernmentBrandHeader } from './Logos';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
  onLogout?: () => void;
}

export function Header({ activePage, setActivePage, onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'informasi' | 'layanan' | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<'informasi' | 'layanan' | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (menu: 'informasi' | 'layanan') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInformasiActive = activePage === 'agenda' || activePage === 'data-statistik';
  const isLayananActive = activePage === 'layanan' || activePage === 'pengaduan' || activePage === 'kontak';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-none border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Single Slim Navigation Row */}
        <div className="flex items-center justify-between h-16" ref={dropdownRef}>
          {/* Sisi Kiri: Identitas Logo yang besarnya serasi dengan tinggi teks */}
          <GovernmentBrandHeader 
            variant="light" 
            simple={true}
            logoClassName="h-7 sm:h-8 w-auto"
            onClick={() => handleNavClick('beranda')} 
          />

          {/* Sisi Kanan: Opsi Menu Rata Kanan di Samping Logo Pencarian */}
          {/* Urutan: Beranda > Profil > Informasi Publik > Berita > Galeri > Dokumen perencanaan > Layanan */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 ml-auto">
            {/* 1. Beranda */}
            <button
              onClick={() => handleNavClick('beranda')}
              className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                activePage === 'beranda'
                  ? 'text-[#0f3d5c] font-bold'
                  : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
              }`}
              id="nav-item-beranda"
            >
              Beranda
            </button>

            {/* 2. Profil */}
            <button
              onClick={() => handleNavClick('profil')}
              className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                activePage === 'profil'
                  ? 'text-[#0f3d5c] font-bold'
                  : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
              }`}
              id="nav-item-profil"
            >
              Profil
            </button>

            {/* 3. Informasi Publik (Dropdown: Agenda & Data & Statistik) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('informasi')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'informasi' ? null : 'informasi')}
                className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                  isInformasiActive
                    ? 'text-[#0f3d5c] font-bold'
                    : activeDropdown === 'informasi'
                    ? 'text-[#0f3d5c] font-semibold'
                    : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
                }`}
                id="nav-dropdown-informasi"
                aria-expanded={activeDropdown === 'informasi'}
              >
                Informasi Publik
              </button>

              <AnimatePresence>
                {activeDropdown === 'informasi' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 py-1.5 z-50 overflow-hidden before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
                    onMouseEnter={() => handleMouseEnter('informasi')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleNavClick('agenda')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none block ${
                        activePage === 'agenda'
                          ? 'text-[#0f3d5c] font-bold bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-50'
                      }`}
                      id="dropdown-item-agenda"
                    >
                      Agenda
                    </button>

                    <button
                      onClick={() => handleNavClick('data-statistik')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none block ${
                        activePage === 'data-statistik'
                          ? 'text-[#0f3d5c] font-bold bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-50'
                      }`}
                      id="dropdown-item-data-statistik"
                    >
                      Data & Statistik
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Berita */}
            <button
              onClick={() => handleNavClick('berita')}
              className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                activePage === 'berita'
                  ? 'text-[#0f3d5c] font-bold'
                  : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
              }`}
              id="nav-item-berita"
            >
              Berita
            </button>

            {/* 5. Galeri */}
            <button
              onClick={() => handleNavClick('galeri')}
              className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                activePage === 'galeri'
                  ? 'text-[#0f3d5c] font-bold'
                  : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
              }`}
              id="nav-item-galeri"
            >
              Galeri
            </button>

            {/* 6. Dokumen Perencanaan */}
            <button
              onClick={() => handleNavClick('dokumen')}
              className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                activePage === 'dokumen'
                  ? 'text-[#0f3d5c] font-bold'
                  : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
              }`}
              id="nav-item-dokumen"
            >
              Dokumen Perencanaan
            </button>

            {/* 7. Layanan (Dropdown: Layanan PPID, Pengaduan, Kontak) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('layanan')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(prev => prev === 'layanan' ? null : 'layanan')}
                className={`px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${
                  isLayananActive
                    ? 'text-[#0f3d5c] font-bold'
                    : activeDropdown === 'layanan'
                    ? 'text-[#0f3d5c] font-semibold'
                    : 'text-slate-600 hover:text-[#0f3d5c] font-medium'
                }`}
                id="nav-dropdown-layanan"
                aria-expanded={activeDropdown === 'layanan'}
              >
                Layanan
              </button>

              <AnimatePresence>
                {activeDropdown === 'layanan' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 py-1.5 z-50 overflow-hidden before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
                    onMouseEnter={() => handleMouseEnter('layanan')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleNavClick('layanan')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none block ${
                        activePage === 'layanan'
                          ? 'text-[#0f3d5c] font-bold bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-50'
                      }`}
                      id="dropdown-item-ppid"
                    >
                      Layanan PPID
                    </button>

                    <button
                      onClick={() => handleNavClick('pengaduan')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none block ${
                        activePage === 'pengaduan'
                          ? 'text-[#0f3d5c] font-bold bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-50'
                      }`}
                      id="dropdown-item-pengaduan"
                    >
                      Pengaduan
                    </button>

                    <button
                      onClick={() => handleNavClick('kontak')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer bg-transparent border-none block ${
                        activePage === 'kontak'
                          ? 'text-[#0f3d5c] font-bold bg-slate-50'
                          : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-50'
                      }`}
                      id="dropdown-item-kontak"
                    >
                      Kontak
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tombol Kaca Pembesar Sederhana */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-[#0f3d5c] transition-colors cursor-pointer bg-transparent border-none ml-1"
              title="Pencarian Cepat"
              aria-label="Pencarian Cepat"
              id="nav-search-button"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </nav>

          {/* Tombol Mobile: Logo Kaca Pembesar & Menu Hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-[#0f3d5c] transition-colors cursor-pointer bg-transparent border-none"
              aria-label="Pencarian Cepat"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0f3d5c] transition-colors cursor-pointer bg-transparent border-none"
              aria-label="Buka Menu Navigasi"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu dengan Urutan yang Sama */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {/* 1. Beranda */}
            <button
              onClick={() => handleNavClick('beranda')}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                activePage === 'beranda'
                  ? 'text-[#0f3d5c] font-bold bg-slate-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
              id="mobile-nav-beranda"
            >
              <span>Beranda</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 2. Profil */}
            <button
              onClick={() => handleNavClick('profil')}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                activePage === 'profil'
                  ? 'text-[#0f3d5c] font-bold bg-slate-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
              id="mobile-nav-profil"
            >
              <span>Profil</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 3. Informasi Publik Accordion */}
            <div className="border border-slate-100 rounded-lg overflow-hidden my-0.5">
              <button
                onClick={() => setMobileExpandedSection(prev => prev === 'informasi' ? null : 'informasi')}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-left transition ${
                  isInformasiActive
                    ? 'text-[#0f3d5c] font-bold bg-slate-50'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>Informasi Publik</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpandedSection === 'informasi' ? 'rotate-90 text-[#0f3d5c]' : 'text-slate-400'
                }`} />
              </button>
              {mobileExpandedSection === 'informasi' && (
                <div className="bg-slate-50 px-3 py-1 space-y-1 border-t border-slate-100">
                  <button
                    onClick={() => handleNavClick('agenda')}
                    className={`w-full px-3 py-2 text-sm rounded-md text-left transition ${
                      activePage === 'agenda' ? 'text-[#0f3d5c] font-bold bg-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    Agenda
                  </button>
                  <button
                    onClick={() => handleNavClick('data-statistik')}
                    className={`w-full px-3 py-2 text-sm rounded-md text-left transition ${
                      activePage === 'data-statistik' ? 'text-[#0f3d5c] font-bold bg-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    Data & Statistik
                  </button>
                </div>
              )}
            </div>

            {/* 4. Berita */}
            <button
              onClick={() => handleNavClick('berita')}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                activePage === 'berita'
                  ? 'text-[#0f3d5c] font-bold bg-slate-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
              id="mobile-nav-berita"
            >
              <span>Berita</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 5. Galeri */}
            <button
              onClick={() => handleNavClick('galeri')}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                activePage === 'galeri'
                  ? 'text-[#0f3d5c] font-bold bg-slate-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
              id="mobile-nav-galeri"
            >
              <span>Galeri</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 6. Dokumen Perencanaan */}
            <button
              onClick={() => handleNavClick('dokumen')}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                activePage === 'dokumen'
                  ? 'text-[#0f3d5c] font-bold bg-slate-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
              id="mobile-nav-dokumen"
            >
              <span>Dokumen Perencanaan</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 7. Layanan Accordion */}
            <div className="border border-slate-100 rounded-lg overflow-hidden my-0.5">
              <button
                onClick={() => setMobileExpandedSection(prev => prev === 'layanan' ? null : 'layanan')}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-left transition ${
                  isLayananActive
                    ? 'text-[#0f3d5c] font-bold bg-slate-50'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>Layanan</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                  mobileExpandedSection === 'layanan' ? 'rotate-90 text-[#0f3d5c]' : 'text-slate-400'
                }`} />
              </button>
              {mobileExpandedSection === 'layanan' && (
                <div className="bg-slate-50 px-3 py-1 space-y-1 border-t border-slate-100">
                  <button
                    onClick={() => handleNavClick('layanan')}
                    className={`w-full px-3 py-2 text-sm rounded-md text-left transition ${
                      activePage === 'layanan' ? 'text-[#0f3d5c] font-bold bg-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    Layanan PPID
                  </button>
                  <button
                    onClick={() => handleNavClick('pengaduan')}
                    className={`w-full px-3 py-2 text-sm rounded-md text-left transition ${
                      activePage === 'pengaduan' ? 'text-[#0f3d5c] font-bold bg-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    Pengaduan
                  </button>
                  <button
                    onClick={() => handleNavClick('kontak')}
                    className={`w-full px-3 py-2 text-sm rounded-md text-left transition ${
                      activePage === 'kontak' ? 'text-[#0f3d5c] font-bold bg-white' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    Kontak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
