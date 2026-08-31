import { expect, test } from "@playwright/test";
import { NotFoundPageObject } from "./page-objects/not-found.po";

test.describe("404 Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const notFoundPage = new NotFoundPageObject(page);
    await notFoundPage.goto();

    expect(await notFoundPage.meta.title()).toBe("404 - Toby Smith");
    expect(await notFoundPage.meta.description()).toBe("404: Page not found");
  });

  test("should display the # 404 marker in the gutter", async ({ page }) => {
    const notFoundPage = new NotFoundPageObject(page);
    await notFoundPage.goto();

    await expect(notFoundPage.marker).toHaveText("404");
  });

  test("should display the title", async ({ page }) => {
    const notFoundPage = new NotFoundPageObject(page);
    await notFoundPage.goto();

    await expect(notFoundPage.title).toHaveText("This page doesn't exist");
  });

  test("should link back to the homepage", async ({ page }) => {
    const notFoundPage = new NotFoundPageObject(page);
    await notFoundPage.goto();

    await expect(notFoundPage.homeLink).toHaveAttribute("href", "/");
  });
});
