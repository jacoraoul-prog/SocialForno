import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: "/" | "/app" }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 text-ink">
      <img src="/favicon.svg" alt="" width={36} height={36} className="size-9" />
      <span className="font-display text-xl leading-none tracking-tight">
        Social<span className="italic text-flame">Forno</span>
      </span>
    </Link>
  );
}
