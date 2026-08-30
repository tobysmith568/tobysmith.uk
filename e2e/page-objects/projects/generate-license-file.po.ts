import type { Locator, Page } from "@playwright/test";
import { MetaPageObject } from "../meta.po";

class ProjectDetailsPageObject {
  constructor(private readonly page: Page) {}

  private get details(): Locator {
    return this.page.locator("div.details");
  }

  get image(): Locator {
    return this.details.locator("img");
  }

  get title(): Locator {
    return this.details.locator("h1");
  }

  get tagLine(): Locator {
    return this.details.locator("p.tagline");
  }
}

export class GenerateLicenseFileProjectPageObject {
  readonly meta: MetaPageObject;
  readonly details: ProjectDetailsPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
    this.details = new ProjectDetailsPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/projects/generate-license-file");
  }

  get content(): Locator {
    return this.page.locator("div.prose");
  }

  get backLink(): Locator {
    return this.page.locator("a.back");
  }
}
