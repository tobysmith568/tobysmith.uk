import { defineConfig } from "cypress";
import setupPlugins from "./e2e/plugins";

export default defineConfig({
  viewportWidth: 1080,
  viewportHeight: 1080,
  downloadsFolder: "e2e/downloads",
  fixturesFolder: "e2e/fixtures",
  screenshotsFolder: "e2e/screenshots",
  videosFolder: "e2e/videos",
  defaultCommandTimeout: 6000,

  e2e: {
    setupNodeEvents: setupPlugins,

    baseUrl: "http://localhost:3000/",
    specPattern: "e2e/integration/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "e2e/support/e2e.ts"
  }
});
