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

  /** The frontmatter block's `name` value (always the first row) - see `Index/Hero.astro`. */
  get frontmatterName(): Locator {
    return this.page.locator(".frontmatter .row").first().locator("dd");
  }

  /**
   * The visually-animated role value - decorative (`aria-hidden`), cycles once through the old
   * rotating job titles before settling on the real one. See `Index/Hero.astro`.
   */
  get roleCycle(): Locator {
    return this.page.locator("#role-cycle");
  }

  /** The always-correct, non-animated screen-reader text for the role field. */
  get roleAccessibleName(): Locator {
    return this.page.locator(".frontmatter .sr-only");
  }

  /** The frontmatter key/value block - hovering it flicks the role to a random quip. */
  get frontmatter(): Locator {
    return this.page.locator(".frontmatter");
  }

  get profilePicture(): Locator {
    return this.page.locator("img.avatar");
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
