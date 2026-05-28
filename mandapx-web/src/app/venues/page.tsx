"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getVenues } from "@/lib/api";
import { Venue } from "@/lib/api";

const VENUE_TYPES = ["Banquet Hall", "Hotel", "Resort", "Lawn", "Farmhouse", "Party Hall", "Restaurant", "Club"];

function useParams() {
  if (typeof window === "undefined") return { search: "", city: "", sort: "rating", page: 1, type: "" };
  const p = new URLSearchParams(window.location.search);
  return {
    search: p.get("search") || "",
    city: p.get("city") || "",
    sort: p.get("sort") || "rating",
    page: parseInt(p.get("page") || "1", 10),
    type: p.get("type") || "",
  };
}

export default function VenuesPage() {
  const params = useParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const updateQuery = (updates: Record<string, string>) => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    window.location.href = `/venues?${p.toString()}`;
  };

  useEffect(() => {
    setLoading(true);
    const p: Record<string, string | number | undefined> = { page: params.page, limit: 24, sort: params.sort };
    if (params.search) p.search = params.search;
    if (params.city) p.city = params.city;
    if (params.type) p.venue_type = params.type;

    getVenues(p)
      .then((r) => { setVenues(r.data); setMeta(r.meta); })
      .catch(() => { setVenues([]); setMeta({ total: 0, page: 1, totalPages: 0 }); })
      .finally(() => setLoading(false));
  }, [params.search, params.city, params.sort, params.page, params.type]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {params.city ? `Wedding Venues in ${params.city.charAt(0).toUpperCase() + params.city.slice(1)}` : "All Wedding Venues"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{meta.total.toLocaleString()} venues found</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); updateQuery({ search: fd.get("search") as string, page: "1" }); }} className="flex gap-2 flex-1 max-w-md">
              <input type="text" name="search" defaultValue={params.search} placeholder="Search venues..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rani-pink" />
              <button type="submit" className="px-4 py-2 bg-rani-pink text-white text-sm font-bold rounded-lg hover:bg-saffron transition-colors">Search</button>
            </form>

            <select value={params.sort} onChange={(e) => updateQuery({ sort: e.target.value, page: "1" })}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm">
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="capacity">Capacity</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => updateQuery({ type: "", page: "1" })}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${!params.type ? "bg-rani-pink text-white border-rani-pink" : "bg-white text-gray-600 border-gray-300 hover:border-rani-pink"}`}>
              All
            </button>
            {VENUE_TYPES.map((t) => (
              <button key={t} onClick={() => updateQuery({ type: t, page: "1" })}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${params.type === t ? "bg-rani-pink text-white border-rani-pink" : "bg-white text-gray-600 border-gray-300 hover:border-rani-pink"}`}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No venues found matching your criteria.</p>
              <button onClick={() => window.location.href = "/venues"} className="text-rani-pink hover:text-saffron font-semibold mt-2 inline-block">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {venues.map((venue) => (
                  <a key={venue.id || venue.slug} href={`/venues/${venue.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {venue.images?.[0] ? (
                        <img src={venue.images[0]} alt={venue.venue_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                      )}
                      {venue.rating > 0 && (
                        <span className="absolute top-2 right-2 bg-mehendi-green text-white text-xs px-2 py-1 rounded font-medium">★ {venue.rating}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-rani-pink transition-colors truncate">{venue.venue_name}</h3>
                      <p className="text-sm text-gray-500 capitalize mt-1">{venue.city}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">Up to {venue.capacity_max || "N/A"} guests</span>
                        {venue.cost_per_plate_veg && <span className="text-sm font-bold text-gray-900">₹{venue.cost_per_plate_veg}</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {params.page > 1 && (
                    <button onClick={() => updateQuery({ page: String(params.page - 1) })} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-cream">Previous</button>
                  )}
                  <span className="text-sm text-gray-600">Page {params.page} of {meta.totalPages}</span>
                  {params.page < meta.totalPages && (
                    <button onClick={() => updateQuery({ page: String(params.page + 1) })} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-cream">Next</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="bg-peacock-blue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} MandapX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
