const defaultApiBase = "http://localhost:8000/api";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== "undefined" && window.location.host.includes("venuehub.site") ? "http://venuehub.site/backend/public/api" : defaultApiBase);

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

export async function fetchVenues(params = {}) {
  const query = new URLSearchParams();
  
  if (params.city_id) query.append("city_id", params.city_id);
  if (params.type_id) query.append("type_id", params.type_id);
  if (params.event_type_id) query.append("event_type_id", params.event_type_id);
  
  // Pax count limits
  if (params.pax) {
    query.append("min_capacity", params.pax);
    query.append("max_capacity", params.pax);
  }
  
  // Pricing filters
  if (params.min_price) query.append("min_price", params.min_price);
  if (params.max_price) query.append("max_price", params.max_price);
  
  if (params.q) query.append("q", params.q);
  
  return fetchApi(`/venues?${query.toString()}`);
}

export async function fetchLookupFilters() {
  return fetchApi("/venues/filters");
}
