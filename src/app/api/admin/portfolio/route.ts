import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest, writeAuditLog } from "@/lib/admin-auth";

export async function GET() {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, category, description, tags, image_url, live_url, github_url, is_featured, is_active, display_order } = body;

  if (!title || !category || !description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({ title, category, description, tags: tags || [], image_url: image_url || null, live_url: live_url || null, github_url: github_url || null, is_featured: is_featured ?? false, is_active: is_active ?? true, display_order: display_order ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAuditLog({ action: "portfolio.create", resource: "portfolio_items", resource_id: data.id, actor_email: session.email });
  return NextResponse.json(data, { status: 201 });
}
