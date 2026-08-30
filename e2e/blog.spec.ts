import { expect, test } from "@playwright/test";
import dayjs from "dayjs";
import { BlogPageObject } from "./page-objects/blog.po";

test.describe("Blog Page", () => {
  test("should have the correct meta tags", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    expect(await blogPage.meta.title()).toBe("Blog Posts - Toby Smith");
    expect(await blogPage.meta.description()).toBe(
      "Blog posts written by Toby about things he creates or finds interesting."
    );
  });

  test("should display the blog page", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    await expect(blogPage.title).toContainText("Blog");
  });

  test("should display the blog posts", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    expect(await blogPage.blogPosts.count()).toBeGreaterThan(0);
  });

  test("should display the blog posts in time order", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    const times = await blogPage.blogPosts.locator("time").allInnerTexts();
    const timestamps = times.map(text => dayjs(text).valueOf());

    const sortedDescending = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sortedDescending);
  });

  test("should navigate to the correct blog post page", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    await expect(blogPage.blogPosts.last().locator("a")).toHaveAttribute("href", "/blog/graduated");
  });

  test("should display the RSS link", async ({ page }) => {
    const blogPage = new BlogPageObject(page);
    await blogPage.goto();

    await expect(blogPage.rssLink).toHaveAttribute("href", "/blog/rss.xml");
  });
});
