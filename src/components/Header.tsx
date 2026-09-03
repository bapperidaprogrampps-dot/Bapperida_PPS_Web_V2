import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Clock, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Bell
} from 'lucide-react';
import { ActivePage } from '../types';
import { GovernmentBrandHeader } from './Logos';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
}

export function Header({ activePage, setActivePage, onOpenSearch, isAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [witTime, setWitTime] = useState('');

  // Live WIT Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // WIT is UTC+9
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jayapura',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      try {
        setWitTime(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIT');
      } catch {
        setWitTime(now.toLocaleTimeString('id-ID') + ' WIT');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'dokumen', label: 'Dokumen Perencanaan' },
    { id: 'berita', label: 'Berita' },
    { id: 'layanan', label: 'Layanan PPID' },
    { id: 'pengaduan', label: 'Pengaduan' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'data-statistik', label: 'Data & Statistik' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-slate-200">
      {/* Top Notification Bar */}
      <div className="bg-[#0b283d] text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Left: Location & Time */}
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Salor, Merauke - Papua Selatan</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-amber-300 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{witTime || 'Waktu Indonesia Timur'}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>bapperidaprogram.pps@gmail.com</span>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => handleNavClick('pengaduan')}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition"
              id="top-quick-track-btn"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Lacak Tiket</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNavClick('dokumen')}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition"
              id="top-quick-rpjpd-btn"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>RPJPD 2025–2045</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded transition font-medium ${
                isAdmin 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              id="top-admin-portal-btn"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Panel Admin (Aktif)' : 'Login Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Agency identity */}
          <GovernmentBrandHeader 
            variant="light" 
            onClick={() => handleNavClick('beranda')} 
          />

          {/* Desktop Right Tools */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
              title="Pencarian Cepat"
              id="nav-search-button"
            >
              <Search className="w-4 h-4 text-[#0f3d5c]" />
              <span className="hidden xl:inline">Cari Berkas & Berita...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => handleNavClick('pengaduan')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0f3d5c] hover:bg-[#154e74] rounded-lg shadow-sm transition flex items-center gap-1.5"
              id="nav-cta-pengaduan-btn"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Layanan Pengaduan</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Buka Menu Navigasi"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Strip */}
        <nav className="hidden lg:flex items-center gap-1 border-t border-slate-100 py-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#0f3d5c] text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-[#0f3d5c] hover:bg-slate-100'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg text-left transition ${
                    isActive
                      ? 'bg-[#0f3d5c] text-white font-semibold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  id={`mobile-nav-${item.id}`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold bg-slate-900 text-white rounded-lg shadow-xs"
                id="mobile-nav-admin"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{isAdmin ? 'Masuk Dashboard Admin' : 'Login Staf Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
