import { sendPlainTextEmail as sendReal } from "../sendPlainTextEmail";

/**
 * E2E-only stand-in for the real email sender. The `e2e-contact-stubs` Vite plugin in
 * astro.config.mjs swaps this in for `../sendPlainTextEmail` - but ONLY when the build runs
 * with `E2E=true` (the Playwright webServer sets it), never in a production build.
 *
 * A message containing the marker `[e2e:send-fail]` forces the failure branch (the Playwright
 * spec types that marker into the message field). Anything else delegates to the real sender,
 * which under `wrangler dev` writes a real `.eml` to `.wrangler/tmp/` via the local `SEB`
 * binding and returns success.
 */
export const sendPlainTextEmail: typeof sendReal = (fromName, subject, message, email, seb) => {
  if (message.includes("[e2e:send-fail]")) {
    return Promise.resolve({ success: false, error: "E2E forced email failure" });
  }

  return sendReal(fromName, subject, message, email, seb);
};
