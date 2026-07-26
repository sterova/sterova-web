import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest, writeAuditLog } from "@/lib/admin-auth";

export async function GET() {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, role, company, content, rating, avatar_url, is_active, display_order } = body;

  if (!name || !role || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({ name, role, company: company || null, content, rating: rating ?? 5, avatar_url: avatar_url || null, is_active: is_active ?? true, display_order: display_order ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAuditLog({ action: "testimonials.create", resource: "testimonials", resource_id: data.id, actor_email: session.email });
  return NextResponse.json(data, { status: 201 });
}
