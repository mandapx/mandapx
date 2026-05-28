export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://mandapx.onrender.com/api';

export interface Venue {
  id: string;
  venue_name: string;
  slug: string;
  description: string;
  address: string;
  pin_code: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity_min: number;
  capacity_max: number;
  cost_per_plate_veg: number;
  cost_per_plate_nonveg: number;
  cost_per_day: number;
  venue_type: string[];
  amenities: string[];
  images: string[];
  rating: number;
  reviews_count: number;
  source: string;
  source_url: string;
  is_featured: boolean;
  is_verified: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CityCount {
  city: string;
  count: number;
}

async function fetchAPI<T>(endpoint: string, revalidate = 3600): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getVenues(params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<Venue>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  return fetchAPI(`/venues?${qs.toString()}`, 60);
}

export async function getVenueBySlug(slug: string): Promise<Venue> {
  return fetchAPI(`/venues/${slug}`);
}

export async function getFeaturedVenues(limit = 12): Promise<Venue[]> {
  return fetchAPI(`/venues/featured?limit=${limit}`);
}

export async function getCities(): Promise<CityCount[]> {
  return fetchAPI('/venues/cities');
}

export interface InquiryData {
  venue_slug: string;
  name: string;
  email: string;
  phone: string;
  event_date?: string;
  guest_count?: number;
  message?: string;
}

export async function submitInquiry(data: InquiryData): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Inquiry failed: ${res.status}`);
  }
  return res.json();
}
