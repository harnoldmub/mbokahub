import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#0A0808",
    description:
      "Services pratiques pour le concert diaspora Paris 2026 au Stade de France, les 2 et 3 mai 2026.",
    display: "standalone",
    icons: [
      {
        sizes: "512x512",
        src: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
    name: "Mboka Hub",
    short_name: "Mboka",
    start_url: "/",
    theme_color: "#E50914",
  };
}
