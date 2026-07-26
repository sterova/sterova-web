import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllPortfolioItems } from "@/lib/content";
import { redirect } from "next/navigation";
import PortfolioManager from "./_components/PortfolioManager";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const items = await getAllPortfolioItems();
  return <PortfolioManager initialItems={items} />;
}
