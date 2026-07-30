"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Inbox,
  FileText,
  Leaf,
  Newspaper,
  ImageIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-fetch";
import { formatDate } from "@/lib/utils";

type DashboardData = {
  stats: {
    bookingsTotal: number;
    bookingsNew: number;
    inquiriesTotal: number;
    inquiriesNew: number;
    pagesPublished: number;
    servicesActive: number;
    activitiesActive: number;
    eventsPublished: number;
    galleryPublished: number;
    teamPublished: number;
    productsActive: number;
    blogsPublished: number;
    blogsDraft: number;
    testimonialsPending: number;
    mediaCount: number;
  };
  bookingTrend: { date: string; count: number }[];
  recentBookings: Array<{
    _id: string;
    fullName: string;
    bookingType: string;
    status: string;
    createdAt: string;
  }>;
  recentInquiries: Array<{
    _id: string;
    fullName: string;
    inquiryType: string;
    status: string;
    createdAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await adminFetch<DashboardData>("/api/admin/dashboard");
        setData(result);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
      }
    })();
  }, []);

  if (!data) {
    return <p className="text-sm text-white/50">Loading dashboard…</p>;
  }

  const { stats } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-white/50">
          Live counts from MongoDB — no placeholder revenue metrics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="New bookings"
          value={stats.bookingsNew}
          hint={`${stats.bookingsTotal} total`}
          icon={ClipboardList}
        />
        <StatsCard
          label="New inquiries"
          value={stats.inquiriesNew}
          hint={`${stats.inquiriesTotal} total`}
          icon={Inbox}
        />
        <StatsCard
          label="Published pages"
          value={stats.pagesPublished}
          icon={FileText}
        />
        <StatsCard
          label="Active services"
          value={stats.servicesActive}
          icon={Leaf}
        />
        <StatsCard
          label="Blog drafts"
          value={stats.blogsDraft}
          hint={`${stats.blogsPublished} published`}
          icon={Newspaper}
        />
        <StatsCard label="Gallery items" value={stats.galleryPublished} icon={ImageIcon} />
        <StatsCard label="Active products" value={stats.productsActive} />
        <StatsCard
          label="Pending testimonials"
          value={stats.testimonialsPending}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-semibold text-white">Booking trend (30 days)</h3>
        <p className="mt-1 text-xs text-white/45">
          Empty days show as zero — chart updates when real bookings arrive.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.bookingTrend}>
              <defs>
                <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C6FF4E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#C6FF4E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                tickFormatter={(v: string) => v.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "#0d2f24",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#C6FF4E"
                fill="url(#bookingFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Recent bookings"
          href="/admin/bookings"
          rows={data.recentBookings.map((b) => ({
            id: b._id,
            title: b.fullName,
            meta: b.bookingType,
            status: b.status,
            date: b.createdAt,
          }))}
        />
        <RecentList
          title="Recent inquiries"
          href="/admin/inquiries"
          rows={data.recentInquiries.map((i) => ({
            id: i._id,
            title: i.fullName,
            meta: i.inquiryType,
            status: i.status,
            date: i.createdAt,
          }))}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  href,
  rows,
}: {
  title: string;
  href: string;
  rows: Array<{ id: string; title: string; meta: string; status: string; date: string }>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <Link href={href} className="text-xs text-lime hover:underline">
          View all
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-white/40">No records yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{row.title}</p>
                <p className="text-xs text-white/40">
                  {row.meta} · {formatDate(row.date, "MMM d, yyyy")}
                </p>
              </div>
              <StatusBadge status={row.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
