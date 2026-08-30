import { expect, test } from "@playwright/test";
import { IndexPageObject } from "./page-objects/index.po";

test.describe("Index", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    expect(await indexPage.meta.title()).toBe("Toby Smith");
    expect(await indexPage.meta.description()).toBe(
      "Toby Smith is a London-based software developer who enjoys focusing on web-based technologies."
    );
  });

  test("should render the home page", async ({ page }) => {
    const indexPage = new IndexPageObject(page);
    await indexPage.goto();

    await expect(indexPage.title).toContainText("Toby Smith");
    await expect(indexPage.subtitle).toContainText("Blog and Portfolio Website");
  });

  test("should cycle through the tag lines", async ({ page }) => {
    const indexPage = new IndexPageObject(page);

    await page.clock.install();
    await indexPage.goto();

    await page.clock.fastForward(1000);
    await expect(indexPage.tagLine).toHaveText("Full-stack developer");

    await page.clock.fastForward(3000);
    await expect(indexPage.tagLine).toHaveText("npm package author");

    await page.clock.fastForward(3000);
    await expect(indexPage.tagLine).toHaveText("TypeScript fanatic");

    await page.clock.fastForward(3000);
    await expect(indexPage.tagLine).toHaveText("Burrito over-filler");

    await page.clock.fastForward(3000);
    await expect(indexPage.tagLine).toHaveText("Full-stack developer");
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
    await expect(indexPage.contactMessage).toContainText("Feel free to reach out me");
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
