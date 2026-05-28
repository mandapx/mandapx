"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { fetchApi } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      // fetchApi already throws on non-OK responses, so if we reach here login succeeded
      if (!data || !data.token) {
        throw new Error(data?.message || "Login failed. Please check your credentials.");
      }

      // Store Auth Details
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/admin";
        } else if (data.user.role === "owner") {
          window.location.href = "/owner";
        } else {
          window.location.href = "/";
        }
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/5 to-rose-500/5 -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-10 space-y-8 relative">
        
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 mx-auto">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to manage your venues or book your next event</p>
        </div>

        {/* Info Box with Demo Credentials */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Administrative Sandbox Logins
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 font-semibold pt-1">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Super Admin</p>
              <p className="text-slate-800">admin@clickmyvenue.com</p>
              <p className="text-slate-400">Password: <span className="font-mono text-slate-700">password</span></p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px]">Venue Owner</p>
              <p className="text-slate-800">owner@clickmyvenue.com</p>
              <p className="text-slate-400">Password: <span className="font-mono text-slate-700">password</span></p>
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@clickmyvenue.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none text-slate-800 focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-12 text-sm font-medium outline-none text-slate-800 focus:border-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

      </div>
    </div>
  );
}
