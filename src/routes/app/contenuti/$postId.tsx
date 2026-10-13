import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PostPanel } from "@/components/post-panel";
import { buttonClasses } from "@/components/ui";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app/contenuti/$postId")({
  head: () => ({ meta: [{ title: "Bozza — SocialForno" }] }),
  component: PostPage,
});

function PostPage() {
  const { postId } = Route.useParams();
  const navigate = useNavigate();
  const post = useSocialForno((state) => state.posts.find((item) => item.id === postId));
  if (!post) {
    return (
      <div>
        <h1 className="font-display text-4xl">Bozza non trovata</h1>
        <Link to="/app/contenuti" className={buttonClasses("ink")}>Torna ai miei post</Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/app/contenuti">I miei post</Link>
      <PostPanel post={post} onVersion={(id) => { void navigate({ to: "/app/contenuti/$postId", params: { postId: id } }); }} />
    </div>
  );
}
