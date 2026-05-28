"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { submitInquiry, getVenueBySlug } from "@/lib/api";

function InquiryForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueSlug = searchParams.get("venue") || "";

  const [venueName, setVenueName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_date: "",
    guest_count: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!venueSlug) {
      setLoading(false);
      return;
    }
    getVenueBySlug(venueSlug)
      .then((v) => {
        setVenueName(v.venue_name);
        setLoading(false);
      })
      .catch(() => {
        setVenueName(venueSlug);
        setLoading(false);
      });
  }, [venueSlug]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email address";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!/^[+]?[\d\s-]{7,15}$/.test(form.phone)) errors.phone = "Invalid phone number";
    if (form.guest_count && (isNaN(Number(form.guest_count)) || Number(form.guest_count) < 1)) {
      errors.guest_count = "Must be at least 1";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError("");

    try {
      await submitInquiry({
        venue_slug: venueSlug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        event_date: form.event_date || undefined,
        guest_count: form.guest_count ? Number(form.guest_count) : undefined,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-mehendi-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest{venueName ? ` in ${venueName}` : ""}. Our team will get back to you shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/venues")}
                className="px-6 py-2.5 bg-rani-pink text-white rounded-lg font-medium hover:bg-rani-pink/90"
              >
                Browse Venues
              </button>
              <button
                onClick={() => router.push(venueSlug ? `/venues/${venueSlug}` : "/")}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Venue
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-rani-pink focus:border-transparent outline-none transition-colors ${
      formErrors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <a href={venueSlug ? `/venues/${venueSlug}` : "/venues"} className="text-sm text-rani-pink hover:underline mb-6 inline-block">
            ← Back
          </a>

          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Send Inquiry</h1>
            {venueName ? (
              <p className="text-gray-500 mb-6">Interested in <span className="font-medium text-gray-700">{venueName}</span>?</p>
            ) : (
              <p className="text-gray-500 mb-6">Fill in your details and we&apos;ll get back to you.</p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClass("name")}
                  placeholder="Your name"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass("email")}
                  placeholder="your@email.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass("phone")}
                  placeholder="+91 98765 43210"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => updateField("event_date", e.target.value)}
                    className={inputClass("event_date")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={form.guest_count}
                    onChange={(e) => updateField("guest_count", e.target.value)}
                    className={inputClass("guest_count")}
                    placeholder="e.g. 200"
                    min="1"
                  />
                  {formErrors.guest_count && <p className="text-red-500 text-xs mt-1">{formErrors.guest_count}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className={inputClass("message")}
                  rows={4}
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-rani-pink hover:bg-rani-pink/90"
                }`}
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rani-pink" />
      </div>
    }>
      <InquiryForm />
    </Suspense>
  );
}
