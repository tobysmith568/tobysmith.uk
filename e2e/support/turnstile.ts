import type { Page } from "@playwright/test";

type TurnstileCallback = (token: string) => void;

interface FakeTurnstileWindow {
  turnstile?: unknown;
  onloadTurnstileCallback?: () => void;
}

/**
 * Neutralises Cloudflare Turnstile in the browser.
 *
 * The widget is a third-party script/iframe, not this site's code, and driving the real one
 * headlessly is unreliable - its challenge callback fires on its own schedule (and sometimes
 * not at all). This blocks the real script and installs a fake that keeps the exact contract
 * `ContactForm.astro` depends on: `turnstile.render()` with `execution: "execute"` stashes the
 * callback, `turnstile.execute()` invokes it with a token.
 *
 * Only the browser half is faked. The token still travels to the real `contact` Action, which
 * makes a genuine server-side siteverify call (against the always-passes test secret) unless a
 * spec swaps the token for the `e2e-turnstile-fail` sentinel.
 */
export async function stubTurnstile(page: Page): Promise<void> {
  // Serve the real API script as a no-op so its onload handler still fires harmlessly.
  await page.route("https://challenges.cloudflare.com/turnstile/**", route =>
    route.fulfill({ contentType: "text/javascript", body: "" })
  );

  // Runs before any page script, so `window.turnstile` is our fake by the time
  // ContactForm.astro's module assigns `window.onloadTurnstileCallback`.
  await page.addInitScript(() => {
    const w = window as Window & FakeTurnstileWindow;

    let callback: TurnstileCallback | undefined;

    w.turnstile = {
      render: (_container: unknown, options: { callback: TurnstileCallback }) => {
        callback = options.callback;
        return "e2e-turnstile-widget";
      },
      execute: () => callback?.("e2e-fake-token"),
      reset: () => {},
      remove: () => {}
    };

    // ContactForm.astro loads the API with `?onload=onloadTurnstileCallback`; the real script
    // would call that global once. Invoke it the moment the component assigns it instead.
    let onload: (() => void) | undefined;
    Object.defineProperty(w, "onloadTurnstileCallback", {
      configurable: true,
      get: () => onload,
      set: (fn: () => void) => {
        onload = fn;
        fn();
      }
    });
  });
}
