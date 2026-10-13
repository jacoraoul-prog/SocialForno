import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Download, Files, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DemoBadge, buttonClasses } from "@/components/ui";
import { captionOf, formatLabel, formatWhen, slugify, type Post } from "@/lib/content";
import { copyText, downloadImage } from "@/lib/download";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app/contenuti/")({
  head: () => ({ meta: [{ title: "I miei post — SocialForno" }] }),
  component: Contenuti,
});

function Contenuti() {
  const posts = useSocialForno((state) => state.posts);
  const duplicatePost = useSocialForno((state) => state.duplicatePost);
  const removePost = useSocialForno((state) => state.removePost);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl">I miei post</h1>
      <Link to="/app/genera" className={buttonClasses("primary")}>Genera nuovo</Link>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id} className="overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/10">
            <Link to="/app/contenuti/$postId" params={{ postId: post.id }}>
              {post.images[0] ? <img src={post.images[0].src} alt="" className="aspect-square w-full object-cover" /> : <span>Senza foto</span>}
              <span className="block p-4 font-display text-2xl">{post.piatto}</span>
              <span className="block px-4 text-sm text-ink/60">{formatWhen(post.updatedAt)} · {formatLabel(post.formato)} · {post.social}</span>
              {post.demo ? <DemoBadge>Demo</DemoBadge> : null}
            </Link>
            <button type="button" onClick={() => void copyText(captionOf(post)).then(() => toast.success("Testo copiato"))}><Copy className="size-4" /> Copia testo</button>
            <button type="button" disabled={!post.images[0]} onClick={() => post.images[0] && void downloadImage(post.images[0].src, `socialforno-${slugify(post.piatto)}.jpg`)}><Download className="size-4" /> Scarica</button>
            <button type="button" onClick={() => { duplicatePost(post.id); toast.success("Bozza duplicata"); }}><Files className="size-4" /> Duplica</button>
            <button type="button" onClick={() => { if (window.confirm("Eliminare questa bozza?")) removePost(post.id); }}><Trash2 className="size-4" /> Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
