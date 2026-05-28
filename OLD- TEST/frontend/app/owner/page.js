"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Building,
  Users,
  HelpCircle,
  ShieldCheck,
  Clock,
  CreditCard,
  Phone,
  MapPin,
  CheckCircle,
  LogOut,
  BarChart2,
  DollarSign
} from "lucide-react";
import { API_BASE_URL } from "../../utils/api";

const DEMO_BOOKINGS = [
  { id: 1, day: 10, month: "JAN", year: 2026, client: "MR. RONAK PRAJAPATI", type: "WEDDING", time: "11:00 AM - 05:00 PM", address: "S-5 Shreenath Society, Naroda - 382330", mobile: "9825098765" },
  { id: 2, day: 11, month: "JAN", year: 2026, client: "MR. MUKESH PATEL", type: "RECEPTION", time: "06:00 PM - 11:00 PM", address: "S-6 Shreenath Society, Naroda - 382345", mobile: "9978912345" },
  { id: 3, day: 12, month: "JAN", year: 2026, client: "MR. RONAK PRAJAPATI", type: "WEDDING", time: "11:00 AM - 05:00 PM", address: "S-5 Shreenath Society, Naroda - 382330", mobile: "9825098765" },
  { id: 4, day: 15, month: "JAN", year: 2026, client: "MR. MUKESH PATEL", type: "RECEPTION", time: "06:00 PM - 11:00 PM", address: "S-6 Shreenath Society, Naroda - 382345", mobile: "9978912345" },
  { id: 5, day: 17, month: "JAN", year: 2026, client: "MR. MUKESH PATEL", type: "RECEPTION", time: "06:00 PM - 11:00 PM", address: "S-6 Shreenath Society, Naroda - 382345", mobile: "9978912345" },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [ownerUser, setOwnerUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStats, setApiStats] = useState(null);

  // Calendar state
  const [activeVenue, setActiveVenue] = useState("My Venue");
  const [bookingsList, setBookingsList] = useState(DEMO_BOOKINGS);
  const [tentativeList, setTentativeList] = useState([
    { id: 101, day: 14, month: "JAN", year: 2026 },
    { id: 102, day: 20, month: "JAN", year: 2026 },
  ]);
  const [calViewMonth, setCalViewMonth] = useState(0); // 0 = Jan 2026
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Professional reservation form state
  const [resForm, setResForm] = useState({
    client: "", mobile: "", address: "",
    functionDate: "", functionTime: "",
    functionType: "", gathering: "",
    status: "booked", notes: ""
  });

  const MONTHS_2026 = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const MONTH_CODES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  // Days in each month for 2026 (non-leap year)
  const DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
  // Day of week that each month starts (0=Sun) for 2026
  const MONTH_START_DAY = [4,0,0,3,5,1,3,6,2,4,0,2]; // Jan1=Thu=4

  // ── Auth guard + live API load ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (!token || !userStr) { window.location.href = "/login"; return; }

    const user = JSON.parse(userStr);
    if (user.role !== "owner") { window.location.href = "/"; return; }

    setOwnerUser(user);
    setActiveVenue(user.name ? user.name + "'s Venue" : "My Venue");

    // Fetch live dashboard data
    fetch(`${API_BASE_URL}/owner/dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setApiStats(data.stats);
          if (data.calendar_bookings && data.calendar_bookings.length > 0) {
            setBookingsList(data.calendar_bookings);
          }
        }
      })
      .catch(() => { /* fall back to demo data */ })
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenReservation = (day = null) => {
    if (day) {
      const yr = 2026;
      const mo = calViewMonth + 1;
      const dateStr = `${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      setResForm(f => ({ ...f, functionDate: dateStr }));
    }
    setSelectedDay(day);
    setShowReservationModal(true);
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const dateObj = new Date(resForm.functionDate);
    const day = dateObj.getDate();
    const month = MONTH_CODES[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    const newEntry = {
      id: Date.now(), day, month, year,
      client: resForm.client.toUpperCase(),
      type: resForm.functionType.toUpperCase(),
      time: resForm.functionTime,
      address: resForm.address,
      mobile: resForm.mobile,
    };

    if (resForm.status === "tentative") {
      setTentativeList(prev => [...prev, { id: newEntry.id, day, month, year }]);
    } else {
      setBookingsList(prev => [...prev, newEntry].sort((a,b) => a.day - b.day));
    }
    setShowReservationModal(false);
    setResForm({ client:"", mobile:"", address:"", functionDate:"", functionTime:"", functionType:"", gathering:"", status:"booked", notes:"" });
  };

  // 2. DATA ENTRY FORM STATE (FAQ Specs)
  const [formData, setFormData] = useState({
    // Basic Details
    venue_name: "",
    address: "",
    area: "",
    city: "Ahmedabad",
    pincode: "",
    state: "Gujarat",
    phone: "",
    email: "",
    website: "",
    owner_name: "",
    owner_mobile: "",
    owner_email: "",
    contractor_name: "",
    contractor_mobile: "",
    contractor_email: "",
    venue_type: "Banquet Hall",
    occasions: [],
    facilities: [],

    // Monopoly Decorator
    decor_option: "Open",
    decor_name: "",
    decor_address: "",
    decor_city: "",
    decor_pincode: "",
    decor_phone: "",
    decor_owner: "",
    decor_mobile: "",
    decor_email: "",
    decor_website: "",

    // Monopoly Caterer
    catering_option: "Open",
    caterer_name: "",
    caterer_address: "",
    caterer_city: "",
    caterer_pincode: "",
    caterer_phone: "",
    caterer_owner: "",
    caterer_mobile: "",
    caterer_email: "",
    caterer_website: "",
    food_menu: "",

    // Bank Details
    bank_name: "",
    bank_account: "",
    bank_ifsc: "",
    account_holder: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      // Reset form
      setFormData({
        venue_name: "",
        address: "",
        area: "",
        city: "Ahmedabad",
        pincode: "",
        state: "Gujarat",
        phone: "",
        email: "",
        website: "",
        owner_name: "",
        owner_mobile: "",
        owner_email: "",
        contractor_name: "",
        contractor_mobile: "",
        contractor_email: "",
        venue_type: "Banquet Hall",
        occasions: [],
        facilities: [],
        decor_option: "Open",
        decor_name: "",
        decor_address: "",
        decor_city: "",
        decor_pincode: "",
        decor_phone: "",
        decor_owner: "",
        decor_mobile: "",
        decor_email: "",
        decor_website: "",
        catering_option: "Open",
        caterer_name: "",
        caterer_address: "",
        caterer_city: "",
        caterer_pincode: "",
        caterer_phone: "",
        caterer_owner: "",
        caterer_mobile: "",
        caterer_email: "",
        caterer_website: "",
        food_menu: "",
        bank_name: "",
        bank_account: "",
        bank_ifsc: "",
        account_holder: ""
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 selection:bg-rose-600 selection:text-white">

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-8 text-left">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center shadow shadow-rose-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black font-outfit tracking-tight text-white">
              ClickMy<span className="text-rose-500">Venue</span>
            </span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "calendar"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <CalendarIcon className="w-4.5 h-4.5" /> Booking Calendar
            </button>

            <button
              onClick={() => setActiveTab("add_venue")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "add_venue"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Building className="w-4.5 h-4.5" /> Add Venue Form
            </button>

            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "subscriptions"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <CreditCard className="w-4.5 h-4.5" /> Owner Subscriptions
            </button>

            <button
              onClick={() => setActiveTab("faq")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "faq"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <HelpCircle className="w-4.5 h-4.5" /> Project FAQ Directory
            </button>
          </nav>
        </div>

        {/* User profile + Logout */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {ownerUser?.name?.slice(0, 2).toUpperCase() || "OW"}
            </div>
            <div>
              <p className="font-bold text-xs text-white leading-tight">{ownerUser?.name || "Venue Owner"}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Host Partner</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem("auth_token"); localStorage.removeItem("auth_user"); window.location.href = "/login"; }}
            className="p-2 rounded-lg hover:bg-rose-600/20 text-slate-500 hover:text-rose-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Loading spinner */}
        {isLoading && (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-bold">Loading your dashboard...</p>
          </div>
        )}

        {/* TAB 1: CALENDAR */}
        {!isLoading && activeTab === "calendar" && (
          <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left gap-4">
              <div>
                <h1 className="text-2xl font-black font-outfit text-slate-900">
                  {activeVenue} — Booking Calendar
                </h1>
                <p className="text-xs text-slate-500 mt-1">Live reservation schedule &amp; escrow booking pipeline</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Escrow Active</span>
                <span className="px-3 py-1 rounded bg-rose-50 border border-rose-100 text-rose-700 text-[10px] font-black uppercase">First Year Free</span>
              </div>
            </div>

            {/* Live API Stats Bar */}
            {apiStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Venues", value: apiStats.total_venues, icon: Building, color: "text-indigo-600", bg: "bg-indigo-50" },
                  { label: "Total Bookings", value: apiStats.total_bookings, icon: CalendarIcon, color: "text-rose-600", bg: "bg-rose-50" },
                  { label: "Pending", value: apiStats.pending_bookings, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Revenue (Escrow)", value: `₹${(apiStats.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                        <p className="text-base font-black text-slate-900 font-outfit leading-tight">{s.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full Month Calendar */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">

              {/* Calendar Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCalViewMonth(m => Math.max(0, m-1))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 flex items-center justify-center font-bold text-sm transition-all">‹</button>
                  <div className="text-left">
                    <h2 className="text-lg font-black font-outfit text-slate-950">{MONTHS_2026[calViewMonth]} 2026</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {bookingsList.filter(b => b.month === MONTH_CODES[calViewMonth]).length} Booked · {tentativeList.filter(t => t.month === MONTH_CODES[calViewMonth]).length} Tentative
                    </p>
                  </div>
                  <button onClick={() => setCalViewMonth(m => Math.min(11, m+1))} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 flex items-center justify-center font-bold text-sm transition-all">›</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>Booked</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>Tentative</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100 inline-block border border-slate-200"></span>Available</span>
                  </div>
                  <button
                    onClick={() => handleOpenReservation()}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" /> Add Reservation
                  </button>
                </div>
              </div>

              {/* Day-of-week header */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                  <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Leading empty cells */}
                {Array.from({ length: MONTH_START_DAY[calViewMonth] }, (_, i) => (
                  <div key={`empty-${i}`} className="min-h-[72px] border-b border-r border-slate-100 bg-slate-50/40"></div>
                ))}
                {/* Day cells */}
                {Array.from({ length: DAYS_IN_MONTH[calViewMonth] }, (_, i) => {
                  const dayNum = i + 1;
                  const mc = MONTH_CODES[calViewMonth];
                  const isBooked = bookingsList.some(b => b.day === dayNum && b.month === mc);
                  const isTentative = !isBooked && tentativeList.some(t => t.day === dayNum && t.month === mc);
                  const bookedEntry = bookingsList.find(b => b.day === dayNum && b.month === mc);
                  const isToday = dayNum === new Date().getDate() && calViewMonth === new Date().getMonth() && 2026 === new Date().getFullYear();
                  return (
                    <div
                      key={dayNum}
                      onClick={() => handleOpenReservation(dayNum)}
                      className={`min-h-[72px] border-b border-r border-slate-100 p-2 cursor-pointer transition-all group relative
                        ${isBooked ? 'bg-rose-50 hover:bg-rose-100' : isTentative ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-slate-50'}`}
                    >
                      <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-black mb-1 transition-all
                        ${isBooked ? 'bg-rose-500 text-white' : isTentative ? 'bg-amber-400 text-white' : isToday ? 'bg-slate-900 text-white' : 'text-slate-600 group-hover:bg-slate-200'}`}>
                        {dayNum}
                      </span>
                      {isBooked && bookedEntry && (
                        <div className="text-[9px] font-bold text-rose-700 leading-tight truncate">
                          <span className="block truncate">{bookedEntry.client}</span>
                          <span className="text-[8px] text-rose-500 font-semibold">{bookedEntry.type}</span>
                        </div>
                      )}
                      {isTentative && (
                        <div className="text-[9px] font-bold text-amber-700 leading-tight">
                          <span className="block">Tentative</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Trailing empty cells */}
                {Array.from({ length: (7 - ((MONTH_START_DAY[calViewMonth] + DAYS_IN_MONTH[calViewMonth]) % 7)) % 7 }, (_, i) => (
                  <div key={`trail-${i}`} className="min-h-[72px] border-b border-r border-slate-100 bg-slate-50/40"></div>
                ))}
              </div>
            </div>

            {/* Bookings Timeline below calendar */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Reservations Overview</h3>
                  <h2 className="text-base font-black font-outfit text-slate-950">
                    {MONTHS_2026[calViewMonth]} Scheduled Events
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {bookingsList.filter(b => b.month === MONTH_CODES[calViewMonth]).length === 0 && (
                  <p className="text-xs text-slate-400 font-medium text-center py-8">No bookings for {MONTHS_2026[calViewMonth]}. Click any date to add a reservation.</p>
                )}
                {bookingsList.filter(b => b.month === MONTH_CODES[calViewMonth]).sort((a,b) => a.day - b.day).map((bk) => (
                  <div key={bk.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden hover:shadow-md transition-shadow">
                    <div className="w-20 bg-rose-600 text-white flex flex-col items-center justify-center p-4 shrink-0">
                      <span className="text-2xl font-black leading-tight font-outfit">{bk.day}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-rose-100">{bk.month}</span>
                      <span className="text-[8px] text-rose-200 mt-0.5">{bk.year}</span>
                    </div>
                    <div className="p-4 flex-1 text-left space-y-1.5 relative">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-rose-600 font-outfit">{bk.client}</h4>
                        <span className="text-[9px] font-black bg-rose-50 text-rose-700 px-2 py-0.5 rounded uppercase">{bk.type}</span>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-slate-600 font-semibold">
                        <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {bk.time}</p>
                        <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {bk.address}</p>
                        <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {bk.mobile}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Tentative entries */}
                {tentativeList.filter(t => t.month === MONTH_CODES[calViewMonth]).map(t => (
                  <div key={t.id} className="bg-amber-50 rounded-2xl border border-amber-200 flex overflow-hidden">
                    <div className="w-20 bg-amber-400 text-white flex flex-col items-center justify-center p-4 shrink-0">
                      <span className="text-2xl font-black leading-tight font-outfit">{t.day}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-100">{t.month}</span>
                      <span className="text-[8px] text-amber-100 mt-0.5">{t.year}</span>
                    </div>
                    <div className="p-4 flex-1 text-left">
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-1 rounded uppercase tracking-wide">Tentative / Blocked</span>
                      <p className="text-[11px] text-amber-600 font-semibold mt-2">This date is provisionally held. Confirm or release from calendar.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* RESERVATION MODAL */}
        {showReservationModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowReservationModal(false)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black font-outfit text-slate-900">New Reservation</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Fill complete client details for the booking record</p>
                </div>
                <button onClick={() => setShowReservationModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg transition-all">×</button>
              </div>
              <form onSubmit={handleReservationSubmit} className="p-6 space-y-5">

                {/* Status toggle */}
                <div className="flex gap-3">
                  {["booked","tentative"].map(s => (
                    <button type="button" key={s}
                      onClick={() => setResForm(f => ({ ...f, status: s }))}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${
                        resForm.status === s
                          ? s === 'booked' ? 'bg-rose-600 text-white shadow-md' : 'bg-amber-400 text-white shadow-md'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}>
                      {s === 'booked' ? '🔴 Confirmed Booking' : '🟠 Tentative / Blocked'}
                    </button>
                  ))}
                </div>

                {/* Client Details */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client / Organiser Name *</label>
                      <input required type="text" placeholder="e.g. Mr. Ronak Prajapati"
                        value={resForm.client} onChange={e => setResForm(f=>({...f, client: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number *</label>
                      <input required type="tel" placeholder="e.g. 9825012345"
                        value={resForm.mobile} onChange={e => setResForm(f=>({...f, mobile: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gathering Count</label>
                      <input type="number" placeholder="e.g. 500 guests"
                        value={resForm.gathering} onChange={e => setResForm(f=>({...f, gathering: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Address</label>
                      <input type="text" placeholder="Society, Area, City"
                        value={resForm.address} onChange={e => setResForm(f=>({...f, address: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Function Date *</label>
                      <input required type="date"
                        value={resForm.functionDate} onChange={e => setResForm(f=>({...f, functionDate: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Function Time *</label>
                      <input required type="text" placeholder="e.g. 11:00 AM – 05:00 PM"
                        value={resForm.functionTime} onChange={e => setResForm(f=>({...f, functionTime: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Event / Function Type *</label>
                      <select required value={resForm.functionType} onChange={e => setResForm(f=>({...f, functionType: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500 cursor-pointer">
                        <option value="">Select Event Type</option>
                        <option value="Wedding">Wedding Ceremony</option>
                        <option value="Reception">Wedding Reception</option>
                        <option value="Sangeet">Sangeet / Mehendi</option>
                        <option value="Birthday">Birthday Party</option>
                        <option value="Corporate">Corporate Seminar / Conference</option>
                        <option value="Anniversary">Anniversary / Social Gathering</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Internal Notes</label>
                      <textarea rows={2} placeholder="Any special requirements, advance received, remarks..."
                        value={resForm.notes} onChange={e => setResForm(f=>({...f, notes: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:border-rose-500 resize-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReservationModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit"
                    className={`flex-1 py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
                      resForm.status === 'tentative' ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-400/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    }`}>
                    {resForm.status === 'tentative' ? 'Block as Tentative' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ADD VENUE FORM */}
        {!isLoading && activeTab === "add_venue" && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h1 className="text-2xl font-black font-outfit text-slate-900">
                Venue Onboarding Form</h1>
              <p className="text-xs text-slate-500 mt-1">Supply direct venue, monopoly contractor, food menus, and escrow banking parameters</p>
            </div>

            {formSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-pulse">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Onboarding Form Submitted Successfully! The ClickMyVenue moderation team is screening details. Status: PENDING.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-8">

              {/* Section 1: Basic Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-outfit">
                  <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">1</span>
                  Basic Venue & Contact Details
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NAME OF VENUE *</label>
                    <input
                      type="text" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-rose-600 focus:bg-white"
                      placeholder="e.g. Radhee Party Plot"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TYPE OF VENUE *</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold outline-none focus:border-rose-600 focus:bg-white">
                      <option>BANQUET HALL</option>
                      <option>CLUBS & RESORTS</option>
                      <option>PARTY PLOT</option>
                      <option>OTHERS</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ADDRESS *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Full street/plot no." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">AREA *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Naroda" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CITY *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Ahmedabad" />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PIN CODE *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="380001" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">STATE *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Gujarat" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PHONE NO *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="+91 79..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WEBSITE</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="www.venue.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NAME OF OWNER *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Owner Full Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OWNER MOBILE NO *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="98250..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OWNER EMAIL ID *</label>
                    <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="owner@gmail.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NAME OF VENUE CONTRACTOR</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Contractor Full Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CONTRACTOR MOBILE</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="99789..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CONTRACTOR EMAIL</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="contractor@gmail.com" />
                  </div>
                </div>

                {/* Best for Occasions Ticklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">BEST FOR OCCASIONS / EVENTS (TICK TO SELECT) *</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["Wedding Ceremony", "Sangeet / Party Plot", "Social Functions", "Get Together", "Corporate Event"].map((oc) => (
                      <label key={oc} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 bg-slate-50 cursor-pointer hover:bg-rose-50 hover:border-rose-200 transition-all text-xs font-bold">
                        <input type="checkbox" className="accent-rose-600" />
                        <span>{oc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities Ticklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">FACILITIES AVAILABLE *</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["Parking space", "Electricity/Backup", "Rooms Facility", "Washrooms", "A/C Setup"].map((fc) => (
                      <label key={fc} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200/80 bg-slate-50 cursor-pointer hover:bg-rose-50 hover:border-rose-200 transition-all text-xs font-bold">
                        <input type="checkbox" className="accent-rose-600" />
                        <span>{fc}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Section 2: Monopoly Decorator details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-outfit">
                  <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">2</span>
                  Monopoly Decorator Policy
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2.5">DECORATION OPTION</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="decor_opt" defaultChecked className="accent-rose-600" />
                      <span>Monopoly (Fixed Contractor Decorator)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="decor_opt" className="accent-rose-600" />
                      <span>Open Policy (No Monopoly)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-50">
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Provide details if Monopoly Decorator</p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NAME OF DECORATOR</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Radhe Decorators" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DECORATOR PHONE NO</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="+91 79..." />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ADDRESS</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Decorator office street" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CITY & PINCODE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Ahmedabad - 380001" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WEBSITE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="www.decorator.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OWNER NAME</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Decorator Owner" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DECORATOR MOBILE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="98240..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DECORATOR EMAIL ID</label>
                      <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="decor@gmail.com" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Section 3: Monopoly Caterer details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-outfit">
                  <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">3</span>
                  Monopoly Caterer Policy
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2.5">CATERING OPTION</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="cater_opt" defaultChecked className="accent-rose-600" />
                      <span>Monopoly (Fixed Contractor Caterer)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="cater_opt" className="accent-rose-600" />
                      <span>Open Policy (No Monopoly)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-50">
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Provide details if Monopoly Caterer</p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NAME OF CATERER</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Radhe Caterers" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CATERER PHONE NO</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="+91 79..." />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ADDRESS</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Caterer office street" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CITY & PINCODE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. Ahmedabad - 380001" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WEBSITE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="www.caterer.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">OWNER NAME</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Caterer Owner" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CATERER MOBILE</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="98240..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CATERER EMAIL ID</label>
                      <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="cater@gmail.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">FOOD MENU AND OPTIONS</label>
                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Describe food varieties: Gujarati Heritage, live counters, dessert plans..."></textarea>
                  </div>
                </div>

              </div>

              {/* Section 4: Bank Escrow Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 font-outfit">
                  <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">4</span>
                  Financial & Bank Escrow Coordinates
                </h3>

                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-800 leading-relaxed font-semibold">
                  ⚠️ Note: Escrow payments are captured via integrated Razorpay gateways. Host payments are locked and automatically released to these coordinates exactly 24 hours after successful event verification.
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BANK NAME *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="e.g. HDFC Bank" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ACCOUNT HOLDER NAME *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="Matching bank passbook" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BANK ACCOUNT NUMBER *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="502000..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BANK IFSC CODE *</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:border-rose-600 focus:bg-white outline-none" placeholder="HDFC0000..." />
                  </div>
                </div>

              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/25 active:scale-[0.98] transition-all"
                >
                  Submit Onboarding Profile for Screening
                </button>
              </div>

            </form>

          </div>
        )}

        {/* TAB 3: OWNER SUBSCRIPTION PACKAGES */}
        {!isLoading && activeTab === "subscriptions" && (
          <div className="space-y-8 max-w-4xl mx-auto">

            {/* Package header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left space-y-2">
              <span className="bg-rose-50 text-rose-700 font-black text-[10px] uppercase px-3 py-1 rounded-full border border-rose-100">
                100% Free First Year promotion
              </span>
              <h1 className="text-2xl font-black font-outfit text-slate-900 pt-1">Vendor Partner Packages</h1>
              <p className="text-xs text-slate-500">Exhibit your premium banquet hall, lawn, or resort to active event coordinators</p>
            </div>

            {/* Pricing card row */}
            <div className="grid md:grid-cols-3 gap-6 text-left">

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[450px]">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900 font-outfit">Starter Free</h3>
                  <p className="text-xs text-slate-400 font-light">Test the platform and start listing</p>

                  <div className="text-slate-900">
                    <span className="text-3xl font-black font-outfit">₹0</span>
                    <span className="text-xs text-slate-400 font-bold ml-1">/ year</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                    <li className="flex items-center gap-2">✓ 1 Active Venue Profile</li>
                    <li className="flex items-center gap-2">✓ 5 Photos Upload Limit</li>
                    <li className="flex items-center gap-2">✓ 15% Booking Commission</li>
                    <li className="flex items-center gap-2">✓ Standard Search Index</li>
                  </ul>
                </div>
                <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl mt-6">
                  Active Free Plan
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border-2 border-rose-600 shadow-xl shadow-rose-100 flex flex-col justify-between h-[450px] relative">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow">
                  First Year Free Promo!
                </span>

                <div className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900 font-outfit">Growth Basic</h3>
                  <p className="text-xs text-slate-400 font-light">Accelerate event bookings quickly</p>

                  <div className="text-slate-900">
                    <span className="text-3xl font-black font-outfit">₹999</span>
                    <span className="text-xs text-slate-400 font-bold ml-1">/ year (Normally Monthly)</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                    <li className="flex items-center gap-2">✓ 3 Active Venue Profiles</li>
                    <li className="flex items-center gap-2">✓ 15 High-Res Photos</li>
                    <li className="flex items-center gap-2">✓ 10% Booking Commission</li>
                    <li className="flex items-center gap-2">✓ Priority Email Support</li>
                    <li className="flex items-center gap-2">✓ Analytics Dashboard</li>
                  </ul>
                </div>
                <button className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl mt-6">
                  Re-Subscribe for Free
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[450px]">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900 font-outfit">Ultimate Pro</h3>
                  <p className="text-xs text-slate-400 font-light">Maximum leads and zero commissions</p>

                  <div className="text-slate-900">
                    <span className="text-3xl font-black font-outfit">₹2,499</span>
                    <span className="text-xs text-slate-400 font-bold ml-1">/ year</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                    <li className="flex items-center gap-2">✓ 10 Active Venue Profiles</li>
                    <li className="flex items-center gap-2">✓ 30 High-Res Photos</li>
                    <li className="flex items-center gap-2">✓ 0% Booking Commission</li>
                    <li className="flex items-center gap-2">✓ Featured Index Badge</li>
                    <li className="flex items-center gap-2">✓ Account Manager</li>
                  </ul>
                </div>
                <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl mt-6">
                  Upgrade Package
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: GENERAL FAQS (Directly answering all PPT slide FAQs) */}
        {!isLoading && activeTab === "faq" && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h1 className="text-2xl font-black font-outfit text-slate-900 font-outfit">Project FAQ Directory</h1>
              <p className="text-xs text-slate-500 mt-1">Platform guidelines, dispute systems, and business commission policies</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is the official domain of the website?",
                  a: "Our official domain is www.clickmyvenue.com. The site is actively hosted on the sandbox server http://venuehub.site."
                },
                {
                  q: "What types of registrations and fees apply to vendors?",
                  a: "Registration is 100% free for end-user event planners. For venue owners/vendors, it is a subscription model (Starter Free, Growth Basic, Ultimate Pro). However, as a launch promotion, the first year is completely free for all verified vendors!"
                },
                {
                  q: "How does the booking approval flow work?",
                  a: "Once a client user selects a date and files a booking request, the venue owner receives immediate SMS/WhatsApp alerts. The owner has a strict 24-hour window to Accept or Decline the proposal before it expires."
                },
                {
                  q: "How is the escrow payment and commission structured?",
                  a: "Planners deposit 100% of event costs securely via Razorpay upon proposal confirmation. The funds are held in stateful escrow. Payouts are transferred directly to the owner's bank account 24 hours after successful event completion, minus the commission based on their subscription plan (0% to 15%)."
                },
                {
                  q: "How does the platform handle disputes and failed delivery?",
                  a: "A dedicated Support Ticket system is integrated. If an owner fails to deliver, clients can open a dispute. The admin coordinates a site check and holds payouts until disputes are arbitrated. Tickets are directly addressed by Super Admins."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900 font-outfit flex items-start gap-2">
                    <span className="text-rose-600">Q:</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed pl-5 font-normal">{faq.a}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
