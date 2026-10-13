import { Link, useNavigate } from "@tanstack/react-router";
import { Copy, Download, Files, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, DemoBadge, TextArea, TextInput } from "@/components/ui";
import { captionOf, formatLabel, formatWhen, frameClass, slugify, type Post } from "@/lib/content";
import { copyText, downloadImage } from "@/lib/download";
import { useSocialForno } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";

export function PostPanel({ post, showLibraryLink = false, pendingImage = false, onVersion }: { post: Post; showLibraryLink?: boolean; pendingImage?: boolean; onVersion?: (id: string) => void }) {
  const navigate = useNavigate();
  const updatePost = useSocialForno((state) => state.updatePost);
  const removePost = useSocialForno((state) => state.removePost);
  const { busy, error, left, regenerate, anotherVersion, addSecondImage } = useGenerate();
  const [editing, setEditing] = useState(false);
  const [testo, setTesto] = useState(post.testo);
  const [tags, setTags] = useState(post.hashtag.join(" "));

  useEffect(() => {
    setTesto(post.testo);
    setTags(post.hashtag.join(" "));
    setEditing(false);
  }, [post.id, post.updatedAt]);

  async function onCopy() {
    await copyText(captionOf(post));
    toast.success("Testo copiato");
  }

  function saveText() {
    const hashtag = tags.split(/[\s,]+/).map((tag) => tag.trim()).filter(Boolean).slice(0, 8).map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
    updatePost(post.id, { testo: testo.trim(), hashtag, updatedAt: new Date().toISOString() });
    setEditing(false);
  }

  async function onAnother() {
    const id = await anotherVersion(post);
    if (id) onVersion?.(id);
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/10">
      {post.images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className={`${frameClass(post.formato)} w-full object-cover`} />
      ))}
      {post.images.length === 0 ? <p>{pendingImage ? "Sto preparando la foto…" : "Nessuna foto in questa bozza."}</p> : null}
      <div className="space-y-4 p-5">
        {post.demo ? <DemoBadge>Esempio demo</DemoBadge> : <DemoBadge>Bozza</DemoBadge>}
        <p>{post.social} · {post.obiettivo} · {formatLabel(post.formato)} · {formatWhen(post.updatedAt)}</p>
        <h2 className="font-display text-3xl">{post.piatto}</h2>
        {post.fromReference ? <p>Foto guidata dal riferimento che hai scelto.</p> : null}
        {editing ? (
          <>
            <TextArea value={testo} onChange={(event) => setTesto(event.target.value)} />
            <TextInput value={tags} onChange={(event) => setTags(event.target.value)} />
            <Button type="button" onClick={saveText}>Salva testo</Button>
          </>
        ) : (
          <p className="whitespace-pre-line">{post.testo}</p>
        )}
        {error ? <p role="alert">{error}</p> : null}
        {left !== null ? <p>Generazioni demo rimaste: {left}</p> : null}
        <Button type="button" variant="secondary" onClick={() => setEditing(true)}><Pencil className="size-4" /> Modifica testo</Button>
        <Button type="button" variant="secondary" onClick={() => void regenerate(post)}><RefreshCw className="size-4" /> Rigenera</Button>
        <Button type="button" variant="secondary" onClick={() => void onAnother()}><Files className="size-4" /> Genera altra versione</Button>
        <Button type="button" variant="secondary" onClick={() => void onCopy()}><Copy className="size-4" /> Copia testo</Button>
        {post.images.map((image, index) => (
          <Button key={index} type="button" variant="ink" onClick={() => void downloadImage(image.src, `socialforno-\( {slugify(post.piatto)}- \){index + 1}.jpg`)}>
            <Download className="size-4" /> Scarica immagine
          </Button>
        ))}
        {post.images.length < 2 ? <Button type="button" variant="secondary" onClick={() => void addSecondImage(post)}>{busy === "foto" ? "Preparo la foto…" : "Seconda immagine"}</Button> : null}
        {showLibraryLink ? <Link to="/app/contenuti/$postId" params={{ postId: post.id }}>Apri nella libreria</Link> : <Link to="/app/contenuti">I miei post</Link>}
        <button type="button" onClick={() => { if (window.confirm("Eliminare questa bozza?")) { removePost(post.id); void navigate({ to: "/app/contenuti" }); } }}>
          <Trash2 className="size-4" /> Elimina
        </button>
      </div>
    </article>
  );
                                                                                                               }
