import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllTestimonials } from "@/lib/content";
import { redirect } from "next/navigation";
import TestimonialsManager from "./_components/TestimonialsManager";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const testimonials = await getAllTestimonials();
  return <TestimonialsManager initialTestimonials={testimonials} />;
}
