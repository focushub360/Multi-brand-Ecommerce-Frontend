import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  MessageSquare, 
  ThumbsUp, 
  MapPin, 
  ShieldCheck,
  Calendar,
  Check
} from 'lucide-react';

export default function ProductSpecsAndReviewsTabs({ product, reviewsRef }) {
  const [activeTab, setActiveTab] = useState('specs');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const reviews = product.reviews || [];
  const specs = product.specifications || {};
  const agri = product.agricultureDetails || {};

  const handleHelpfulClick = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <section ref={reviewsRef} className="w-full bg-white rounded-[20px] sm:rounded-[24px] border border-neutral-200/90 shadow-2xs overflow-hidden mt-8 sm:mt-10">
      {/* Tab Navigation Header */}
      <div className="flex items-center border-b border-neutral-200 bg-neutral-50/70 px-2 sm:px-8 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'specs'
              ? 'border-[#1B4332] text-[#1B4332] bg-white -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Technical Specifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'description'
              ? 'border-[#1B4332] text-[#1B4332] bg-white -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Product Details &amp; Guide</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
            activeTab === 'reviews'
              ? 'border-[#1B4332] text-[#1B4332] bg-white -mb-[1px]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Verified Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="p-3.5 sm:p-8">
        {/* 1. Technical Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#081C15] mb-1 sm:mb-2">
                Technical Specifications for {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                Detailed manufacturer and field engineering parameters tested for agricultural suitability.
              </p>
            </div>

            {/* General Specs Table */}
            <div className="border border-neutral-200 rounded-[16px] overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[280px]">
                <tbody>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <td className="py-3 px-4 font-bold text-neutral-600 w-1/3">Category</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{product.category}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 px-4 font-bold text-neutral-600">Brand / OEM</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{product.brand || 'GROVE Agro'}</td>
                  </tr>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <td className="py-3 px-4 font-bold text-neutral-600">Model SKU</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{product.id.toUpperCase()}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 px-4 font-bold text-neutral-600">Warranty</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{product.warranty || '2 Years Standard OEM Warranty'}</td>
                  </tr>

                  {/* Dynamic Technical Specs from JSON */}
                  {Object.entries(specs).map(([key, val], idx) => (
                    <tr 
                      key={key} 
                      className={`border-b border-neutral-200 last:border-b-0 ${idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 font-bold text-neutral-600">{key}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Category-Specific Agronomic Attributes Table */}
            {agri && Object.keys(agri).length > 1 && (
              <div>
                <h4 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider mb-3">
                  Agronomic &amp; Field Usage Parameters
                </h4>
                <div className="border border-neutral-200 rounded-[16px] overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[280px]">
                    <tbody>
                      {Object.entries(agri)
                        .filter(([k]) => k !== 'categoryType')
                        .map(([key, val], idx) => {
                          // Format camelCase to Title Case
                          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                          return (
                            <tr 
                              key={key} 
                              className={`border-b border-neutral-200 last:border-b-0 ${idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
                            >
                              <td className="py-3 px-4 font-bold text-neutral-600 w-1/3">{label}</td>
                              <td className="py-3 px-4 font-semibold text-neutral-900">{val}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Detailed Description & Agronomic Guide Tab */}
        {activeTab === 'description' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-4xl text-neutral-700 leading-relaxed text-xs sm:text-sm">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#081C15] mb-2">
                About this Product
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#F8FAF8] border border-neutral-200/80">
              <h4 className="text-sm font-bold text-[#1B4332] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#40916C]" />
                Recommended Operating Guidelines
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-neutral-600">
                <li>• Inspect product and verification seals upon delivery prior to signing the gate delivery receipt.</li>
                <li>• Follow OEM recommended maintenance schedules or agronomic dosage recommendations printed on the packaging.</li>
                <li>• For subsidy and billing support, keep the GST invoice safely stored with your regional Kisan Aadhaar documentation.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 3. Verified Customer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-200">
            {/* Rating Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-[20px] bg-neutral-50 border border-neutral-200/80">
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6">
                <span className="text-4xl sm:text-5xl font-black text-[#081C15]">
                  {product.rating}
                </span>
                <div className="flex items-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-neutral-200 text-neutral-300'
                      } stroke-none`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-500">
                  Based on {product.reviewCount} verified customer ratings
                </span>
              </div>

              {/* Rating Bars */}
              <div className="md:col-span-8 space-y-2 text-xs">
                {[
                  { star: 5, pct: 82 },
                  { star: 4, pct: 14 },
                  { star: 3, pct: 3 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 0 }
                ].map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-12 text-neutral-600 font-bold">{star} star</span>
                    <div className="flex-1 h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <span className="w-10 text-neutral-500 font-semibold text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List of Verified Reviews */}
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-bold text-[#081C15]">
                Customer Reviews from Indian Farmers
              </h4>

              {reviews.map((rev) => {
                const isVoted = Boolean(helpfulVotes[rev.id]);
                const voteCount = rev.helpfulCount + (isVoted ? 1 : 0);

                return (
                  <article 
                    key={rev.id} 
                    className="p-4 sm:p-5 rounded-[18px] bg-white border border-neutral-200/90 shadow-2xs flex flex-col gap-2.5"
                  >
                    {/* Reviewer Header */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white font-bold flex items-center justify-center text-xs">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-neutral-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {rev.location}
                            </span>
                            <span>•</span>
                            <span>Farm: {rev.cropGrown}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Star Rating & Title */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-neutral-200 text-neutral-300'
                            } stroke-none`}
                          />
                        ))}
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-neutral-900">
                        {rev.title}
                      </h5>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Helpful Action */}
                    <div className="pt-2 flex items-center justify-between border-t border-neutral-100 text-xs">
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] border transition-colors cursor-pointer text-xs font-semibold ${
                          isVoted
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {isVoted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                            <span>Helpful ({voteCount})</span>
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({voteCount})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

