import Header from "@/components/Header";
import { getVenues } from "@/lib/api";

const VENUE_TYPES = ["Banquet Hall", "Hotel", "Resort", "Lawn", "Farmhouse", "Party Hall", "Restaurant", "Club"];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VenuesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const search = typeof sp.search === 'string' ? sp.search : '';
  const city = typeof sp.city === 'string' ? sp.city : '';
  const sort = typeof sp.sort === 'string' ? sp.sort : 'rating';
  const page = typeof sp.page === 'string' ? parseInt(sp.page) || 1 : 1;
  const type = typeof sp.type === 'string' ? sp.type : '';

  let venues: any[] = [];
  let meta = { total: 0, page: 1, totalPages: 0 };
  let error = false;

  try {
    const params: Record<string, string | number | undefined> = { page, limit: 24, sort };
    if (search) params.search = search;
    if (city) params.city = city;
    if (type) params.venue_type = type;

    const result = await getVenues(params);
    venues = result.data;
    meta = result.meta;
  } catch {
    error = true;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {city ? `Wedding Venues in ${city.charAt(0).toUpperCase() + city.slice(1)}` : 'All Wedding Venues'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{meta.total.toLocaleString()} venues found</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <form method="GET" className="flex gap-2 flex-1 max-w-md">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search venues..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rani-pink"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rani-pink text-white text-sm font-bold rounded-lg hover:bg-saffron transition-colors"
              >
                Search
              </button>
            </form>

            <select
              name="sort"
              defaultValue={sort}
              onChange={e => {
                const url = new URL(window.location.href);
                url.searchParams.set('sort', e.target.value);
                window.location.href = url.toString();
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="capacity">Capacity</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={`/venues?${new URLSearchParams({ ...(search ? { search } : {}), ...(city ? { city } : {}) }).toString()}`}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${!type ? 'bg-rani-pink text-white border-rani-pink' : 'bg-white text-gray-600 border-gray-300 hover:border-rani-pink'}`}
            >
              All
            </a>
            {VENUE_TYPES.map(t => (
              <a
                key={t}
                href={`/venues?${new URLSearchParams({ ...(search ? { search } : {}), ...(city ? { city } : {}), type: t }).toString()}`}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${type === t ? 'bg-rani-pink text-white border-rani-pink' : 'bg-white text-gray-600 border-gray-300 hover:border-rani-pink'}`}
              >
                {t}
              </a>
            ))}
          </div>

          {error ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Unable to load venues. Make sure the API server is running.</p>
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No venues found matching your criteria.</p>
              <a href="/venues" className="text-rani-pink hover:text-saffron font-semibold mt-2 inline-block">Clear filters</a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {venues.map((venue) => (
                  <a
                    key={venue.id || venue.slug}
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
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
                        <span className="text-xs text-gray-500">
                          Up to {venue.capacity_max || 'N/A'} guests
                        </span>
                        {venue.cost_per_plate_veg && (
                          <span className="text-sm font-bold text-gray-900">
                            ₹{venue.cost_per_plate_veg}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <a
                      href={`/venues?${new URLSearchParams({ ...(search ? { search } : {}), ...(city ? { city } : {}), ...(type ? { type } : {}), page: String(page - 1), sort }).toString()}`}
                      className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-cream"
                    >
                      Previous
                    </a>
                  )}
                  <span className="text-sm text-gray-600">
                    Page {page} of {meta.totalPages}
                  </span>
                  {page < meta.totalPages && (
                    <a
                      href={`/venues?${new URLSearchParams({ ...(search ? { search } : {}), ...(city ? { city } : {}), ...(type ? { type } : {}), page: String(page + 1), sort }).toString()}`}
                      className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm hover:bg-cream"
                    >
                      Next
                    </a>
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
