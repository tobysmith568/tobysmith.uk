export class BlogPageObject {
  visit() {
    cy.visit("/blog");
  }

  getTitle() {
    return cy.get("h1");
  }

  getBlogPosts() {
    return cy.get("article");
  }

  getRssLink() {
    return cy.get("a.rss");
  }
}
