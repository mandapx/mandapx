"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin, Star, ChevronLeft, Users, Car, Zap, Hotel, Sparkles,
  Check, ShieldCheck, Info, Calendar, Share2, Heart
} from "lucide-react";
import { fetchApi } from "../../../utils/api";

export default function VenueDetailPage({ params }) {
  const { slug } = params;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [checkDate, setCheckDate] = useState("");
  const [checkGuests, setCheckGuests] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    fetchApi(`/venues/${slug}`)
      .then((data) => {
        if (!mounted) return;
        setVenue(data);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError(err.message || "Failed to load venue");
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [slug]);

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (!checkDate || !venue) return;
    const month = checkDate.slice(0, 7);
    fetchApi(`/venues/${venue.id}/availability?month=${month}`)
      .then((data) => {
        const day = checkDate.slice(8, 10);
        const slot = data.find((a) => a.date === checkDate);
        if (slot && slot.status === "blocked") {
          setAvailabilityResult("blocked");
        } else {
          setAvailabilityResult("available");
        }
      })
      .catch(() => setAvailabilityResult("available"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-400">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <Info className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">Venue Not Found</h2>
          <p className="text-sm text-slate-500">{error}</p>
          <a href="/" className="inline-block px-6 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <Info className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">Venue Not Found</h2>
          <p className="text-sm text-slate-500">The venue you are looking for does not exist or has been removed.</p>
          <a href="/" className="inline-block px-6 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const photos = venue.photos || [];
  const amenities = venue.amenities || [];
  const eventTypes = venue.eventTypes || [];
  const reviews = venue.reviews || [];
  const mainPhoto = photos.find((p) => p.is_primary) || photos[0];
  const priceDisplay = venue.price_min
    ? `₹${Number(venue.price_min).toLocaleString("en-IN")}`
    : venue.price_per_plate
    ? `₹${Number(venue.price_per_plate).toLocaleString("en-IN")}`
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Listings
        </a>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden shadow-sm mb-8 h-80">
          <div className="md:col-span-2 relative bg-slate-100 overflow-hidden h-full">
            {mainPhoto ? (
              <img src={mainPhoto.url || mainPhoto.image} alt={venue.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-bold">No Image</div>
            )}
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-2.5 h-full">
            {photos.slice(1, 5).map((p, i) => (
              <div key={i} className="overflow-hidden bg-slate-100 h-full relative">
                <img src={p.url || p.image} alt="" className="w-full h-full object-cover" />
                {i === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-sm">
                    +{photos.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">{venue.name}</h1>
              {venue.featured && (
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-500 font-semibold">
              {venue.type?.name || venue.category} &middot; {venue.city?.name || "Location"}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {venue.address}
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            {venue.avg_rating > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-md">
                  {Number(venue.avg_rating).toFixed(1)} <Star className="w-4 h-4 fill-white" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{venue.reviews_count} Reviews</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-slate-200 mb-8">
          <div className="flex items-center gap-8 text-sm font-extrabold text-slate-500 overflow-x-auto">
            {["Overview", "Photos", "Reviews", "Contact"].map((t) => (
              <button key={t} onClick={() => setSelectedTab(t)}
                className={`pb-3 border-b-2 font-outfit text-sm transition-all whitespace-nowrap ${
                  selectedTab === t ? "border-rose-600 text-rose-600" : "border-transparent hover:text-slate-950"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {selectedTab === "Overview" && (
              <div className="space-y-8 text-left">
                {venue.description && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-black font-outfit text-slate-900">About this place</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{venue.description}</p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-lg font-black font-outfit text-slate-900">Capacity & Pricing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <Users className="w-5 h-5 text-rose-500" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Capacity</p>
                      <p className="text-sm font-bold">{venue.capacity_min}–{venue.capacity_max} Guests</p>
                    </div>
                    {priceDisplay && (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <span className="text-lg font-black text-rose-600">₹</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Starting From</p>
                        <p className="text-sm font-bold">{priceDisplay}</p>
                      </div>
                    )}
                    {venue.price_per_plate && (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <span className="text-lg font-black text-emerald-600">₹</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Per Plate (Veg)</p>
                        <p className="text-sm font-bold">₹{Number(venue.price_per_plate).toLocaleString("en-IN")}</p>
                      </div>
                    )}
                    {venue.flat_rent_price && (
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <span className="text-lg font-black text-indigo-600">₹</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Flat Rent</p>
                        <p className="text-sm font-bold">₹{Number(venue.flat_rent_price).toLocaleString("en-IN")}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-lg font-black font-outfit text-slate-900">Amenities & Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl border space-y-1.5 ${venue.parking_available ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}>
                      <Car className={`w-5 h-5 ${venue.parking_available ? "text-emerald-600" : "text-slate-400"}`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Parking</p>
                      <p className="text-xs font-bold">{venue.parking_available ? `Available (${venue.parking_count || "Yes"})` : "Not Available"}</p>
                    </div>
                    <div className={`p-4 rounded-xl border space-y-1.5 ${venue.power_backup ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-200"}`}>
                      <Zap className={`w-5 h-5 ${venue.power_backup ? "text-amber-600" : "text-slate-400"}`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Power Backup</p>
                      <p className="text-xs font-bold">{venue.power_backup ? "Available" : "Not Available"}</p>
                    </div>
                    <div className={`p-4 rounded-xl border space-y-1.5 ${venue.rooms_count > 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-200"}`}>
                      <Hotel className={`w-5 h-5 ${venue.rooms_count > 0 ? "text-rose-600" : "text-slate-400"}`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Guest Rooms</p>
                      <p className="text-xs font-bold">{venue.rooms_count > 0 ? `${venue.rooms_count} Rooms` : "None"}</p>
                    </div>
                    <div className={`p-4 rounded-xl border space-y-1.5 ${venue.dj_allowed ? "bg-purple-50 border-purple-100" : "bg-slate-50 border-slate-200"}`}>
                      <Sparkles className={`w-5 h-5 ${venue.dj_allowed ? "text-purple-600" : "text-slate-400"}`} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">DJ Allowed</p>
                      <p className="text-xs font-bold">{venue.dj_allowed ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span key={a.id} className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full font-semibold text-slate-700">
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>

                {eventTypes.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-black font-outfit text-slate-900">Suitable Event Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {eventTypes.map((et) => (
                        <span key={et.id} className="text-xs px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full font-bold text-rose-700">
                          {et.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(venue.catering_type || venue.decoration_type) && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-black font-outfit text-slate-900">Vendor Policies</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {venue.catering_type && (
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                          <p className="font-bold text-sm">Catering: <span className="text-rose-600 uppercase">{venue.catering_type}</span></p>
                          {venue.catering_details && <p className="text-xs text-slate-500">{venue.catering_details}</p>}
                        </div>
                      )}
                      {venue.decoration_type && (
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                          <p className="font-bold text-sm">Decoration: <span className="text-rose-600 uppercase">{venue.decoration_type}</span></p>
                          {venue.decoration_details && <p className="text-xs text-slate-500">{venue.decoration_details}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "Photos" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.length > 0 ? photos.map((p, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-slate-100 aspect-video border border-slate-200">
                    <img src={p.url || p.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 col-span-full">No photos available</p>
                )}
              </div>
            )}

            {selectedTab === "Reviews" && (
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-black font-outfit text-slate-900">Reviews</h3>
                {reviews.length > 0 ? reviews.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-black text-rose-600">
                          {(r.user?.name || "A")[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.user?.name || "Anonymous"}</p>
                          <p className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-black">
                        {r.rating} <Star className="w-3 h-3 fill-white" />
                      </div>
                    </div>
                    {r.title && <p className="font-bold text-xs text-slate-700">{r.title}</p>}
                    <p className="text-sm text-slate-600 leading-relaxed">{r.body}</p>
                    {r.owner_reply && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Owner Reply</p>
                        <p className="text-xs text-slate-600">{r.owner_reply}</p>
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-slate-400">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}

            {selectedTab === "Contact" && (
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-black font-outfit text-slate-900">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-5 rounded-2xl border border-slate-200">
                    <p className="font-bold text-sm border-b pb-2">Venue Details</p>
                    <p className="text-xs"><span className="font-bold">Address:</span> {venue.address}</p>
                    {venue.area && <p className="text-xs"><span className="font-bold">Area:</span> {venue.area}</p>}
                    <p className="text-xs"><span className="font-bold">City:</span> {venue.city?.name}, {venue.city?.state}</p>
                    <p className="text-xs text-slate-400">Status: <span className="font-bold text-emerald-600 uppercase">{venue.status}</span></p>
                  </div>
                  <div className="space-y-3 p-5 rounded-2xl border border-slate-200">
                    <p className="font-bold text-sm border-b pb-2">Owner Details</p>
                    {venue.owner?.user?.name && <p className="text-xs"><span className="font-bold">Name:</span> {venue.owner.user.name}</p>}
                    {venue.owner?.business_name && <p className="text-xs"><span className="font-bold">Business:</span> {venue.owner.business_name}</p>}
                    {venue.owner?.user?.email && <p className="text-xs"><span className="font-bold">Email:</span> {venue.owner.user.email}</p>}
                    {venue.owner?.user?.phone && <p className="text-xs"><span className="font-bold">Phone:</span> {venue.owner.user.phone}</p>}
                  </div>
                </div>
                {venue.latitude && venue.longitude && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl"
                  >
                    <MapPin className="w-4 h-4" /> View on Google Maps
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting Price</span>
                <p className="text-2xl font-black text-slate-900">
                  {priceDisplay || "Contact for Price"}
                </p>
                {venue.price_per_plate && (
                  <p className="text-xs text-slate-500">₹{Number(venue.price_per_plate).toLocaleString("en-IN")} / veg plate</p>
                )}
              </div>

              <form onSubmit={handleCheckAvailability} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check Date</label>
                  <input type="date" required value={checkDate}
                    onChange={(e) => { setCheckDate(e.target.value); setAvailabilityResult(null); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-600 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guests</label>
                  <input type="number" required placeholder="e.g. 200" value={checkGuests}
                    onChange={(e) => setCheckGuests(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-600 focus:bg-white transition-all"
                  />
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all"
                >
                  Check Availability
                </button>
              </form>

              {availabilityResult && (
                <div className={`p-4 rounded-xl border text-xs font-bold ${
                  availabilityResult === "available"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                    : "bg-rose-50 border-rose-100 text-rose-800"
                }`}>
                  {availabilityResult === "available"
                    ? "Available on this date!"
                    : "Not available on this date"}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">100% Escrow Safe Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="font-semibold">24h Owner Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
