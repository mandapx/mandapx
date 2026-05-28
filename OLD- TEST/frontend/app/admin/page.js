"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Building, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  XCircle, 
  UserMinus, 
  UserCheck, 
  LogOut, 
  BarChart2, 
  CheckCircle,
  AlertTriangle,
  Award
} from "lucide-react";

import { API_BASE_URL } from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_venues: 0,
    pending_venues: 0,
    total_bookings: 0,
    total_users: 0,
    total_owners: 0,
    total_revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentVenues, setRecentVenues] = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [allVenues, setAllVenues] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4000);
  };

  // Auth Protection and Initial Load
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (!token || !userStr) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      window.location.href = "/";
      return;
    }

    setAdminUser(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth_token");
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    try {
      // 1. Fetch Dashboard Stats & Recents
      const statsRes = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentBookings(statsData.recent_bookings || []);
        setRecentVenues(statsData.recent_venues || []);
      }

      // 2. Fetch Pending Venues
      const pendingRes = await fetch(`${API_BASE_URL}/admin/venues/pending`, { headers });
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingVenues(pendingData);
      }

      // 3. Fetch All Venues
      const venuesRes = await fetch(`${API_BASE_URL}/admin/venues`, { headers });
      if (venuesRes.ok) {
        const venuesData = await venuesRes.json();
        setAllVenues(venuesData);
      }

      // 4. Fetch All Users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }

      // 5. Fetch All Bookings
      const bookingsRes = await fetch(`${API_BASE_URL}/admin/bookings`, { headers });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setAllBookings(bookingsData);
      }

    } catch (err) {
      console.error("Error fetching admin dashboard data", err);
      showNotification("error", "Error connecting to server dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  // Moderation Actions
  const handleApproveVenue = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/venues/${id}/approve`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.ok) {
        showNotification("success", "Venue approved and listed successfully!");
        fetchData();
      }
    } catch (err) {
      showNotification("error", "Failed to approve venue.");
    }
  };

  const handleRejectVenue = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/venues/${id}/reject`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: "Does not meet photographic quality standards" })
      });
      if (res.ok) {
        showNotification("success", "Venue rejected and owner notified.");
        fetchData();
      }
    } catch (err) {
      showNotification("error", "Failed to reject venue.");
    }
  };

  const handleToggleFeatured = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/venues/${id}/feature`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        showNotification("success", data.message);
        fetchData();
      }
    } catch (err) {
      showNotification("error", "Failed to update featured status.");
    }
  };

  // User Management
  const handleBanUser = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/ban`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.ok) {
        showNotification("success", "User account banned successfully.");
        fetchData();
      }
    } catch (err) {
      showNotification("error", "Failed to ban user.");
    }
  };

  const handleUnbanUser = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/unban`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.ok) {
        showNotification("success", "User account reinstated.");
        fetchData();
      }
    } catch (err) {
      showNotification("error", "Failed to unban user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight bg-gradient-to-r from-indigo-900 to-rose-600 bg-clip-text text-transparent">
              ClickMyVenue
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview" 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BarChart2 className="w-4.5 h-4.5" /> Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab("moderation")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "moderation" 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-4.5 h-4.5" /> Venue Moderation
              </div>
              {pendingVenues.length > 0 && (
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {pendingVenues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "users" 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users className="w-4.5 h-4.5" /> User Management
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "bookings" 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-4.5 h-4.5" /> Platform Bookings
            </button>
          </nav>
        </div>

        {/* User profile section */}
        {adminUser && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="text-left leading-tight">
                <p className="font-bold text-xs text-slate-900">{adminUser.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{adminUser.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Banner Alert Notification */}
        {notification.message && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-semibold z-50 animate-bounce ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : "bg-rose-50 border-rose-100 text-rose-800"
          }`}>
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Dashboard Title & Top Bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-slate-900 capitalize">
              {activeTab === "overview" && "Dashboard Analytics"}
              {activeTab === "moderation" && "Venue Moderation Centre"}
              {activeTab === "users" && "Platform User Accounts"}
              {activeTab === "bookings" && "All Platform Bookings"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Super Administrative Panel & Escrow Gatekeeper</p>
          </div>
          <button 
            onClick={fetchData} 
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 shadow-sm"
          >
            Sync Data
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Synchronizing administrative databases...</p>
          </div>
        ) : (
          <>
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Venues</span>
                      <Building className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-extrabold font-outfit text-slate-900">{stats.total_venues}</p>
                    <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded inline-block">
                      {stats.pending_venues} pending approval
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Bookings</span>
                      <Calendar className="w-5 h-5 text-rose-500" />
                    </div>
                    <p className="text-3xl font-extrabold font-outfit text-slate-900">{stats.total_bookings}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Active booking lifecycle</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Users</span>
                      <Users className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-extrabold font-outfit text-slate-900">{stats.total_users}</p>
                    <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block">
                      {stats.total_owners} venue owners
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Escrow Volume</span>
                      <DollarSign className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-extrabold font-outfit text-slate-900">₹{stats.total_revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded inline-block">
                      INR Razorpay Payouts
                    </p>
                  </div>
                </div>

                {/* Split lists: Pending Moderation & Recent Bookings */}
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left: Pending Moderations */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900 font-outfit">Pending Approvals</h3>
                      <button onClick={() => setActiveTab("moderation")} className="text-indigo-600 hover:text-indigo-700 text-xs font-bold">
                        View All
                      </button>
                    </div>

                    {pendingVenues.length > 0 ? (
                      <div className="space-y-4">
                        {pendingVenues.slice(0, 3).map((venue) => (
                          <div key={venue.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{venue.name}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">{venue.area}, {venue.city}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleApproveVenue(venue.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm shadow-emerald-500/10"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectVenue(venue.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px]"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                        <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                        <p className="text-xs text-slate-500 font-bold">Excellent! All pending listings have been reviewed.</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Recent Bookings */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-base text-slate-900 font-outfit">Recent Booking Orders</h3>
                    {recentBookings.length > 0 ? (
                      <div className="space-y-4">
                        {recentBookings.map((bk) => (
                          <div key={bk.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="space-y-0.5">
                              <p className="font-bold text-xs text-slate-900">{bk.venue?.name || "Premium Venue"}</p>
                              <p className="text-[10px] text-slate-500">Host: {bk.user?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-extrabold text-xs text-slate-900">₹{parseFloat(bk.total_price).toLocaleString()}</p>
                              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1 capitalize ${
                                bk.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                              }`}>
                                {bk.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                        No recent bookings found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MODERATION */}
            {activeTab === "moderation" && (
              <div className="space-y-8 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-outfit">Pending Listing Moderation</h3>
                  <p className="text-xs text-slate-500 mt-1">Accept verified host venues or reject poor layout listings</p>
                </div>

                {pendingVenues.length > 0 ? (
                  <div className="space-y-4">
                    {pendingVenues.map((venue) => (
                      <div key={venue.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase border border-indigo-100">
                              {venue.type?.name || "Banquet Hall"}
                            </span>
                            <span className="text-xs font-bold text-slate-400">{venue.area}, {venue.city?.name || "Ahmedabad"}</span>
                          </div>
                          <h4 className="font-bold text-base text-slate-950">{venue.name}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">{venue.description}</p>
                          <div className="flex gap-4 pt-1 text-[11px] text-slate-600 font-semibold">
                            <span>Capacity: <strong className="text-slate-900">{venue.capacity_min} - {venue.capacity_max}</strong></span>
                            <span>Veg Price: <strong className="text-slate-900">₹{venue.price_per_plate}</strong></span>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-3 shrink-0">
                          <button 
                            onClick={() => handleApproveVenue(venue.id)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/10 transition-all"
                          >
                            Approve Listing
                          </button>
                          <button 
                            onClick={() => handleRejectVenue(venue.id)}
                            className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-all"
                          >
                            Reject & Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">No Pending Approvals</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">All venue submissions are successfully verified and actively listed on ClickMyVenue!</p>
                  </div>
                )}

                {/* Moderated/Active Venues Management */}
                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-outfit">Active Platform Venues</h3>
                    <p className="text-xs text-slate-500 mt-1">Promote premium venues with Featured badges or review listings</p>
                  </div>

                  <div className="overflow-hidden border border-slate-200/80 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Venue Details</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                        {allVenues.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900 text-sm">{v.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{v.type?.name || "Banquet Hall"}</p>
                            </td>
                            <td className="px-6 py-4">{v.area}, {v.city?.name || "Ahmedabad"}</td>
                            <td className="px-6 py-4 capitalize">{v.category || "indoor"}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                v.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleToggleFeatured(v.id)}
                                className={`px-2.5 py-1 rounded-lg border font-bold text-[10px] flex items-center gap-1 transition-all ${
                                  v.featured 
                                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <Award className="w-3.5 h-3.5" /> {v.featured ? "Featured" : "Feature"}
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

            {/* TAB: USERS */}
            {activeTab === "users" && (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-outfit">User Account Directory</h3>
                  <p className="text-xs text-slate-500 mt-1">Suspend, ban, or reinstate host and client accounts</p>
                </div>

                <div className="overflow-hidden border border-slate-200/80 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Platform Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Account Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                      {allUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">UID: {user.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-800">{user.email}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{user.phone || "No Phone"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              user.role === "admin" 
                                ? "bg-purple-50 text-purple-700 border border-purple-100" 
                                : user.role === "owner" 
                                ? "bg-amber-50 text-amber-700 border border-amber-100" 
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                            }`}>
                              {user.status || "active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.role !== "admin" && (
                              user.status === "banned" ? (
                                <button 
                                  onClick={() => handleUnbanUser(user.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1.5 mx-auto border border-emerald-100 transition-colors"
                                >
                                  <UserCheck className="w-3.5 h-3.5" /> Re-activate
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleBanUser(user.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center gap-1.5 mx-auto transition-colors"
                                >
                                  <UserMinus className="w-3.5 h-3.5" /> Ban Account
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-outfit">Platform Booking Orders</h3>
                  <p className="text-xs text-slate-500 mt-1">Audit active user reservation transactions and payout cycles</p>
                </div>

                <div className="overflow-hidden border border-slate-200/80 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Booking ID</th>
                        <th className="px-6 py-4">Client User</th>
                        <th className="px-6 py-4">Venue Reserved</th>
                        <th className="px-6 py-4">Order Price</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                      {allBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">#BK-{b.id}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{b.booking_date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{b.user?.name || "Client"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{b.user?.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{b.venue?.name || "Premium Venue"}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{b.venue?.area}, {b.venue?.city || "Mumbai"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-extrabold text-slate-900 text-sm">₹{parseFloat(b.total_price).toLocaleString()}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{b.guests_count} Guests</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              b.status === "confirmed" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                : b.status === "cancelled" 
                                ? "bg-rose-50 text-rose-700" 
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </main>

    </div>
  );
}
