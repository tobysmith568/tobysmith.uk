import type { Locator, Page } from "@playwright/test";

type FormData = {
  name?: string;
  email?: string;
  message?: string;
};

/**
 * The contact form rendered inside the index page's `#contact` section
 * (`src/components/Contact/ContactForm.astro`).
 */
export class ContactFormPageObject {
  constructor(private readonly page: Page) {}

  get nameInput(): Locator {
    return this.page.locator("input[name='name']");
  }

  get emailInput(): Locator {
    return this.page.locator("input[name='email']");
  }

  get messageInput(): Locator {
    return this.page.locator("textarea[name='message']");
  }

  get submitButton(): Locator {
    return this.page.locator("button[type='submit']");
  }

  get resultMessage(): Locator {
    return this.page.locator("#result-message");
  }

  /**
   * Waits for the Cloudflare Turnstile API to load. The submit button is only gated on the
   * text fields being filled (Alpine `x-bind:disabled`), so without this a fast test can click
   * submit before `window.turnstile` exists and `turnstile.execute()` throws before any
   * request is made. The invisible test widget renders no iframe until `execute()`, so the
   * API object's presence is the only pre-submit readiness signal available.
   */
  async waitUntilReady(): Promise<void> {
    await this.page.waitForFunction(
      () =>
        typeof (window as { turnstile?: { execute?: unknown } }).turnstile?.execute === "function"
    );
  }

  async fillOut({ name, email, message }: FormData): Promise<void> {
    if (name !== undefined) {
      await this.nameInput.fill(name);
    }

    if (email !== undefined) {
      await this.emailInput.fill(email);
    }

    if (message !== undefined) {
      await this.messageInput.fill(message);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
