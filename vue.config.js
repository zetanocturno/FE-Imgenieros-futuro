const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // ← Agrega esta línea para deshabilitar ESLint
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json"],
    },
  },
});
