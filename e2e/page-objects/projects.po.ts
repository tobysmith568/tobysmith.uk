import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "./meta.po";

export class ProjectsPageObject {
  readonly meta: MetaPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/projects");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get projects(): Locator {
    return this.page.locator("article");
  }

  get tags(): Locator {
    return this.page.locator("article .tags li");
  }
}
