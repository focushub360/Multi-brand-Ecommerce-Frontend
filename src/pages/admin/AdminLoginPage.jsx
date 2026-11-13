import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { isAdminAuthenticated, validateAdminCredentials, setStoredAdmin } from '../../utils/adminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    document.title = 'Admin Sign In | GROVE Enterprise';
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await validateAdminCredentials(email, password);
      setIsLoading(false);

      if (result.success) {
        setStoredAdmin(result.admin);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Authentication error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3FCF3] flex flex-col justify-between font-sans selection:bg-[#012D1D] selection:text-white">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#C1C8C2]/50 bg-white/80 backdrop-blur-xs px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#012D1D] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-[#AEEECB]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#012D1D] font-heading">
              GROVE <span className="text-xs font-mono font-bold text-[#2C694E] uppercase tracking-wider ml-1">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              to="/login"
              className="text-[#3F4943] hover:text-[#012D1D] transition-colors hidden sm:inline-flex items-center gap-1"
            >
              Dealer / User Login <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
            <span className="hidden sm:inline-block text-[#C1C8C2]">|</span>
            <Link
              to="/"
              className="text-[#3F4943] hover:text-[#012D1D] transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xl overflow-hidden">
            {/* Header Strip */}
            <div className="bg-[#012D1D] p-6 sm:p-8 text-white relative overflow-hidden">
              {/* Subtle decorative background circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[#AEEECB] text-xs font-mono font-medium mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Platform Operations Suite</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                  Admin Sign In
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
                  Enter your credentials to access the GROVE central governance console.
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{error}</span>
                </div>
              )}

              {/* Quick Fill Admin Credentials */}
              <div className="p-3 rounded-2xl bg-[#EBF4EE] border border-[#1B4332]/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#012D1D] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <KeyRound className="w-3.5 h-3.5 text-[#2C694E]" /> Quick Fill Demo Admin
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">Click to auto-fill</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@grove.com');
                    setPassword('Admin@123');
                    setError('');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-neutral-200 hover:border-[#012D1D] hover:bg-[#012D1D]/5 text-neutral-800 text-xs font-bold transition-all text-center flex items-center justify-between cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span className="text-[#012D1D] font-extrabold">Super Admin</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">admin@grove.com / Admin@123</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3F4943] font-mono">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717973]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      autoComplete="username"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/70 text-[#151D18] text-sm font-medium placeholder:text-[#717973] focus:outline-none focus:border-[#012D1D] focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3F4943] font-mono">
                      Password
                    </label>
                    <span className="text-[11px] text-[#717973] font-mono">256-bit encrypted</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717973]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/70 text-[#151D18] text-sm font-medium placeholder:text-[#717973] focus:outline-none focus:border-[#012D1D] focus:bg-white transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#717973] hover:text-[#012D1D] cursor-pointer p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </div>
                  ) : (
                    <>
                      <span>Enter Admin Suite</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="pt-2 border-t border-[#C1C8C2]/40 text-center">
                <p className="text-[11px] text-[#717973] font-medium leading-relaxed">
                  Platform access is strictly monitored and logged. Unauthorized attempts are recorded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#717973] font-mono">
        GROVE Agriculture & Industrial Operations Platform © 2026
      </footer>
    </div>
  );
}

