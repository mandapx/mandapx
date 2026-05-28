"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";

export default function FeaturedVenuesClient() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);
    fetch(`${API_BASE}/venues/featured?limit=8`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setVenues(Array.isArray(data) ? data : []))
      .catch(() => setVenues([]))
      .finally(() => { clearTimeout(id); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (venues.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {venues.slice(0, 8).map((venue: any) => (
        <a
          key={venue.id}
          href={`/venues/${venue.slug}`}
          className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
            {venue.images?.[0] ? (
              <img
                src={venue.images[0]}
                alt={venue.venue_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
            {venue.rating > 0 && (
              <span className="absolute top-2 right-2 bg-mehendi-green text-white text-xs px-2 py-1 rounded font-medium">
                ★ {venue.rating}
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-rani-pink transition-colors truncate">
              {venue.venue_name}
            </h3>
            <p className="text-sm text-gray-500 capitalize mt-1">{venue.city}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">{venue.venue_type?.[0] || "Venue"}</span>
              {venue.cost_per_plate_veg && (
                <span className="text-sm font-bold text-gray-900">₹{venue.cost_per_plate_veg}/plate</span>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
