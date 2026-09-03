import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  ExternalLink
} from 'lucide-react';
import { PapuaSelatanLogo } from '../components/Logos';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setSentSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          <Phone className="w-4 h-4" />
          <span>Hubungi Kami</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kontak & Lokasi Kantor Bapperida
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
          Silakan hubungi sekretariat Bapperida Provinsi Papua Selatan untuk koordinasi perencanaan pembangunan, pertanyaan seputar riset daerah, atau konsultasi dokumen resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <PapuaSelatanLogo className="h-12 w-auto" />
              <div>
                <h3 className="font-bold text-base text-slate-900 leading-tight">
                  BAPPERIDA PROVINSI PAPUA SELATAN
                </h3>
                <span className="text-xs text-amber-600 font-semibold">
                  Pemerintah Daerah Otonom Baru Wilayah Anim Ha
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Alamat Kantor:</strong>
                  <span>
                    Kompleks Pusat Pemerintahan Terpadu Pemerintah Provinsi Papua Selatan, Salor, Distrik Kurik, Kabupaten Merauke, Provinsi Papua Selatan — Kode Pos 99611
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Email Resmi:</strong>
                  <span className="font-mono text-[#0f3d5c] font-bold">bapperidaprogram.pps@gmail.com</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">info@bapperida.papuaselatan.go.id</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Telepon / Fax:</strong>
                  <span>(0971) 321-789 / 0812-4800-2022</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Jam Pelayanan Kantor:</strong>
                  <span>Senin – Jumat : 08.00 – 16.00 WIT</span>
                  <div className="text-[11px] text-slate-500">Sabtu, Minggu & Hari Libur Nasional: Tutup</div>
                </div>
              </div>
            </div>
          </div>

          {/* District Contacts */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-900 block text-sm">
              Koordinasi Bersama Bappeda 4 Kabupaten:
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li>• <strong>Bappeda Kab. Merauke:</strong> Jl. Brawijaya No. 1, Merauke</li>
              <li>• <strong>Bappeda Kab. Boven Digoel:</strong> Jl. Trans Papua KM 2, Tanah Merah</li>
              <li>• <strong>Bappeda Kab. Mappi:</strong> Kompleks Perkantoran Kepi, Mappi</li>
              <li>• <strong>Bappeda Kab. Asmat:</strong> Jl. Dolog, Agats, Asmat</li>
            </ul>
          </div>
        </div>

        {/* Contact Form & Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Kirim Pesan / Pertanyaan Cepat
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Tim kesekretariatan Bapperida akan membalas pesan Anda ke alamat email yang dicantumkan.
              </p>
            </div>

            {sentSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pesan Anda telah berhasil dikirim ke sekretariat Bapperida PPS!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjek Pesan *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Contoh: Konsultasi Data RKPD / Koordinasi Penelitian"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pesan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tuliskan pertanyaan atau permohonan koordinasi Anda..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] shadow-xs transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Map Visual */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                Peta Kawasan Pusat Pemerintahan Terpadu Salor, Merauke
              </span>
              <a 
                href="https://maps.google.com/?q=Merauke,Papua+Selatan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#0f3d5c] hover:underline flex items-center gap-1 font-semibold"
              >
                Buka Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Visual map preview canvas */}
            <div className="h-64 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <iframe
                title="Peta Lokasi Merauke Papua Selatan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d508492.21570775926!2d140.06371728258525!3d-8.498905389643194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2cbca2a41d5b3f27%3A0x3039d80b220cc30!2sMerauke%2C%20Merauke%20Regency%2C%20South%20Papua!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
