import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogManager from "./_components/BlogManager";
import type { BlogPost } from "@/types";

export const metadata: Metadata = { title: "Blog" };

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, author_name, published, published_at, created_at, updated_at, cover_image_url, tags, content, read_time_minutes, views, author_avatar_url")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const posts = await getPosts();
  return <BlogManager initialPosts={posts} />;
}
