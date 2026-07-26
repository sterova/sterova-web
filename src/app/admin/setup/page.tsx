import { redirect } from "next/navigation";

/**
 * Admin setup (self-registration) is disabled.
 * Create admin accounts directly via Supabase Auth + the admins table.
 * See supabase/migrations/004_admin_setup.sql for instructions.
 */
export default function AdminSetupPage() {
  redirect("/admin/login");
}
