import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PostPanel } from "@/components/post-panel";
import { Button, ChoiceGroup, DemoBadge, Field, TextArea, TextInput } from "@/components/ui";
import { cn } from "@/lib/cn";
import { FORMATS, GOALS, SOCIALS, TONES, type DraftFields } from "@/lib/content";
import { shrinkUpload } from "@/lib/reference";
import { useSocialForno } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";

export const Route = createFileRoute("/app/genera")({
  head: () => ({ meta: [{ title: "Genera — SocialForno" }] }),
  component: Genera,
});

function Genera() {
  const restaurant = useSocialForno((state) => state.restaurant);
  const addPhoto = useSocialForno((state) => state.addPhoto);
  const [fields, setFields] = useState<DraftFields>({
    obiettivo: "Piatto del giorno",
    piatto: restaurant.demo ? "Margherita del forno" : "",
    tono: "Amichevole",
    social: "Instagram",
    note: "",
    formato: "1:1",
    referenceId: restaurant.photos[0]?.id ?? "",
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useSocialForno((state) => state.posts.find((item) => item.id === activeId));
  const { busy, error, createPost } = useGenerate();
  const selected = restaurant.photos.find((photo) => photo.id === fields.referenceId);

  function set<K extends keyof DraftFields>(key: K, value: DraftFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fields.piatto.trim()) return;
    const id = await createPost(fields);
    if (id) setActiveId(id);
  }

  async function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const src = await shrinkUpload(file);
      const id = crypto.randomUUID();
      addPhoto({ id, name: file.name, src });
      set("referenceId", id);
      toast.success("Foto pronta come riferimento");
    } catch {
      toast.error("Non sono riuscito a leggere la foto.");
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onSubmit} className="space-y-5">
        <h1 className="font-display text-4xl">Nuovo contenuto</h1>
        <ChoiceGroup label="Obiettivo del post" value={fields.obiettivo} options={GOALS} onChange={(value) => set("obiettivo", value)} />
        <Field label="Piatto o promozione principale">
          <TextInput value={fields.piatto} onChange={(event) => set("piatto", event.target.value)} required />
        </Field>
        <ChoiceGroup label="Tono" value={fields.tono} options={TONES} onChange={(value) => set("tono", value)} />
        <ChoiceGroup label="Social di destinazione" value={fields.social} options={SOCIALS} onChange={(value) => set("social", value)} />
        <ChoiceGroup
          label="Formato dell’immagine"
          value={FORMATS.find((item) => item.id === fields.formato)?.label ?? "Quadrato"}
          options={FORMATS.map((item) => item.label)}
          onChange={(label) => set("formato", FORMATS.find((item) => item.label === label)?.id ?? "1:1")}
        />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Foto di riferimento</legend>
          <button type="button" aria-pressed={!fields.referenceId} onClick={() => set("referenceId", "")}>Nessuna</button>
          {restaurant.photos.map((photo) => (
            <button key={photo.id} type="button" aria-pressed={fields.referenceId === photo.id} onClick={() => set("referenceId", photo.id)} className={cn(fields.referenceId === photo.id && "ring-2 ring-flame")}>
              <img src={photo.src} alt={photo.name} className="size-16 object-cover" />
            </button>
          ))}
          {selected ? <p>Riferimento attivo: {selected.name}</p> : <p>Nessun riferimento: la foto sarà inventata dal piatto.</p>}
          <label>
            Carica una foto
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => { void onUpload(event.target.files); event.target.value = ""; }} />
          </label>
        </fieldset>
        <Field label="Note aggiuntive" hint="Facoltativo. Prezzi, orari o via solo se li scrivi tu.">
          <TextArea value={fields.note} onChange={(event) => set("note", event.target.value)} />
        </Field>
        <Button type="submit" disabled={busy !== null || !fields.piatto.trim()}>
          {busy === "testo" ? "Scrivo la didascalia…" : busy === "foto" ? "Preparo la foto…" : "Genera contenuto"}
        </Button>
      </form>
      <div id="risultato">
        {error ? <p role="alert">{error}</p> : null}
        {active ? (
          <PostPanel post={active} showLibraryLink pendingImage={busy === "foto"} onVersion={setActiveId} />
        ) : (
          <p>Qui comparirà la bozza. Testo e foto restano insieme.</p>
        )}
        {restaurant.demo && active ? <DemoBadge>Generato sull’esempio demo</DemoBadge> : null}
      </div>
    </div>
  );
}
