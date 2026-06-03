import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Siteline",
    short_name: "Siteline",
    description: "Organize job site photos and documents by job.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7F4",
    theme_color: "#F8F7F4",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
