import sitemap from "@astrojs/sitemap";
import astroI18next from "astro-i18next";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          fr: "fr",
        },
      },
    }),
    astroI18next(),
  ],
});
