/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLanguage: "fr",
  supportedLanguages: ["fr", "en"],
  i18next: {
    debug: true,
    initImmediate: false,
    backend: {
      loadPath: "./src/locales/{{lng}}.json",
    },
  },
  i18nextPlugins: { fsBackend: "i18next-fs-backend" },
};