import { createFileRoute } from "@tanstack/react-router";
import PostEditor from "@/components/admin/PostEditor";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/posts/new")({
  head: () => privateSeo("New post · CMS"),
  component: () => <PostEditor />,
});
