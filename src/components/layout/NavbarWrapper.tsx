/**
 * Server Component wrapper for the Navbar.
 * Fetches active services (for the Services dropdown) and navigation items
 * (for the full nav structure) from the database.
 */
import { getServices, getNavItems } from "@/lib/content";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const [services, navItems] = await Promise.all([
    getServices(),
    getNavItems(),
  ]);
  return <Navbar dbServices={services} dbNavItems={navItems} />;
}
