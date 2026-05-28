"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Phone } from "lucide-react";

const CITIES = [
  { name: "Mumbai", slug: "mumbai" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Delhi NCR", slug: "delhi-ncr" },
  { name: "Chennai", slug: "chennai" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Pune", slug: "pune" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Kochi", slug: "kochi" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Jaipur", slug: "jaipur" },
  { name: "Lucknow", slug: "lucknow" },
];

const VENUE_TYPES = [
  { name: "Banquet Halls", slug: "Banquet Hall" },
  { name: "Resorts", slug: "Resort" },
  { name: "Lawns", slug: "Lawn" },
  { name: "Convention Halls", slug: "Convention Hall" },
  { name: "Kalyana Mandapams", slug: "Kalyana Mandapam" },
  { name: "Farm Houses", slug: "Farmhouse" },
  { name: "Premium Venues", slug: "Premium" },
  { name: "Destination Weddings", slug: "Destination" },
  { name: "5 Star Hotels", slug: "5 Star" },
  { name: "Mini Halls", slug: "Mini Hall" },
  { name: "Seaside Venues", slug: "Seaside" },
  { name: "Fort and Palaces", slug: "Fort" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const citiesRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (citiesRef.current && !citiesRef.current.contains(e.target as Node)) setCitiesOpen(false);
      if (typesRef.current && !typesRef.current.contains(e.target as Node)) setTypesOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="bg-rani-pink text-white w-9 h-9 flex items-center justify-center rounded-xl text-base font-black tracking-tight shadow-sm">
              M
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Mandap</span>
              <span className="text-rani-pink">X</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            <div ref={citiesRef} className="relative">
              <button
                onClick={() => { setCitiesOpen(!citiesOpen); setTypesOpen(false); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-rani-pink hover:bg-white/60 rounded-lg transition-colors"
              >
                <span>Venues</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${citiesOpen ? "rotate-180" : ""}`} />
              </button>
              {citiesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">By City</div>
                  {CITIES.map((city) => (
                    <a
                      key={city.slug}
                      href={`/venues?city=${city.slug}`}
                      onClick={() => setCitiesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-rani-pink hover:bg-cream transition-colors"
                    >
                      {city.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div ref={typesRef} className="relative">
              <button
                onClick={() => { setTypesOpen(!typesOpen); setCitiesOpen(false); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-rani-pink hover:bg-white/60 rounded-lg transition-colors"
              >
                <span>Venue Type</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${typesOpen ? "rotate-180" : ""}`} />
              </button>
              {typesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
                  {VENUE_TYPES.map((vt) => (
                    <a
                      key={vt.slug}
                      href={`/venues?type=${encodeURIComponent(vt.slug)}`}
                      onClick={() => setTypesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-rani-pink hover:bg-cream transition-colors"
                    >
                      {vt.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/list-your-venue"
              className="px-5 py-2.5 text-sm font-bold text-white bg-saffron hover:bg-saffron/90 rounded-lg transition-colors shadow-sm"
            >
              List Your Venue
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919825075783"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-rani-pink transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 98250 75783</span>
            </a>
            <a
              href="/login"
              className="px-5 py-2.5 text-sm font-bold text-white bg-rani-pink hover:bg-rani-pink/90 rounded-lg transition-colors shadow-sm"
            >
              Sign In
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-rani-pink"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1">Venues by City</div>
            {CITIES.map((city) => (
              <a
                key={city.slug}
                href={`/venues?city=${city.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:text-rani-pink hover:bg-cream rounded-lg"
              >
                {city.name}
              </a>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-1">Venue Type</div>
              {VENUE_TYPES.map((vt) => (
                <a
                  key={vt.slug}
                  href={`/venues?type=${encodeURIComponent(vt.slug)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-rani-pink hover:bg-cream rounded-lg"
                >
                  {vt.name}
                </a>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-3">
              <a
                href="/list-your-venue"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-3 py-3 text-sm font-bold text-white bg-saffron rounded-lg"
              >
                List Your Venue
              </a>
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-3 py-3 text-sm font-bold text-white bg-rani-pink rounded-lg"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
