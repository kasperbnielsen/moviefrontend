// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  runtimeConfig: {
    public: { SERVER_HOST: process.env.NUXT_SERVER_HOST },
  },
});
