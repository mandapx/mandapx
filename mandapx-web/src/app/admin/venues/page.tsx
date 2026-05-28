'use client';

import { useEffect, useState, useCallback } from "react";
import { adminListVenues, adminToggleFeatured, adminDeleteVenue } from "@/lib/api";

export default function AdminVenuesPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminListVenues(page, search);
      setData(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchVenues(); }, [fetchVenues]);

  const handleToggle = async (id: string) => {
    await adminToggleFeatured(id);
    fetchVenues();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this venue?")) return;
    await adminDeleteVenue(id);
    fetchVenues();
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">Venues</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      {loading ? (
        <p className="text-gray-500">Loading venues...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">City</th>
                  <th className="text-left px-4 py-3 font-medium">State</th>
                  <th className="text-left px-4 py-3 font-medium">Active</th>
                  <th className="text-left px-4 py-3 font-medium">Featured</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((venue: any) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-[250px] truncate font-medium text-gray-800">{venue.venue_name}</td>
                    <td className="px-4 py-3 text-gray-600">{venue.city}</td>
                    <td className="px-4 py-3 text-gray-600">{venue.state}</td>
                    <td className="px-4 py-3">{venue.is_active ? <span className="text-green-600">Yes</span> : <span className="text-red-500">No</span>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(venue.id)} className={`text-xs font-medium px-2 py-1 rounded ${venue.is_featured ? "bg-saffron text-white" : "bg-gray-200 text-gray-600"}`}>
                        {venue.is_featured ? "Featured" : "Set Featured"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(venue.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.meta && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} venues)</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                <button disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
