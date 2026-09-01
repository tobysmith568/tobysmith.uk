import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "../meta.po";

export class GraduatedBlogPostPageObject {
  readonly meta: MetaPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/blog/graduated");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get date(): Locator {
    return this.page.locator("time");
  }

  get content(): Locator {
    return this.page.locator("div.prose");
  }

  get backLink(): Locator {
    return this.page.locator("a.back");
  }
}
