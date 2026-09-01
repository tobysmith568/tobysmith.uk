import { expect, test } from "@playwright/test";
import { GraduatedBlogPostPageObject } from "../page-objects/blog-posts/graduated.po";

test.describe("Graduated Blog Post", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const blogPostPage = new GraduatedBlogPostPageObject(page);
    await blogPostPage.goto();

    expect(await blogPostPage.meta.title()).toBe("I Graduated! - Toby Smith");
    expect(await blogPostPage.meta.description()).toBe(
      "After four years at The University of Plymouth, I have graduated with First-Class Honours!"
    );
  });

  test("should display the back link", async ({ page }) => {
    const blogPostPage = new GraduatedBlogPostPageObject(page);
    await blogPostPage.goto();

    await expect(blogPostPage.backLink).toContainText("Posts");
    await expect(blogPostPage.backLink).toHaveAttribute("href", "/blog");
  });

  test("should display the title", async ({ page }) => {
    const blogPostPage = new GraduatedBlogPostPageObject(page);
    await blogPostPage.goto();

    await expect(blogPostPage.title).toContainText("I Graduated!");
  });

  test("should display the post date", async ({ page }) => {
    const blogPostPage = new GraduatedBlogPostPageObject(page);
    await blogPostPage.goto();

    await expect(blogPostPage.date).toHaveText("01 Jul 2020");
  });

  test("should display the content", async ({ page }) => {
    const blogPostPage = new GraduatedBlogPostPageObject(page);
    await blogPostPage.goto();

    await expect(blogPostPage.content).toContainText(
      "After four years at The University of Plymouth, I have graduated with First-Class Honours!"
    );
  });
});
