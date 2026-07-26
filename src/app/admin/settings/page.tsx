import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllSiteSettings } from "@/lib/content";
import { redirect } from "next/navigation";
import SettingsManager from "./_components/SettingsManager";

export const metadata: Metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const settings = await getAllSiteSettings();
  return <SettingsManager initialSettings={settings} />;
}
