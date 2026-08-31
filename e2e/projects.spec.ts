import { expect, test } from "@playwright/test";
import { ProjectsPageObject } from "./page-objects/projects.po";

test.describe("Projects Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    expect(await projectsPage.meta.title()).toBe("My Projects - Toby Smith");
    expect(await projectsPage.meta.description()).toBe(
      "A selection of the projects Toby has been working on recently."
    );
  });

  test("should display the projects page", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    await expect(projectsPage.title).toContainText("Projects");
  });

  test("should display the projects", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    await expect(projectsPage.projects).toHaveCount(4);
  });

  test("should display tags for every project", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    for (const project of await projectsPage.projects.all()) {
      await expect(project.locator(".tags li").first()).toBeVisible();
    }
  });

  test("should display the projects in order", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    const projectTitles = ["Generate License File", "License Cop", "Which Node.JS", "Read Receipt"];

    for (const [index, projectTitle] of projectTitles.entries()) {
      await expect(projectsPage.projects.nth(index).locator("h2")).toContainText(projectTitle);
    }
  });

  test("should navigate to the project page", async ({ page }) => {
    const projectsPage = new ProjectsPageObject(page);
    await projectsPage.goto();

    const projectSlugs = ["generate-license-file", "license-cop", "which-node-js", "read-receipt"];

    for (const [index, slug] of projectSlugs.entries()) {
      await expect(projectsPage.projects.nth(index).locator("a")).toHaveAttribute(
        "href",
        `/projects/${slug}`
      );
    }
  });
});
