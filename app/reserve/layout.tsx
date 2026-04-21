import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réserver | Paintball Sousse — Tactical Command",
  description:
    "Entrez dans l'arène : choisissez la date, votre escouade et votre classe. Réservation Paintball Sousse, Sousse Tunisie.",
};

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
