import type { MetadataRoute } from "next";

// Alpha: keep the *.vercel.app deployment out of search results entirely.
// Flip this to an allow rule once the app moves to its real domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
