import { GraduatedBlogPostPageObject } from "../../page-objects/blog-posts/graduated.po";

describe("Graduated Blog Post", () => {
  const blogPostPage = new GraduatedBlogPostPageObject();

  it("should have the correct meta tags", () => {
    blogPostPage.visit();

    blogPostPage.meta.getTitle().should("equal", "I Graduated! - Toby Smith");
    blogPostPage.meta
      .getMetaDescription()
      .should(
        "equal",
        "After four years at The University of Plymouth, I have graduated with First-Class Honours!"
      );
  });

  it("should display the back link", () => {
    blogPostPage.visit();

    const backLink = blogPostPage.getBackLink();

    backLink.should("exist").and("contain.text", "Posts").and("have.attr", "href", "/blog");
  });

  it("should display the title", () => {
    blogPostPage.visit();

    const title = blogPostPage.getTitle();

    title.should("exist").and("contain.text", "I Graduated!");
  });

  it("should display the post date", () => {
    blogPostPage.visit();

    const date = blogPostPage.getDate();

    date.should("exist").and("have.text", "01 Jul 2020");
  });

  it("should display the content", () => {
    blogPostPage.visit();

    const content = blogPostPage.getContent();

    content
      .should("exist")
      .and(
        "contain.text",
        "After four years at The University of Plymouth, I have graduated with First-Class Honours!"
      );
  });
});
