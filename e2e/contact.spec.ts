import { expect, test } from "@playwright/test";

test.describe("Contact redirect", () => {
  test("should redirect /contact to /#contact", async ({ page }) => {
    await page.goto("/contact");

    const url = new URL(page.url());
    expect(url.pathname).toBe("/");
    expect(url.hash).toBe("#contact");
  });
});
