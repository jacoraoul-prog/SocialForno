import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MarketingShell } from "@/components/marketing";
import { Button, Field, TextInput } from "@/components/ui";

export function AuthCard({ mode }: { mode: "accedi" | "registrati" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const title = mode === "accedi" ? "Accedi" : "Crea un account";
  const lead = mode === "accedi"
    ? "L’accesso non è ancora attivo. Questa è una demo: la password non viene inviata né salvata."
    : "La registrazione non è ancora attiva. Nessun account viene creato e la password non lascia questo browser.";

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setNotice("Per la prova scrivi un’email con la chiocciola e una password di almeno 6 caratteri. Non le useremo.");
      setReady(false);
      return;
    }
    setPassword("");
    setNotice(mode === "accedi"
      ? "Nessun accesso effettuato. Puoi comunque aprire la bacheca dimostrativa: i contenuti restano solo su questo dispositivo."
      : "Nessun account creato. Apri la demo e lavora sulla pizzeria di esempio, oppure cambia i dati del locale.");
    setReady(true);
  }

  return (
    <MarketingShell>
      <section className="mx-auto max-w-lg px-4 py-12">
        <p className="text-sm font-semibold text-flame">Demo · login non attivo</p>
        <h1 className="mt-2 font-display text-4xl">{title}</h1>
        <p className="mt-3 text-ink/75">{lead}</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl bg-paper p-5 ring-1 ring-ink/10" noValidate>
          <Field label="Email">
            <TextInput type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Password" hint="Resta nel campo del browser. Non la salviamo e non la inviamo.">
            <TextInput type="password" name="password" autoComplete={mode === "accedi" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Button type="submit" className="w-full">{mode === "accedi" ? "Prova ad accedere" : "Prova a registrarti"}</Button>
          {notice ? <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-6" role="status">{notice}</p> : null}
          {ready ? <Link to="/app" className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-cream">Apri la demo</Link> : null}
        </form>
      </section>
    </MarketingShell>
  );
}
