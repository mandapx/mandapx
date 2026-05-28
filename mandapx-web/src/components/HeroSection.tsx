"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, MapPin, Building2 } from "lucide-react";

const CITIES = [
  "Mumbai", "Bangalore", "Delhi NCR", "Chennai", "Hyderabad",
  "Pune", "Ahmedabad", "Kolkata", "Kochi", "Chandigarh",
  "Jaipur", "Lucknow", "Indore", "Goa", "Coimbatore",
];

const LOCALITIES: Record<string, string[]> = {
  Mumbai: ["Andheri", "Bandra", "Powai", "Worli", "Juhu", "Malad", "Thane", "Navi Mumbai"],
  Bangalore: ["Whitefield", "MG Road", "Koramangala", "Indiranagar", "Electronic City", "Hebbal"],
  "Delhi NCR": ["South Delhi", "Gurgaon", "Noida", "Dwarka", "Rohini", "Karol Bagh", "Pitampura"],
  Chennai: ["T Nagar", "Velachery", "OMR", "Anna Nagar", "Adyar", "Porur"],
  Hyderabad: ["Hitech City", "Banjara Hills", "Madhapur", "Kukatpally", "Gachibowli", "Secunderabad"],
  Pune: ["Koregaon Park", "Kharadi", "Hinjewadi", "Baner", "Viman Nagar", "Wakad"],
  Ahmedabad: ["Satellite", "SG Highway", "Prahlad Nagar", "Bodakdev", "Navrangpura"],
  Kolkata: ["Salt Lake", "New Town", "Alipore", "Ballygunge", "Dum Dum", "Behala"],
  Kochi: ["Marine Drive", "Kakkanad", "Edapally", "Fort Kochi", "Tripunithura"],
  Chandigarh: ["Sector 17", "Sector 35", "Sector 26", "Mohali", "Panchkula", "Zirakpur"],
};

const VENUE_TYPES = [
  "Banquet Hall", "Resort", "Lawn", "Convention Hall", "Kalyana Mandapam",
  "Farm House", "5 Star Hotel", "Mini Hall", "Seaside Venue", "Fort and Palace",
];

export default function HeroSection() {
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [venueType, setVenueType] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const currentLocalities = city ? LOCALITIES[city] || [] : [];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setLocality("");
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city.toLowerCase().replace(/\s+/g, "-"));
    if (venueType) params.set("type", venueType);
    window.location.href = `/venues?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <img
          src="/mandapxbanner.png"
          alt="Wedding venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            India&apos;s Largest Wedding Venue
            <br />
            <span className="text-saffron">Booking Platform</span>
            <span className="text-white/90"> with 50,000+ venues</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl">
            Find the perfect wedding venue, banquet hall, or party lawn across 700+ Indian cities.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-10 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 max-w-4xl"
        >
          <div ref={cityRef} className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => { setCityOpen(!cityOpen); setTypeOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-cream hover:bg-cream border border-gray-200 text-left transition-colors"
            >
              <MapPin className="w-5 h-5 text-rani-pink shrink-0" />
              <span className={`flex-1 text-sm font-medium truncate ${city ? "text-gray-900" : "text-gray-500"}`}>
                {city || "Wedding City"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Popular Cities
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCity(c); setCityOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      city === c ? "text-rani-pink bg-cream font-medium" : "text-gray-700 hover:text-rani-pink hover:bg-cream"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-cream hover:bg-cream border border-gray-200 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!city}
            >
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <span className={`flex-1 text-sm font-medium truncate ${locality ? "text-gray-900" : "text-gray-500"}`}>
                {locality || "Locality / Area"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div ref={typeRef} className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => { setTypeOpen(!typeOpen); setCityOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-cream hover:bg-cream border border-gray-200 text-left transition-colors"
            >
              <Building2 className="w-5 h-5 text-gray-400 shrink-0" />
              <span className={`flex-1 text-sm font-medium truncate ${venueType ? "text-gray-900" : "text-gray-500"}`}>
                {venueType || "Venue Type"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
            </button>
            {typeOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
                {VENUE_TYPES.map((vt) => (
                  <button
                    key={vt}
                    type="button"
                    onClick={() => { setVenueType(vt); setTypeOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      venueType === vt ? "text-rani-pink bg-cream font-medium" : "text-gray-700 hover:text-rani-pink hover:bg-cream"
                    }`}
                  >
                    {vt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-rani-pink hover:bg-saffron text-white font-bold rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Find Venues</span>
          </button>
        </form>
      </div>
    </section>
  );
}
