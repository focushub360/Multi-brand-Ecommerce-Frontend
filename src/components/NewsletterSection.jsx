import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="w-full bg-[#F7F3EA] py-12 sm:py-16 md:py-20 border-b border-neutral-200/60">
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 text-center">
        {/* Mail Icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#0A3325]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-[#0A3325]">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </div>

        {/* Heading */}
        <h2 
          className="text-[24px] sm:text-[32px] md:text-[34px] font-extrabold text-neutral-900 tracking-[-0.03em] leading-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          Good Finds, Straight to Your Inbox.
        </h2>

        {/* Subhead */}
        <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal mt-1.5 sm:mt-2 max-w-md mx-auto">
          Get weekly alerts on price drops, new machinery arrivals, and seasonal tech bargains.
        </p>

        {/* Form */}
        {subscribed ? (
          <div className="mt-5 sm:mt-7 inline-flex items-center gap-2 bg-[#0A3325] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#8BCB45] shrink-0" />
            <span>You are subscribed! Welcome to the GROVE community.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 sm:mt-7 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white rounded-[18px] p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80 focus-within:border-neutral-400 transition-all">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                className="w-full px-3.5 py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 outline-none font-medium min-w-0"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0A3325] hover:bg-[#072C20] text-white text-xs sm:text-[13px] font-bold rounded-[14px] transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
