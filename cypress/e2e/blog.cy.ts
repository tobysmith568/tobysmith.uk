import dayjs, { Dayjs } from "dayjs";
import { BlogPageObject } from "../page-objects/blog.po";

describe("Blog Page", () => {
  const blogPage = new BlogPageObject();

  it("should have the correct meta tags", () => {
    blogPage.visit();

    blogPage.meta.getTitle().should("equal", "Blog Posts - Toby Smith");
    blogPage.meta
      .getMetaDescription()
      .should("equal", "Blog posts written by Toby about things he creates or finds interesting.");
  });

  it("should display the blog page", () => {
    blogPage.visit();

    const title = blogPage.getTitle();

    title.should("exist").and("contain.text", "Blog");
  });

  it("should display the blog posts", () => {
    blogPage.visit();

    const blogPosts = blogPage.getBlogPosts();

    blogPosts.should("have.length.greaterThan", 0);
  });

  it("should display the blog posts in time order", () => {
    blogPage.visit();

    const blogPosts = blogPage.getBlogPosts();

    let previousDate: Dayjs | null = null;
    blogPosts.each(post => {
      const date = dayjs(post.find("time").text());

      if (previousDate) {
        expect(date.diff(previousDate)).to.be.lessThan(0);
      }

      previousDate = date;
    });
  });

  it("should navigate to the correct blog post page", () => {
    blogPage.visit();

    const blogPosts = blogPage.getBlogPosts();

    blogPosts.last().find("a").should("have.attr", "href", "/blog/graduated");
  });

  it("should display the RSS link", () => {
    blogPage.visit();

    const rssLink = blogPage.getRssLink();

    rssLink.should("exist").and("have.attr", "href", "/blog/rss.xml");
  });
});
