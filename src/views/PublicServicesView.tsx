import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Download, 
  Send, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

export function PublicServicesView() {
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [purpose, setPurpose] = useState('');
  const [informationDetails, setInformationDetails] = useState('');
  const [format, setFormat] = useState<'Salinan Digital (PDF)' | 'Hardcopy' | 'Kunjungan Langsung'>('Salinan Digital (PDF)');
  
  const [submittedRegNo, setSubmittedRegNo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !phone || !purpose || !informationDetails) return;

    const res = StorageService.addInfoRequest({
      applicantName,
      email,
      phone,
      institution: institution || 'Perorangan / Mandiri',
      purpose,
      informationDetails,
      format
    });

    setSubmittedRegNo(res.requestNo);
    setApplicantName('');
    setEmail('');
    setPhone('');
    setInstitution('');
    setPurpose('');
    setInformationDetails('');
  };

  const downloadFormTemplate = (type: 'permohonan' | 'keberatan') => {
    const title = type === 'permohonan' 
      ? 'FORMULIR PERMOHONAN INFORMASI PUBLIK (PPID)' 
      : 'FORMULIR PENGAJUAN KEBERATAN INFORMASI PUBLIK (PPID)';
    
    const content = `PEMERINTAH PROVINSI PAPUA SELATAN
PEJABAT PENGELOLA INFORMASI DAN DOKUMENTASI (PPID)
BADAN PERENCANAAN PEMBANGUNAN DAERAH, RISET DAN INOVASI DAERAH (BAPPERIDA)
Salor, Merauke, Provinsi Papua Selatan
===================================================================
${title}
Berdasarkan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik

I. DATA PEMOHON
1. Nama Lengkap       : __________________________________________________
2. No. KTP / NIK      : __________________________________________________
3. Alamat Domisili    : __________________________________________________
4. No. Telp / HP      : __________________________________________________
5. Email              : __________________________________________________
6. Instansi / Lembaga : __________________________________________________

II. RINCIAN PERMOHONAN INFORMASI
1. Rincian Informasi  : __________________________________________________
   yang dibutuhkan    : __________________________________________________
2. Tujuan Penggunaan  : __________________________________________________
3. Bentuk Salinan     : [ ] Softcopy / PDF     [ ] Salinan Cetak / Hardcopy

Tanggal Pengajuan : ___________________
Tanda Tangan Pemohon :

( ______________________________ )
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form_${type}_PPID_Bapperida_Papua_Selatan.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <ScrollReveal variant="fade-up" duration={0.6}>
        <div className="bg-[#0f3d5c] text-white p-6 sm:p-8 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Layanan Informasi Publik (PPID)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Layanan PPID & Keterbukaan Informasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) Pelaksana Bapperida Provinsi Papua Selatan melayani hak masyarakat untuk memperoleh informasi perencanaan pembangunan secara cepat, tepat waktu, dan berbiaya ringan.
          </p>
        </div>
      </ScrollReveal>

      {/* Maklumat Pelayanan */}
      <ScrollReveal variant="fade-up" duration={0.6} delay={0.05}>
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-6 text-slate-800">
          <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            Maklumat Pelayanan PPID Bapperida Provinsi Papua Selatan
          </h3>
          <p className="text-xs sm:text-sm mt-2 text-amber-900 leading-relaxed italic">
            &ldquo;Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan informasi publik sesuai standar pelayanan yang telah ditetapkan, memberikan kemudahan akses data perencanaan pembangunan dan riset kepada masyarakat, serta siap menerima sanksi apabila pelayanan yang diberikan tidak sesuai dengan standar operasional prosedur.&rdquo;
          </p>
        </div>
      </ScrollReveal>

      {/* 5 Tahap Alur Pelayanan Informasi */}
      <ScrollReveal variant="fade-up" duration={0.65}>
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Standar Operasional Prosedur
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Alur Permohonan Informasi Publik
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Jangka waktu tanggapan resmi maksimal 10 hari kerja (dapat diperpanjang 7 hari kerja dengan pemberitahuan tertulis).
            </p>
          </div>

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '1',
                title: 'Pengajuan Permohonan',
                desc: 'Pemohon mengisi formulir online di portal ini atau datang langsung ke loket PPID Salor dengan melampirkan identitas diri (KTP).'
              },
              {
                step: '2',
                title: 'Verifikasi & Registrasi',
                desc: 'Petugas PPID memeriksa kelengkapan permohonan dan menerbitkan bukti tanda terima register permohonan informasi.'
              },
              {
                step: '3',
                title: 'Koordinasi Bidang',
                desc: 'PPID meneruskan permintaan ke bidang pengampu (Perencanaan, Infrakewil, BRIDA, dll) untuk menyiapkan bahan dokumen.'
              },
              {
                step: '4',
                title: 'Uji Konsekuensi',
                desc: 'Memastikan informasi yang diminta tidak termasuk dalam kategori informasi yang dikecualikan (rahasia negara/pribadi).'
              },
              {
                step: '5',
                title: 'Penyerahan Informasi',
                desc: 'Dokumen diserahkan kepada pemohon dalam format digital PDF atau salinan resmi paling lambat 10 hari kerja.'
              }
            ].map(item => (
              <StaggerItem key={item.step} variant="zoom-in">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative h-full">
                  <div className="w-8 h-8 rounded-full bg-[#0f3d5c] text-white flex items-center justify-center text-xs font-bold font-mono">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Downloadable Official Forms */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Unduh Berkas Formulir Cetak Resmi:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => downloadFormTemplate('permohonan')}
                className="px-3 py-1.5 text-xs font-semibold text-[#0f3d5c] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Form Permohonan Informasi (PDF)
              </button>
              <button
                onClick={() => downloadFormTemplate('keberatan')}
                className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Form Pengajuan Keberatan (PDF)
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Online Form Application */}
      <ScrollReveal variant="fade-up" duration={0.65}>
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Formulir Online
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Kirim Permohonan Informasi Publik PPID
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Isi formulir di bawah ini dengan lengkap untuk mendapatkan nomor tanda terima elektronik resmi.
            </p>
          </div>

          {submittedRegNo && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Permohonan Berhasil Dikirim!
              </div>
              <p className="text-xs leading-relaxed">
                Permohonan informasi Anda telah terdaftar dalam sistem PPID Bapperida Provinsi Papua Selatan dengan nomor registrasi resmi:
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono font-bold text-sm text-emerald-800 inline-block">
                {submittedRegNo}
              </div>
              <p className="text-[11px] text-emerald-700">
                Silakan simpan nomor ini. Tim PPID kami akan meninjau dan mengirimkan konfirmasi melalui email / WhatsApp Anda maksimal dalam 10 hari kerja.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pemohon *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  placeholder="Sesuai KTP"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instansi / Lembaga / Universitas
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="Contoh: Universitas Musamus / Lembaga Adat / Pribadi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contoh: 081248xxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rincian Dokumen / Informasi yang Dibutuhkan *
              </label>
              <textarea
                required
                rows={3}
                value={informationDetails}
                onChange={e => setInformationDetails(e.target.value)}
                placeholder="Sebutkan jenis data, tahun anggaran, atau lingkup kajian yang ingin diminta secara spesifik..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tujuan Penggunaan Informasi *
              </label>
              <input
                type="text"
                required
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="Contoh: Penelitian Skripsi / Kajian Kebijakan / Transparansi Publik"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-[#0f3d5c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Format Salinan yang Diinginkan
              </label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value as any)}
                className="w-full sm:w-72 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-hidden cursor-pointer"
              >
                <option value="Salinan Digital (PDF)">Salinan Digital (File PDF via Email)</option>
                <option value="Hardcopy">Salinan Cetak / Hardcopy (Ambil di Kantor Salor)</option>
                <option value="Kunjungan Langsung">Kunjungan / Wawancara Langsung</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0f3d5c] hover:bg-[#154e74] transition flex items-center gap-2 cursor-pointer"
                id="submit-ppid-request-btn"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Permohonan Informasi</span>
              </button>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
