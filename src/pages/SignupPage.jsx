import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import CategoryShowcase from '../components/auth/CategoryShowcase';
import { authApi } from '../services/apiClient.js';

const CURRENT_YEAR = new Date().getFullYear();

export default function SignupPage() {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Create Account | GROVE Marketplace';
    window.scrollTo(0, 0);
  }, []);

  // Dynamic Password Security Rules calculation
  const pwd = formData.password;
  const passRules = {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
  };
  const isPasswordSecure = Object.values(passRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let cleanVal = type === 'checkbox' ? checked : value;

    if (name === 'mobileNumber') {
      cleanVal = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: cleanVal }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    // 1. Full Name
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      errs.fullName = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    // 2. Email Address
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    // 3. Indian Mobile Number (10 digits starting with 6-9)
    if (!formData.mobileNumber) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
    }

    // 4. Password security
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (!isPasswordSecure) {
      errs.password = 'Password must meet all 5 requirements listed below.';
    }

    // 5. Confirm Password
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    // 6. Terms & Conditions
    if (!formData.agreedToTerms) {
      errs.agreedToTerms = 'You must accept the Terms & Conditions and Privacy Policy to register.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await authApi.register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.mobileNumber.trim()
      });

      setIsSubmitting(false);
      setSignupSuccess(true);
    } catch (apiErr) {
      setIsSubmitting(false);

      if (apiErr.status === 409) {
        setErrors((prev) => ({ ...prev, email: apiErr.message || 'An account with this email already exists.' }));
        return;
      }

      setErrors((prev) => ({ ...prev, general: apiErr.message || 'Registration failed. Please check your details and try again.' }));
    }
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
            
            {/* LEFT SIDE – Registration Form (50%) */}
            <div className="w-full p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Mobile-only compact category banner */}
                <div className="block lg:hidden">
                  <CategoryShowcase isMobile={true} />
                </div>

                {/* Form Header */}
                <div className="mb-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1B4332] bg-[#EBF4EE] px-3 py-1 rounded-full inline-block mb-2.5">
                    Merchant &amp; Customer Registration
                  </span>
                  <h1 
                    className="text-2xl sm:text-3xl font-extrabold text-[#081C15] tracking-tight leading-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                  >
                    Create your GROVE Account
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                    Join India&apos;s verified marketplace for agriculture, electronics, and automotive essentials.
                  </p>
                </div>

                {/* Successful Registration State */}
                {signupSuccess ? (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-5 sm:p-6 rounded-[20px] bg-[#EBF4EE] border border-[#40916C]/40 text-[#081C15]">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#40916C] shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-base sm:text-lg text-[#1B4332]">
                            Account Created Successfully!
                          </h3>
                          <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed">
                            Welcome, <strong>{formData.fullName}</strong>. Your account has been registered with GROVE. You can now sign in using your email and password.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Link
                        to="/login"
                        className="w-full sm:flex-1 py-3 px-5 rounded-[14px] bg-[#012D1D] hover:bg-[#081C15] text-white font-bold text-xs sm:text-sm text-center shadow-md transition-all cursor-pointer"
                      >
                        Proceed to Sign In
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSignupSuccess(false);
                          setFormData({
                            fullName: '',
                            email: '',
                            mobileNumber: '',
                            password: '',
                            confirmPassword: '',
                            agreedToTerms: false,
                          });
                        }}
                        className="w-full sm:w-auto py-3 px-5 rounded-[14px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs transition-colors cursor-pointer text-center"
                      >
                        Register Another Account
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Registration Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {errors.general && (
                      <div className="p-3.5 rounded-[14px] bg-red-50 border border-red-200 text-red-700 flex items-center gap-2.5 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="font-semibold">{errors.general}</span>
                      </div>
                    )}
                    {/* Full Name Field */}
                    <div>
                      <label 
                        htmlFor="signup-fullName"
                        className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                        <input
                          id="signup-fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rameshwar Patel"
                          disabled={isSubmitting}
                          className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                            errors.fullName 
                              ? 'border-red-400 ring-2 ring-red-100' 
                              : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email and Mobile Number Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Email Address */}
                      <div>
                        <label 
                          htmlFor="signup-email"
                          className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                          <input
                            id="signup-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="farmer@example.com"
                            disabled={isSubmitting}
                            className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                              errors.email 
                                ? 'border-red-400 ring-2 ring-red-100' 
                                : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label 
                          htmlFor="signup-mobile"
                          className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                        >
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-bold text-neutral-400 pointer-events-none">
                            +91
                          </span>
                          <input
                            id="signup-mobile"
                            name="mobileNumber"
                            type="tel"
                            maxLength={10}
                            autoComplete="tel"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            placeholder="9876543210"
                            disabled={isSubmitting}
                            className={`w-full pl-12 pr-3.5 py-2.5 sm:py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                              errors.mobileNumber 
                                ? 'border-red-400 ring-2 ring-red-100' 
                                : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                            }`}
                          />
                        </div>
                        {errors.mobileNumber && (
                          <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.mobileNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password & Confirm Password Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Password */}
                      <div>
                        <label 
                          htmlFor="signup-password"
                          className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                        >
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                          <input
                            id="signup-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            disabled={isSubmitting}
                            className={`w-full pl-10 pr-9 py-2.5 sm:py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                              errors.password 
                                ? 'border-red-400 ring-2 ring-red-100' 
                                : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5 stroke-[2]" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 stroke-[2]" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.password}</span>
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label 
                          htmlFor="signup-confirmPassword"
                          className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                        >
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
                          <input
                            id="signup-confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            disabled={isSubmitting}
                            className={`w-full pl-10 pr-9 py-2.5 sm:py-3 bg-[#F8FAF5] border rounded-[14px] text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white transition-all ${
                              errors.confirmPassword 
                                ? 'border-red-400 ring-2 ring-red-100' 
                                : 'border-neutral-200 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5 stroke-[2]" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 stroke-[2]" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.confirmPassword}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Live Password Requirements Checklist */}
                    <div className="p-3 sm:p-3.5 rounded-[14px] bg-[#F8FAF5] border border-neutral-200/90 text-xs">
                      <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                        Password Requirements:
                      </span>
                      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-2 gap-1.5 text-[11px]">
                        <span className={`inline-flex items-center gap-1.5 transition-colors ${passRules.minLength ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                          <Check className={`w-3.5 h-3.5 ${passRules.minLength ? 'text-emerald-600 stroke-[3]' : 'text-neutral-300'}`} />
                          <span>8+ Characters</span>
                        </span>
                        <span className={`inline-flex items-center gap-1.5 transition-colors ${passRules.hasUpper ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                          <Check className={`w-3.5 h-3.5 ${passRules.hasUpper ? 'text-emerald-600 stroke-[3]' : 'text-neutral-300'}`} />
                          <span>1 Uppercase (A–Z)</span>
                        </span>
                        <span className={`inline-flex items-center gap-1.5 transition-colors ${passRules.hasLower ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                          <Check className={`w-3.5 h-3.5 ${passRules.hasLower ? 'text-emerald-600 stroke-[3]' : 'text-neutral-300'}`} />
                          <span>1 Lowercase (a–z)</span>
                        </span>
                        <span className={`inline-flex items-center gap-1.5 transition-colors ${passRules.hasNumber ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                          <Check className={`w-3.5 h-3.5 ${passRules.hasNumber ? 'text-emerald-600 stroke-[3]' : 'text-neutral-300'}`} />
                          <span>1 Number (0–9)</span>
                        </span>
                        <span className={`inline-flex items-center gap-1.5 transition-colors ${passRules.hasSpecial ? 'text-emerald-700 font-bold' : 'text-neutral-500'} col-span-2 min-[400px]:col-span-1 sm:col-span-2`}>
                          <Check className={`w-3.5 h-3.5 ${passRules.hasSpecial ? 'text-emerald-600 stroke-[3]' : 'text-neutral-300'}`} />
                          <span>1 Special Char (!@#$...)</span>
                        </span>
                      </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-[#1B4332] focus:ring-[#1B4332] cursor-pointer"
                        />
                        <span className="text-xs text-neutral-600 leading-snug">
                          I agree to GROVE&apos;s{' '}
                          <a href="#terms" className="text-[#012D1D] font-bold underline hover:opacity-85">
                            Terms &amp; Conditions
                          </a>{' '}
                          and{' '}
                          <a href="#privacy" className="text-[#012D1D] font-bold underline hover:opacity-85">
                            Privacy Policy
                          </a>.
                        </span>
                      </label>
                      {errors.agreedToTerms && (
                        <p className="mt-1 text-[11.5px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.agreedToTerms}</span>
                        </p>
                      )}
                    </div>

                    {/* Create Account Primary Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-[14px] bg-[#012D1D] hover:bg-[#081C15] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#012D1D]/15 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create GROVE Account</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Bottom Switch Link to Sign In */}
              <div className="mt-6 pt-5 border-t border-neutral-100 text-center text-xs sm:text-[13px] text-neutral-600">
                <span>Already have an account? </span>
                <Link 
                  to="/login" 
                  className="font-bold text-[#012D1D] hover:text-[#1B4332] hover:underline focus:outline-none"
                >
                  Sign In
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
    </main>
  );
}
