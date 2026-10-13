import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";

export const Route = createFileRoute("/accedi")({
  head: () => ({ meta: [{ title: "Accedi — SocialForno" }] }),
  component: () => <AuthCard mode="accedi" />,
});
