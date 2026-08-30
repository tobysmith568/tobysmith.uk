import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "./meta.po";

export class BlogPageObject {
  readonly meta: MetaPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/blog");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get blogPosts(): Locator {
    return this.page.locator("article");
  }

  get rssLink(): Locator {
    return this.page.locator("a.rss");
  }
}
