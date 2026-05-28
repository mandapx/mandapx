'use client';

import { useEffect, useState } from "react";
import { adminGetStats } from "@/lib/api";
import { Users, Building2, MessageSquare, TrendingUp } from "lucide-react";

interface Stats {
  venues: { total: number; active: number; featured: number };
  inquiries: { total: number; pending: number; contacted: number };
  users: { total: number; admins: number; owners: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p className="text-gray-500">Loading stats...</p>;

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Building2 className="w-8 h-8 text-peacock" />}
          label="Total Venues"
          value={stats.venues.total}
          sub={`${stats.venues.active} active · ${stats.venues.featured} featured`}
        />
        <StatCard
          icon={<MessageSquare className="w-8 h-8 text-saffron" />}
          label="Inquiries"
          value={stats.inquiries.total}
          sub={`${stats.inquiries.pending} pending · ${stats.inquiries.contacted} contacted`}
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-rani" />}
          label="Users"
          value={stats.users.total}
          sub={`${stats.users.owners} owners · ${stats.users.admins} admins`}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-gray-50">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}
