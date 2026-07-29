import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth-context";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin")({
  ssr: false,
  head: () => privateSeo("CMS"),
  component: AdminRootLayout,
});

function AdminRootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
