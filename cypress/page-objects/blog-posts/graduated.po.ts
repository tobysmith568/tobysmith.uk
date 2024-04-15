export class GraduatedBlogPostPageObject {
  visit() {
    cy.visit("/blog/graduated");
  }

  getTitle() {
    return cy.get("h1");
  }

  getDate() {
    return cy.get("time");
  }

  getContent() {
    return cy.get("div.prose");
  }

  getBackLink() {
    return cy.get("a.back");
  }
}
