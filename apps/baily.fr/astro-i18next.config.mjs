/** @type {import('astro-i18next').AstroI18nextConfig} */
const config = {
  defaultLanguage: "fr",
  supportedLanguages: ["fr", "en"],
  i18next: {
    debug: false,
    initImmediate: false,
    backend: {
      loadPath: "./src/locales/{{lng}}.json",
    },
  },
  i18nextPlugins: { fsBackend: "i18next-fs-backend" },
};

export default config;
