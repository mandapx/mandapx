"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Users, 
  Star, 
  Building,
  Heart,
  ChevronRight,
  Filter,
  CheckCircle,
  X,
  Calendar,
  DollarSign
} from "lucide-react";
import { fetchVenues, fetchLookupFilters } from "../../utils/api";

export default function VenuesDiscovery() {
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  
  // Lookup data from API
  const [lookups, setLookups] = useState({
    categories: [],
    cities: [],
    event_types: [],
    amenities: []
  });

  // Filter States
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedVenueType, setSelectedVenueType] = useState("");
  const [paxCount, setPaxCount] = useState("");
  const [maxPrice, setMaxPrice] = useState("3000");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState({});

  // Active loaded filter text labels for visual pills
  const [activeFilters, setActiveFilters] = useState([]);

  // Load lookup options on mount
  useEffect(() => {
    async function loadLookups() {
      try {
        const data = await fetchLookupFilters();
        setLookups(data);
        
        // Default select first options to populate initial results
        if (data.cities && data.cities.length > 0) {
          setSelectedCity(data.cities[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to load search lookups", err);
      }
    }
    loadLookups();
  }, []);

  // Query venues live based on active filter state
  useEffect(() => {
    async function loadVenues() {
      setLoading(true);
      try {
        const filters = {
          city_id: selectedCity,
          type_id: selectedVenueType,
          event_type_id: selectedEventType,
          pax: paxCount,
          max_price: maxPrice,
          q: searchQuery
        };
        const data = await fetchVenues(filters);
        // Handle paginated responses or direct lists
        setVenues(data.data || data || []);
      } catch (err) {
        console.error("Failed to query venues", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedCity) {
      loadVenues();
    }
  }, [selectedCity, selectedVenueType, selectedEventType, paxCount, maxPrice, searchQuery]);

  // Update active visual filter badges
  useEffect(() => {
    const pills = [];
    if (selectedCity && lookups.cities.length > 0) {
      const city = lookups.cities.find(c => c.id.toString() === selectedCity);
      if (city) pills.push({ key: "city", val: selectedCity, label: `City: ${city.name}` });
    }
    if (selectedEventType && lookups.event_types.length > 0) {
      const et = lookups.event_types.find(e => e.id.toString() === selectedEventType);
      if (et) pills.push({ key: "event", val: selectedEventType, label: et.name });
    }
    if (selectedVenueType && lookups.venue_types.length > 0) {
      const vt = lookups.venue_types.find(v => v.id.toString() === selectedVenueType);
      if (vt) pills.push({ key: "type", val: selectedVenueType, label: vt.name });
    }
    if (paxCount) {
      pills.push({ key: "pax", val: paxCount, label: `Pax: ${paxCount}+` });
    }
    if (maxPrice && maxPrice !== "3000") {
      pills.push({ key: "price", val: maxPrice, label: `Max Price: ₹${maxPrice}` });
    }
    setActiveFilters(pills);
  }, [selectedCity, selectedVenueType, selectedEventType, paxCount, maxPrice, lookups]);

  const clearFilter = (key) => {
    if (key === "city") setSelectedCity(lookups.cities[0]?.id.toString() || "");
    if (key === "event") setSelectedEventType("");
    if (key === "type") setSelectedVenueType("");
    if (key === "pax") setPaxCount("");
    if (key === "price") setMaxPrice("3000");
  };

  const resetAllFilters = () => {
    setSelectedCity(lookups.cities[0]?.id.toString() || "");
    setSelectedEventType("");
    setSelectedVenueType("");
    setPaxCount("");
    setMaxPrice("3000");
    setSearchQuery("");
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </a>
            <a href="/" className="text-2xl font-bold font-outfit bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              ClickMyVenue
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-slate-300 hover:text-rose-400 transition-colors">
              Home
            </a>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-sm">
              Dashboard Login
            </button>
          </div>
        </div>
      </header>

      {/* DISCOVERY WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: FILTERS SIDEBAR */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-28 p-6 rounded-3xl glass border border-white/10 space-y-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-rose-500" /> Plan Your Event
              </h2>
              <button 
                onClick={resetAllFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* QUERY FILTER: LOCATION */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Preferred Location / City
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-slate-200 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-950 text-slate-500">Choose city...</option>
                  {lookups.cities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-slate-950 text-slate-200">
                      {city.name}, {city.state || "India"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUERY FILTER: EVENT TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Type of Event / Occasion
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                <select 
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full bg-transparent text-slate-200 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-slate-200">All Occasions</option>
                  {lookups.event_types.map((et) => (
                    <option key={et.id} value={et.id} className="bg-slate-950 text-slate-200">
                      {et.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUERY FILTER: VENUE TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Venue Type
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <Building className="w-5 h-5 text-rose-400 shrink-0" />
                <select 
                  value={selectedVenueType}
                  onChange={(e) => setSelectedVenueType(e.target.value)}
                  className="w-full bg-transparent text-slate-200 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-slate-200">All Structure Types</option>
                  {lookups.venue_types.map((vt) => (
                    <option key={vt.id} value={vt.id} className="bg-slate-950 text-slate-200">
                      {vt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUERY FILTER: ATTENDEES COUNT (PAX) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Attendees / Pax Count
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <input 
                  type="number"
                  placeholder="Min capacity required..."
                  value={paxCount}
                  onChange={(e) => setPaxCount(e.target.value)}
                  className="w-full bg-transparent text-slate-200 outline-none text-sm font-medium placeholder-slate-500"
                />
              </div>
            </div>

            {/* QUERY FILTER: MAX VEG PLATE PRICE */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                <span>Max Veg Plate Cost</span>
                <span className="text-amber-400">₹{maxPrice}</span>
              </div>
              <input 
                type="range"
                min="500"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>₹500</span>
                <span>₹3,000+</span>
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: SEARCH DISPLAY & RESULTS GRID */}
        <section className="flex-1 space-y-8">
          
          {/* SEARCH BAR INPUT */}
          <div className="p-3 rounded-2xl glass border border-white/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input 
              type="text"
              placeholder="Search by venue name, area, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-sm font-medium py-1"
            />
          </div>

          {/* ACTIVE FILTER PILLS */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1">
                Active Criteria:
              </span>
              {activeFilters.map((pill) => (
                <span 
                  key={pill.key}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-white/5 text-xs text-rose-300 font-semibold"
                >
                  {pill.label}
                  <button 
                    onClick={() => clearFilter(pill.key)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* VENUES GRID & LOADING STATES */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((loader) => (
                <div key={loader} className="h-96 rounded-3xl glass border border-white/5 animate-pulse flex flex-col justify-between p-6">
                  <div className="h-44 w-full bg-slate-900 rounded-2xl"></div>
                  <div className="h-6 w-3/4 bg-slate-900 rounded mt-4"></div>
                  <div className="h-4 w-1/2 bg-slate-900 rounded mt-2"></div>
                  <div className="h-10 w-full bg-slate-900 rounded-xl mt-6"></div>
                </div>
              ))}
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border border-white/5 space-y-4">
              <Building className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white font-outfit">No Matching Venues Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No venues match your capacity/price criteria in this location. Try loosening your pax limits or checking nearby cities.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {venues.map((venue) => (
                <div 
                  key={venue.id} 
                  className="rounded-3xl overflow-hidden glass border border-white/5 flex flex-col group"
                >
                  
                  {/* Photo area */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950 shrink-0">
                    <img 
                      src={
                        venue.primary_photo?.url || 
                        venue.photos?.[0]?.url ||
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                      } 
                      alt={venue.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {venue.type?.name || "Premium Space"}
                      </span>
                      {venue.featured && (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                          Elite
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(venue.id)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur flex items-center justify-center text-slate-200 hover:text-rose-400 border border-white/10"
                    >
                      <Heart className={`w-5 h-5 ${wishlist[venue.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {venue.area || "Bodakdev"}, {venue.city?.name}
                        </p>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {venue.avg_rating || "4.8"}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold font-outfit text-white leading-snug group-hover:text-rose-300 transition-colors">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {venue.description}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Veg Plate Starts</div>
                        <div className="text-base font-extrabold text-white">₹{parseInt(venue.price_min).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ Plate</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold text-right">Capacity</div>
                        <div className="text-xs font-bold text-slate-200 text-right mt-1">{venue.capacity_min} - {venue.capacity_max} Pax</div>
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-rose-500 hover:to-amber-500 hover:text-white border border-white/10 hover:border-transparent text-slate-200 font-bold text-xs transition-all duration-300">
                      Check Availability & Book
                    </button>

                  </div>

                </div>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950 py-8 text-slate-400 text-xs mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ClickMyVenue.com (Hosted on venuehub.site). All rights reserved.</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 rounded bg-slate-900 border border-white/5">India Event Marketplace</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
