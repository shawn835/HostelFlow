// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRETE,
    jwtExpiry: process.env.JWT_EXPIRES_IN,
    NODE_ENV: process.env.NODE_ENV,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryName: process.env.CLOUDINARY_NAME,
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: ["@nuxt/hints", "@nuxt/icon", "vue-sonner/nuxt"],
});
