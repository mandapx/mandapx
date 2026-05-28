import Header from "@/components/Header";
import { getVenueBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let venue: any;

  try {
    venue = await getVenueBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-4">
            <a href="/venues" className="text-sm text-rani-pink hover:underline">← Back to venues</a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{venue.venue_name}</h1>
                  <p className="text-gray-500 mt-1 capitalize">
                    {venue.city}{venue.state ? `, ${venue.state}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {venue.rating > 0 && (
                    <span className="bg-mehendi-green text-white px-3 py-1.5 rounded-lg font-medium text-sm">
                      ★ {venue.rating} ({venue.reviews_count})
                    </span>
                  )}
                  {venue.is_verified && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {venue.images && venue.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {venue.images.slice(0, 6).map((img: string, i: number) => (
                    <div
                      key={i}
                      className={`aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                    >
                      <img
                        src={img}
                        alt={`${venue.venue_name} - ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {venue.description || 'No description available.'}
                    </p>
                  </section>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <section>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
                      <div className="flex flex-wrap gap-2">
                        {venue.amenities.map((amenity: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {venue.venue_type && venue.venue_type.length > 0 && (
                    <section>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Venue Type</h2>
                      <div className="flex flex-wrap gap-2">
                        {venue.venue_type.map((type: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-cream text-rani-pink rounded-full text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                    <div className="space-y-3">
                      {venue.cost_per_plate_veg && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Veg (per plate)</span>
                          <span className="font-semibold text-gray-900">₹{venue.cost_per_plate_veg}</span>
                        </div>
                      )}
                      {venue.cost_per_plate_nonveg && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Non-Veg (per plate)</span>
                          <span className="font-semibold text-gray-900">₹{venue.cost_per_plate_nonveg}</span>
                        </div>
                      )}
                      {venue.cost_per_day && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Per Day</span>
                          <span className="font-semibold text-gray-900">₹{venue.cost_per_day}</span>
                        </div>
                      )}
                      {!venue.cost_per_plate_veg && !venue.cost_per_plate_nonveg && !venue.cost_per_day && (
                        <p className="text-gray-400 text-sm">Contact for pricing</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Capacity</h3>
                    {venue.capacity_max ? (
                      <div className="text-3xl font-bold text-gray-900">
                        Up to {venue.capacity_max}
                        <span className="text-sm font-normal text-gray-500 ml-1">guests</span>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Not specified</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
                    <p className="text-gray-600 text-sm">{venue.address || 'Address not available'}</p>
                    {venue.pin_code && (
                      <p className="text-gray-500 text-xs mt-1">PIN: {venue.pin_code}</p>
                    )}
                  </div>

                  <div className="bg-rani-pink text-white rounded-xl p-6 text-center">
                    <p className="text-sm opacity-90 mb-2">Interested in this venue?</p>
                    <a
                      href={`/inquiry?venue=${venue.slug}`}
                      className="inline-block w-full py-2.5 bg-white text-rani-pink rounded-lg font-semibold hover:bg-cream transition-colors"
                    >
                      Send Inquiry
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MandapX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
