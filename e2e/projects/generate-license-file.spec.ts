import { expect, test } from "@playwright/test";
import { GenerateLicenseFileProjectPageObject } from "../page-objects/projects/generate-license-file.po";

test.describe("Generate License File Project", () => {
  const tagLine =
    "Generate a text file containing all of the licences for your production, third-party dependencies.";

  test("should have the correct meta tags", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    expect(await projectPage.meta.title()).toBe("Generate License File - Toby Smith");
    expect(await projectPage.meta.description()).toBe(tagLine);
  });

  test("should display the back link", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.backLink).toContainText("Projects");
    await expect(projectPage.backLink).toHaveAttribute("href", "/projects");
  });

  test("should display the image", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.details.image).toBeVisible();

    const naturalWidth = await projectPage.details.image.evaluate(
      img => (img as HTMLImageElement).naturalWidth
    );
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("should display the title", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.details.title).toContainText("Generate License File");
  });

  test("should display the tag line", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.details.tagLine).toContainText(tagLine);
  });

  test("should display the tags", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.details.tags).toHaveText(["typescript", "cli", "licensing"]);
  });

  test("should display the project links", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.details.links).toHaveText([/source/, /npm/, /site/]);
    await expect(projectPage.details.links.first()).toHaveAttribute(
      "href",
      "https://github.com/TobyAndToby/generate-license-file"
    );
    await expect(projectPage.details.links.first()).toHaveAttribute("target", "_blank");
  });

  test("should display the content", async ({ page }) => {
    const projectPage = new GenerateLicenseFileProjectPageObject(page);
    await projectPage.goto();

    await expect(projectPage.content).toContainText(
      "Using packages of software created by others is a great way to develop your projects"
    );
  });
});
