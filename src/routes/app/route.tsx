import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useSocialForno } from "@/lib/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const hydrated = useSocialForno((state) => state.hydrated);
  const setHydrated = useSocialForno((state) => state.setHydrated);

  useEffect(() => {
    let live = true;
    void Promise.resolve(useSocialForno.persist.rehydrate()).finally(() => {
      if (live) setHydrated(true);
    });
    return () => {
      live = false;
    };
  }, [setHydrated]);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream px-6 text-center text-ink">
        <p className="font-display text-3xl">Social<span className="italic text-flame">Forno</span></p>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
