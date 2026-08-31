import { expect, test } from "@playwright/test";
import { CookiesPageObject } from "./page-objects/cookies.po";

test.describe("Cookies Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const cookiesPage = new CookiesPageObject(page);
    await cookiesPage.goto();

    expect(await cookiesPage.meta.title()).toBe("Cookies Policy - Toby Smith");
    expect(await cookiesPage.meta.description()).toBe("The cookies policy for tobysmith.uk");
  });

  test("should display the title", async ({ page }) => {
    const cookiesPage = new CookiesPageObject(page);
    await cookiesPage.goto();

    await expect(cookiesPage.title).toHaveText("Cookies Policy");
  });

  test("should display the last update sentence", async ({ page }) => {
    const cookiesPage = new CookiesPageObject(page);
    await cookiesPage.goto();

    await expect(cookiesPage.updateSentence).toBeVisible();
  });

  test("should display a back link to the homepage", async ({ page }) => {
    const cookiesPage = new CookiesPageObject(page);
    await cookiesPage.goto();

    await expect(cookiesPage.backLink).toHaveAttribute("href", "/");
  });

  test("should display the last-updated date in the gutter", async ({ page }) => {
    const cookiesPage = new CookiesPageObject(page);
    await cookiesPage.goto();

    await expect(cookiesPage.lastUpdated).toHaveText("30 Aug 2026");
    await expect(cookiesPage.lastUpdated).toHaveAttribute("datetime", "2026-08-30");
  });
});
