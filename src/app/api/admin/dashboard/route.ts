import { jsonOk, requireAdmin } from "@/lib/admin";
import { Booking } from "@/models/Booking";
import { Inquiry } from "@/models/Inquiry";
import { Page } from "@/models/Page";
import { Service } from "@/models/Service";
import { Activity } from "@/models/Activity";
import { Event } from "@/models/Event";
import { GalleryItem } from "@/models/GalleryItem";
import { TeamMember } from "@/models/TeamMember";
import { Product } from "@/models/Product";
import { BlogPost } from "@/models/BlogPost";
import { Testimonial } from "@/models/Testimonial";
import { MediaAsset } from "@/models/MediaAsset";

export async function GET() {
  const result = await requireAdmin();
  if (result.error) return result.error;

  const [
    bookingsTotal,
    bookingsNew,
    inquiriesTotal,
    inquiriesNew,
    pagesPublished,
    servicesActive,
    activitiesActive,
    eventsPublished,
    galleryPublished,
    teamPublished,
    productsActive,
    blogsPublished,
    blogsDraft,
    testimonialsPending,
    mediaCount,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: "new" }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    Page.countDocuments({ status: "published" }),
    Service.countDocuments({ status: "active" }),
    Activity.countDocuments({ status: "active" }),
    Event.countDocuments({ status: "published" }),
    GalleryItem.countDocuments({ status: "published" }),
    TeamMember.countDocuments({ status: "published" }),
    Product.countDocuments({ status: "active" }),
    BlogPost.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "draft" }),
    Testimonial.countDocuments({ approved: false }),
    MediaAsset.countDocuments(),
  ]);

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const bookingTrendRaw = await Booking.aggregate<{
    _id: string;
    count: number;
  }>([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const trendMap = new Map(bookingTrendRaw.map((r) => [r._id, r.count]));
  const bookingTrend: { date: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    bookingTrend.push({ date: key, count: trendMap.get(key) || 0 });
  }

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  const recentInquiries = await Inquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return jsonOk({
    stats: {
      bookingsTotal,
      bookingsNew,
      inquiriesTotal,
      inquiriesNew,
      pagesPublished,
      servicesActive,
      activitiesActive,
      eventsPublished,
      galleryPublished,
      teamPublished,
      productsActive,
      blogsPublished,
      blogsDraft,
      testimonialsPending,
      mediaCount,
    },
    bookingTrend,
    recentBookings,
    recentInquiries,
  });
}
