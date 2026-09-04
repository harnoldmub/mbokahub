import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirection vers le profil prestataire",
  robots: { index: false, follow: true },
};

export default function LegacyBeautyProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
