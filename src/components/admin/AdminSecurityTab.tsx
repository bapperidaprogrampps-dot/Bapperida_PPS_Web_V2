import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  UserCheck, 
  Mail, 
  ShieldAlert, 
  Info, 
  Check, 
  X, 
  Shield,
  UserX,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface AdminSecurityTabProps {
  showToast: (msg: string) => void;
  onDataChanged?: () => void;
}

export function AdminSecurityTab({ showToast, onDataChanged }: AdminSecurityTabProps) {
  const [currentCredentials, setCurrentCredentials] = useState(StorageService.getAdminCredentials());
  const [isCredsDisabled, setIsCredsDisabled] = useState(() => StorageService.isDefaultCredentialsDisabled());
  const [isPasswordChanged, setIsPasswordChanged] = useState(() => StorageService.isPasswordChanged());

  // Form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles (Fitur tanda mata)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal state
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Validasi kekuatan sandi baru
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Skor kekuatan sandi
  const getStrengthScore = () => {
    if (!newPassword) return 0;
    let score = 0;
    if (hasMinLength) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (hasUppercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;
    return score;
  };

  const strengthScore = getStrengthScore();
  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { label: 'Sangat Lemah', color: 'bg-rose-500', text: 'text-rose-600' };
    if (strengthScore <= 2) return { label: 'Cukup', color: 'bg-amber-500', text: 'text-amber-600' };
    if (strengthScore <= 3) return { label: 'Kuat', color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { label: 'Sangat Kuat & Aman', color: 'bg-teal-600', text: 'text-teal-700' };
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!oldPassword) {
      setErrorMessage('Harap masukkan kata sandi Anda saat ini.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.');
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMessage('Kata sandi baru tidak boleh sama dengan kata sandi lama.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = StorageService.changeAdminPassword(oldPassword, newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage('Kata sandi berhasil diperbarui! Sistem kini terkunci pada akun tunggal dengan kata sandi baru Anda.');
        showToast('Kata sandi berhasil diubah & akses dikunci untuk 1 admin.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        const freshCreds = StorageService.getAdminCredentials();
        setCurrentCredentials(freshCreds);
        setIsPasswordChanged(true);
        setIsCredsDisabled(true);
        if (onDataChanged) onDataChanged();
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleResetToDefault = () => {
    const res = StorageService.resetAdminPasswordToDefault();
    setShowResetConfirmModal(false);
    const freshCreds = StorageService.getAdminCredentials();
    setCurrentCredentials(freshCreds);
    setIsPasswordChanged(false);
    setIsCredsDisabled(false);
    showToast(res.message);
    setSuccessMessage('Kata sandi telah dikembalikan ke sandi awal bawaan sistem (Tehkotak_213).');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (onDataChanged) onDataChanged();
  };

  const handleToggleDefaultCreds = () => {
    const nextVal = !isCredsDisabled;
    StorageService.setDefaultCredentialsDisabled(nextVal);
    setIsCredsDisabled(nextVal);
    showToast(
      nextVal
        ? 'Bantuan kredensial di layar login dinonaktifkan.'
        : 'Bantuan kredensial di layar login diaktifkan.'
    );
    if (onDataChanged) onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* 1. Kebijakan & Pengaturan Hanya 1 Admin Banner */}
      <div className="bg-gradient-to-r from-[#0b283d] via-[#0f3d5c] to-[#134b70] text-white p-6 sm:p-7 rounded-2xl border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Kebijakan Keamanan: Hanya 1 Administrator (Single Admin Policy)</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pengaturan Akses Akun Tunggal & Proteksi Kata Sandi
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Portal BAPPERIDA Papua Selatan menerapkan aturan ketat: <strong>Hanya ada 1 akun Administrator utama</strong>. Jika Anda mengubah kata sandi di bawah ini, sandi bawaan lama akan <strong>langsung dibatalkan secara permanen</strong>. Pengguna lain tidak akan bisa masuk selain menggunakan kata sandi baru yang telah Anda tentukan.
            </p>
          </div>

          {/* Status Badge Container */}
          <div className="shrink-0">
            {isPasswordChanged ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 rounded-xl backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>TERKUNCI & TERPROTEKSI</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-tight">
                  Sandi kustom aktif. Sandi bawaan lama telah hangus.
                </p>
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-400/40 px-4 py-3 rounded-xl backdrop-blur-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>MASIH SANDI BAWAAN</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-tight">
                  Ubah kata sandi di bawah untuk mengunci akses 1 admin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Ganti Password (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0f3d5c]" />
                <span>Formulir Perubahan Kata Sandi Akun Tunggal</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan tanda mata di sebelah kanan kolom untuk memeriksa ketikan karakter kata sandi Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Reset ke kata sandi bawaan jika darurat"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Darurat</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* 1. Kata Sandi Lama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Sandi Lama / Saat Ini *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama Anda"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0f3d5c] focus:ring-2 focus:ring-[#0f3d5c]/15 transition"
                />
                {/* Tanda Mata Tombol Toggle */}
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer"
                  title={showOldPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-label="Toggle old password visibility"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4 text-[#0f3d5c]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* 2. Kata Sandi Baru */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi Baru (Kunci Akun Tunggal) *
                </label>
                {newPassword && (
                  <span className={`text-[10px] font-bold ${getStrengthLabel().text}`}>
                    Kekuatan: {getStrengthLabel().label}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketikkan kata sandi baru (min. 6 karakter)"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0f3d5c] focus:ring-2 focus:ring-[#0f3d5c]/15 transition"
                />
                {/* Tanda Mata Tombol Toggle */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer"
                  title={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-[#0f3d5c]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter Bar */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 rounded-full ${
                          strengthScore >= step ? getStrengthLabel().color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Checklist criteria */}
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-medium' : ''}`}>
                      {hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                      Minimal 6 karakter
                    </span>
                    <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-700 font-medium' : ''}`}>
                      {hasUppercase ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                      Huruf besar (A-Z)
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-medium' : ''}`}>
                      {hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                      Angka (0-9)
                    </span>
                    <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-medium' : ''}`}>
                      {hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                      Karakter khusus / simbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Konfirmasi Kata Sandi Baru */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Ulangi Kata Sandi Baru *
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${isMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isMatch ? '✓ Sandi Cocok' : '✗ Belum Cocok'}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi pengetikan kata sandi baru"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden transition ${
                    confirmPassword && !isMatch
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                      : confirmPassword && isMatch
                      ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15'
                      : 'border-slate-300 focus:border-[#0f3d5c] focus:ring-2 focus:ring-[#0f3d5c]/15'
                  }`}
                />
                {/* Tanda Mata Tombol Toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer"
                  title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-[#0f3d5c]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Peringatan Penguncian Otomatis */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Konsekuensi Perubahan Sandi (Penguncian 1 Admin):</span>
              </div>
              <p className="leading-relaxed">
                Setelah tombol simpan ditekan, sistem otomatis membatalkan sandi bawaan lama. Pengguna lain tidak akan bisa masuk selain dengan mengetikkan kata sandi baru ini.
              </p>
            </div>

            {/* Tombol Simpan Password Baru */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#0f3d5c] hover:bg-[#154e74] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Simpan & Kunci Sandi Baru (Hanya 1 Admin)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Info Akun & Standar Keamanan (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Info Akun Aktif */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Informasi Akun Administrator Tunggal</span>
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Resmi:</span>
                </span>
                <span className="font-bold text-slate-900 font-mono text-[11px] truncate max-w-[180px]">
                  {currentCredentials.email}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500">Username Alternatif:</span>
                <span className="font-bold text-slate-900 font-mono">{currentCredentials.username}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500">Mode Hak Akses:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Hanya 1 Administrator Tunggal
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/70">
                <span className="text-slate-500">Status Kata Sandi:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isPasswordChanged
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {isPasswordChanged ? 'Sandi Kustom (Terkunci)' : 'Sandi Bawaan (Default)'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terakhir Diganti:</span>
                </span>
                <span className="font-medium text-slate-700 text-[11px]">
                  {currentCredentials.lastPasswordChangedAt
                    ? new Date(currentCredentials.lastPasswordChangedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Bawaan Sistem'}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Aturan Penguncian Akun Tunggal */}
          <div className="bg-sky-50/80 p-5 rounded-2xl border border-sky-200 text-xs text-sky-950 space-y-3">
            <div className="font-extrabold flex items-center gap-2 text-sky-950 text-sm">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>3 Aturan Penguncian Akun Tunggal</span>
            </div>

            <div className="space-y-2 text-[11px] text-sky-900 leading-relaxed">
              <div className="p-2.5 bg-white/80 rounded-xl border border-sky-200/60 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold">Hanya 1 Admin yang Diizinkan</strong>
                  <span>Sistem membatasi hak akses pengelolaan portal eksklusif untuk 1 akun resmi (bapperidaprogram.pps@gmail.com).</span>
                </div>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-sky-200/60 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold">Penolakan Mutlak Sandi Lama</strong>
                  <span>Jika Anda telah mengganti kata sandi, siapa pun yang mencoba login dengan sandi lama atau sandi bawaan default otomatis ditolak oleh sistem.</span>
                </div>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-sky-200/60 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold">Bantuan Kredensial Otomatis Tertutup</strong>
                  <span>Bantuan sandi default pada menu login publik otomatis dinonaktifkan agar kata sandi baru tidak terbaca oleh orang lain.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pengaturan Kredensial Default Login Administrator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Visibilitas Bantuan di Menu Login
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isCredsDisabled 
                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isCredsDisabled ? 'Bantuan Terkunci' : 'Bantuan Terbuka'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Kendalikan apakah kotak bantuan kredensial default di halaman login ditampilkan atau disembunyikan.
            </p>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5 flex-1 pr-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Kunci Bantuan Kredensial di Halaman Login
                </span>
                <span className="text-[11px] text-slate-500 block leading-snug">
                  {isCredsDisabled 
                    ? 'Bantuan kredensial disembunyikan. Pengunjung tidak dapat melihat petunjuk kredensial.' 
                    : 'Bantuan kredensial masih tampil untuk keperluan pengujian.'}
                </span>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleDefaultCreds}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isCredsDisabled ? 'bg-rose-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isCredsDisabled}
                title={isCredsDisabled ? 'Klik untuk mengaktifkan kembali' : 'Klik untuk menonaktifkan kredensial'}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isCredsDisabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Reset Password */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Kembalikan Kata Sandi ke Bawaan Sistem?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kata sandi administrator akan direset kembali ke sandi awal default:
                <br />
                <strong className="text-slate-800 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
                  Tehkotak_213
                </strong>
                <br />
                <span className="text-[11px] text-amber-700 font-medium block mt-1">
                  Perhatian: Setelah direset, bantuan login default akan aktif kembali sampai Anda mengubah kata sandi baru.
                </span>
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Ya, Reset Sandi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
