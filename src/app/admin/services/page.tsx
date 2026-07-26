import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllServices } from "@/lib/content";
import { redirect } from "next/navigation";
import ServicesManager from "./_components/ServicesManager";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const services = await getAllServices();
  return <ServicesManager initialServices={services} />;
}
