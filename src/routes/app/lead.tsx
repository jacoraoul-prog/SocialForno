import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, DemoBadge, Field, TextArea, TextInput } from "@/components/ui";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/content";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app/lead")({
  head: () => ({ meta: [{ title: "Lead — SocialForno" }] }),
  component: LeadPage,
});

function LeadPage() {
  const leads = useSocialForno((state) => state.leads);
  const addLead = useSocialForno((state) => state.addLead);
  const updateLead = useSocialForno((state) => state.updateLead);
  const removeLead = useSocialForno((state) => state.removeLead);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState<LeadStatus>("Da contattare");
  const [note, setNote] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !city.trim()) return;
    const handle = instagram.trim();
    addLead({
      id: crypto.randomUUID(),
      name: name.trim(),
      city: city.trim(),
      instagram: handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "",
      status,
      note: note.trim(),
      demo: false,
    });
    setOpen(false);
    toast.success("Lead salvato su questo dispositivo");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">Lead</h1>
      <Button type="button" onClick={() => setOpen((value) => !value)}>{open ? "Chiudi" : "Aggiungi lead"}</Button>
      <p>Integrazione bot in arrivo. In futuro questa lista potrà arrivare da un foglio Google o da un’API. Oggi i lead restano solo su questo dispositivo.</p>
      <p>I locali già in elenco sono dimostrativi: non sono clienti reali e non sono stati contattati.</p>
      {open ? (
        <form onSubmit={onSubmit}>
          <Field label="Nome del locale"><TextInput value={name} onChange={(event) => setName(event.target.value)} required /></Field>
          <Field label="Città"><TextInput value={city} onChange={(event) => setCity(event.target.value)} required /></Field>
          <Field label="Instagram"><TextInput value={instagram} onChange={(event) => setInstagram(event.target.value)} placeholder="@nomelocale" /></Field>
          <Field label="Stato">
            <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>
              {LEAD_STATUSES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Nota"><TextArea value={note} onChange={(event) => setNote(event.target.value)} /></Field>
          <Button type="submit">Salva lead</Button>
        </form>
      ) : null}
      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            <h2>{lead.name}</h2>
            <p>{lead.city}{lead.instagram ? ` · ${lead.instagram}` : ""}</p>
            {lead.demo ? <DemoBadge>Demo</DemoBadge> : null}
            {lead.note ? <p>{lead.note}</p> : null}
            <select value={lead.status} onChange={(event) => updateLead(lead.id, { status: event.target.value as LeadStatus })}>
              {LEAD_STATUSES.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button type="button" onClick={() => { if (window.confirm("Togliere questo lead?")) removeLead(lead.id); }}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
