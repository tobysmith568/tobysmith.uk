import type { Locator, Page } from "@playwright/test";

/** Shared `<head>` metadata accessors, composed into every page object. */
export class MetaPageObject {
  constructor(private readonly page: Page) {}

  get metaDescription(): Locator {
    return this.page.locator('head meta[name="description"]');
  }

  title(): Promise<string> {
    return this.page.title();
  }

  description(): Promise<null | string> {
    return this.metaDescription.getAttribute("content");
  }
}
