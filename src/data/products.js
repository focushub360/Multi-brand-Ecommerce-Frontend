import agricultureProductsData from './agricultureProducts.json';

export const BEST_SELLERS = [
  {
    id: 1,
    dealerId: "DEALER_002",
    name: "Mini Tractor 25 HP",
    category: "Agriculture",
    discount: "-12%",
    rating: 4.5,
    reviews: 128,
    price: "₹3,50,000",
    originalPrice: "₹3,99,000",
    image: "/images/prod-tractor.png",
  },
  {
    id: 2,
    dealerId: "DEALER_002",
    name: "Solar Water Pump 2HP",
    category: "Agriculture",
    discount: "-20%",
    rating: 4.7,
    reviews: 96,
    price: "₹28,000",
    originalPrice: "₹35,000",
    image: "/images/prod-solar.png",
  },
  {
    id: 3,
    dealerId: "DEALER_001",
    name: "Noise Wireless Headphones",
    category: "Electronics",
    discount: "-18%",
    rating: 4.6,
    reviews: 210,
    price: "₹2,799",
    originalPrice: "₹3,499",
    image: "/images/prod-headphones.png",
  },
  {
    id: 4,
    dealerId: "DEALER_001",
    name: "Lenovo IdeaPad Laptop",
    category: "Electronics",
    discount: null,
    rating: 4.8,
    reviews: 164,
    price: "₹55,990",
    originalPrice: null,
    image: "/images/prod-laptop.png",
  },
  {
    id: 5,
    dealerId: "DEALER_002",
    name: "Car Tyre 185/65 R15",
    category: "Automotive",
    discount: "-15%",
    rating: 4.4,
    reviews: 87,
    price: "₹4,500",
    originalPrice: "₹5,299",
    image: "/images/prod-tyre.png",
  },
  {
    id: 6,
    dealerId: "DEALER_002",
    name: "Front Brake Pad Set",
    category: "Automotive",
    discount: "-22%",
    rating: 4.6,
    reviews: 73,
    price: "₹1,950",
    originalPrice: "₹2,499",
    image: "/images/prod-brakepads.png",
  },
];

export const ELECTRONICS_PRODUCTS = [
  {
    "id": "el-1",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Noise Wireless Headphones",
    "category": "Electronics & Gadgets",
    "subcategory": "Audio & Headphones",
    "brand": "Noise",
    "discount": "-18%",
    "savings": 700,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-el-1",
        "author": "Aditya Kulkarni",
        "location": "Pune, Maharashtra",
        "rating": 5,
        "date": "22 Oct 2026",
        "verified": true,
        "title": "Superb ANC and crystal clear mic quality",
        "comment": "Using this daily for enterprise Zoom calls and long coding sessions. The battery lasts almost an entire week on a single charge. Shipped in pristine packaging with GST invoice.",
        "helpfulCount": 29
      },
      {
        "id": "rev-el-2",
        "author": "Neha Sharma",
        "location": "Bengaluru, Karnataka",
        "rating": 4,
        "date": "11 Oct 2026",
        "verified": true,
        "title": "Very comfortable and punchy bass",
        "comment": "Ear cushions are super soft and do not cause ear fatigue even after 6 hours. Fast delivery by GROVE dealer within 3 days.",
        "helpfulCount": 14
      }
    ],
    "reviewCount": 210,
    "price": 2799,
    "originalPrice": 3499,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "Best Audio",
    "image": "/images/prod-headphones.png",
    "fallbackImage": "/images/card-electronics.png",
    "images": [
      "/images/prod-headphones.png",
      "/images/card-electronics.png",
      "/images/card-electronics-clean.png"
    ],
    "description": "High-fidelity wireless over-ear headphones with active noise cancellation, deep dynamic bass, and 40-hour continuous playback for distraction-free listening.",
    "warranty": "1 Year Brand Replacement Warranty",
    "highlights": [
      "Active Noise Cancellation (ANC) with up to 30dB ambient sound reduction",
      "Massive 40-hour continuous battery life with quick charge (10 min charge = 5 hours playback)",
      "Ergonomic plush ear cushions designed for all-day comfort during work calls and listening",
      "Low-latency gaming mode with Bluetooth 5.3 multi-point device pairing",
      "Backed by 1 Year manufacturer replacement warranty across 500+ Indian service centers"
    ],
    "specifications": {
      "Connectivity": "Bluetooth 5.3 + 3.5mm Aux",
      "Battery Life": "40 Hours with Fast Charge",
      "Drivers": "40mm Neodymium Drivers",
      "Charging Port": "USB Type-C Fast Charging",
      "Microphone": "Dual Quad-Mic with AI Environmental Noise Cancellation",
      "Warranty": "1 Year Brand Replacement Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Express Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "el-2",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Lenovo IdeaPad Laptop",
    "category": "Electronics & Gadgets",
    "subcategory": "Laptops & Computers",
    "brand": "Lenovo",
    "discount": "-11%",
    "savings": 7000,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-el-3",
        "author": "Praveen Mehta",
        "location": "Ahmedabad, Gujarat",
        "rating": 5,
        "date": "19 Oct 2026",
        "verified": true,
        "title": "Best laptop for productivity and accounting",
        "comment": "Runs our business inventory software, browser with 30 tabs, and spreadsheets without any lag. Boot time is under 8 seconds. Genuine piece with GST invoice for input tax credit.",
        "helpfulCount": 42
      }
    ],
    "reviewCount": 164,
    "price": 55990,
    "originalPrice": 62990,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "Work Essential",
    "image": "/images/prod-laptop.png",
    "fallbackImage": "/images/card-electronics-clean.png",
    "images": [
      "/images/prod-laptop.png",
      "/images/card-electronics-clean.png",
      "/images/card-electronics.png"
    ],
    "description": "Thin & light 15.6-inch FHD anti-glare display laptop engineered for professional productivity, office computing, and seamless multitasking.",
    "warranty": "2 Years Official Onsite Warranty",
    "highlights": [
      "Powered by AMD Ryzen 5 5500U (6 Cores / 12 Threads, up to 4.0 GHz boost)",
      "16GB DDR4 High-Speed RAM + 512GB PCIe NVMe M.2 SSD for lightning-fast application launches",
      "15.6-inch Full HD (1920x1080) anti-glare display with 250 nits brightness and narrow bezels",
      "Rapid Charge technology: 0 to 80% charge in just 60 minutes with 65W AC adapter",
      "Includes 2 Years onsite brand warranty with accidental damage protection support"
    ],
    "specifications": {
      "Processor": "AMD Ryzen 5 5500U (6C / 12T)",
      "RAM": "16GB DDR4-3200 MHz",
      "Storage": "512GB PCIe NVMe M.2 SSD",
      "Display": "15.6\" FHD (1920 x 1080) Anti-glare",
      "Graphics": "Integrated AMD Radeon Graphics",
      "Operating System": "Windows 11 Home 64-bit",
      "Weight": "1.65 kg Ultra-portable",
      "Warranty": "2 Years Official Onsite Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "2 - 4 Business Days",
      "shippingFee": "FREE Insured Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "el-3",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Amoled Smartwatch Pro",
    "category": "Electronics & Gadgets",
    "subcategory": "Wearables & Smartwatches",
    "brand": "GROVE Tech",
    "discount": "-32%",
    "savings": 1900,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-el-4",
        "author": "Sunil Jadhav",
        "location": "Satara, Maharashtra",
        "rating": 5,
        "date": "08 Oct 2026",
        "verified": true,
        "title": "Very clear screen even in bright sunlight",
        "comment": "Bought this for field visits. Screen is super bright and phone calls work smoothly through the watch while driving. Very happy with the purchase.",
        "helpfulCount": 18
      }
    ],
    "reviewCount": 188,
    "price": 3999,
    "originalPrice": 5899,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "Popular",
    "image": "/images/prod-smartwatch.png",
    "fallbackImage": "/images/prod-smartwatch-raw.png",
    "images": [
      "/images/prod-smartwatch.png",
      "/images/prod-smartwatch-raw.png",
      "/images/card-electronics.png"
    ],
    "description": "1.43-inch Always-on AMOLED display smartwatch featuring Bluetooth calling, heart rate & SpO2 telemetry, and 12-day battery life.",
    "warranty": "1 Year Replacement Warranty",
    "highlights": [
      "1.43-inch Always-on AMOLED display with 466x466 resolution and 600 nits outdoor visibility",
      "Single-chip Bluetooth calling with advanced HD speaker and noise-reducing microphone",
      "Comprehensive health telemetry: continuous 24/7 heart rate, SpO2 blood oxygen, and sleep tracking",
      "IP68 water resistant and 5ATM pressure certified for swimming, rain, and dusty farm environments",
      "Long battery life lasting up to 12 days on regular use and 20 days in standby"
    ],
    "specifications": {
      "Display": "1.43\" Ultra AMOLED (466x466)",
      "Battery Life": "Up to 12 Days (350mAh)",
      "Water Resistance": "IP68 & 5ATM Rated",
      "Sensors": "Optical PPG Heart Rate, SpO2, Accelerometer",
      "Bluetooth": "v5.3 Single-chip Calling",
      "Warranty": "1 Year Replacement Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Express Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "el-4",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Mechanical Wireless Keyboard",
    "category": "Electronics & Gadgets",
    "subcategory": "Keyboards & Accessories",
    "brand": "Keychron",
    "discount": "-21%",
    "savings": 900,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-el-5",
        "author": "Rahul Deshmukh",
        "location": "Nashik, Maharashtra",
        "rating": 5,
        "date": "14 Oct 2026",
        "verified": true,
        "title": "Smooth typing experience, solid weight",
        "comment": "The typing feel is butter-smooth and switches sound very deep and quiet. Wireless connection to both laptop and tablet is instant.",
        "helpfulCount": 22
      }
    ],
    "reviewCount": 112,
    "price": 3299,
    "originalPrice": 4199,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": false,
    "tag": "RGB Backlit",
    "image": "/images/prod-keyboard.png",
    "fallbackImage": "/images/card-electronics.png",
    "images": [
      "/images/prod-keyboard.png",
      "/images/card-electronics.png"
    ],
    "description": "Hot-swappable mechanical wireless keyboard with dynamic per-key RGB backlighting, red linear switches, and multi-device Bluetooth switching.",
    "warranty": "1 Year Official Warranty",
    "highlights": [
      "Tri-mode connectivity: Bluetooth 5.1 (up to 3 devices), 2.4GHz ultra-low latency wireless, and Type-C wired",
      "Hot-swappable linear mechanical switches rated for 50 million keystrokes with sound dampening foam",
      "Dynamic per-key RGB backlighting with 18 onboard lighting profiles and brightness adjustment",
      "Double-shot oil-resistant PBT keycaps with durable shine-through legends",
      "Compatible with Windows, macOS, Android, and iOS with dedicated hardware toggle switch"
    ],
    "specifications": {
      "Layout": "Compact 75% Layout (84 Keys)",
      "Switches": "Hot-Swappable Custom Red Linear Switches",
      "Battery": "4000mAh Rechargeable Li-Ion",
      "Battery Life": "Up to 200 Hours (Backlight Off)",
      "Warranty": "1 Year Manufacturer Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "el-5",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Studio Monitor Headphones",
    "category": "Electronics & Gadgets",
    "subcategory": "Audio & Headphones",
    "brand": "Audio-Technica",
    "discount": "-24%",
    "savings": 1400,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-el-6",
        "author": "Vikram Joshi",
        "location": "Mumbai, Maharashtra",
        "rating": 5,
        "date": "25 Sep 2026",
        "verified": true,
        "title": "Standard reference sound for editing",
        "comment": "Flat acoustic response, no artificial boomy bass. Perfect for podcast recording, voice-over work, and media mixing. Build quality is built like a tank.",
        "helpfulCount": 31
      }
    ],
    "reviewCount": 145,
    "price": 4299,
    "originalPrice": 5699,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": false,
    "tag": "Pro Sound",
    "image": "/images/prod-headphones.png",
    "fallbackImage": "/images/card-electronics.png",
    "images": [
      "/images/prod-headphones.png",
      "/images/card-electronics.png"
    ],
    "description": "Professional reference studio monitor headphones with 45mm large-aperture neodymium drivers for precise acoustic monitoring and sound engineering.",
    "warranty": "1 Year Manufacturer Warranty",
    "highlights": [
      "Proprietary 45mm large-aperture neodymium magnet drivers with copper-clad aluminum wire voice coils",
      "Exceptional clarity throughout an extended 15 - 28,000 Hz frequency range with deep, accurate bass",
      "Circumaural design contours around the ears for outstanding sound isolation in noisy environments",
      "90° swiveling earcups for easy, one-ear monitoring and space-saving fold-flat portability",
      "Professional-grade earpad and headband material delivers durable comfort over long studio shifts"
    ],
    "specifications": {
      "Driver Diameter": "45 mm Neodymium",
      "Frequency Response": "15 - 28,000 Hz",
      "Maximum Input Power": "1,600 mW at 1 kHz",
      "Sensitivity": "99 dB",
      "Impedance": "38 ohms",
      "Warranty": "1 Year Manufacturer Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "prod-soil-iot",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Precision Soil Sensor Telemetry V2",
    "category": "Electronics & Gadgets",
    "subcategory": "Smart Sensors & IoT",
    "brand": "AgroSense",
    "discount": "-15%",
    "savings": 4500,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-el-7",
        "author": "Balasaheb Shinde",
        "location": "Baramati, Maharashtra",
        "rating": 5,
        "date": "18 Oct 2026",
        "verified": true,
        "title": "Cut our pomegranate drip irrigation water by 35%",
        "comment": "Installed 4 probes across our 12-acre orchard. Cloud app alerts our motor operator exactly when soil moisture dips below 28%. Excellent sensor accuracy.",
        "helpfulCount": 27
      }
    ],
    "reviewCount": 42,
    "price": 24500,
    "originalPrice": 29000,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "Smart Ag Tech",
    "image": "/images/prod-smartwatch.png",
    "fallbackImage": "/images/card-electronics.png",
    "images": [
      "/images/prod-smartwatch.png",
      "/images/card-electronics.png"
    ],
    "description": "Multi-depth IoT soil monitoring probe measuring moisture, electrical conductivity (EC), and ground temperature with integrated 4G-LTE telemetry gateway.",
    "warranty": "2 Years Commercial Warranty",
    "highlights": [
      "Multi-depth high accuracy sensor measuring Soil Moisture (VWC), Electrical Conductivity (EC), and Temperature",
      "Industrial 316L stainless steel electrodes resistant to saline, acidic, and alkaline fertilizer corrosion",
      "Solar-powered IoT telemetry gateway with integrated 4G-LTE SIM supporting automated cloud logging",
      "Modbus-RTU RS485 communication compatible with automatic drip fertigation solenoid valves",
      "IP68 completely sealed waterproof casing engineered for permanent in-field buried deployment"
    ],
    "specifications": {
      "Measurement Parameters": "Moisture (0-100%), EC (0-20000 µS/cm), Temp (-40 to 80°C)",
      "Probe Material": "Anti-Corrosion 316L Stainless Steel",
      "Telemetry Protocol": "4G-LTE / NB-IoT / Modbus RS485",
      "Battery / Power": "Internal Li-Ion + 5W Monocrystalline Solar Panel",
      "Ingress Protection": "IP68 Submersible Grade",
      "Warranty": "2 Years Commercial OEM Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Farm Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Farm Doorstep Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "prod-amoled-smartwatch",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Field Telemetry Smartwatch V4",
    "category": "Electronics & Gadgets",
    "subcategory": "Wearables & Smartwatches",
    "brand": "GROVE Tech",
    "discount": "-32%",
    "savings": 1900,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-el-8",
        "author": "Dnyaneshwar Shinde",
        "location": "Latur, Maharashtra",
        "rating": 5,
        "date": "04 Oct 2026",
        "verified": true,
        "title": "Very tough watch for field supervisors",
        "comment": "Battery lasts effortlessly over two weeks. GPS tracking measured our crop boundaries accurately. The dealer delivered in two days.",
        "helpfulCount": 16
      }
    ],
    "reviewCount": 56,
    "price": 3999,
    "originalPrice": 5899,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": false,
    "tag": "Field Ready",
    "image": "/images/prod-smartwatch.png",
    "fallbackImage": "/images/prod-smartwatch-raw.png",
    "images": [
      "/images/prod-smartwatch.png",
      "/images/prod-smartwatch-raw.png"
    ],
    "description": "Rugged GPS field watch with solar charging assistance, barometric altimeter, and IoT sensor telemetry display for agricultural estate managers.",
    "warranty": "1 Year Comprehensive Brand Warranty",
    "highlights": [
      "Rugged polymer case and sapphire-crystal lens engineered for harsh outdoor agricultural and field work",
      "Integrated solar-assist charging extending field runtime up to 24 days without wall outlet power",
      "Direct IoT node telemetry monitor displaying field soil moisture and pump relay statuses on your wrist",
      "Multi-band GNSS positioning (GPS, GLONASS, Galileo) for accurate farm parcel area calculation",
      "5ATM waterproof rating with heavy mud and dust ingress resistance"
    ],
    "specifications": {
      "Display": "1.43-inch High-Luminance AMOLED",
      "Glass": "Scratch-Proof Synthetic Sapphire",
      "GNSS": "Dual-Frequency GPS / GLONASS / Galileo",
      "Water Resistance": "5ATM (50 meters pressure)",
      "Warranty": "1 Year Comprehensive Brand Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Express Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Express Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "el-drone-16l",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Hexacopter Agricultural Spray Drone 16L",
    "category": "Electronics & Gadgets",
    "subcategory": "Drones & Robotics",
    "brand": "AeroKisan",
    "discount": "-11%",
    "savings": 35000,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-el-9",
        "author": "Sukhdev Gill",
        "location": "Moga, Punjab",
        "rating": 5,
        "date": "12 Sep 2026",
        "verified": true,
        "title": "Massive time saver during cotton pest spraying",
        "comment": "We sprayed 45 acres of cotton in two mornings. Penetration into the inner leaves is far superior to tractor boom sprayers. Dealer provided two days on-field flight training.",
        "helpfulCount": 38
      }
    ],
    "reviewCount": 31,
    "price": 285000,
    "originalPrice": 320000,
    "stockStatus": "Limited Stock",
    "inStock": true,
    "featured": true,
    "tag": "High Precision",
    "image": "/images/card-electronics.png",
    "fallbackImage": "/images/card-electronics-clean.png",
    "images": [
      "/images/card-electronics.png",
      "/images/card-electronics-clean.png"
    ],
    "description": "Commercial 16-liter autonomous agricultural payload hexacopter drone with radar terrain following, RTK precision positioning, and atomizing spray nozzles.",
    "warranty": "1 Year OEM Commercial Warranty",
    "highlights": [
      "Commercial 16-liter chemical payload tank covering 1 acre of crops in just 7 to 9 minutes",
      "High-pressure centrifugal atomization nozzles delivering uniform droplet size (60 - 400 microns)",
      "Millimeter-wave obstacle avoidance radar and terrain-following sensor for undulating farm contours",
      "Dual FPV cameras with spotlight for high-definition crop canopy inspection and night spraying",
      "Foldable carbon-fiber airframe for rapid transport in standard farm utility pickups"
    ],
    "specifications": {
      "Payload Capacity": "16 Liters Liquid Spray Tank",
      "Spray Width": "4.5 - 6.5 meters",
      "Flight Time": "18 min (Fully Loaded) / 32 min (Empty)",
      "Positioning": "Centimeter-Level RTK Positioning",
      "Warranty": "1 Year OEM Commercial Warranty & Free Pilot Training"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Heavy Freight",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "4 - 6 Business Days",
      "shippingFee": "FREE Farm Doorstep Freight",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  }
];

export const AUTOMOTIVE_PRODUCTS = [
  {
    "id": "au-1",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Car Tyre 185/65 R15",
    "category": "Automotive & Spare Parts",
    "subcategory": "Tires & Wheels",
    "brand": "MRF",
    "discount": "-15%",
    "savings": 799,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-au-1",
        "author": "Mahesh Chougule",
        "location": "Kolhapur, Maharashtra",
        "rating": 5,
        "date": "16 Oct 2026",
        "verified": true,
        "title": "Durable tyre with great braking grip",
        "comment": "Installed a set of 4 on our utility vehicle. Braking in rain feels completely confident and road noise has decreased noticeably. Fresh manufacturing date with warranty code.",
        "helpfulCount": 34
      }
    ],
    "reviewCount": 87,
    "price": 4500,
    "originalPrice": 5299,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "All-Weather",
    "image": "/images/prod-tyre.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-tyre.png",
      "/images/card-automotive.png",
      "/images/card-automotive-clean.png"
    ],
    "description": "High-mileage steel belted radial tyre engineered for passenger and utility vehicles with cut-resistant tread compound and superior wet weather traction.",
    "warranty": "5 Years Unconditional Manufacturer Warranty",
    "highlights": [
      "Engineered with cut-resistant tread compound for potholed rural asphalt and farm approach roads",
      "Wide circumferential grooves deliver rapid water evacuation, minimizing wet road hydroplaning",
      "High-durability continuous center rib provides exceptional straight-line stability and steering response",
      "Reinforced dual steel belt construction ensures high puncture protection and uniform tread wear",
      "Backed by 5 Years unconditional manufacturer replacement warranty against manufacturing defects"
    ],
    "specifications": {
      "Tyre Size": "185/65 R15",
      "Rim Diameter": "15 Inch",
      "Speed Rating": "H (up to 210 km/h)",
      "Load Index": "88 (560 kg per tyre)",
      "Tread Pattern": "Symmetric All-Weather",
      "Warranty": "5 Years Unconditional Manufacturer Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Express Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "au-2",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Front Brake Pad Set",
    "category": "Automotive & Spare Parts",
    "subcategory": "Braking Systems",
    "brand": "Bosch",
    "discount": "-22%",
    "savings": 549,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-au-2",
        "author": "Sanjay Pawar",
        "location": "Sangli, Maharashtra",
        "rating": 5,
        "date": "21 Sep 2026",
        "verified": true,
        "title": "Zero squeaking and prompt bite",
        "comment": "Replaced worn out stock pads on our Bolero pickup. The pedal feel is firm and progressive even when carrying 1.5 tons of cargo. Delivered within 3 days.",
        "helpfulCount": 23
      }
    ],
    "reviewCount": 73,
    "price": 1950,
    "originalPrice": 2499,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": true,
    "tag": "OEM Grade",
    "image": "/images/prod-brakepads.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-brakepads.png",
      "/images/card-automotive.png"
    ],
    "description": "Ceramic composite brake pads providing fade-resistant stopping performance and low dust under high payload applications and high brake temperatures.",
    "warranty": "6 Months / 20,000 km Replacement Warranty",
    "highlights": [
      "Advanced semi-metallic ceramic formulation engineered for heavy commercial and payload duty",
      "Multi-layer anti-squeal rubber-coated steel shims for silent, vibration-free brake pedal operation",
      "High thermal tolerance with operating fade resistance up to 650°C during steep downhill mountain braking",
      "Low rotor wear profile preserving brake disc life and reducing black brake dust accumulation",
      "Includes anti-rattle clips and high-temperature caliper bracket lubricant"
    ],
    "specifications": {
      "Axle Position": "Front Axle Set (4 Pads Included)",
      "Material Composition": "Semi-Metallic Ceramic Matrix",
      "Operating Temperature": "Up to 650°C Fade Resistance",
      "Rotor Compatibility": "Ventilated & Solid Cast Iron Rotors",
      "Warranty": "6 Months / 20,000 km Replacement Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "au-3",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Hydraulic Coilover Shock Absorber",
    "category": "Automotive & Spare Parts",
    "subcategory": "Suspension & Steering",
    "brand": "Gabriel",
    "discount": "-20%",
    "savings": 849,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-au-3",
        "author": "Ganesh Chavan",
        "location": "Osmanabad, Maharashtra",
        "rating": 5,
        "date": "03 Oct 2026",
        "verified": true,
        "title": "Transformed the suspension over rough roads",
        "comment": "Trailer bouncing has stopped completely on rural tracks. Heavy build quality and direct fit onto standard chassis mounts.",
        "helpfulCount": 19
      }
    ],
    "reviewCount": 95,
    "price": 3250,
    "originalPrice": 4099,
    "stockStatus": "Limited Stock",
    "inStock": true,
    "featured": true,
    "tag": "Heavy Duty",
    "image": "/images/prod-shockabsorber.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-shockabsorber.png",
      "/images/card-automotive.png"
    ],
    "description": "Heavy-duty nitrogen-charged twin tube shock absorber with progressive rate spring for agricultural trailers, utility pickups, and passenger carriers.",
    "warranty": "1 Year Replacement Warranty",
    "highlights": [
      "Nitrogen gas-charged twin tube design eliminating hydraulic oil aeration and shock fade",
      "Progressive rate chrome-silicon spring for comfortable unladen ride and firm control under full cargo",
      "Micro-polished 16mm hard chrome piston rod with multi-lip Viton oil seal prevents leaks",
      "Heavy gauge welded mounting eyes with vulcanized natural rubber bushings dampen chassis vibration",
      "100% dyno-tested to meet OEM automotive endurance parameters"
    ],
    "specifications": {
      "Shock Type": "Hydraulic Twin-Tube Gas-Charged",
      "Extended Length": "420 mm (Eye-to-Eye)",
      "Compressed Length": "280 mm",
      "Piston Rod Diameter": "16 mm Hard Chrome",
      "Warranty": "1 Year Replacement Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "au-4",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "High Performance Radial Tyre R17",
    "category": "Automotive & Spare Parts",
    "subcategory": "Tires & Wheels",
    "brand": "Apollo",
    "discount": "-18%",
    "savings": 1499,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-au-4",
        "author": "Rajesh Patil",
        "location": "Pune, Maharashtra",
        "rating": 5,
        "date": "15 Oct 2026",
        "verified": true,
        "title": "Incredible highway stability",
        "comment": "Drove over 800 km on the highway during heavy monsoon rains. Grip is confidence-inspiring and road noise is minimal.",
        "helpfulCount": 26
      }
    ],
    "reviewCount": 62,
    "price": 6800,
    "originalPrice": 8299,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": false,
    "tag": "Sport Grip",
    "image": "/images/prod-tyre.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-tyre.png",
      "/images/card-automotive.png"
    ],
    "description": "Speed-rated performance radial tire for sedans and SUVs with enhanced lateral traction and optimized hydroplaning resistance in highway and rain conditions.",
    "warranty": "5 Years Unconditional Warranty",
    "highlights": [
      "Asymmetric tread design optimized for high-speed motorway touring and wet road cornering traction",
      "Silica-infused polymer compound delivers lower rolling resistance, improving fuel mileage",
      "Stiff outer shoulder blocks minimize tread squirm under aggressive cornering maneuvers",
      "Jointless nylon cap ply over twin high-tensile steel belts enhances structural strength at high speed",
      "5 Years unconditional manufacturer warranty"
    ],
    "specifications": {
      "Tyre Size": "215/55 R17",
      "Rim Diameter": "17 Inch",
      "Speed Rating": "V (up to 240 km/h)",
      "Load Index": "94 (670 kg per tyre)",
      "Warranty": "5 Years Unconditional Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Express Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "au-5",
    "dealerId": "DEALER_002",
    "dealerName": "Kisan Agro Hub & Spares",
    "name": "Ceramic Rear Brake Pad Kit",
    "category": "Automotive & Spare Parts",
    "subcategory": "Braking Systems",
    "brand": "Brembo",
    "discount": "-25%",
    "savings": 749,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-au-5",
        "author": "Nitin Kadam",
        "location": "Belagavi, Karnataka",
        "rating": 5,
        "date": "28 Sep 2026",
        "verified": true,
        "title": "Clean wheels and smooth deceleration",
        "comment": "Installed together with new discs. Brake pedal response is predictable and smooth without grabbing.",
        "helpfulCount": 15
      }
    ],
    "reviewCount": 58,
    "price": 2250,
    "originalPrice": 2999,
    "stockStatus": "In Stock",
    "inStock": true,
    "featured": false,
    "tag": "Low Dust",
    "image": "/images/prod-brakepads.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-brakepads.png",
      "/images/card-automotive.png"
    ],
    "description": "High performance rear ceramic brake pads designed for minimal rotor wear, noise-free braking, and maximum heat tolerance during emergency deceleration.",
    "warranty": "1 Year OEM Warranty",
    "highlights": [
      "100% copper-free ceramic formulation for consistent friction coefficient across all ambient temps",
      "Precision laser-cut backing plates ensure snug fitment in standard caliper carrier brackets",
      "Pre-burnished friction surface eliminates long bed-in periods for instant stopping power",
      "Minimal dust generation keeping alloy wheels cleaner for longer periods",
      "Approved for commercial vehicles and passenger cars"
    ],
    "specifications": {
      "Axle Position": "Rear Axle Set",
      "Material": "100% Copper-Free Ceramic Matrix",
      "Hardware": "Anti-Vibration Shims Included",
      "Warranty": "1 Year OEM Warranty"
    },
    "seller": {
      "name": "Kisan Agro Hub & Spares",
      "rating": 4.7,
      "badge": "Verified Regional Depot",
      "location": "Solapur, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "413001",
      "coordinates": {
        "lat": 17.6599,
        "lng": 75.9064
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "prod-duramax-alt",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Duramax Tractor Alternator 120A",
    "category": "Automotive & Spare Parts",
    "subcategory": "Electrical & Battery",
    "brand": "Duramax",
    "discount": "-16%",
    "savings": 1600,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-au-6",
        "author": "Harbhajan Brar",
        "location": "Bathinda, Punjab",
        "rating": 5,
        "date": "09 Oct 2026",
        "verified": true,
        "title": "Powers our harvester GPS and night worklights easily",
        "comment": "The stock 45A alternator could not handle 4 LED worklights and AC. This 120A unit charges the battery completely even at idle. Very sturdy.",
        "helpfulCount": 31
      }
    ],
    "reviewCount": 39,
    "price": 8200,
    "originalPrice": 9800,
    "stockStatus": "Limited Stock",
    "inStock": true,
    "featured": true,
    "tag": "High Output",
    "image": "/images/prod-oilfilter-raw.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-oilfilter-raw.png",
      "/images/card-automotive.png"
    ],
    "description": "Industrial high-output sealed alternator designed for tractors, harvesters, and commercial fleets operating under heavy dust and high-temperature conditions.",
    "warranty": "1 Year Direct OEM Warranty",
    "highlights": [
      "High-output 12V 120 Amp steady output designed for tractors and commercial transport fleets",
      "Sealed heavy-duty internal voltage regulator with dual internal cooling fans for thermal protection",
      "Die-cast aluminum casing with labyrinth dust seal protects windings from mud and abrasive soil",
      "Universal 2-ear swivel bracket allows straightforward mounting across Mahindra, Swaraj, and Sonalika",
      "High amp output at idle speed ensures complete battery charging even during slow tilling operations"
    ],
    "specifications": {
      "Voltage / Amperage": "12V / 120 Amps Heavy Output",
      "Rotation": "Clockwise (CW)",
      "Mounting Type": "Universal 2-Ear Swivel Mount",
      "Regulator": "Integrated Solid-State Regulator",
      "Warranty": "1 Year Direct OEM Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Freight Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  },
  {
    "id": "prod-crdi-nozzle",
    "dealerId": "DEALER_001",
    "dealerName": "Apex Agri-Tech & Machinery",
    "name": "Bosch Fuel Injector CR-Diesel",
    "category": "Automotive & Spare Parts",
    "subcategory": "Engine & Drivetrain",
    "brand": "Bosch",
    "discount": "-14%",
    "savings": 1100,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-au-7",
        "author": "Sukhwinder Sandhu",
        "location": "Amritsar, Punjab",
        "rating": 5,
        "date": "17 Sep 2026",
        "verified": true,
        "title": "Black smoke gone, engine runs like brand new",
        "comment": "Tractor was stalling and smoking under rotavator load. Replaced the nozzles with these genuine Bosch units and power delivery is crisp. Verified barcode on box.",
        "helpfulCount": 28
      }
    ],
    "reviewCount": 48,
    "price": 6400,
    "originalPrice": 7500,
    "stockStatus": "Out of Stock",
    "inStock": false,
    "featured": false,
    "tag": "OEM Diesel",
    "image": "/images/prod-brakepads.png",
    "fallbackImage": "/images/card-automotive.png",
    "images": [
      "/images/prod-brakepads.png",
      "/images/card-automotive.png"
    ],
    "description": "Precision common rail diesel fuel injector nozzle unit delivering high atomization pressure for commercial tractor, pickup, and utility diesel engines.",
    "warranty": "6 Months Manufacturer Warranty",
    "highlights": [
      "Genuine Bosch common rail diesel fuel injector nozzle engineered for commercial 3 & 4 cylinder engines",
      "Micro-machined multi-hole spray pattern provides ultra-fine fuel atomization up to 1800 Bar",
      "Restores factory engine torque, eliminates black exhaust smoke, and lowers fuel consumption",
      "Tungsten hard-coated needle valve prevents premature carbon seizure and thermal wear",
      "Factory pre-calibrated with individual IMA / QR calibration code for ECU matching"
    ],
    "specifications": {
      "Operating Pressure": "Up to 1800 Bar Common Rail",
      "Nozzle Holes": "7 Micro-Laser Orifices",
      "Needle Coating": "Tungsten DLC Hardened Alloy",
      "Engine Compatibility": "Mahindra DI, Swaraj CRDI, Sonalika Tiger",
      "Warranty": "6 Months Manufacturer Warranty"
    },
    "seller": {
      "name": "Apex Agri-Tech & Machinery",
      "rating": 4.8,
      "badge": "Certified Brand Depot",
      "location": "Pune, Maharashtra",
      "fulfillment": "GROVE Assured Logistics",
      "pincode": "411026",
      "coordinates": {
        "lat": 18.5204,
        "lng": 73.8567
      }
    },
    "deliveryInfo": {
      "standardDays": "3 - 5 Business Days",
      "shippingFee": "FREE Delivery",
      "dispatchTime": "Dispatched within 24 Hours"
    }
  }
];

export const CATEGORIES = [
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

export const TRUST_FEATURES = [
  {
    id: 1,
    title: "Verified Dealers",
    description: "Direct OEM partnerships and verified regional merchants ensuring genuine goods.",
    iconName: "ShieldCheck",
  },
  {
    id: 2,
    title: "Quality Products",
    description: "Stringent quality controls on machinery, precision tech, and mechanical components.",
    iconName: "Award",
  },
  {
    id: 3,
    title: "Secure Payments",
    description: "Bank-grade encrypted gateway supporting credit cards, net banking, and UPI escrow.",
    iconName: "Lock",
  },
  {
    id: 4,
    title: "Reliable Order Tracking",
    description: "Full dispatch logistics updates with road freight tracking for bulky and parcel goods.",
    iconName: "Truck",
  },
];

// Centralized Dealer Portal Catalog Products mapped by dealerId
export const DEALER_CATALOG_PRODUCTS = [
  // --- DEALER_001 (Demo Dealer / Apex Agri-Tech) ---
  {
    id: 'prod-irr-16mm',
    dealerId: 'DEALER_001',
    name: 'Precision Drip Irrigation Emitter Tube 16mm',
    description: 'High-grade virgin polyethylene drip line engineered for precision crop hydration. Integrated non-draining pressure-compensating emitters ensure uniform flow across undulating agricultural terrain.',
    price: 1850,
    mrp: 2199,
    originalPrice: 2199,
    discount: 15,
    gstRate: 12,
    category: 'Agriculture & Farming',
    subcategory: 'Micro-Irrigation & Tubing',
    specs: {
      material: 'Virgin HDPE (UV Protected)',
      pipeSize: '16 mm (OD)',
      flowRate: '4.0 LPH @ 1.0 Bar'
    },
    sku: 'AGR-IRR-16MM-500M',
    stock: 150,
    threshold: 25,
    location: 'Depot A • Bay 14',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-drp-kit',
    dealerId: 'DEALER_001',
    name: 'HydroHarvest Drip Irrigation Master Kit',
    description: 'Complete farm drip irrigation set with heavy-duty screen filter, mainline lateral piping, micro-emitters, and pressure regulator for commercial vegetable plots.',
    price: 14500,
    mrp: 17500,
    originalPrice: 17500,
    discount: 17,
    gstRate: 12,
    category: 'Agriculture & Farming',
    subcategory: 'Micro-Irrigation & Tubing',
    specs: {
      material: 'Virgin Polyethylene & Brass',
      pipeSize: '25mm Main / 16mm Lateral',
      flowRate: '1200 LPH Capacity'
    },
    sku: 'AG-DRP-801',
    stock: 340,
    threshold: 50,
    location: 'Depot A • Bay 14',
    status: 'active',
    image: '/images/prod-drip.png',
    images: ['/images/prod-drip.png']
  },
  {
    id: 'prod-pto-shaft',
    dealerId: 'DEALER_001',
    name: 'AgroShield 50HP PTO Drive Shaft',
    description: 'Heavy-duty splined PTO shaft with shear bolt torque limiter, forged universal joints, and CE-certified protective safety shroud for rotary tillers and slashers.',
    price: 8900,
    mrp: 10500,
    originalPrice: 10500,
    discount: 15,
    gstRate: 18,
    category: 'Agriculture & Farming',
    subcategory: 'Drivetrain Linkages',
    specs: {
      material: 'Hardened Alloy Steel',
      pipeSize: '1-3/8" 6-Spline',
      flowRate: '540 / 1000 RPM Rated'
    },
    sku: 'AG-PTO-102',
    stock: 82,
    threshold: 20,
    location: 'Depot A • Bay 02',
    status: 'active',
    image: '/images/prod-cultivator.png',
    images: ['/images/prod-cultivator.png']
  },
  {
    id: 'prod-duramax-alt',
    dealerId: 'DEALER_001',
    name: 'Duramax Tractor Alternator 120A',
    description: 'Industrial high-output sealed alternator designed for agricultural tractors and harvester fleets operating under heavy dust and high-temperature conditions.',
    price: 8200,
    mrp: 9800,
    originalPrice: 9800,
    discount: 16,
    gstRate: 18,
    category: 'Automotive & Spare Parts',
    subcategory: 'Electrical Charging',
    specs: {
      material: 'Die-cast Aluminum Housing',
      pipeSize: 'Universal 2-Ear Bracket',
      flowRate: '12V 120A Steady Output'
    },
    sku: 'AU-ALT-404',
    stock: 4,
    threshold: 15,
    location: 'North Bay • WH-2',
    status: 'active',
    image: '/images/prod-oilfilter-raw.png',
    images: ['/images/prod-oilfilter-raw.png']
  },
  {
    id: 'prod-soil-iot',
    dealerId: 'DEALER_001',
    name: 'Precision Soil Sensor Telemetry V2',
    description: 'Multi-depth IoT soil monitoring probe measuring moisture, electrical conductivity (EC), and ground temperature with integrated 4G-LTE telemetry gateway.',
    price: 24500,
    mrp: 29000,
    originalPrice: 29000,
    discount: 15,
    gstRate: 18,
    category: 'Electronics & Gadgets',
    subcategory: 'Smart Ag Tech',
    specs: {
      material: '316L Stainless Steel Probes',
      pipeSize: '60cm Probe Length',
      flowRate: 'Modbus RS485 / Solar Powered'
    },
    sku: 'EL-IOT-301',
    stock: 198,
    threshold: 30,
    location: 'Hub East • Rack C',
    status: 'active',
    image: '/images/prod-smartwatch.png',
    images: ['/images/prod-smartwatch.png']
  },
  {
    id: 'prod-crdi-nozzle',
    dealerId: 'DEALER_001',
    name: 'Bosch Fuel Injector CR-Diesel',
    description: 'Precision common rail diesel fuel injector nozzle unit delivering high atomization pressure for commercial Mahindra, Sonalika, and Swaraj tractor engines.',
    price: 6400,
    mrp: 7500,
    originalPrice: 7500,
    discount: 14,
    gstRate: 18,
    category: 'Automotive & Spare Parts',
    subcategory: 'Combustion Systems',
    specs: {
      material: 'Special Tungsten Coated Steel',
      pipeSize: 'Standard CRDI Mount',
      flowRate: '1800 Bar Rating'
    },
    sku: 'AU-INJ-992',
    stock: 0,
    threshold: 10,
    location: 'Depot A • Bay 09',
    status: 'active',
    image: '/images/prod-brakepads.png',
    images: ['/images/prod-brakepads.png']
  },

  // --- DEALER_002 (Kisan Agro Hub) ---
  {
    id: 'prod-mini-tractor',
    dealerId: 'DEALER_002',
    name: 'Mini Tractor 25 HP Direct OEM',
    description: 'Compact 25 HP 4WD multi-crop diesel tractor designed for orchard operations, inter-row sugarcane weeding, and rotavator tilling with low fuel consumption.',
    price: 350000,
    mrp: 399000,
    originalPrice: 399000,
    discount: 12,
    gstRate: 12,
    category: 'Agriculture & Farming',
    subcategory: 'Farm Machinery',
    specs: {
      material: 'Reinforced Chassis & Alloy Transmission',
      pipeSize: 'Category 1 3-Point Hitch',
      flowRate: '540 RPM PTO / 1200kg Lift'
    },
    sku: 'AG-TRC-025',
    stock: 8,
    threshold: 2,
    location: 'Solapur Yard • Bay 01',
    status: 'active',
    image: '/images/prod-tractor.png',
    images: ['/images/prod-tractor.png']
  },
  {
    id: 'prod-solar-pump-2hp',
    dealerId: 'DEALER_002',
    name: 'Solar Water Pump 2HP Submersible',
    description: 'High-efficiency solar brushless DC water pump set with MPPT controller, dry-run protection, and stainless steel impeller suitable for deep tube wells.',
    price: 28000,
    mrp: 35000,
    originalPrice: 35000,
    discount: 20,
    gstRate: 12,
    category: 'Agriculture & Farming',
    subcategory: 'Water Irrigation',
    specs: {
      material: 'AISI 304 Stainless Steel',
      pipeSize: '50mm Delivery Pipe',
      flowRate: '18,000 Litres/Hour'
    },
    sku: 'AG-SLR-200',
    stock: 24,
    threshold: 5,
    location: 'Solapur Yard • Bay 04',
    status: 'active',
    image: '/images/prod-solar.png',
    images: ['/images/prod-solar.png']
  },
  {
    id: 'prod-car-tyre-15',
    dealerId: 'DEALER_002',
    name: 'Commercial All-Weather Tyre 185/65 R15',
    description: 'High-mileage steel belted radial tyre engineered for rural road transport, pickup trucks, and commercial vehicles with cut-resistant tread compound.',
    price: 4500,
    mrp: 5299,
    originalPrice: 5299,
    discount: 15,
    gstRate: 28,
    category: 'Automotive & Spare Parts',
    subcategory: 'Tires & Wheels',
    specs: {
      material: 'Silica Reinforced Synthetic Rubber',
      pipeSize: '15-inch Rim Diameter',
      flowRate: 'Speed Index H (210 km/h)'
    },
    sku: 'AU-TYR-185',
    stock: 65,
    threshold: 12,
    location: 'Rubber Depot • Rack B',
    status: 'active',
    image: '/images/prod-tyre.png',
    images: ['/images/prod-tyre.png']
  },
  {
    id: 'prod-brake-pad-f',
    dealerId: 'DEALER_002',
    name: 'Front Brake Pad Set OEM Heavy Duty',
    description: 'Ceramic composite brake pads providing fade-resistant stopping performance and extended disc life under high load payload applications.',
    price: 1950,
    mrp: 2499,
    originalPrice: 2499,
    discount: 22,
    gstRate: 18,
    category: 'Automotive & Spare Parts',
    subcategory: 'Braking Systems',
    specs: {
      material: 'Semi-Metallic Ceramic Compound',
      pipeSize: 'Standard Caliper Fitment',
      flowRate: 'Operating Temp up to 650°C'
    },
    sku: 'AU-BRK-101',
    stock: 110,
    threshold: 20,
    location: 'Spares Hub • Shelf 3',
    status: 'active',
    image: '/images/prod-brakepads.png',
    images: ['/images/prod-brakepads.png']
  },
  {
    id: 'prod-hydraulic-shock',
    dealerId: 'DEALER_002',
    name: 'Hydraulic Coilover Shock Absorber',
    description: 'Heavy duty nitrogen-charged twin tube shock absorber with progressive rate spring for agricultural trailers and utility trucks.',
    price: 3250,
    mrp: 4099,
    originalPrice: 4099,
    discount: 20,
    gstRate: 18,
    category: 'Automotive & Spare Parts',
    subcategory: 'Suspension',
    specs: {
      material: 'Hard Chrome Piston Rod',
      pipeSize: 'Eye-to-Eye 420mm',
      flowRate: 'Gas-Hydraulic Damping'
    },
    sku: 'AU-SHK-301',
    stock: 3,
    threshold: 8,
    location: 'Spares Hub • Shelf 5',
    status: 'active',
    image: '/images/prod-shockabsorber.png',
    images: ['/images/prod-shockabsorber.png']
  },
  {
    id: 'prod-amoled-smartwatch',
    dealerId: 'DEALER_002',
    name: 'Field Telemetry Smartwatch V4',
    description: 'Rugged GPS field watch with solar charging assistance, barometric altimeter, and IoT sensor telemetry display for farm estate managers.',
    price: 3999,
    mrp: 5899,
    originalPrice: 5899,
    discount: 32,
    gstRate: 18,
    category: 'Electronics & Gadgets',
    subcategory: 'Wearables & IoT',
    specs: {
      material: 'Polymer Case & Sapphire Glass',
      pipeSize: '1.43-inch AMOLED Display',
      flowRate: '5ATM Waterproof'
    },
    sku: 'EL-WTC-400',
    stock: 45,
    threshold: 10,
    location: 'Electronics Vault • Box 12',
    status: 'active',
    image: '/images/prod-smartwatch.png',
    images: ['/images/prod-smartwatch.png']
  }
];

/**
 * Finds any product across Electronics, Automotive, Dealer Catalog, or Agriculture
 */
export function getProductById(id) {
  if (!id) return null;
  const targetId = String(id).toLowerCase().trim();
  const agri = (agricultureProductsData || []).find((p) => String(p.id).toLowerCase() === targetId);
  if (agri) return agri;
  const el = ELECTRONICS_PRODUCTS.find((p) => String(p.id).toLowerCase() === targetId);
  if (el) return el;
  const au = AUTOMOTIVE_PRODUCTS.find((p) => String(p.id).toLowerCase() === targetId);
  if (au) return au;
  const dc = DEALER_CATALOG_PRODUCTS.find((p) => String(p.id).toLowerCase() === targetId);
  if (dc) return dc;
  const bs = BEST_SELLERS.find((p) => String(p.id).toLowerCase() === targetId);
  if (bs) return bs;
  return null;
}
