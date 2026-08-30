import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "./meta.po";

export class TermsPageObject {
  readonly meta: MetaPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/terms");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get updateSentence(): Locator {
    return this.page.getByText("Our Terms and Conditions were last updated on 17th March 2024.");
  }
}
