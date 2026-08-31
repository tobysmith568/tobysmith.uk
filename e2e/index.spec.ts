import { expect, test } from "@playwright/test";
import { IndexPageObject } from "./page-objects/index.po";

test.describe("Index", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    expect(await indexPage.meta.title()).toBe("Toby Smith");
    expect(await indexPage.meta.description()).toBe(
      "Toby Smith is a London-based Senior Software Engineer, focusing on web stacks."
    );
  });

  test("should render the home page", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.title).toContainText("Builds developer tools");
    await expect(indexPage.frontmatterName).toHaveText("Toby Smith");
  });

  test("should cycle the role once and settle on the real title", async ({ page }) => {
    const indexPage = new IndexPageObject(page);

    await page.clock.install();
    await indexPage.goto();

    // Before the load-in moment finishes, it's still the initial static value.
    await expect(indexPage.roleCycle).toHaveText("Full-stack developer");

    await page.clock.fastForward(1040);
    await expect(indexPage.roleCycle).toHaveText("npm package author");

    await page.clock.fastForward(620);
    await expect(indexPage.roleCycle).toHaveText("Bun runtime adopter");

    await page.clock.fastForward(620);
    await expect(indexPage.roleCycle).toHaveText("Burrito over-filler");

    await page.clock.fastForward(620);
    await expect(indexPage.roleCycle).toHaveText("Senior Software Developer");

    // The cycle is one-shot: once settled it stays on the real title, it doesn't loop.
    await page.clock.fastForward(5000);
    await expect(indexPage.roleCycle).toHaveText("Senior Software Developer");
  });

  test("should flick the role to a quip while the frontmatter is hovered, then reset", async ({
    page
  }) => {
    const indexPage = new IndexPageObject(page);

    await page.clock.install();
    await indexPage.goto();

    // Let the load-in cycle finish - the hover behaviour is only armed once it has.
    await page.clock.fastForward(5000);
    await expect(indexPage.roleCycle).toHaveText("Senior Software Developer");

    await indexPage.frontmatter.hover();
    await page.clock.fastForward(200);
    await expect(indexPage.roleCycle).toHaveText(
      /^(Full-stack developer|npm package author|Bun runtime adopter|Burrito over-filler)$/
    );
    // The real title is still the one exposed to assistive tech.
    await expect(indexPage.roleAccessibleName).toHaveText("Senior Software Developer");

    await page.mouse.move(0, 0);
    await page.clock.fastForward(200);
    await expect(indexPage.roleCycle).toHaveText("Senior Software Developer");
  });

  test("should always expose the real title to screen readers, animation aside", async ({
    page
  }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.roleAccessibleName).toHaveText("Senior Software Developer");
  });

  test("should show the real title immediately when reduced motion is preferred", async ({
    browser
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const indexPage = new IndexPageObject(page);

    await indexPage.goto();
    await expect(indexPage.roleCycle).toHaveText("Senior Software Developer");

    await context.close();
  });

  test("should load the profile picture", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.profilePicture).toBeVisible();

    const naturalWidth = await indexPage.profilePicture.evaluate(
      img => (img as HTMLImageElement).naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("should display the about section", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.aboutHeading).toContainText("About Me");
  });

  test("should display the contact section", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.contactHeading).toContainText("Contact Me");
    await expect(indexPage.contactMessage).toContainText("Send a message below");
  });

  test("should display the full contact form", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.form.nameInput).toBeVisible();
    await expect(indexPage.form.emailInput).toBeVisible();
    await expect(indexPage.form.messageInput).toBeVisible();
    await expect(indexPage.form.submitButton).toBeVisible();
  });

  test("should show the submit button as disabled when the form is empty", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.form.submitButton).toBeDisabled();
  });

  test("should enable the submit button when the form is filled out", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await indexPage.form.fillOut({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    await expect(indexPage.form.submitButton).toBeEnabled();
  });
});
