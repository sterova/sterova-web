import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllFaqs } from "@/lib/content";
import { redirect } from "next/navigation";
import FaqsManager from "./_components/FaqsManager";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const faqs = await getAllFaqs();
  return <FaqsManager initialFaqs={faqs} />;
}
