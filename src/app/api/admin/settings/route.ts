import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest, writeAuditLog } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest) {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const settings: Array<{ key: string; value: string }> = body.settings;

  if (!Array.isArray(settings)) {
    return NextResponse.json({ error: "Expected { settings: [{key, value}] }" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Upsert each key
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      settings.map(({ key, value }) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "key" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAuditLog({ action: "settings.update_bulk", resource: "site_settings", actor_email: session.email });
  return NextResponse.json({ ok: true });
}
