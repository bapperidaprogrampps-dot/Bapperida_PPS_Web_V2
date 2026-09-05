import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  KeyRound, 
  HelpCircle,
  Building2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { ActivePage, AdminCredentials } from '../types';
import { GovernmentBrandHeader } from '../components/Logos';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  setActivePage: (page: ActivePage) => void;
}

export function AdminLoginView({ onLoginSuccess, setActivePage }: AdminLoginViewProps) {
  const [identifier, setIdentifier] = useState('bapperidaprogram.pps@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaultHint, setShowDefaultHint] = useState(true);

  // Ambil data kredensial saat ini untuk kemudahan bantuan demo/default
  const currentCreds = StorageService.getAdminCredentials();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Silakan masukkan email atau username administrator.');
      return;
    }

    if (!password) {
      setErrorMsg('Silakan masukkan kata sandi (password) Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = StorageService.validateAdminLogin(identifier, password);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleFillDefault = () => {
    setIdentifier(currentCreds.email);
    setPassword(currentCreds.passwordHash);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-900/5">
      {/* Decorative ambient background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0f3d5c]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <div className="mb-4">
          <button
            onClick={() => setActivePage('beranda')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0f3d5c] transition bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Portal</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden">
          {/* Card Header Header */}
          <div className="bg-[#0b283d] text-white p-6 sm:p-7 relative overflow-hidden text-center border-b border-slate-800">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#0f3d5c] rounded-full blur-2xl opacity-60"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Lock className="w-3 h-3" />
                <span>Autentikasi Terproteksi</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Login Administrator
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                Portal Manajemen Konten BAPPERIDA Provinsi Papua Selatan
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7 space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Email atau Username *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Contoh: bapperidaprogram.pps@gmail.com</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="bapperidaprogram.pps@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0f3d5c] focus:ring-2 focus:ring-[#0f3d5c]/15 transition"
                  />
                </div>
              </div>

              {/* Password Field with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi (Password) *
                  </label>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-500" />
                    <span>Terproteksi</span>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi administrator"
                    className="w-full pl-9 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0f3d5c] focus:ring-2 focus:ring-[#0f3d5c]/15 transition"
                  />
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-hidden cursor-pointer"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi (lihat kata sandi)'}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#0f3d5c]" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Klik ikon tanda mata untuk memeriksa ketikan sandi</span>
                  <span className="text-amber-600 font-semibold">{showPassword ? 'Sandi Terlihat' : 'Sandi Tersembunyi'}</span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#0f3d5c] hover:bg-[#154e74] active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>Masuk ke Panel Admin</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Default Credentials Box */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kredensial Default Administrator</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillDefault}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                >
                  Isi Otomatis
                </button>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/60 font-mono text-[11px] text-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Email:</span>
                  <span className="font-bold text-slate-800">{currentCreds.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Password:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">
                      {showDefaultHint ? currentCreds.passwordHash : '••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDefaultHint(!showDefaultHint)}
                      className="text-slate-400 hover:text-slate-700"
                      title="Lihat password"
                    >
                      {showDefaultHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-amber-800/80 leading-relaxed">
                Anda dapat mengubah kata sandi kapan saja melalui menu <strong>"Keamanan & Sandi"</strong> setelah berhasil masuk ke Panel Admin.
              </p>
            </div>
          </div>

          {/* Footer security note */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>BAPPERIDA Papua Selatan</span>
            </span>
            <span>Versi Portal 2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
