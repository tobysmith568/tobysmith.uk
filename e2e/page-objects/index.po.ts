import type { Locator, Page } from "@playwright/test";
import { ContactFormPageObject } from "./contact-form.po";
import { MetaPageObject } from "./meta.po";

export class IndexPageObject {
  readonly meta: MetaPageObject;
  readonly form: ContactFormPageObject;

  constructor(private readonly page: Page) {
    this.meta = new MetaPageObject(page);
    this.form = new ContactFormPageObject(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  get title(): Locator {
    return this.page.locator("h1");
  }

  get subtitle(): Locator {
    return this.page.locator("h2.tagline");
  }

  get tagLine(): Locator {
    return this.page.locator("#tag");
  }

  get profilePicture(): Locator {
    return this.page.locator("img.profile-pic");
  }

  get aboutHeading(): Locator {
    return this.page.locator("#about h2");
  }

  get contactHeading(): Locator {
    return this.page.locator("#contact h2");
  }

  get contactMessage(): Locator {
    return this.page.locator("#contact p").first();
  }
}
