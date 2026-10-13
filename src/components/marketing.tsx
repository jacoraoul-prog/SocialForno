import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui";

export function MarketingShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="/#come-funziona" className="hover:text-flame-deep">Come funziona</a>
            <Link to="/prezzi" className="hover:text-flame-deep">Prezzi</Link>
            <Link to="/accedi" className="hover:text-flame-deep">Accedi</Link>
            <Link to="/registrati" className={buttonClasses("primary")}>Inizia</Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/registrati" className={buttonClasses("primary")}>Inizia</Link>
            <button type="button" className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-ink/15" aria-expanded={open} aria-label={open ? "Chiudi menu" : "Apri menu"} onClick={() => setOpen((value) => !value)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <nav className="flex flex-col gap-1 border-t border-ink/10 px-4 py-3 text-base font-medium md:hidden">
            <a href="/#come-funziona" className="min-h-11 py-2" onClick={() => setOpen(false)}>Come funziona</a>
            <Link to="/prezzi" className="min-h-11 py-2" onClick={() => setOpen(false)}>Prezzi</Link>
            <Link to="/accedi" className="min-h-11 py-2" onClick={() => setOpen(false)}>Accedi</Link>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
          <p>SocialForno – Demo</p>
          <p>Login e pagamenti non sono ancora collegati.</p>
        </div>
      </footer>
    </div>
  );
}
