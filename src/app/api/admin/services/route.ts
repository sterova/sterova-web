import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest, writeAuditLog } from "@/lib/admin-auth";

export async function GET() {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, title, short_description, description, icon_name, features, technologies, display_order, is_active } = body;

  if (!slug || !title || !short_description || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("services")
    .insert({ slug, title, short_description, description, icon_name: icon_name || "Code2", features: features || [], technologies: technologies || [], display_order: display_order ?? 0, is_active: is_active ?? true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({ action: "services.create", resource: "services", resource_id: data.id, actor_email: session.email });
  return NextResponse.json(data, { status: 201 });
}
