import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  X,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sprout,
  Smartphone,
  Cog,
  Store
} from 'lucide-react';
import CategoryShowcase from '../components/auth/CategoryShowcase';
import { 
  setStoredCustomer, 
  setStoredDealer, 
  authenticateUser, 
  executePendingAction 
} from '../utils/auth';
import { setStoredAdmin } from '../utils/adminAuth';

const CURRENT_YEAR = new Date().getFullYear();

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Sign In | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);

  // Validation function for login
  const validateForm = () => {
    const errs = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errs.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleQuickFill = (fillEmail, fillPassword) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
    setErrors({});
    setAuthError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await authenticateUser(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setAuthError(res.error);
        return;
      }

      const matchedUser = res.user;
      const userRole = matchedUser.role;

      if (userRole === 'customer') {
        // Authenticate customer session in localStorage (strictly no password)
        setStoredCustomer({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: 'customer',
          token: matchedUser.token
        });

        // Execute any pending shopping action (Add to Cart, Wishlist, Buy Now)
        const pendingDest = executePendingAction(matchedUser);

        setLoginSuccess({
          name: matchedUser.name,
          targetText: 'Customer authenticated. Restoring your session...'
        });

        setTimeout(() => {
          const destination = pendingDest || location.state?.from || '/';
          navigate(destination, { replace: true });
        }, 700);
      } else if (userRole === 'dealer') {
        // Authenticate dealer session in localStorage (strictly no password)
        setStoredDealer({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: 'dealer',
          dealerId: matchedUser.dealerId || (
            matchedUser.email?.toLowerCase().includes('dealer2') ? 'DEALER_002' :
            matchedUser.email?.toLowerCase().includes('dealer3') ? 'DEALER_003' :
            matchedUser.email?.toLowerCase().includes('dealer4') ? 'DEALER_004' :
            'DEALER_001'
          ),
          primaryCategory: matchedUser.primaryCategory,
          token: matchedUser.token
        });

        setLoginSuccess({
          name: matchedUser.name,
          targetText: 'Dealer authenticated. Redirecting to Dealer Dashboard...'
        });

        setTimeout(() => {
          navigate('/dealer/dashboard', { replace: true });
        }, 700);
      } else if (userRole === 'admin') {
        // Authenticate admin session in localStorage
        setStoredAdmin({
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: 'Super Admin',
          token: matchedUser.token
        });

        setLoginSuccess({
          name: matchedUser.name,
          targetText: 'Super Admin authenticated. Redirecting to Admin Dashboard...'
        });

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 700);
      } else {
        setAuthError(`Access restricted: Unsupported role "${userRole}". Please contact GROVE support.`);
      }
    } catch (err) {
      setIsSubmitting(false);
      setAuthError(err.message || 'Authentication error. Please try again.');
    }
  };

  // Handle forgot password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotSuccess(true);
  };

  const closeForgotModal = () => {
    setForgotModalOpen(false);
    setForgotEmail('');
    setForgotError('');
    setForgotSuccess(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF5] text-neutral-900 flex flex-col justify-between font-sans selection:bg-[#1B4332] selection:text-white px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Bar with Brand and Return Link */}
      <div className="max-w-[1140px] w-full mx-auto flex items-center justify-between pb-4 sm:pb-6">
        <Link 
          to="/" 
          className="font-extrabold text-[24px] sm:text-[28px] tracking-[-0.03em] text-[#012D1D] hover:opacity-90 transition-opacity focus:outline-none"
        >
          GROVE
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#1B4332] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden min-[380px]:inline">Back to Marketplace</span>
          <span className="min-[380px]:hidden">Back</span>
        </Link>
      </div>

      {/* Main Centered Split-Card Authentication Card */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-[1140px] bg-white rounded-[26px] sm:rounded-[32px] border border-neutral-200/80 shadow-[0_20px_50px_rgba(1,45,29,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT SIDE – Authentication Form (50%) */}
            <div className="w-full p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Mobile-only compact category banner */}
                <div className="block lg:hidden">
                  <CategoryShowcase isMobile={true} />
                </div>

                {/* Form Header */}
                <div className="mb-6 sm:mb-8">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1B4332] bg-[#EBF4EE] px-3 py-1 rounded-full inline-block mb-2.5">
                    Account Access
                  </span>
                  <h1 
                    className="text-2xl sm:text-3xl font-extrabold text-[#081C15] tracking-tight leading-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                  >
                    Welcome back to GROVE
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                    Sign in to manage verified agricultural products, tractor delivery tracking, and partner orders.
                  </p>
                </div>

                {/* Shopping Action Login Prompt */}
                {location.state?.message && !authError && !loginSuccess && (
                  <div className="mb-5 p-3.5 rounded-[14px] bg-[#E9F3ED] border border-[#1B4332]/25 text-[#1B4332] flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-[#1B4332] shrink-0" />
                    <span>{location.state.message}</span>
                  </div>
                )}

                {/* Login Success Alert */}
                {loginSuccess && (
                  <div className="mb-6 p-4 rounded-[16px] bg-[#EBF4EE] border border-[#40916C]/40 text-[#081C15] flex items-center gap-3 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-5 h-5 text-[#40916C] shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold">Welcome, {loginSuccess.name}!</p>
                      <p className="text-neutral-600 mt-0.5">{loginSuccess.targetText || 'Credentials authenticated. Redirecting...'}</p>
                    </div>
                  </div>
                )}

                {/* Invalid Credentials Error Banner */}
                {authError && (
                  <div className="mb-5 p-3.5 rounded-[14px] bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-xs animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold leading-snug">{authError}</p>
                    </div>
                  </div>
                )}

                {/* Quick Demo Fill Buttons for Development */}
                <div className="mb-5 p-3.5 rounded-[18px] bg-[#F1F6F3] border border-[#1B4332]/15 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-[#1B4332] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <KeyRound className="w-3.5 h-3.5 text-[#2C694E]" /> Quick Fill Demo Accounts
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">Click to auto-fill</span>
                  </div>

                  {/* Customer and Super Admin Row */}
                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('user1@grove.com', 'Password@123')}
                      className="py-1.5 px-2.5 rounded-[10px] bg-white border border-neutral-200 hover:border-[#1B4332] hover:bg-[#1B4332]/5 text-neutral-800 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 group-hover:scale-125 transition-transform" />
                        <span className="text-[#1B4332] text-xs font-extrabold">Customer</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono truncate">user1@grove.com</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickFill('admin@grove.com', 'Admin@123')}
                      className="py-1.5 px-2.5 rounded-[10px] bg-white border border-neutral-200 hover:border-[#1B4332] hover:bg-[#1B4332]/5 text-neutral-800 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 group-hover:scale-125 transition-transform" />
                        <span className="text-[#1B4332] text-xs font-extrabold">Admin</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono truncate">admin@grove.com</span>
                    </button>
                  </div>

                  {/* Category-Specific Dealers */}
                  <div className="pt-2 border-t border-[#1B4332]/10">
                    <div className="text-[10px] uppercase tracking-wider text-neutral-600 font-bold mb-1.5 flex items-center gap-1">
                      <Store className="w-3 h-3 text-[#1B4332]" />
                      <span>Category Dealers (Auto-Fills Category Lock):</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickFill('dealer1@grove.com', 'Password@123')}
                        className="py-2 px-1.5 rounded-[10px] bg-white border border-emerald-300 hover:border-[#1B4332] hover:bg-emerald-50/70 text-neutral-800 transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs group"
                        title="Dealer 1: Agriculture & Farming"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <Sprout className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="text-[#1B4332] text-[11px] font-extrabold">Dealer 1</span>
                        </div>
                        <span className="text-[9.5px] text-emerald-800 font-bold">Agri</span>
                        <span className="text-[8.5px] text-neutral-400 font-mono truncate max-w-full">dealer1@grove.com</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickFill('dealer2@grove.com', 'Password@123')}
                        className="py-2 px-1.5 rounded-[10px] bg-white border border-blue-300 hover:border-blue-700 hover:bg-blue-50/70 text-neutral-800 transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs group"
                        title="Dealer 2: Electronics & Gadgets"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <Smartphone className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                          <span className="text-blue-900 text-[11px] font-extrabold">Dealer 2</span>
                        </div>
                        <span className="text-[9.5px] text-blue-800 font-bold">Electronics</span>
                        <span className="text-[8.5px] text-neutral-400 font-mono truncate max-w-full">dealer2@grove.com</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickFill('dealer3@grove.com', 'Password@123')}
                        className="py-2 px-1.5 rounded-[10px] bg-white border border-rose-300 hover:border-rose-700 hover:bg-rose-50/70 text-neutral-800 transition-all text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs group"
                        title="Dealer 3: Automotive & Spare Parts"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <Cog className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                          <span className="text-rose-900 text-[11px] font-extrabold">Dealer 3</span>
                        </div>
                        <span className="text-[9.5px] text-rose-800 font-bold">Automotive</span>
                        <span className="text-[8.5px] text-neutral-400 font-mono truncate max-w-full">dealer3@grove.com</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label 
                      htmlFor="login-email"
                      className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          if (authError) setAuthError('');
                        }}
                        placeholder="e.g. dealer@grove.com"
                        disabled={isSubmitting || loginSuccess}
                        className={`w-full pl-10 pr-3.5 py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                          errors.email 
                            ? 'border-red-400 ring-2 ring-red-100' 
                            : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label 
                        htmlFor="login-password"
                        className="block text-xs font-bold text-neutral-700 uppercase tracking-wider"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotModalOpen(true);
                        }}
                        className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                          if (authError) setAuthError('');
                        }}
                        placeholder="Enter your password"
                        disabled={isSubmitting || loginSuccess}
                        className={`w-full pl-10 pr-10 py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                          errors.password 
                            ? 'border-red-400 ring-2 ring-red-100' 
                            : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 stroke-[2]" />
                        ) : (
                          <Eye className="w-4 h-4 stroke-[2]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Primary Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || Boolean(loginSuccess)}
                      className="w-full py-3.5 px-6 rounded-[14px] bg-[#012D1D] hover:bg-[#081C15] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#012D1D]/15 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to GROVE</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Bottom Switch Link to Sign Up */}
              <div className="mt-6 pt-5 border-t border-neutral-100 text-center text-xs sm:text-[13px] text-neutral-600">
                <span>Don&apos;t have an account? </span>
                <Link 
                  to="/signup" 
                  className="font-bold text-[#012D1D] hover:text-[#1B4332] hover:underline focus:outline-none"
                >
                  Create an account
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE – Category Showcase (50% on Desktop) */}
            <div className="hidden lg:block w-full p-4 lg:p-5">
              <CategoryShowcase isMobile={false} />
            </div>

          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-[1140px] w-full mx-auto text-center pt-6 text-xs text-neutral-400">
        <p>© {CURRENT_YEAR} GROVE Marketplace. All rights reserved. Secure SSL Authentication.</p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeForgotModal}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#1B4332] flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#081C15] tracking-tight">
                  Reset Password
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  GROVE Account Recovery
                </p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-[16px] bg-[#EBF4EE] border border-[#40916C]/30 text-xs text-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#1B4332]">
                    <CheckCircle2 className="w-4 h-4 text-[#40916C]" />
                    <span>Password Reset Request Received</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed text-[11.5px]">
                    If an account is associated with <strong>{forgotEmail}</strong>, password reset instructions have been dispatched. Please check your inbox.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full py-2.5 rounded-[12px] bg-[#012D1D] hover:bg-[#081C15] text-white font-bold text-xs transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} noValidate className="space-y-3.5">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Enter your registered GROVE email address. We will verify your account and initiate the recovery process.
                </p>

                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotError) setForgotError('');
                      }}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAF5] border border-neutral-300 rounded-[12px] text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1B4332] focus:bg-white transition-all"
                    />
                  </div>
                  {forgotError && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{forgotError}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-[12px] bg-[#012D1D] hover:bg-[#081C15] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="py-2.5 px-4 rounded-[12px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
