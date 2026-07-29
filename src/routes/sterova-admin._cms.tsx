import { Outlet, createFileRoute } from "@tanstack/react-router";
import RequireAdmin from "@/components/admin/RequireAdmin";

/**
 * Pathless layout for every authenticated CMS screen. Keeping the auth gate and
 * <AdminShell> here means the sidebar/topbar stay mounted across navigations —
 * only the <Outlet /> content swaps.
 */
export const Route = createFileRoute("/sterova-admin/_cms")({
  component: CmsLayout,
});

function CmsLayout() {
  return (
    <RequireAdmin>
      <Outlet />
    </RequireAdmin>
  );
}
