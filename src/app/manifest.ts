import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#F6F3EC",
    description:
      "Événements afro, trajets, beauté, photo, services et afters en Europe.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    name: "Nevent",
    short_name: "Nevent",
    start_url: "/fr",
    theme_color: "#090909",
  };
}
