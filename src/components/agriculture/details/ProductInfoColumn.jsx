import React from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  FileText, 
  BadgePercent,
  Sprout,
  Wrench,
  Droplets,
  Sun,
  FlaskConical,
  Tractor
} from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

export default function ProductInfoColumn({ product, onJumpToReviews }) {
  const savings = product.savings || (product.originalPrice ? product.originalPrice - product.price : 0);
  const agri = product.agricultureDetails || {};

  // Render icon based on agriculture category
  const renderCategoryIcon = () => {
    switch (agri.categoryType) {
      case 'seeds':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'fertilizer':
        return <FlaskConical className="w-4 h-4 text-emerald-600" />;
      case 'machinery':
        return <Tractor className="w-4 h-4 text-emerald-600" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-emerald-600" />;
      case 'solar':
        return <Sun className="w-4 h-4 text-emerald-600" />;
      case 'crop-protection':
        return <Wrench className="w-4 h-4 text-emerald-600" />;
      default:
        return <Award className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 text-neutral-900">
      {/* Category Pill, SKU, & Brand */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-extrabold uppercase tracking-wider text-[#1B4332] bg-[#E9F3ED] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
          {renderCategoryIcon()}
          {product.category}
        </span>
        <span className="text-neutral-400 font-medium">
          SKU: {product.id.toUpperCase()}
        </span>
        <span className="text-neutral-300">•</span>
        <span className="text-neutral-600 font-medium">
          Brand: <strong className="text-neutral-900 font-bold">{product.brand || 'GROVE Agro'}</strong>
        </span>
      </div>

      {/* Product Title */}
      <h1 
        className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#081C15] tracking-tight leading-snug break-words"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        {product.name}
      </h1>

      {/* Rating & Verified Farmer Reviews Row */}
      <div className="flex items-center gap-3 pb-3 border-b border-neutral-200/80 flex-wrap">
        <button
          type="button"
          onClick={onJumpToReviews}
          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300 fill-neutral-200'
                } stroke-none`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-neutral-800 ml-1">
            {product.rating}
          </span>
        </button>

        <button
          type="button"
          onClick={onJumpToReviews}
          className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
        >
          {product.reviewCount} customer ratings
        </button>

        <span className="text-neutral-300 hidden sm:inline">•</span>

        <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Farmer Purchases</span>
        </div>
      </div>

      {/* Mobile/Tablet Price Display (synced with purchase panel for smaller screens) */}
      <div className="lg:hidden p-3 sm:p-3.5 rounded-[16px] bg-[#E9F3ED]/40 border border-[#1B4332]/15">
        <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-black text-[#081C15]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="text-xs font-extrabold text-[#1B4332] bg-white px-2 py-0.5 rounded-md border border-[#1B4332]/20">
              {product.discount}
            </span>
          )}
        </div>
        {savings > 0 && (
          <p className="text-xs font-bold text-emerald-700 mt-1">
            Save {formatPrice(savings)} ({product.discount}) with Direct OEM pricing
          </p>
        )}
      </div>

      {/* Govt Subsidy Notice (if applicable) */}
      {product.subsidy?.eligible && (
        <div className="rounded-[14px] bg-[#EAF5EF] border border-[#40916C]/30 p-3.5 flex items-start gap-3">
          <BadgePercent className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#1B4332]">
                Government Subsidy Available:
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                {product.subsidy.rate}
              </span>
            </div>
            <p className="text-xs text-neutral-700 font-medium mt-1 leading-relaxed">
              {product.subsidy.details}
            </p>
          </div>
        </div>
      )}

      {/* Key Highlights Bullet Points */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="mt-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332]" />
            Key Highlights &amp; Field Benefits
          </h2>
          <ul className="space-y-2">
            {product.highlights.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] shrink-0 mt-1.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category-Specific Quick Specs / Parameters */}
      <div className="mt-2 p-3.5 sm:p-4 rounded-[16px] bg-neutral-50 border border-neutral-200/80">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-600 mb-3 flex items-center justify-between">
          <span>{agri.categoryType ? 'Agricultural Parameters' : 'Product Parameters'}</span>
          <span className="text-[10.5px] font-bold text-[#1B4332] bg-white px-2 py-0.5 rounded-md border border-neutral-200">
            {product.category}
          </span>
        </h3>

        {/* Dynamic Category Specific Grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 text-xs">
          {agri.categoryType === 'seeds' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Crop Variety</span>
                <span className="font-bold text-neutral-900">{agri.cropVariety}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Pack Size</span>
                <span className="font-bold text-neutral-900">{agri.seedQuantity}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Sowing Season</span>
                <span className="font-bold text-neutral-900">{agri.sowingSeason}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Germination Rate</span>
                <span className="font-bold text-emerald-800">{agri.germinationRate}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Maturity Duration</span>
                <span className="font-bold text-neutral-900">{agri.maturityPeriod}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Seed Treatment</span>
                <span className="font-bold text-neutral-900">{agri.treatment}</span>
              </div>
            </>
          )}

          {agri.categoryType === 'fertilizer' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Composition</span>
                <span className="font-bold text-neutral-900">{agri.composition}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Net Weight</span>
                <span className="font-bold text-neutral-900">{agri.netWeight}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Form</span>
                <span className="font-bold text-neutral-900">{agri.form}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Application Method</span>
                <span className="font-bold text-neutral-900">{agri.applicationMethod}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Certification</span>
                <span className="font-bold text-emerald-800">{agri.organicCertification}</span>
              </div>
            </>
          )}

          {agri.categoryType === 'machinery' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Horsepower</span>
                <span className="font-bold text-neutral-900">{agri.horsepower}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Drive Type</span>
                <span className="font-bold text-neutral-900">{agri.driveType}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Engine / Power Source</span>
                <span className="font-bold text-neutral-900">{agri.powerSource}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Working / Cutter Width</span>
                <span className="font-bold text-neutral-900">{agri.workingWidth}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Transmission</span>
                <span className="font-bold text-neutral-900">{agri.transmission}</span>
              </div>
            </>
          )}

          {agri.categoryType === 'irrigation' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Irrigation Coverage</span>
                <span className="font-bold text-neutral-900">{agri.coverageArea}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Pipe / Tubing Spec</span>
                <span className="font-bold text-neutral-900">{agri.pipeLengthDiameter}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Discharge / Flow Rate</span>
                <span className="font-bold text-neutral-900">{agri.flowRate}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Operating Pressure</span>
                <span className="font-bold text-neutral-900">{agri.operatingPressure}</span>
              </div>
            </>
          )}

          {agri.categoryType === 'solar' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Pump Power Rating</span>
                <span className="font-bold text-neutral-900">{agri.pumpPower}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Motor Type</span>
                <span className="font-bold text-neutral-900">{agri.motorType}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Head Range</span>
                <span className="font-bold text-neutral-900">{agri.headRange}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Daily Discharge</span>
                <span className="font-bold text-neutral-900">{agri.dailyDischarge}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Recommended Solar PV Array</span>
                <span className="font-bold text-neutral-900">{agri.recommendedSolarArray}</span>
              </div>
            </>
          )}

          {agri.categoryType === 'crop-protection' && (
            <>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Active Spec / Ingredient</span>
                <span className="font-bold text-neutral-900">{agri.activeIngredient}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Tank / Net Volume</span>
                <span className="font-bold text-neutral-900">{agri.netVolume}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Dosage / Output</span>
                <span className="font-bold text-neutral-900">{agri.dosage}</span>
              </div>
              <div className="bg-white p-2 rounded-[10px] border border-neutral-200/60 col-span-2">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block">Target Pests &amp; Diseases</span>
                <span className="font-bold text-neutral-900">{agri.targetPests}</span>
              </div>
            </>
          )}

          {/* General / Electronics / Automotive Specifications Fallback */}
          {!agri.categoryType && product.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications) && (
            Object.entries(product.specifications).slice(0, 6).map(([key, val]) => (
              <div key={key} className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block truncate">{key}</span>
                <span className="font-bold text-neutral-900 truncate block">{val}</span>
              </div>
            ))
          )}
          {!agri.categoryType && Array.isArray(product.specifications) && (
            product.specifications.slice(0, 6).map((spec, idx) => (
              <div key={idx} className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block truncate">{spec.name}</span>
                <span className="font-bold text-neutral-900 truncate block">{spec.value}</span>
              </div>
            ))
          )}
          {!agri.categoryType && !product.specifications && product.specs && (
            Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
              <div key={key} className="bg-white p-2 rounded-[10px] border border-neutral-200/60">
                <span className="text-neutral-500 text-[10px] font-bold uppercase block truncate">{key}</span>
                <span className="font-bold text-neutral-900 truncate block">{val}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Description Excerpt */}
      <div className="mt-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-neutral-600" />
          Overview
        </h3>
        <p className="text-xs sm:text-[13.5px] text-neutral-700 leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {/* Warranty & OEM Assurance Strip */}
      <div className="mt-1 pt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
          <span><strong>Warranty:</strong> {product.warranty || 'Manufacturer Warranty Included'}</span>
        </div>
      </div>
    </div>
  );
}

