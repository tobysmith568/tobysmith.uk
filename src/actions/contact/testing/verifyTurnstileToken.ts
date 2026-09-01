import { verifyTurnstileToken as verifyReal } from "../verifyTurnstileToken";

/**
 * E2E-only stand-in for the real Turnstile verifier. The `e2e-contact-stubs` Vite plugin in
 * astro.config.mjs swaps this in for `../verifyTurnstileToken` - but ONLY when the build runs
 * with `E2E=true` (the Playwright webServer sets it), never in a production build.
 *
 * A token of exactly `e2e-turnstile-fail` forces the failure branch (the Playwright spec swaps
 * the widget-issued token for this value in-flight, simulating an expired/forged token).
 * Anything else delegates to the real verifier, which - under the always-passes test secret -
 * still makes a real siteverify call and returns success.
 */
export const verifyTurnstileToken: typeof verifyReal = (token, turnstile) => {
  if (token === "e2e-turnstile-fail") {
    return Promise.resolve({
      success: false,
      error: JSON.stringify({ turnstileErrorCodes: ["e2e-forced-failure"] })
    });
  }

  return verifyReal(token, turnstile);
};
