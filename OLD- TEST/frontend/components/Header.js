"use client";

import React, { useState } from "react";
import { ChevronDown, Menu, X, MapPin } from "lucide-react";

export default function Header({
  selectedCity,
  setSelectedCity,
  setSelectedCategory,
  setSelectedVenue,
  onVenueCategoryClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [venuesDropdownOpen, setVenuesDropdownOpen] = useState(false);

  const categories = [
    { label: "Banquet Halls", value: "Banquet Hall" },
    { label: "Party Plots", value: "Party Plot" },
    { label: "Clubs & Resorts", value: "Clubs & Resorts" },
    { label: "Community Halls", value: "Community Halls" },
  ];

  const scrollToVenues = () => {
    const section = document.getElementById("venues-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col text-left cursor-pointer" onClick={() => setSelectedVenue && setSelectedVenue(null)}>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-black font-outfit text-rose-600 tracking-tight">
              venuehub<span className="text-slate-700 font-extrabold">.com</span>
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider -mt-1.5 pl-0.5 hidden sm:block">
            premium venue discovery & booking
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 text-slate-600 text-sm font-semibold">
          <div
            className="relative group cursor-pointer py-2"
            onMouseEnter={() => setVenuesDropdownOpen(true)}
            onMouseLeave={() => setVenuesDropdownOpen(false)}
          >
            <span className="hover:text-rose-600 flex items-center gap-1 transition-colors">
              Venues <ChevronDown className="w-3.5 h-3.5" />
            </span>
            {venuesDropdownOpen && (
              <div className="absolute top-full left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-48 mt-1 z-50">
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onVenueCategoryClick(cat.value);
                      setVenuesDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a href="#partner-section" className="text-rose-600 hover:text-rose-700 transition-colors font-bold">
            List your Venue
          </a>
          <a href="#footer-section" className="hover:text-rose-600 transition-colors">
            Contact us
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="http://venuehub.site/backend/public"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-black text-rose-600 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 hidden sm:inline-block"
          >
            API Sandbox
          </a>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 sm:px-5 py-2 rounded-full border-2 border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-600 font-extrabold text-xs transition-all active:scale-95 cursor-pointer"
          >
            Sign in
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Venue Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onVenueCategoryClick(cat.value);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-100 text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <hr className="border-slate-100" />
            <a
              href="#partner-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              List your Venue
            </a>
            <a
              href="#footer-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
