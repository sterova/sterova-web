import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest, writeAuditLog } from "@/lib/admin-auth";

export async function GET() {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, author_name, published, published_at, created_at, updated_at, cover_image_url, tags, content, read_time_minutes, views, author_avatar_url")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminRequest();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, excerpt, content, category, author_name, cover_image_url, tags, published, read_time_minutes } = body;

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title, slug, excerpt, content,
      category: category || "Engineering",
      author_name: author_name || "Sterova Team",
      cover_image_url: cover_image_url || null,
      tags: tags || [],
      published: published ?? false,
      published_at: published ? new Date().toISOString() : null,
      read_time_minutes: read_time_minutes ?? 5,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await writeAuditLog({ action: "blog.create", resource: "blog_posts", resource_id: data.id, actor_email: session.email });
  return NextResponse.json(data, { status: 201 });
}
