import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { CUISINES } from "@/lib/content";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app/locale")({
  head: () => ({ meta: [{ title: "Il mio locale — SocialForno" }] }),
  component: LocalePage,
});

function LocalePage() {
  const restaurant = useSocialForno((state) => state.restaurant);
  const setRestaurant = useSocialForno((state) => state.setRestaurant);
  const addPhoto = useSocialForno((state) => state.addPhoto);
  const removePhoto = useSocialForno((state) => state.removePhoto);
  const resetDemo = useSocialForno((state) => state.resetDemo);
  const [name, setName] = useState(restaurant.name);
  const [city, setCity] = useState(restaurant.city);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [description, setDescription] = useState(restaurant.description);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setRestaurant({ ...restaurant, name: name.trim(), city: city.trim(), cuisine, description: description.trim(), demo: false });
    toast.success("Locale salvato su questo dispositivo");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl">Il mio locale</h1>
      <p>Questi dati entrano nel testo dei prossimi post. Restano salvati solo su questo browser.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nome del ristorante"><TextInput value={name} onChange={(event) => setName(event.target.value)} required /></Field>
        <Field label="Città"><TextInput value={city} onChange={(event) => setCity(event.target.value)} required /></Field>
        <Field label="Tipo di cucina">
          <select value={cuisine} onChange={(event) => setCuisine(event.target.value)}>
            {CUISINES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Descrizione breve"><TextArea value={description} onChange={(event) => setDescription(event.target.value)} /></Field>
        <Button type="submit">Salva locale</Button>
      </form>
      <h2>Foto di riferimento</h2>
      <p>Se ne scegli una nel generatore, la usiamo come riferimento visivo.</p>
      {restaurant.photos.map((photo) => (
        <figure key={photo.id}>
          <img src={photo.src} alt={photo.name} />
          <button type="button" onClick={() => removePhoto(photo.id)}>Rimuovi</button>
        </figure>
      ))}
      <label>
        Carica foto
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => addPhoto({ id: crypto.randomUUID(), name: file.name, src: String(reader.result) });
          reader.readAsDataURL(file);
        }} />
      </label>
      <Button type="button" variant="secondary" onClick={() => { if (window.confirm("Ripristinare Da Mario?")) resetDemo(); }}>Ripristina Da Mario</Button>
    </div>
  );
}
