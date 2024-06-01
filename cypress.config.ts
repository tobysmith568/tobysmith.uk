import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    }
  }
});
