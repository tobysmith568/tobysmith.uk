import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "./meta.po";

export class ThirdPartyPageObject {
  readonly meta: MetaPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/third-party");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get generateLicenseFileCredit(): Locator {
    return this.page.getByText("This content was generated using the");
  }
}
