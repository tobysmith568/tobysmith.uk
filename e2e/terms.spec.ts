import { expect, test } from "@playwright/test";
import { TermsPageObject } from "./page-objects/terms.po";

test.describe("Terms Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const termsPage = new TermsPageObject(page);
    await termsPage.goto();

    expect(await termsPage.meta.title()).toBe("Terms & Conditions - Toby Smith");
    expect(await termsPage.meta.description()).toBe("The Terms & Conditions for tobysmith.uk");
  });

  test("should display the title", async ({ page }) => {
    const termsPage = new TermsPageObject(page);
    await termsPage.goto();

    await expect(termsPage.title).toHaveText("Terms and Conditions (“Terms”)");
  });

  test("should display the last update sentence", async ({ page }) => {
    const termsPage = new TermsPageObject(page);
    await termsPage.goto();

    await expect(termsPage.updateSentence).toBeVisible();
  });
});
