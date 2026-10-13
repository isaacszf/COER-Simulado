import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Public URL. Must match the Cloudflare Pages project name (<name>.pages.dev);
  // canonical links, Open Graph, the sitemap, robots.txt and llms.txt use it.
  site: "https://coer-simulado.pages.dev",
  output: "static",
  compressHTML: true,
  integrations: [sitemap()],
});
