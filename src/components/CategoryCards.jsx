import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sprout, Smartphone, Cog, ShoppingBasket } from 'lucide-react';
const CATEGORIES = [
  {
    id: "agriculture",
    title: "AGRICULTURE",
    subtitle: "FARMING & EQUIPMENT",
    headingLine1: "Smart farming",
    headingLine2: "starts here.",
    cta: "Explore Agriculture",
    bgColor: "#EDF0D9",
    accentColor: "#0A3325",
    textColor: "#183B20",
    image: "/images/card-agri.png",
    iconBg: "#DCE3C2",
    iconColor: "#2C4A28",
  },
  {
    id: "electronics",
    title: "ELECTRONICS",
    subtitle: "GADGETS & TECHNOLOGY",
    headingLine1: "Upgrade",
    headingLine2: "your everyday.",
    cta: "Explore Electronics",
    bgColor: "#F5F2EC",
    accentColor: "#171717",
    textColor: "#171717",
    image: "/images/card-electronics.png",
    iconBg: "#E8E2D6",
    iconColor: "#333333",
  },
  {
    id: "automotive",
    title: "AUTOMOTIVE",
    subtitle: "PARTS & ACCESSORIES",
    headingLine1: "Parts for",
    headingLine2: "every journey.",
    cta: "Explore Automotive",
    bgColor: "#F9E4E1",
    accentColor: "#FF383F",
    textColor: "#3D1412",
    image: "/images/card-automotive.png",
    iconBg: "#F2CDC7",
    iconColor: "#C23631",
  },
  {
    id: "groceries",
    title: "GROCERIES",
    subtitle: "DAILY ESSENTIALS",
    headingLine1: "Fresh essentials",
    headingLine2: "for everyday needs.",
    cta: "Explore Groceries",
    bgColor: "#FEF3E2",
    accentColor: "#C26D00",
    textColor: "#78350F",
    image: "/images/card-groceries.png",
    iconBg: "#FDE68A",
    iconColor: "#B45309",
  },
];

export default function CategoryCards() {
  const navigate = useNavigate();

  const getIcon = (id) => {
    switch (id) {
      case 'agriculture':
        return <Sprout className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2C4A28]" />;
      case 'electronics':
        return <Smartphone className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-800" />;
      case 'automotive':
        return <Cog className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#C23631]" />;
      case 'groceries':
        return <ShoppingBasket className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#B45309]" />;
      default:
        return null;
    }
  };

  const handleCardClick = (cardId) => {
    if (cardId === 'agriculture') {
      navigate('/agriculture');
    } else if (cardId === 'electronics') {
      navigate('/electronics');
    } else if (cardId === 'automotive') {
      navigate('/automotive');
    } else if (cardId === 'groceries') {
      navigate('/groceries');
    }
  };

  const getCategoryUrl = (cardId) => {
    if (cardId === 'agriculture') return '/agriculture';
    if (cardId === 'electronics') return '/electronics';
    if (cardId === 'automotive') return '/automotive';
    if (cardId === 'groceries') return '/groceries';
    return '/';
  };

  const getTitleColor = (id) => {
    switch (id) {
      case 'automotive':
        return '#A82420';
      case 'agriculture':
        return '#0A3325';
      case 'groceries':
        return '#78350F';
      case 'electronics':
      default:
        return '#141414';
    }
  };

  const getSubtitleColor = (id) => {
    switch (id) {
      case 'automotive':
        return '#D6534E';
      case 'agriculture':
        return '#5E7A5A';
      case 'groceries':
        return '#B45309';
      case 'electronics':
      default:
        return '#737373';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full pointer-events-auto">
      {/* Responsive layout: 4 columns on desktop, 2 columns on tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-3.5 xl:gap-4 w-full">
        {CATEGORIES.map((card) => {
          const categoryUrl = getCategoryUrl(card.id);
          const titleColor = getTitleColor(card.id);
          const subtitleColor = getSubtitleColor(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="w-full rounded-[22px] sm:rounded-[26px] lg:rounded-[24px] xl:rounded-[28px] overflow-hidden p-4 sm:p-5 lg:p-4.5 xl:p-6 relative h-[185px] sm:h-[205px] md:h-[220px] lg:h-[235px] xl:h-[248px] flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)] transition-all duration-300 group select-none cursor-pointer hover:-translate-y-0.5"
              style={{ backgroundColor: card.bgColor }}
            >
              {/* Left Content Area: Badge, Title, Subtitle, Description */}
              <div className="relative z-10 max-w-[56%] sm:max-w-[54%] md:max-w-[52%] lg:max-w-[58%] xl:max-w-[54%] flex flex-col items-start">
                {/* Circular Icon Badge */}
                <div 
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 md:w-8 md:h-8 rounded-full flex items-center justify-center mb-2 sm:mb-2.5 md:mb-3 transition-transform group-hover:scale-105 duration-200 shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  {getIcon(card.id)}
                </div>

                {/* Title */}
                <h3 
                  className="text-[17px] sm:text-[18px] md:text-[19px] lg:text-[17.5px] xl:text-[20px] font-extrabold tracking-tight leading-none"
                  style={{ 
                    color: titleColor,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
                  }}
                >
                  {card.title}
                </h3>
                
                {/* Subtitle */}
                <p 
                  className="text-[8.5px] sm:text-[9px] md:text-[9.5px] lg:text-[8.5px] xl:text-[9px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase mt-0.5 sm:mt-1 mb-1.5 sm:mb-2"
                  style={{ color: subtitleColor }}
                >
                  {card.subtitle}
                </p>

                {/* Description */}
                <p 
                  className="text-[11.5px] sm:text-[12px] md:text-[12.5px] lg:text-[11px] xl:text-[12px] font-bold leading-[1.25] text-neutral-800"
                >
                  {card.headingLine1}
                  <br />
                  {card.headingLine2}
                </p>
              </div>

              {/* Bottom CTA Button */}
              <div className="relative z-10 mt-2 sm:mt-3">
                <Link
                  to={categoryUrl}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 group/btn cursor-pointer select-none"
                >
                  <span 
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 lg:w-5.5 lg:h-5.5 xl:w-6.5 xl:h-6.5 rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover/btn:translate-x-0.5 shrink-0"
                    style={{ backgroundColor: card.accentColor }}
                  >
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
                  </span>
                  <span 
                    className="text-[11px] sm:text-[11.5px] md:text-[12px] lg:text-[10px] xl:text-[11.5px] font-bold tracking-tight transition-opacity hover:opacity-85 whitespace-nowrap"
                    style={{ color: titleColor }}
                  >
                    {card.cta}
                  </span>
                </Link>
              </div>

              {/* Right Product Imagery with seamless left alpha gradient mask */}
              <div 
                className="absolute right-0 bottom-0 top-0 w-[46%] sm:w-[48%] md:w-[50%] lg:w-[46%] xl:w-[50%] pointer-events-none flex items-end justify-end overflow-hidden"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 100%)',
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-contain object-right-bottom group-hover:scale-[1.02] transition-transform duration-300"
                  style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))' }}
                  loading="eager"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
