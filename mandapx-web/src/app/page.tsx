import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />

        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Browse by City
              </h2>
              <p className="mt-2 text-gray-500">Find wedding venues in top cities across India</p>
            </div>
            <CityGrid />
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Venues</h2>
                <p className="text-gray-500 mt-1">Handpicked venues for your special day</p>
              </div>
              <a href="/venues" className="text-rani-pink hover:text-saffron font-bold transition-colors">View all →</a>
            </div>
            <FeaturedVenues />
          </div>
        </section>

        <section className="py-16 bg-rani-pink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Your Venue Deserves to Be Discovered</h2>
            <p className="mt-3 text-white/80 text-lg">Join 50,000+ trusted venues reaching lakhs of couples.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-white font-bold text-2xl">50,000+</span>
              <span className="text-white/60">|</span>
              <span className="text-white/80">Venues Listed</span>
              <span className="text-white/60">|</span>
              <span className="text-white font-bold text-2xl">₹0</span>
              <span className="text-white/80">Listing Cost</span>
            </div>
            <a
              href="/list-your-venue"
              className="mt-6 inline-block px-10 py-3.5 bg-white text-rani-pink font-bold rounded-xl hover:bg-cream transition-colors shadow-sm"
            >
              List Your Venue for Free
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-peacock-blue py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} MandapX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const CITIES = [
  { code: "mumbai", name: "Mumbai", count: "2,100+", file: "mumbai.svg" },
  { code: "bang", name: "Bangalore", count: "2,500+", file: "bang.svg" },
  { code: "ncr", name: "Delhi NCR", count: "1,900+", file: "ncr.svg" },
  { code: "chen", name: "Chennai", count: "1,900+", file: "chen.svg" },
  { code: "hyd", name: "Hyderabad", count: "1,800+", file: "hyd.png" },
  { code: "pune", name: "Pune", count: "1,500+", file: "pune.png" },
  { code: "ahd", name: "Ahmedabad", count: "1,400+", file: "ahd.svg" },
  { code: "kolk", name: "Kolkata", count: "1,100+", file: "kolk.svg" },
  { code: "koch", name: "Kochi", count: "800+", file: "koch.svg" },
  { code: "chd", name: "Chandigarh", count: "900+", file: "chd.svg" },
];

function CityGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {CITIES.map((city) => (
        <a
          key={city.code}
          href={`/venues?city=${city.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white hover:border-saffron hover:shadow-lg transition-all"
        >
          <div className="w-20 h-20 flex items-center justify-center mb-3">
            <img
              src={`/cities/${city.file}`}
              alt={city.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="font-semibold text-gray-900 group-hover:text-rani-pink transition-colors">
            {city.name}
          </div>
          <div className="text-sm text-gray-500">{city.count} venues</div>
        </a>
      ))}
    </div>
  );
}

async function FeaturedVenues() {
  let venues: any[] = [];

  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${base}/venues/featured`, { next: { revalidate: 300 } });
    if (res.ok) venues = await res.json();
  } catch {
  }

  if (venues.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {venues.slice(0, 8).map((venue) => (
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
              <div className="w-full h-full flex items-center justify-center text-gray-400">
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
              <span className="text-sm text-gray-600">
                {venue.venue_type?.[0] || 'Venue'}
              </span>
              {venue.cost_per_plate_veg && (
                <span className="text-sm font-bold text-gray-900">
                  ₹{venue.cost_per_plate_veg}/plate
                </span>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
