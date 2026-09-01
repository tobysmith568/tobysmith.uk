import type { Locator, Page } from "@playwright/test";

/** The theme toggle in the header (`Header.astro`) - a single button that cycles
 * system -> light -> dark -> system and shows the current state's icon. */
export class ThemePageObject {
  constructor(private readonly page: Page) {}

  get toggle(): Locator {
    return this.page.locator("[data-theme-toggle]");
  }

  /** The resolved theme: "dark", "light", or null when following the OS ("system"). */
  dataTheme(): Promise<string | null> {
    return this.page.locator("html").getAttribute("data-theme");
  }

  /** The chosen mode: "system" | "light" | "dark". */
  dataChoice(): Promise<string | null> {
    return this.page.locator("html").getAttribute("data-choice");
  }

  storedChoice(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem("theme"));
  }

  /** The computed page background - a cheap proxy for "which palette is live". */
  bodyBackground(): Promise<string> {
    return this.page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  }
}
