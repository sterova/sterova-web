import { createFileRoute } from "@tanstack/react-router";
import PostEditor from "@/components/admin/PostEditor";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/posts/$id")({
  head: () => privateSeo("Edit post · CMS"),
  component: () => <PostEditorRoute />,
});

function PostEditorRoute() {
  const { id } = Route.useParams();
  return <PostEditor postId={id} />;
}
