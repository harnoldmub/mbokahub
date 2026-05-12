import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#F6F3EC",
    description:
      "Plateforme gratuite de mise en relation entre clients et prestataires.",
    display: "standalone",
    icons: [
      {
        sizes: "512x512",
        src: "/logo.png",
        type: "image/png",
      },
    ],
    name: "Mboka Hub",
    short_name: "Mboka",
    start_url: "/",
    theme_color: "#12715B",
  };
}
