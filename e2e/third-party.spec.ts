import { expect, test } from "@playwright/test";
import { ThirdPartyPageObject } from "./page-objects/third-party.po";

test.describe("Third Party Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const thirdPartyPage = new ThirdPartyPageObject(page);
    await thirdPartyPage.goto();

    expect(await thirdPartyPage.meta.title()).toBe("Third-Party Content - Toby Smith");
    expect(await thirdPartyPage.meta.description()).toBe(
      "The Third-party content used by tobysmith.uk"
    );
  });

  test("should display the title", async ({ page }) => {
    const thirdPartyPage = new ThirdPartyPageObject(page);
    await thirdPartyPage.goto();

    await expect(thirdPartyPage.title).toHaveText("Third-party Content");
  });

  test("should display the generate license file credit", async ({ page }) => {
    const thirdPartyPage = new ThirdPartyPageObject(page);
    await thirdPartyPage.goto();

    await expect(thirdPartyPage.generateLicenseFileCredit).toBeVisible();
  });

  test("should display a back link to the homepage", async ({ page }) => {
    const thirdPartyPage = new ThirdPartyPageObject(page);
    await thirdPartyPage.goto();

    await expect(thirdPartyPage.backLink).toHaveAttribute("href", "/");
  });
});
