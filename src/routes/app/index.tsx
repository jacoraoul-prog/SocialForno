import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonClasses, DemoBadge } from "@/components/ui";
import { formatWhen } from "@/lib/content";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Bacheca — SocialForno" }] }),
  component: Dashboard,
});

function Dashboard() {
  const restaurant = useSocialForno((state) => state.restaurant);
  const posts = useSocialForno((state) => state.posts);
  const leads = useSocialForno((state) => state.leads);
  const recent = posts.slice(0, 3);
  const toContact = leads.filter((lead) => lead.status === "Da contattare").length;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-ink/60">Bacheca</p>
      <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">{restaurant.name}</h1>
      <p className="mt-2 text-ink/70">{restaurant.city} · {restaurant.cuisine}</p>
      {restaurant.demo ? <p className="mt-4"><DemoBadge>Dati dimostrativi</DemoBadge></p> : null}
      <Link to="/app/genera" className={`${buttonClasses("primary")} mt-6 w-full text-base sm:w-auto`}>Genera nuovo contenuto</Link>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Ultimi contenuti</h2>
          <Link to="/app/contenuti" className="text-sm font-semibold underline decoration-flame underline-offset-4">Vedi tutti</Link>
        </div>
        <ul className="mt-4 space-y-3">
          {recent.map((post) => (
            <li key={post.id}>
              <Link to="/app/contenuti/$postId" params={{ postId: post.id }} className="flex gap-3 rounded-3xl bg-paper p-3 ring-1 ring-ink/10">
                {post.images[0] ? <img src={post.images[0].src} alt="" className="size-20 shrink-0 rounded-2xl object-cover" /> : <span className="grid size-20 place-items-center rounded-2xl bg-cream-deep text-xs">Senza foto</span>}
                <span className="min-w-0 py-1">
                  <span className="font-semibold">{post.piatto}</span>
                  <span className="mt-1 block truncate text-sm text-ink/60">{post.testo}</span>
                  <span className="mt-1 block text-xs text-ink/50">{post.social} · {formatWhen(post.updatedAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-3xl bg-paper p-5 ring-1 ring-ink/10">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl">Lead</h2>
          <Link to="/app/lead" className="text-sm font-semibold underline decoration-flame underline-offset-4">Apri elenco</Link>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/75">{leads.length} locali in elenco, {toContact} da contattare. Quelli già presenti sono dimostrativi, non clienti reali.</p>
        <p className="mt-2 text-sm font-medium">Integrazione bot in arrivo.</p>
      </section>
    </div>
  );
}
