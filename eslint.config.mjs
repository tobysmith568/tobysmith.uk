import eslintPluginAstro from "eslint-plugin-astro";
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
      // Conventional pattern for intentionally-unused callback params (cypress.config.ts,
      // rss.xml.ts).
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
    // Chai's getter-style assertions (e.g. `.to.exist`) read as unused expressions to this rule.
    files: ["cypress/**"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off"
    }
  }
];
