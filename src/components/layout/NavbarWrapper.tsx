/**
 * Server Component wrapper for the Navbar.
 * Fetches active services from the DB so the Services dropdown is dynamic.
 */
import { getServices } from "@/lib/content";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const services = await getServices();
  return <Navbar dbServices={services} />;
}
