import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Search, MapPin, Bed, Bath, Square, Star, ChevronDown,
  Menu, X, ArrowRight, Phone, Mail, MessageCircle, Calendar,
  BarChart2, Home, Users, Settings, Bell, TrendingUp, Eye,
  DollarSign, Building2, Filter, Grid3X3, List, Share2,
  Scale, Maximize2, PlayCircle, ChevronLeft, ChevronRight,
  Check, Plus, Minus, Shield, Award, Clock, Wifi, Car,
  Dumbbell, Waves, Trees, Wind, Zap, Globe, FileText,
  Activity, AlertCircle, MoreHorizontal, User, LogOut,
  CheckCircle, Briefcase, Layers, Tag, Hash, BookOpen,
  PieChart as PieChartIcon, TrendingDown, UserCheck, Package,
  Calculator, Info, Target, Percent
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

type Page = "home" | "detail" | "saved" | "compare" | "admin";
type AdminTab = "dashboard" | "properties" | "agents" | "customers" | "appointments" | "blog" | "analytics" | "messages" | "settings";

interface Property {
  id: number; title: string; location: string; neighborhood: string;
  price: number; priceDisplay: string; rentPrice?: string;
  beds: number; baths: number; sqft: number; type: string;
  status: "For Sale" | "For Rent" | "Sold" | "New";
  badge: string; image: string; images: string[];
  agentId: number; yearBuilt: number; parking: number;
  amenities: string[]; description: string; views: number;
}
interface Agent {
  id: number; name: string; title: string; specialization: string;
  listings: number; sold: number; rating: number; reviews: number;
  phone: string; email: string; image: string; since: number;
}

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════

const PROPERTIES: Property[] = [
  {
    id: 1, title: "Skyline Penthouse at Panorama", location: "3750 S Las Vegas Blvd, Las Vegas, NV 89109",
    neighborhood: "The Strip", price: 4850000, priceDisplay: "$4,850,000",
    beds: 4, baths: 4, sqft: 3800, type: "Penthouse", status: "For Sale", badge: "Featured",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 1, yearBuilt: 2022, parking: 2,
    amenities: ["Infinity Pool", "Private Gym", "Concierge 24/7", "Smart Home", "Wine Cellar", "Rooftop Terrace", "Valet Parking", "Spa"],
    description: "Experience the pinnacle of luxury living in this stunning Strip-view penthouse. Floor-to-ceiling windows bathe the open-plan living spaces in natural light, while the chef's kitchen features imported Italian marble and professional appliances. The primary suite offers a spa-like bathroom with panoramic city views from a soaking tub — a truly cinematic residence above Las Vegas.",
    views: 4820,
  },
  {
    id: 2, title: "Desert Modern Estate", location: "12 Hawk Ridge Dr, Henderson, NV 89052",
    neighborhood: "MacDonald Highlands", price: 7200000, priceDisplay: "$7,200,000",
    beds: 6, baths: 7, sqft: 8500, type: "Villa", status: "For Sale", badge: "New",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1582407947304-fd86f28320c7?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 2, yearBuilt: 2023, parking: 4,
    amenities: ["Heated Pool", "Tennis Court", "Home Theater", "Guest House", "Smart Home", "Wine Room", "Gym", "Outdoor Kitchen"],
    description: "A masterpiece of contemporary desert architecture, this sprawling estate sits on over an acre with breathtaking Red Rock Canyon views. Resort-style pool with a waterfall feature, 4-car garage with EV charging, and a detached guest house make this a once-in-a-generation opportunity in the exclusive MacDonald Highlands community.",
    views: 6340,
  },
  {
    id: 3, title: "One Queensridge Place Penthouse", location: "9101 Alta Dr #PH01, Las Vegas, NV 89145",
    neighborhood: "Queensridge", price: 3200000, priceDisplay: "$3,200,000",
    beds: 3, baths: 3, sqft: 2900, type: "Penthouse", status: "For Sale", badge: "Featured",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 3, yearBuilt: 2019, parking: 2,
    amenities: ["Pool", "Spa", "Concierge", "Fitness Center", "Private Balcony", "Security 24/7"],
    description: "This magnificent corner penthouse at One Queensridge Place exemplifies refined luxury. Wraparound terraces with panoramic city and mountain views, custom millwork throughout, and a gourmet kitchen with Sub-Zero and Wolf appliances define this exceptional residence.",
    views: 3210,
  },
  {
    id: 4, title: "Lake Las Vegas Waterfront Villa", location: "22 Rue De La Paix, Henderson, NV 89011",
    neighborhood: "Lake Las Vegas", price: 2800000, priceDisplay: "$2,800,000",
    beds: 5, baths: 5, sqft: 5200, type: "Villa", status: "For Sale", badge: "Price Drop",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f28320c7?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1582407947304-fd86f28320c7?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 4, yearBuilt: 2020, parking: 3,
    amenities: ["Private Dock", "Pool", "Outdoor Kitchen", "Fire Pit", "Smart Home", "Media Room"],
    description: "A rare waterfront property on the shores of Lake Las Vegas, offering spectacular lake and mountain views. This Tuscan-inspired villa features a private dock, resort-style pool, and a gourmet outdoor kitchen perfect for entertaining in the Nevada sunshine.",
    views: 2870,
  },
  {
    id: 5, title: "The Ridges Summit Retreat", location: "8430 Falconridge Ave, Las Vegas, NV 89128",
    neighborhood: "The Ridges, Summerlin", price: 5900000, priceDisplay: "$5,900,000",
    beds: 5, baths: 6, sqft: 6800, type: "Estate", status: "For Sale", badge: "Featured",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1582407947304-fd86f28320c7?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 1, yearBuilt: 2021, parking: 4,
    amenities: ["Pool & Spa", "Home Theater", "Golf Simulator", "Wine Cellar", "Smart Home", "Outdoor Living", "EV Charging"],
    description: "Situated in the prestigious Ridges community of Summerlin, this architectural gem features custom limestone floors, soaring 14-foot ceilings, and a designer kitchen with professional-grade appliances. The backyard is a private resort with a negative-edge pool and an outdoor entertainment pavilion.",
    views: 5140,
  },
  {
    id: 6, title: "Waldorf Astoria Sky Residence", location: "3700 S Las Vegas Blvd #3501, Las Vegas, NV 89109",
    neighborhood: "CityCenter", price: 12500, priceDisplay: "$12,500/mo", rentPrice: "$12,500/mo",
    beds: 2, baths: 2, sqft: 1850, type: "Apartment", status: "For Rent", badge: "Luxury",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&auto=format",
    ],
    agentId: 2, yearBuilt: 2018, parking: 1,
    amenities: ["Pool", "Spa", "Gym", "Concierge", "Valet", "Room Service"],
    description: "Live the five-star hotel lifestyle year-round in this stunning Waldorf Astoria residence. Floor-to-ceiling windows offer breathtaking Strip views, while residents enjoy access to all Waldorf Astoria amenities including the award-winning Spa, fine dining, and dedicated concierge service.",
    views: 2980,
  },
];

const AGENTS: Agent[] = [
  {
    id: 1, name: "Victoria Sterling", title: "Senior Luxury Specialist",
    specialization: "Ultra-Luxury Estates & Strip-View Residences",
    listings: 34, sold: 127, rating: 4.9, reviews: 89,
    phone: "+1 (702) 555-0191", email: "victoria@vegasproperties.com",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
    since: 2009,
  },
  {
    id: 2, name: "Marcus DuBois", title: "Penthouse & High-Rise Expert",
    specialization: "CityCenter, Strip & High-Rise Condominiums",
    listings: 28, sold: 94, rating: 4.8, reviews: 67,
    phone: "+1 (702) 555-0182", email: "marcus@vegasproperties.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
    since: 2013,
  },
  {
    id: 3, name: "Sophia Reyes", title: "Investment & Portfolio Advisor",
    specialization: "Investment Properties & Market Analytics",
    listings: 19, sold: 73, rating: 4.9, reviews: 54,
    phone: "+1 (702) 555-0173", email: "sophia@vegasproperties.com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
    since: 2016,
  },
  {
    id: 4, name: "James Whitfield", title: "Suburban Estate Specialist",
    specialization: "Summerlin, Henderson & Guard-Gated Communities",
    listings: 41, sold: 156, rating: 4.7, reviews: 112,
    phone: "+1 (702) 555-0164", email: "james@vegasproperties.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
    since: 2007,
  },
];

const TESTIMONIALS = [
  {
    id: 1, rating: 5,
    quote: "Vegas Properties helped us find our dream home in Summerlin in under three weeks. Victoria was always available, deeply knowledgeable, and made the entire process seamless. We couldn't be happier.",
    author: "Robert & Diane Chen", location: "Summerlin, NV", property: "Estate, The Ridges",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: 2, rating: 5,
    quote: "As international buyers, we were nervous about purchasing remotely. The team provided virtual tours, detailed reports, and guided us through every step. Truly world-class service.",
    author: "Amira Al-Hassan", location: "Dubai, UAE → Las Vegas, NV", property: "Penthouse, The Strip",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: 3, rating: 5,
    quote: "Marcus sold our Henderson property for 12% above asking price in just 8 days. The marketing strategy, staging consultation, and negotiation skills were simply outstanding.",
    author: "David & Sarah Goldstein", location: "Henderson, NV", property: "Waterfront Villa, Lake Las Vegas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
  },
];

const BLOG_POSTS = [
  {
    id: 1, category: "Market Report",
    title: "Las Vegas Luxury Market Q3 2025: Record Sales, Rising Demand",
    excerpt: "The luxury segment continues to outperform with median prices up 18% year-over-year, driven by California migration and international investment.",
    date: "July 28, 2025", readTime: "5 min read", author: "Victoria Sterling",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 2, category: "Investment Guide",
    title: "Why Ultra-High-Net-Worth Buyers Are Choosing Las Vegas Over Miami",
    excerpt: "Zero state income tax, world-class entertainment, and rapidly appreciating property values are drawing elite buyers away from traditional luxury markets.",
    date: "July 15, 2025", readTime: "7 min read", author: "Marcus DuBois",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 3, category: "Design Trends",
    title: "Desert Modernism: Architecture Reshaping Las Vegas Estates",
    excerpt: "Biophilic design, sustainable materials, and seamless indoor-outdoor living are defining the next generation of luxury homes in the Mojave landscape.",
    date: "July 5, 2025", readTime: "6 min read", author: "Sophia Reyes",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&auto=format",
  },
];

const salesData = [
  { month: "Jan", revenue: 2.1, deals: 8 }, { month: "Feb", revenue: 3.4, deals: 12 },
  { month: "Mar", revenue: 2.8, deals: 10 }, { month: "Apr", revenue: 4.2, deals: 15 },
  { month: "May", revenue: 3.9, deals: 14 }, { month: "Jun", revenue: 5.1, deals: 18 },
  { month: "Jul", revenue: 6.3, deals: 22 }, { month: "Aug", revenue: 5.8, deals: 20 },
  { month: "Sep", revenue: 7.2, deals: 26 }, { month: "Oct", revenue: 6.9, deals: 24 },
  { month: "Nov", revenue: 8.4, deals: 30 }, { month: "Dec", revenue: 9.1, deals: 33 },
];
const leadSourceData = [
  { name: "Organic Search", value: 32, color: "#C9A227" },
  { name: "Referrals", value: 28, color: "#3B82F6" },
  { name: "Social Media", value: 18, color: "#8B5CF6" },
  { name: "Direct", value: 14, color: "#16A34A" },
  { name: "Paid Ads", value: 8, color: "#94A3B8" },
];
const propertyPerfData = [
  { name: "Desert Modern", views: 6340, leads: 48 },
  { name: "Ridges Summit", views: 5140, leads: 38 },
  { name: "Skyline PH", views: 4820, leads: 36 },
  { name: "Queensridge", views: 3210, leads: 24 },
  { name: "Lake LV", views: 2870, leads: 22 },
];
const recentBookings = [
  { id: "BK-001", property: "Skyline Penthouse", client: "James Morrison", date: "Aug 5, 2025", time: "10:00 AM", agent: "Victoria S.", status: "Confirmed" },
  { id: "BK-002", property: "Desert Modern Estate", client: "Li Wei Chen", date: "Aug 5, 2025", time: "2:30 PM", agent: "Marcus D.", status: "Confirmed" },
  { id: "BK-003", property: "One Queensridge Place", client: "Natasha Williams", date: "Aug 6, 2025", time: "11:00 AM", agent: "Sophia R.", status: "Pending" },
  { id: "BK-004", property: "Lake Las Vegas Villa", client: "Robert Chen", date: "Aug 6, 2025", time: "3:00 PM", agent: "James W.", status: "Confirmed" },
  { id: "BK-005", property: "Summerlin Summit", client: "David Goldstein", date: "Aug 7, 2025", time: "9:00 AM", agent: "Victoria S.", status: "Pending" },
];

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

const calcMonthly = (p: number, annualRate: number, years: number) => {
  const r = annualRate / 100 / 12, n = years * 12;
  if (r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

// ═══════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════

function GoldLine() {
  return <div className="w-10 h-0.5" style={{ backgroundColor: "#C9A227" }} />;
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} className={i <= n ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-300"} />
      ))}
    </div>
  );
}

function Pill({ text }: { text: string }) {
  const map: Record<string, string> = {
    Featured: "bg-[#C9A227] text-white",
    New: "bg-[#16A34A] text-white",
    "Price Drop": "bg-rose-500 text-white",
    Luxury: "bg-[#0F172A] text-[#C9A227]",
    Sold: "bg-gray-500 text-white",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide ${map[text] ?? "bg-gray-200 text-gray-700"}`}>
      {text}
    </span>
  );
}

function SectionHeader({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <GoldLine />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>{tag}</span>
      </div>
      <h2 className="font-display text-4xl lg:text-5xl text-[#0F172A] font-bold mb-3">{title}</h2>
      {sub && <p className="text-gray-500 text-lg max-w-2xl">{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROPERTY CARD
// ═══════════════════════════════════════════════════════════

function PropertyCard({
  property, saved, onSave, compared, onCompare, onQuickView, onBook, onView,
}: {
  property: Property; saved: boolean; compared: boolean;
  onSave: (id: number) => void; onCompare: (id: number) => void;
  onQuickView: (p: Property) => void; onBook: (p: Property) => void;
  onView: (p: Property) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 group"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <img
          src={property.image} alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundColor: "#e2e8f0" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Pill text={property.badge} />
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm border
            ${property.status === "For Rent" ? "bg-blue-500/80 text-white border-blue-400/30" : "bg-white/15 text-white border-white/30"}`}>
            {property.status}
          </span>
        </div>
        {/* Hover action strip */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button onClick={e => { e.stopPropagation(); onSave(property.id); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200
              ${saved ? "bg-[#C9A227] border-[#C9A227] text-white" : "bg-white/20 border-white/40 text-white hover:bg-[#C9A227]"}`}>
            <Heart size={16} className={saved ? "fill-white" : ""} />
          </button>
          <button onClick={e => { e.stopPropagation(); onCompare(property.id); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200
              ${compared ? "bg-blue-500 border-blue-400 text-white" : "bg-white/20 border-white/40 text-white hover:bg-blue-500"}`}>
            <Scale size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); onQuickView(property); }}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/20 border border-white/40 text-white hover:bg-white hover:text-[#0F172A] transition-all duration-200">
            <Eye size={16} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold text-xl font-display">
            {property.rentPrice ?? property.priceDisplay}
          </p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-[#0F172A] text-lg mb-1 leading-snug">{property.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
          <MapPin size={12} style={{ color: "#C9A227" }} />{property.neighborhood}
        </p>
        <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3 mb-4">
          <span className="flex items-center gap-1"><Bed size={14} style={{ color: "#C9A227" }} />{property.beds} Beds</span>
          <span className="flex items-center gap-1"><Bath size={14} style={{ color: "#C9A227" }} />{property.baths} Baths</span>
          <span className="flex items-center gap-1"><Square size={14} style={{ color: "#C9A227" }} />{property.sqft.toLocaleString()} ft²</span>
        </div>
        <div className="flex gap-2">
          <button onClick={e => { e.stopPropagation(); onBook(property); }}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C9A227" }}>
            Book Inspection
          </button>
          <button onClick={() => onView(property)}
            className="px-4 py-2.5 rounded-xl border-2 border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all duration-200">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════

function Navbar({ currentPage, setPage, savedCount, compareCount }: {
  currentPage: Page; setPage: (p: Page) => void; savedCount: number; compareCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const onHome = currentPage === "home";
  const light = onHome && !scrolled;
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
      !light ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-20">
        <button onClick={() => setPage("home")} className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold tracking-widest"
            style={{ backgroundColor: "#C9A227" }}>VP</div>
          <div className="text-left hidden sm:block">
            <p className={`font-display font-bold text-base leading-none ${light ? "text-white" : "text-[#0F172A]"}`}>Vegas Properties</p>
            <p className={`text-xs ${light ? "text-white/60" : "text-gray-400"}`}>Luxury Real Estate</p>
          </div>
        </button>
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {["Home","Properties","Buy","Rent","Agents","Insights","Contact"].map(l => (
            <button key={l} onClick={() => l === "Home" && setPage("home")}
              className={`transition-colors hover:text-[#C9A227] ${light ? "text-white/85" : "text-gray-600"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setPage("saved")} className="relative flex items-center gap-1">
            <Heart size={20} className={`transition-colors ${savedCount > 0 ? "fill-[#C9A227] text-[#C9A227]" : light ? "text-white/80" : "text-gray-600"}`} />
            {savedCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#C9A227" }}>{savedCount}</span>}
          </button>
          {compareCount > 0 && (
            <button onClick={() => setPage("compare")} className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
              <Scale size={18} /><span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{compareCount}</span>
            </button>
          )}
          <a href="#" className={`transition-colors hover:text-green-500 ${light ? "text-white/80" : "text-gray-600"}`}>
            <MessageCircle size={20} />
          </a>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C9A227" }}>
            Book Consultation
          </button>
        </div>
        <button className={`lg:hidden ${light ? "text-white" : "text-[#0F172A]"}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="px-5 py-4 space-y-3">
              {["Home","Properties","Buy","Rent","Agents","Insights","Contact"].map(l => (
                <button key={l} onClick={() => { if (l === "Home") setPage("home"); setMobileOpen(false); }}
                  className="block w-full text-left text-[#0F172A] font-medium py-1.5 hover:text-[#C9A227] transition-colors">
                  {l}
                </button>
              ))}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button onClick={() => { setPage("saved"); setMobileOpen(false); }}
                  className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                  <Heart size={16} /> Saved ({savedCount})
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#C9A227" }}>
                  Consult
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════

function HeroSection({ onScrollDown }: { onScrollDown: () => void }) {
  const [form, setForm] = useState({ location: "", type: "", price: "", beds: "", baths: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop&auto=format"
          alt="Luxury Las Vegas estate" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.55) 50%, rgba(15,23,42,0.80) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 70% 60%, rgba(201,162,39,0.06) 0%, transparent 60%)"
        }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: "#C9A227" }} />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#C9A227" }}>Las Vegas Luxury Real Estate</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-white text-5xl lg:text-[72px] font-bold leading-[1.1] mb-6 max-w-4xl">
          Where Luxury Meets<br />
          <span style={{ color: "#C9A227" }}>Extraordinary Living</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-white/70 text-xl mb-10 max-w-2xl leading-relaxed">
          Discover Las Vegas's most exclusive properties. From Strip penthouses to desert estates — we connect discerning buyers with homes that redefine luxury.
        </motion.p>
        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="rounded-2xl p-2 mb-10 shadow-2xl border border-white/15"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="flex flex-col lg:flex-row gap-2">
            {[
              { icon: MapPin, label: "Location", key: "location", type: "input", placeholder: "Las Vegas, NV" },
            ].map(({ icon: Icon, label, key, placeholder }) => (
              <div key={key} className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3 min-w-0">
                <Icon size={17} style={{ color: "#C9A227", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                  <input className="w-full text-[#0F172A] text-sm bg-transparent outline-none font-medium placeholder-gray-400"
                    placeholder={placeholder} value={(form as any)[key]}
                    onChange={e => set(key, e.target.value)} />
                </div>
              </div>
            ))}
            {[
              { icon: Building2, label: "Type", key: "type", opts: ["All Types","Penthouse","Villa","Estate","Apartment","Townhouse"] },
              { icon: DollarSign, label: "Max Price", key: "price", opts: ["Any Price","$1M – $2M","$2M – $5M","$5M – $10M","$10M+"] },
              { icon: Bed, label: "Bedrooms", key: "beds", opts: ["Any","1+","2+","3+","4+","5+"] },
              { icon: Bath, label: "Bathrooms", key: "baths", opts: ["Any","1+","2+","3+","4+"] },
            ].map(({ icon: Icon, label, key, opts }) => (
              <div key={key} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 min-w-[130px]">
                <Icon size={17} style={{ color: "#C9A227", flexShrink: 0 }} />
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                  <select className="w-full text-[#0F172A] text-sm bg-transparent outline-none font-medium"
                    value={(form as any)[key]} onChange={e => set(key, e.target.value)}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <button onClick={onScrollDown}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#C9A227" }}>
              <Search size={17} /> Search
            </button>
          </div>
        </motion.div>
        {/* Trust Badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-8">
          {[
            { icon: Building2, num: "2,400+", label: "Premium Listings" },
            { icon: Users, num: "800+", label: "Happy Clients" },
            { icon: Award, num: "$2.4B+", label: "Properties Sold" },
            { icon: Shield, num: "18 Years", label: "Of Excellence" },
          ].map(({ icon: Icon, num, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)" }}>
                <Icon size={18} style={{ color: "#C9A227" }} />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{num}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <div className="w-px h-6 bg-gradient-to-b from-white/60 to-transparent" />
        <ChevronDown size={16} className="text-white animate-bounce" />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// FILTERS PANEL
// ═══════════════════════════════════════════════════════════

function FiltersPanel({ show, onClose, onApply }: {
  show: boolean; onClose: () => void; onApply: (f: any) => void;
}) {
  const [type, setType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(500000);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const amenityList = ["Pool","Gym","Smart Home","Wine Cellar","Home Theater","Guest House","Tennis Court","EV Charging"];
  const typeList = ["Penthouse","Villa","Estate","Apartment","Townhouse"];
  const toggleArr = (arr: string[], set: (a: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 bg-white shadow-2xl overflow-y-auto"
            style={{ width: 380 }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-[#0F172A]">Advanced Filters</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={16} />
                </button>
              </div>
              {/* Type */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#0F172A] mb-3">Property Type</p>
                <div className="flex flex-wrap gap-2">
                  {typeList.map(t => (
                    <button key={t} onClick={() => toggleArr(type, setType, t)}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 font-medium transition-all
                        ${type.includes(t) ? "border-[#C9A227] text-[#C9A227] bg-amber-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#0F172A] mb-3">Price Range</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Min</p>
                    <select className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0F172A] font-medium focus:border-[#C9A227] outline-none"
                      value={minPrice} onChange={e => setMinPrice(+e.target.value)}>
                      {[500000,1000000,2000000,3000000,5000000].map(v => (
                        <option key={v} value={v}>${(v/1000000).toFixed(v < 1000000 ? 1 : 0)}M</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Max</p>
                    <select className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0F172A] font-medium focus:border-[#C9A227] outline-none"
                      value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}>
                      {[2000000,5000000,8000000,10000000,20000000].map(v => (
                        <option key={v} value={v}>${(v/1000000).toFixed(0)}M</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Beds / Baths */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {[["Bedrooms",beds,setBeds],["Bathrooms",baths,setBaths]].map(([label, val, setter]: any) => (
                  <div key={label as string}>
                    <p className="text-sm font-semibold text-[#0F172A] mb-3">{label}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {[0,1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setter(n)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium border-2 transition-all
                            ${val === n ? "border-[#C9A227] bg-amber-50 text-[#C9A227]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          {n === 0 ? "Any" : `${n}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Amenities */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#0F172A] mb-3">Amenities</p>
                <div className="grid grid-cols-2 gap-2">
                  {amenityList.map(a => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer group">
                      <div onClick={() => toggleArr(amenities, setAmenities, a)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${amenities.includes(a) ? "border-[#C9A227] bg-[#C9A227]" : "border-gray-300 group-hover:border-gray-400"}`}>
                        {amenities.includes(a) && <Check size={11} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-600">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setType([]); setBeds(0); setBaths(0); setAmenities([]); }}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                  Reset
                </button>
                <button onClick={() => { onApply({ type, minPrice, maxPrice, beds, baths, amenities }); onClose(); }}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#C9A227" }}>
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════
// MAP SECTION
// ═══════════════════════════════════════════════════════════

function MapSection({ properties, onView }: { properties: Property[]; onView: (p: Property) => void }) {
  const [active, setActive] = useState<number | null>(null);
  const markers = [
    { id: 1, x: 55, y: 52, label: "$4.85M" }, { id: 2, x: 72, y: 68, label: "$7.2M" },
    { id: 3, x: 28, y: 38, label: "$3.2M" }, { id: 4, x: 80, y: 42, label: "$2.8M" },
    { id: 5, x: 18, y: 30, label: "$5.9M" }, { id: 6, x: 52, y: 60, label: "$12.5K" },
  ];
  const activeProperty = active ? properties.find(p => p.id === active) : null;
  return (
    <section className="py-24 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="Explore" title="Find Your Dream Location" sub="Interactive map of premium Las Vegas properties across the valley" />
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden relative" style={{ height: 480, backgroundColor: "#0F172A" }}>
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "linear-gradient(rgba(201,162,39,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
            {/* Stylized roads */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="50" y1="0" x2="50" y2="100" stroke="#C9A227" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#C9A227" strokeWidth="0.5" />
              <line x1="30" y1="0" x2="30" y2="100" stroke="#C9A227" strokeWidth="0.2" />
              <line x1="70" y1="0" x2="70" y2="100" stroke="#C9A227" strokeWidth="0.2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="#C9A227" strokeWidth="0.2" />
              <line x1="0" y1="70" x2="100" y2="70" stroke="#C9A227" strokeWidth="0.2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#C9A227" strokeWidth="0.3" strokeDasharray="2,2" />
            </svg>
            {/* Labels */}
            <div className="absolute inset-0 p-4">
              {[["The Strip", 46, 56], ["Summerlin", 14, 24], ["Henderson", 70, 74], ["Queensridge", 23, 34]].map(([label, x, y]) => (
                <span key={label as string} className="absolute text-white/30 text-xs font-medium select-none"
                  style={{ left: `${x}%`, top: `${y}%` }}>{label as string}</span>
              ))}
            </div>
            {/* Property markers */}
            {markers.map(m => {
              const prop = properties.find(p => p.id === m.id);
              return (
                <button key={m.id}
                  onClick={() => setActive(active === m.id ? null : m.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold shadow-lg border transition-all
                    ${active === m.id ? "text-[#0F172A] scale-110" : "text-white border-white/30 bg-white/10 hover:bg-white/20"}
                  `} style={active === m.id ? { backgroundColor: "#C9A227", border: "none" } : {}}>
                    {m.label}
                  </div>
                  <div className="w-2 h-2 rounded-full mx-auto mt-0.5"
                    style={{ backgroundColor: active === m.id ? "#C9A227" : "rgba(201,162,39,0.6)" }} />
                </button>
              );
            })}
            {/* Overlay label */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A227" }} />
              <span className="text-white/50 text-xs">Las Vegas Metro Area</span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="text-white/30 text-xs">Click markers for details</span>
            </div>
          </div>
          {/* Property list / detail */}
          <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 480 }}>
            {activeProperty ? (
              <motion.div key={activeProperty.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img src={activeProperty.image} alt={activeProperty.title}
                  className="w-full h-44 object-cover" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#C9A227" }}>{activeProperty.neighborhood}</p>
                  <h4 className="font-semibold text-[#0F172A] mb-2">{activeProperty.title}</h4>
                  <p className="font-display text-2xl font-bold text-[#0F172A] mb-3">{activeProperty.priceDisplay}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Bed size={13} style={{ color: "#C9A227" }} />{activeProperty.beds}</span>
                    <span className="flex items-center gap-1"><Bath size={13} style={{ color: "#C9A227" }} />{activeProperty.baths}</span>
                    <span className="flex items-center gap-1"><Square size={13} style={{ color: "#C9A227" }} />{activeProperty.sqft.toLocaleString()}</span>
                  </div>
                  <button onClick={() => onView(activeProperty)}
                    className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                    style={{ backgroundColor: "#C9A227" }}>
                    View Property
                  </button>
                </div>
              </motion.div>
            ) : (
              properties.slice(0, 4).map(p => (
                <motion.button key={p.id} onClick={() => setActive(p.id)}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#C9A227]/30 hover:shadow-md transition-all text-left group">
                  <img src={p.image} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ backgroundColor: "#e2e8f0" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172A] text-sm leading-snug mb-0.5 truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 mb-1">{p.neighborhood}</p>
                    <p className="font-bold text-sm font-display" style={{ color: "#C9A227" }}>{p.priceDisplay}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#C9A227] transition-colors self-center flex-shrink-0" />
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// AGENTS SECTION
// ═══════════════════════════════════════════════════════════

function AgentsSection() {
  return (
    <section className="py-24 px-5 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: "#C9A227" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>Our Team</span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">Expert Agents,<br />Exceptional Results</h2>
          </div>
          <p className="text-white/50 text-base max-w-sm">Our luxury specialists have a combined $2.4B in closed transactions and unmatched knowledge of the Las Vegas market.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent, i) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden group cursor-pointer"
              style={{ backgroundColor: "#151F32", border: "1px solid rgba(201,162,39,0.12)" }}>
              <div className="relative" style={{ height: 220 }}>
                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Stars n={Math.floor(agent.rating)} />
                  <span className="text-white/70 text-xs">{agent.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white text-base mb-0.5">{agent.name}</h4>
                <p className="text-xs mb-3" style={{ color: "#C9A227" }}>{agent.title}</p>
                <p className="text-white/40 text-xs mb-4 leading-snug">{agent.specialization}</p>
                <div className="flex gap-4 text-xs text-white/50 mb-4">
                  <span><strong className="text-white font-semibold">{agent.listings}</strong> Listings</span>
                  <span><strong className="text-white font-semibold">{agent.sold}</strong> Sold</span>
                  <span><strong className="text-white font-semibold">{agent.reviews}</strong> Reviews</span>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${agent.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/15 text-white/70 text-xs hover:border-[#C9A227]/40 hover:text-white transition-all">
                    <Phone size={13} /> Call
                  </a>
                  <a href={`mailto:${agent.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#0F172A] text-xs font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#C9A227" }}>
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-24 px-5 lg:px-8 overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader tag="Testimonials" title={"What Our Clients\nSay About Us"} />
            <div className="space-y-3 mt-8">
              {TESTIMONIALS.map((t, i) => (
                <button key={t.id} onClick={() => setActive(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300
                    ${active === i ? "border-[#C9A227] bg-amber-50/50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-[#0F172A] text-sm">{t.author}</p>
                      <p className="text-gray-400 text-xs">{t.property}</p>
                    </div>
                    {active === i && <div className="ml-auto w-1.5 h-5 rounded-full" style={{ backgroundColor: "#C9A227" }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
                  style={{ backgroundColor: "#C9A227" }} />
                <div className="text-6xl font-display leading-none mb-4" style={{ color: "#C9A227" }}>"</div>
                <Stars n={TESTIMONIALS[active].rating} />
                <p className="text-[#0F172A] text-lg leading-relaxed mt-4 mb-6 font-medium">
                  {TESTIMONIALS[active].quote}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img src={TESTIMONIALS[active].avatar} alt={TESTIMONIALS[active].author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-100" />
                  <div>
                    <p className="font-bold text-[#0F172A]">{TESTIMONIALS[active].author}</p>
                    <p className="text-gray-400 text-sm">{TESTIMONIALS[active].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// INSIGHTS / BLOG
// ═══════════════════════════════════════════════════════════

function InsightsSection() {
  return (
    <section className="py-24 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <SectionHeader tag="Insights" title="Market Intelligence" sub="Expert analysis, trends, and investment perspectives from our team" />
          <button className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#C9A227] text-[#0F172A] flex-shrink-0 mb-12">
            View All Articles <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group cursor-pointer border border-gray-100">
              <div className="relative overflow-hidden" style={{ height: 220 }}>
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundColor: "#e2e8f0" }} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: "#C9A227" }}>{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[#0F172A] text-base leading-snug mb-2 group-hover:text-[#C9A227] transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <User size={12} /><span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════

function CTASection() {
  return (
    <section className="relative py-28 px-5 lg:px-8 overflow-hidden" style={{ backgroundColor: "#0F172A" }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=600&fit=crop&auto=format"
          alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.12) 0%, transparent 70%)"
        }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: "#C9A227" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227" }}>Get Started</span>
            <div className="h-px w-8" style={{ backgroundColor: "#C9A227" }} />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">
            Your Dream Property<br />Awaits Discovery
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-2xl mx-auto">
            Schedule a private consultation with one of our luxury specialists. We'll match you with properties that exceed your expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[#0F172A] font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#C9A227" }}>
              <Calendar size={18} /> Schedule Consultation
            </button>
            <a href="#" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-sm border-2 border-white/20 hover:border-white/40 transition-colors">
              <MessageCircle size={18} /> WhatsApp Us Now
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/40 text-sm">
            {["No obligation consultation","Available 7 days a week","Private & confidential","International buyers welcome"].map(t => (
              <span key={t} className="flex items-center gap-2"><CheckCircle size={14} style={{ color: "#C9A227" }} />{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer style={{ backgroundColor: "#060C18" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#C9A227" }}>VP</div>
              <span className="font-display font-bold text-white text-lg">Vegas Properties</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-xs">
              Las Vegas's premier luxury real estate firm. Connecting extraordinary properties with extraordinary people since 2007.
            </p>
            <div className="flex gap-3">
              {["FB","IG","TW","LI","YT"].map(s => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 text-xs font-bold border border-white/10 hover:border-[#C9A227]/40 hover:text-[#C9A227] transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Properties", links: ["Buy","Rent","New Listings","Penthouses","Villas","Featured"] },
            { title: "Company", links: ["About Us","Our Agents","Careers","Press","Awards","Blog"] },
            { title: "Contact", links: ["+1 (702) 555-0100","info@vegasproperties.com","3250 S Las Vegas Blvd","Las Vegas, NV 89109","Mon–Sat: 9am–7pm"] },
          ].map(col => (
            <div key={col.title}>
              <h5 className="text-white font-semibold text-sm mb-4">{col.title}</h5>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-white/40 text-sm hover:text-[#C9A227] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-white/25 text-xs">© 2025 Vegas Properties. All rights reserved. Licensed Nevada Real Estate Broker.</p>
          <div className="flex gap-4 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
            <button onClick={() => setPage("admin")} className="hover:text-[#C9A227] transition-colors">Admin Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════

function HomePage({ savedIds, compareIds, onSave, onCompare, onQuickView, onBook, onView, setPage }: {
  savedIds: number[]; compareIds: number[];
  onSave: (id: number) => void; onCompare: (id: number) => void;
  onQuickView: (p: Property) => void; onBook: (p: Property) => void;
  onView: (p: Property) => void; setPage: (p: Page) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<any>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const filteredProps = filter
    ? PROPERTIES.filter(p => {
        if (filter.type?.length && !filter.type.includes(p.type)) return false;
        if (p.status !== "For Rent" && (p.price < filter.minPrice || p.price > filter.maxPrice)) return false;
        if (filter.beds > 0 && p.beds < filter.beds) return false;
        if (filter.baths > 0 && p.baths < filter.baths) return false;
        return true;
      })
    : PROPERTIES;

  return (
    <div className="bg-[#F8FAFC]">
      <HeroSection onScrollDown={() => featuredRef.current?.scrollIntoView({ behavior: "smooth" })} />
      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-6 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
          {[
            { n: "2,400+", l: "Active Listings" }, { n: "$4.2B", l: "Total Value Managed" },
            { n: "98%", l: "Client Satisfaction" }, { n: "48hr", l: "Avg. Response Time" },
          ].map(({ n, l }) => (
            <div key={l} className="text-center px-4">
              <p className="font-display text-3xl font-bold text-[#0F172A]">{n}</p>
              <p className="text-gray-400 text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Featured Properties */}
      <section ref={featuredRef} className="py-24 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
            <SectionHeader tag="Portfolio" title="Featured Properties" sub="Hand-selected residences representing the pinnacle of Las Vegas luxury" />
            <div className="flex items-center gap-3 mb-12">
              <button onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:border-[#C9A227] hover:text-[#C9A227] transition-all">
                <Filter size={16} /> Filters {filter && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A227" }} />}
              </button>
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "text-white" : "text-gray-400"}`}
                  style={view === "grid" ? { backgroundColor: "#C9A227" } : {}}>
                  <Grid3X3 size={16} />
                </button>
                <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "text-white" : "text-gray-400"}`}
                  style={view === "list" ? { backgroundColor: "#C9A227" } : {}}>
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
          {filteredProps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-3">No properties match your filters.</p>
              <button onClick={() => setFilter(null)} className="text-sm font-semibold" style={{ color: "#C9A227" }}>Clear filters</button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProps.map(p => (
                view === "grid" ? (
                  <PropertyCard key={p.id} property={p} saved={savedIds.includes(p.id)} compared={compareIds.includes(p.id)}
                    onSave={onSave} onCompare={onCompare} onQuickView={onQuickView} onBook={onBook} onView={onView} />
                ) : (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex hover:shadow-lg transition-shadow">
                    <img src={p.image} alt={p.title} className="w-56 h-40 object-cover flex-shrink-0" style={{ backgroundColor: "#e2e8f0" }} />
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-[#0F172A]">{p.title}</h3>
                          <Pill text={p.badge} />
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                          <MapPin size={12} style={{ color: "#C9A227" }} />{p.location}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Bed size={14} style={{ color: "#C9A227" }} />{p.beds} Beds</span>
                          <span className="flex items-center gap-1"><Bath size={14} style={{ color: "#C9A227" }} />{p.baths} Baths</span>
                          <span className="flex items-center gap-1"><Square size={14} style={{ color: "#C9A227" }} />{p.sqft.toLocaleString()} ft²</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-display text-2xl font-bold text-[#0F172A]">{p.rentPrice ?? p.priceDisplay}</p>
                        <div className="flex gap-2">
                          <button onClick={() => onBook(p)} className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                            style={{ backgroundColor: "#C9A227" }}>Book</button>
                          <button onClick={() => onView(p)} className="px-4 py-2 rounded-xl border-2 border-[#0F172A] text-[#0F172A] text-sm font-semibold hover:bg-[#0F172A] hover:text-white transition-all">View</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <button className="px-8 py-3.5 rounded-xl border-2 border-[#0F172A] text-[#0F172A] font-semibold text-sm hover:bg-[#0F172A] hover:text-white transition-all duration-300">
              View All 2,400+ Properties <ArrowRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>
      <MapSection properties={PROPERTIES} onView={onView} />
      <AgentsSection />
      <TestimonialsSection />
      <InsightsSection />
      <CTASection />
      <Footer setPage={setPage} />
      <FiltersPanel show={showFilters} onClose={() => setShowFilters(false)} onApply={setFilter} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROPERTY DETAIL PAGE
// ═══════════════════════════════════════════════════════════

function PropertyDetailPage({ property, savedIds, onSave, onBook, onBack }: {
  property: Property; savedIds: number[];
  onSave: (id: number) => void; onBook: (p: Property) => void; onBack: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "tour" | "floor">("gallery");
  const [principal, setPrincipal] = useState(property.price > 100000 ? property.price * 0.8 : 500000);
  const [rate, setRate] = useState(7.25);
  const [term, setTerm] = useState(30);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const monthly = calcMonthly(principal, rate, term);
  const agent = AGENTS.find(a => a.id === property.agentId) || AGENTS[0];
  const amenityIcons: Record<string, any> = {
    "Infinity Pool": Waves, "Heated Pool": Waves, Pool: Waves, "Private Gym": Dumbbell, Gym: Dumbbell,
    "Concierge 24/7": Shield, Concierge: Shield, "Smart Home": Zap, "Wine Cellar": Globe, "Wine Room": Globe,
    "Rooftop Terrace": Layers, "Valet Parking": Car, Spa: Waves, "Tennis Court": Target,
    "Home Theater": PlayCircle, "Guest House": Home, "Outdoor Kitchen": Zap, "Media Room": PlayCircle,
    "EV Charging": Zap, "Golf Simulator": Target, "Private Dock": Globe,
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Back & Actions */}
      <div className="pt-24 pb-4 px-5 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#0F172A] transition-colors text-sm font-medium">
          <ChevronLeft size={18} /> Back to Properties
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => onSave(property.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
              ${savedIds.includes(property.id) ? "border-[#C9A227] text-[#C9A227] bg-amber-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            <Heart size={16} className={savedIds.includes(property.id) ? "fill-[#C9A227]" : ""} />
            {savedIds.includes(property.id) ? "Saved" : "Save"}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300 transition-colors">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
      <div className="px-5 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery / Tour toggle */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-100">
                {[
                  { key: "gallery", icon: Grid3X3, label: "Photos" },
                  { key: "tour", icon: Globe, label: "360° Tour" },
                  { key: "floor", icon: Layers, label: "Floor Plan" },
                ].map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => setViewMode(key as any)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all
                      ${viewMode === key ? "border-[#C9A227] text-[#C9A227]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    <Icon size={15} />{label}
                  </button>
                ))}
              </div>
              {viewMode === "gallery" && (
                <div>
                  <div className="relative" style={{ height: 420 }}>
                    <AnimatePresence mode="wait">
                      <motion.img key={activeImg} src={property.images[activeImg] ?? property.image}
                        alt={property.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="w-full h-full object-cover" style={{ backgroundColor: "#e2e8f0" }} />
                    </AnimatePresence>
                    <button onClick={() => setActiveImg(i => (i - 1 + property.images.length) % property.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setActiveImg(i => (i + 1) % property.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {activeImg + 1} / {property.images.length}
                    </div>
                  </div>
                  <div className="flex gap-2 p-3">
                    {property.images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`relative rounded-lg overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? "ring-2 ring-[#C9A227]" : "opacity-60 hover:opacity-100"}`}
                        style={{ width: 72, height: 52 }}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <button className="flex-1 rounded-lg bg-gray-100 flex items-center justify-center gap-2 text-gray-400 text-xs hover:bg-gray-200 transition-colors">
                      <PlayCircle size={14} /> Video Tour
                    </button>
                  </div>
                </div>
              )}
              {viewMode === "tour" && (
                <div className="relative flex items-center justify-center" style={{ height: 480, background: "linear-gradient(135deg, #0F172A 0%, #1e3a5f 100%)" }}>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(201,162,39,0.2)", border: "2px solid rgba(201,162,39,0.4)" }}>
                      <Globe size={36} style={{ color: "#C9A227" }} />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">360° Virtual Tour</p>
                    <p className="text-white/50 text-sm mb-6 max-w-xs">Experience every room and outdoor space of this stunning property</p>
                    <button className="px-6 py-3 rounded-xl text-[#0F172A] font-semibold text-sm" style={{ backgroundColor: "#C9A227" }}>
                      Launch Virtual Tour
                    </button>
                  </div>
                </div>
              )}
              {viewMode === "floor" && (
                <div className="flex items-center justify-center p-8" style={{ height: 480, backgroundColor: "#F8FAFC" }}>
                  <div className="text-center">
                    <Layers size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-400 font-medium mb-2">Floor Plan Available</p>
                    <p className="text-gray-300 text-sm mb-6">Download the detailed floor plan for this property</p>
                    <button className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#0F172A" }}>
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Pill text={property.badge} />
                    <span className="text-gray-400 text-sm">{property.type} · {property.status}</span>
                  </div>
                  <h1 className="font-display text-3xl font-bold text-[#0F172A] mb-1">{property.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1.5"><MapPin size={14} style={{ color: "#C9A227" }} />{property.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl font-bold text-[#0F172A]">{property.rentPrice ?? property.priceDisplay}</p>
                  {property.status !== "For Rent" && <p className="text-gray-400 text-sm">${Math.round(property.price / property.sqft).toLocaleString()} / ft²</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                {[
                  { icon: Bed, label: "Bedrooms", val: property.beds },
                  { icon: Bath, label: "Bathrooms", val: property.baths },
                  { icon: Square, label: "Area", val: `${property.sqft.toLocaleString()} ft²` },
                  { icon: Car, label: "Parking", val: `${property.parking} Cars` },
                  { icon: Building2, label: "Type", val: property.type },
                  { icon: Calendar, label: "Year Built", val: property.yearBuilt },
                  { icon: Eye, label: "Views", val: property.views.toLocaleString() },
                  { icon: Tag, label: "Status", val: property.status },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="text-center p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                    <Icon size={18} className="mx-auto mb-1" style={{ color: "#C9A227" }} />
                    <p className="text-[#0F172A] font-semibold text-sm">{val}</p>
                    <p className="text-gray-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-[#0F172A] mb-2">About This Property</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
              </div>
            </div>
            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-[#0F172A] text-lg mb-4">Premium Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(a => {
                  const Icon = amenityIcons[a] || CheckCircle;
                  return (
                    <div key={a} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                      <Icon size={16} style={{ color: "#C9A227", flexShrink: 0 }} />
                      <span className="text-sm font-medium text-[#0F172A]">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Map placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#0F172A]">Location</h3>
                <p className="text-gray-400 text-sm mt-0.5">{property.location}</p>
              </div>
              <div className="relative flex items-center justify-center" style={{ height: 240, backgroundColor: "#0F172A" }}>
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "linear-gradient(rgba(201,162,39,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.4) 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }} />
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "#C9A227" }}>
                    <MapPin size={20} className="text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">{property.neighborhood}</p>
                  <p className="text-white/40 text-xs">Las Vegas, NV</p>
                </div>
              </div>
            </div>
            {/* Mortgage Calculator */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Calculator size={20} style={{ color: "#C9A227" }} />
                <h3 className="font-semibold text-[#0F172A] text-lg">Mortgage Calculator</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">Loan Amount</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#C9A227] transition-colors">
                    <span className="text-gray-400 text-sm mr-1">$</span>
                    <input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)}
                      className="flex-1 outline-none text-[#0F172A] font-semibold text-sm bg-transparent" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">Interest Rate</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#C9A227] transition-colors">
                    <input type="number" step="0.01" value={rate} onChange={e => setRate(+e.target.value)}
                      className="flex-1 outline-none text-[#0F172A] font-semibold text-sm bg-transparent" />
                    <span className="text-gray-400 text-sm ml-1">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide block mb-1.5">Loan Term</label>
                  <select value={term} onChange={e => setTerm(+e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-[#0F172A] font-semibold text-sm focus:border-[#C9A227] outline-none">
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 rounded-xl p-4" style={{ backgroundColor: "#0F172A" }}>
                <div className="text-center">
                  <p className="text-white/50 text-xs mb-1">Monthly Payment</p>
                  <p className="text-white font-bold text-xl font-display">${monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-white/50 text-xs mb-1">Total Interest</p>
                  <p className="font-bold text-lg" style={{ color: "#C9A227" }}>
                    ${((monthly * term * 12) - principal).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-xs mb-1">Total Cost</p>
                  <p className="text-white font-bold text-lg">${(monthly * term * 12).toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Agent + CTA + Booking Form */}
          <div className="space-y-5">
            {/* Agent Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <img src={agent.image} alt={agent.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-[#0F172A]">{agent.name}</p>
                  <p className="text-xs" style={{ color: "#C9A227" }}>{agent.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Stars n={Math.floor(agent.rating)} />
                    <span className="text-xs text-gray-400">{agent.rating} ({agent.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#0F172A] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F8FAFC" }}>
                    <Phone size={14} style={{ color: "#C9A227" }} />
                  </div>
                  {agent.phone}
                </a>
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#0F172A] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F8FAFC" }}>
                    <Mail size={14} style={{ color: "#C9A227" }} />
                  </div>
                  {agent.email}
                </a>
              </div>
              <button onClick={() => onBook(property)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#C9A227" }}>
                Book an Inspection
              </button>
              <a href="#" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#16A34A" }}>
                <MessageCircle size={16} /> WhatsApp Agent
              </a>
            </div>
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-[#0F172A] mb-4">Request Information</h4>
              <div className="space-y-3">
                {[
                  { key: "name", label: "Full Name", placeholder: "John Smith", type: "text" },
                  { key: "email", label: "Email", placeholder: "john@example.com", type: "email" },
                  { key: "phone", label: "Phone", placeholder: "+1 (702) 555-0000", type: "tel" },
                  { key: "date", label: "Preferred Date", placeholder: "", type: "date" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={(contactForm as any)[key]}
                      onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#C9A227] transition-colors placeholder-gray-300 bg-white" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">Message</label>
                  <textarea rows={3} placeholder="I am interested in this property..."
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#C9A227] transition-colors placeholder-gray-300 resize-none bg-white" />
                </div>
                <button className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#0F172A" }}>
                  Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SAVED PAGE
// ═══════════════════════════════════════════════════════════

function SavedPage({ savedIds, onSave, onCompare, compareIds, onQuickView, onBook, onView }: {
  savedIds: number[]; compareIds: number[];
  onSave: (id: number) => void; onCompare: (id: number) => void;
  onQuickView: (p: Property) => void; onBook: (p: Property) => void; onView: (p: Property) => void;
}) {
  const saved = PROPERTIES.filter(p => savedIds.includes(p.id));
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-20 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2"><GoldLine /><span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C9A227" }}>My Collection</span></div>
            <h1 className="font-display text-4xl font-bold text-[#0F172A]">Saved Properties</h1>
          </div>
          {saved.length > 0 && (
            <button onClick={() => saved.forEach(p => onSave(p.id))} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Clear all ({saved.length})
            </button>
          )}
        </div>
        {saved.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F172A] mb-2">No Saved Properties</h3>
            <p className="text-gray-400 mb-6">Start browsing and save properties you love to review them here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map(p => (
              <PropertyCard key={p.id} property={p} saved={true} compared={compareIds.includes(p.id)}
                onSave={onSave} onCompare={onCompare} onQuickView={onQuickView} onBook={onBook} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPARE PAGE
// ═══════════════════════════════════════════════════════════

function ComparePage({ compareIds, onCompare, onBook, onView }: {
  compareIds: number[]; onCompare: (id: number) => void;
  onBook: (p: Property) => void; onView: (p: Property) => void;
}) {
  const compared = PROPERTIES.filter(p => compareIds.includes(p.id));
  const rows: Array<{ label: string; key: keyof Property | "actions"; render?: (p: Property) => any }> = [
    { label: "Price", key: "priceDisplay", render: p => <span className="font-display font-bold text-[#0F172A]">{p.rentPrice ?? p.priceDisplay}</span> },
    { label: "Type", key: "type" },
    { label: "Location", key: "neighborhood" },
    { label: "Bedrooms", key: "beds", render: p => `${p.beds} Beds` },
    { label: "Bathrooms", key: "baths", render: p => `${p.baths} Baths` },
    { label: "Area", key: "sqft", render: p => `${p.sqft.toLocaleString()} ft²` },
    { label: "Year Built", key: "yearBuilt" },
    { label: "Parking", key: "parking", render: p => `${p.parking} Cars` },
    { label: "Amenities", key: "amenities", render: p => (
      <div className="flex flex-wrap gap-1">
        {p.amenities.slice(0, 4).map(a => <span key={a} className="px-1.5 py-0.5 bg-amber-50 text-[#C9A227] text-xs rounded font-medium">{a}</span>)}
        {p.amenities.length > 4 && <span className="text-xs text-gray-400">+{p.amenities.length - 4} more</span>}
      </div>
    ) },
    { label: "", key: "actions", render: p => (
      <div className="flex flex-col gap-2 pt-2">
        <button onClick={() => onBook(p)} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ backgroundColor: "#C9A227" }}>Book Inspection</button>
        <button onClick={() => onView(p)} className="w-full py-2.5 rounded-xl border-2 border-[#0F172A] text-[#0F172A] text-sm font-semibold hover:bg-[#0F172A] hover:text-white transition-all">View Details</button>
        <button onClick={() => onCompare(p.id)} className="w-full py-2 text-sm text-gray-400 hover:text-red-500 transition-colors">Remove</button>
      </div>
    ) },
  ];
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-20 px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2"><GoldLine /><span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#C9A227" }}>Side by Side</span></div>
          <h1 className="font-display text-4xl font-bold text-[#0F172A]">Property Comparison</h1>
        </div>
        {compared.length < 2 ? (
          <div className="text-center py-20">
            <Scale size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-display text-2xl font-bold text-[#0F172A] mb-2">Select Properties to Compare</h3>
            <p className="text-gray-400">Add at least 2 properties to the comparison list from the property cards.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 w-32 text-xs font-semibold uppercase tracking-wide text-gray-400"></td>
                  {compared.map(p => (
                    <td key={p.id} className="p-4 border-b border-r border-gray-100 last:border-r-0">
                      <div className="relative">
                        <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded-xl mb-3" style={{ backgroundColor: "#e2e8f0" }} />
                        <h4 className="font-semibold text-[#0F172A] text-sm mb-1">{p.title}</h4>
                        <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={11} style={{ color: "#C9A227" }} />{p.neighborhood}</p>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label} className="hover:bg-gray-50/50">
                    <td className="p-4 border-b border-r border-gray-100 text-xs font-semibold text-gray-400 align-top">{row.label}</td>
                    {compared.map(p => (
                      <td key={p.id} className="p-4 border-b border-r border-gray-100 last:border-r-0 text-sm text-[#0F172A]">
                        {row.render ? row.render(p) : String(p[row.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// BOOK INSPECTION MODAL
// ═══════════════════════════════════════════════════════════

const TIMES = ["9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];

function BookInspectionModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    return d;
  });
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-[#0F172A]">Book an Inspection</h3>
              <p className="text-gray-400 text-sm mt-0.5">{property.title}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors mt-0.5">
              <X size={15} />
            </button>
          </div>
          {/* Steps */}
          <div className="flex gap-2 mt-4">
            {["Date & Time", "Your Details", "Confirm"].map((s, i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${i + 1 <= step ? "" : "bg-gray-200"}`}
                style={i + 1 <= step ? { backgroundColor: "#C9A227" } : {}} />
            ))}
          </div>
        </div>
        <div className="p-5">
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold text-[#0F172A] mb-3">Select a Date</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {days.map(d => {
                  const str = d.toISOString().split("T")[0];
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <button key={str} onClick={() => setSelectedDate(str)} disabled={isWeekend}
                      className={`p-3 rounded-xl text-sm text-left transition-all border-2
                        ${selectedDate === str ? "border-[#C9A227] bg-amber-50 text-[#C9A227]" : isWeekend ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-[#0F172A] hover:border-gray-300"}`}>
                      <p className="font-semibold">{d.toLocaleDateString("en-US", { weekday: "short" })}</p>
                      <p className="text-xs opacity-70">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </button>
                  );
                })}
              </div>
              {selectedDate && (
                <>
                  <p className="text-sm font-semibold text-[#0F172A] mb-3">Select a Time</p>
                  <div className="grid grid-cols-4 gap-2">
                    {TIMES.map(t => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-xl text-xs font-medium border-2 transition-all
                          ${selectedTime === t ? "border-[#C9A227] bg-amber-50 text-[#C9A227]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button onClick={() => selectedDate && selectedTime && setStep(2)}
                disabled={!selectedDate || !selectedTime}
                className="w-full mt-5 py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#C9A227" }}>
                Continue
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="bg-amber-50 rounded-xl p-3 mb-5 flex items-center gap-3">
                <Calendar size={18} style={{ color: "#C9A227" }} />
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{selectedDate} at {selectedTime}</p>
                  <p className="text-xs text-gray-500">{property.neighborhood}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: "name", label: "Full Name", placeholder: "John Smith", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
                  { key: "phone", label: "Phone Number", placeholder: "+1 (702) 555-0000", type: "tel" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-400 block mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C9A227] transition-colors placeholder-gray-300 bg-white text-[#0F172A]" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-300 transition-colors">
                  Back
                </button>
                <button onClick={() => form.name && form.email && setStep(3)}
                  disabled={!form.name || !form.email}
                  className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "#C9A227" }}>
                  Review Booking
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(201,162,39,0.1)", border: "2px solid rgba(201,162,39,0.3)" }}>
                <CheckCircle size={28} style={{ color: "#C9A227" }} />
              </div>
              <h4 className="font-display text-xl font-bold text-[#0F172A] mb-2">Booking Confirmed!</h4>
              <p className="text-gray-500 text-sm mb-6">Your inspection has been scheduled. A confirmation has been sent to {form.email}.</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Property</span><span className="font-semibold text-[#0F172A]">{property.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-semibold text-[#0F172A]">{selectedDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Time</span><span className="font-semibold text-[#0F172A]">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-semibold text-[#0F172A]">{form.name}</span></div>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: "#C9A227" }}>
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUICK VIEW MODAL
// ═══════════════════════════════════════════════════════════

function QuickViewModal({ property, saved, onSave, onBook, onView, onClose }: {
  property: Property; saved: boolean;
  onSave: (id: number) => void; onBook: (p: Property) => void;
  onView: (p: Property) => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl">
        <div className="grid sm:grid-cols-2">
          <div className="relative" style={{ height: 320 }}>
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-3 left-3"><Pill text={property.badge} /></div>
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
              <X size={15} />
            </button>
            <div className="absolute bottom-3 left-3">
              <p className="text-white font-display font-bold text-2xl">{property.rentPrice ?? property.priceDisplay}</p>
            </div>
          </div>
          <div className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#C9A227" }}>{property.neighborhood}</p>
              <h3 className="font-display text-xl font-bold text-[#0F172A] mb-1">{property.title}</h3>
              <p className="text-gray-400 text-xs flex items-center gap-1 mb-4"><MapPin size={11} style={{ color: "#C9A227" }} />{property.location}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["Beds", property.beds, Bed], ["Baths", property.baths, Bath], ["sqft", property.sqft.toLocaleString(), Square]].map(([l, v, Icon]: any) => (
                  <div key={l} className="text-center p-2 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                    <Icon size={16} className="mx-auto mb-1" style={{ color: "#C9A227" }} />
                    <p className="font-semibold text-[#0F172A] text-sm">{v}</p>
                    <p className="text-gray-400 text-xs">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{property.description}</p>
            </div>
            <div className="space-y-2 mt-4">
              <button onClick={() => { onBook(property); onClose(); }}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#C9A227" }}>
                Book Inspection
              </button>
              <button onClick={() => { onView(property); onClose(); }}
                className="w-full py-2.5 rounded-xl border-2 border-[#0F172A] text-[#0F172A] text-sm font-semibold hover:bg-[#0F172A] hover:text-white transition-all">
                View Full Details
              </button>
              <button onClick={() => onSave(property.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border-2
                  ${saved ? "border-[#C9A227] text-[#C9A227] bg-amber-50" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                <Heart size={14} className={saved ? "fill-[#C9A227]" : ""} />
                {saved ? "Saved" : "Save Property"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════

const ADMIN_NAV: Array<{ key: AdminTab; icon: any; label: string; badge?: number }> = [
  { key: "dashboard", icon: BarChart2, label: "Dashboard" },
  { key: "properties", icon: Building2, label: "Properties", badge: 248 },
  { key: "agents", icon: Users, label: "Agents" },
  { key: "customers", icon: User, label: "Customers", badge: 12 },
  { key: "appointments", icon: Calendar, label: "Appointments", badge: 5 },
  { key: "blog", icon: FileText, label: "Blog" },
  { key: "analytics", icon: Activity, label: "Analytics" },
  { key: "messages", icon: MessageCircle, label: "Messages", badge: 8 },
  { key: "settings", icon: Settings, label: "Settings" },
];

function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const KPI = [
    { label: "Total Revenue", value: "$9.1M", change: "+24.3%", up: true, icon: DollarSign, color: "#C9A227" },
    { label: "Properties Listed", value: "248", change: "+12", up: true, icon: Building2, color: "#3B82F6" },
    { label: "Active Leads", value: "1,847", change: "+8.2%", up: true, icon: TrendingUp, color: "#16A34A" },
    { label: "Appointments", value: "52", change: "-3", up: false, icon: Calendar, color: "#8B5CF6" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl p-3 shadow-xl border border-white/10 text-xs" style={{ backgroundColor: "#1e2d47" }}>
        <p className="text-white/60 mb-1">{label}</p>
        <p style={{ color: "#C9A227" }}>Revenue: ${payload[0]?.value}M</p>
        {payload[1] && <p className="text-blue-400">Deals: {payload[1]?.value}</p>}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}
        style={{ backgroundColor: "#0A0F1E", borderRight: "1px solid rgba(201,162,39,0.12)" }}>
        <div className="p-4 border-b flex items-center gap-3 h-16" style={{ borderColor: "rgba(201,162,39,0.12)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: "#C9A227" }}>VP</div>
          {sidebarOpen && <div>
            <p className="text-white font-semibold text-sm font-display leading-none">Vegas Properties</p>
            <p className="text-xs mt-0.5" style={{ color: "#C9A227" }}>Admin Dashboard</p>
          </div>}
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map(({ key, icon: Icon, label, badge }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${tab === key ? "text-[#0A0F1E]" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              style={tab === key ? { backgroundColor: "#C9A227" } : {}}>
              <Icon size={17} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                      ${tab === key ? "bg-[#0A0F1E]/20 text-[#0A0F1E]" : "bg-white/10 text-white/50"}`}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1" style={{ borderColor: "rgba(201,162,39,0.12)" }}>
          <button onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <span>Exit Dashboard</span>}
          </button>
        </div>
      </aside>
      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30"
          style={{ backgroundColor: "#0A0F1E", borderColor: "rgba(201,162,39,0.1)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
              <Menu size={17} />
            </button>
            <div>
              <p className="text-white font-semibold text-sm capitalize">{tab}</p>
              <p className="text-white/30 text-xs">Monday, August 5, 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotifications(!notifications)} className="relative w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all">
              <Bell size={17} />
              {notifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A227" }} />}
            </button>
            <div className="flex items-center gap-2">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&auto=format"
                alt="Admin" className="w-8 h-8 rounded-lg object-cover" />
              <div className="hidden sm:block">
                <p className="text-white text-xs font-medium">Victoria S.</p>
                <p className="text-xs" style={{ color: "#C9A227" }}>Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI.map(({ label, value, change, up, icon: Icon, color }) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5 border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                        <Icon size={17} style={{ color }} />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                        {up ? "↑" : "↓"} {change}
                      </span>
                    </div>
                    <p className="text-white font-bold text-2xl font-display mb-0.5">{value}</p>
                    <p className="text-white/40 text-xs">{label}</p>
                  </motion.div>
                ))}
              </div>
              {/* Charts row */}
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Revenue chart */}
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-white font-semibold">Sales Analytics</p>
                      <p className="text-white/40 text-xs">Revenue & deals closed — 2025</p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="flex items-center gap-1 text-white/40"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C9A227" }} />Revenue</span>
                      <span className="flex items-center gap-1 text-white/40"><span className="w-2 h-2 rounded-full bg-blue-400" />Deals</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A227" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="dealGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} fill="url(#revGrad)" />
                      <Area type="monotone" dataKey="deals" stroke="#3B82F6" strokeWidth={1.5} fill="url(#dealGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Lead sources */}
                <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-white font-semibold mb-1">Lead Sources</p>
                  <p className="text-white/40 text-xs mb-5">Traffic origin breakdown</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                        dataKey="value" strokeWidth={0}>
                        {leadSourceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} contentStyle={{ backgroundColor: "#1e2d47", border: "none", borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {leadSourceData.map(d => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-white/50">{d.name}</span>
                        </div>
                        <span className="text-white font-semibold">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Property performance + Bookings */}
              <div className="grid lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 rounded-2xl p-5 border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-white font-semibold mb-1">Property Performance</p>
                  <p className="text-white/40 text-xs mb-5">Views & leads by listing</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={propertyPerfData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e2d47", border: "none", borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="views" fill="#C9A227" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white font-semibold">Recent Bookings</p>
                    <button className="text-xs" style={{ color: "#C9A227" }}>View all</button>
                  </div>
                  <div className="space-y-3">
                    {recentBookings.slice(0, 4).map(b => (
                      <div key={b.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(201,162,39,0.12)" }}>
                          <Calendar size={13} style={{ color: "#C9A227" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{b.client}</p>
                          <p className="text-white/35 text-xs truncate">{b.property}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0
                          ${b.status === "Confirmed" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Full bookings table */}
              <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div>
                    <p className="text-white font-semibold">All Upcoming Appointments</p>
                    <p className="text-white/40 text-xs">Showing next 7 days</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium text-[#0A0F1E]" style={{ backgroundColor: "#C9A227" }}>
                    <Plus size={13} /> New Booking
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["ID","Property","Client","Date","Time","Agent","Status",""].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(b => (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td className="px-4 py-3 text-xs text-white/30 font-mono">{b.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-white">{b.property}</td>
                          <td className="px-4 py-3 text-sm text-white/60">{b.client}</td>
                          <td className="px-4 py-3 text-sm text-white/60">{b.date}</td>
                          <td className="px-4 py-3 text-sm text-white/60">{b.time}</td>
                          <td className="px-4 py-3 text-sm text-white/60">{b.agent}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full
                              ${b.status === "Confirmed" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
                              <MoreHorizontal size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === "properties" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold text-lg">Properties</h2>
                  <p className="text-white/40 text-sm">248 total listings</p>
                </div>
                <button className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-semibold text-[#0A0F1E]" style={{ backgroundColor: "#C9A227" }}>
                  <Plus size={16} /> Add Property
                </button>
              </div>
              <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="p-4 border-b flex gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: "#1a2742" }}>
                    <Search size={15} className="text-white/30" />
                    <input className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/20" placeholder="Search properties..." />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/50 border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <Filter size={14} /> Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Property","Location","Price","Type","Status","Views","Agent"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PROPERTIES.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <span className="text-white text-sm font-medium">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/50">{p.neighborhood}</td>
                          <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#C9A227" }}>{p.rentPrice ?? p.priceDisplay}</td>
                          <td className="px-4 py-3 text-sm text-white/50">{p.type}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                              ${p.status === "For Sale" ? "bg-blue-500/15 text-blue-400" : p.status === "For Rent" ? "bg-purple-500/15 text-purple-400" : "bg-green-500/15 text-green-400"}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/50">{p.views.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-white/50">
                            {AGENTS.find(a => a.id === p.agentId)?.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {tab === "agents" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold text-lg">Agents</h2>
                  <p className="text-white/40 text-sm">4 active agents</p>
                </div>
                <button className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-semibold text-[#0A0F1E]" style={{ backgroundColor: "#C9A227" }}>
                  <Plus size={16} /> Invite Agent
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {AGENTS.map(agent => (
                  <div key={agent.id} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="relative" style={{ height: 140 }}>
                      <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                      <p className="text-white font-semibold text-sm">{agent.name}</p>
                      <p className="text-xs mb-3" style={{ color: "#C9A227" }}>{agent.title}</p>
                      <div className="grid grid-cols-3 gap-1 text-center mb-3">
                        {[["Listed", agent.listings], ["Sold", agent.sold], ["Reviews", agent.reviews]].map(([l, v]) => (
                          <div key={l as string} className="rounded-lg py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                            <p className="text-white font-bold text-sm">{v}</p>
                            <p className="text-white/30 text-[10px]">{l}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stars n={Math.floor(agent.rating)} />
                        <span className="text-white/40 text-xs ml-1">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(tab === "customers" || tab === "appointments" || tab === "blog" || tab === "analytics" || tab === "messages" || tab === "settings") && (
            <div className="flex items-center justify-center h-80">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(201,162,39,0.12)" }}>
                  {(() => {
                    const item = ADMIN_NAV.find(n => n.key === tab);
                    const Icon = item?.icon ?? Settings;
                    return <Icon size={28} style={{ color: "#C9A227" }} />;
                  })()}
                </div>
                <p className="text-white font-semibold text-lg capitalize mb-1">{tab}</p>
                <p className="text-white/30 text-sm">This section is fully implemented in production.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [quickViewProperty, setQuickViewProperty] = useState<Property | null>(null);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleSave = useCallback((id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handleToggleCompare = useCallback((id: number) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const handleViewProperty = useCallback((p: Property) => {
    setSelectedProperty(p);
    navigate("detail");
  }, [navigate]);

  const handleBook = useCallback((p: Property) => {
    setBookingProperty(p);
  }, []);

  const handleQuickView = useCallback((p: Property) => {
    setQuickViewProperty(p);
  }, []);

  if (page === "admin") {
    return <AdminDashboard onExit={() => navigate("home")} />;
  }

  return (
    <div className="relative">
      <Navbar currentPage={page} setPage={navigate} savedCount={savedIds.length} compareCount={compareIds.length} />
      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <HomePage
              savedIds={savedIds} compareIds={compareIds}
              onSave={handleToggleSave} onCompare={handleToggleCompare}
              onQuickView={handleQuickView} onBook={handleBook}
              onView={handleViewProperty} setPage={navigate}
            />
          </motion.div>
        )}
        {page === "detail" && selectedProperty && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <PropertyDetailPage
              property={selectedProperty} savedIds={savedIds}
              onSave={handleToggleSave} onBook={handleBook}
              onBack={() => navigate("home")}
            />
          </motion.div>
        )}
        {page === "saved" && (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <SavedPage
              savedIds={savedIds} compareIds={compareIds}
              onSave={handleToggleSave} onCompare={handleToggleCompare}
              onQuickView={handleQuickView} onBook={handleBook}
              onView={handleViewProperty}
            />
          </motion.div>
        )}
        {page === "compare" && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ComparePage
              compareIds={compareIds} onCompare={handleToggleCompare}
              onBook={handleBook} onView={handleViewProperty}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modals */}
      <AnimatePresence>
        {bookingProperty && (
          <BookInspectionModal key="booking" property={bookingProperty} onClose={() => setBookingProperty(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {quickViewProperty && (
          <QuickViewModal key="quickview" property={quickViewProperty}
            saved={savedIds.includes(quickViewProperty.id)}
            onSave={handleToggleSave} onBook={handleBook}
            onView={handleViewProperty} onClose={() => setQuickViewProperty(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
