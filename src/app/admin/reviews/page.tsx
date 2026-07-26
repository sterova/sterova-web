import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReviewsManager from "./_components/ReviewsManager";
import type { Review } from "@/types";

export const metadata: Metadata = { title: "Reviews" };

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminReviewsPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const reviews = await getReviews();
  return <ReviewsManager initialReviews={reviews} />;
}
