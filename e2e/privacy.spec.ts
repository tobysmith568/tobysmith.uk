import { expect, test } from "@playwright/test";
import { PrivacyPageObject } from "./page-objects/privacy.po";

test.describe("Privacy Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const privacyPage = new PrivacyPageObject(page);
    await privacyPage.goto();

    expect(await privacyPage.meta.title()).toBe("Privacy Policy - Toby Smith");
    expect(await privacyPage.meta.description()).toBe("This privacy policy for tobysmith.uk");
  });

  test("should display the title", async ({ page }) => {
    const privacyPage = new PrivacyPageObject(page);
    await privacyPage.goto();

    await expect(privacyPage.title).toHaveText("Privacy Policy");
  });

  test("should display the last update sentence", async ({ page }) => {
    const privacyPage = new PrivacyPageObject(page);
    await privacyPage.goto();

    await expect(privacyPage.updateSentence).toBeVisible();
  });

  test("should display a back link to the homepage", async ({ page }) => {
    const privacyPage = new PrivacyPageObject(page);
    await privacyPage.goto();

    await expect(privacyPage.backLink).toHaveAttribute("href", "/");
  });

  test("should display the last-updated date in the gutter", async ({ page }) => {
    const privacyPage = new PrivacyPageObject(page);
    await privacyPage.goto();

    await expect(privacyPage.lastUpdated).toHaveText("30 Aug 2026");
    await expect(privacyPage.lastUpdated).toHaveAttribute("datetime", "2026-08-30");
  });
});
