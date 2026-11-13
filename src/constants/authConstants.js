import { Sprout, Smartphone, Cog } from 'lucide-react';

export const AUTH_CATEGORIES = [
  {
    id: 'agriculture',
    title: 'Agriculture & Farming',
    subtitle: 'Field Essentials & Heavy Equipment',
    tagline: 'Certified hybrid seeds, heavy machinery, solar pumps & biological crop nutrition.',
    pill: 'Agriculture',
    keywords: 'Farming • Irrigation • Heavy Machinery',
    image: '/images/hero-farmer.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80',
    icon: Sprout,
    accent: '#8BCB45',
  },
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    subtitle: 'Technology for Work & Everyday Life',
    tagline: 'High-performance laptops, studio noise-cancelling audio & verified accessories.',
    pill: 'Electronics',
    keywords: 'Devices • Workstations • Audio Tech',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/images/card-electronics.png',
    icon: Smartphone,
    accent: '#52B788',
  },
  {
    id: 'automotive',
    title: 'Automotive & Spare Parts',
    subtitle: 'Reliable Parts for Commercial & Farm Fleets',
    tagline: 'Precision brake sets, all-terrain tyres, engine lubricants & genuine OEM spares.',
    pill: 'Automotive',
    keywords: 'Vehicles • Spare Parts • Depot Logistics',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/images/card-automotive.png',
    icon: Cog,
    accent: '#FF383F',
  },
];

