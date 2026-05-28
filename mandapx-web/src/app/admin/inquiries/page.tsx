'use client';

import { useEffect, useState, useCallback } from "react";
import { adminListInquiries, adminUpdateInquiryStatus } from "@/lib/api";

export default function AdminInquiriesPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminListInquiries(page);
      setData(res);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleStatus = async (id: string, status: string) => {
    await adminUpdateInquiryStatus(id, status);
    fetchInquiries();
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">Inquiries</h1>
      {loading ? (
        <p className="text-gray-500">Loading inquiries...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Guests</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((inq: any) => (
                  <tr key={inq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{inq.name}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.email}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.guest_count || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${inq.status === "contacted" ? "bg-green-100 text-green-700" : inq.status === "resolved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {inq.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {inq.status !== "contacted" && (
                        <button onClick={() => handleStatus(inq.id, "contacted")} className="text-xs text-peacock hover:text-peacock/80 font-medium">Mark Contacted</button>
                      )}
                      {inq.status !== "resolved" && (
                        <button onClick={() => handleStatus(inq.id, "resolved")} className="text-xs text-green-600 hover:text-green-700 font-medium">Resolve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.meta && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Page {data.meta.page} of {data.meta.totalPages}</span>
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
