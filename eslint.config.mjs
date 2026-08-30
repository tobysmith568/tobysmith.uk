import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPlaywright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", ".astro/**", "worker-configuration.d.ts"]
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    rules: {
      // Matches oxlint's own `correctness`-only scope (see docs/adrs/0001) - not an opinion this
      // repo holds beyond that.
      "@typescript-eslint/no-explicit-any": "off",
      // Conventional pattern for intentionally-unused callback params (rss.xml.ts).
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    // Astro's own idiomatic convention for wiring up ambient types - not fixable via `import`.
    files: ["src/env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off"
    }
  },
  {
    // playwright-community's plugin (recommended by Playwright's own docs; there's no
    // first-party alternative). Scoped to the E2E suite - its rules assume `test`/`expect`.
    ...eslintPluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.ts", "playwright.config.ts"]
  }
];
