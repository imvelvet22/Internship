export default defineNuxtConfig({
  ssr: false,
  modules: [],
  compatibilityDate: "2025-03-23",

  // ⚡ Critical for Ant Design Vue 4.x
  css: ['ant-design-vue/dist/reset.css'], // Uses reset.css in v4+

  // Optional: For custom theme (LESS variables)
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: { // Override Ant Design variables here
            'primary-color': '#3366FF', // Example customization
          },
        },
      },
    },
  }
})