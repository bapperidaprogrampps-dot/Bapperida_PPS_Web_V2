import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  Shield, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { ActivePage } from '../types';
import { BapperidaLogo, PapuaSelatanLogo } from './Logos';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export function Footer({ setActivePage }: FooterProps) {
  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a2335] text-slate-300 border-t-4 border-amber-500">
      {/* 4 Kabupaten Banner Bar */}
      <div className="bg-[#081b2a] border-b border-slate-700/60 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold text-white">Wilayah Kerja Perencanaan Pembangunan Provinsi Papua Selatan:</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center font-medium text-slate-200">
            <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10">Kabupaten Merauke</span>
            <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10">Kabupaten Boven Digoel</span>
            <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10">Kabupaten Mappi</span>
            <span className="px-2.5 py-1 bg-white/5 rounded border border-white/10">Kabupaten Asmat</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Instansi Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <PapuaSelatanLogo className="h-12 w-auto" />
              <div className="h-10 w-px bg-slate-600"></div>
              <BapperidaLogo className="h-10 w-auto" showText={false} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">
                BAPPERIDA
              </h3>
              <p className="text-amber-400 font-semibold text-xs tracking-wider">
                PROVINSI PAPUA SELATAN
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah bertugas menyelenggarakan koordinasi perumusan kebijakan perencanaan makro, evaluasi pembangunan, dan penguatan ekosistem riset inovasi di bumi Anim Ha.
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Dasar Hukum Pembentukan: <span className="text-slate-200 font-medium">UU RI No. 14 Tahun 2022</span>
            </div>
          </div>

          {/* Col 2: Tautan Dokumen & Layanan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-amber-500/50 pb-1.5 inline-block">
              Dokumen Perencanaan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('dokumen')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>RPJPD Papua Selatan 2025–2045</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('dokumen')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>RKPD Papua Selatan Tahun 2025</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('dokumen')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Renstra Bapperida 2024–2026</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('dokumen')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>KUA-PPAS TA 2025</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('dokumen')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Laporan Riset & Inovasi (BRIDA)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Publik & Pengaduan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-amber-500/50 pb-1.5 inline-block">
              Layanan Publik & Regulasi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('layanan')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Layanan PPID (Permohonan Informasi)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('pengaduan')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sampaikan Pengaduan Masyarakat</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('pengaduan')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Lacak Status Tiket Pengaduan</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('data-statistik')} 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Data & Statistik Pembangunan</span>
                </button>
              </li>
              <li>
                <a 
                  href="https://sipd-ri.kemendagri.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5 text-slate-400"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Portal SIPD-RI Kemendagri</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Alamat & Kontak Resmi */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-amber-500/50 pb-1.5 inline-block">
              Sekretariat Kantor
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Provinsi Papua Selatan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-mono">bapperidaprogram.pps@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(0971) 321-789 / 0812-4800-2022</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Senin – Jumat : 08.00 – 16.00 WIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © 2026 Badan Perencanaan Pembangunan Daerah, Riset dan Inovasi Daerah (Bapperida) Provinsi Papua Selatan. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('profil')} className="hover:text-white transition">Visi & Misi</button>
            <span>•</span>
            <button onClick={() => handleNav('layanan')} className="hover:text-white transition">Maklumat Pelayanan</button>
            <span>•</span>
            <button onClick={() => handleNav('admin')} className="text-amber-400 hover:underline">Panel CMS Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
