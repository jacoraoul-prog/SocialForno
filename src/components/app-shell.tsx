import { Link, useRouterState } from "@tanstack/react-router";
import { Flame, Images, LayoutDashboard, Store, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useSocialForno } from "@/lib/store";

const NAV = [
  { to: "/app", label: "Bacheca", short: "Bacheca", exact: true, icon: LayoutDashboard },
  { to: "/app/genera", label: "Genera", short: "Genera", exact: false, icon: Flame },
  { to: "/app/contenuti", label: "I miei post", short: "Post", exact: false, icon: Images },
  { to: "/app/lead", label: "Lead", short: "Lead", exact: false, icon: Users },
  { to: "/app/locale", label: "Locale", short: "Locale", exact: false, icon: Store },
] as const;

function isActive(pathname: string, to: string, exact: boolean) {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const warning = useSocialForno((state) => state.storageWarning);
  const dismiss = useSocialForno((state) => state.dismissWarning);

  return (
    <div className="min-h-dvh bg-cream text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-ink/10 md:flex md:flex-col md:px-4 md:py-6">
        <Logo to="/app" />
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={cn("flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium", active ? "bg-ink text-cream" : "text-ink hover:bg-cream-deep")}>
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/app/abbonamento" className={cn("mt-auto flex min-h-11 items-center rounded-2xl px-3 text-sm font-medium", pathname === "/app/abbonamento" ? "bg-ink text-cream" : "text-ink/70 hover:bg-cream-deep")}>
          Piano demo
        </Link>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16">
            <div className="md:hidden"><Logo to="/app" /></div>
            <p className="hidden text-sm text-ink/60 md:block">Bozze salvate solo su questo dispositivo</p>
            <Link to="/app/abbonamento" className={buttonClasses("secondary")}>Piano demo</Link>
          </div>
          <p className="bg-cream-deep px-4 py-2 text-center text-xs leading-5 text-ink">Demo. L’accesso e i pagamenti non sono ancora attivi.</p>
          {warning ? (
            <p className="flex items-center justify-between gap-3 bg-flame px-4 py-2 text-sm text-ink">
              <span>{warning}</span>
              <button type="button" className="font-semibold underline" onClick={dismiss}>Ok</button>
            </p>
          ) : null}
        </header>
        <div className="px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-10">
          {children}
          <p className="mt-12 text-center text-xs text-ink/50">SocialForno – Demo</p>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper md:hidden">
          <ul className="grid grid-cols-5">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-flame-deep" : "text-ink/70")}>
                    <Icon className="size-5" aria-hidden="true" />
                    {item.short}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
